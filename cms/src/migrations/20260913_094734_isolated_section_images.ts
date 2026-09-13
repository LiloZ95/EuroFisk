import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "branches" ADD COLUMN "founder_image_id" integer;
  ALTER TABLE "branches" ADD COLUMN "about_image_id" integer;
  ALTER TABLE "branches" ADD COLUMN "social_image_id" integer;
  ALTER TABLE "branches" ADD CONSTRAINT "branches_founder_image_id_media_id_fk" FOREIGN KEY ("founder_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branches" ADD CONSTRAINT "branches_about_image_id_media_id_fk" FOREIGN KEY ("about_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branches" ADD CONSTRAINT "branches_social_image_id_media_id_fk" FOREIGN KEY ("social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  UPDATE "branches"
    SET "founder_image_id" = "hero_image_id",
        "about_image_id" = "exterior_image_id",
        "social_image_id" = "exterior_image_id";
  CREATE INDEX "branches_founder_image_idx" ON "branches" USING btree ("founder_image_id");
  CREATE INDEX "branches_about_image_idx" ON "branches" USING btree ("about_image_id");
  CREATE INDEX "branches_social_image_idx" ON "branches" USING btree ("social_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "branches" DROP CONSTRAINT "branches_founder_image_id_media_id_fk";
  
  ALTER TABLE "branches" DROP CONSTRAINT "branches_about_image_id_media_id_fk";
  
  ALTER TABLE "branches" DROP CONSTRAINT "branches_social_image_id_media_id_fk";
  
  DROP INDEX "branches_founder_image_idx";
  DROP INDEX "branches_about_image_idx";
  DROP INDEX "branches_social_image_idx";
  ALTER TABLE "branches" DROP COLUMN "founder_image_id";
  ALTER TABLE "branches" DROP COLUMN "about_image_id";
  ALTER TABLE "branches" DROP COLUMN "social_image_id";`)
}
