import "dotenv/config";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { user } from "./schemas/auth-schema";

const db = drizzle(process.env.DATABASE_URL!, { schema });

db.query.user.findFirst({
  where: eq(user.email, "test@test.com"),
});

export default db;
