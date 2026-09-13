"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { readStoredAccount } from "@/lib/account";

export function AccountLink() {
  const [label, setLabel] = useState("حساب کاربری");

  useEffect(() => {
    const account = readStoredAccount();
    setLabel(account?.name || "حساب کاربری");
  }, []);

  return (
    <Link
      className="account-button"
      href="/account"
      aria-label={
        label === "حساب کاربری" ? "حساب کاربری" : `حساب کاربری ${label}`
      }
    >
      <UserRound size={19} />
      <span className="account-name">{label}</span>
    </Link>
  );
}
