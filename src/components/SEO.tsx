import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: Record<string, any>;
}

export function SEO({
  title = "Preschools Eswatini | Find the Best Early Education",
  description = "Discover, compare, and enroll in the best preschools and daycares across Eswatini. Empowering parents and educators with a modern platform.",
  keywords = "preschools, eswatini, daycares, mbabane, manzini, early education, preschool directory, kindergarten",
  image = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200",
  url = "https://preschools.sz",
  type = "website",
  schema
}: SEOProps) {
  
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "url": "https://preschools.sz",
    "logo": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=200",
    "name": "Preschools Eswatini",
    "description": "Discover, compare, and enroll in the best preschools across Eswatini",
    "sameAs": [
      "https://facebook.com/preschoolssz",
      "https://twitter.com/preschoolssz"
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schema || orgSchema)}
      </script>
    </Helmet>
  );
}
