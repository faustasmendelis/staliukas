import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const url = new URL(request.url);
  const date =
    url.searchParams.get("date") ??
    new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Vilnius" });

  const supabase = createServerSupabaseClient();

  const [capacityRes, bookingsRes] = await Promise.all([
    supabase
      .from("restaurant_capacity")
      .select("total_seats, slot_duration_min")
      .eq("restaurant_slug", slug)
      .single(),
    supabase
      .from("bookings")
      .select("booking_time, party_size")
      .eq("restaurant_slug", slug)
      .eq("booking_date", date)
      .eq("status", "confirmed"),
  ]);

  const totalSeats = capacityRes.data?.total_seats ?? 20;
  const bookings = bookingsRes.data ?? [];

  // Group booked seats by time slot
  const bookedBySlot: Record<string, number> = {};
  for (const b of bookings) {
    bookedBySlot[b.booking_time] =
      (bookedBySlot[b.booking_time] ?? 0) + b.party_size;
  }

  // Generate time slots (11:00 - 21:00, every 30 min)
  const slots: { time: string; available_seats: number }[] = [];
  for (let h = 11; h <= 21; h++) {
    for (const m of ["00", "30"]) {
      const time = `${h.toString().padStart(2, "0")}:${m}`;
      const booked = bookedBySlot[time] ?? 0;
      slots.push({
        time,
        available_seats: Math.max(0, totalSeats - booked),
      });
    }
  }

  return Response.json({
    restaurant_slug: slug,
    date,
    total_seats: totalSeats,
    slots,
  });
}
