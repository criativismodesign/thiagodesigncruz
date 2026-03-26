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
      name: "Camiseta Nebulosa Cósmica",
      slug: "camiseta-nebulosa-cosmica",
      description:
        "Uma explosão de cores inspirada nas nebulosas do universo. Estampa em alta definição com tecnologia DTF que garante durabilidade e cores vibrantes mesmo após diversas lavagens.",
      price: 89.9,
      comparePrice: 119.9,
      images: JSON.stringify(["/images/products/nebulosa-1.jpg", "/images/products/nebulosa-2.jpg"]),
      categoryId: categories[0].id,
      sizes: JSON.stringify(["P", "M", "G", "GG"]),
      colors: JSON.stringify(["Preto", "Branco", "Azul Marinho"]),
      stock: 50,
      featured: true,
      type: "camiseta",
    },
    {
      name: "Camiseta Dragão Oriental",
      slug: "camiseta-dragao-oriental",
      description:
        "Design inspirado na arte oriental com um dragão majestoso. Perfeita para quem aprecia a cultura asiática e quer se destacar com estilo.",
      price: 99.9,
      comparePrice: 139.9,
      images: JSON.stringify(["/images/products/dragao-1.jpg", "/images/products/dragao-2.jpg"]),
      categoryId: categories[0].id,
      sizes: JSON.stringify(["P", "M", "G", "GG"]),
      colors: JSON.stringify(["Preto", "Vermelho"]),
      stock: 35,
      featured: true,
      type: "camiseta",
    },
    {
      name: "Camiseta Samurai Cyber",
      slug: "camiseta-samurai-cyber",
      description:
        "Fusão de tradição e futuro com um samurai em estilo cyberpunk. Arte digital exclusiva com detalhes neon sobre tecido premium.",
      price: 109.9,
      comparePrice: null,
      images: JSON.stringify(["/images/products/samurai-1.jpg"]),
      categoryId: categories[0].id,
      sizes: JSON.stringify(["P", "M", "G", "GG", "XGG"]),
      colors: JSON.stringify(["Preto"]),
      stock: 40,
      featured: true,
      type: "camiseta",
    },
    {
      name: "Camiseta Lobo Geométrico",
      slug: "camiseta-lobo-geometrico",
      description:
        "Design minimalista com formas geométricas formando a silhueta de um lobo. Estampa sofisticada para quem aprecia arte moderna.",
      price: 79.9,
      comparePrice: 99.9,
      images: JSON.stringify(["/images/products/lobo-1.jpg"]),
      categoryId: categories[0].id,
      sizes: JSON.stringify(["P", "M", "G", "GG"]),
      colors: JSON.stringify(["Preto", "Cinza", "Branco"]),
      stock: 60,
      featured: false,
      type: "camiseta",
    },
    {
      name: "Camiseta Skull Floral",
      slug: "camiseta-skull-floral",
      description:
        "Caveira decorada com flores em estilo old school. Contraste entre o sombrio e o delicado, perfeito para quem tem personalidade.",
      price: 89.9,
      comparePrice: null,
      images: JSON.stringify(["/images/products/skull-1.jpg"]),
      categoryId: categories[0].id,
      sizes: JSON.stringify(["P", "M", "G", "GG"]),
      colors: JSON.stringify(["Preto", "Branco"]),
      stock: 45,
      featured: false,
      type: "camiseta",
    },
    {
      name: "Camiseta Astronauta Lost",
      slug: "camiseta-astronauta-lost",
      description:
        "Um astronauta perdido no espaço, flutuando entre planetas e estrelas. Arte surreal que desperta a imaginação e o senso de aventura.",
      price: 94.9,
      comparePrice: 124.9,
      images: JSON.stringify(["/images/products/astronauta-1.jpg"]),
      categoryId: categories[0].id,
      sizes: JSON.stringify(["P", "M", "G", "GG"]),
      colors: JSON.stringify(["Preto", "Azul Marinho"]),
      stock: 30,
      featured: true,
      type: "camiseta",
    },
    {
      name: "Mouse Pad Aurora Boreal",
      slug: "mousepad-aurora-boreal",
      description:
        "Mouse pad premium com estampa da Aurora Boreal. Superfície de tecido de alta precisão com base de borracha antiderrapante. Tamanho: 40x30cm.",
      price: 59.9,
      comparePrice: 79.9,
      images: JSON.stringify(["/images/products/mp-aurora-1.jpg"]),
      categoryId: categories[1].id,
      sizes: JSON.stringify(["Padrão (40x30cm)", "XL (80x40cm)"]),
      colors: JSON.stringify([]),
      stock: 80,
      featured: true,
      type: "mousepad",
    },
    {
      name: "Mouse Pad Galáxia Neon",
      slug: "mousepad-galaxia-neon",
      description:
        "Cores vibrantes em neon sobre fundo escuro espacial. Perfeito para setups gamer com iluminação RGB. Superfície speed para movimentos rápidos.",
      price: 69.9,
      comparePrice: null,
      images: JSON.stringify(["/images/products/mp-galaxia-1.jpg"]),
      categoryId: categories[1].id,
      sizes: JSON.stringify(["Padrão (40x30cm)", "XL (80x40cm)"]),
      colors: JSON.stringify([]),
      stock: 55,
      featured: true,
      type: "mousepad",
    },
    {
      name: "Mouse Pad Mapa Mundi Vintage",
      slug: "mousepad-mapa-mundi",
      description:
        "Mapa mundi em estilo vintage com detalhes dourados. Elegante e funcional, ideal para escritórios e home offices.",
      price: 54.9,
      comparePrice: 69.9,
      images: JSON.stringify(["/images/products/mp-mapa-1.jpg"]),
      categoryId: categories[1].id,
      sizes: JSON.stringify(["Padrão (40x30cm)"]),
      colors: JSON.stringify([]),
      stock: 70,
      featured: false,
      type: "mousepad",
    },
    {
      name: "Mouse Pad Circuit Board",
      slug: "mousepad-circuit-board",
      description:
        "Design inspirado em placas de circuito com linhas verdes sobre fundo escuro. Para amantes de tecnologia e hardware.",
      price: 64.9,
      comparePrice: null,
      images: JSON.stringify(["/images/products/mp-circuit-1.jpg"]),
      categoryId: categories[1].id,
      sizes: JSON.stringify(["Padrão (40x30cm)", "XL (80x40cm)"]),
      colors: JSON.stringify([]),
      stock: 45,
      featured: false,
      type: "mousepad",
    },
    {
      name: "Mouse Pad Minimalista Waves",
      slug: "mousepad-minimalista-waves",
      description:
        "Ondas minimalistas em tons de azul e roxo. Design clean e elegante que combina com qualquer setup.",
      price: 49.9,
      comparePrice: null,
      images: JSON.stringify(["/images/products/mp-waves-1.jpg"]),
      categoryId: categories[1].id,
      sizes: JSON.stringify(["Padrão (40x30cm)"]),
      colors: JSON.stringify([]),
      stock: 90,
      featured: false,
      type: "mousepad",
    },
    {
      name: "Mouse Pad Sakura Night",
      slug: "mousepad-sakura-night",
      description:
        "Cerejeiras japonesas sob um céu noturno estrelado. Arte delicada e atmosférica para quem aprecia a estética oriental.",
      price: 59.9,
      comparePrice: 74.9,
      images: JSON.stringify(["/images/products/mp-sakura-1.jpg"]),
      categoryId: categories[1].id,
      sizes: JSON.stringify(["Padrão (40x30cm)", "XL (80x40cm)"]),
      colors: JSON.stringify([]),
      stock: 65,
      featured: true,
      type: "mousepad",
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }
  console.log("Products created:", products.length);

  // Create some reviews
  const allProducts = await prisma.product.findMany();
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
        productId: allProducts[i].id,
        userId: admin.id,
      },
    });
  }
  console.log("Reviews created");

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
