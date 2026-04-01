import { Playfair_Display, Inter, Noto_Sans_KR } from 'next/font/google';

export const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '700', '900'],
});

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-kr',
  display: 'swap',
  weight: ['300', '400', '500', '700'],
});
