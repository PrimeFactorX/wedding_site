import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

// Import category images
import xoncaImg from "@/assets/categories/xonca.jpg";
import beautyImg from "@/assets/categories/beauty.jpg";
import decorImg from "@/assets/categories/decor.jpg";
import venueImg from "@/assets/categories/venue.jpg";
import photoImg from "@/assets/categories/photo.jpg";
import cakeImg from "@/assets/categories/cake.jpg";
import djImg from "@/assets/categories/dj.jpg";
import bridalImg from "@/assets/categories/bridal.jpg";
import groomImg from "@/assets/categories/groom.jpg";

export interface Category {
  id: string;
  title: string;
  image: string;
  slug: string;
}

const categories: Category[] = [
  {
    id: "1",
    title: "Xonça hazırlanması",
    image: xoncaImg,
    slug: "xonca",
  },
  {
    id: "2",
    title: "Gözəllik salonları",
    image: beautyImg,
    slug: "gozellik",
  },
  {
    id: "3",
    title: "Dekor hazırlanması",
    image: decorImg,
    slug: "dekor",
  },
  {
    id: "4",
    title: "Restoranlar və toy zalları",
    image: venueImg,
    slug: "restoranlar",
  },
  {
    id: "5",
    title: "Foto / video çəkiliş",
    image: photoImg,
    slug: "foto-video",
  },
  {
    id: "6",
    title: "Tort və şirniyyat",
    image: cakeImg,
    slug: "tort",
  },
  {
    id: "7",
    title: "DJ və musiqi",
    image: djImg,
    slug: "dj",
  },
  {
    id: "8",
    title: "Gəlinlik mağazaları",
    image: bridalImg,
    slug: "gelinlik",
  },
  {
    id: "9",
    title: "Bəy kostyumları",
    image: groomImg,
    slug: "bey-kostyum",
  },
];

const CategoryCard = ({
  category,
  isHovered,
  onHover,
  onLeave,
}: {
  category: Category;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) => {
  return (
    <Link
      to={`/category/${category.slug}`}
      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ease-out ${isHovered ? "scale-105 z-10" : "scale-100"
        }`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Card */}
      <div
        className={`relative aspect-square glass-card overflow-hidden transition-all duration-300 ${isHovered
          ? "shadow-glass-hover border-primary/40"
          : "shadow-glass"
          }`}
      >
        {/* Image */}
        <img
          src={category.image}
          alt={category.title}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${isHovered ? "scale-110" : "scale-100"
            }`}
        />

        {/* Gradient Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent transition-opacity duration-300 ${isHovered ? "opacity-90" : "opacity-70"
            }`}
        />

        {/* Glow Effect */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent animate-pulse" />
        )}

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <h3 className="font-serif text-lg md:text-xl lg:text-2xl text-background font-medium leading-tight">
            {category.title}
          </h3>

          {/* Arrow indicator */}
          <div
            className={`flex items-center gap-2 mt-2 text-background/80 text-sm transition-all duration-300 ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
              }`}
          >
            <span>Kəşf et</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
};

const CategoriesGrid = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="py-16 md:py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Xidmət kateqoriyaları
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Bayramınızı mükəmməl etmək üçün lazım olan hər şey bir yerdə
          </p>
        </div>

        {/* Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 transition-all duration-300 ${hoveredId ? "fade-siblings" : ""
            }`}
        >
          {categories.map((category) => (
            <div
              key={category.id}
              className={`transition-opacity duration-300 ${hoveredId && hoveredId !== category.id ? "opacity-90" : "opacity-100"
                }`}
            >
              <CategoryCard
                category={category}
                isHovered={hoveredId === category.id}
                onHover={() => setHoveredId(category.id)}
                onLeave={() => setHoveredId(null)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesGrid;
