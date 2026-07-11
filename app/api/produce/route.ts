import { NextResponse } from "next/server";
import { produceSeeds, type ProduceItem } from "../../../lib/produce-catalog";

function toProduceName(query: string) {
  return query
    .split(" ")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

export async function GET() {
  const items: ProduceItem[] = produceSeeds
    .map((seed) => ({
      ...seed,
      featured: Boolean(seed.featured),
      name: toProduceName(seed.query),
      image: `/produce/items/${seed.key}.png`,
    }));

  return NextResponse.json({ items });
}
