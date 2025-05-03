NextJS Bookstore with AWS Amplify
A full-featured online bookstore built with Next.js, AWS Amplify, and Stripe for payments. This application demonstrates a complete e-commerce solution with authentication, product catalog, shopping cart, checkout process, and order management.
Features

🔐 User authentication with AWS Amplify
📚 Book catalog with search functionality
🛒 Shopping cart with local storage persistence
💳 Secure checkout process using Stripe
📱 Responsive design with Tailwind CSS
🔒 Security features (CSRF protection, input sanitization)
🌐 API Gateway integration for backend services

Prerequisites

Node.js 18.x or higher
npm 9.x or higher
AWS account (for Amplify services)
Stripe account (for payment processing)

Installation

Clone the repository:

bashgit clone <repository-url>
cd bookstore

Install dependencies:

bashnpm install

Set up environment variables:

Create a .env file in the root directory with the following variables:
bash# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# API Gateway
API_GATEWAY_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod
API_KEY=your_api_key

# Base URL for your application
NEXT_PUBLIC_BASE_URL=http://localhost:3000

Initialize AWS Amplify:

bashnpm install -g @aws-amplify/cli
amplify init
Follow the prompts to configure your Amplify project.

Add Amplify authentication:

bashamplify add auth
Choose the default configuration or customize as needed.

Push Amplify changes to AWS:

bashamplify push
This will create the necessary AWS resources and generate the amplify_outputs.json file.
Running the Application
Development Mode
bashnpm run dev
The application will be available at http://localhost:3000.
Production Build
bashnpm run build
npm start
Deployment with AWS Amplify

Connect your repository to AWS Amplify:

bashamplify add hosting

Deploy the application:

bashamplify publish
Project Structure

app/: Next.js app directory with page routes and API routes

api/: API endpoints for checkout, search, and order management
books/: Book listing and detail pages
cart/: Shopping cart page
checkout/: Checkout and order confirmation pages
context/: React context providers (CartContext)


components/: Reusable React components
lib/: API client and utilities
public/: Static assets
utils/: Utility functions for CSRF protection, sanitization, etc.
amplify/: AWS Amplify configuration and resources

Security Features

CSRF token protection for form submissions
Input sanitization for user inputs
Content Security Policy headers
HTTPS-only cookies
Rate limiting protection

AWS Services Used

AWS Amplify for authentication and hosting
API Gateway for backend APIs
Lambda functions for serverless backend
DynamoDB for order storage
S3 for book images

Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
License
This project is licensed under the MIT License - see the LICENSE file for details.
