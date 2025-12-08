import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Instagram, Loader2, Building2, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface Business {
    id: string;
    name: string;
    description: string | null;
    average_rating: number | null;
    total_reviews: number | null;
    city: string | null;
    address: string | null;
    logo_url: string | null;
    cover_image_url: string | null;
    instagram: string | null;
}

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [searchInput, setSearchInput] = useState(query);
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const search = async () => {
            if (!query.trim()) {
                setBusinesses([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const searchTerm = `%${query.toLowerCase()}%`;

                const { data, error } = await supabase
                    .from("businesses")
                    .select("id, name, description, average_rating, total_reviews, city, address, logo_url, cover_image_url, instagram")
                    .eq("is_approved", true)
                    .eq("is_active", true)
                    .or(`name.ilike.${searchTerm},description.ilike.${searchTerm},city.ilike.${searchTerm}`)
                    .order("average_rating", { ascending: false })
                    .limit(20);

                if (error) {
                    console.error("Search error:", error);
                    setBusinesses([]);
                } else {
                    setBusinesses(data || []);
                }
            } catch (error) {
                console.error("Error searching:", error);
                setBusinesses([]);
            } finally {
                setLoading(false);
            }
        };

        search();
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            setSearchParams({ q: searchInput.trim() });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-24 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Ana səhifə</span>
                    </Link>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="mb-8">
                        <div className="glass-card rounded-full p-2 flex items-center gap-3">
                            <div className="flex-1 flex items-center gap-3 px-4">
                                <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Biznes adı, kateqoriya və ya şəhər axtar..."
                                    className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground py-2 cursor-text"
                                    autoFocus
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

                    {/* Title */}
                    <div className="mb-8">
                        <h1 className="font-serif text-3xl md:text-4xl text-foreground">
                            {query ? `"${query}" üçün axtarış nəticələri` : "Axtarış"}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {loading ? "Axtarılır..." : `${businesses.length} nəticə tapıldı`}
                        </p>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && businesses.length === 0 && query && (
                        <div className="text-center py-20">
                            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-serif text-xl text-foreground mb-2">
                                Nəticə tapılmadı
                            </h3>
                            <p className="text-muted-foreground">
                                "{query}" üçün heç bir biznes tapılmadı. Başqa sözlərlə axtarmağa çalışın.
                            </p>
                        </div>
                    )}

                    {/* No Query State */}
                    {!loading && !query && (
                        <div className="text-center py-20">
                            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-serif text-xl text-foreground mb-2">
                                Axtarış edin
                            </h3>
                            <p className="text-muted-foreground">
                                Biznes adı, kateqoriya və ya şəhər daxil edərək axtarış edin.
                            </p>
                        </div>
                    )}

                    {/* Results */}
                    {!loading && businesses.length > 0 && (
                        <div className="space-y-4">
                            {businesses.map((business, index) => (
                                <Link
                                    key={business.id}
                                    to={`/business/${business.id}`}
                                    className="glass-card-hover rounded-2xl p-4 md:p-6 flex gap-4 md:gap-6 group"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Image */}
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0 bg-primary/10">
                                        {business.logo_url || business.cover_image_url ? (
                                            <img
                                                src={business.logo_url || business.cover_image_url || ""}
                                                alt={business.name}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Building2 className="w-10 h-10 text-primary/50" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-serif text-xl md:text-2xl text-foreground truncate">
                                                {business.name}
                                            </h3>
                                            <div className="flex items-center gap-1 text-amber-500 flex-shrink-0">
                                                <Star className="w-4 h-4 fill-current" />
                                                <span className="text-sm font-medium text-foreground">
                                                    {business.average_rating?.toFixed(1) || "0.0"}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    ({business.total_reviews || 0} rəy)
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                                            {business.description || "Təsvir mövcud deyil"}
                                        </p>

                                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                            {business.city && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {business.city}
                                                </span>
                                            )}
                                            {business.instagram && (
                                                <span className="hidden md:flex items-center gap-1">
                                                    <Instagram className="w-4 h-4" />
                                                    @{business.instagram.replace("@", "")}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-4 flex items-center gap-3">
                                            <span className="button-gradient text-primary-foreground text-sm px-4 py-2 rounded-full font-medium">
                                                Profili aç
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SearchPage;
