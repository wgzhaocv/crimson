import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  integer,
  index,
  varchar,
  date,
  pgEnum,
  bigint,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const accessTypeEnum = pgEnum("access_type", [
  "public",
  "password",
  "private",
]);

// 分享表
export const share = pgTable(
  "share",
  {
    id: bigint("id", { mode: "bigint" }).primaryKey(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessType: accessTypeEnum("access_type").notNull(),
    pinHash: varchar("pin_hash", { length: 60 }),
    content: text("content").notNull(),
    coverId: bigint("cover_id", { mode: "bigint" }), // 截图微服务的雪花ID
    title: varchar("title", { length: 255 }),
    description: text("description"),
    contentUpdatedAt: timestamp("content_updated_at").defaultNow().notNull(),
    viewCount: integer("view_count").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("share_ownerId_createdAt_idx").on(table.ownerId, table.createdAt),
    index("share_accessType_idx").on(table.accessType),
    index("share_createdAt_idx").on(table.createdAt),
    index("share_viewCount_idx").on(table.viewCount),
  ],
);

// 访问记录表
export const shareView = pgTable(
  "share_view",
  {
    id: bigint("id", { mode: "bigint" }).primaryKey(),
    shareId: bigint("share_id", { mode: "bigint" })
      .notNull()
      .references(() => share.id, { onDelete: "cascade" }),
    viewedAt: timestamp("viewed_at").defaultNow().notNull(),
    ipHash: varchar("ip_hash", { length: 64 }),
    userAgent: text("user_agent"),
    referer: text("referer"),
  },
  (table) => [
    index("shareView_shareId_viewedAt_idx").on(table.shareId, table.viewedAt),
    index("shareView_shareId_date_idx").on(table.shareId, table.viewedAt),
  ],
);

// 每日统计表
export const shareDailyStat = pgTable(
  "share_daily_stat",
  {
    shareId: bigint("share_id", { mode: "bigint" })
      .notNull()
      .references(() => share.id, { onDelete: "cascade" }),
    statDate: date("stat_date").notNull(),
    uniqueViews: integer("unique_views").default(0).notNull(),
    totalViews: integer("total_views").default(0).notNull(),
  },
  (table) => [
    { pk: [table.shareId, table.statDate] },
    index("shareDailyStat_statDate_idx").on(table.statDate),
  ],
);

// Relations
export const shareRelations = relations(share, ({ one, many }) => ({
  owner: one(user, {
    fields: [share.ownerId],
    references: [user.id],
  }),
  views: many(shareView),
  dailyStats: many(shareDailyStat),
}));

export const shareViewRelations = relations(shareView, ({ one }) => ({
  share: one(share, {
    fields: [shareView.shareId],
    references: [share.id],
  }),
}));

export const shareDailyStatRelations = relations(shareDailyStat, ({ one }) => ({
  share: one(share, {
    fields: [shareDailyStat.shareId],
    references: [share.id],
  }),
}));
