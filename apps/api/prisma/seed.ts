import { faker } from "@faker-js/faker";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function seed() {
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash("123456", 1);
  const [user, user1, user2] = await prisma.user.createManyAndReturn({
    data: [
      {
        name: "John Doe",
        email: "john@acme.com",
        passwordHash,
        avatarUrl: faker.image.avatar(),
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        passwordHash,
        avatarUrl: faker.image.avatar(),
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        passwordHash,
        avatarUrl: faker.image.avatar(),
      },
    ],
  });

  await prisma.organization.create({
    data: {
      name: "Acm Inc (Admin)",
      domain: "acme.com",
      slug: "acme-admin",
      avatarUrl: faker.image.avatar(),
      shouldAttachUsersByDomain: true,
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([user.id, user1.id, user2.id]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([user.id, user1.id, user2.id]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([user.id, user1.id, user2.id]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            { userId: user.id, role: "ADMIN" },
            { userId: user2.id, role: "MEMBER" },
            { userId: user1.id, role: "MEMBER" },
          ],
        },
      },
    },
  });

  await prisma.organization.create({
    data: {
      name: "Acm Inc (Member)",
      slug: "acme-member",
      avatarUrl: faker.image.avatar(),
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([user.id, user1.id, user2.id]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([user.id, user1.id, user2.id]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([user.id, user1.id, user2.id]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            { userId: user.id, role: "MEMBER" },
            { userId: user2.id, role: "ADMIN" },
            { userId: user1.id, role: "MEMBER" },
          ],
        },
      },
    },
  });

  await prisma.organization.create({
    data: {
      name: "Acm Inc (Billing)",
      slug: "acme-billing",
      avatarUrl: faker.image.avatar(),
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([user.id, user1.id, user2.id]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([user.id, user1.id, user2.id]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([user.id, user1.id, user2.id]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            { userId: user.id, role: "BILLING" },
            { userId: user2.id, role: "ADMIN" },
            { userId: user1.id, role: "MEMBER" },
          ],
        },
      },
    },
  });
}

seed().then(() => console.log("databse seeded"));
