import { Atom, CircleUser } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import SignIn from "@/components/sign-in/sign-in";

export default function AppHeader() {
  const { data: session, status } = useSession();
  const t = useTranslations("AppHeader");
  return (
    <header className="sticky top-0 h-16 text-gray-950 border-b border-gray-300 bg-gray-50">
      <div className="items-center justify-between h-full max-w-screen-lg mx-auto flex">
        <div className="flex gap-8 items-center ml-4">
          <Link href="/">
            <div className="flex gap-3 h-14 items-center">
              <Atom size={24} />
              <span className="font-bold text-lg">{t("title")}</span>
            </div>
          </Link>
        </div>

        <div className="flex gap-4 items-center mr-4">
          <nav>
            <ul className="flex gap-6 items-center">
              <li>
                {status === "loading" ? (
                  <p>Loading…</p>
                ) : session ? (
                  <Link href="/account" className="flex items-center gap-2">
                    <span>{session?.user.name}</span>
                    <CircleUser size={20} />
                  </Link>
                ) : (
                  <SignIn />
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
