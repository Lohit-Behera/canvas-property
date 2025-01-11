"use client";

import { withAuth } from "@/components/withAuth";

function Home() {
  return (
   <div>
    Home Page
   </div>
  );
}

export default withAuth(Home)