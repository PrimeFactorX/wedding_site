import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  name: string;
  name_az: string;
  slug: string;
  image_url: string | null;
  description: string | null;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  name_az: string;
  slug: string;
}

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at");

      if (error) throw error;
      return data as Category[];
    },
  });
};

export const useSubcategories = (categoryId?: string) => {
  return useQuery({
    queryKey: ["subcategories", categoryId],
    queryFn: async () => {
      let query = supabase.from("subcategories").select("*");
      
      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }
      
      const { data, error } = await query.order("name_az");

      if (error) throw error;
      return data as Subcategory[];
    },
    enabled: !!categoryId,
  });
};

export const useCategoryBySlug = (slug?: string) => {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data as Category | null;
    },
    enabled: !!slug,
  });
};
