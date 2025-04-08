'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { MessageCircle, X, Search, Send } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  senderName: string;
  senderImage: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
}

export function ChatWidget() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Fetch messages when widget opens
  useEffect(() => {
    if (isOpen && session?.user) {
      fetchMessages();
    }
  }, [isOpen, session]);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search users');
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: selectedUser._id,
          content: newMessage,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      setNewMessage('');
      fetchMessages(); // Refresh messages
      toast.success('Message sent');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  if (!session?.user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="rounded-full h-12 w-12 shadow-lg"
      >
        {isOpen ? <X /> : <MessageCircle />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Messages</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearching(!isSearching)}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Search Input */}
            {isSearching && (
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchUsers(e.target.value);
                  }}
                  className="w-full"
                />
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border rounded-lg mt-1 shadow-lg z-10">
                    {searchResults.map((user) => (
                      <button
                        key={user._id}
                        onClick={() => {
                          setSelectedUser(user);
                          setSearchQuery('');
                          setSearchResults([]);
                          setIsSearching(false);
                        }}
                        className="w-full p-2 text-left hover:bg-gray-100 flex items-center gap-2"
                      >
                        <div className="relative h-8 w-8 rounded-full overflow-hidden">
                          <Image
                            src={user.image || '/placeholder-avatar.png'}
                            alt={user.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span>{user.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Messages Area */}
          <ScrollArea className="h-96 p-4">
            {selectedUser ? (
              <div className="space-y-4">
                {messages
                  .filter(
                    (msg) =>
                      (msg.senderId === session.user?.id && msg.receiverId === selectedUser._id) ||
                      (msg.receiverId === session.user?.id && msg.senderId === selectedUser._id)
                  )
                  .map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${
                        message.senderId === session.user?.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          message.senderId === session.user?.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-4">
                Select a user to start chatting
              </div>
            )}
          </ScrollArea>

          {/* Message Input */}
          {selectedUser && (
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button size="icon" onClick={sendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
