'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Mail, Phone, Facebook, Loader2, ArrowRight, Building2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value);
      });
      
      formDataObj.append('_honeypot', '');

      const response = await fetch('https://formsubmit.co/squareone.rental@gmail.com', {
        method: 'POST',
        body: formDataObj,
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      toast.success('Message sent successfully! We will get back to you soon.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send message. Please try again later.');
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: 'url(/images/ContactImage.jpg)' }}
      />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      <div className="relative z-10 max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Contact Us</h1>
          <p className="text-xl text-gray-300">Have questions or feedback? We'd love to hear from you.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-8 rounded-2xl shadow-2xl bg-gray-900 border-gray-800">
              <h2 className="text-2xl font-bold mb-8 text-white">Get in Touch</h2>
              
              <div className="space-y-8">
                <div className="flex items-start group">
                  <div className="flex-shrink-0 bg-gray-800 p-3 rounded-full group-hover:bg-blue-600/20 transition-colors">
                    <Mail className="h-6 w-6 text-blue-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">Email</h3>
                    <a 
                      href="mailto:squareone.rental@gmail.com"
                      className="mt-1 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      squareone.rental@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="flex-shrink-0 bg-gray-800 p-3 rounded-full group-hover:bg-blue-600/20 transition-colors">
                    <Phone className="h-6 w-6 text-blue-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">Phone</h3>
                    <p className="mt-1 text-gray-400">Available during business hours</p>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="flex-shrink-0 bg-gray-800 p-3 rounded-full group-hover:bg-blue-600/20 transition-colors">
                    <Facebook className="h-6 w-6 text-blue-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">Facebook</h3>
                    <a 
                      href="https://www.facebook.com/groups/618941558289151" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="mt-1 text-blue-400 hover:text-blue-500 hover:underline transition-colors"
                    >
                      Join our Facebook Group
                    </a>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="flex-shrink-0 bg-gray-800 p-3 rounded-full group-hover:bg-blue-600/20 transition-colors">
                    <Building2 className="h-6 w-6 text-blue-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">Real Estate Partner</h3>
                    <a 
                      href="https://www.linkedin.com/hiring/jobs/4231485688" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="mt-1 text-blue-400 hover:text-blue-500 hover:underline transition-colors"
                    >
                      View Job Posting
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-8 rounded-2xl shadow-2xl bg-gray-900 border-gray-800">
              <h2 className="text-2xl font-bold mb-8 text-white">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="bg-gray-800 text-white placeholder-gray-400 border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                    className="bg-gray-800 text-white placeholder-gray-400 border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    className="bg-gray-800 text-white placeholder-gray-400 border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-white">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this about?"
                    required
                    className="bg-gray-800 text-white placeholder-gray-400 border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  />
                  {errors.subject && (
                    <p className="text-red-400 text-sm mt-1">{errors.subject}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message here..."
                    className="min-h-[150px] resize-none bg-gray-800 text-white placeholder-gray-400 border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    required
                  />
                  {errors.message && (
                    <p className="text-red-400 text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-[1.02] group"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                <div className="mt-4 text-center">
                  <p className="text-gray-400 mb-4">Interested in becoming a Real Estate Partner?</p>
                  <a 
                    href="https://www.linkedin.com/hiring/jobs/4231485688"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-[1.02] group"
                  >
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}