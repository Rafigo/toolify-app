"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";

export default function SignOut() {
  const t = useTranslations("AppHeader");
  return (
    <Button variant="destructive" onClick={() => signOut({ callbackUrl: "/" })}>
      <LogOut /> {t("logout")}
    </Button>
  );
}
