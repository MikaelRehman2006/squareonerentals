'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface Message {
  _id: string;
  senderId: {
    _id: string;
    name: string;
    image: string;
  };
  receiverId: {
    _id: string;
    name: string;
    image: string;
  };
  listingId: {
    _id: string;
    title: string;
  };
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface MessageListProps {
  listingId?: string;
  otherUserId?: string;
}

export default function MessageList({ listingId, otherUserId }: MessageListProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [listingId, otherUserId]);

  const fetchMessages = async () => {
    try {
      const params = new URLSearchParams();
      if (listingId) params.append('listingId', listingId);
      if (otherUserId) params.append('otherUserId', otherUserId);

      const response = await fetch(`/api/messages?${params}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        markUnreadAsRead(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markUnreadAsRead = async (messages: Message[]) => {
    const unreadMessages = messages.filter(
      m => !m.isRead && m.receiverId._id === session?.user?.id
    );

    for (const message of unreadMessages) {
      try {
        await fetch('/api/messages', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messageId: message._id }),
        });
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !otherUserId || !listingId) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: otherUserId,
          listingId,
          message: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${
              message.senderId._id === session?.user?.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div className={`flex items-start max-w-[70%] ${
              message.senderId._id === session?.user?.id ? 'flex-row-reverse' : ''
            }`}>
              <Image
                src={message.senderId.image || '/placeholder-avatar.png'}
                alt={message.senderId.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className={`mx-2 ${
                message.senderId._id === session?.user?.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              } rounded-lg p-3`}>
                <p className="text-sm">{message.message}</p>
                <p className="text-xs mt-1 opacity-70">
                  {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
