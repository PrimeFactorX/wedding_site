import { useParams, Link } from "react-router-dom";
import { ChevronRight, ArrowLeft, Star, MapPin, Phone, Instagram } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock business data
const mockBusinesses = [
  {
    id: "1",
    name: "Glamour Beauty Salon",
    description: "Premium makiyaj və gözəllik xidmətləri",
    rating: 4.9,
    reviewCount: 128,
    city: "Bakı",
    address: "Nizami küç. 45",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop",
    phone: "+994501234567",
    instagram: "glamour_baku",
  },
  {
    id: "2",
    name: "Elite Makiyaj Studio",
    description: "Peşəkar gəlin makiyajı mütəxəssisi",
    rating: 4.8,
    reviewCount: 95,
    city: "Bakı",
    address: "28 May küç. 12",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop",
    phone: "+994507654321",
    instagram: "elite_makeup_baku",
  },
  {
    id: "3",
    name: "Beauty House",
    description: "Gözəllik xidmətlərinin tam spektri",
    rating: 4.7,
    reviewCount: 72,
    city: "Sumqayıt",
    address: "Heydər Əliyev pr. 88",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=400&fit=crop",
    phone: "+994559876543",
    instagram: "beautyhouse_sumqayit",
  },
  {
    id: "4",
    name: "Lux Gözəllik Mərkəzi",
    description: "VIP xidmət, müasir avadanlıq",
    rating: 4.6,
    reviewCount: 64,
    city: "Bakı",
    address: "Xətai rayonu",
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=400&fit=crop",
    phone: "+994703456789",
    instagram: "lux_gozellik",
  },
];

const BusinessList = () => {
  const { categorySlug, subService } = useParams();
  const decodedSubService = subService
    ? decodeURIComponent(subService).replace(/-/g, " ")
    : "";

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
              <li className="text-foreground capitalize">{decodedSubService}</li>
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
              {decodedSubService}
            </h1>
            <p className="text-muted-foreground mt-3">
              {mockBusinesses.length} nəticə tapıldı
            </p>
          </div>

          {/* Business List */}
          <div className="space-y-4">
            {mockBusinesses.map((business, index) => (
              <Link
                key={business.id}
                to={`/business/${business.id}`}
                className="glass-card-hover rounded-2xl p-4 md:p-6 flex gap-4 md:gap-6 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={business.image}
                    alt={business.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
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
                        {business.rating}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({business.reviewCount} rəy)
                      </span>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                    {business.description}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {business.city}
                    </span>
                    <span className="hidden md:flex items-center gap-1">
                      <Instagram className="w-4 h-4" />
                      @{business.instagram}
                    </span>
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BusinessList;
