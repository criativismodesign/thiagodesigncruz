export function WebsiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Thiago Design Cruz",
    url: "https://thiagodesigncruz.com.br",
    description:
      "Crie suas próprias estampas! Camisetas e mouse pads com designs exclusivos.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://thiagodesigncruz.com.br/produtos?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Thiago Design Cruz",
    url: "https://thiagodesigncruz.com.br",
    logo: "https://thiagodesigncruz.com.br/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "contato@thiagodesigncruz.com.br",
      availableLanguage: "Portuguese",
    },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface ProductJsonLdProps {
  name: string;
  description: string;
  image: string;
  price: number;
  slug: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
}

export function ProductJsonLd({
  name,
  description,
  image,
  price,
  slug,
  rating,
  reviewCount,
  inStock = true,
}: ProductJsonLdProps) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    url: `https://thiagodesigncruz.com.br/produtos/${slug}`,
    brand: {
      "@type": "Brand",
      name: "Thiago Design Cruz",
    },
    offers: {
      "@type": "Offer",
      price: price.toFixed(2),
      priceCurrency: "BRL",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Thiago Design Cruz",
      },
      url: `https://thiagodesigncruz.com.br/produtos/${slug}`,
    },
  };

  if (rating && reviewCount) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.toFixed(1),
      reviewCount,
      bestRating: "5",
      worstRating: "1",
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FAQJsonLd({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
