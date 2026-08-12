import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Clear existing data in correct relational order
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users
  const adminPassword = await bcrypt.hash("admin123", 12);
  const userPassword = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const john = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: userPassword,
      role: "USER",
    },
  });

  const jane = await prisma.user.create({
    data: {
      name: "Jane Smith",
      email: "jane@example.com",
      password: userPassword,
      role: "USER",
    },
  });

  console.log(`✅ Created ${3} users (1 ADMIN, 2 USER)`);

  // 3. Create Categories
  const catElectronics = await prisma.category.create({
    data: {
      name: "Electronics",
      slug: "electronics",
    },
  });

  const catFashion = await prisma.category.create({
    data: {
      name: "Fashion & Apparel",
      slug: "fashion-apparel",
    },
  });

  const catHome = await prisma.category.create({
    data: {
      name: "Home & Kitchen",
      slug: "home-kitchen",
    },
  });

  const catBooks = await prisma.category.create({
    data: {
      name: "Books & Media",
      slug: "books-media",
    },
  });

  console.log(`✅ Created ${4} categories`);

  // 4. Create Products
  const headphones = await prisma.product.create({
    data: {
      title: "Wireless Noise-Canceling Headphones",
      description: "High-fidelity audio with active noise cancellation and 30-hour battery life.",
      price: 199.99,
      stock: 25,
      status: "ACTIVE",
      categoryId: catElectronics.id,
    },
  });

  const keyboard = await prisma.product.create({
    data: {
      title: "Mechanical RGB Gaming Keyboard",
      description: "Tactile mechanical switches with customizable RGB backlighting.",
      price: 89.5,
      stock: 40,
      status: "ACTIVE",
      categoryId: catElectronics.id,
    },
  });

  const chair = await prisma.product.create({
    data: {
      title: "Ergonomic Office Chair",
      description: "Adjustable lumbar support with breathable mesh backrest for long hours.",
      price: 149.0,
      stock: 15,
      status: "ACTIVE",
      categoryId: catHome.id,
    },
  });

  const jacket = await prisma.product.create({
    data: {
      title: "Premium Leather Jacket",
      description: "Handcrafted genuine leather jacket with classic bomber styling.",
      price: 120.0,
      stock: 10,
      status: "ACTIVE",
      categoryId: catFashion.id,
    },
  });

  const book = await prisma.product.create({
    data: {
      title: "Clean Code & Software Architecture Guide",
      description: "Master clean code principles, design patterns, and scalable architecture.",
      price: 45.0,
      stock: 50,
      status: "ACTIVE",
      categoryId: catBooks.id,
    },
  });

  console.log(`✅ Created ${5} products`);

  // 5. Create Reviews
  await prisma.review.createMany({
    data: [
      {
        rating: 5,
        comment: "Outstanding sound quality and super comfortable for travel!",
        userId: john.id,
        productId: headphones.id,
      },
      {
        rating: 4,
        comment: "Great tactile feel, clicky switches are responsive.",
        userId: jane.id,
        productId: keyboard.id,
      },
      {
        rating: 5,
        comment: "My back pain disappeared after using this chair. Worth every penny!",
        userId: john.id,
        productId: chair.id,
      },
    ],
  });

  console.log(`✅ Created ${3} reviews`);

  // 6. Create Orders with OrderItems
  const order1 = await prisma.order.create({
    data: {
      userId: john.id,
      total: 289.49,
      status: "COMPLETED",
      items: {
        create: [
          {
            productId: headphones.id,
            quantity: 1,
            price: 199.99,
          },
          {
            productId: keyboard.id,
            quantity: 1,
            price: 89.5,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: jane.id,
      total: 194.0,
      status: "PENDING",
      items: {
        create: [
          {
            productId: chair.id,
            quantity: 1,
            price: 149.0,
          },
          {
            productId: book.id,
            quantity: 1,
            price: 45.0,
          },
        ],
      },
    },
  });

  console.log(`✅ Created ${2} sample orders with order items`);
  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
