CREATE TABLE "news_articles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"content" text NOT NULL,
	"category" text NOT NULL,
	"source" text NOT NULL,
	"source_url" text,
	"image_url" text,
	"published_at" timestamp DEFAULT now() NOT NULL,
	"featured" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "quiz_submissions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"respondent_name" text NOT NULL,
	"respondent_email" text NOT NULL,
	"company_name" text,
	"answers" jsonb NOT NULL,
	"total_score" integer NOT NULL,
	"max_score" integer NOT NULL,
	"percent_score" integer NOT NULL,
	"risk_level" text NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
