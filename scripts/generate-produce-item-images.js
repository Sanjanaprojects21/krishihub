const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const catalogSource = fs.readFileSync("lib/produce-catalog.ts", "utf8");
const catalogBody = catalogSource.match(/export const produceSeeds: ProduceSeed\[\] = \[([\s\S]*)\];/)[1];
const produceSeeds = Function(`return [${catalogBody}];`)();

const outputDir = "public/produce/items";
fs.mkdirSync(outputDir, { recursive: true });

const baseImages = {
  apple: "public/produce/apple-photo.png",
  banana: "public/produce/banana-photo.png",
  "bell-pepper": "public/produce/bell-pepper-photo.png",
  broccoli: "public/produce/broccoli-photo.png",
  cabbage: "public/produce/cabbage-photo.png",
  carrot: "public/produce/carrot-photo.png",
  cauliflower: "public/produce/cauliflower-photo.png",
  cucumber: "public/produce/cucumber-photo.png",
  eggplant: "public/produce/eggplant-photo.png",
  grapes: "public/produce/grapes-photo.png",
  mango: "public/produce/mango-photo.png",
  okra: "public/produce/okra-photo.png",
  onion: "public/produce/onion-photo.png",
  potato: "public/produce/potato-photo.png",
  spinach: "public/produce/spinach-photo.png",
  tomato: "public/produce/tomato-photo.png",
};

const aliases = {
  beetroot: "onion",
  radish: "carrot",
  pumpkin: "mango",
  "bitter-gourd": "cucumber",
  "bottle-gourd": "cucumber",
  "green-peas": "okra",
  "sweet-corn": "carrot",
  mushroom: "potato",
  garlic: "onion",
  ginger: "potato",
  "green-chilli": "okra",
  lettuce: "cabbage",
  orange: "mango",
  papaya: "mango",
  pineapple: "mango",
  watermelon: "mango",
  strawberry: "grapes",
  pomegranate: "grapes",
  kiwi: "mango",
  pear: "apple",
  guava: "apple",
  sapota: "mango",
  "custard-apple": "apple",
  "dragon-fruit": "mango",
  lychee: "grapes",
  peach: "apple",
  plum: "grapes",
  coconut: "mango",
};

function hashText(value) {
  let hash = 0;

  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  return hash;
}

function titleCase(value) {
  return value
    .split(" ")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function escapeSvgText(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function colorProfile(seed, hash) {
  const query = seed.query.toLowerCase();
  const fallback = {
    brightness: 0.94 + (hash % 17) / 100,
    saturation: 0.86 + (hash % 29) / 100,
    hue: (hash % 49) - 24,
  };

  if (query.includes("green") || query.includes("raw")) {
    return { brightness: 1.02, saturation: 1.08, hue: 108 };
  }

  if (query.includes("yellow") || query.includes("golden")) {
    return { brightness: 1.08, saturation: 1.04, hue: 54 };
  }

  if (query.includes("black")) {
    return { brightness: 0.58, saturation: 1.18, hue: 250 };
  }

  if (query.includes("purple")) {
    return { brightness: 0.86, saturation: 1.12, hue: 284 };
  }

  if (query.includes("white")) {
    return { brightness: 1.14, saturation: 0.45, hue: 40 };
  }

  if (query.includes("red") || query.includes("crimson") || query.includes("flame")) {
    return { brightness: 1.0, saturation: 1.12, hue: 350 };
  }

  if (query.includes("pink")) {
    return { brightness: 1.08, saturation: 1.05, hue: 325 };
  }

  return fallback;
}

function labelOverlay(seed, hash) {
  const name = escapeSvgText(titleCase(seed.query));
  const hue = hash % 360;

  return Buffer.from(`
<svg width="600" height="92" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wash" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsla(${hue}, 70%, 92%, 0.2)"/>
      <stop offset="1" stop-color="hsla(${(hue + 40) % 360}, 65%, 82%, 0.2)"/>
    </linearGradient>
  </defs>
  <rect width="600" height="92" rx="10" fill="rgba(255,255,255,0.9)"/>
  <rect width="600" height="92" rx="10" fill="url(#wash)"/>
  <text x="300" y="52" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="800" fill="#082f1f">${name}</text>
  <text x="300" y="77" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" font-weight="800" fill="#17834f">${seed.type}</text>
</svg>`);
}

async function createImage(seed) {
  const hash = hashText(seed.key);
  const imageKey =
    seed.imageKey ||
    (baseImages[seed.key] ? seed.key : aliases[seed.key]) ||
    (seed.type === "Fruit" ? "mango" : "carrot");
  const input = baseImages[imageKey];
  const left = hash % 25;
  const top = Math.floor(hash / 32) % 19;
  const width = 680 - (hash % 30);
  const height = 510 - (Math.floor(hash / 128) % 26);
  const color = colorProfile(seed, hash);

  const overlay = await sharp(labelOverlay(seed, hash))
    .resize(600, 92, { fit: "fill" })
    .png()
    .toBuffer();

  await sharp(input)
    .resize(780, 585, { fit: "cover" })
    .extract({ left, top, width, height })
    .resize(720, 540, { fit: "cover" })
    .modulate(color)
    .composite([{ input: overlay, left: 60, top: 400 }])
    .png({ quality: 92 })
    .toFile(path.join(outputDir, `${seed.key}.png`));
}

Promise.all(produceSeeds.map((seed) => createImage(seed))).then(() => {
  console.log(`Created ${produceSeeds.length} product-specific PNGs in ${outputDir}`);
});
