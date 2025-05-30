'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

// Direct Stripe portal URL
const STRIPE_PORTAL_URL = 'https://billing.stripe.com/p/login/test_28E7sN74A8oWciA6mpebu00';

interface Membership {
  type: string;
  isAnnual: boolean;
  startDate: string;
  endDate: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: string;
}

export default function SubscriptionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelingSubscription, setCancelingSubscription] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }

    if (status === 'authenticated') {
      fetchMembership();
    }
  }, [status, router]);

  const fetchMembership = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/membership');
      
      if (!response.ok) {
        throw new Error('Failed to fetch membership details');
      }
      
      const data = await response.json();
      setMembership(data.membership);
    } catch (error) {
      console.error('Error fetching membership:', error);
      setErrorMessage('Could not load your subscription details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = () => {
    try {
      setCancelingSubscription(true);
      
      // Redirect to the Stripe Customer Portal instead of calling our API
      toast.info('Redirecting to Stripe Customer Portal to manage your subscription...');
      window.location.href = STRIPE_PORTAL_URL;
      
    } catch (error) {
      console.error('Error redirecting to Stripe portal:', error);
      setErrorMessage('Failed to access subscription management portal. Please try again later.');
      toast.error('Failed to access subscription management portal');
      setCancelingSubscription(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Manage Your Subscription</h1>
      
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{errorMessage}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      {!membership ? (
        <Card>
          <CardHeader>
            <CardTitle>No Active Subscription</CardTitle>
            <CardDescription>
              You don't have an active subscription plan at the moment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">
              To create listings and access premium features, you'll need to subscribe to one of our plans.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/memberships')}>
              View Available Plans
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{membership.type} Plan</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  membership.status === 'active' ? 'bg-green-100 text-green-800' :
                  membership.status === 'canceled' ? 'bg-orange-100 text-orange-800' :
                  membership.status === 'past_due' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {membership.status === 'active' ? 'Active' :
                   membership.status === 'canceled' ? 'Canceled' :
                   membership.status === 'past_due' ? 'Past Due' :
                   membership.status.charAt(0).toUpperCase() + membership.status.slice(1)}
                </span>
              </CardTitle>
              <CardDescription>
                {membership.isAnnual ? 'Annual' : 'Monthly'} billing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Started on</h3>
                  <p className="mt-1 text-base">
                    {membership.startDate ? new Date(membership.startDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Current period ends on</h3>
                  <p className="mt-1 text-base">
                    {membership.endDate ? new Date(membership.endDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              {membership.status === 'canceled' && (
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-md">
                  <p className="text-amber-800 text-sm">
                    Your subscription has been canceled but will remain active until the end of the current billing period.
                  </p>
                </div>
              )}

              {membership.status === 'past_due' && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-md">
                  <p className="text-red-800 text-sm">
                    Your payment is past due. Please update your payment method to continue your subscription.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-2" 
                    onClick={() => router.push('/dashboard/billing')}
                  >
                    Update Payment Method
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              {membership.status === 'active' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      Cancel Subscription
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You'll be redirected to Stripe's Customer Portal where you can cancel your subscription.
                        After cancellation, you'll continue to have access until the end of your current billing period.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Stay Subscribed</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={cancelSubscription}
                      >
                        Continue to Stripe Portal
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">View Plan Details</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{membership.type} Plan Details</DialogTitle>
                    <DialogDescription>
                      Your current subscription details and benefits
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <h4 className="font-medium mb-2">What's included:</h4>
                    <ul className="space-y-2">
                      {membership.type === 'BASIC' ? (
                        <>
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                            <span>Facebook listing (standard)</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                            <span>Website listing (standard)</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                            <span>Standard email support</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                            <span>{membership.isAnnual ? '1 year' : '30 days'} of active visibility</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                            <span>10MB storage cap</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                            <span>Access to find realtors and other realtor services</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                            <span>Facebook listing (featured)</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                            <span>Website listing (featured)</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                            <span>Priority email support</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                            <span>{membership.isAnnual ? '1 year' : '30 days'} of active visibility</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                            <span>25MB storage cap</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                            <span>Access to more realtor services</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => router.push('/memberships')}>
                      View All Plans
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View your past invoices and payment receipts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                To view your complete billing history and manage your payment methods, please visit your Stripe Customer Portal.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push('/dashboard/billing')}>
                Go to Billing Portal
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
} 