import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CosmicBadge from '@/components/CosmicBadge';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Modern Blog Platform',
  description: 'Discover insightful articles on technology, travel, and lifestyle.',
  keywords: ['blog', 'technology', 'travel', 'lifestyle', 'articles'],
  authors: [{ name: 'Modern Blog Team' }],
  openGraph: {
    title: 'Modern Blog Platform',
    description: 'Discover insightful articles on technology, travel, and lifestyle.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modern Blog Platform',
    description: 'Discover insightful articles on technology, travel, and lifestyle.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Access environment variable on server side
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string;

  return (
    <html lang="en">
      <head>
        {/* Console capture script for dashboard debugging */}
        <script src="/dashboard-console-capture.js"></script>
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          {/* Pass bucket slug as prop to client component */}
          <CosmicBadge bucketSlug={bucketSlug} />
        </div>
      </body>
    </html>
  );
}