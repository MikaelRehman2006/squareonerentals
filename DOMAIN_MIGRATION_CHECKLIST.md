# 🚀 **Complete Domain Migration Checklist**

## **1. Environment Variables & Configuration**

### **Vercel Environment Variables**

Update these in your Vercel dashboard:

```
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

### **Resend Email Configuration**

- **Domain Verification**: Add your domain to Resend
- **Update Email Sender**: Change from `onboarding@resend.dev` to `noreply@yourdomain.com`

## **2. Google Cloud Console (OAuth)**

### **Google OAuth Credentials**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID
4. Update **Authorized JavaScript origins**:
   - Add: `https://yourdomain.com`
   - Remove: `https://squareonerentals-1234.vercel.app`
5. Update **Authorized redirect URIs**:
   - Add: `https://yourdomain.com/api/auth/callback/google`
   - Remove: `https://squareonerentals-1234.vercel.app/api/auth/callback/google`

### **Environment Variables**

Update in Vercel:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## **3. Stripe Configuration**

### **Stripe Dashboard**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Settings** → **Customer Portal**
3. Update **Return URL**: `https://yourdomain.com/dashboard/subscription`
4. Update **Cancel URL**: `https://yourdomain.com/memberships/payment-error`

### **Stripe Webhooks**

1. Go to **Developers** → **Webhooks**
2. Update webhook endpoints:
   - Change from: `https://squareonerentals-1234.vercel.app/api/stripe/webhook`
   - To: `https://yourdomain.com/api/stripe/webhook`

## **4. Code Changes Required**

### **Files to Update:**

#### **A. Email Templates**

1. **`src/email-templates/listing-update-template.html`**
   - Line 311: Update logo URL
   - Line 388: Update website link
   - Line 399: Update website link

2. **`src/utils/resend.ts`**
   - Line 83: Update verification email sender
   - Line 136: Update contact instructions
   - Line 182: Update welcome email sender
   - Line 360: Update notification email sender

#### **B. Notification System**

3. **`src/lib/notification.ts`**
   - Line 178: Update base URL fallback

4. **`src/app/api/listings/route.ts`**
   - Line 368: Update listing URL generation
   - Line 387: Update Facebook API URL

#### **C. Environment Configuration**

5. **`src/lib/envConfig.ts`**
   - Line 65: Update base URL fallback
   - Line 67: Update notification action URL

#### **D. Stripe Integration**

6. **`src/app/dashboard/subscription/page.tsx`**
   - Line 38: Update Stripe portal URL (if using custom portal)

#### **E. Social Media Links**

7. **`src/components/Footer.tsx`**
   - Update LinkedIn company URL (if you have a company page)
   - Update Facebook group URL (if you change the group)

8. **`src/app/contact/page.tsx`**
   - Update social media links

9. **`src/app/about/page.tsx`**
   - Update social media links

## **5. DNS Configuration**

### **Vercel Domain Setup**

1. Add your domain in Vercel dashboard
2. Configure DNS records as instructed by Vercel
3. Wait for DNS propagation (up to 48 hours)

### **Resend Domain Verification**

1. Add domain in Resend dashboard
2. Add required DNS records (TXT, MX, SPF)
3. Wait for verification

## **6. Testing Checklist**

### **After Migration:**

- [ ] Test Google OAuth login
- [ ] Test email sending (verification, welcome, notifications)
- [ ] Test Stripe payments and webhooks
- [ ] Test Facebook integration
- [ ] Test all internal links work
- [ ] Test email templates render correctly
- [ ] Test notification system
- [ ] Test admin panel functionality

## **7. SEO & Analytics**

### **Google Analytics**

1. Update property URL in Google Analytics
2. Update tracking code if needed

### **Google Search Console**

1. Add new domain property
2. Submit sitemap
3. Monitor for any issues

### **Social Media**

1. Update Facebook page website URL
2. Update LinkedIn company page URL
3. Update any other social media profiles

## **8. Security & SSL**

### **SSL Certificate**

- Vercel handles this automatically
- Ensure HTTPS is enforced

### **Security Headers**

- Check `src/middleware.ts` for any domain-specific configurations

## **9. Backup & Rollback Plan**

### **Before Migration:**

1. Backup current environment variables
2. Document current working configuration
3. Test migration on staging environment first

### **Rollback Plan:**

1. Keep old domain active during transition
2. Have backup of old environment variables
3. Monitor for 24-48 hours after migration

## **10. Post-Migration Tasks**

### **Monitoring:**

- [ ] Monitor error logs for 48 hours
- [ ] Check email delivery rates
- [ ] Monitor payment processing
- [ ] Check user authentication flows
- [ ] Verify all integrations work

### **Cleanup:**

- [ ] Remove old domain from Google OAuth
- [ ] Update any external documentation
- [ ] Update any marketing materials
- [ ] Update any business cards or printed materials

## **🚨 Important Notes:**

1. **Test thoroughly** before going live
2. **Keep old domain** active during transition period
3. **Monitor everything** for at least 48 hours after migration
4. **Have rollback plan** ready
5. **Update all team members** about the new domain
6. **Update any external integrations** not covered in this list

## **📞 Support Contacts:**

- **Vercel Support**: For deployment issues
- **Resend Support**: For email delivery issues
- **Stripe Support**: For payment processing issues
- **Google Cloud Support**: For OAuth issues
