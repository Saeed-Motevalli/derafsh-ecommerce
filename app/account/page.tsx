"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountLink } from "@/components/account-link";
import { readStoredAccount, saveStoredAccount } from "@/lib/account";

type AccountMode = "login" | "signup";

export default function AccountPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AccountMode>("login");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const mobile = String(formData.get("mobile") || "").trim();
    const existingAccount = readStoredAccount();
    const name =
      mode === "signup"
        ? String(formData.get("name") || "").trim()
        : existingAccount?.name || "کاربر درفش";
    saveStoredAccount({ name: name || "کاربر درفش", mobile });
    router.push("/");
  }

  return (
    <main className="darafsh-site account-page" dir="rtl">
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
              className="cart-button"
              href="/cart"
              aria-label="مشاهده سبد خرید"
            >
              <ShoppingBag size={19} />
              <span>سبد خرید</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="account-shell">
        <div className="account-intro">
          <p className="eyebrow">حساب کاربری درفش</p>
          <h1>{mode === "login" ? "خوش برگشتی." : "به درفش بپیوند."}</h1>
          <p>
            {mode === "login"
              ? "برای مشاهدهٔ سفارش‌ها و پیگیری ارسال، وارد حساب کاربری‌ات شو."
              : "با ساخت حساب، سفارش‌های قبلی و وضعیت ارسال را همیشه در دسترس داشته باش."}
          </p>
          <div className="account-note">
            <UserRound size={18} />
            <span>
              ثبت‌نام رایگان است و خرید مهمان هم همیشه امکان‌پذیر است.
            </span>
          </div>
        </div>

        <div className="account-card">
          <div
            className="account-tabs"
            role="tablist"
            aria-label="ورود یا ثبت‌نام"
          >
            <button
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
              role="tab"
              aria-selected={mode === "login"}
            >
              ورود
            </button>
            <button
              className={mode === "signup" ? "active" : ""}
              onClick={() => setMode("signup")}
              role="tab"
              aria-selected={mode === "signup"}
            >
              ثبت‌نام
            </button>
          </div>

          <form className="account-form" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <label>
                نام و نام خانوادگی
                <input
                  name="name"
                  autoComplete="name"
                  placeholder="مثلاً سعید متولی"
                  required
                />
              </label>
            )}
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
              رمز عبور
              <input
                name="password"
                type="password"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                placeholder="رمز عبور"
                required
              />
            </label>
            {mode === "signup" && (
              <label>
                تکرار رمز عبور
                <input
                  name="passwordConfirm"
                  type="password"
                  autoComplete="new-password"
                  placeholder="تکرار رمز عبور"
                  required
                />
              </label>
            )}
            <Button className="account-submit" type="submit">
              {mode === "login" ? "ورود به حساب" : "ساخت حساب کاربری"}{" "}
              <ArrowLeft size={16} />
            </Button>
          </form>

          <div className="account-divider">
            <span>یا</span>
          </div>
          <Link className="guest-link" href="/">
            ادامه خرید بدون ورود <ArrowLeft size={15} />
          </Link>
          <p className="account-disclaimer">
            نسخهٔ فعلی نمایشی است؛ اتصال حساب واقعی و درگاه بانکی در مرحلهٔ
            راه‌اندازی نهایی انجام می‌شود.
          </p>
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
            <Link href="/">صفحه اصلی</Link>
            <Link href="/countries">همه کشورها</Link>
            <Link href="/cart">سبد خرید</Link>
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
