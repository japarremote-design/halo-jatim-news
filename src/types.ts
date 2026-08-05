export type CategoryType = 'Madura' | 'Jawa Timur' | 'Politik' | 'Desa' | 'Keislaman' | 'Hukum';

export interface Article {
  id: string;
  title: string;
  category: CategoryType;
  content: string;
  excerpt: string;
  imageUrl: string;
  imageCaption?: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  createdAt: string; // ISO string
  views: number;
  likes: number;
  tags: string[];
  isHero?: boolean;
  isTrending?: boolean;
  isOpinion?: boolean;
  opinionAuthor?: string;
  opinionRole?: string;
}

export interface CommentItem {
  id: string;
  articleId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: string;
}

export interface BookmarkItem {
  id: string;
  userId: string;
  articleId: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isAnonymous?: boolean;
}
