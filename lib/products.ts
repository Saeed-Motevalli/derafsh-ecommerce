import image from "next/image";

export type Product = {
  id: string;
  country: string;
  flag: string;
  image: string;
  region: string;
  price: number;
  stock: number;
  rating: number;
  featured?: boolean;
};

export const products: Product[] = [
  {
    id: "argentina",
    country: "آرژانتین",
    flag: "🇮🇷",
    image: "/flags/Flag_of_Argentina.svg.webp",
    region: "آمریکا",
    price: 298000,
    stock: 42,
    rating: 4.9,
    featured: true,
  },
  {
    id: "italy",
    country: "ایتالیا",
    flag: "🇮🇹",
    image: "/flags/italy-flag.webp",
    region: "اروپا",
    price: 298000,
    stock: 26,
    rating: 4.8,
    featured: true,
  },
  {
    id: "france",
    country: "فرانسه",
    flag: "🇫🇷",
    image: "/flags/Flag_of_France.svg.webp",
    region: "اروپا",
    price: 298000,
    stock: 34,
    rating: 4.7,
  },
  {
    id: "japan",
    country: "ژاپن",
    flag: "🇯🇵",
    image: "/flags/Flag_of_Japan.svg.webp",
    region: "آسیا",
    price: 298000,
    stock: 18,
    rating: 4.9,
    featured: true,
  },
  {
    id: "germany",
    country: "آلمان",
    flag: "🇩🇪",
    image: "/flags/Flag_of_Germany.svg.webp",
    region: "اروپا",
    price: 298000,
    stock: 21,
    rating: 4.6,
  },
  {
    id: "turkey",
    country: "ترکیه",
    flag: "🇹🇷",
    image: "/flags/Flag_of_Turkey.svg.webp",
    region: "آسیا",
    price: 298000,
    stock: 31,
    rating: 4.5,
  },
  {
    id: "usa",
    country: "ایالات متحده",
    flag: "🇺🇸",
    image:
      "/flags/Flag_of_the_United_States_(DDD-F-416E_specifications).svg.webp",
    region: "آمریکا",
    price: 298000,
    stock: 15,
    rating: 4.7,
  },
  {
    id: "uk",
    country: "بریتانیا",
    flag: "🇬🇧",
    image: "/flags/Flag_of_the_United_Kingdom_(1-2).svg.webp",
    region: "اروپا",
    price: 298000,
    stock: 24,
    rating: 4.8,
  },
  {
    id: "brazil",
    country: "برزیل",
    flag: "🇧🇷",
    image: "/flags/Flag_of_Brazil.svg.webp",
    region: "آمریکا",
    price: 298000,
    stock: 12,
    rating: 4.4,
  },
  {
    id: "saudi",
    country: "عربستان سعودی",
    flag: "🇸🇦",
    image: "/flags/Flag_of_Saudi_Arabia.svg.webp",
    region: "آسیا",
    price: 298000,
    stock: 16,
    rating: 4.5,
  },
  {
    id: "canada",
    country: "کانادا",
    flag: "🇨🇦",
    image: "/flags/Flag_of_Canada_(Pantone).svg.webp",
    region: "آمریکا",
    price: 298000,
    stock: 20,
    rating: 4.6,
  },
  {
    id: "australia",
    country: "استرالیا",
    flag: "🇦🇺",
    image: "/flags/Flag_of_Australia_(converted).svg.webp",
    region: "اقیانوسیه",
    price: 298000,
    stock: 11,
    rating: 4.5,
  },
];

export const regions = ["همه", "اروپا", "آسیا", "آمریکا", "اقیانوسیه"];
export const freeShippingThreshold = 1_000_000;

export const money = (value: number) =>
  `${new Intl.NumberFormat("fa-IR").format(value)} تومان`;
