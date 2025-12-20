import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, Phone, Eye, EyeOff, Loader2, Building2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, signIn, signUp } = useAuth();

  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    businessName: "",
    phone: "",
  });

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/dashboard");
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await signIn(formData.email, formData.password);

        if (error) {
          if (error.message === "Invalid login credentials") {
            toast.error("E-poçt və ya şifrə yanlışdır");
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success("Uğurla daxil oldunuz!");
        navigate("/dashboard");
      } else {
        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.businessName,
          "business",
          formData.phone
        );

        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("Bu e-poçt artıq qeydiyyatdan keçib");
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success("Qeydiyyat tamamlandı! Daxil olun.");
        setMode("login");
      }
    } catch (error) {
      toast.error("Xəta baş verdi. Yenidən cəhd edin.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4">
        <div className="max-w-md mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Ana səhifə</span>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl font-semibold text-foreground">
                Memora
              </span>
              <span className="text-sm text-muted-foreground">.az</span>
            </Link>
            <p className="text-muted-foreground mt-2">
              Biznes hesabınız üçün
            </p>
          </div>

          {/* Form Card */}
          <div className="glass-card rounded-2xl p-6 md:p-8">
            {/* Mode Toggle */}
            <div className="flex gap-1 p-1 bg-muted rounded-lg mb-6">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all cursor-pointer ${mode === "login"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Daxil ol
              </button>
              <button
                onClick={() => setMode("register")}
                className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all cursor-pointer ${mode === "register"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Qeydiyyat
              </button>
            </div>

            <p className="text-center text-muted-foreground mb-6">
              {mode === "login"
                ? "Biznes hesabınıza daxil olun"
                : "Biznesinizi qeydiyyatdan keçirin"}
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Biznes adı
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) =>
                        setFormData({ ...formData, businessName: e.target.value })
                      }
                      placeholder="Biznesinizin adı"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-text"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  E-poçt
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="biznes@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-text"
                    required
                  />
                </div>
              </div>

              {mode === "register" && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Telefon (istəyə bağlı)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+994 50 123 45 67"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-text"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Şifrə
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-text"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full button-gradient text-primary-foreground py-3.5 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === "login" ? "Daxil ol" : "Qeydiyyatdan keç"}
              </button>
            </form>
          </div>

          {/* Terms */}
          {mode === "register" && (
            <p className="text-xs text-center text-muted-foreground mt-4">
              Qeydiyyatdan keçməklə{" "}
              <Link to="/terms" className="text-primary hover:underline">
                İstifadə şərtləri
              </Link>{" "}
              və{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Məxfilik siyasəti
              </Link>{" "}
              ilə razılaşırsınız.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
