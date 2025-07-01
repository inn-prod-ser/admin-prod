import { Space_Grotesk, IBM_Plex_Sans } from "next/font/google";

export const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-imb-plex-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "700"],
});
