import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	slackId: text('slack_id').primaryKey(),
	clocks: integer('clocks').notNull().default(0),
	email: text('email').notNull(),
	verified: integer('verified').notNull().default(0),
	createdAt: integer('created_at').notNull().default(0),
	updatedAt: integer('updated_at').notNull().default(0)
});

export const shop = pgTable('shop', {
	id: serial('id').primaryKey(),
	slackId: text('slack_id')
		.notNull()
		.references(() => user.slackId, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	requestedPrice: integer('requested_price').notNull(),
	status: text('status').notNull().default('pending'),
	price: integer('price'),
	createdAt: integer('created_at').notNull().default(0),
	updatedAt: integer('updated_at').notNull().default(0)
});
