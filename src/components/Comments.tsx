import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { MessageSquare, Send, Trash2, User, Lock } from 'lucide-react';
import { db } from '../lib/firebase';
import { CommentItem, UserProfile } from '../types';

interface CommentsProps {
  articleId: string;
  user: UserProfile | null;
  onOpenAuth: () => void;
}

export const Comments: React.FC<CommentsProps> = ({ articleId, user, onOpenAuth }) => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Subscribe to real-time comments for this article
  useEffect(() => {
    if (!articleId) return;

    const q = query(
      collection(db, 'comments'),
      where('articleId', '==', articleId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments: CommentItem[] = [];
      snapshot.forEach((doc) => {
        fetchedComments.push({
          id: doc.id,
          ...doc.data()
        } as CommentItem);
      });

      // Sort client side by createdAt descending
      fetchedComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setComments(fetchedComments);
    }, (error) => {
      console.error("Firestore comments snapshot error:", error);
    });

    return () => unsubscribe();
  }, [articleId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!user) {
      onOpenAuth();
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        articleId,
        userId: user.uid,
        userName: user.displayName || 'Pengguna HaloJatim',
        userAvatar: user.photoURL || '',
        text: newComment.trim(),
        createdAt: new Date().toISOString()
      });
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Gagal mengirim komentar. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus komentar ini?')) return;
    try {
      await deleteDoc(doc(db, 'comments', commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  return (
    <section className="mt-10 pt-8 border-t border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-6 h-6 text-[#001e40]" />
        <h3 className="text-xl font-bold text-[#001e40] font-display">
          Komentar Pembaca ({comments.length})
        </h3>
      </div>

      {/* Write Comment Box */}
      <div className="bg-slate-50 border border-slate-200 p-4 md:p-5 rounded-xl mb-8 shadow-sm">
        {user ? (
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-1">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-[#fe8028]" />
              )}
              <span>Tulis sebagai <strong>{user.displayName || user.email}</strong></span>
            </div>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Silakan tinggalkan komentar dengan sopan dan bijak..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-[#001e40] focus:ring-1 focus:ring-[#001e40] outline-none bg-white transition-all"
              required
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="bg-[#001e40] hover:bg-[#003366] text-white px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Mengirim...' : 'Kirim Komentar'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4 space-y-3">
            <Lock className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-sm text-gray-600 font-medium">
              Masuk dengan akun Google Anda untuk berdiskusi dan menulis komentar.
            </p>
            <button
              onClick={onOpenAuth}
              className="bg-[#fe8028] hover:bg-[#e06d19] text-white px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm inline-flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Masuk dengan Google</span>
            </button>
          </div>
        )}
      </div>

      {/* Comment List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm italic text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            Belum ada komentar pada berita ini. Jadilah yang pertama memberikan tanggapan!
          </p>
        ) : (
          comments.map((comment) => (
            <div 
              key={comment.id}
              className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex gap-3 items-start justify-between"
            >
              <div className="flex gap-3 items-start">
                {comment.userAvatar ? (
                  <img src={comment.userAvatar} alt={comment.userName} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#001e40] text-white flex items-center justify-center font-bold text-xs">
                    {comment.userName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900">{comment.userName}</span>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {new Date(comment.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-line leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              </div>

              {user && user.uid === comment.userId && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                  title="Hapus Komentar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
};
