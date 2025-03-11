import { Session } from 'next-auth';

export interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: 'USER' | 'ADMIN';
  };
} 