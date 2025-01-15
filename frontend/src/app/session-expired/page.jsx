"use client";

import { Button } from "@/components/ui/button";
import { reLogin } from "@/lib/features/userSlice";
import { TriangleAlert } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

function SessionExpired() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleReLogin = () => {
    dispatch(reLogin());
    router.push("/login");
  };
  return (
    <div className="w-full md:w-[70%] lg:w-[50%] min-h-[60vh] bg-muted rounded-md p-6 flex flex-col items-center justify-center">
      <TriangleAlert className="w-20 h-20 text-red-700" />
      <h1 className="text-xl md:text-2xl font-bold">
        Your session has expired.
      </h1>
      <p className="text-base md:text-lg font-semibold text-muted-foreground">
        Please login again
      </p>
      <Button className="mt-4" onClick={handleReLogin}>
        Login
      </Button>
    </div>
  );
}

export default SessionExpired;
