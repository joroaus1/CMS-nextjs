import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_businesses_hours_day" AS ENUM('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');
  CREATE TYPE "public"."enum_businesses_price_range" AS ENUM('$', '$$', '$$$', '$$$$');
  CREATE TYPE "public"."enum_businesses_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__businesses_v_version_hours_day" AS ENUM('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');
  CREATE TYPE "public"."enum__businesses_v_version_price_range" AS ENUM('$', '$$', '$$$', '$$$$');
  CREATE TYPE "public"."enum__businesses_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_locations_state" AS ENUM('AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY');
  CREATE TYPE "public"."enum_app_users_state" AS ENUM('AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY');
  CREATE TYPE "public"."enum_admins_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('media');
  CREATE TYPE "public"."enum_onboarding_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__onboarding_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_welcome_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__welcome_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "businesses_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" "enum_businesses_hours_day",
  	"opens" varchar,
  	"closes" varchar,
  	"closed" boolean
  );
  
  CREATE TABLE "businesses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"category_id" integer,
  	"price_range" "enum_businesses_price_range",
  	"tagline" varchar,
  	"short_description" varchar,
  	"description" jsonb,
  	"cover_image_id" integer,
  	"video_id" integer,
  	"video_url" varchar,
  	"location_id" integer,
  	"address" varchar,
  	"zip_code" varchar,
  	"latitude" numeric,
  	"longitude" numeric,
  	"city" varchar,
  	"state" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"website" varchar,
  	"social_instagram" varchar,
  	"social_facebook" varchar,
  	"social_tiktok" varchar,
  	"slug" varchar,
  	"is_top_business" boolean DEFAULT false,
  	"top_rank" numeric,
  	"is_featured" boolean DEFAULT false,
  	"rating" numeric,
  	"review_count" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_businesses_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "businesses_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "businesses_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_businesses_v_version_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" "enum__businesses_v_version_hours_day",
  	"opens" varchar,
  	"closes" varchar,
  	"closed" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_businesses_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_category_id" integer,
  	"version_price_range" "enum__businesses_v_version_price_range",
  	"version_tagline" varchar,
  	"version_short_description" varchar,
  	"version_description" jsonb,
  	"version_cover_image_id" integer,
  	"version_video_id" integer,
  	"version_video_url" varchar,
  	"version_location_id" integer,
  	"version_address" varchar,
  	"version_zip_code" varchar,
  	"version_latitude" numeric,
  	"version_longitude" numeric,
  	"version_city" varchar,
  	"version_state" varchar,
  	"version_phone" varchar,
  	"version_email" varchar,
  	"version_website" varchar,
  	"version_social_instagram" varchar,
  	"version_social_facebook" varchar,
  	"version_social_tiktok" varchar,
  	"version_slug" varchar,
  	"version_is_top_business" boolean DEFAULT false,
  	"version_top_rank" numeric,
  	"version_is_featured" boolean DEFAULT false,
  	"version_rating" numeric,
  	"version_review_count" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__businesses_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_businesses_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_businesses_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"icon" varchar DEFAULT '⭐',
  	"color" varchar DEFAULT '#FF385C',
  	"description" varchar,
  	"cover_image_id" integer,
  	"slug" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "locations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"city" varchar NOT NULL,
  	"state" "enum_locations_state" NOT NULL,
  	"display_name" varchar,
  	"cover_image_id" integer,
  	"slug" varchar,
  	"is_featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"caption" varchar,
  	"prefix" varchar DEFAULT 'media',
  	"_objectkey" varchar,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "app_users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "app_users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"avatar_id" integer,
  	"phone" varchar,
  	"city" varchar,
  	"state" "enum_app_users_state",
  	"onboarding_completed" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "app_users_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"businesses_id" integer
  );
  
  CREATE TABLE "admins_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "admins" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_admins_role" DEFAULT 'admin' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"businesses_id" integer,
  	"categories_id" integer,
  	"locations_id" integer,
  	"media_id" integer,
  	"app_users_id" integer,
  	"admins_id" integer,
  	"payload_folders_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"app_users_id" integer,
  	"admins_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "onboarding_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"media_id" integer
  );
  
  CREATE TABLE "onboarding" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"next_button_text" varchar DEFAULT 'Next',
  	"finish_button_text" varchar DEFAULT 'Get started',
  	"skip_button_text" varchar DEFAULT 'Skip',
  	"_status" "enum_onboarding_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_onboarding_v_version_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"media_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_onboarding_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_next_button_text" varchar DEFAULT 'Next',
  	"version_finish_button_text" varchar DEFAULT 'Get started',
  	"version_skip_button_text" varchar DEFAULT 'Skip',
  	"version__status" "enum__onboarding_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "welcome_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"greeting" varchar DEFAULT 'Welcome back',
  	"headline" varchar DEFAULT 'Discover the best local businesses',
  	"subheadline" varchar,
  	"hero_media_id" integer,
  	"search_placeholder" varchar DEFAULT 'Search city or state',
  	"top_businesses_title" varchar DEFAULT 'Top businesses',
  	"popular_cities_title" varchar DEFAULT 'Popular cities',
  	"_status" "enum_welcome_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "welcome_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"businesses_id" integer
  );
  
  CREATE TABLE "_welcome_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_greeting" varchar DEFAULT 'Welcome back',
  	"version_headline" varchar DEFAULT 'Discover the best local businesses',
  	"version_subheadline" varchar,
  	"version_hero_media_id" integer,
  	"version_search_placeholder" varchar DEFAULT 'Search city or state',
  	"version_top_businesses_title" varchar DEFAULT 'Top businesses',
  	"version_popular_cities_title" varchar DEFAULT 'Popular cities',
  	"version__status" "enum__welcome_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_welcome_page_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"businesses_id" integer
  );
  
  CREATE TABLE "app_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"app_name" varchar DEFAULT 'Directory' NOT NULL,
  	"short_name" varchar DEFAULT 'Directory',
  	"logo_id" integer,
  	"app_icon_id" integer,
  	"brand_color" varchar DEFAULT '#FF385C',
  	"background_color" varchar DEFAULT '#FFFFFF',
  	"support_email" varchar,
  	"terms_url" varchar,
  	"privacy_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "businesses_hours" ADD CONSTRAINT "businesses_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "businesses" ADD CONSTRAINT "businesses_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "businesses" ADD CONSTRAINT "businesses_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "businesses" ADD CONSTRAINT "businesses_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "businesses" ADD CONSTRAINT "businesses_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "businesses_texts" ADD CONSTRAINT "businesses_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "businesses_rels" ADD CONSTRAINT "businesses_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "businesses_rels" ADD CONSTRAINT "businesses_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_businesses_v_version_hours" ADD CONSTRAINT "_businesses_v_version_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_businesses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_businesses_v" ADD CONSTRAINT "_businesses_v_parent_id_businesses_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."businesses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_businesses_v" ADD CONSTRAINT "_businesses_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_businesses_v" ADD CONSTRAINT "_businesses_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_businesses_v" ADD CONSTRAINT "_businesses_v_version_video_id_media_id_fk" FOREIGN KEY ("version_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_businesses_v" ADD CONSTRAINT "_businesses_v_version_location_id_locations_id_fk" FOREIGN KEY ("version_location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_businesses_v_texts" ADD CONSTRAINT "_businesses_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_businesses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_businesses_v_rels" ADD CONSTRAINT "_businesses_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_businesses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_businesses_v_rels" ADD CONSTRAINT "_businesses_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations" ADD CONSTRAINT "locations_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "app_users_sessions" ADD CONSTRAINT "app_users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."app_users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "app_users" ADD CONSTRAINT "app_users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "app_users_rels" ADD CONSTRAINT "app_users_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."app_users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "app_users_rels" ADD CONSTRAINT "app_users_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "app_users_rels" ADD CONSTRAINT "app_users_rels_businesses_fk" FOREIGN KEY ("businesses_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "admins_sessions" ADD CONSTRAINT "admins_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_businesses_fk" FOREIGN KEY ("businesses_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_app_users_fk" FOREIGN KEY ("app_users_id") REFERENCES "public"."app_users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_app_users_fk" FOREIGN KEY ("app_users_id") REFERENCES "public"."app_users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "onboarding_slides" ADD CONSTRAINT "onboarding_slides_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "onboarding_slides" ADD CONSTRAINT "onboarding_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."onboarding"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_onboarding_v_version_slides" ADD CONSTRAINT "_onboarding_v_version_slides_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_onboarding_v_version_slides" ADD CONSTRAINT "_onboarding_v_version_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_onboarding_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "welcome_page" ADD CONSTRAINT "welcome_page_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "welcome_page_rels" ADD CONSTRAINT "welcome_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."welcome_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "welcome_page_rels" ADD CONSTRAINT "welcome_page_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "welcome_page_rels" ADD CONSTRAINT "welcome_page_rels_businesses_fk" FOREIGN KEY ("businesses_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_welcome_page_v" ADD CONSTRAINT "_welcome_page_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_welcome_page_v_rels" ADD CONSTRAINT "_welcome_page_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_welcome_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_welcome_page_v_rels" ADD CONSTRAINT "_welcome_page_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_welcome_page_v_rels" ADD CONSTRAINT "_welcome_page_v_rels_businesses_fk" FOREIGN KEY ("businesses_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "app_settings" ADD CONSTRAINT "app_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "app_settings" ADD CONSTRAINT "app_settings_app_icon_id_media_id_fk" FOREIGN KEY ("app_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "businesses_hours_order_idx" ON "businesses_hours" USING btree ("_order");
  CREATE INDEX "businesses_hours_parent_id_idx" ON "businesses_hours" USING btree ("_parent_id");
  CREATE INDEX "businesses_name_idx" ON "businesses" USING btree ("name");
  CREATE INDEX "businesses_category_idx" ON "businesses" USING btree ("category_id");
  CREATE INDEX "businesses_cover_image_idx" ON "businesses" USING btree ("cover_image_id");
  CREATE INDEX "businesses_video_idx" ON "businesses" USING btree ("video_id");
  CREATE INDEX "businesses_location_idx" ON "businesses" USING btree ("location_id");
  CREATE INDEX "businesses_city_idx" ON "businesses" USING btree ("city");
  CREATE INDEX "businesses_state_idx" ON "businesses" USING btree ("state");
  CREATE UNIQUE INDEX "businesses_slug_idx" ON "businesses" USING btree ("slug");
  CREATE INDEX "businesses_is_top_business_idx" ON "businesses" USING btree ("is_top_business");
  CREATE INDEX "businesses_is_featured_idx" ON "businesses" USING btree ("is_featured");
  CREATE INDEX "businesses_updated_at_idx" ON "businesses" USING btree ("updated_at");
  CREATE INDEX "businesses_created_at_idx" ON "businesses" USING btree ("created_at");
  CREATE INDEX "businesses__status_idx" ON "businesses" USING btree ("_status");
  CREATE INDEX "businesses_texts_order_parent" ON "businesses_texts" USING btree ("order","parent_id");
  CREATE INDEX "businesses_rels_order_idx" ON "businesses_rels" USING btree ("order");
  CREATE INDEX "businesses_rels_parent_idx" ON "businesses_rels" USING btree ("parent_id");
  CREATE INDEX "businesses_rels_path_idx" ON "businesses_rels" USING btree ("path");
  CREATE INDEX "businesses_rels_media_id_idx" ON "businesses_rels" USING btree ("media_id");
  CREATE INDEX "_businesses_v_version_hours_order_idx" ON "_businesses_v_version_hours" USING btree ("_order");
  CREATE INDEX "_businesses_v_version_hours_parent_id_idx" ON "_businesses_v_version_hours" USING btree ("_parent_id");
  CREATE INDEX "_businesses_v_parent_idx" ON "_businesses_v" USING btree ("parent_id");
  CREATE INDEX "_businesses_v_version_version_name_idx" ON "_businesses_v" USING btree ("version_name");
  CREATE INDEX "_businesses_v_version_version_category_idx" ON "_businesses_v" USING btree ("version_category_id");
  CREATE INDEX "_businesses_v_version_version_cover_image_idx" ON "_businesses_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_businesses_v_version_version_video_idx" ON "_businesses_v" USING btree ("version_video_id");
  CREATE INDEX "_businesses_v_version_version_location_idx" ON "_businesses_v" USING btree ("version_location_id");
  CREATE INDEX "_businesses_v_version_version_city_idx" ON "_businesses_v" USING btree ("version_city");
  CREATE INDEX "_businesses_v_version_version_state_idx" ON "_businesses_v" USING btree ("version_state");
  CREATE INDEX "_businesses_v_version_version_slug_idx" ON "_businesses_v" USING btree ("version_slug");
  CREATE INDEX "_businesses_v_version_version_is_top_business_idx" ON "_businesses_v" USING btree ("version_is_top_business");
  CREATE INDEX "_businesses_v_version_version_is_featured_idx" ON "_businesses_v" USING btree ("version_is_featured");
  CREATE INDEX "_businesses_v_version_version_updated_at_idx" ON "_businesses_v" USING btree ("version_updated_at");
  CREATE INDEX "_businesses_v_version_version_created_at_idx" ON "_businesses_v" USING btree ("version_created_at");
  CREATE INDEX "_businesses_v_version_version__status_idx" ON "_businesses_v" USING btree ("version__status");
  CREATE INDEX "_businesses_v_created_at_idx" ON "_businesses_v" USING btree ("created_at");
  CREATE INDEX "_businesses_v_updated_at_idx" ON "_businesses_v" USING btree ("updated_at");
  CREATE INDEX "_businesses_v_latest_idx" ON "_businesses_v" USING btree ("latest");
  CREATE INDEX "_businesses_v_autosave_idx" ON "_businesses_v" USING btree ("autosave");
  CREATE INDEX "_businesses_v_texts_order_parent" ON "_businesses_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_businesses_v_rels_order_idx" ON "_businesses_v_rels" USING btree ("order");
  CREATE INDEX "_businesses_v_rels_parent_idx" ON "_businesses_v_rels" USING btree ("parent_id");
  CREATE INDEX "_businesses_v_rels_path_idx" ON "_businesses_v_rels" USING btree ("path");
  CREATE INDEX "_businesses_v_rels_media_id_idx" ON "_businesses_v_rels" USING btree ("media_id");
  CREATE INDEX "categories_cover_image_idx" ON "categories" USING btree ("cover_image_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "locations_city_idx" ON "locations" USING btree ("city");
  CREATE INDEX "locations_state_idx" ON "locations" USING btree ("state");
  CREATE INDEX "locations_display_name_idx" ON "locations" USING btree ("display_name");
  CREATE INDEX "locations_cover_image_idx" ON "locations" USING btree ("cover_image_id");
  CREATE UNIQUE INDEX "locations_slug_idx" ON "locations" USING btree ("slug");
  CREATE INDEX "locations_updated_at_idx" ON "locations" USING btree ("updated_at");
  CREATE INDEX "locations_created_at_idx" ON "locations" USING btree ("created_at");
  CREATE UNIQUE INDEX "city_state_idx" ON "locations" USING btree ("city","state");
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "app_users_sessions_order_idx" ON "app_users_sessions" USING btree ("_order");
  CREATE INDEX "app_users_sessions_parent_id_idx" ON "app_users_sessions" USING btree ("_parent_id");
  CREATE INDEX "app_users_avatar_idx" ON "app_users" USING btree ("avatar_id");
  CREATE INDEX "app_users_updated_at_idx" ON "app_users" USING btree ("updated_at");
  CREATE INDEX "app_users_created_at_idx" ON "app_users" USING btree ("created_at");
  CREATE UNIQUE INDEX "app_users_email_idx" ON "app_users" USING btree ("email");
  CREATE INDEX "app_users_rels_order_idx" ON "app_users_rels" USING btree ("order");
  CREATE INDEX "app_users_rels_parent_idx" ON "app_users_rels" USING btree ("parent_id");
  CREATE INDEX "app_users_rels_path_idx" ON "app_users_rels" USING btree ("path");
  CREATE INDEX "app_users_rels_categories_id_idx" ON "app_users_rels" USING btree ("categories_id");
  CREATE INDEX "app_users_rels_businesses_id_idx" ON "app_users_rels" USING btree ("businesses_id");
  CREATE INDEX "admins_sessions_order_idx" ON "admins_sessions" USING btree ("_order");
  CREATE INDEX "admins_sessions_parent_id_idx" ON "admins_sessions" USING btree ("_parent_id");
  CREATE INDEX "admins_updated_at_idx" ON "admins" USING btree ("updated_at");
  CREATE INDEX "admins_created_at_idx" ON "admins" USING btree ("created_at");
  CREATE UNIQUE INDEX "admins_email_idx" ON "admins" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_name_idx" ON "payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "payload_folders" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_businesses_id_idx" ON "payload_locked_documents_rels" USING btree ("businesses_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_locations_id_idx" ON "payload_locked_documents_rels" USING btree ("locations_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_app_users_id_idx" ON "payload_locked_documents_rels" USING btree ("app_users_id");
  CREATE INDEX "payload_locked_documents_rels_admins_id_idx" ON "payload_locked_documents_rels" USING btree ("admins_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_folders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_app_users_id_idx" ON "payload_preferences_rels" USING btree ("app_users_id");
  CREATE INDEX "payload_preferences_rels_admins_id_idx" ON "payload_preferences_rels" USING btree ("admins_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "onboarding_slides_order_idx" ON "onboarding_slides" USING btree ("_order");
  CREATE INDEX "onboarding_slides_parent_id_idx" ON "onboarding_slides" USING btree ("_parent_id");
  CREATE INDEX "onboarding_slides_media_idx" ON "onboarding_slides" USING btree ("media_id");
  CREATE INDEX "onboarding__status_idx" ON "onboarding" USING btree ("_status");
  CREATE INDEX "_onboarding_v_version_slides_order_idx" ON "_onboarding_v_version_slides" USING btree ("_order");
  CREATE INDEX "_onboarding_v_version_slides_parent_id_idx" ON "_onboarding_v_version_slides" USING btree ("_parent_id");
  CREATE INDEX "_onboarding_v_version_slides_media_idx" ON "_onboarding_v_version_slides" USING btree ("media_id");
  CREATE INDEX "_onboarding_v_version_version__status_idx" ON "_onboarding_v" USING btree ("version__status");
  CREATE INDEX "_onboarding_v_created_at_idx" ON "_onboarding_v" USING btree ("created_at");
  CREATE INDEX "_onboarding_v_updated_at_idx" ON "_onboarding_v" USING btree ("updated_at");
  CREATE INDEX "_onboarding_v_latest_idx" ON "_onboarding_v" USING btree ("latest");
  CREATE INDEX "welcome_page_hero_media_idx" ON "welcome_page" USING btree ("hero_media_id");
  CREATE INDEX "welcome_page__status_idx" ON "welcome_page" USING btree ("_status");
  CREATE INDEX "welcome_page_rels_order_idx" ON "welcome_page_rels" USING btree ("order");
  CREATE INDEX "welcome_page_rels_parent_idx" ON "welcome_page_rels" USING btree ("parent_id");
  CREATE INDEX "welcome_page_rels_path_idx" ON "welcome_page_rels" USING btree ("path");
  CREATE INDEX "welcome_page_rels_categories_id_idx" ON "welcome_page_rels" USING btree ("categories_id");
  CREATE INDEX "welcome_page_rels_businesses_id_idx" ON "welcome_page_rels" USING btree ("businesses_id");
  CREATE INDEX "_welcome_page_v_version_version_hero_media_idx" ON "_welcome_page_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_welcome_page_v_version_version__status_idx" ON "_welcome_page_v" USING btree ("version__status");
  CREATE INDEX "_welcome_page_v_created_at_idx" ON "_welcome_page_v" USING btree ("created_at");
  CREATE INDEX "_welcome_page_v_updated_at_idx" ON "_welcome_page_v" USING btree ("updated_at");
  CREATE INDEX "_welcome_page_v_latest_idx" ON "_welcome_page_v" USING btree ("latest");
  CREATE INDEX "_welcome_page_v_rels_order_idx" ON "_welcome_page_v_rels" USING btree ("order");
  CREATE INDEX "_welcome_page_v_rels_parent_idx" ON "_welcome_page_v_rels" USING btree ("parent_id");
  CREATE INDEX "_welcome_page_v_rels_path_idx" ON "_welcome_page_v_rels" USING btree ("path");
  CREATE INDEX "_welcome_page_v_rels_categories_id_idx" ON "_welcome_page_v_rels" USING btree ("categories_id");
  CREATE INDEX "_welcome_page_v_rels_businesses_id_idx" ON "_welcome_page_v_rels" USING btree ("businesses_id");
  CREATE INDEX "app_settings_logo_idx" ON "app_settings" USING btree ("logo_id");
  CREATE INDEX "app_settings_app_icon_idx" ON "app_settings" USING btree ("app_icon_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "businesses_hours" CASCADE;
  DROP TABLE "businesses" CASCADE;
  DROP TABLE "businesses_texts" CASCADE;
  DROP TABLE "businesses_rels" CASCADE;
  DROP TABLE "_businesses_v_version_hours" CASCADE;
  DROP TABLE "_businesses_v" CASCADE;
  DROP TABLE "_businesses_v_texts" CASCADE;
  DROP TABLE "_businesses_v_rels" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "locations" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "app_users_sessions" CASCADE;
  DROP TABLE "app_users" CASCADE;
  DROP TABLE "app_users_rels" CASCADE;
  DROP TABLE "admins_sessions" CASCADE;
  DROP TABLE "admins" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_folders_folder_type" CASCADE;
  DROP TABLE "payload_folders" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "onboarding_slides" CASCADE;
  DROP TABLE "onboarding" CASCADE;
  DROP TABLE "_onboarding_v_version_slides" CASCADE;
  DROP TABLE "_onboarding_v" CASCADE;
  DROP TABLE "welcome_page" CASCADE;
  DROP TABLE "welcome_page_rels" CASCADE;
  DROP TABLE "_welcome_page_v" CASCADE;
  DROP TABLE "_welcome_page_v_rels" CASCADE;
  DROP TABLE "app_settings" CASCADE;
  DROP TYPE "public"."enum_businesses_hours_day";
  DROP TYPE "public"."enum_businesses_price_range";
  DROP TYPE "public"."enum_businesses_status";
  DROP TYPE "public"."enum__businesses_v_version_hours_day";
  DROP TYPE "public"."enum__businesses_v_version_price_range";
  DROP TYPE "public"."enum__businesses_v_version_status";
  DROP TYPE "public"."enum_locations_state";
  DROP TYPE "public"."enum_app_users_state";
  DROP TYPE "public"."enum_admins_role";
  DROP TYPE "public"."enum_payload_folders_folder_type";
  DROP TYPE "public"."enum_onboarding_status";
  DROP TYPE "public"."enum__onboarding_v_version_status";
  DROP TYPE "public"."enum_welcome_page_status";
  DROP TYPE "public"."enum__welcome_page_v_version_status";`)
}
