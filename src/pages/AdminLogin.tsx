import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Lock, Eye, EyeOff, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Admin credentials - hardcoded for simplicity
const ADMIN_USERNAME = "huseynovali";
const ADMIN_PASSWORD = "09052006Dreyk";
const ADMIN_EMAIL = "huseynov06ali@gmail.com"; // Admin email

const AdminLogin = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Check hardcoded credentials
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            try {
                // Sign in with real admin email (but use the hardcoded password for Supabase)
                // First, let's just set a session flag and redirect
                localStorage.setItem("isAdmin", "true");

                // Try to get current user first
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    // User is already logged in, just update their role to admin
                    await supabase
                        .from("user_roles")
                        .upsert({ user_id: user.id, role: "admin" }, { onConflict: "user_id" });

                    toast.success("Admin olaraq daxil oldunuz!");
                    navigate("/admin");
                } else {
                    // No user logged in, but credentials are correct
                    // Set admin flag and let AdminPanel handle it
                    toast.success("Admin olaraq daxil oldunuz!");
                    navigate("/admin");
                }
            } catch (error) {
                console.error("Admin login error:", error);
                toast.error("Xəta baş verdi");
            }
        } else {
            toast.error("İstifadəçi adı və ya şifrə yanlışdır");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
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

            <main className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="font-serif text-2xl font-semibold text-foreground">
                            Admin Panel
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Admin hesabınıza daxil olun
                        </p>
                    </div>

                    <div className="glass-card rounded-2xl p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                    İstifadəçi adı
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="admin"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-text"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                    Şifrə
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-12 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-text"
                                        required
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
                                Daxil ol
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLogin;
