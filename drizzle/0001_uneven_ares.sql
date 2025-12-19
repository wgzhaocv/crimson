CREATE TYPE "public"."access_type" AS ENUM('public', 'password', 'private');--> statement-breakpoint
CREATE TABLE "share" (
	"id" bigint PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"access_type" "access_type" NOT NULL,
	"pin_hash" varchar(60),
	"content" text NOT NULL,
	"cover_id" bigint,
	"title" varchar(255),
	"description" text,
	"content_updated_at" timestamp DEFAULT now() NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "share_daily_stat" (
	"share_id" bigint NOT NULL,
	"stat_date" date NOT NULL,
	"unique_views" integer DEFAULT 0 NOT NULL,
	"total_views" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "share_view" (
	"id" bigint PRIMARY KEY NOT NULL,
	"share_id" bigint NOT NULL,
	"viewed_at" timestamp DEFAULT now() NOT NULL,
	"ip_hash" varchar(64),
	"user_agent" text,
	"referer" text
);
--> statement-breakpoint
ALTER TABLE "share" ADD CONSTRAINT "share_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "share_daily_stat" ADD CONSTRAINT "share_daily_stat_share_id_share_id_fk" FOREIGN KEY ("share_id") REFERENCES "public"."share"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "share_view" ADD CONSTRAINT "share_view_share_id_share_id_fk" FOREIGN KEY ("share_id") REFERENCES "public"."share"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "share_ownerId_createdAt_idx" ON "share" USING btree ("owner_id","created_at");--> statement-breakpoint
CREATE INDEX "share_accessType_idx" ON "share" USING btree ("access_type");--> statement-breakpoint
CREATE INDEX "share_createdAt_idx" ON "share" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "share_viewCount_idx" ON "share" USING btree ("view_count");--> statement-breakpoint
CREATE INDEX "shareDailyStat_statDate_idx" ON "share_daily_stat" USING btree ("stat_date");--> statement-breakpoint
CREATE INDEX "shareView_shareId_viewedAt_idx" ON "share_view" USING btree ("share_id","viewed_at");--> statement-breakpoint
CREATE INDEX "shareView_shareId_date_idx" ON "share_view" USING btree ("share_id","viewed_at");