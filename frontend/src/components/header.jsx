"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { fetchLogout } from "@/lib/features/userSlice";
const ModeToggle = dynamic(
  () => import("@/components/mode-toggle").then((mod) => mod.ModeToggle),
  {
    ssr: false,
  }
);

function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const userInfo = useSelector((state) => state.user.userInfo);
  const userDetailsError = useSelector((state) => state.user.userDetailsError);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <header className="flex flex-col space-y-4 z-20 w-full sticky top-0 p-2 backdrop-blur bg-background">
      {isClient ? (
        <nav className="flex justify-between gap-2">
          <Link href="/">
            <h1 className="text-2xl font-bold">Logo</h1>
          </Link>
          <div className="flex space-x-2">
            {userDetailsError !== "Refresh token expired" && (
              <>
                {userInfo ? (
                  <>
                    <Button
                      variant={
                        pathname === "/property/add" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => router.push("/property/add")}
                    >
                      Add Property
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => dispatch(fetchLogout())}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button
                    variant={pathname === "/login" ? "default" : "outline"}
                    size="sm"
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </Button>
                )}
              </>
            )}
            <ModeToggle />
          </div>
        </nav>
      ) : null}
    </header>
  );
}

export default Header;
