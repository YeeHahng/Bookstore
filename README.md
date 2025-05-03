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

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- AWS account (for Amplify services)
- Stripe account (for payment processing)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd bookstore
```

2. Install dependencies:

```bash
npm install
```

3. Initialize AWS Amplify:

```bash
npm install -g @aws-amplify/cli
amplify init
```

Follow the prompts to configure your Amplify project.

4. Add Amplify authentication:

```bash
amplify add auth
```

Choose the default configuration or customize as needed.

5. Push Amplify changes to AWS:

```bash
amplify push
```

This will create the necessary AWS resources and generate the `amplify_outputs.json` file.

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

## Deployment with AWS Amplify

1. Connect your repository to AWS Amplify:

```bash
amplify add hosting
```

2. Deploy the application:

```bash
amplify publish
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

## Security Features

- CSRF token protection for form submissions
- Input sanitization for user inputs
- Content Security Policy headers
- HTTPS-only cookies
- Rate limiting protection

## AWS Services Used

- AWS Amplify for authentication and hosting
- API Gateway for backend APIs
- Lambda functions for serverless backend
- DynamoDB for order storage
- S3 for book images

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
