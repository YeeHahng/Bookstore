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
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
