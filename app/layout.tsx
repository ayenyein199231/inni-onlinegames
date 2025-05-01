import './globals.css';
import type { Metadata } from 'next';
import Navbar from './components/navbar';
import Footer from './components/footer';

export const metadata: Metadata = {
  title: 'inni Games',
  description: 'Play awesome games online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-900 text-white">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}