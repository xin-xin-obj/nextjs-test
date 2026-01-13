// import { mysqlTable ,int, varchar } from "drizzle-orm/mysql-core";
// export const users = mysqlTable("users", {
//     id: int("id").primaryKey().autoincrement(),
//     email: varchar("email", { length: 255 }).notNull().unique(),
//     name: varchar("name", { length: 255 }).notNull(),
//     age: int("age").notNull(),
//     fullName: varchar("fullName", { length: 255 }).notNull()
// })
// mysql  没有schema 说法，不能这么用  npx drizzle-kit studio 失败 报错
// export const posts = mysqlSchema('custome_posts')
//     .table('posts', {
//         id: int("id").primaryKey().autoincrement(),
//         title: varchar("title", { length: 255 }).notNull(),
//         content: varchar("content", { length: 1000 }).notNull(),
//         authorId: int("authorId").notNull()
//     })
// export const posts = mysqlTable('posts', {
//     id: int("id").primaryKey().autoincrement(),
//     title: varchar("title", { length: 255 }).notNull(),
//     content: varchar("content", { length: 1000 }).notNull(),
//     authorId: int("authorId").notNull()
// });



import {
  boolean,
  int,
  timestamp,
  mysqlTable,
  primaryKey,
  varchar,
} from "drizzle-orm/mysql-core"
import { relations } from "drizzle-orm"
import mysql from "mysql2/promise"
import { drizzle } from "drizzle-orm/mysql2"
import type { AdapterAccount } from "next-auth/adapters"
import { createSelectSchema } from 'drizzle-zod';


 
// export const connection = await mysql.createConnection({
//   host: "host",
//   user: "user",
//   password: "password",
//   database: "database",
// })
 
// export const db = drizzle(connection)
 
export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }),
  image: varchar("image", { length: 255 }),
})
 
export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: varchar("access_token", { length: 255 }),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: varchar("id_token", { length: 2048 }),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)
 
export const sessions = mysqlTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})
 
export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
)
 
export const authenticators = mysqlTable(
  "authenticator",
  {
    credentialID: varchar("credentialID", { length: 255 }).notNull().unique(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    credentialPublicKey: varchar("credentialPublicKey", {
      length: 255,
    }).notNull(),
    counter: int("counter").notNull(),
    credentialDeviceType: varchar("credentialDeviceType", {
      length: 255,
    }).notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: varchar("transports", { length: 255 }),
  },
  (authenticator) => ({
    compositePk: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
)

// posts 表定义
export const posts = mysqlTable('post', {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: varchar("title", { length: 255 }).notNull(),
  content: varchar("content", { length: 1000 }),
  authorId: varchar("authorId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { mode: "date" }).$defaultFn(() => new Date()),
})

// 定义 users 和 posts 之间的关系
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}))

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}))

export const userSelectSchema = createSelectSchema(users)