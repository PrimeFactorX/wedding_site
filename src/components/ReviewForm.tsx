import { useState, useRef } from "react";
import { Star, X, Camera, Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReviewFormProps {
  businessId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ReviewForm = ({ businessId, onSuccess, onCancel }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 3 - selectedImages.length); // Max 3 images
    setSelectedImages((prev) => [...prev, ...newFiles]);

    // Create preview URLs
    newFiles.forEach((file) => {
      const url = URL.createObjectURL(file);
      setPreviewUrls((prev) => [...prev, url]);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of selectedImages) {
      const fileExt = file.name.split(".").pop();
      const fileName = `reviews/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("business-media")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("business-media")
        .getPublicUrl(fileName);

      uploadedUrls.push(urlData.publicUrl);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Zəhmət olmasa reytinq seçin");
      return;
    }

    if (!reviewerName.trim()) {
      toast.error("Zəhmət olmasa ad və soyadınızı daxil edin");
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload images first
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        imageUrls = await uploadImages();
      }

      // Store the name, comment and images using JSON format
      const reviewData = JSON.stringify({
        name: reviewerName.trim(),
        text: comment.trim(),
        images: imageUrls
      });

      // Create review (user_id is null for anonymous reviews)
      const { error } = await supabase
        .from("reviews")
        .insert({
          business_id: businessId,
          user_id: null,
          rating,
          comment: reviewData,
        });

      if (error) throw error;

      // Update business average rating
      const { data: reviews } = await supabase
        .from("reviews")
        .select("rating")
        .eq("business_id", businessId);

      if (reviews && reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await supabase
          .from("businesses")
          .update({
            average_rating: avgRating,
            total_reviews: reviews.length
          })
          .eq("id", businessId);
      }

      toast.success("Rəyiniz uğurla əlavə edildi!");
      setRating(0);
      setComment("");
      setReviewerName("");
      setSelectedImages([]);
      setPreviewUrls([]);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating review:", error);
      toast.error(error.message || "Rəy əlavə edilə bilmədi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 relative">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <h3 className="font-serif text-xl text-foreground mb-4">Rəy yazın</h3>

      {/* Name Field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-2">
          Ad və Soyadınız *
        </label>
        <input
          type="text"
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          placeholder="Adınız Soyadınız"
          required
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-text"
        />
      </div>

      {/* Star Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-2">
          Reytinq *
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110 cursor-pointer"
            >
              <Star
                className={`w-8 h-8 transition-colors ${star <= (hoverRating || rating)
                  ? "text-amber-500 fill-current"
                  : "text-muted"
                  }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-2">
          Şərhiniz (istəyə bağlı)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Təcrübənizi paylaşın..."
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none cursor-text"
          rows={4}
        />
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-2">
          Şəkillər (istəyə bağlı, maks. 3 ədəd)
        </label>

        {/* Preview Images */}
        {previewUrls.length > 0 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Image Button */}
        {selectedImages.length < 3 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-foreground transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span className="text-sm">Şəkil əlavə et</span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting || rating === 0 || !reviewerName.trim()}
          className="button-gradient text-primary-foreground px-6 py-3 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Göndərilir..." : "Rəy göndər"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-full border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Ləğv et
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
