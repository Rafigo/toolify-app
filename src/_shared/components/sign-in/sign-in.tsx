"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { UserCircle } from "lucide-react";

export default function SignIn() {
  const t = useTranslations("AppHeader");
  return (
    <Button onClick={() => signIn("keycloak")}>
      <UserCircle /> {t("login")}
    </Button>
  );
}
