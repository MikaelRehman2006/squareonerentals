# Square One Rentals Website

A modern rental property platform built with Next.js, MongoDB, and Cloudinary.

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git
- Access to project environment variables (contact project owner)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/squareonerentalswebsite.git
cd squareonerentalswebsite
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Get the environment variables:
- Contact the project owner for the following credentials:
  - MongoDB connection string
  - Google OAuth credentials
  - Cloudinary URL
  - NextAuth secret
- Add these credentials to your `.env.local` file

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- User authentication (Google OAuth)
- Property listing management
- Image upload with Cloudinary
- Advanced search and filtering
- Realtor partnerships
- Admin dashboard
- Career listings
- And more...

## Contributing

1. Create a new branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit:
```bash
git add .
git commit -m "Add your feature description"
```

3. Push to your branch:
```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request

## Important Notes

- The `.env` and `.env.local` files are gitignored for security
- Contact the project owner for the required environment variables
- Never commit sensitive information or API keys
- Follow the existing code style and patterns
- Write tests for new features

## Tech Stack

- Next.js 14
- TypeScript
- MongoDB
- NextAuth.js
- Material-UI
- Cloudinary
- Framer Motion
