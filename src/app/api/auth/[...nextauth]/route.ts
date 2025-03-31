import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import { DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { User, IUser } from '@/models/User';
import { connectDB } from '@/lib/mongodb';

declare module 'next-auth' {
  interface User {
    id: string;
    role?: string;
  }
  
  interface Session {
    user: {
      id: string;
      role?: string;
      email: string;
    } & DefaultSession['user'];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Invalid credentials');
          }

          await connectDB();
          console.log('Attempting to find user with email:', credentials.email);

          const user = await User.findOne({ email: credentials.email });
          console.log('Found user:', user ? { 
            id: user._id.toString(),
            email: user.email,
            hasPassword: !!user.password,
            role: user.role
          } : 'No user found');

          if (!user || !user.password) {
            console.log('User not found or no password set');
            throw new Error('Invalid credentials');
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          console.log('Password validation result:', isPasswordValid);

          if (!isPasswordValid) {
            console.log('Invalid password');
            throw new Error('Invalid credentials');
          }

          console.log('Authentication successful for user:', user.email);
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error('Error in authorize:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      console.log('JWT Callback - Input:', { 
        tokenEmail: token.email,
        userEmail: user?.email,
        provider: account?.provider 
      });

      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        
        // Set admin role for specific emails
        if (user.email === 'mikaelr112@gmail.com' || user.email === 'volcanxic@gmail.com') {
          token.role = 'admin';
        }
      }

      console.log('JWT Callback - Output token:', token);
      return token;
    },
    async session({ session, token }) {
      console.log('Session Callback - Input:', { 
        sessionEmail: session.user?.email,
        tokenEmail: token.email,
        tokenRole: token.role
      });

      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
      }

      console.log('Session Callback - Output session:', session);
      return session;
    },
    async signIn({ user, account }) {
      console.log('SignIn Callback - Start:', { 
        userEmail: user.email,
        provider: account?.provider 
      });

      try {
        await connectDB();
        
        if (account?.provider === 'google') {
          // Check if user exists
          const existingUser = await User.findOne({ email: user.email });
          console.log('Google SignIn - Existing user:', existingUser ? {
            id: existingUser._id.toString(),
            email: existingUser.email,
            role: existingUser.role
          } : 'No user found');
          
          if (!existingUser) {
            // Create new user with admin role for specific emails
            const newUser = await User.create({
              email: user.email,
              name: user.name,
              image: user.image,
              role: user.email === 'mikaelr112@gmail.com' || user.email === 'volcanxic@gmail.com' ? 'admin' : 'user',
              emailVerified: new Date(),
            });
            
            console.log('Google SignIn - Created new user:', {
              id: newUser._id.toString(),
              email: newUser.email,
              role: newUser.role
            });
            
            user.role = newUser.role;
          } else {
            // Update existing user's role if they're an admin
            if (user.email === 'mikaelr112@gmail.com' || user.email === 'volcanxic@gmail.com') {
              await User.findByIdAndUpdate(existingUser._id, { role: 'admin' });
              user.role = 'admin';
              console.log('Google SignIn - Updated user to admin role');
            } else {
              user.role = existingUser.role;
            }
          }
        }
        
        // For credentials provider
        if (account?.provider === 'credentials') {
          console.log('Credentials SignIn - Checking user:', user.email);
          const existingUser = await User.findOne({ email: user.email });
          
          if (existingUser) {
            // Update role for admin emails
            if (user.email === 'mikaelr112@gmail.com' || user.email === 'volcanxic@gmail.com') {
              await User.findByIdAndUpdate(existingUser._id, { role: 'admin' });
              user.role = 'admin';
              console.log('Credentials SignIn - Updated user to admin role');
            } else {
              user.role = existingUser.role;
            }
          }
        }

        console.log('SignIn Callback - Success:', { 
          userEmail: user.email,
          userRole: user.role 
        });
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };