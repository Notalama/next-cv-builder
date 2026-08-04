import { SpriteGenerator } from "@/app/sprite-generator/_components/sprite-generator";
import { requireSession } from "@/lib/auth/session";

export default async function SpriteGeneratorPage() {
  await requireSession();
  return <SpriteGenerator />;
}
