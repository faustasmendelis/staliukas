import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const today = new Date().toLocaleDateString("en-CA", {
  timeZone: "Europe/Vilnius",
});

const deals = [
  { slug: "etno-dvaras", price: 7.5, description: "Cepelinai su mėsa, burokėlių sriuba, surišta kava" },
  { slug: "snekutis", price: 5.9, description: "Kibinai su aviena, kopūstų sriuba" },
  { slug: "lokys", price: 9.9, description: "Šaltibarščiai, keptas šamas su bulvėmis, arbata" },
  { slug: "forto-dvaras", price: 6.9, description: "Kugelis su spirgučiais, agurkinė, gira" },
  { slug: "berneliu-uzeiga", price: 7.9, description: "Cepelinai su grybais, pomidorų sriuba, kava" },
  { slug: "dziaugsmas", price: 8.5, description: "Ėrienos troškinys, rukola salotos, duona" },
  { slug: "cili-kaimas", price: 6.5, description: "Bulvių plokštainis, kopūstų sriuba, arbata" },
  { slug: "senoji-trobele", price: 7.5, description: "Didžkukuliai su spirgučiais, burokėlių sriuba" },
  { slug: "green-cafe", price: 8.9, description: "Veganiška Buddha lėkštė, lęšių sriuba, smoothie" },
  { slug: "radharane", price: 6.9, description: "Vegetariškas dal su ryžiais, čapatiai, čai" },
  { slug: "bistro-18", price: 9.5, description: "Vištienos schnitzel, bulvių košė, Cezario salotos" },
  { slug: "momo-grill", price: 11.9, description: "Jautienos burgeris, frytai, coleslaw, limonadas" },
  { slug: "casa-della-pasta", price: 8.9, description: "Pasta carbonara, bruschetta, espresso" },
  { slug: "pho-bo-ga", price: 7.9, description: "Pho bo sriuba, spring rolls, žalioji arbata" },
  { slug: "gan-bei", price: 8.5, description: "Kung pao vištiena su ryžiais, miso sriuba" },
  { slug: "boom-burgers", price: 8.9, description: "Classic burger, frytai, milkshake" },
  { slug: "kregzdute", price: 7.5, description: "Burrito bowl su vištiena, guacamole, limonadas" },
];

async function seed() {
  // Deactivate old deals for today
  await supabase
    .from("lunch_deals")
    .update({ active: false })
    .eq("valid_date", today);

  const rows = deals.map((d) => ({
    restaurant_slug: d.slug,
    price: d.price,
    description: d.description,
    valid_date: today,
    active: true,
  }));

  const { error } = await supabase.from("lunch_deals").insert(rows);

  if (error) {
    console.error("Failed to seed:", error.message);
    process.exit(1);
  }

  console.log(`Seeded ${deals.length} lunch deals for ${today}`);
}

seed();
