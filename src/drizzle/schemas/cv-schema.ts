import { relations } from "drizzle-orm";
import { index, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import type { CvFormValues } from "@/models/cv";
import { user } from "./users";

export const cvDocument = pgTable(
  "cv_document",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    data: jsonb("data").$type<CvFormValues | null>(),
    templateId: text("template_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("cv_document_userId_idx").on(table.userId)],
);

export const cvDocumentRelations = relations(cvDocument, ({ one }) => ({
  user: one(user, {
    fields: [cvDocument.userId],
    references: [user.id],
  }),
}));
