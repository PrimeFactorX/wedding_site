import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-16 md:py-24 px-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />

      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
          Biznesinizi buraya əlavə edin
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Minlərlə potensial müştəriyə çatın. Toy, nişan, xına və digər bayram
          xidmətlərinizi tanıtın.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/auth?mode=register"
            className="button-gradient text-primary-foreground px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2 group"
          >
            <span>Biznes kimi qeydiyyatdan keç</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            to="/business"
            className="text-foreground/80 hover:text-foreground transition-colors px-6 py-4 flex items-center gap-2"
          >
            <span>Daha ətraflı</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
          {[
            { value: "500+", label: "Aktiv biznes" },
            { value: "10k+", label: "Aylıq ziyarətçi" },
            { value: "4.8", label: "Orta reytinq" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
