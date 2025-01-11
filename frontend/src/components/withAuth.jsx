"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export function withAuth(Component) {
  return function AuthWrapper(props) {
    const router = useRouter();
    const userInfo = useSelector((state) => state.user.userInfo);

    useEffect(() => {
      if (!userInfo) {
        router.replace("/login");
      }
    }, [userInfo]);

    return <Component {...props} />;
  };
}
