import { Link } from "react-router-dom";
import { Instagram, Phone, Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border/30">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-serif text-2xl font-semibold text-foreground">
                Memora
              </span>
              <span className="text-xs text-muted-foreground">.az</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Azərbaycanın ən zərif celebration marketplace-i. Toy, nişan, xına və
              daha çox xidmətlər üçün ən yaxşı yerli bizneslər.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/memora.az"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/80 flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-primary/20 transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/994507558603"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/80 flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-primary/20 transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a
                href="mailto:infomemora@gmail.com"
                className="w-10 h-10 rounded-full bg-background/80 flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-primary/20 transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-serif text-lg font-medium text-foreground mb-4">
              Kateqoriyalar
            </h4>
            <ul className="space-y-2">
              {[
                "Gözəllik salonları",
                "Restoranlar",
                "Foto / video",
                "Dekor",
                "Tort və şirniyyat",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/categories"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Business */}
          <div>
            <h4 className="font-serif text-lg font-medium text-foreground mb-4">
              Bizneslər üçün
            </h4>
            <ul className="space-y-2">
              {[
                "Biznesinizi əlavə edin",
                "Abunəlik planları",
                "Necə işləyir?",
                "Tez-tez soruşulan suallar",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/business"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-medium text-foreground mb-4">
              Əlaqə
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+994 50 755 86 03</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>infomemora@gmail.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Instagram className="w-4 h-4" />
                <span>@memora.az</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Memora.az — Bütün hüquqlar qorunur.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Heart className="w-4 h-4 text-primary" />
            <span>Azərbaycanda hazırlandı</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
