import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();

  const {
    restaurant_slug,
    party_size,
    booking_time,
    booking_date,
    guest_name,
    email,
    phone,
    special_requests,
  } = body;

  if (!restaurant_slug || !party_size || !booking_time || !booking_date) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  // Check availability
  const { data: capacity } = await supabase
    .from("restaurant_capacity")
    .select("total_seats")
    .eq("restaurant_slug", restaurant_slug)
    .single();

  const totalSeats = capacity?.total_seats ?? 20;

  const { data: existing } = await supabase
    .from("bookings")
    .select("party_size")
    .eq("restaurant_slug", restaurant_slug)
    .eq("booking_date", booking_date)
    .eq("booking_time", booking_time)
    .eq("status", "confirmed");

  const bookedSeats = (existing ?? []).reduce(
    (sum: number, b: { party_size: number }) => sum + b.party_size,
    0
  );

  if (bookedSeats + party_size > totalSeats) {
    return Response.json(
      { error: "Not enough seats available for this time slot" },
      { status: 409 }
    );
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      restaurant_slug,
      party_size,
      booking_time,
      booking_date,
      guest_name,
      email,
      phone,
      special_requests,
      source: "website",
      status: "confirmed",
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data, { status: 201 });
}
