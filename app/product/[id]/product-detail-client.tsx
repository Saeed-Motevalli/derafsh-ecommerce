"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { AccountLink } from "@/components/account-link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  freeShippingThreshold,
  money,
  products,
  type Product,
} from "@/lib/products";

type CartLine = Product & { quantity: number };

type Review = {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
};

const reviewTemplates = (country: string): Review[] => [
  {
    id: `${country}-1`,
    name: "مهدی رضایی",
    rating: 5,
    date: "۲ روز پیش",
    comment: `پرچم ${country} دقیقاً مطابق تصویر بود. رنگ‌ها زنده و دوخت لبه‌ها خیلی تمیز است.`,
    verified: true,
  },
  {
    id: `${country}-2`,
    name: "سارا کریمی",
    rating: 5,
    date: "یک هفته پیش",
    comment:
      "بسته‌بندی مرتب و ارسال سریع بود. برای دکور دفتر سفارش داده بودم و نتیجه خیلی خوب شد.",
    verified: true,
  },
  {
    id: `${country}-3`,
    name: "امیرحسین نادری",
    rating: 4,
    date: "۲ هفته پیش",
    comment: "کیفیت پارچه قابل قبول و ظاهر محصول شیک است؛ از خریدم راضی هستم.",
    verified: true,
  },
];

function readStoredCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  const savedCart = window.localStorage.getItem("darafsh-cart");
  if (!savedCart) return [];

  try {
    const parsedCart = JSON.parse(savedCart);
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch {
    return [];
  }
}

function readStoredReviews(productId: string, country: string): Review[] {
  if (typeof window === "undefined") return reviewTemplates(country);
  const savedReviews = window.localStorage.getItem(
    `darafsh-reviews-${productId}`,
  );
  if (!savedReviews) return reviewTemplates(country);

  try {
    const parsedReviews = JSON.parse(savedReviews);
    return Array.isArray(parsedReviews) && parsedReviews.length > 0
      ? parsedReviews
      : reviewTemplates(country);
  } catch {
    return reviewTemplates(country);
  }
}

function Stars({ rating, size = 17 }: { rating: number; size?: number }) {
  return (
    <span className="stars" aria-label={`${rating} از ۵ ستاره`}>
      {[1, 2, 3, 4, 5].map((item) => (
        <Star
          key={item}
          size={size}
          fill={item <= Math.round(rating) ? "currentColor" : "none"}
          strokeWidth={1.7}
        />
      ))}
    </span>
  );
}

function formatRating(rating: number) {
  return new Intl.NumberFormat("fa-IR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rating);
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const noticeTimer = useRef<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [liked, setLiked] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewScore, setReviewScore] = useState(5);

  useEffect(() => {
    const cart = readStoredCart();
    setCartCount(cart.reduce((sum, line) => sum + line.quantity, 0));
    setReviews(readStoredReviews(product.id, product.country));
  }, [product.country, product.id]);

  useEffect(() => {
    return () => {
      if (noticeTimer.current !== null)
        window.clearTimeout(noticeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        `darafsh-reviews-${product.id}`,
        JSON.stringify(reviews),
      );
    }
  }, [product.id, reviews]);

  function showNotice(message: string, duration = 2600) {
    if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current);
    setNotice(message);
    noticeTimer.current = window.setTimeout(() => {
      setNotice("");
      noticeTimer.current = null;
    }, duration);
  }

  function addToCart() {
    const currentCart = readStoredCart();
    const existing = currentCart.find((line) => line.id === product.id);
    const nextCart = existing
      ? currentCart.map((line) =>
          line.id === product.id
            ? {
                ...line,
                quantity: Math.min(product.stock, line.quantity + quantity),
              }
            : line,
        )
      : [...currentCart, { ...product, quantity }];

    window.localStorage.setItem("darafsh-cart", JSON.stringify(nextCart));
    const nextCount = nextCart.reduce((sum, line) => sum + line.quantity, 0);
    setCartCount(nextCount);
    setCartOpen(true);
    showNotice(
      `${new Intl.NumberFormat("fa-IR").format(quantity)} عدد پرچم ${product.country} به سبد اضافه شد`,
    );
  }

  function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = reviewName.trim();
    const trimmedText = reviewText.trim();

    if (!trimmedName || !trimmedText) {
      return;
    }

    const nextReview: Review = {
      id: `${product.id}-${Date.now()}`,
      name: trimmedName,
      rating: reviewScore,
      date: "همین الان",
      comment: trimmedText,
      verified: true,
    };

    setReviews((current) => [nextReview, ...current]);
    setReviewName("");
    setReviewText("");
    setReviewScore(5);
  }

  const total = product.price * quantity;
  const remainingForFreeShipping = Math.max(freeShippingThreshold - total, 0);
  const relatedProducts = products
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  return (
    <main className="darafsh-site product-page" dir="rtl">
      {notice && (
        <div className="toast">
          <Check size={16} />
          {notice}
        </div>
      )}

      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" href="/" aria-label="درفش، صفحه اصلی">
            <span className="brand-mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>
              <strong>درفش</strong>
              <small>پرچم‌هایی برای هر روایت</small>
            </span>
          </Link>

          <nav className="desktop-nav" aria-label="ناوبری اصلی">
            <Link href="/#store">فروشگاه</Link>
            <Link href="/#bulk">خرید عمده</Link>
            <Link href="/#story">درباره درفش</Link>
            <Link href="/#support">راهنمای خرید</Link>
          </nav>

          <div className="header-actions">
            <AccountLink />
            <Link
              className="cart-button"
              href="/cart"
              aria-label="مشاهده سبد خرید"
            >
              <ShoppingBag size={19} />
              <span>سبد خرید</span>
              {cartCount > 0 && <b>{cartCount}</b>}
            </Link>
          </div>
        </div>
      </header>

      <section className="product-detail-shell section-shell">
        <Link className="countries-breadcrumb" href="/countries">
          همه کشورها <ArrowLeft size={14} /> جزئیات پرچم {product.country}
        </Link>

        <div className="product-detail-layout">
          <div className="product-detail-media">
            <div className="detail-image-frame">
              <span className="detail-image-badge">
                {product.featured ? "انتخاب سردبیر" : "کیفیت درفش"}
              </span>
              <button
                className={`detail-like ${liked ? "liked" : ""}`}
                onClick={() => setLiked((current) => !current)}
                aria-label="افزودن به علاقه‌مندی‌ها"
              >
                <Heart size={19} fill={liked ? "currentColor" : "none"} />
              </button>
              <img
                src={product.image}
                alt={`پرچم ${product.country}`}
                className="detail-product-image"
              />
            </div>

            <div
              className="detail-gallery-strip"
              aria-label="تصاویر مختصر محصول"
            >
              <div className="detail-thumb active">
                <img src={product.image} alt={`پیش‌نمایش ${product.country}`} />
              </div>
              <div className="detail-thumb">
                <span>{product.flag}</span>
              </div>
              <div className="detail-thumb">
                <ShieldCheck size={18} />
              </div>
            </div>

            <div className="detail-media-note">
              <ShieldCheck size={17} />
              <span>
                پرچم {product.country} با دوخت تمیز، رنگ‌های زنده و کنترل کیفیت
                دقیق ساخته شده است.
              </span>
            </div>
          </div>

          <div className="product-detail-info">
            <p className="eyebrow">پرچم کشورهای جهان</p>
            <h1>پرچم {product.country}</h1>

            <div className="detail-rating-row">
              <Stars rating={product.rating} size={16} />
              <span>{formatRating(product.rating)} از ۵</span>
              <a href="#reviews">بازخورد خریداران</a>
            </div>

            <p className="detail-description">
              این پرچم برای دکور خانه، اتاق کار، دفتر، فضای شخصی و هدیه‌های خاص
              طراحی شده است. با پارچه‌ی استاندارد، دوخت تمیز و رنگ‌های دقیق،
              ظاهر مدرن و ماندگاری بالا را برای شما به ارمغان می‌آورد.
            </p>

            <div className="detail-facts">
              <div>
                <span>جنس</span>
                <strong>پارچه استاندارد</strong>
              </div>
              <div>
                <span>اندازه</span>
                <strong>۱۰۰ × ۶۰ سانتی‌متر</strong>
              </div>
              <div>
                <span>موجودی</span>
                <strong>
                  {new Intl.NumberFormat("fa-IR").format(product.stock)} عدد
                </strong>
              </div>
            </div>

            <div className="detail-purchase-card">
              <div className="detail-price-row">
                <div>
                  <span>قیمت هر پرچم</span>
                  <strong>{money(product.price)}</strong>
                </div>
                <em>ارسال رایگان</em>
              </div>

              <div className="detail-tier-hint">
                <span>
                  برای سفارش‌های بالای {money(freeShippingThreshold)}، ارسال
                  رایگان است.
                </span>
                <Link href="/countries">مشاهده همه</Link>
              </div>

              <div className="detail-quantity-row">
                <span>تعداد سفارش</span>
                <div className="quantity detail-quantity">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((current) => Math.max(1, current - 1))
                    }
                    aria-label="کم کردن تعداد"
                  >
                    <Minus size={15} />
                  </button>
                  <span>{new Intl.NumberFormat("fa-IR").format(quantity)}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((current) =>
                        Math.min(product.stock, current + 1),
                      )
                    }
                    aria-label="زیاد کردن تعداد"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              <div className="detail-total-row">
                <span>جمع سفارش</span>
                <strong>{money(total)}</strong>
              </div>

              <div className="detail-actions">
                <button className="product-buy-button" onClick={addToCart}>
                  افزودن به سبد خرید <ArrowLeft size={17} />
                </button>
                <button
                  type="button"
                  className="product-add-button"
                  onClick={() => router.push("/countries")}
                >
                  مشاهده بیشتر
                </button>
              </div>

              <p className="detail-shipping-hint">
                {remainingForFreeShipping > 0
                  ? `برای ارسال رایگان ${money(remainingForFreeShipping)} دیگر خرید کن.`
                  : "ارسال این سفارش رایگان است."}
              </p>
            </div>

            <div className="detail-benefits">
              <div>
                <Truck size={18} />
                <span>ارسال به تمام شهرهای ایران</span>
              </div>
              <div>
                <ShieldCheck size={18} />
                <span>بسته‌بندی امن و پشتیبانی</span>
              </div>
            </div>
          </div>
        </div>

        <section className="product-specs">
          <div className="product-section-heading">
            <div>
              <p className="eyebrow">ویژگی‌ها</p>
              <h2>چرا این پرچم را انتخاب کنیم؟</h2>
            </div>
            <p>
              طراحی ساده، کیفیت برجسته و مناسب برای فضاهای شخصی، اداری و هدیه‌
              دادن.
            </p>
          </div>

          <div className="spec-grid">
            <article className="spec-card">
              <span className="spec-icon">✦</span>
              <strong>کیفیت دوخت</strong>
              <p>
                لبه‌ها تمیز و محکم دوخته شده‌اند و ظاهر محصول کاملاً حرفه‌ای
                است.
              </p>
            </article>
            <article className="spec-card">
              <span className="spec-icon">✦</span>
              <strong>رنگ‌های زنده</strong>
              <p>
                رنگ‌ها با دقت بالا انتخاب شده‌اند تا جلوه‌ای شیک و طبیعی داشته
                باشند.
              </p>
            </article>
            <article className="spec-card">
              <span className="spec-icon">✦</span>
              <strong>استفاده چندمنظوره</strong>
              <p>
                برای دیوار، میز کار، خانه و هدیه مناسب است و حس لوکس و مدرن
                می‌دهد.
              </p>
            </article>
          </div>
        </section>

        <section className="product-reviews" id="reviews">
          <div className="product-section-heading reviews-heading">
            <div>
              <p className="eyebrow">نقد و بررسی</p>
              <h2>بازخورد خریداران</h2>
            </div>
          </div>

          <div className="reviews-layout">
            <div className="rating-summary">
              <strong>{formatRating(product.rating)}</strong>
              <Stars rating={product.rating} size={18} />
              <span>
                بر اساس {reviewTemplates(product.country).length} تجربه ثبت‌شده
              </span>
            </div>

            <div className="reviews-list">
              <form className="review-form" onSubmit={submitReview}>
                <div className="review-form-head">
                  <strong>نظر شما</strong>
                  <span>ثبت و ذخیره در این صفحه</span>
                </div>

                <div className="review-form-row">
                  <label>
                    <span>نام</span>
                    <input
                      type="text"
                      value={reviewName}
                      onChange={(event) => setReviewName(event.target.value)}
                      placeholder="نام شما"
                    />
                  </label>

                  <label>
                    <span>امتیاز</span>
                    <select
                      value={reviewScore}
                      onChange={(event) =>
                        setReviewScore(Number(event.target.value))
                      }
                    >
                      <option value={5}>۵ ستاره</option>
                      <option value={4}>۴ ستاره</option>
                      <option value={3}>۳ ستاره</option>
                      <option value={2}>۲ ستاره</option>
                      <option value={1}>۱ ستاره</option>
                    </select>
                  </label>
                </div>

                <label>
                  <span>دیدگاه</span>
                  <textarea
                    rows={4}
                    value={reviewText}
                    onChange={(event) => setReviewText(event.target.value)}
                    placeholder="تجربه‌تان را درباره این پرچم بنویسید..."
                  />
                </label>

                <button type="submit" className="review-submit-button">
                  ارسال نظر
                </button>
              </form>

              {reviews.map((review) => (
                <article className="review-card" key={review.id}>
                  <div className="review-card-head">
                    <span className="review-avatar">
                      {review.name.slice(0, 1)}
                    </span>
                    <div>
                      <strong>{review.name}</strong>
                      <span className="review-verified">
                        {review.verified && <Check size={12} />} تاییدشده
                      </span>
                    </div>
                    <time>{review.date}</time>
                  </div>
                  <div className="review-card-rating">
                    <Stars rating={review.rating} size={14} />
                  </div>
                  <p>{review.comment}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="related-products">
          <div className="product-section-heading">
            <div>
              <p className="eyebrow">انتخاب‌های دیگر</p>
              <h2>پرچم‌های مشابه</h2>
            </div>
            <Link className="back-link" href="/countries">
              مشاهده همه کشورها <ArrowLeft size={16} />
            </Link>
          </div>

          <div className="related-grid">
            {relatedProducts.map((item) => (
              <Link
                className="related-card"
                href={`/product/${item.id}`}
                key={item.id}
              >
                <div className="related-image">
                  <img src={item.image} alt={`پرچم ${item.country}`} />
                </div>
                <div>
                  <strong>پرچم {item.country}</strong>
                  <span>{money(item.price)}</span>
                </div>
                <ArrowLeft size={17} />
              </Link>
            ))}
          </div>
        </section>
      </section>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="brand footer-brand">
            <span className="brand-mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>
              <strong>درفش</strong>
              <small>پرچم‌هایی برای هر روایت</small>
            </span>
          </div>
          <div className="footer-links">
            <a href="#store">فروشگاه</a>
            <a href="#bulk">خرید عمده</a>
            <a href="#support">راهنمای خرید</a>
            <a href="#story">درباره ما</a>
          </div>
          <div className="footer-contact">
            <span>پشتیبانی و مشاوره</span>
            <strong>هر روز، ۹ تا ۱۸</strong>
            <div className="footer-socials" aria-label="شبکه‌های اجتماعی درفش">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="اینستاگرام درفش"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                  <circle cx="12" cy="12" r="4.1" />
                  <circle
                    cx="17.3"
                    cy="6.7"
                    r="1.1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                aria-label="تلگرام درفش"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21.7 4.1 3.6 11.1c-1 .4-1 1.8.2 2.1l4.1 1.3 1.7 5.2c.2.7 1.1 1 1.7.4l2.4-2.5 4.3 3.2c.8.6 2 .1 2.3-.9l3.2-15.8c.3-1.5-1-2.7-2.4-2.1Z" />
                  <path d="M9.7 14.7 20.4 5.1" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© ۱۴۰۵ درفش. همه حقوق محفوظ است.</span>
          <span>طراحی شده برای انتخاب‌های اصیل</span>
        </div>
      </footer>

      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent side="left" className="cart-sheet" dir="rtl">
          <SheetHeader>
            <SheetTitle>سبد خرید شما</SheetTitle>
            <SheetDescription>
              {cartCount
                ? `${new Intl.NumberFormat("fa-IR").format(cartCount)} عدد پرچم`
                : "سبد خرید هنوز خالی است"}
            </SheetDescription>
          </SheetHeader>

          {readStoredCart().length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={30} />
              <p>هنوز پرچمی انتخاب نکرده‌ای.</p>
              <button onClick={() => setCartOpen(false)}>
                بازگشت به فروشگاه
              </button>
            </div>
          ) : (
            <div className="cart-body">
              <div className="shipping-meter">
                <div>
                  <span>
                    {(() => {
                      const subtotal = readStoredCart().reduce(
                        (sum, line) => sum + line.price * line.quantity,
                        0,
                      );
                      const remaining = Math.max(
                        freeShippingThreshold - subtotal,
                        0,
                      );
                      const progress = Math.min(
                        (subtotal / freeShippingThreshold) * 100,
                        100,
                      );

                      return remaining
                        ? `برای ارسال رایگان ${money(remaining)} دیگر خرید کن`
                        : "ارسال سفارش شما رایگان شد";
                    })()}
                  </span>
                  <strong>
                    {Math.round(
                      (readStoredCart().reduce(
                        (sum, line) => sum + line.price * line.quantity,
                        0,
                      ) /
                        freeShippingThreshold) *
                        100,
                    )}
                    %
                  </strong>
                </div>
                <div className="meter-track">
                  <span
                    style={{
                      width: `${Math.min(
                        (readStoredCart().reduce(
                          (sum, line) => sum + line.price * line.quantity,
                          0,
                        ) /
                          freeShippingThreshold) *
                          100,
                        100,
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="cart-lines">
                {readStoredCart().map((line) => (
                  <div className="cart-line" key={line.id}>
                    <span className="mini-flag">
                      {line.image ? (
                        <img src={line.image} alt={`پرچم ${line.country}`} />
                      ) : (
                        line.flag
                      )}
                    </span>
                    <div className="line-info">
                      <strong>پرچم {line.country}</strong>
                      <small>
                        {money(line.price)} · موجودی{" "}
                        {new Intl.NumberFormat("fa-IR").format(line.stock)}
                      </small>
                      <div className="quantity">
                        <button
                          onClick={() => {
                            const cart = readStoredCart();
                            const nextCart = cart
                              .map((current) =>
                                current.id === line.id
                                  ? {
                                      ...current,
                                      quantity: Math.max(
                                        0,
                                        current.quantity - 1,
                                      ),
                                    }
                                  : current,
                              )
                              .filter((current) => current.quantity > 0);
                            window.localStorage.setItem(
                              "darafsh-cart",
                              JSON.stringify(nextCart),
                            );
                            const nextCount = nextCart.reduce(
                              (sum, current) => sum + current.quantity,
                              0,
                            );
                            setCartCount(nextCount);
                            if (nextCart.length === 0) setCartOpen(false);
                          }}
                          aria-label="کم کردن"
                        >
                          <Minus size={14} />
                        </button>
                        <span>{line.quantity}</span>
                        <button
                          onClick={() => {
                            const cart = readStoredCart();
                            const nextCart = cart.map((current) =>
                              current.id === line.id
                                ? {
                                    ...current,
                                    quantity: Math.min(
                                      current.stock,
                                      current.quantity + 1,
                                    ),
                                  }
                                : current,
                            );
                            window.localStorage.setItem(
                              "darafsh-cart",
                              JSON.stringify(nextCart),
                            );
                            setCartCount(
                              nextCart.reduce(
                                (sum, current) => sum + current.quantity,
                                0,
                              ),
                            );
                          }}
                          aria-label="زیاد کردن"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <button
                      className="remove-line"
                      onClick={() => {
                        const cart = readStoredCart();
                        const nextCart = cart.filter(
                          (current) => current.id !== line.id,
                        );
                        window.localStorage.setItem(
                          "darafsh-cart",
                          JSON.stringify(nextCart),
                        );
                        const nextCount = nextCart.reduce(
                          (sum, current) => sum + current.quantity,
                          0,
                        );
                        setCartCount(nextCount);
                        if (nextCart.length === 0) setCartOpen(false);
                      }}
                      aria-label={`حذف پرچم ${line.country}`}
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {readStoredCart().length > 0 && (
            <SheetFooter>
              <div className="cart-total">
                <span>جمع سفارش</span>
                <strong>
                  {money(
                    readStoredCart().reduce(
                      (sum, line) => sum + line.price * line.quantity,
                      0,
                    ),
                  )}
                </strong>
              </div>
              <Button
                className="checkout-button"
                onClick={() => {
                  setCartOpen(false);
                  router.push("/cart");
                }}
              >
                ادامه ثبت سفارش <ArrowLeft size={16} />
              </Button>
              <small className="checkout-note">
                پرداخت آنلاین در نسخهٔ نهایی با درگاه بانکی انجام می‌شود.
              </small>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </main>
  );
}
