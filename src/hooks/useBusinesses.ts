import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  address: string | null;
  city: string | null;
  is_active: boolean;
  is_approved: boolean;
  average_rating: number;
  total_reviews: number;
  total_views: number;
  created_at: string;
  updated_at: string;
}

export interface BusinessMedia {
  id: string;
  business_id: string;
  media_url: string;
  media_type: string;
  caption: string | null;
  service_tag: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  business_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  };
  review_replies?: ReviewReply[];
}

export interface ReviewReply {
  id: string;
  review_id: string;
  business_id: string;
  reply_text: string;
  created_at: string;
}

export const useBusinesses = (subcategorySlug?: string) => {
  return useQuery({
    queryKey: ["businesses", subcategorySlug],
    queryFn: async () => {
      let query = supabase
        .from("businesses")
        .select("*")
        .eq("is_active", true)
        .eq("is_approved", true)
        .order("average_rating", { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return data as Business[];
    },
  });
};

export const useBusinessById = (id?: string) => {
  return useQuery({
    queryKey: ["business", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Business | null;
    },
    enabled: !!id,
  });
};

export const useBusinessMedia = (businessId?: string) => {
  return useQuery({
    queryKey: ["business-media", businessId],
    queryFn: async () => {
      if (!businessId) return [];

      const { data, error } = await supabase
        .from("business_media")
        .select("*")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as BusinessMedia[];
    },
    enabled: !!businessId,
  });
};

export const useBusinessReviews = (businessId?: string) => {
  return useQuery({
    queryKey: ["business-reviews", businessId],
    queryFn: async () => {
      if (!businessId) return [];

      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          ),
          review_replies (*)
        `)
        .eq("business_id", businessId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
    enabled: !!businessId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      businessId,
      userId,
      rating,
      comment,
      photoUrl,
    }: {
      businessId: string;
      userId: string;
      rating: number;
      comment?: string;
      photoUrl?: string;
    }) => {
      const { data, error } = await supabase
        .from("reviews")
        .insert({
          business_id: businessId,
          user_id: userId,
          rating,
          comment: comment || null,
          photo_url: photoUrl || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["business-reviews", variables.businessId] });
      queryClient.invalidateQueries({ queryKey: ["business", variables.businessId] });
    },
  });
};

export const useIncrementBusinessView = () => {
  return useMutation({
    mutationFn: async (businessId: string) => {
      const { error } = await supabase.rpc("increment_business_views", {
        business_id: businessId,
      });
      if (error) throw error;
    },
  });
};
