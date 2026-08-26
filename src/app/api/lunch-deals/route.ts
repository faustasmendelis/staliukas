import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerSupabaseClient();
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Europe/Vilnius",
  });

  const { data, error } = await supabase
    .from("lunch_deals")
    .select("*")
    .eq("valid_date", today)
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data ?? []);
}
