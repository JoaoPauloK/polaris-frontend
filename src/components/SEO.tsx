import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
}

export default function SEO({
  title = 'Polaris - Plataforma para Fotógrafos Profissionais',
  description = 'Transforme suas fotos do Google Drive em galerias profissionais com marca d\'água. Seus clientes escolhem, você entrega. Gestão completa de projetos fotográficos.',
  keywords = 'fotografia profissional, galeria de fotos, google drive, seleção de fotos, fotógrafo, gestão de projetos, marca d\'água, clientes',
  image = '/og-image.jpg',
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  noIndex = false,
}: SEOProps) {
  const siteUrl = 'https://mypolaris.vercel.app';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author || 'Polaris'} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <meta name="language" content="pt-BR" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Polaris" />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Article Specific Tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#6366f1" />
      <meta name="msapplication-TileColor" content="#6366f1" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': 'Polaris',
          'description': description,
          'url': siteUrl,
          'applicationCategory': 'BusinessApplication',
          'operatingSystem': 'Web Browser',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'BRL',
            'description': 'Plataforma gratuita para fotógrafos'
          },
          'creator': {
            '@type': 'Organization',
            'name': 'Polaris'
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'Polaris'
          }
        })}
      </script>
    </Helmet>
  );
}