"use client";

import { useAsyncDispatch } from "@/hooks/dispatch";
import { fetchUserDetails } from "@/lib/features/userSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function UserDetailsWrapper({ children }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const userDetailsStatus = useSelector(
    (state) => state.user.userDetailsStatus
  );
  const userDetailsError = useSelector((state) => state.user.userDetailsError);
  const fetchDetails = useAsyncDispatch(fetchUserDetails);
  useEffect(() => {
    if (userInfo) {
      fetchDetails();
    }
  }, []);
  return (
    <>
      {userDetailsStatus === "loading" ? (
        <p>Loading</p>
      ) : userDetailsStatus === "failed" ? (
        <>
          {userDetailsError === "Refresh token expired" ? (
            children
          ) : (
            <p>Error</p>
          )}
        </>
      ) : userDetailsStatus === "succeeded" || userDetailsStatus === "idle" ? (
        children
      ) : null}
    </>
  );
}

export default UserDetailsWrapper;
