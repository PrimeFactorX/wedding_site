import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Loader2,
  Check,
  X,
  Eye,
  Building2,
  Users,
  Shield,
  LogOut,
  ChevronDown,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Business {
  id: string;
  name: string;
  description: string | null;
  phone: string | null;
  city: string | null;
  is_active: boolean;
  is_approved: boolean;
  created_at: string;
  owner_id: string;
  profiles?: {
    full_name: string | null;
  };
}

interface Category {
  id: string;
  name_az: string;
  subcategories: {
    id: string;
    name_az: string;
  }[];
}

const AdminPanel = () => {
  const { user, loading: authLoading, signOut, userRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [pendingBusinesses, setPendingBusinesses] = useState<Business[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Check if user is admin (by role OR by email OR by localStorage flag)
  const isLocalAdmin = localStorage.getItem("isAdmin") === "true";
  const isAdmin = userRole === "admin" || user?.email === "huseynov06ali@gmail.com" || isLocalAdmin;

  useEffect(() => {
    if (!authLoading) {
      if (!isAdmin) {
        navigate("/admin-login");
        return;
      }
      // If admin via localStorage, fetch data immediately
      if (isLocalAdmin) {
        fetchData();
      }
    }
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin && !isLocalAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      // Fetch all businesses
      const { data: allBusinesses, error: bizError } = await supabase
        .from("businesses")
        .select("*")
        .order("created_at", { ascending: false });

      if (bizError) {
        console.error("Error fetching businesses:", bizError);
      } else if (allBusinesses) {
        setBusinesses(allBusinesses.filter((b) => b.is_approved) as Business[]);
        setPendingBusinesses(allBusinesses.filter((b) => !b.is_approved) as Business[]);
      }

      // Fetch categories with subcategories
      const { data: cats } = await supabase
        .from("categories")
        .select("id, name_az")
        .order("name_az");

      if (cats) {
        const catsWithSubs = await Promise.all(
          cats.map(async (cat) => {
            const { data: subs } = await supabase
              .from("subcategories")
              .select("id, name_az")
              .eq("category_id", cat.id);
            return { ...cat, subcategories: subs || [] };
          })
        );
        setCategories(catsWithSubs);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (business: Business) => {
    setProcessingId(business.id);
    try {
      const { error } = await supabase
        .from("businesses")
        .update({ is_approved: true, is_active: true })
        .eq("id", business.id);

      if (error) {
        toast.error("Təsdiq edilmədi");
        return;
      }

      setPendingBusinesses((prev) => prev.filter((b) => b.id !== business.id));
      setBusinesses((prev) => [{ ...business, is_approved: true, is_active: true }, ...prev]);
      toast.success("Biznes təsdiqləndi!");
    } catch (err) {
      toast.error("Xəta baş verdi");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (businessId: string) => {
    setProcessingId(businessId);
    try {
      const { error } = await supabase
        .from("businesses")
        .delete()
        .eq("id", businessId);

      if (error) {
        toast.error("Silinmədi");
        return;
      }

      setPendingBusinesses((prev) => prev.filter((b) => b.id !== businessId));
      toast.success("Biznes silindi");
    } catch (err) {
      toast.error("Xəta baş verdi");
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggleActive = async (business: Business) => {
    try {
      const { error } = await supabase
        .from("businesses")
        .update({ is_active: !business.is_active })
        .eq("id", business.id);

      if (error) {
        toast.error("Dəyişdirilmədi");
        return;
      }

      setBusinesses((prev) =>
        prev.map((b) =>
          b.id === business.id ? { ...b, is_active: !b.is_active } : b
        )
      );
      toast.success(business.is_active ? "Deaktiv edildi" : "Aktiv edildi");
    } catch (err) {
      toast.error("Xəta baş verdi");
    }
  };

  const openCategoryDialog = async (business: Business) => {
    setSelectedBusiness(business);

    // Fetch existing services for this business
    const { data } = await supabase
      .from("business_services")
      .select("subcategory_id")
      .eq("business_id", business.id);

    setSelectedCategories(data?.map((s) => s.subcategory_id) || []);
    setShowCategoryDialog(true);
  };

  const handleCategoryToggle = (subcategoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(subcategoryId)
        ? prev.filter((id) => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const saveCategoryAssignments = async () => {
    if (!selectedBusiness) return;

    try {
      // Delete existing assignments
      await supabase
        .from("business_services")
        .delete()
        .eq("business_id", selectedBusiness.id);

      // Insert new assignments
      if (selectedCategories.length > 0) {
        const { error } = await supabase.from("business_services").insert(
          selectedCategories.map((subcategoryId) => ({
            business_id: selectedBusiness.id,
            subcategory_id: subcategoryId,
          }))
        );

        if (error) {
          toast.error("Yadda saxlanılmadı");
          return;
        }
      }

      toast.success("Kateqoriyalar yeniləndi!");
      setShowCategoryDialog(false);
    } catch (err) {
      toast.error("Xəta baş verdi");
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const filteredBusinesses = businesses.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-serif text-2xl font-semibold text-foreground">
              Admin Panel
            </span>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Çıxış
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingBusinesses.length}</p>
                <p className="text-xs text-muted-foreground">Gözləyən</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {businesses.filter((b) => b.is_active).length}
                </p>
                <p className="text-xs text-muted-foreground">Aktiv</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{businesses.length}</p>
                <p className="text-xs text-muted-foreground">Ümumi biznes</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{categories.length}</p>
                <p className="text-xs text-muted-foreground">Kateqoriya</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending" className="relative">
              Gözləyən
              {pendingBusinesses.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-amber-500 text-white rounded-full">
                  {pendingBusinesses.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Təsdiqlənmiş</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingBusinesses.length === 0 ? (
              <div className="glass-card rounded-xl p-12 text-center text-muted-foreground">
                <Check className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Gözləyən biznes yoxdur</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pendingBusinesses.map((business) => (
                  <div key={business.id} className="glass-card rounded-xl p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-serif text-lg text-foreground">{business.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {business.description || "Təsvir yoxdur"}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{business.city}</span>
                          <span>{business.phone}</span>
                          <span>
                            {new Date(business.created_at).toLocaleDateString("az-AZ")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openCategoryDialog(business)}
                        >
                          Kateqoriya
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApprove(business)}
                          disabled={processingId === business.id}
                        >
                          {processingId === business.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4 mr-1" />
                          )}
                          Təsdiqlə
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleReject(business.id)}
                          disabled={processingId === business.id}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Biznes axtar..."
                className="pl-10"
              />
            </div>

            {filteredBusinesses.length === 0 ? (
              <div className="glass-card rounded-xl p-12 text-center text-muted-foreground">
                <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Biznes tapılmadı</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredBusinesses.map((business) => (
                  <div key={business.id} className="glass-card rounded-xl p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-lg text-foreground">{business.name}</h3>
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${business.is_active
                              ? "bg-green-500/10 text-green-600"
                              : "bg-red-500/10 text-red-600"
                              }`}
                          >
                            {business.is_active ? "Aktiv" : "Deaktiv"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {business.description || "Təsvir yoxdur"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openCategoryDialog(business)}
                        >
                          Kateqoriya
                        </Button>
                        <Link to={`/business/${business.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant={business.is_active ? "destructive" : "default"}
                          size="sm"
                          onClick={() => handleToggleActive(business)}
                        >
                          {business.is_active ? "Deaktiv et" : "Aktiv et"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Category Assignment Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kateqoriya təyin et</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {categories.map((category) => (
              <div key={category.id} className="space-y-2">
                <h4 className="font-medium text-foreground">{category.name_az}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {category.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleCategoryToggle(sub.id)}
                      className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategories.includes(sub.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                        }`}
                    >
                      {sub.name_az}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
              Ləğv et
            </Button>
            <Button onClick={saveCategoryAssignments}>Yadda saxla</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;