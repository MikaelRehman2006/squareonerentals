import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from '@/models/User';
import { connectDB } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

// Add a simple rate limiter for login attempts
const loginAttempts = new Map<string, { count: number, lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

function checkLoginAttempts(email: string): boolean {
  const now = Date.now();
  const userAttempts = loginAttempts.get(email);
  
  // If no previous attempts or lockout time has passed, reset counter
  if (!userAttempts || (now - userAttempts.lastAttempt) > LOCKOUT_TIME) {
    loginAttempts.set(email, { count: 1, lastAttempt: now });
    return true;
  }
  
  // If too many attempts within lockout period
  if (userAttempts.count >= MAX_LOGIN_ATTEMPTS) {
    return false;
  }
  
  // Increment attempt counter
  loginAttempts.set(email, { 
    count: userAttempts.count + 1, 
    lastAttempt: now 
  });
  
  return true;
}

type UserRole = 'USER' | 'ADMIN';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please enter your email and password');
          }
          
          // Check for too many login attempts
          if (!checkLoginAttempts(credentials.email)) {
            throw new Error('Too many failed login attempts. Please try again later.');
          }

          await connectDB();
          const user = await User.findOne({ email: credentials.email });

          if (!user || !user.password) {
            throw new Error('Invalid email or password');
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            throw new Error('Invalid email or password');
          }
          
          // Reset login attempts on successful login
          loginAttempts.delete(credentials.email);

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role || 'USER'
          };
        } catch (error) {
          console.error('Error in authorize:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      try {
        if (user) {
          token.id = user.id;
          token.email = user.email;
          token.role = (user as any).role || 'USER';
        }

        if (trigger === 'signIn' && account?.provider === 'google') {
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
        }
        return token;
      } catch (error) {
        console.error('Error in JWT callback:', error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (session.user && token.email) {
          await connectDB();
          let dbUser = await User.findOne({ email: token.email });
          
          // If user not found by email, try to find by ID (for cases where email was changed)
          if (!dbUser && token.id) {
            dbUser = await User.findById(token.id);
          }
          
          if (dbUser) {
            session.user.id = dbUser._id.toString();
            session.user.email = dbUser.email;
            session.user.name = dbUser.name;
            session.user.image = dbUser.image;
            session.user.role = dbUser.role || 'USER';
          } else {
            // fallback to token if user not found
            session.user.id = token.id as string;
            session.user.email = token.email as string;
            session.user.role = ((token.role as string) || 'USER') as 'USER' | 'ADMIN';
          }
        }
        return session;
      } catch (error) {
        console.error('Error in session callback:', error);
        return session;
      }
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
};