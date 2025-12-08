import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import { Search } from "lucide-react";

const animatedTexts = [
  "Nişan var?",
  "Xına var?",
  "Toy?",
  "Bəlkə doğum günü?",
];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % animatedTexts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Wedding celebration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/90" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Animated Text */}
        <div className="h-28 md:h-36 flex items-center justify-center mb-6 relative">
          {animatedTexts.map((text, index) => (
            <h1
              key={text}
              className={`font-serif text-5xl md:text-7xl lg:text-8xl font-medium text-foreground absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${index === currentIndex
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6 pointer-events-none"
                }`}
            >
              {text}
            </h1>
          ))}
        </div>

        {/* Static Text */}
        <p className="text-xl md:text-2xl lg:text-3xl font-serif text-foreground/90 mb-4 animate-fade-in animation-delay-200">
          Axtardığın hər şeyi ən qısa zamanda burada{" "}
          <span className="font-semibold text-foreground">TAP.</span>
        </p>

        <p className="text-sm md:text-base text-muted-foreground mb-10 animate-fade-in animation-delay-400">
          Azərbaycanın ən zərif celebration marketplace-i
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-xl mx-auto animate-fade-in animation-delay-600">
          <div className="glass-card rounded-full p-2 flex items-center gap-3 transition-all duration-300 hover:shadow-glass-hover">
            <div className="flex-1 flex items-center gap-3 px-4">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Biznes adı, kateqoriya və ya şəhər axtar..."
                className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground py-2 cursor-text"
              />
            </div>
            <button
              type="submit"
              className="button-gradient text-primary-foreground px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
            >
              Axtar
            </button>
          </div>
        </form>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-foreground/50 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
