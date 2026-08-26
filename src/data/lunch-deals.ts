export interface LunchMenuItem {
  category: "soup" | "main" | "side" | "dessert" | "drink";
  name: { lt: string; en: string };
}

export interface StaticLunchDeal {
  restaurant_slug: string;
  price: number;
  description: { lt: string; en: string };
  menu_items: LunchMenuItem[];
  hours: string;
}

export const STATIC_LUNCH_DEALS: StaticLunchDeal[] = [
  {
    restaurant_slug: "ilunch-cyber-city",
    price: 4.9,
    description: {
      lt: "Dienos sriuba + karštas patiekalas su ryžiais + salotos",
      en: "Daily soup + hot dish with rice + salad",
    },
    menu_items: [
      { category: "soup", name: { lt: "Vištienos sultinys su makaronais", en: "Chicken broth with noodles" } },
      { category: "main", name: { lt: "Troškinta kiauliena su ryžiais", en: "Braised pork with rice" } },
      { category: "side", name: { lt: "Šviežios salotos", en: "Fresh salad" } },
    ],
    hours: "11:00–15:00",
  },
  {
    restaurant_slug: "wrap-house",
    price: 5.5,
    description: {
      lt: "Wrapas arba burgeris + gėrimas",
      en: "Wrap or burger + drink",
    },
    menu_items: [
      { category: "main", name: { lt: "Vištienos wrapas su daržovėmis", en: "Chicken wrap with vegetables" } },
      { category: "main", name: { lt: "Jautienos kebabas su padažu", en: "Beef kebab with sauce" } },
      { category: "drink", name: { lt: "Limonadas arba arbata", en: "Lemonade or tea" } },
    ],
    hours: "10:00–15:00",
  },
  {
    restaurant_slug: "fresh-post",
    price: 5.5,
    description: {
      lt: "Dienos sriuba + karštas patiekalas arba salotos",
      en: "Daily soup + hot dish or salad",
    },
    menu_items: [
      { category: "soup", name: { lt: "Lęšių sriuba", en: "Lentil soup" } },
      { category: "main", name: { lt: "Grikių Buddha lėkštė", en: "Buckwheat Buddha bowl" } },
      { category: "drink", name: { lt: "Šviežiai spausta sultys", en: "Fresh pressed juice" } },
    ],
    hours: "11:00–15:00",
  },
  {
    restaurant_slug: "senoji-trobele",
    price: 5.9,
    description: {
      lt: "Sriuba + karštas patiekalas + gėrimas",
      en: "Soup + hot dish + drink",
    },
    menu_items: [
      { category: "soup", name: { lt: "Žirnių sriuba su mėsa", en: "Pea soup with meat" } },
      { category: "main", name: { lt: "Jautienos troškinys su daržovėmis", en: "Beef stew with vegetables" } },
      { category: "dessert", name: { lt: "Kriaušių ir obuolių pyragas", en: "Pear and apple cake" } },
      { category: "drink", name: { lt: "Naminė gira", en: "Homemade kvass" } },
    ],
    hours: "11:00–15:00",
  },
  {
    restaurant_slug: "zemaiciu-asotis",
    price: 5.5,
    description: {
      lt: "Sriuba + cepelinai arba kugelis + gira",
      en: "Soup + cepelinai or kugelis + kvass",
    },
    menu_items: [
      { category: "soup", name: { lt: "Kopūstų sriuba", en: "Cabbage soup" } },
      { category: "main", name: { lt: "Cepelinai su mėsa ir spirgučiais", en: "Cepelinai with meat and cracklings" } },
      { category: "drink", name: { lt: "Naminė gira", en: "Homemade kvass" } },
    ],
    hours: "11:00–15:00",
  },
  {
    restaurant_slug: "kinu-roze",
    price: 7.9,
    description: {
      lt: "Sriuba + karštas patiekalas su ryžiais ir salotomis + arbata",
      en: "Soup + hot dish with rice and salad + tea",
    },
    menu_items: [
      { category: "soup", name: { lt: "Kiaulienos kukulių sriuba su sojų makaronais", en: "Pork meatball soup with soy noodles" } },
      { category: "main", name: { lt: "Kung Pao vištiena su ryžiais", en: "Kung Pao chicken with rice" } },
      { category: "side", name: { lt: "Šviežios salotos", en: "Fresh salad" } },
      { category: "drink", name: { lt: "Kiniška arbata", en: "Chinese tea" } },
    ],
    hours: "11:00–14:30",
  },
  {
    restaurant_slug: "la-tavola",
    price: 6.9,
    description: {
      lt: "Pasta arba pica + salotos + espresso",
      en: "Pasta or pizza + salad + espresso",
    },
    menu_items: [
      { category: "main", name: { lt: "Pasta carbonara", en: "Pasta carbonara" } },
      { category: "side", name: { lt: "Cezario salotos", en: "Caesar salad" } },
      { category: "drink", name: { lt: "Espresso", en: "Espresso" } },
    ],
    hours: "11:30–15:00",
  },
];
