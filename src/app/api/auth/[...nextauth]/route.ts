import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export the handler as GET and POST route handlers
export { handler as GET, handler as POST };