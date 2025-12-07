import { useState } from "react";
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
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock business data
const mockBusiness = {
  id: "1",
  name: "Glamour Beauty Salon",
  description:
    "Premium makiyaj və gözəllik xidmətləri. 10 ildən çox təcrübə ilə gəlin makiyajı, peşəkar saç düzümü və daha çox xidmətlər təklif edirik. Hər bir müştərimizə fərdi yanaşma ilə xidmət göstəririk.",
  rating: 4.9,
  reviewCount: 128,
  city: "Bakı",
  address: "Nizami küç. 45, Səbail rayonu",
  phone: "+994501234567",
  instagram: "glamour_baku",
  whatsapp: "+994501234567",
  logo: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop",
  media: [
    {
      id: "1",
      type: "image" as const,
      url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=600&fit=crop",
      caption: "Gəlin makiyajı",
      service: "Makiyaj",
    },
    {
      id: "2",
      type: "image" as const,
      url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop",
      caption: "Saç düzümü",
      service: "Saç",
    },
    {
      id: "3",
      type: "image" as const,
      url: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=600&fit=crop",
      caption: "Professional makiyaj",
      service: "Makiyaj",
    },
    {
      id: "4",
      type: "image" as const,
      url: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&h=600&fit=crop",
      caption: "Gözəllik prosedurları",
      service: "Üz qayğısı",
    },
    {
      id: "5",
      type: "image" as const,
      url: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=600&fit=crop",
      caption: "Salon interieri",
      service: "Salon",
    },
    {
      id: "6",
      type: "image" as const,
      url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=600&fit=crop",
      caption: "Dırnaq dizaynı",
      service: "Dırnaq",
    },
  ],
  reviews: [
    {
      id: "1",
      userName: "Aynur M.",
      rating: 5,
      text: "Əla xidmət! Gəlin makiyajım çox gözəl oldu, bütün günü davam etdi.",
      date: "2024-01-15",
      businessReply:
        "Çox sağ olun, Aynur xanım! Sizə xidmət etmək bizim üçün şərəf idi 💕",
    },
    {
      id: "2",
      userName: "Nigar K.",
      rating: 5,
      text: "Professional yanaşma, gözəl atmosfer. Tövsiyə edirəm!",
      date: "2024-01-10",
    },
    {
      id: "3",
      userName: "Leyla H.",
      rating: 4,
      text: "Xidmət yaxşı idi, amma bir az gec başladı.",
      date: "2024-01-05",
      businessReply:
        "Təşəkkürlər rəyiniz üçün, Leyla xanım. Gecikmə üçün üzr istəyirik, bundan sonra daha diqqətli olacağıq.",
    },
  ],
};

const BusinessProfile = () => {
  const { id } = useParams();
  const [selectedMedia, setSelectedMedia] = useState<number | null>(null);

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Salam! Bayram.az platformasından yazıram. ${mockBusiness.name} haqqında məlumat almaq istəyirəm.`
    );
    window.open(
      `https://wa.me/${mockBusiness.whatsapp.replace(/\+/g, "")}?text=${message}`,
      "_blank"
    );
  };

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

          {/* Profile Header */}
          <div className="glass-card rounded-2xl p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden flex-shrink-0 mx-auto md:mx-0">
                <img
                  src={mockBusiness.logo}
                  alt={mockBusiness.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2">
                  {mockBusiness.name}
                </h1>

                <div className="flex items-center justify-center md:justify-start gap-2 text-amber-500 mb-3">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-medium text-foreground">
                    {mockBusiness.rating}
                  </span>
                  <span className="text-muted-foreground">
                    ({mockBusiness.reviewCount} rəy)
                  </span>
                </div>

                <p className="text-muted-foreground mb-4 max-w-2xl">
                  {mockBusiness.description}
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {mockBusiness.address}
                  </span>
                  <a
                    href={`https://instagram.com/${mockBusiness.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                    @{mockBusiness.instagram}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Media Grid */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl text-foreground mb-6">
              Portfolio
            </h2>
            <div className="grid grid-cols-3 gap-1 md:gap-2 rounded-2xl overflow-hidden">
              {mockBusiness.media.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedMedia(index)}
                  className="aspect-square overflow-hidden relative group"
                >
                  <img
                    src={item.url}
                    alt={item.caption}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors" />
                </button>
              ))}
            </div>
          </section>

          {/* Reviews */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl text-foreground mb-6">
              Rəylər ({mockBusiness.reviews.length})
            </h2>
            <div className="space-y-4">
              {mockBusiness.reviews.map((review) => (
                <div
                  key={review.id}
                  className="glass-card rounded-xl p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-foreground font-medium">
                      {review.userName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">
                        {review.userName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(review.date).toLocaleDateString("az-AZ")}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-amber-500 fill-current"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-foreground/90">{review.text}</p>
                  {review.businessReply && (
                    <div className="mt-4 ml-4 pl-4 border-l-2 border-primary/30">
                      <div className="text-sm font-medium text-foreground mb-1">
                        Biznes cavabı:
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.businessReply}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Contact Buttons (Fixed at bottom on mobile) */}
          <div className="fixed bottom-0 left-0 right-0 p-4 glass-effect border-t border-border md:static md:p-0 md:bg-transparent md:border-none md:backdrop-blur-none">
            <div className="flex gap-3 max-w-5xl mx-auto">
              <button
                onClick={handleWhatsApp}
                className="flex-1 button-gradient text-primary-foreground py-3.5 rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp ilə əlaqə</span>
              </button>
              <a
                href={`tel:${mockBusiness.phone}`}
                className="flex items-center justify-center px-6 py-3.5 rounded-full border border-border hover:bg-muted transition-colors"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a
                href={`https://instagram.com/${mockBusiness.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-6 py-3.5 rounded-full border border-border hover:bg-muted transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Add bottom padding for fixed buttons on mobile */}
          <div className="h-20 md:hidden" />
        </div>
      </main>
      <Footer />

      {/* Media Modal */}
      {selectedMedia !== null && (
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
                (selectedMedia - 1 + mockBusiness.media.length) %
                  mockBusiness.media.length
              )
            }
            className="absolute left-4 text-background hover:text-background/80 transition-colors"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <div className="max-w-4xl max-h-[80vh] mx-4">
            <img
              src={mockBusiness.media[selectedMedia].url}
              alt={mockBusiness.media[selectedMedia].caption}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
            <div className="text-center mt-4">
              <p className="text-background text-lg">
                {mockBusiness.media[selectedMedia].caption}
              </p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full bg-background/20 text-background text-sm">
                {mockBusiness.media[selectedMedia].service}
              </span>
            </div>
          </div>

          <button
            onClick={() =>
              setSelectedMedia((selectedMedia + 1) % mockBusiness.media.length)
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
