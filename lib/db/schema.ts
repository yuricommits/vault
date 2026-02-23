import {
    pgTable,
    uuid,
    varchar,
    text,
    boolean,
    timestamp,
    integer,
    unique,
    primaryKey,
} from "drizzle-orm/pg-core";

// ─── Users ───────────────────────────────────────────────
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: text("password_hash"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Snippets ─────────────────────────────────────────────
export const snippets = pgTable("snippets", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description"),
    code: text("code").notNull(),
    language: varchar("language", { length: 50 }).notNull(),
    isPublic: boolean("is_public").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Tags ─────────────────────────────────────────────────
export const tags = pgTable(
    "tags",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        name: varchar("name", { length: 50 }).notNull(),
    },
    (table) => [unique().on(table.userId, table.name)],
);

// ─── Snippet Tags (Join Table) ────────────────────────────
export const snippetTags = pgTable(
    "snippet_tags",
    {
        snippetId: uuid("snippet_id")
            .notNull()
            .references(() => snippets.id, { onDelete: "cascade" }),
        tagId: uuid("tag_id")
            .notNull()
            .references(() => tags.id, { onDelete: "cascade" }),
    },
    (table) => [primaryKey({ columns: [table.snippetId, table.tagId] })],
);

// ─── Accounts (NextAuth) ──────────────────────────────────
export const accounts = pgTable(
    "accounts",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: varchar("type", { length: 50 }).notNull(),
        provider: varchar("provider", { length: 50 }).notNull(),
        providerAccountId: varchar("provider_account_id", {
            length: 255,
        }).notNull(),
        refreshToken: text("refresh_token"),
        accessToken: text("access_token"),
        expiresAt: integer("expires_at"),
        tokenType: varchar("token_type", { length: 50 }),
        scope: text("scope"),
        idToken: text("id_token"),
    },
    (table) => [unique().on(table.provider, table.providerAccountId)],
);

// ─── Sessions (NextAuth) ──────────────────────────────────
export const sessions = pgTable("sessions", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    sessionToken: text("session_token").notNull().unique(),
    expires: timestamp("expires").notNull(),
});

// ─── AI Usage ─────────────────────────────────────────────
export const aiUsage = pgTable(
    "ai_usage",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
        count: integer("count").default(0).notNull(),
    },
    (table) => [unique().on(table.userId, table.date)],
);
