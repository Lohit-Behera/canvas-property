"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { withAuth } from "@/components/withAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { fetchCreateProperty } from "@/lib/features/propertySlice";
import { useAsyncDispatch, useDispatchWithToast } from "@/hooks/dispatch";
import { fetchGetAllCategories } from "@/lib/features/categorySlice";
import { useSelector } from "react-redux";

const allPropertyType = ["Residential", "Commercial", "Industrial", "Land"];

const propertySchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(50, "Title must be at most 50 characters"),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500, "Description must be at most 500 characters"),
  price: z
    .number()
    .positive({ message: "Amount must be a positive number" })
    .min(1, { message: "Amount must be at least 1" }),
  size: z
    .number()
    .positive({ message: "Size must be a positive number" })
    .min(1, { message: "Size must be at least 1" }),
  category: z.string(),
  subCategory: z.string(),
  address: z
    .string()
    .min(3, { message: "Address must be at least 3 characters" })
    .max(50, "Address must be at most 50 characters"),
  city: z.string(),
  postalCode: z
    .string()
    .min(3, { message: "Postal Code must be at least 3 characters" })
    .max(10, "Postal Code must be at most 10 characters"),
  thumbnail: z
    .array(
      z
        .any()
        .refine((file) => file instanceof File, {
          message: "Each thumbnail must be a file.",
        })
        .refine((file) => file?.size <= 3 * 1024 * 1024, {
          message: "Each thumbnail size must be less than 3MB.",
        })
        .refine((file) => ["image/jpeg", "image/png"].includes(file?.type), {
          message: "Only .jpg and .png formats are supported for thumbnails.",
        })
    )
    .min(1, { message: "At least one thumbnail is required." })
    .max(5, { message: "You can upload up to 5 thumbnails." }),
  bigImage: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Big image is required.",
    })
    .refine((file) => file?.size <= 3 * 1024 * 1024, {
      message: "Big image size must be less than 3MB.",
    })
    .refine((file) => ["image/jpeg", "image/png"].includes(file?.type), {
      message: "Only .jpg and .png formats are supported.",
    }),
});

function AddProperty() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = useSelector(
    (state) => state.category.getAllCategories.data
  );

  const fetchCategories = useAsyncDispatch(fetchGetAllCategories);
  useEffect(() => {
    fetchCategories();
  }, []);

  const form = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      price: undefined,
      size: undefined,
      category: "",
      subCategory: "",
      address: "",
      city: "",
      postalCode: "",
      thumbnail: undefined,
      bigImage: undefined,
    },
  });

  const handleCategoryChange = (category) => {
    form.setValue("category", category);
    form.setValue("subCategory", "");
    setSelectedCategory(category);
  };

  const selectedSubcategories =
    categories.find((cat) => cat.name === selectedCategory)?.subCategory || [];

  const createProperty = useDispatchWithToast(fetchCreateProperty, {
    loadingMessage: "Adding property...",
    getSuccessMessage: (data) => data.message || "Property added successfully",
    getErrorMessage: (error) =>
      error?.message ||
      error ||
      "Failed to add property. Please try again later.",
    onSuccess: () => {
      form.reset();
      router.push("/");
    },
  });

  function handleSubmit(data) {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("size", data.size);
    formData.append("category", data.category);
    formData.append("subCategory", data.subCategory);
    formData.append("city", data.city);
    formData.append("address", data.address);
    formData.append("postalCode", data.postalCode);

    if (data.thumbnail) {
      data.thumbnail.forEach((file) => {
        formData.append("thumbnail", file);
      });
    }

    if (data.bigImage) {
      formData.append("bigImage", data.bigImage);
    }

    createProperty(formData);
  }
  return (
    <Card className="w-full md:w-[90%]">
      <CardHeader>
        <CardTitle>Add Property</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="Amount"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="Amount"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>Size in square foot</FormDescription>
                </FormItem>
              )}
            />
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={handleCategoryChange}
                        className="w-full"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category._id}
                              value={category.name}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub Category</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedSubcategories.map((sub) => (
                            <SelectItem key={sub} value={sub}>
                              {sub}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Choose the category first, then the subcategory.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Postal Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      name="thumbnail"
                      onChange={(e) =>
                        field.onChange(Array.from(e.target.files || []))
                      }
                      placeholder="Upload Thumbnails"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bigImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Big Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) =>
                        field.onChange(e.target.files?.[0] || null)
                      }
                      placeholder="Thumbnail"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" size="sm" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default withAuth(AddProperty);
