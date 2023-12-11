import { sql } from '@vercel/postgres';
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/vercel-postgres';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    role: text('role').notNull(),
    isActive: boolean('isActive').default(true),
    password: text('password').notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex('email_idx').on(table.email),
  })
);

export const files = pgTable('files', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  displayName: text('displayName').notNull(),
  mimetype: text('mimetype').notNull(),
});

export const db = drizzle(sql);

export const news = pgTable(
  'news',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull().unique(),
    category: text('category').notNull(),
    publishedDate: date('publishedDate').notNull().defaultNow(),
    content: jsonb('content'),
    language: text('language').notNull(),
    thumbnailId: integer('thumbnailId').references(() => files.id),
  },
  (table) => ({
    categoryIdx: index('category_idx').on(table.category),
    languageIdx: index('language_idx').on(table.language),
  })
);
