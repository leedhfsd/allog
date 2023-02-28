export type Article = {
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
};

export type User = {
  name: string;
  email: string;
  password: string;
  image: string;
  nickname: string;
  userinfo: string;
  emailVerified?: boolean | null;
};
