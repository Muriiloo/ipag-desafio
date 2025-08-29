ALTER TABLE "notification_logs" RENAME COLUMN "status" TO "old_status";--> statement-breakpoint
ALTER TABLE "notification_logs" ADD COLUMN "new_status" "status" NOT NULL;