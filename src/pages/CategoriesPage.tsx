import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Import category images
import beautyImg from "@/assets/categories/beauty.jpg";
import bridalImg from "@/assets/categories/bridal.jpg";
import cakeImg from "@/assets/categories/cake.jpg";
import decorImg from "@/assets/categories/decor.jpg";
import djImg from "@/assets/categories/dj.jpg";
import groomImg from "@/assets/categories/groom.jpg";
import photoImg from "@/assets/categories/photo.jpg";
import venueImg from "@/assets/categories/venue.jpg";
import xoncaImg from "@/assets/categories/xonca.jpg";

const categories = [
  { id: 1, name: "Gözəllik salonları", slug: "gozellik", image: beautyImg },
  { id: 2, name: "Xonça hazırlanması", slug: "xonca", image: xoncaImg },
  { id: 3, name: "Dekor hazırlanması", slug: "dekor", image: decorImg },
  { id: 4, name: "Restoranlar və toy zalları", slug: "restoranlar", image: venueImg },
  { id: 5, name: "Foto / video çəkiliş", slug: "foto-video", image: photoImg },
  { id: 6, name: "Tort və şirniyyat", slug: "tort", image: cakeImg },
  { id: 7, name: "DJ və musiqi", slug: "dj", image: djImg },
  { id: 8, name: "Gəlinlik mağazaları", slug: "gelinlik", image: bridalImg },
  { id: 9, name: "Bəy kostyumları", slug: "bey-kostyum", image: groomImg },
];

const CategoriesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
              Bütün Kateqoriyalar
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Toy, nişan, xına və digər tədbirlər üçün lazım olan bütün xidmətləri kəşf edin
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-xl md:text-2xl text-background">
                    {category.name}
                  </h3>
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

export default CategoriesPage;
