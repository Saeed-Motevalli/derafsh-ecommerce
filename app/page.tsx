"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Heart,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import {
  freeShippingThreshold,
  money,
  products,
  type Product,
} from "@/lib/products";
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

type CartLine = Product & { quantity: number };

function readStoredCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  const savedCart = window.localStorage.getItem("darafsh-cart");
  if (!savedCart) return [];
  try {
    const parsedCart = JSON.parse(savedCart);
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch {
    window.localStorage.removeItem("darafsh-cart");
    return [];
  }
}

export default function Home() {
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef<number | null>(null);
  const [liked, setLiked] = useState<string[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [hasLoadedCart, setHasLoadedCart] = useState(false);
  const heroFlags = [
    {
      label: "پرچم آرژانتین",
      image: "/flags/Flag_of_Argentina.svg.webp",
    },
    {
      label: "پرچم آلمان",
      image: "/flags/Flag_of_Germany.svg.webp",
    },
    {
      label: "پرچم ترکیه",
      image: "/flags/Flag_of_Turkey.svg.webp",
    },
  ];
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(
    () => () => {
      if (noticeTimer.current !== null)
        window.clearTimeout(noticeTimer.current);
    },
    [],
  );

  useEffect(() => {
    const storedCart = readStoredCart();
    setCart(storedCart);
    setHasLoadedCart(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedCart) return;
    window.localStorage.setItem("darafsh-cart", JSON.stringify(cart));
  }, [cart, hasLoadedCart]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroFlags.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [heroFlags.length]);

  function showNotice(message: string, duration = 2800) {
    if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current);
    setNotice(message);
    noticeTimer.current = window.setTimeout(() => {
      setNotice("");
      noticeTimer.current = null;
    }, duration);
  }

  const featuredProducts = products.slice(0, 8);
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cart.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0,
  );
  const remaining = Math.max(freeShippingThreshold - subtotal, 0);
  const shippingProgress = Math.min(
    (subtotal / freeShippingThreshold) * 100,
    100,
  );

  function addToCart(product: Product) {
    setCart((current) => {
      const exists = current.find((line) => line.id === product.id);
      if (exists) {
        return current.map((line) =>
          line.id === product.id
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
    showNotice(`${product.country} به سبد خرید اضافه شد`);
  }

  function updateQuantity(id: string, delta: number) {
    setCart((current) =>
      current.flatMap((line) => {
        if (line.id !== id) return [line];
        const quantity = line.quantity + delta;
        return quantity > 0 ? [{ ...line, quantity }] : [];
      }),
    );
  }

  function toggleLike(id: string) {
    setLiked((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <main className="darafsh-site" dir="rtl">
      {notice && (
        <div className="toast">
          <Check size={16} />
          {notice}
        </div>
      )}

      <div className="topline">
        <span>
          <Sparkles size={14} /> ارسال رایگان برای سفارش‌های بالای ۱ میلیون
          تومان
        </span>
        <span className="topline-note">
          فروش تکی و عمده · یک اندازه، یک کیفیت
        </span>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#home" aria-label="درفش، صفحه اصلی">
            <span className="brand-mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>
              <strong>درفش</strong>
              <small>پرچم‌هایی برای هر روایت</small>
            </span>
          </a>
          <nav className="desktop-nav" aria-label="ناوبری اصلی">
            <a href="#store">فروشگاه</a>
            <a href="#bulk">خرید عمده</a>
            <a href="#story">درباره درفش</a>
            <a href="#support">راهنمای خرید</a>
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
            <button
              className="mobile-menu"
              aria-label="باز کردن منو"
              onClick={() => showNotice("منوی موبایل به‌زودی فعال می‌شود")}
            >
              <Menu size={21} />
            </button>
          </div>
        </div>
      </header>

      <section id="home" className="hero-section">
        <div className="hero-visual" aria-label="نمونه‌ای از پرچم‌های درفش">
          <div className="hero-slideshow" aria-live="polite">
            {heroFlags.map((flag, index) => (
              <div
                className={`hero-slide ${index === heroIndex ? "is-active" : ""}`}
                key={flag.label}
              >
                <img src={flag.image} alt={flag.label} />
              </div>
            ))}
          </div>
          <div className="hero-caption">
            <span>انتخاب سردبیر</span>
            <strong>{heroFlags[heroIndex].label}</strong>
            <small>پارچه استاندارد · دوخت تمیز</small>
          </div>
          <div className="hero-dots" aria-label="انتخاب پرچم">
            {heroFlags.map((flag, index) => (
              <button
                key={flag.label}
                type="button"
                className={`hero-dot ${index === heroIndex ? "is-active" : ""}`}
                onClick={() => setHeroIndex(index)}
                aria-label={`نمایش ${flag.label}`}
              />
            ))}
          </div>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">کلکسیون پرچم‌های جهان</p>
          <h1>
            هر پرچم،
            <br />
            <em>یک داستان.</em>
          </h1>
          <p className="hero-text">
            پرچم‌های باکیفیت کشورهای جهان، آماده برای فضاهایی که هویت و جزئیات
            اهمیت دارند.
          </p>
          <div className="hero-actions">
            <a href="#store" className="primary-cta">
              مشاهده پرچم‌ها <ArrowLeft size={17} />
            </a>
            <a href="#bulk" className="text-cta">
              راهنمای خرید عمده <ArrowLeft size={15} />
            </a>
          </div>
          <div className="hero-stats">
            <div>
              <strong>۴۰+</strong>
              <span>کشور در راه</span>
            </div>
            <div>
              <strong>۱۰۰٪</strong>
              <span>تولید باکیفیت</span>
            </div>
            <div>
              <strong>۳ سطح</strong>
              <span>قیمت عمده</span>
            </div>
          </div>
        </div>
      </section>

      <section id="store" className="store-section section-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">انتخاب شما</p>
            <h2>پرچم‌های محبوب</h2>
          </div>
          <p>
            نمونه‌های اولیه فروشگاه درفش؛ موجودی و اطلاعات نهایی از پنل مدیریت
            قابل ویرایش است.
          </p>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              liked={liked.includes(product.id)}
              onLike={() => toggleLike(product.id)}
              onAdd={() => addToCart(product)}
            />
          ))}
        </div>
        <div className="catalog-footer">
          <span>
            نمایش{" "}
            {new Intl.NumberFormat("fa-IR").format(featuredProducts.length)}{" "}
            محصول منتخب
          </span>
          <Link href="/countries">
            مشاهده همه کشورها <ArrowLeft size={16} />
          </Link>
        </div>
      </section>

      <section id="bulk" className="bulk-section section-shell">
        <div className="bulk-content">
          <p className="eyebrow">برای فروشگاه‌ها و سازمان‌ها</p>
          <h2>
            سفارش عمده،
            <br />
            <em>با قیمت شفاف.</em>
          </h2>
          <p>
            برای خرید تعداد بالا، قیمت به‌صورت پلکانی محاسبه می‌شود. هرچه تعداد
            بیشتر، قیمت هر پرچم مناسب‌تر.
          </p>
          <div className="bulk-tiers">
            <div>
              <strong>۱۰+</strong>
              <span>شروع قیمت عمده</span>
            </div>
            <div>
              <strong>۵۰+</strong>
              <span>قیمت اقتصادی‌تر</span>
            </div>
            <div>
              <strong>۱۰۰+</strong>
              <span>بهترین قیمت</span>
            </div>
          </div>
          <button
            className="outline-cta"
            onClick={() =>
              showNotice("فرم درخواست خرید عمده به‌زودی فعال می‌شود")
            }
          >
            درخواست خرید عمده <ArrowLeft size={16} />
          </button>
        </div>
        <div className="bulk-card">
          <div className="bulk-card-head">
            <PackageCheck size={20} />
            <span>مزیت‌های خرید عمده</span>
          </div>
          <ul>
            <li>
              <Check size={16} />
              قیمت‌گذاری پلکانی برای هر سفارش
            </li>
            <li>
              <Check size={16} />
              بسته‌بندی منظم و آماده ارسال
            </li>
            <li>
              <Check size={16} />
              ارسال به تمام شهرهای ایران
            </li>
            <li>
              <Check size={16} />
              پشتیبانی قبل و بعد از خرید
            </li>
          </ul>
          <div className="bulk-card-foot">
            <span>حداقل سفارش عمده</span>
            <strong>۱۰ عدد</strong>
          </div>
        </div>
      </section>

      <section id="story" className="story-section section-shell">
        <div className="story-number">۰۱</div>
        <div>
          <p className="eyebrow">درباره درفش</p>
          <h2>
            جزئیات کوچک،
            <br />
            <em>تفاوت بزرگ.</em>
          </h2>
          <p>
            درفش با یک انتخاب ساده شروع شد: پرچم باید بیشتر از یک تکه پارچه
            باشد؛ باید تمیز دوخته شود، درست دیده شود و سال‌ها بماند.
          </p>
        </div>
        <div className="story-seal">
          <span>EST.</span>
          <strong>۱۴۰۵</strong>
          <small>درفش</small>
        </div>
      </section>

      <section id="support" className="support-section section-shell">
        <div>
          <p className="eyebrow">خرید مطمئن</p>
          <h2>
            در هر مرحله
            <br />
            کنارت هستیم.
          </h2>
        </div>
        <div className="support-grid">
          <article>
            <strong>۰۱</strong>
            <h3>انتخاب پرچم</h3>
            <p>کشور موردنظرت را پیدا کن و به سبد اضافه کن.</p>
          </article>
          <article>
            <strong>۰۲</strong>
            <h3>ثبت سفارش</h3>
            <p>آدرس را وارد کن؛ بالای یک میلیون تومان ارسال رایگان است.</p>
          </article>
          <article>
            <strong>۰۳</strong>
            <h3>تحویل سریع</h3>
            <p>سفارش را در تمام شهرهای ایران پیگیری کن.</p>
          </article>
        </div>
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
          {cart.length === 0 ? (
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
                    {remaining
                      ? `برای ارسال رایگان ${money(remaining)} دیگر خرید کن`
                      : "ارسال سفارش شما رایگان شد"}
                  </span>
                  <strong>{Math.round(shippingProgress)}٪</strong>
                </div>
                <div className="meter-track">
                  <span style={{ width: `${shippingProgress}%` }} />
                </div>
              </div>
              <div className="cart-lines">
                {cart.map((line) => (
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
                          onClick={() => updateQuantity(line.id, -1)}
                          aria-label="کم کردن"
                        >
                          <Minus size={14} />
                        </button>
                        <span>{line.quantity}</span>
                        <button
                          onClick={() => updateQuantity(line.id, 1)}
                          aria-label="زیاد کردن"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <button
                      className="remove-line"
                      onClick={() => updateQuantity(line.id, -line.quantity)}
                      aria-label={`حذف پرچم ${line.country}`}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {cart.length > 0 && (
            <SheetFooter>
              <div className="cart-total">
                <span>جمع سفارش</span>
                <strong>{money(subtotal)}</strong>
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

function ProductCard({
  product,
  liked,
  onLike,
  onAdd,
}: {
  product: Product;
  liked: boolean;
  onLike: () => void;
  onAdd: () => void;
}) {
  const router = useRouter();

  return (
    <article
      className="product-card"
      onClick={() => router.push(`/product/${product.id}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="product-art">
        <button
          className={`like-button ${liked ? "liked" : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            onLike();
          }}
          aria-label={`افزودن پرچم ${product.country} به علاقه‌مندی‌ها`}
        >
          <Heart size={17} fill={liked ? "currentColor" : "none"} />
        </button>
        <div
          className="flag-orb"
          onClick={(event) => {
            event.stopPropagation();
            router.push(`/product/${product.id}`);
          }}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={`پرچم ${product.country}`}
              loading="lazy"
            />
          ) : (
            <span>{product.flag}</span>
          )}
        </div>
        <div className="art-shadow" />
      </div>
      <div
        className="product-info"
        onClick={() => router.push(`/product/${product.id}`)}
      >
        <div>
          <h3>پرچم {product.country}</h3>
          <span>پارچه استاندارد · دوخت تمیز</span>
        </div>
        <strong>{money(product.price)}</strong>
      </div>
      <div className="product-bottom">
        <span className="stock">
          <i /> {new Intl.NumberFormat("fa-IR").format(product.stock)} عدد موجود
        </span>
        <button
          className="add-button"
          onClick={(event) => {
            event.stopPropagation();
            onAdd();
          }}
        >
          افزودن به سبد <Plus size={15} />
        </button>
      </div>
    </article>
  );
}
