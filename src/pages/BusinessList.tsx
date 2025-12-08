import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, ArrowLeft, Star, MapPin, Instagram, Loader2, Building2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface Business {
  id: string;
  name: string;
  description: string | null;
  average_rating: number | null;
  total_reviews: number | null;
  city: string | null;
  address: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  instagram: string | null;
}

const BusinessList = () => {
  const { categorySlug, subService } = useParams();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [subcategoryName, setSubcategoryName] = useState("");

  const decodedSubService = subService
    ? decodeURIComponent(subService).replace(/-/g, " ")
    : "";

  useEffect(() => {
    const fetchBusinesses = async () => {
      if (!subService) return;

      setLoading(true);
      try {
        // First, find the subcategory by matching the name
        const searchTerm = decodedSubService.toLowerCase();

        const { data: subcategories } = await supabase
          .from("subcategories")
          .select("id, name_az")
          .ilike("name_az", `%${searchTerm}%`);

        if (subcategories && subcategories.length > 0) {
          setSubcategoryName(subcategories[0].name_az);
          const subcategoryIds = subcategories.map(s => s.id);

          // Get business IDs that have this subcategory
          const { data: businessServices } = await supabase
            .from("business_services")
            .select("business_id")
            .in("subcategory_id", subcategoryIds);

          if (businessServices && businessServices.length > 0) {
            const businessIds = [...new Set(businessServices.map(bs => bs.business_id))];

            // Get the actual businesses (only approved and active)
            const { data: businessData } = await supabase
              .from("businesses")
              .select("id, name, description, average_rating, total_reviews, city, address, logo_url, cover_image_url, instagram")
              .in("id", businessIds)
              .eq("is_approved", true)
              .eq("is_active", true)
              .order("average_rating", { ascending: false });

            if (businessData) {
              setBusinesses(businessData);
            }
          }
        } else {
          setSubcategoryName(decodedSubService);
        }
      } catch (error) {
        console.error("Error fetching businesses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [subService, decodedSubService]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Ana səhifə
                </Link>
              </li>
              <ChevronRight className="w-4 h-4" />
              <li>
                <Link
                  to={`/category/${categorySlug}`}
                  className="hover:text-foreground transition-colors"
                >
                  Kateqoriya
                </Link>
              </li>
              <ChevronRight className="w-4 h-4" />
              <li className="text-foreground capitalize">{subcategoryName || decodedSubService}</li>
            </ol>
          </nav>

          {/* Title */}
          <div className="mb-10">
            <Link
              to={`/category/${categorySlug}`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Geri</span>
            </Link>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground capitalize">
              {subcategoryName || decodedSubService}
            </h1>
            <p className="text-muted-foreground mt-3">
              {loading ? "Yüklənir..." : `${businesses.length} nəticə tapıldı`}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Empty State */}
          {!loading && businesses.length === 0 && (
            <div className="text-center py-20">
              <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-serif text-xl text-foreground mb-2">
                Hələ heç bir biznes yoxdur
              </h3>
              <p className="text-muted-foreground">
                Bu kateqoriyada hələ ki heç bir biznes qeydiyyatdan keçməyib.
              </p>
            </div>
          )}

          {/* Business List */}
          {!loading && businesses.length > 0 && (
            <div className="space-y-4">
              {businesses.map((business, index) => (
                <Link
                  key={business.id}
                  to={`/business/${business.id}`}
                  className="glass-card-hover rounded-2xl p-4 md:p-6 flex gap-4 md:gap-6 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Image */}
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0 bg-primary/10">
                    {business.logo_url || business.cover_image_url ? (
                      <img
                        src={business.logo_url || business.cover_image_url || ""}
                        alt={business.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-10 h-10 text-primary/50" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-xl md:text-2xl text-foreground truncate">
                        {business.name}
                      </h3>
                      <div className="flex items-center gap-1 text-amber-500 flex-shrink-0">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium text-foreground">
                          {business.average_rating?.toFixed(1) || "0.0"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({business.total_reviews || 0} rəy)
                        </span>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                      {business.description || "Təsvir mövcud deyil"}
                    </p>

                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      {business.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {business.city}
                        </span>
                      )}
                      {business.instagram && (
                        <span className="hidden md:flex items-center gap-1">
                          <Instagram className="w-4 h-4" />
                          @{business.instagram.replace("@", "")}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <span className="button-gradient text-primary-foreground text-sm px-4 py-2 rounded-full font-medium">
                        Profili aç
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BusinessList;
