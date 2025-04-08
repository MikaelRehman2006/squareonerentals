import { Suspense } from 'react';
import MessageList from '@/components/MessageList';

export default function MessagesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const listingId = searchParams.listingId as string;
  const otherUserId = searchParams.otherUserId as string;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      <div className="bg-white rounded-lg shadow-lg h-[600px]">
        <Suspense fallback={<div className="p-4">Loading messages...</div>}>
          <MessageList
            listingId={listingId}
            otherUserId={otherUserId}
          />
        </Suspense>
      </div>
    </div>
  );
}
