import { pgTable, integer, text } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	slackId: text('slack_id').primaryKey(),
	currency: integer('currency').notNull().default(0),
	email: text('email').notNull(),
	verified: integer('verified').notNull().default(0),
	createdAt: integer('created_at').notNull().default(0),
	updatedAt: integer('updated_at').notNull().default(0)
});