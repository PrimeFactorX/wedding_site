import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Instagram,
  MessageCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Building2,
  DollarSign,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import ReviewForm from "@/components/ReviewForm";

interface Business {
  id: string;
  name: string;
  description: string | null;
  average_rating: number | null;
  total_reviews: number | null;
  city: string | null;
  address: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  min_price: number | null;
  max_price: number | null;
  price_note: string | null;
}

interface MediaItem {
  id: string;
  media_url: string;
  caption: string | null;
  media_type: string | null;
}

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profile?: {
    full_name: string | null;
  };
  reply?: {
    reply_text: string;
  };
}

const BusinessProfile = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState<Business | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<number | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // Fetch business
        const { data: businessData, error: businessError } = await supabase
          .from("businesses")
          .select("*")
          .eq("id", id)
          .single();

        if (businessError || !businessData) {
          console.error("Error fetching business:", businessError);
          setLoading(false);
          return;
        }

        setBusiness(businessData);

        // Fetch active subscription
        const { data: subData } = await supabase
          .from("business_subscriptions")
          .select("plan:subscription_plans(name)")
          .eq("business_id", id)
          .eq("status", "active")
          .maybeSingle();

        if (subData?.plan) {
          // @ts-ignore
          setPlan(subData.plan.name);
        }

        // Increment view count
        await supabase
          .from("businesses")
          .update({ total_views: (businessData.total_views || 0) + 1 })
          .eq("id", id);

        // Fetch media
        const { data: mediaData } = await supabase
          .from("business_media")
          .select("*")
          .eq("business_id", id)
          .order("created_at", { ascending: false });

        if (mediaData) {
          setMedia(mediaData);
        }

        // Fetch reviews with profiles and replies
        const { data: reviewsData } = await supabase
          .from("reviews")
          .select(`
            id,
            user_id,
            rating,
            comment,
            created_at
          `)
          .eq("business_id", id)
          .order("created_at", { ascending: false });

        if (reviewsData) {
          // Fetch profiles for reviewers
          const userIds = reviewsData.map(r => r.user_id);
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, full_name")
            .in("id", userIds);

          // Fetch replies
          const reviewIds = reviewsData.map(r => r.id);
          const { data: replies } = await supabase
            .from("review_replies")
            .select("review_id, reply_text")
            .in("review_id", reviewIds);

          const reviewsWithData = reviewsData.map(review => ({
            ...review,
            profile: profiles?.find(p => p.id === review.user_id) || null,
            reply: replies?.find(r => r.review_id === review.id) || null,
          }));

          setReviews(reviewsWithData);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [id]);

  const handleWhatsApp = () => {
    if (!business?.whatsapp) return;
    const message = encodeURIComponent(
      `Salam! Memora.az platformasından yazıram. ${business.name} haqqında məlumat almaq istəyirəm.`
    );
    window.open(
      `https://wa.me/${business.whatsapp.replace(/\+/g, "").replace(/\s/g, "")}?text=${message}`,
      "_blank"
    );
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    // Refetch reviews
    if (id) {
      supabase
        .from("reviews")
        .select("id, user_id, rating, comment, created_at")
        .eq("business_id", id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          if (data) {
            setReviews(data);
          }
        });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16 px-4 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-serif text-3xl text-foreground mb-4">
              Biznes tapılmadı
            </h1>
            <Link
              to="/"
              className="text-primary hover:underline inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Ana səhifəyə qayıt
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Geri</span>
          </Link>

          {/* Cover Image */}
          {business.cover_image_url && (
            <div className="h-48 md:h-64 rounded-2xl overflow-hidden mb-6">
              <img
                src={business.cover_image_url}
                alt={business.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Profile Header */}
          <div className="glass-card rounded-2xl p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden flex-shrink-0 mx-auto md:mx-0 bg-primary/10">
                {business.logo_url ? (
                  <img
                    src={business.logo_url}
                    alt={business.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-primary" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2">
                  {business.name}
                  {plan === "Premium" && (
                    <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20">
                      PRO
                    </span>
                  )}
                  {plan === "Professional" && (
                    <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
                      PRO
                    </span>
                  )}
                </h1>

                <div className="flex items-center justify-center md:justify-start gap-2 text-amber-500 mb-3">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-medium text-foreground">
                    {business.average_rating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="text-muted-foreground">
                    ({business.total_reviews || 0} rəy)
                  </span>
                </div>

                {business.description && (
                  <p className="text-muted-foreground mb-4 max-w-2xl">
                    {business.description}
                  </p>
                )}

                {/* Price Range */}
                {(business.min_price || business.max_price) && (
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-4 text-foreground">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="font-medium">
                      {business.min_price && business.max_price
                        ? `${business.min_price} - ${business.max_price} AZN`
                        : business.min_price
                          ? `${business.min_price} AZN-dən`
                          : `${business.max_price} AZN-ə qədər`}
                    </span>
                    {business.price_note && (
                      <span className="text-sm text-muted-foreground">
                        ({business.price_note})
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                  {business.address && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {business.address}{business.city && `, ${business.city}`}
                    </span>
                  )}
                  {business.instagram && (
                    <a
                      href={`https://instagram.com/${business.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                      @{business.instagram.replace("@", "")}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Media Grid */}
          {media.length > 0 && (
            <section className="mb-12">
              <h2 className="font-serif text-2xl text-foreground mb-6">
                Portfolio
              </h2>
              <div className="grid grid-cols-3 gap-1 md:gap-2 rounded-2xl overflow-hidden">
                {media.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedMedia(index)}
                    className="aspect-square overflow-hidden relative group"
                  >
                    <img
                      src={item.media_url}
                      alt={item.caption || ""}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors" />
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-foreground">
                Rəylər ({reviews.length})
              </h2>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="button-gradient text-primary-foreground px-4 py-2 rounded-full text-sm font-medium"
              >
                Rəy yaz
              </button>
            </div>

            {showReviewForm && (
              <div className="mb-6">
                <ReviewForm
                  businessId={business.id}
                  onSuccess={handleReviewSubmitted}
                  onCancel={() => setShowReviewForm(false)}
                />
              </div>
            )}

            {reviews.length === 0 ? (
              <div className="glass-card rounded-xl p-8 text-center">
                <p className="text-muted-foreground">
                  Hələ heç bir rəy yazılmayıb. İlk rəyi siz yazın!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => {
                  // Parse the comment to extract name, text and images
                  let reviewerName = "Anonim";
                  let reviewText = review.comment || "";
                  let reviewImages: string[] = [];

                  try {
                    if (review.comment && review.comment.startsWith("{")) {
                      const parsed = JSON.parse(review.comment);
                      reviewerName = parsed.name || "Anonim";
                      reviewText = parsed.text || "";
                      reviewImages = parsed.images || [];
                    }
                  } catch (e) {
                    // If parsing fails, use the comment as-is (for old reviews)
                    reviewText = review.comment || "";
                    // Try to get name from profile as fallback
                    reviewerName = review.profile?.full_name || "Anonim";
                  }

                  return (
                    <div
                      key={review.id}
                      className="glass-card rounded-xl p-5"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-foreground font-medium">
                          {reviewerName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">
                            {reviewerName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString("az-AZ")}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating
                                ? "text-amber-500 fill-current"
                                : "text-muted"
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                      {reviewText && (
                        <p className="text-foreground/90">{reviewText}</p>
                      )}
                      {/* Review Images */}
                      {reviewImages.length > 0 && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {reviewImages.map((imgUrl, idx) => (
                            <a
                              key={idx}
                              href={imgUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-20 h-20 rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                            >
                              <img
                                src={imgUrl}
                                alt={`Review image ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </a>
                          ))}
                        </div>
                      )}
                      {review.reply && (
                        <div className="mt-4 ml-4 pl-4 border-l-2 border-primary/30">
                          <div className="text-sm font-medium text-foreground mb-1">
                            Biznes cavabı:
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {review.reply.reply_text}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Contact Buttons (Fixed at bottom on mobile) */}
          <div className="fixed bottom-0 left-0 right-0 p-4 glass-effect border-t border-border md:static md:p-0 md:bg-transparent md:border-none md:backdrop-blur-none">
            <div className="flex gap-3 max-w-5xl mx-auto">
              {business.whatsapp && (
                <button
                  onClick={handleWhatsApp}
                  className="flex-1 button-gradient text-primary-foreground py-3.5 rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp ilə əlaqə</span>
                </button>
              )}
              {business.phone && (
                <a
                  href={`tel:${business.phone}`}
                  className="flex items-center justify-center px-6 py-3.5 rounded-full border border-border hover:bg-muted transition-colors"
                >
                  <Phone className="w-5 h-5" />
                </a>
              )}
              {business.instagram && (
                <a
                  href={`https://instagram.com/${business.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-6 py-3.5 rounded-full border border-border hover:bg-muted transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Add bottom padding for fixed buttons on mobile */}
          <div className="h-20 md:hidden" />
        </div>
      </main>
      <Footer />

      {/* Media Modal */}
      {selectedMedia !== null && media.length > 0 && (
        <div className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center">
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-4 right-4 text-background hover:text-background/80 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={() =>
              setSelectedMedia(
                (selectedMedia - 1 + media.length) % media.length
              )
            }
            className="absolute left-4 text-background hover:text-background/80 transition-colors"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <div className="max-w-4xl max-h-[80vh] mx-4">
            <img
              src={media[selectedMedia].media_url}
              alt={media[selectedMedia].caption || ""}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
            {media[selectedMedia].caption && (
              <div className="text-center mt-4">
                <p className="text-background text-lg">
                  {media[selectedMedia].caption}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() =>
              setSelectedMedia((selectedMedia + 1) % media.length)
            }
            className="absolute right-4 text-background hover:text-background/80 transition-colors"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BusinessProfile;
