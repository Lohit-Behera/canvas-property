"use client";

import { fetchUserDetails } from "@/lib/features/userSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function UserDetailsWrapper({ children }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const userDetailsStatus = useSelector(
    (state) => state.user.userDetailsStatus
  );

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchUserDetails());
    }
  }, []);
  return (
    <>
      {userDetailsStatus === "loading" ? (
        <p>Loading</p>
      ) : userDetailsStatus === "failed" ? (
        <p>Error</p>
      ) : userDetailsStatus === "succeeded" || userDetailsStatus === "idle" ? (
        children
      ) : null}
    </>
  );
}

export default UserDetailsWrapper;
