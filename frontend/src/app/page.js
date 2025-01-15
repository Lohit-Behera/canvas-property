"use client";

import { withAuth } from "@/components/withAuth";
import { useSelector } from "react-redux";
import { fetchGetAllProperties } from "@/lib/features/propertySlice";
import { useEffect } from "react";
import { useAsyncDispatch } from "@/hooks/dispatch";

function Home() {
  const properties = useSelector(
    (state) => state.property.getAllProperties.data
  )
  const fetchProperties = useAsyncDispatch(fetchGetAllProperties);
  useEffect(() => {
    fetchProperties();
  }, []);
  return (
   <div className="p-4 rounded-md border w-full md:w-[95%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {properties.map((property) => (
      <div key={property._id} className="p-2 rounded-md border">
        <img
          src={property.thumbnail}
          alt={property.title}
          className="w-full h-44 rounded-md object-cover"
        />
        <h3 className="text-base md:text-lg font-semibold ">{property.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{property.description}</p>
      </div>
    ))}
   </div>
  );
}

export default withAuth(Home)