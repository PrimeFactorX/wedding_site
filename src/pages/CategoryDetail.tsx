import { useParams, Link } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Sub-services data by category
const subServicesData: Record<string, { title: string; subServices: string[] }> = {
  gozellik: {
    title: "Gözəllik salonları",
    subServices: [
      "Dırnaq",
      "Saç",
      "Makiyaj",
      "Qaş laminasiya",
      "Kirpik",
      "Saç rəngi",
      "Gel-lak",
      "Braziliyan feni",
      "Saç düzəltmə",
      "Üz qayğısı",
    ],
  },
  xonca: {
    title: "Xonça hazırlanması",
    subServices: [
      "Nişan xonçası",
      "Toy xonçası",
      "Xına xonçası",
      "Bayram xonçası",
      "Şirniyyat xonçası",
      "Meyvə xonçası",
    ],
  },
  dekor: {
    title: "Dekor hazırlanması",
    subServices: [
      "Toy dekoru",
      "Nişan dekoru",
      "Xına gecəsi dekoru",
      "Doğum günü dekoru",
      "Ballon dekoru",
      "Çiçək tərtibatı",
      "Masa dekoru",
      "Fotozona",
    ],
  },
  restoranlar: {
    title: "Restoranlar və toy zalları",
    subServices: [
      "Toy zalları",
      "Açıq hava məkanları",
      "Butik restoranlar",
      "Şəhər restoranları",
      "Sahil restoranları",
      "Bağ evləri",
    ],
  },
  "foto-video": {
    title: "Foto / video çəkiliş",
    subServices: [
      "Toy fotoqrafiyası",
      "Toy videoqrafiyası",
      "Dron çəkilişi",
      "Nişan çəkilişi",
      "Love Story",
      "Foto studiya",
    ],
  },
  tort: {
    title: "Tort və şirniyyat",
    subServices: [
      "Toy tortu",
      "Nişan tortu",
      "Cupcake",
      "Macarons",
      "Şirniyyat masası",
      "Xüsusi sifarişlər",
    ],
  },
  dj: {
    title: "DJ və musiqi",
    subServices: [
      "DJ xidməti",
      "Canlı musiqi",
      "Tar-kamança",
      "Pop qrup",
      "Səs sistemi icarəsi",
      "MC / Aparıcı",
    ],
  },
  gelinlik: {
    title: "Gəlinlik mağazaları",
    subServices: [
      "Gəlinliklər",
      "Duvak və aksesuarlar",
      "Gəlinlik ayaqqabıları",
      "Gəlinlik kirayəsi",
      "Xüsusi dizayn gəlinlik",
      "Plus-size gəlinliklər",
    ],
  },
  "bey-kostyum": {
    title: "Bəy kostyumları",
    subServices: [
      "Klassik kostyum",
      "Smokinq",
      "Kostyum kirayəsi",
      "Aksesuar (qalstuk, kəmər)",
      "Ayaqqabı",
      "Xüsusi tikiş",
    ],
  },
};

const CategoryDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const categoryData = slug ? subServicesData[slug] : null;

  if (!categoryData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-3xl text-foreground mb-4">
              Kateqoriya tapılmadı
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
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Ana səhifə
                </Link>
              </li>
              <ChevronRight className="w-4 h-4" />
              <li className="text-foreground">{categoryData.title}</li>
            </ol>
          </nav>

          {/* Title */}
          <div className="mb-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Geri</span>
            </Link>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground">
              {categoryData.title}
            </h1>
            <p className="text-muted-foreground mt-3">
              Alt xidmətlərdən birini seçin
            </p>
          </div>

          {/* Sub-services List */}
          <div className="space-y-3">
            {categoryData.subServices.map((subService, index) => (
              <Link
                key={subService}
                to={`/businesses/${slug}/${encodeURIComponent(subService.toLowerCase().replace(/\s+/g, "-"))}`}
                className="glass-card-hover rounded-xl p-5 flex items-center justify-between group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-lg text-foreground group-hover:text-foreground/90 transition-colors">
                  {subService}
                </span>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryDetail;
