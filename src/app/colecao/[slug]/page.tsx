import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CollectionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const collections: { [key: string]: { title: string; description: string } } = {
  "my-life-my-style": {
    title: "My Life My Style",
    description: "ORIGINAL COLLECTION | STREET ART"
  },
  "immortals": {
    title: "Immortals",
    description: "COLEETION | INK SERIES"
  },
  "colecao-3": {
    title: "3ª Coleção",
    description: "COLEETION | EM BREVE"
  },
  "colecao-4": {
    title: "4ª Coleção",
    description: "COLEETION | EM BREVE"
  }
};

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const collection = collections[resolvedParams.slug];
  
  if (!collection) {
    return {
      title: "Coleção não encontrada | Thiago Design Cruz"
    };
  }

  return {
    title: `${collection.title} | Thiago Design Cruz`,
    description: `Explore a coleção ${collection.title} - ${collection.description}`
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const resolvedParams = await params;
  const collection = collections[resolvedParams.slug];

  if (!collection) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {collection.title}
          </h1>
          <p className="text-xl text-gray-600 uppercase tracking-wide">
            {collection.description}
          </p>
          <div className="w-20 h-1 bg-yellow-500 mx-auto mt-6"></div>
        </div>

        {/* Content */}
        <div className="text-center py-20">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              Em breve os produtos desta coleção
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Estamos trabalhando para trazer os melhores produtos da coleção {collection.title} para você. 
              Fique de olho nas novidades!
            </p>
            
            {/* Back to Home */}
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3 bg-yellow-500 text-white font-bold rounded-full hover:brightness-110 transition-all"
            >
              Voltar para a página inicial
            </Link>
          </div>
        </div>

        {/* Placeholder for future product listing */}
        <div className="mt-20 p-8 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-500">
            Área reservada para listagem de produtos da coleção
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Integração com catálogo será implementada próximamente
          </p>
        </div>
      </div>
    </div>
  );
}
