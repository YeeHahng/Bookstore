# NextJS Bookstore with AWS Amplify

A full-featured online bookstore built with Next.js, AWS Amplify, and Stripe for payments. This application demonstrates a complete e-commerce solution with authentication, product catalog, shopping cart, checkout process, and order management.

## Features

- 🔐 User authentication with AWS Amplify
- 📚 Book catalog with search functionality
- 🛒 Shopping cart with local storage persistence
- 💳 Secure checkout process using Stripe
- 📱 Responsive design with Tailwind CSS
- 🔒 Security features (CSRF protection, input sanitization)
- 🌐 API Gateway integration for backend services

## Setup Instructions

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation Steps

1. Clone the repository:

```bash
git clone <repository-url>
cd bookstore
```

2. Install dependencies:

```bash
npm install
```

3. Copy your `amplify_outputs.json` file to the root directory:
   - This file contains your AWS Amplify configuration
   - It should be generated from your AWS Amplify console setup



### Running the Application

#### Development Mode

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

#### Production Build

```bash
npm run build
npm start
```

## Project Structure

- `app/`: Next.js app directory with page routes and API routes
  - `api/`: API endpoints for checkout, search, and order management
  - `books/`: Book listing and detail pages
  - `cart/`: Shopping cart page
  - `checkout/`: Checkout and order confirmation pages
  - `context/`: React context providers (CartContext)
- `components/`: Reusable React components
- `lib/`: API client and utilities
- `public/`: Static assets
- `utils/`: Utility functions for CSRF protection, sanitization, etc.
- `amplify/`: AWS Amplify configuration and resources

## Troubleshooting

- If you encounter authentication issues, verify AWS Amplify is correctly configured
- For API errors, check your network configuration and make sure API Gateway is accessible
- For payment issues, ensure Stripe integration is properly set up

## Security Features

- CSRF token protection for form submissions
- Input sanitization for user inputs
- Content Security Policy headers
- HTTPS-only cookies
- Rate limiting protection

## License

This project is licensed under the MIT License - see the LICENSE file for details.