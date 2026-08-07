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
  isActive?: boolean; // false = hidden from readers (soft-delete)
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

export type AdPosition = 'skyscraper' | 'square' | 'billboard';

export interface Ad {
  id: string;
  position: AdPosition;
  label: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  expiresAt: string; // ISO date string, empty = no expiry
  createdAt: string;
}
