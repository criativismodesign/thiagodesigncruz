import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@thiagodesigncruz.com.br" },
    update: {},
    create: {
      name: "Thiago Admin",
      email: "admin@thiagodesigncruz.com.br",
      password: adminPassword,
      role: "admin",
    },
  });
  console.log("Admin user created:", admin.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "camisetas" },
      update: {},
      create: {
        name: "Camisetas",
        slug: "camisetas",
        description: "Camisetas personalizadas com estampas exclusivas",
        image: "/images/categories/camisetas.jpg",
      },
    }),
    prisma.category.upsert({
      where: { slug: "mousepads" },
      update: {},
      create: {
        name: "Mouse Pads",
        slug: "mousepads",
        description: "Mouse pads personalizados de alta qualidade",
        image: "/images/categories/mousepads.jpg",
      },
    }),
    prisma.category.upsert({
      where: { slug: "personalizados" },
      update: {},
      create: {
        name: "Personalizados",
        slug: "personalizados",
        description: "Crie seu próprio design exclusivo",
        image: "/images/categories/personalizados.jpg",
      },
    }),
  ]);
  console.log("Categories created:", categories.length);

  // Create products
  const products = [
    {
      nome: "Camiseta Nebulosa Cósmica",
      slug: "camiseta-nebulosa-cosmica",
      descricaoCurta:
        "Uma explosão de cores inspirada nas nebulosas do universo. Estampa em alta definição com tecnologia DTF que garante durabilidade e cores vibrantes mesmo após diversas lavagens.",
      precoAtual: 89.9,
      precoDe: 119.9,
      tipo: "camiseta",
      categoria: "avulso",
      cores: ["Preto", "Branco", "Azul Marinho"],
      status: "ativo",
    },
    {
      nome: "Camiseta Dragão Oriental",
      slug: "camiseta-dragao-oriental",
      descricaoCurta:
        "Design inspirado na arte oriental com um dragão majestoso. Perfeita para quem aprecia a cultura asiática e quer se destacar com estilo.",
      precoAtual: 99.9,
      precoDe: 139.9,
      tipo: "camiseta",
      categoria: "avulso",
      cores: ["Preto", "Vermelho"],
      status: "ativo",
    },
    {
      nome: "Camiseta Samurai Cyber",
      slug: "camiseta-samurai-cyber",
      descricaoCurta:
        "Fusão de tradição e futuro com um samurai em estilo cyberpunk. Arte digital exclusiva com detalhes neon sobre tecido premium.",
      precoAtual: 109.9,
      precoDe: null,
      tipo: "camiseta",
      categoria: "avulso",
      cores: ["Preto"],
      status: "ativo",
    },
    {
      nome: "Camiseta Dragon Flame",
      slug: "camiseta-dragon-flame",
      descricaoCurta:
        "Dragão flamejante em estilo japonês com detalhes em vermelho e preto. Estampa impactante com acabamento premium.",
      precoAtual: 89.9,
      precoDe: 119.9,
      tipo: "camiseta",
      categoria: "avulso",
      cores: ["Preto", "Vermelho"],
      status: "ativo",
    },
    {
      nome: "Camiseta Lobo Geométrico",
      slug: "camiseta-lobo-geometrico",
      descricaoCurta:
        "Design minimalista com formas geométricas formando a silhueta de um lobo. Estampa sofisticada para quem aprecia arte moderna.",
      precoAtual: 79.9,
      precoDe: 99.9,
      tipo: "camiseta",
      categoria: "avulso",
      cores: ["Preto", "Cinza", "Branco"],
      status: "ativo",
    },
    {
      nome: "Camiseta Skull Floral",
      slug: "camiseta-skull-floral",
      descricaoCurta:
        "Caveira decorada com flores em estilo old school. Contraste entre o sombrio e o delicado, perfeito para quem tem personalidade.",
      precoAtual: 89.9,
      precoDe: null,
      tipo: "camiseta",
      categoria: "avulso",
      cores: ["Preto", "Branco"],
      status: "ativo",
    },
    {
      nome: "Camiseta Astronauta Lost",
      slug: "camiseta-astronauta-lost",
      descricaoCurta:
        "Um astronauta perdido no espaço, flutuando entre planetas e estrelas. Arte surreal que desperta a imaginação e o senso de aventura.",
      precoAtual: 94.9,
      precoDe: 124.9,
      tipo: "camiseta",
      categoria: "avulso",
      cores: ["Preto", "Azul Marinho"],
      status: "ativo",
    },
    {
      nome: "Mouse Pad Aurora Boreal",
      slug: "mousepad-aurora-boreal",
      descricaoCurta:
        "Mouse pad premium com estampa da Aurora Boreal. Superfície de tecido de alta precisão com base de borracha antiderrapante. Tamanho: 40x30cm.",
      precoAtual: 59.9,
      precoDe: 79.9,
      tipo: "mousepad",
      categoria: "avulso",
      cores: [],
      status: "ativo",
    },
    {
      nome: "Mouse Pad Galáxia Neon",
      slug: "mousepad-galaxia-neon",
      descricaoCurta:
        "Cores vibrantes em neon sobre fundo escuro espacial. Perfeito para setups gamer com iluminação RGB. Superfície speed para movimentos rápidos.",
      precoAtual: 69.9,
      precoDe: null,
      tipo: "mousepad",
      categoria: "avulso",
      cores: [],
      status: "ativo",
    },
    {
      nome: "Mouse Pad Mapa Mundi Vintage",
      slug: "mousepad-mapa-mundi",
      descricaoCurta:
        "Mapa mundi em estilo vintage com detalhes dourados. Elegante e funcional, ideal para escritórios e home offices.",
      precoAtual: 54.9,
      precoDe: 69.9,
      tipo: "mousepad",
      categoria: "avulso",
      cores: [],
      status: "ativo",
    },
    {
      nome: "Mouse Pad Circuit Board",
      slug: "mousepad-circuit-board",
      descricaoCurta:
        "Design de placa de circuito neon com detalhes tecnológicos. Perfeito para programadores e entusiastas de tecnologia.",
      precoAtual: 49.9,
      precoDe: null,
      tipo: "mousepad",
      categoria: "avulso",
      cores: [],
      status: "ativo",
    },
    {
      nome: "Mouse Pad Minimalista Waves",
      slug: "mousepad-minimalista-waves",
      descricaoCurta:
        "Ondas minimalistas em tons de azul e roxo. Design clean e elegante que combina com qualquer setup.",
      precoAtual: 49.9,
      precoDe: null,
      tipo: "mousepad",
      categoria: "avulso",
      cores: [],
      status: "ativo",
    },
    {
      nome: "Mouse Pad Sakura Night",
      slug: "mousepad-sakura-night",
      descricaoCurta:
        "Cerejeiras japonesas sob um céu noturno estrelado. Arte delicada e atmosférica para quem aprecia a estética oriental.",
      precoAtual: 59.9,
      precoDe: 74.9,
      tipo: "mousepad",
      categoria: "avulso",
      cores: [],
      status: "ativo",
    },
  ];

  for (const product of products) {
    await prisma.produto.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }
  console.log("Products created:", products.length);

  // Create some reviews
  const allProducts = await prisma.produto.findMany();
  const reviewTexts = [
    { rating: 5, comment: "Qualidade incrível! A estampa ficou perfeita e o tecido é muito confortável." },
    { rating: 5, comment: "Superou minhas expectativas. Chegou antes do prazo e muito bem embalado." },
    { rating: 4, comment: "Muito bom! A cor é exatamente como na foto. Recomendo!" },
    { rating: 5, comment: "Já é a terceira vez que compro aqui. Qualidade sempre top!" },
    { rating: 4, comment: "Ótimo mouse pad, superfície lisa e boa aderência na mesa." },
  ];

  for (let i = 0; i < Math.min(allProducts.length, 5); i++) {
    await prisma.review.create({
      data: {
        rating: reviewTexts[i].rating,
        comment: reviewTexts[i].comment,
        produtoId: allProducts[i].id,
        userId: admin.id,
      },
    });
  }
  console.log("Reviews created");

  // Create HeroBanner slides
  await prisma.heroBanner.createMany({
    data: [
      {
        supertitulo: 'Coleção os "Immortals" 2026',
        titulo: 'Camisetas STYLE',
        descricao: 'VISTA O ESTILO DOS SOBREVIVENTES MAIS INSANOS DESSE DE TODOS OS TEMPOS. OS IMMORTALS AQUELES QUE SEMPRE SE LEVANTAM.',
        textoBotao: 'VER COLEÇÃO',
        linkBotao: '/colecao/immortals',
        ordem: 1,
        ativo: true,
      },
      { titulo: 'Slide 2', ordem: 2, ativo: true },
      { titulo: 'Slide 3', ordem: 3, ativo: true },
      { titulo: 'Slide 4', ordem: 4, ativo: true },
      { titulo: 'Slide 5', ordem: 5, ativo: true },
    ]
  });
  console.log("HeroBanner slides created");

  console.log("\n✅ Seed concluído com sucesso!");
  console.log("📧 Admin: admin@thiagodesigncruz.com.br");
  console.log("🔑 Senha: admin123");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
