import { Sparkles, Shield, Star } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Premium Bizneslər",
    description:
      "Yalnız ən yaxşı və yoxlanılmış yerli xidmət təminatçıları ilə əməkdaşlıq edirik.",
  },
  {
    icon: Shield,
    title: "Güvənli Seçim",
    description:
      "Həqiqi müştəri rəyləri və reytinqlər sayəsində düzgün seçim edin.",
  },
  {
    icon: Star,
    title: "Ekskluziv Təkliflər",
    description:
      "Platformamız vasitəsilə rezervasiya edərkən xüsusi endirimlər əldə edin.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Niyə Memora.az?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Sizin bayramınız bizim üçün vacibdir
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card-hover rounded-2xl p-6 md:p-8 text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="font-serif text-xl md:text-2xl text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
