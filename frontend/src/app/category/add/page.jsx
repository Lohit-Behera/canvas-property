"use client";

import React, { useState } from "react";
import { withAuth } from "@/components/withAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { fetchCreateCategory } from "@/lib/features/categorySlice";
import { useDispatchWithToast } from "@/hooks/dispatch";

const createCategorySchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  subCategory: z
    .array(z.string())
    .min(1, { message: "SubCategory must be at least 1 item" }),
});

function AddCategory() {
  const [subCategoryInput, setSubCategoryInput] = useState("");

  const form = useForm({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      subCategory: [],
    },
  });

  // Watch the subCategory field for changes
  const subCategories = useWatch({
    control: form.control,
    name: "subCategory",
  });

  function handleAddSubCategory() {
    const trimmedInput = subCategoryInput.trim();
    if (trimmedInput) {
      const currentSubCategories = form.getValues("subCategory");
      form.setValue("subCategory", [...currentSubCategories, trimmedInput]);
      setSubCategoryInput("");
    }
  }

  function handleRemoveSubCategory(index) {
    const updatedSubCategories = form
      .getValues("subCategory")
      .filter((_, i) => i !== index);
    form.setValue("subCategory", updatedSubCategories);
  }

  const createCategory = useDispatchWithToast(fetchCreateCategory, {
    loadingMessage: "Creating category...",
    getSuccessMessage: (data) =>
      data.message || "Category created successfully!",
    getErrorMessage: (error) =>
      error.message ||
      error ||
      "Failed to create category. Please try again later.",
    onSuccess: () => {
      form.reset();
    },
  });

  function handleSubmit(values) {
    createCategory(values);
  }

  return (
    <Card className="w-full md:w-[95%]">
      <CardHeader>
        <CardTitle>Add Category</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SubCategory Field */}
            <div>
              <FormItem>
                <FormLabel>SubCategory</FormLabel>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add SubCategory"
                    value={subCategoryInput}
                    onChange={(e) => setSubCategoryInput(e.target.value)}
                  />
                  <Button type="button" onClick={handleAddSubCategory}>
                    Add
                  </Button>
                </div>
                <FormMessage />
              </FormItem>

              {/* List of SubCategories */}
              <div className="flex flex-wrap space-x-2 mt-2">
                {subCategories.map((subCategory, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-muted px-2 py-1 rounded-md space-x-2 my-2"
                  >
                    <span>{subCategory}</span>
                    <span
                      className="cursor-pointer px-1"
                      onClick={() => handleRemoveSubCategory(index)}
                    >
                      X
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default withAuth(AddCategory);
