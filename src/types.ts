export interface User {
  id: number | string;
  nickName: string;
  [key: string]: any;
}

export interface Post {
  id: number | string;
  userId: number | string;
  description: string;
  tags?: string[];
  [key: string]: any;
}

export interface Comment {
  id?: number | string;
  postId: number | string;
  userId?: number | string;
  text: string;
}
