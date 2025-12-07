import { Link } from "react-router-dom";
import { Menu, X, User, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-effect border-b border-border/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
              Memora
            </span>
            <span className="text-xs text-muted-foreground hidden sm:block">
              .az
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/categories"
              className="text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              Kateqoriyalar
            </Link>
            <Link
              to="/about"
              className="text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              Haqqımızda
            </Link>
            <Link
              to="/business"
              className="text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              Biznes üçün
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!loading && user ? (
              <Link
                to="/dashboard"
                className="button-gradient text-primary-foreground text-sm px-5 py-2.5 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Panel
              </Link>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="text-sm text-foreground/80 hover:text-foreground transition-colors px-4 py-2"
                >
                  Daxil ol
                </Link>
                <Link
                  to="/auth?mode=register"
                  className="button-gradient text-primary-foreground text-sm px-5 py-2.5 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Qeydiyyat
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-effect border-b border-border/20 animate-fade-in">
          <nav className="flex flex-col p-4 gap-4">
            <Link
              to="/categories"
              className="text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Kateqoriyalar
            </Link>
            <Link
              to="/about"
              className="text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Haqqımızda
            </Link>
            <Link
              to="/business"
              className="text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Biznes üçün
            </Link>
            <div className="border-t border-border/30 pt-4 flex flex-col gap-2">
              {!loading && user ? (
                <Link
                  to="/dashboard"
                  className="button-gradient text-primary-foreground text-center py-2.5 rounded-full font-medium flex items-center justify-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Panel
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="text-center py-2.5 text-foreground/80 hover:text-foreground transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Daxil ol
                  </Link>
                  <Link
                    to="/auth?mode=register"
                    className="button-gradient text-primary-foreground text-center py-2.5 rounded-full font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Qeydiyyat
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
