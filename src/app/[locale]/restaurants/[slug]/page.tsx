import { notFound } from "next/navigation";
import { getRestaurantBySlug } from "@/lib/restaurants";
import RestaurantDetailClient from "./RestaurantDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const restaurant = getRestaurantBySlug(slug);
  if (!restaurant) return {};

  const desc =
    locale === "lt" ? restaurant.description.lt : restaurant.description.en;

  return {
    title: `${restaurant.name} — Staliukas`,
    description: desc,
  };
}

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const restaurant = getRestaurantBySlug(slug);

  if (!restaurant) notFound();

  return <RestaurantDetailClient restaurant={restaurant} />;
}
