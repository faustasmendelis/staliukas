import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerSupabaseClient();
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Europe/Vilnius",
  });

  const { data, error } = await supabase
    .from("live_discounts")
    .select("*")
    .eq("active", true)
    .eq("valid_date", today);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data ?? []);
}
