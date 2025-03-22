import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { User } from '@/models/User';
import connectDB from '@/lib/mongodb';

type UserRole = 'USER' | 'ADMIN';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      if (trigger === 'signIn' && account?.provider === 'google') {
        try {
          await connectDB();
          let dbUser = await User.findOne({ email: token.email });
          
          if (!dbUser) {
            dbUser = await User.create({
              email: token.email,
              name: token.name,
              image: token.picture,
              role: 'USER',
              emailVerified: new Date(),
            });
          }
          
          token.id = dbUser._id.toString();
          token.role = dbUser.role || 'USER';
        } catch (error) {
          console.error('Error in JWT callback:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || 'USER';
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          await connectDB();
          return true;
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      }
      return false;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};