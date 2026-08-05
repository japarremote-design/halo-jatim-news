/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { db, auth, onAuthStateChanged, firebaseSignOut } from './lib/firebase';
import { seedInitialArticlesIfEmpty } from './lib/seedData';
import { Article, CategoryType, UserProfile } from './types';

// Components
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoryGrid } from './components/CategoryGrid';
import { Sidebar } from './components/Sidebar';
import { ArticleDetail } from './components/ArticleDetail';
import { AuthModal } from './components/AuthModal';
import { ArticleEditorModal } from './components/ArticleEditorModal';
import { SearchOverlay } from './components/SearchOverlay';
import { AdBanner } from './components/AdBanner';
import { Footer } from './components/Footer';

export default function App() {
  const { id: articleIdParam } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'Semua'>('Semua');

  // Selected article is derived from the URL (/artikel/:id) instead of local
  // state, so every article has its own shareable, bookmarkable link.
  const selectedArticle = articleIdParam
    ? articles.find(a => a.id === articleIdParam) ?? null
    : null;

  const selectArticle = (article: Article) => navigate(`/artikel/${article.id}`);
  const goHome = () => navigate('/');

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [articleEditorOpen, setArticleEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);

  // Auth User & Bookmarks
  const [user, setUser] = useState<UserProfile | null>(null);
  const [bookmarkedArticleIds, setBookmarkedArticleIds] = useState<string[]>([]);

  // Seed initial data if Firestore is empty and listen for real-time updates
  useEffect(() => {
    // 1. Trigger initial seed check
    seedInitialArticlesIfEmpty();

    // 2. Listen to real-time articles stream from Firestore
    const articlesQuery = collection(db, 'articles');
    const unsubscribe = onSnapshot(articlesQuery, (snapshot) => {
      const fetched: Article[] = [];
      snapshot.forEach((docSnap) => {
        fetched.push({
          id: docSnap.id,
          ...docSnap.data()
        } as Article);
      });

      // Sort client-side by createdAt descending
      fetched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setArticles(fetched);
      setLoading(false);
    }, (error) => {
      console.error('Firestore articles stream error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          isAnonymous: currentUser.isAnonymous
        });
      } else {
        setUser(null);
        setBookmarkedArticleIds([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch bookmarks when user changes
  const fetchUserBookmarks = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'bookmarks'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const ids: string[] = [];
      snapshot.forEach((docSnap) => {
        ids.push(docSnap.data().articleId);
      });
      setBookmarkedArticleIds(ids);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserBookmarks();
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const bookmarkedArticles = articles.filter(a => bookmarkedArticleIds.includes(a.id));
  const heroArticle = articles.find(a => a.isHero) || articles[0];

  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] min-h-screen flex flex-col font-sans antialiased selection:bg-[#fe8028] selection:text-white">
      {/* Top Header Navigation */}
      <Header
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          goHome();
        }}
        onOpenSearch={() => setSearchOverlayOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenArticleEditor={() => {
          if (!user) {
            setAuthModalOpen(true);
          } else {
            setArticleEditorOpen(true);
          }
        }}
        onGoHome={() => goHome()}
        onOpenBookmarks={() => setAuthModalOpen(true)}
        user={user}
        onSignOut={handleSignOut}
        bookmarkCount={bookmarkedArticleIds.length}
      />

      {/* Main Body Content */}
      <div className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-6 relative mt-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-[#001e40] border-t-[#fe8028] rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-[#001e40] animate-pulse">
              Memuat Berita Terkini HALOJATIMNEWS...
            </p>
          </div>
        ) : selectedArticle ? (
          /* Article Detail View */
          <ArticleDetail
            article={selectedArticle}
            allArticles={articles}
            user={user}
            onBack={() => goHome()}
            onSelectArticle={selectArticle}
            onOpenAuth={() => setAuthModalOpen(true)}
            onBookmarkChanged={fetchUserBookmarks}
            onEdit={(art) => {
              setEditingArticle(art);
              setArticleEditorOpen(true);
            }}
            onDeleted={() => goHome()}
          />
        ) : (
          /* News Feed Portal View */
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Left Ad Skyscraper (Desktop view) */}
            <aside className="hidden lg:block w-[140px] flex-shrink-0">
              <AdBanner type="skyscraper" />
            </aside>

            {/* Main Center News Stream */}
            <main className="flex-grow w-full min-w-0">
              {/* Featured Hero Article */}
              {selectedCategory === 'Semua' && heroArticle && (
                <HeroSection
                  article={heroArticle}
                  onSelectArticle={selectArticle}
                />
              )}

              {/* Categorized News Grid */}
              <CategoryGrid
                articles={articles}
                selectedCategory={selectedCategory}
                onSelectArticle={selectArticle}
                onSelectCategory={(cat) => setSelectedCategory(cat)}
              />
            </main>

            {/* Right Ad Skyscraper (Desktop view) - mirrors the left one */}
            <aside className="hidden lg:block w-[140px] flex-shrink-0">
              <AdBanner type="skyscraper" />
            </aside>

            {/* Right Sidebar (300px) */}
            <aside className="w-full xl:w-[320px] flex-shrink-0">
              <Sidebar
                articles={articles}
                onSelectArticle={selectArticle}
              />
            </aside>
          </div>
        )}
      </div>

      {/* Bottom Horizontal Ad Billboard */}
      {!loading && (
        <div className="max-w-5xl mx-auto px-4 w-full">
          <AdBanner type="billboard" />
        </div>
      )}

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          goHome();
        }}
        onGoHome={() => goHome()}
      />

      {/* Modals & Overlays */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        user={user}
        bookmarkedArticles={bookmarkedArticles}
        onSelectArticle={selectArticle}
        onSignOut={handleSignOut}
      />

      <ArticleEditorModal
        isOpen={articleEditorOpen}
        articleToEdit={editingArticle}
        onClose={() => {
          setArticleEditorOpen(false);
          setEditingArticle(null);
        }}
        onSaved={() => {
          // Stream will auto update
          setEditingArticle(null);
        }}
      />

      <SearchOverlay
        isOpen={searchOverlayOpen}
        onClose={() => setSearchOverlayOpen(false)}
        articles={articles}
        onSelectArticle={selectArticle}
      />
    </div>
  );
}
