import React from 'react';
import { X, Plus, Newspaper, Pencil, Eye, EyeOff } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Article } from '../types';

interface ArticleManagerModalProps {
  isOpen: boolean;
  articles: Article[];
  onClose: () => void;
  onAddNew: () => void;
  onEdit: (article: Article) => void;
}

export const ArticleManagerModal: React.FC<ArticleManagerModalProps> = ({
  isOpen,
  articles,
  onClose,
  onAddNew,
  onEdit,
}) => {
  if (!isOpen) return null;

  const handleToggleActive = async (article: Article) => {
    try {
      await updateDoc(doc(db, 'articles', article.id), {
        isActive: !(article.isActive !== false),
      });
    } catch (err) {
      console.error('Gagal mengubah status artikel:', err);
      alert('Gagal mengubah status artikel. Coba lagi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-3xl p-6 relative my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#fe8028]/10 text-[#fe8028] rounded-lg">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#001e40] font-display">
                Kelola Berita
              </h3>
              <p className="text-xs text-gray-500">
                Tambah berita baru, edit, atau nonaktifkan tanpa menghapus datanya.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto pr-1 flex-grow space-y-4">
          <button
            onClick={onAddNew}
            className="flex items-center gap-2 bg-[#001e40] hover:bg-[#003366] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm"
          >
            <Plus className="w-4 h-4" /> Tulis Berita Baru
          </button>

          {articles.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">
              Belum ada berita sama sekali.
            </p>
          ) : (
            <div className="space-y-3">
              {articles.map(article => {
                const active = article.isActive !== false;
                return (
                  <div
                    key={article.id}
                    className={`flex gap-3 items-center border rounded-xl p-3 transition-opacity ${
                      active ? 'border-gray-200' : 'border-gray-200 opacity-60'
                    }`}
                  >
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-16 h-16 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                    />
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-sm text-[#001e40] truncate">{article.title}</p>
                      <p className="text-[11px] text-gray-500">{article.category}</p>
                      <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {active ? 'Aktif Tayang' : 'Nonaktif'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => onEdit(article)}
                        className="p-1.5 rounded-full bg-slate-100 hover:bg-[#001e40] hover:text-white transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(article)}
                        className={`p-1.5 rounded-full transition-colors ${
                          active
                            ? 'bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                        }`}
                        title={active ? 'Nonaktifkan' : 'Aktifkan'}
                      >
                        {active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
