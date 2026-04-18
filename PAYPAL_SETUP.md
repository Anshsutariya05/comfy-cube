# PayPal Integration Setup Guide

Your Comfy Cube project now has PayPal payment integration! Follow these steps to set it up:

## 1. Create a PayPal Developer Account

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Sign in with your PayPal account (create one if needed)
3. Navigate to **Dashboard** → **Apps & Credentials**

## 2. Create an Application

1. Click **Create App** button
2. Choose **Merchant** as the app type
3. Enter an app name (e.g., "Comfy Cube Shop")
4. Click **Create App**

## 3. Get Your Credentials

In the **Sandbox** environment:
- Find your app in the apps list
- Click on it to view details
- Under **Sandbox API Signature**, you'll see:
  - **Client ID** - Copy this value
  - **Secret** - Copy this value (this is also your App ID for now)

**Important**: Make sure you're in the **Sandbox** environment first for testing!

## 4. Update Your Environment Variables

Edit your `.env` file and replace the placeholder values:

```env
VITE_PAYPAL_CLIENT_ID=your_actual_client_id_here
VITE_PAYPAL_APP_ID=your_actual_secret_here
```

Example:
```env
VITE_PAYPAL_CLIENT_ID=AVFzlhEzxP2dT5k_pY9w-kLxMnQpRx...
VITE_PAYPAL_APP_ID=EJdxFz9zP2dT5k_pY9w-kLxMnQpRx...
```

## 5. Install Dependencies

Run the following command to install PayPal packages:

```bash
pnpm install
```

## 6. Test the Payment Flow

1. Start your development server: `pnpm dev`
2. Add items to your cart
3. Go to the Cart page
4. Click **Pay with PayPal** button
5. You'll be redirected to PayPal sandbox
6. Use the test credentials:
   - **Email**: sb-xxxxx@personal.example.com (provided by PayPal)
   - **Password**: Check your PayPal app for test account details

## 7. Implementation Details

The PayPal integration includes:

- **PayPalButton Component** (`src/components/PayPalButton.tsx`):
  - Handles PayPal payment flow
  - Manages order creation and capture
  - Stores orders in your Supabase database
  - Shows success/error notifications

- **PayPal Service** (`src/services/paypal.ts`):
  - `createPayPalOrder()` - Creates a new order
  - `capturePayPalOrder()` - Captures the order after approval
  - `storeOrder()` - Saves order details to database

- **Cart Integration** (`src/pages/Cart.tsx`):
  - PayPal button appears at checkout
  - Shows "Sign in to Checkout" for non-authenticated users
  - Clears cart and redirects after successful payment

## 8. Going Live

When you're ready to accept real payments:

1. Switch from **Sandbox** to **Production** in PayPal Dashboard
2. Get your production credentials
3. Update `.env` with production values
4. Test thoroughly before going live

## 9. Database Setup

Make sure your Supabase database has these tables:
- `orders` - Stores order information
- `order_items` - Stores items in each order
- `products` - Your product catalog

## 10. Troubleshooting

**"PayPal window didn't open"**
- Check your browser's popup blocker settings
- Ensure the button is clicked directly (not through JavaScript)

**"Payment failed"**
- Verify your Client ID is correct
- Check that you're using test accounts in Sandbox mode
- Review browser console for error messages

**"Order not stored in database"**
- Ensure user is logged in
- Check Supabase credentials in `.env`
- Verify your orders and order_items tables exist

## Support

For more information:
- [PayPal Checkout Documentation](https://developer.paypal.com/docs/checkout/)
- [PayPal SDK Reference](https://developer.paypal.com/sdk/js/reference/)
- [Sandbox Testing](https://developer.paypal.com/tools/sandbox/)
