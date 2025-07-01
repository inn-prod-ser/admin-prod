export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
}

export const defaultSEO: SEOConfig = {
  title: "Mi Sitio Web",
  description: "Descripción principal del sitio",
  keywords: "keywords, principales, sitio",
  ogImage: "/default-og.jpg",
  ogType: "website",
  ogUrl: "https://yourwebsite.com",
};
