export type UserAccount = {
  name: string;
  mobile: string;
};

export function readStoredAccount(): UserAccount | null {
  if (typeof window === "undefined") return null;
  const savedAccount = window.localStorage.getItem("darafsh-user");
  if (!savedAccount) return null;
  try {
    const parsedAccount = JSON.parse(savedAccount);
    if (typeof parsedAccount?.name === "string" && parsedAccount.name.trim()) {
      return {
        name: parsedAccount.name.trim(),
        mobile: typeof parsedAccount.mobile === "string" ? parsedAccount.mobile : "",
      };
    }
  } catch {
    window.localStorage.removeItem("darafsh-user");
  }
  return null;
}

export function saveStoredAccount(account: UserAccount) {
  window.localStorage.setItem("darafsh-user", JSON.stringify(account));
}
