import { sql } from 'drizzle-orm';
import { check, index, integer, pgEnum, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const permissionValues = ['user', 'admin', 'fulfillment', 'item-review'] as const;
export const userPermission = pgEnum('user_permission', permissionValues);

export const user = pgTable('user', {
	slackId: text('slack_id').primaryKey(),
	clocks: integer('clocks').notNull().default(0),
	strikes: integer('strikes').notNull().default(0),
	strikeUpdatedAt: integer('strike_updated_at'),
	perms: userPermission('perms')
		.array()
		.notNull()
		.default(sql`ARRAY['user'::user_permission]`),
	isReviewer: integer('is_reviewer').notNull().default(0),
	email: text('email').notNull(),
	displayName: text('display_name').notNull().default(''),
	progressItem: integer('progress_item'),
	avatarUrl: text('avatar_url').notNull().default(''),
	verified: integer('verified').notNull().default(0),
	createdAt: integer('created_at').notNull().default(0),
	updatedAt: integer('updated_at').notNull().default(0)
});

export const shop = pgTable(
	'shop',
	{
		id: serial('id').primaryKey(),
		slackId: text('slack_id')
			.notNull()
			.references(() => user.slackId, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		description: text('description').notNull().default(''),
		specification: text('specification').notNull().default(''),
		imageUrl: text('image_url').notNull().default(''),
		goalDays: integer('goal_days').notNull().default(0),
		requestedPrice: integer('requested_price').notNull(),
		currency: text('currency').notNull().default('USD'),
		status: text('status').notNull().default('pending'),
		price: integer('price'),
		reviewNotes: text('review_notes'),
		reviewedBy: text('reviewed_by').references(() => user.slackId, { onDelete: 'set null' }),
		reviewedAt: integer('reviewed_at'),
		createdAt: integer('created_at').notNull().default(0),
		updatedAt: integer('updated_at').notNull().default(0)
	},
	(table) => [
		index('shop_status_created_at_idx').on(table.status, table.createdAt),
		check(
			'shop_status_check',
			sql`${table.status} in ('pending', 'approved', 'changes_requested', 'rejected')`
		)
	]
);

export type ShopItem = typeof shop.$inferSelect;
export type NewShopItem = typeof shop.$inferInsert;
