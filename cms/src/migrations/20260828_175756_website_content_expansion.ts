import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

/** Incremental migration for the existing EuroFisk Payload database. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_branches_experience_facts_icon" AS ENUM('fish', 'flame', 'heart');
    ALTER TABLE "branches_locales"
      ADD COLUMN "featured_section_cta" varchar,
      ADD COLUMN "gallery_section_sub" varchar,
      ADD COLUMN "experience_staff_label" varchar,
      ADD COLUMN "experience_staff_title" varchar,
      ADD COLUMN "experience_staff_sub" varchar,
      ADD COLUMN "experience_staff_role" varchar,
      ADD COLUMN "experience_staff_quote" varchar,
      ADD COLUMN "experience_staff_bio" varchar,
      ADD COLUMN "experience_place_label" varchar,
      ADD COLUMN "experience_place_title" varchar,
      ADD COLUMN "experience_place_sub" varchar,
      ADD COLUMN "experience_interior_label" varchar,
      ADD COLUMN "experience_interior_sub" varchar,
      ADD COLUMN "experience_exterior_label" varchar,
      ADD COLUMN "experience_exterior_sub" varchar,
      ADD COLUMN "experience_info_label" varchar;
    ALTER TABLE "site_settings_locales" ADD COLUMN "delivery_fee_note" varchar;

    CREATE TABLE "branches_experience_facts" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "icon" "enum_branches_experience_facts_icon" NOT NULL
    );
    CREATE TABLE "branches_experience_facts_locales" (
      "title" varchar NOT NULL, "sub" varchar, "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL, "_parent_id" varchar NOT NULL
    );
    CREATE TABLE "branches_about_stats" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL
    );
    CREATE TABLE "branches_about_stats_locales" (
      "value" varchar NOT NULL, "label" varchar NOT NULL, "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL, "_parent_id" varchar NOT NULL
    );
    CREATE TABLE "site_settings_delivery_benefits" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL
    );
    CREATE TABLE "site_settings_delivery_benefits_locales" (
      "title" varchar NOT NULL, "sub" varchar NOT NULL, "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL, "_parent_id" varchar NOT NULL
    );

    ALTER TABLE "branches_experience_facts" ADD CONSTRAINT "branches_experience_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "branches_experience_facts_locales" ADD CONSTRAINT "branches_experience_facts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."branches_experience_facts"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "branches_about_stats" ADD CONSTRAINT "branches_about_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "branches_about_stats_locales" ADD CONSTRAINT "branches_about_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."branches_about_stats"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "site_settings_delivery_benefits" ADD CONSTRAINT "site_settings_delivery_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "site_settings_delivery_benefits_locales" ADD CONSTRAINT "site_settings_delivery_benefits_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_delivery_benefits"("id") ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "branches_experience_facts_order_idx" ON "branches_experience_facts" USING btree ("_order");
    CREATE INDEX "branches_experience_facts_parent_id_idx" ON "branches_experience_facts" USING btree ("_parent_id");
    CREATE UNIQUE INDEX "branches_experience_facts_locales_locale_parent_id_unique" ON "branches_experience_facts_locales" USING btree ("_locale", "_parent_id");
    CREATE INDEX "branches_about_stats_order_idx" ON "branches_about_stats" USING btree ("_order");
    CREATE INDEX "branches_about_stats_parent_id_idx" ON "branches_about_stats" USING btree ("_parent_id");
    CREATE UNIQUE INDEX "branches_about_stats_locales_locale_parent_id_unique" ON "branches_about_stats_locales" USING btree ("_locale", "_parent_id");
    CREATE INDEX "site_settings_delivery_benefits_order_idx" ON "site_settings_delivery_benefits" USING btree ("_order");
    CREATE INDEX "site_settings_delivery_benefits_parent_id_idx" ON "site_settings_delivery_benefits" USING btree ("_parent_id");
    CREATE UNIQUE INDEX "site_settings_delivery_benefits_locales_locale_parent_id_uni" ON "site_settings_delivery_benefits_locales" USING btree ("_locale", "_parent_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE "site_settings_delivery_benefits_locales" CASCADE;
    DROP TABLE "site_settings_delivery_benefits" CASCADE;
    DROP TABLE "branches_about_stats_locales" CASCADE;
    DROP TABLE "branches_about_stats" CASCADE;
    DROP TABLE "branches_experience_facts_locales" CASCADE;
    DROP TABLE "branches_experience_facts" CASCADE;
    ALTER TABLE "site_settings_locales" DROP COLUMN "delivery_fee_note";
    ALTER TABLE "branches_locales"
      DROP COLUMN "featured_section_cta", DROP COLUMN "gallery_section_sub",
      DROP COLUMN "experience_staff_label", DROP COLUMN "experience_staff_title",
      DROP COLUMN "experience_staff_sub", DROP COLUMN "experience_staff_role",
      DROP COLUMN "experience_staff_quote", DROP COLUMN "experience_staff_bio",
      DROP COLUMN "experience_place_label", DROP COLUMN "experience_place_title",
      DROP COLUMN "experience_place_sub", DROP COLUMN "experience_interior_label",
      DROP COLUMN "experience_interior_sub", DROP COLUMN "experience_exterior_label",
      DROP COLUMN "experience_exterior_sub", DROP COLUMN "experience_info_label";
    DROP TYPE "public"."enum_branches_experience_facts_icon";
  `);
}
