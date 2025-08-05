'use client';

import { useState } from 'react';

export default function Feedback() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackType: '',
    subject: '',
    description: '',
    rating: '',
    category: '',
    anonymous: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'feedback',
          ...formData,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          feedbackType: '',
          subject: '',
          description: '',
          rating: '',
          category: '',
          anonymous: false
        });
      } else {
        alert('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  if (isSubmitted) {
    return (
      <div className="bg-white min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-black mb-4">Feedback Submitted!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your feedback! We appreciate you taking the time to help us improve Square One Rentals. 
            Our team will review your suggestions and consider them for future updates.
          </p>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Submit More Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-black mb-4">Share Your Feedback</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We value your input! Share your suggestions, ideas, and feedback to help us make Square One Rentals 
            even better for everyone in the Square One community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-black mb-4">Your Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="anonymous"
                      name="anonymous"
                      checked={formData.anonymous}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label htmlFor="anonymous" className="text-sm text-gray-700">
                      Submit anonymously
                    </label>
                  </div>
                  
                  {!formData.anonymous && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Feedback Details */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-black mb-4">Feedback Details</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="feedbackType" className="block text-sm font-medium text-gray-700 mb-2">
                      Feedback Type *
                    </label>
                    <select
                      id="feedbackType"
                      name="feedbackType"
                      required
                      value={formData.feedbackType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select feedback type</option>
                      <option value="suggestion">Suggestion</option>
                      <option value="compliment">Compliment</option>
                      <option value="complaint">Complaint</option>
                      <option value="feature-request">Feature Request</option>
                      <option value="improvement">Improvement Idea</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      <option value="user-interface">User Interface</option>
                      <option value="search-filters">Search & Filters</option>
                      <option value="listing-management">Listing Management</option>
                      <option value="communication">Communication Tools</option>
                      <option value="mobile-app">Mobile Experience</option>
                      <option value="payment-billing">Payment & Billing</option>
                      <option value="customer-support">Customer Support</option>
                      <option value="general">General</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Brief summary of your feedback"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Detailed Feedback *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      rows={5}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Please provide detailed feedback, suggestions, or ideas..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                      Overall Experience Rating
                    </label>
                    <select
                      id="rating"
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a rating</option>
                      <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                      <option value="4">⭐⭐⭐⭐ Very Good</option>
                      <option value="3">⭐⭐⭐ Good</option>
                      <option value="2">⭐⭐ Fair</option>
                      <option value="1">⭐ Poor</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </div>

          {/* Guidelines */}
          <div className="lg:col-span-1">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-black mb-4">Feedback Guidelines</h3>
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-medium text-black mb-2">We Welcome:</h4>
                  <ul className="space-y-1">
                    <li>• Feature suggestions</li>
                    <li>• Improvement ideas</li>
                    <li>• User experience feedback</li>
                    <li>• Bug reports</li>
                    <li>• General comments</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-black mb-2">Be Specific:</h4>
                  <ul className="space-y-1">
                    <li>• Describe the problem clearly</li>
                    <li>• Explain why it matters</li>
                    <li>• Suggest solutions if possible</li>
                    <li>• Include relevant details</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-black mb-2">Response:</h4>
                  <p>We review all feedback and may reach out for more details. Your input directly influences our development priorities.</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg mt-6 border border-green-200">
              <h3 className="text-lg font-semibold text-black mb-4">Recent Improvements</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <h4 className="font-medium text-black">✅ Mobile Responsiveness</h4>
                  <p>Enhanced mobile experience based on user feedback</p>
                </div>
                <div>
                  <h4 className="font-medium text-black">✅ Advanced Search Filters</h4>
                  <p>Added more filtering options for better property discovery</p>
                </div>
                <div>
                  <h4 className="font-medium text-black">✅ Improved Notifications</h4>
                  <p>Better notification system for listing updates</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mt-6">
              <h3 className="text-lg font-semibold text-black mb-4">Other Ways to Connect</h3>
              <p className="text-gray-600 text-sm mb-4">
                Have urgent feedback or want to discuss something in detail?
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> squareone.rental@gmail.com</p>
                <p><strong>Hours:</strong> Mon-Fri: 9am-7pm EST</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 