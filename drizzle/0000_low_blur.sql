CREATE TABLE `foundation_members` (
	`user_id` text PRIMARY KEY NOT NULL,
	`member_id` text NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`state` text DEFAULT '' NOT NULL,
	`city` text DEFAULT '' NOT NULL,
	`interests` text DEFAULT '[]' NOT NULL,
	`updates` integer DEFAULT false NOT NULL,
	`consent_at` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `foundation_members_member_id_unique` ON `foundation_members` (`member_id`);