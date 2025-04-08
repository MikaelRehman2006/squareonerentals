import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { connectDB } from '@/lib/mongodb';
import mongoose, { Document } from 'mongoose';

interface INotification {
  _id: mongoose.Types.ObjectId;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  senderName?: string;
  senderAvatar?: string;
  link?: string;
}

// Define Notification Schema
const notificationSchema = new mongoose.Schema<INotification>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  senderName: String,
  senderAvatar: String,
  link: String,
});

// Get or create model
const Notification = mongoose.models.Notification as mongoose.Model<INotification> || 
  mongoose.model<INotification>('Notification', notificationSchema);

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  await connectDB();
  
  const notifications: INotification[] = await Notification
    .find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  const markAllAsRead = async () => {
    'use server';
    await connectDB();
    await Notification.updateMany(
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <form action={markAllAsRead}>
          <Button variant="outline" size="sm">
            Mark all as read
          </Button>
        </form>
      </div>

      <div className="space-y-4">
        {notifications.map((notification: INotification) => (
          <Card key={notification._id.toString()} className={notification.read ? 'bg-gray-50' : 'bg-white border-blue-200'}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={notification.senderAvatar} />
                  <AvatarFallback>
                    {notification.senderName?.[0] || 'N'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <Badge variant="secondary" className="ml-2">New</Badge>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-4">
                    <p className="text-sm text-gray-500">
                      {format(new Date(notification.createdAt), 'PPp')}
                    </p>
                    {notification.link && (
                      <Link href={notification.link} className="text-sm text-blue-600 hover:underline">
                        View details
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {notifications.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No notifications yet
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}