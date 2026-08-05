import React, { useState, useEffect } from 'react';
import { ChevronRight, Calendar, User, Eye, Heart, Share2, Bookmark, BookmarkCheck, ArrowLeft, Clock, Pencil, Trash2 } from 'lucide-react';
import { doc, updateDoc, increment, collection, addDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Article, UserProfile } from '../types';
import { Comments } from './Comments';
import { AdBanner } from './AdBanner';

interface ArticleDetailProps {
  article: Article;
  allArticles: Article[];
  user: UserProfile | null;
  onBack: () => void;
  onSelectArticle: (article: Article) => void;
  onOpenAuth: () => void;
  onBookmarkChanged: () => void;
  onEdit: (article: Article) => void;
  onDeleted: () => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  allArticles,
  user,
  onBack,
  onSelectArticle,
  onOpenAuth,
  onBookmarkChanged,
  onEdit,
  onDeleted
}) => {
  const [likesCount, setLikesCount] = useState(article.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkDocId, setBookmarkDocId] = useState<string | null>(null);

  // Increment view count in Firestore on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const articleRef = doc(db, 'articles', article.id);
    updateDoc(articleRef, {
      views: increment(1)
    }).catch(err => console.error('Error incrementing view count:', err));
  }, [article.id]);

  // Check if article is bookmarked by user
  useEffect(() => {
    if (!user) {
      setIsBookmarked(false);
      setBookmarkDocId(null);
      return;
    }

    const q = query(
      collection(db, 'bookmarks'),
      where('userId', '==', user.uid),
      where('articleId', '==', article.id)
    );

    getDocs(q).then((snapshot) => {
      if (!snapshot.empty) {
        setIsBookmarked(true);
        setBookmarkDocId(snapshot.docs[0].id);
      } else {
        setIsBookmarked(false);
        setBookmarkDocId(null);
      }
    }).catch(err => console.error('Error checking bookmark:', err));
  }, [article.id, user]);

  const handleLike = async () => {
    if (hasLiked) return;
    setLikesCount(prev => prev + 1);
    setHasLiked(true);

    try {
      const articleRef = doc(db, 'articles', article.id);
      await updateDoc(articleRef, {
        likes: increment(1)
      });
    } catch (err) {
      console.error('Error liking article:', err);
    }
  };

  const handleToggleBookmark = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }

    try {
      if (isBookmarked && bookmarkDocId) {
        await deleteDoc(doc(db, 'bookmarks', bookmarkDocId));
        setIsBookmarked(false);
        setBookmarkDocId(null);
      } else {
        const docRef = await addDoc(collection(db, 'bookmarks'), {
          userId: user.uid,
          articleId: article.id,
          createdAt: new Date().toISOString()
        });
        setIsBookmarked(true);
        setBookmarkDocId(docRef.id);
      }
      onBookmarkChanged();
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan berita berhasil disalin ke papan klip!');
    }
  };

  const handleDeleteArticle = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }
    const confirmed = window.confirm(`Yakin mau hapus berita "${article.title}"? Tindakan ini tidak bisa dibatalkan.`);
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'articles', article.id));
      onDeleted();
    } catch (err) {
      console.error('Error deleting article:', err);
      alert('Gagal menghapus berita. Coba lagi.');
    }
  };

  const relatedArticles = allArticles
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button + Edit/Delete controls */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#001e40] hover:text-[#fe8028] bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-full transition-all cursor-pointer w-fit shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(article)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#001e40] hover:text-white bg-slate-100 hover:bg-[#001e40] px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-xs"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDeleteArticle}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus</span>
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#fe8028]">
        <span className="hover:underline cursor-pointer" onClick={onBack}>BERITA</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-bold">{article.category}</span>
      </div>

      {/* Header */}
      <header className="space-y-4">
        <h1 className="font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#001e40] leading-tight font-display tracking-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between text-xs text-gray-600 font-mono border-b border-gray-200 pb-3 gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-semibold text-gray-800">
              <User className="w-3.5 h-3.5 text-[#001e40]" /> Oleh: {article.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#fe8028]" /> 
              {new Date(article.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}, {new Date(article.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-amber-600" /> {article.views + 1} Pembaca
            </span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <figure className="w-full">
        <div className="relative rounded-xl overflow-hidden shadow-md bg-slate-900">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-auto max-h-[480px] object-cover" 
          />
        </div>
        {article.imageCaption && (
          <figcaption className="mt-2 text-xs text-gray-500 font-mono text-right italic">
            {article.imageCaption}
          </figcaption>
        )}
      </figure>

      {/* Article Content */}
      <article className="prose prose-slate max-w-none text-gray-800 text-base md:text-lg leading-relaxed space-y-5 font-sans">
        {article.content.split('\n\n').map((paragraph, index) => {
          // Check for quote formatting
          if (paragraph.startsWith('"') || paragraph.startsWith('“')) {
            return (
              <blockquote key={index} className="border-l-4 border-[#fe8028] pl-4 my-6 italic text-[#001e40] font-bold text-lg md:text-xl bg-amber-50/50 py-3 rounded-r-lg">
                {paragraph}
              </blockquote>
            );
          }
          return (
            <p key={index} className="text-gray-800 leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </article>

      {/* Tags and Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-y border-gray-200 my-8 bg-slate-50 p-4 rounded-xl">
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span key={tag} className="font-mono text-xs font-semibold text-gray-700 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-2xs">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              hasLiked 
                ? 'bg-rose-50 text-rose-600 border-rose-200' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-rose-50 hover:text-rose-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-600' : ''}`} />
            <span>{likesCount} Suka</span>
          </button>

          <button
            onClick={handleToggleBookmark}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              isBookmarked
                ? 'bg-[#fe8028]/10 text-[#fe8028] border-[#fe8028]/30'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:text-[#fe8028]'
            }`}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-[#fe8028]" /> : <Bookmark className="w-4 h-4" />}
            <span>{isBookmarked ? 'Tersimpan' : 'Simpan'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 bg-[#001e40] hover:bg-[#003366] text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>Bagikan</span>
          </button>
        </div>
      </div>

      {/* Ad Banner Billboard */}
      <AdBanner type="billboard" />

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg text-[#001e40] font-display mb-4 border-b-2 border-[#fe8028] pb-1.5 inline-block">
            Berita Terkait
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedArticles.map((rel) => (
              <div 
                key={rel.id}
                onClick={() => onSelectArticle(rel)}
                className="group cursor-pointer border border-slate-100 p-2.5 rounded-lg hover:shadow-md transition-all bg-slate-50/50"
              >
                <img 
                  src={rel.imageUrl} 
                  alt={rel.title}
                  className="w-full h-28 object-cover rounded-md mb-2 bg-slate-200 group-hover:scale-105 transition-transform" 
                />
                <h4 className="font-bold text-xs text-gray-900 group-hover:text-[#001e40] line-clamp-2 leading-snug">
                  {rel.title}
                </h4>
                <span className="text-[10px] text-gray-400 font-mono mt-1 block">
                  {new Date(rel.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Comments Section */}
      <Comments 
        articleId={article.id} 
        user={user} 
        onOpenAuth={onOpenAuth} 
      />
    </div>
  );
};
