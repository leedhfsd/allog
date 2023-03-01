export interface Article {
  _id: number;
  title: string;
  content: string;
  hashtag: string[];
  createdAt: string;
  liked: number;
  writer: string;
  profile: string;
  slug: string;
  sanitizedHtml: string;
}

export interface User {
  name: string;
  email: string;
  image?: string;
  nickname?: string;
  userinfo?: string;
  hashedPassword?: string;
  password?: string;
  salt?: string;
  emailVerified?: boolean | null;
}
