import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';

export default function SignupGate() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      setIsOpen(true);
    }
  }, [status]);

  const handleSignup = () => {
    router.push('/auth/signup');
  };

  if (status === 'loading') {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Welcome to Square One Rentals</DialogTitle>
          <DialogDescription className="text-center mt-4">
            Join our community to access the best rental listings in Canada.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Why Sign Up?</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Access exclusive rental listings</li>
              <li>Save your favorite properties</li>
              <li>Get notified about new listings</li>
              <li>Connect with property owners</li>
            </ul>
          </div>

          <Button 
            onClick={handleSignup}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
          >
            Sign Up Now
          </Button>

          <p className="text-sm text-gray-500 text-center mt-4">
            By signing up, you agree to the{' '}
            <a href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 