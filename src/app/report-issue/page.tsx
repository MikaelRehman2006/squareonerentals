'use client';

import { useState } from 'react';

export default function ReportIssue() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issueType: '',
    subject: '',
    description: '',
    browser: '',
    device: '',
    steps: '',
    priority: 'medium'
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
          type: 'issue',
          ...formData,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          issueType: '',
          subject: '',
          description: '',
          browser: '',
          device: '',
          steps: '',
          priority: 'medium'
        });
      } else {
        alert('Failed to submit issue report. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting issue:', error);
      alert('Failed to submit issue report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
          <h1 className="text-3xl font-bold text-black mb-4">Issue Report Submitted!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for reporting this issue. Our team has been notified and will review it within 24-48 hours. 
            We'll contact you at {formData.email} if we need any additional information.
          </p>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Report Another Issue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-black mb-4">Report an Issue</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Help us improve Square One Rentals by reporting bugs, technical issues, or problems you've encountered. 
            Your feedback helps us provide a better experience for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-black mb-4">Your Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Issue Details */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-black mb-4">Issue Details</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-2">
                      Issue Type *
                    </label>
                    <select
                      id="issueType"
                      name="issueType"
                      required
                      value={formData.issueType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select an issue type</option>
                      <option value="bug">Bug or Technical Issue</option>
                      <option value="feature">Feature Request</option>
                      <option value="performance">Performance Problem</option>
                      <option value="security">Security Concern</option>
                      <option value="usability">Usability Issue</option>
                      <option value="other">Other</option>
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
                      placeholder="Brief description of the issue"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Detailed Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Please provide a detailed description of the issue..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="steps" className="block text-sm font-medium text-gray-700 mb-2">
                      Steps to Reproduce
                    </label>
                    <textarea
                      id="steps"
                      name="steps"
                      rows={3}
                      value={formData.steps}
                      onChange={handleChange}
                      placeholder="1. Go to...&#10;2. Click on...&#10;3. Expected result...&#10;4. Actual result..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low - Minor inconvenience</option>
                      <option value="medium">Medium - Affects functionality</option>
                      <option value="high">High - Blocks important features</option>
                      <option value="critical">Critical - Site unusable</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Technical Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-black mb-4">Technical Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="browser" className="block text-sm font-medium text-gray-700 mb-2">
                      Browser
                    </label>
                    <input
                      type="text"
                      id="browser"
                      name="browser"
                      value={formData.browser}
                      onChange={handleChange}
                      placeholder="e.g., Chrome 120, Firefox 121"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="device" className="block text-sm font-medium text-gray-700 mb-2">
                      Device
                    </label>
                    <input
                      type="text"
                      id="device"
                      name="device"
                      value={formData.device}
                      onChange={handleChange}
                      placeholder="e.g., iPhone 15, Windows PC"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
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
                  {isSubmitting ? 'Submitting...' : 'Submit Issue Report'}
                </button>
              </div>
            </form>
          </div>

          {/* Guidelines */}
          <div className="lg:col-span-1">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-black mb-4">Reporting Guidelines</h3>
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-medium text-black mb-2">Before Reporting:</h4>
                  <ul className="space-y-1">
                    <li>• Check if the issue is already known</li>
                    <li>• Try refreshing the page</li>
                    <li>• Clear your browser cache</li>
                    <li>• Try a different browser</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-black mb-2">Include:</h4>
                  <ul className="space-y-1">
                    <li>• Clear description of the problem</li>
                    <li>• Steps to reproduce the issue</li>
                    <li>• Expected vs actual behavior</li>
                    <li>• Screenshots if helpful</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-black mb-2">Response Time:</h4>
                  <p>We typically respond to issue reports within 24-48 hours during business hours.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mt-6">
              <h3 className="text-lg font-semibold text-black mb-4">Need Immediate Help?</h3>
              <p className="text-gray-600 text-sm mb-4">
                If you're experiencing a critical issue that prevents you from using the platform, please contact us directly.
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