import type { Context } from "grammy";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getRestaurantBySlug, getAllRestaurants } from "@/lib/restaurants";
import { parseBlock, parseUnblock, parseDiscount, parseLunch } from "./parsers";

function todayVilnius(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Vilnius" });
}

async function getLinkedSlug(
  chatId: number
): Promise<{ slug: string; name: string } | null> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("telegram_links")
    .select("restaurant_slug, restaurant_name")
    .eq("telegram_chat_id", chatId)
    .single();

  if (!data) return null;
  return { slug: data.restaurant_slug, name: data.restaurant_name };
}

async function requireLinked(ctx: Context) {
  const chatId = ctx.chat?.id;
  if (!chatId) return null;
  const linked = await getLinkedSlug(chatId);
  if (!linked) {
    await ctx.reply("Please /register your restaurant first.");
    return null;
  }
  return linked;
}

export async function handleStart(ctx: Context) {
  await ctx.reply(
    "Welcome to Staliukas Bot!\n\n" +
      "Link your restaurant with /register <slug>\n" +
      "Then manage availability and push discounts.\n\n" +
      "Type /help for all commands."
  );
}

export async function handleHelp(ctx: Context) {
  await ctx.reply(
    "Commands:\n\n" +
      "/register <slug> — Link to a restaurant\n" +
      "/unregister — Unlink\n" +
      "/setup <total_seats> — Set total seat capacity\n" +
      "/block 19:00 4 — Block 4 seats at 19:00 (external booking)\n" +
      "/unblock 19:00 4 — Free up 4 seats at 19:00 (cancellation)\n" +
      "/lunch 7.50 Cepelinai, salad, coffee — Post today's lunch deal\n" +
      "/discount 20 19:00-21:00 — Push a live discount\n" +
      "/status — Today's availability & discounts\n\n" +
      "Shorthand:\n" +
      "20% off 19:00-21:00 — Quick discount"
  );
}

export async function handleRegister(ctx: Context) {
  const text = ctx.message?.text ?? "";
  const parts = text.split(/\s+/);
  const slug = parts[1];

  if (!slug) {
    await ctx.reply(
      "Usage: /register <restaurant-slug>\n\nExample: /register nineteen18"
    );
    return;
  }

  const restaurant = getRestaurantBySlug(slug);
  if (!restaurant) {
    const all = getAllRestaurants();
    const suggestions = all
      .slice(0, 5)
      .map((r) => `  ${r.slug}`)
      .join("\n");
    await ctx.reply(
      `Restaurant "${slug}" not found.\n\nSome available slugs:\n${suggestions}`
    );
    return;
  }

  const chatId = ctx.chat?.id;
  if (!chatId) return;

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("telegram_links").upsert(
    {
      telegram_chat_id: chatId,
      restaurant_slug: slug,
      restaurant_name: restaurant.name,
    },
    { onConflict: "telegram_chat_id" }
  );

  if (error) {
    await ctx.reply("Failed to register. Please try again.");
    return;
  }

  await ctx.reply(
    `Linked to ${restaurant.name}!\n\nNext: /setup <total_seats> to set your capacity (e.g. /setup 30)`
  );
}

export async function handleUnregister(ctx: Context) {
  const chatId = ctx.chat?.id;
  if (!chatId) return;

  const supabase = createServerSupabaseClient();
  await supabase
    .from("telegram_links")
    .delete()
    .eq("telegram_chat_id", chatId);

  await ctx.reply("Unlinked. Use /register <slug> to link again.");
}

export async function handleSetup(ctx: Context) {
  const linked = await requireLinked(ctx);
  if (!linked) return;

  const text = ctx.message?.text ?? "";
  const parts = text.split(/\s+/);
  const seats = parseInt(parts[1], 10);

  if (!seats || seats < 1) {
    await ctx.reply("Usage: /setup <total_seats>\n\nExample: /setup 30");
    return;
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("restaurant_capacity").upsert(
    {
      restaurant_slug: linked.slug,
      total_seats: seats,
    },
    { onConflict: "restaurant_slug" }
  );

  if (error) {
    await ctx.reply("Failed to save capacity. Please try again.");
    return;
  }

  await ctx.reply(`${linked.name} capacity set to ${seats} seats.`);
}

export async function handleBlock(ctx: Context) {
  const linked = await requireLinked(ctx);
  if (!linked) return;

  const text = ctx.message?.text ?? "";
  const parsed = parseBlock(text);
  if (!parsed) {
    await ctx.reply("Usage: /block 19:00 4\n(block 4 seats at 19:00)");
    return;
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("bookings").insert({
    restaurant_slug: linked.slug,
    party_size: parsed.partySize,
    booking_time: parsed.time,
    booking_date: todayVilnius(),
    source: "telegram",
    status: "confirmed",
    guest_name: "External booking",
  });

  if (error) {
    await ctx.reply("Failed to block. Please try again.");
    return;
  }

  await ctx.reply(
    `Blocked ${parsed.partySize} seats at ${parsed.time} for ${linked.name}.`
  );
}

export async function handleUnblock(ctx: Context) {
  const linked = await requireLinked(ctx);
  if (!linked) return;

  const text = ctx.message?.text ?? "";
  const parsed = parseUnblock(text);
  if (!parsed) {
    await ctx.reply("Usage: /unblock 19:00 4\n(free up 4 seats at 19:00)");
    return;
  }

  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("bookings")
    .select("id")
    .eq("restaurant_slug", linked.slug)
    .eq("booking_date", todayVilnius())
    .eq("booking_time", parsed.time)
    .eq("party_size", parsed.partySize)
    .eq("source", "telegram")
    .eq("status", "confirmed")
    .limit(1);

  if (!data || data.length === 0) {
    await ctx.reply(
      `No matching block found for ${parsed.partySize} seats at ${parsed.time}.`
    );
    return;
  }

  await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", data[0].id);

  await ctx.reply(
    `Unblocked ${parsed.partySize} seats at ${parsed.time} for ${linked.name}.`
  );
}

export async function handleLunch(ctx: Context) {
  const linked = await requireLinked(ctx);
  if (!linked) return;

  const text = ctx.message?.text ?? "";
  const parsed = parseLunch(text);
  if (!parsed) {
    await ctx.reply(
      "Usage: /lunch 7.50 Cepelinai, salad, coffee\n(price + description of today's lunch)"
    );
    return;
  }

  const supabase = createServerSupabaseClient();
  const today = todayVilnius();

  // Deactivate any existing lunch deal for today
  await supabase
    .from("lunch_deals")
    .update({ active: false })
    .eq("restaurant_slug", linked.slug)
    .eq("valid_date", today);

  const { error } = await supabase.from("lunch_deals").insert({
    restaurant_slug: linked.slug,
    price: parsed.price,
    description: parsed.description,
    valid_date: today,
  });

  if (error) {
    await ctx.reply("Failed to post lunch deal. Please try again.");
    return;
  }

  await ctx.reply(
    `Lunch deal live on Staliukas!\n${linked.name}: ${parsed.price}€ — ${parsed.description}`
  );
}

export async function handleDiscountMessage(ctx: Context) {
  const linked = await requireLinked(ctx);
  if (!linked) return;

  const text = ctx.message?.text ?? "";
  const parsed = parseDiscount(text);
  if (!parsed) {
    await ctx.reply(
      "Usage: /discount 20 19:00-21:00\nor: 20% off 19:00-21:00"
    );
    return;
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("live_discounts").insert({
    restaurant_slug: linked.slug,
    percent_off: parsed.percentOff,
    start_time: parsed.startTime,
    end_time: parsed.endTime,
    valid_date: todayVilnius(),
    label_en: `${parsed.percentOff}% off ${parsed.startTime}-${parsed.endTime}`,
    label_lt: `${parsed.percentOff}% nuolaida ${parsed.startTime}-${parsed.endTime}`,
  });

  if (error) {
    await ctx.reply("Failed to publish discount. Please try again.");
    return;
  }

  await ctx.reply(
    `Discount live on Staliukas!\n${linked.name}: ${parsed.percentOff}% off ${parsed.startTime}-${parsed.endTime}`
  );
}

export async function handleStatus(ctx: Context) {
  const linked = await requireLinked(ctx);
  if (!linked) return;

  const supabase = createServerSupabaseClient();
  const today = todayVilnius();

  const [capacityRes, bookingsRes, discountsRes, lunchRes] = await Promise.all([
    supabase
      .from("restaurant_capacity")
      .select("total_seats")
      .eq("restaurant_slug", linked.slug)
      .single(),
    supabase
      .from("bookings")
      .select("*")
      .eq("restaurant_slug", linked.slug)
      .eq("booking_date", today)
      .eq("status", "confirmed")
      .order("booking_time"),
    supabase
      .from("live_discounts")
      .select("*")
      .eq("restaurant_slug", linked.slug)
      .eq("valid_date", today)
      .eq("active", true),
    supabase
      .from("lunch_deals")
      .select("*")
      .eq("restaurant_slug", linked.slug)
      .eq("valid_date", today)
      .eq("active", true)
      .limit(1),
  ]);

  const totalSeats = capacityRes.data?.total_seats ?? 0;
  const bookings = bookingsRes.data ?? [];
  const discounts = discountsRes.data ?? [];
  const lunch = lunchRes.data?.[0];

  const bookedSeats = bookings.reduce(
    (sum: number, b: { party_size: number }) => sum + b.party_size,
    0
  );

  let msg = `${linked.name} — ${today}\n`;
  msg += `Capacity: ${totalSeats} seats\n\n`;

  if (lunch) {
    msg += `Lunch deal: ${lunch.price}€ — ${lunch.description}\n\n`;
  }

  if (bookings.length === 0) {
    msg += "No bookings today.\n";
  } else {
    msg += `Booked: ${bookedSeats}/${totalSeats} seats (${bookings.length} bookings)\n`;
    for (const b of bookings) {
      const src = b.source === "telegram" ? " [ext]" : " [web]";
      const name = b.guest_name ? ` — ${b.guest_name}` : "";
      msg += `  ${b.booking_time}: ${b.party_size} pax${name}${src}\n`;
    }
  }

  msg += "\n";

  if (discounts.length === 0) {
    msg += "No active discounts.";
  } else {
    msg += `Active discounts:\n`;
    for (const d of discounts) {
      msg += `  ${d.percent_off}% off ${d.start_time}-${d.end_time}\n`;
    }
  }

  await ctx.reply(msg);
}
