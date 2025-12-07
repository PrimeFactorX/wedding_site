import { useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCreateReview } from "@/hooks/useBusinesses";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface ReviewFormProps {
  businessId: string;
  onSuccess?: () => void;
}

const ReviewForm = ({ businessId, onSuccess }: ReviewFormProps) => {
  const { user, userRole } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const createReview = useCreateReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Rəy yazmaq üçün daxil olun");
      return;
    }

    if (rating === 0) {
      toast.error("Zəhmət olmasa reytinq seçin");
      return;
    }

    try {
      await createReview.mutateAsync({
        businessId,
        userId: user.id,
        rating,
        comment: comment.trim() || undefined,
      });

      toast.success("Rəyiniz uğurla əlavə edildi!");
      setRating(0);
      setComment("");
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating review:", error);
      toast.error(error.message || "Rəy əlavə edilə bilmədi");
    }
  };

  if (!user) {
    return (
      <div className="glass-card rounded-xl p-6 text-center">
        <p className="text-muted-foreground mb-4">
          Rəy yazmaq üçün daxil olmalısınız
        </p>
        <Link
          to="/auth?mode=login"
          className="button-gradient text-primary-foreground px-6 py-2.5 rounded-full font-medium inline-block"
        >
          Daxil ol
        </Link>
      </div>
    );
  }

  if (userRole !== "customer") {
    return (
      <div className="glass-card rounded-xl p-6 text-center">
        <p className="text-muted-foreground">
          Yalnız müştərilər rəy yaza bilər
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6">
      <h3 className="font-serif text-xl text-foreground mb-4">Rəy yazın</h3>

      {/* Star Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-2">
          Reytinq
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= (hoverRating || rating)
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
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={createReview.isPending || rating === 0}
        className="button-gradient text-primary-foreground px-6 py-3 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {createReview.isPending ? "Göndərilir..." : "Rəy göndər"}
      </button>
    </form>
  );
};

export default ReviewForm;
