import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import connectToDatabase from '@/lib/mongodb';
import { Collection } from 'mongodb';

interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  senderName?: string;
  senderAvatar?: string;
  link?: string;
}

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const { db } = await connectToDatabase();
  const notificationsCollection: Collection<Notification> = db.collection('notifications');
  
  const notifications = await notificationsCollection
    .find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .toArray();

  const markAllAsRead = async () => {
    'use server';
    const { db } = await connectToDatabase();
    const notificationsCollection: Collection<Notification> = db.collection('notifications');
    await notificationsCollection.updateMany(
      {
        userId: session.user.id,
        read: false,
      },
      {
        $set: { read: true }
      }
    );
  };

  return (
    <main className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <form action={markAllAsRead}>
          <Button variant="outline">Mark all as read</Button>
        </form>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No notifications yet
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification: Notification) => (
            <Card key={notification._id.toString()} className={notification.read ? 'bg-muted' : ''}>
              <CardContent className="flex items-start gap-4 py-4">
                {notification.senderAvatar && (
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={notification.senderAvatar} alt={notification.senderName || ''} />
                    <AvatarFallback>{notification.senderName?.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <Badge variant="default" className="mt-0.5">New</Badge>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                    {notification.link && (
                      <Link href={notification.link} className="text-xs text-primary hover:underline">
                        View details
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}