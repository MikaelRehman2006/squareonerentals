# Email Notification System Documentation

## Overview

The Square One Rentals platform now includes a comprehensive email notification system that automatically sends emails when notifications are created in the app. The system uses **Resend** as the email service provider and integrates seamlessly with the existing notification system.

## Features

### 🎯 Automatic Email Sending

- **System Alerts**: Important platform notifications sent to all users or specific users
- **Newsletters**: Regular updates and news sent to the community
- **Special Offers**: Marketing promotions and exclusive deals
- **Payment Notifications**: Receipts, invoices, and payment status updates
- **Welcome Messages**: New user onboarding emails
- **Listing Updates**: Notifications when saved properties are updated
- **Messages**: Direct communication between users

### 📧 Email Templates

Each notification type has a beautifully designed email template with:

- **Branded headers** with gradient backgrounds
- **Responsive design** that works on all devices
- **Clear call-to-action buttons** with appropriate links
- **Professional styling** with Square One Rentals branding
- **Unsubscribe and preference management** links

### 🔧 Technical Implementation

#### Core Files Modified:

1. **`src/lib/notification.ts`** - Updated to send emails automatically
2. **`src/utils/resend.ts`** - Email templates and sending logic
3. **`src/app/api/test-notification/route.ts`** - Updated test endpoint
4. **`src/app/test-notifications/page.tsx`** - Enhanced test interface

#### Key Functions:

```typescript
// Create notification with automatic email sending
await createNotification({
  userId: "user_id",
  message: "Your notification message",
  type: "SYSTEM", // or NEWSLETTER, MARKETING, etc.
  sendEmail: true, // Defaults to true
});

// Send system alerts to all users
await createSystemNotification("Important system message");

// Send newsletters
await createNewsletterNotification("Newsletter Title", "Content here");

// Send special offers
await createMarketingNotification("Special Offer", "Offer details");
```

## Email Types and Templates

### 1. System Alerts (`SYSTEM`)

- **Subject**: "System Alert - Square One Rentals"
- **Template**: Gray gradient header with alert icon
- **Use Case**: Platform maintenance, security updates, important announcements

### 2. Newsletters (`NEWSLETTER`)

- **Subject**: "Newsletter - Square One Rentals"
- **Template**: Purple gradient header with newspaper icon
- **Use Case**: Monthly updates, feature announcements, community news

### 3. Special Offers (`MARKETING`)

- **Subject**: "Special Offer - Square One Rentals"
- **Template**: Orange gradient header with gift icon
- **Use Case**: Promotions, discounts, exclusive deals

### 4. Payment Notifications (`PAYMENT`)

- **Subject**: "Payment Notification - Square One Rentals"
- **Template**: Green gradient header with credit card icon
- **Use Case**: Receipts, invoices, payment confirmations

### 5. Welcome Messages (`WELCOME`)

- **Subject**: "Welcome to Square One Rentals"
- **Template**: Green gradient header with party popper icon
- **Use Case**: New user onboarding

## Testing the System

### 1. Test Page

Visit `/test-notifications` to test the email system:

- Select notification type
- Enter email address
- Click "Test Notification + Email"
- View detailed results and diagnostics

### 2. API Endpoint

Test via API: `GET /api/test-notification?email=user@example.com&type=SYSTEM`

### 3. Admin Panel

Use the admin notifications panel at `/admin/notifications` to send:

- System alerts to all users
- Newsletters with custom content
- Special offers and promotions

## Configuration

### Environment Variables Required:

```bash
RESEND_API_KEY=your_resend_api_key
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=your_app_url
```

### Email Preferences (Future Enhancement):

The system is designed to support user email preferences:

- Users can opt in/out of different notification types
- Preferences stored in user settings
- Respects user choices when sending emails

## Error Handling

The system includes comprehensive error handling:

- **Database connection errors**: Logged and handled gracefully
- **Email sending failures**: Don't prevent notification creation
- **User not found**: Logged and skipped
- **Invalid notification types**: Validated and rejected

## Monitoring and Logging

All email operations are logged with:

- **Success/failure status**
- **User email addresses** (for debugging)
- **Notification types and content**
- **Error details** when failures occur

## Security Considerations

- **Email addresses** are validated before sending
- **User authentication** required for admin functions
- **Rate limiting** can be implemented (future enhancement)
- **Unsubscribe links** included in all emails
- **GDPR compliance** built into the system

## Performance

- **Asynchronous email sending** - doesn't block notification creation
- **Batch processing** support for large user lists
- **Database optimization** with proper indexing
- **Caching** for user preferences (future enhancement)

## Troubleshooting

### Common Issues:

1. **Emails not sending**
   - Check `RESEND_API_KEY` environment variable
   - Verify Resend account is active
   - Check email logs for specific errors

2. **Notifications created but no emails**
   - Verify user exists in database
   - Check user email is valid
   - Review email sending logs

3. **Template rendering issues**
   - Check HTML template syntax
   - Verify all required data is provided
   - Test with different notification types

### Debug Tools:

- **Test page**: `/test-notifications`
- **Admin debugging**: `/admin/debugging`
- **API diagnostics**: Check response from test endpoints

## Future Enhancements

1. **User Email Preferences**: Allow users to customize which emails they receive
2. **Email Templates**: More sophisticated template system with dynamic content
3. **Scheduling**: Send notifications at specific times
4. **Analytics**: Track email open rates and click-through rates
5. **A/B Testing**: Test different email templates and content
6. **Bulk Operations**: Send to large user lists efficiently

## Support

For technical support or questions about the email system:

- Check the test page for diagnostics
- Review server logs for error details
- Contact the development team with specific error messages

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
