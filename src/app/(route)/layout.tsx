import type { Metadata } from 'next';
import '@/app/_styles/globals.css';
import { Black_Han_Sans } from 'next/font/google';
import TanstackQueryProvider from '../_utils/query/TanstackQueryProvider';

const blackHansSans = Black_Han_Sans({
  variable: '--font-black-han-sans',
  weight: ['400'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Chzzk-Clone',
  description: 'chzzk clone app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${blackHansSans.variable} antialiased`}>
        <TanstackQueryProvider>
          <div id="portal" />
          {children}
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
