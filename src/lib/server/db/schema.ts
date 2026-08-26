import { sql } from 'drizzle-orm';
import { check, customType, index, integer, pgTable, serial, text, uniqueIndex } from 'drizzle-orm/pg-core';

const bytea = customType<{ data: Uint8Array; driverData: Uint8Array }>({
	dataType() {
		return 'bytea';
	}
});

export const user = pgTable('user', {
	slackId: text('slack_id').primaryKey(),
	clocks: integer('clocks').notNull().default(0),
	strikes: integer('strikes').notNull().default(0),
	isReviewer: integer('is_reviewer').notNull().default(0),
	email: text('email').notNull(),
	displayName: text('display_name').notNull().default(''),
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

export const strike = pgTable(
	'strike',
	{
		id: serial('id').primaryKey(),
		slackId: text('slack_id')
			.notNull()
			.references(() => user.slackId, { onDelete: 'cascade' }),
		shopId: integer('shop_id')
			.notNull()
			.references(() => shop.id, { onDelete: 'restrict' }),
		reason: text('reason'),
		createdBy: text('created_by').references(() => user.slackId, { onDelete: 'set null' }),
		createdAt: integer('created_at').notNull()
	},
	(table) => [
		uniqueIndex('strike_shop_id_unique').on(table.shopId),
		index('strike_slack_id_created_at_idx').on(table.slackId, table.createdAt)
	]
);

export const shopImage = pgTable('shop_image', {
	shopId: integer('shop_id')
		.primaryKey()
		.references(() => shop.id, { onDelete: 'cascade' }),
	data: bytea('data').notNull(),
	mimeType: text('mime_type').notNull(),
	fileName: text('file_name').notNull(),
	size: integer('size').notNull(),
	createdAt: integer('created_at').notNull()
});

export type ShopItem = typeof shop.$inferSelect;
export type NewShopItem = typeof shop.$inferInsert;
