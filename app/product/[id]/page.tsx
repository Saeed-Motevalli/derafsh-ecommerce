import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/lib/products";
import ProductDetailClient from "./product-detail-client";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((item) => item.id === id);

  if (!product) {
    return { title: "محصول پیدا نشد | درفش" };
  }

  return {
    title: `پرچم ${product.country} | درفش`,
    description: `خرید پرچم ${product.country} با پارچه استاندارد و دوخت تمیز از فروشگاه درفش.`,
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);

  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
