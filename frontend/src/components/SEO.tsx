import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  jsonLd?: object;
}

const SEO: React.FC<SEOProps> = ({
  title = 'PrediVersa - Plataforma Educativa',
  description = 'Plataforma educativa integral para diversidad e inclusión. Aprende, crece y transforma tu perspectiva educativa.',
  keywords = 'educación, diversidad, inclusión, plataforma educativa, cursos online, aprendizaje',
  author = 'PrediVersa Team',
  canonical,
  ogTitle,
  ogDescription,
  ogImage = '/logo512.png',
  ogUrl,
  twitterCard = 'summary_large_image',
  twitterSite = '@prediversa',
  jsonLd,
}) => {
  useEffect(() => {
    // Actualizar título
    document.title = title;

    // Función helper para crear/actualizar meta tags
    const updateMetaTag = (
      name: string,
      content: string,
      property?: boolean
    ) => {
      const selector = property
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      let element = document.querySelector(selector);

      if (!element) {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    // Meta tags básicos
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1');

    // Meta tags para SEO
    updateMetaTag('language', 'es');
    updateMetaTag('revisit-after', '7 days');
    updateMetaTag('rating', 'general');
    updateMetaTag('distribution', 'global');

    // Open Graph tags
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:title', ogTitle || title, true);
    updateMetaTag('og:description', ogDescription || description, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:site_name', 'PrediVersa', true);
    updateMetaTag('og:locale', 'es_ES', true);

    if (ogUrl) {
      updateMetaTag('og:url', ogUrl, true);
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', twitterCard);
    updateMetaTag('twitter:site', twitterSite);
    updateMetaTag('twitter:title', ogTitle || title);
    updateMetaTag('twitter:description', ogDescription || description);
    updateMetaTag('twitter:image', ogImage);

    // Canonical URL
    if (canonical) {
      let linkElement = document.querySelector('link[rel="canonical"]');
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'canonical');
        document.head.appendChild(linkElement);
      }
      linkElement.setAttribute('href', canonical);
    }

    // JSON-LD structured data
    if (jsonLd) {
      let scriptElement = document.querySelector(
        'script[type="application/ld+json"]'
      );
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(jsonLd);
    }

    // Cleanup function
    return () => {
      // Restaurar título por defecto si es necesario
      if (title !== 'PrediVersa - Plataforma Educativa') {
        document.title = 'PrediVersa - Plataforma Educativa';
      }
    };
  }, [
    title,
    description,
    keywords,
    author,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    twitterCard,
    twitterSite,
    jsonLd,
  ]);

  return null; // Este componente no renderiza nada visible
};

// Hook personalizado para SEO
export const useSEO = (seoProps: SEOProps) => {
  useEffect(() => {
    SEO(seoProps);
    return () => {
      // Cleanup si es necesario
    };
  }, [seoProps]);
};

// Datos estructurados predefinidos
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PrediVersa',
  description: 'Plataforma educativa integral para diversidad e inclusión',
  url: 'https://prediversa.com',
  logo: 'https://prediversa.com/logo512.png',
  foundingDate: '2023',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-0123',
    contactType: 'customer service',
    email: 'contacto@prediversa.com',
    availableLanguage: ['Spanish', 'English'],
  },
  sameAs: [
    'https://facebook.com/prediversa',
    'https://twitter.com/prediversa',
    'https://linkedin.com/company/prediversa',
  ],
};

export const educationalOrganizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'PrediVersa',
  description: 'Plataforma educativa integral para diversidad e inclusión',
  url: 'https://prediversa.com',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'España',
  },
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'certificate',
    educationalLevel: 'all levels',
  },
};

export const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'PrediVersa',
  description: 'Plataforma educativa integral para diversidad e inclusión',
  url: 'https://prediversa.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://prediversa.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export const breadcrumbSchema = (
  items: Array<{ name: string; url: string }>
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const courseSchema = (course: {
  name: string;
  description: string;
  provider: string;
  url: string;
  duration?: string;
  instructor?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: course.name,
  description: course.description,
  provider: {
    '@type': 'Organization',
    name: course.provider,
  },
  url: course.url,
  ...(course.duration && { timeRequired: course.duration }),
  ...(course.instructor && {
    instructor: {
      '@type': 'Person',
      name: course.instructor,
    },
  }),
});

export default SEO;
