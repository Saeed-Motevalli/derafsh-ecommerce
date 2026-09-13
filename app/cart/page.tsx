"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { freeShippingThreshold, money, type Product } from "@/lib/products";

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

export default function CartPage() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [hasLoadedCart, setHasLoadedCart] = useState(false);
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef<number | null>(null);

  useEffect(() => {
    const storedCart = readStoredCart();
    setCart(storedCart);
    setHasLoadedCart(true);
  }, []);

  useEffect(
    () => () => {
      if (noticeTimer.current !== null)
        window.clearTimeout(noticeTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (!hasLoadedCart) return;
    window.localStorage.setItem("darafsh-cart", JSON.stringify(cart));
  }, [cart, hasLoadedCart]);

  function showNotice(message: string, duration = 2800) {
    if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current);
    setNotice(message);
    noticeTimer.current = window.setTimeout(() => {
      setNotice("");
      noticeTimer.current = null;
    }, duration);
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (cart.length === 0) return;
    setCart([]);
    showNotice("سفارش آزمایشی شما ثبت شد");
  }

  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cart.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0,
  );
  const shippingFree = subtotal >= freeShippingThreshold;
  const remaining = Math.max(freeShippingThreshold - subtotal, 0);

  return (
    <main className="darafsh-site order-page" dir="rtl">
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
            <Link href="/">صفحه اصلی</Link>
            <Link href="/countries">همه کشورها</Link>
            <Link href="/#support">راهنمای خرید</Link>
          </nav>
          <div className="header-actions">
            <Link
              className="account-button"
              href="/account"
              aria-label="حساب کاربری"
            >
              <ShoppingBag size={19} />
              <span>حساب کاربری</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="order-shell">
        <Link className="countries-breadcrumb" href="/">
          <ArrowLeft size={14} /> بازگشت به فروشگاه
        </Link>
        <div className="order-heading">
          <div>
            <p className="eyebrow">مرحلهٔ ثبت سفارش</p>
            <h1>سبد خرید شما</h1>
          </div>
          <p>
            اطلاعات ارسال را وارد کن تا سفارش پرچم‌هایت برای تحویل در هر شهر
            ایران آماده شود.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="order-empty">
            <ShoppingBag size={30} />
            <h2>سبد خرید خالی است</h2>
            <p>برای ادامه، ابتدا یک پرچم از کاتالوگ انتخاب کن.</p>
            <Link className="primary-cta" href="/countries">
              مشاهده همه کشورها <ArrowLeft size={16} />
            </Link>
          </div>
        ) : (
          <div className="order-layout">
            <form
              className="order-form-card"
              id="order-form"
              onSubmit={handleSubmit}
            >
              <div className="order-card-heading">
                <span>اطلاعات تحویل</span>
                <small>همهٔ شهرهای ایران</small>
              </div>
              <div className="form-grid">
                <label>
                  نام و نام خانوادگی
                  <input
                    name="name"
                    autoComplete="name"
                    placeholder="مثلاً سعید متولی"
                    required
                  />
                </label>
                <label>
                  شماره موبایل
                  <input
                    name="mobile"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="۰۹۱۲..."
                    required
                  />
                </label>
                <label>
                  استان و شهر
                  <input
                    name="city"
                    autoComplete="address-level2"
                    placeholder="مثلاً تهران، تهران"
                    required
                  />
                </label>
                <label>
                  کدپستی
                  <input
                    name="postalCode"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="۱۰ رقمی"
                    required
                  />
                </label>
                <label className="full-field">
                  آدرس کامل
                  <textarea
                    name="address"
                    autoComplete="street-address"
                    placeholder="خیابان، کوچه، پلاک و واحد"
                    rows={4}
                    required
                  />
                </label>
              </div>
              <div className="payment-note">
                <Check size={16} />
                <span>
                  پرداخت آنلاین در نسخهٔ فعلی شبیه‌سازی شده است؛ درگاه بانکی در
                  راه‌اندازی نهایی متصل می‌شود.
                </span>
              </div>
            </form>

            <aside className="order-summary">
              <div className="order-card-heading">
                <span>خلاصه سفارش</span>
                <small>
                  {new Intl.NumberFormat("fa-IR").format(cartCount)} عدد
                </small>
              </div>
              <div className="order-lines">
                {cart.map((line) => (
                  <div className="order-line" key={line.id}>
                    <span className="mini-flag">
                      {line.image ? (
                        <img src={line.image} alt={`پرچم ${line.country}`} />
                      ) : (
                        line.flag
                      )}
                    </span>
                    <div className="line-info">
                      <strong>پرچم {line.country}</strong>
                      <small>{money(line.price)}</small>
                      <div className="quantity">
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.id, -1)}
                          aria-label="کم کردن"
                        >
                          <Minus size={14} />
                        </button>
                        <span>{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.id, 1)}
                          aria-label="زیاد کردن"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="remove-line"
                      onClick={() => updateQuantity(line.id, -line.quantity)}
                      aria-label={`حذف پرچم ${line.country}`}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="order-totals">
                <div>
                  <span>جمع محصولات</span>
                  <strong>{money(subtotal)}</strong>
                </div>
                <div>
                  <span>هزینه ارسال</span>
                  <strong>{shippingFree ? "رایگان" : "در مرحله بعد"}</strong>
                </div>
              </div>
              {!shippingFree && (
                <p className="shipping-hint">
                  برای ارسال رایگان {money(remaining)} دیگر خرید کن.
                </p>
              )}
              {shippingFree && (
                <p className="shipping-hint shipping-done">
                  ارسال این سفارش رایگان است.
                </p>
              )}
              <div className="order-grand-total">
                <span>مبلغ نهایی</span>
                <strong>{money(subtotal)}</strong>
              </div>
              <Button
                className="checkout-button"
                type="submit"
                form="order-form"
              >
                پرداخت و ثبت سفارش <ArrowLeft size={16} />
              </Button>
              <p className="checkout-note">
                با ثبت سفارش، اطلاعات شما فقط برای آماده‌سازی و ارسال استفاده
                می‌شود.
              </p>
            </aside>
          </div>
        )}
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
            <Link href="/">صفحه اصلی</Link>
            <Link href="/countries">همه کشورها</Link>
            <Link href="/account">حساب کاربری</Link>
            <Link href="/#support">راهنمای خرید</Link>
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
    </main>
  );
}
