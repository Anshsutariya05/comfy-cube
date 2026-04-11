# EmailJS Setup Instructions

To enable email sending from your contact form, you need to set up EmailJS:

1. **Sign up for EmailJS**: Go to [https://www.emailjs.com/](https://www.emailjs.com/) and create a free account.

2. **Create an Email Service**:
   - Go to Email Services in your dashboard
   - Add a new service (Gmail, Outlook, etc.)
   - Connect your email account

3. **Create an Email Template**:
   - Go to Email Templates
   - Create a new template with these variables:
     - `{{from_name}}` - Customer's name
     - `{{from_email}}` - Customer's email
     - `{{subject}}` - Email subject
     - `{{message}}` - Customer's message
     - `{{reply_to}}` - Set this to `{{from_email}}` for replies

4. **Get your credentials**:
   - Service ID: From your email service
   - Template ID: From your email template
   - Public Key: From your account settings

5. **Update your `.env` file** with the actual values:
   ```
   VITE_EMAILJS_SERVICE_ID=your_actual_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_actual_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key
   ```

6. **Install dependencies**:
   ```bash
   pnpm install
   ```

The contact form will now send emails directly to your personal email (2201031000082@silveroakuni.ac.in) whenever someone submits the form!