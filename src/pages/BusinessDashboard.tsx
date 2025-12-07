import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Loader2,
  Camera,
  Plus,
  Trash2,
  Eye,
  Star,
  MessageCircle,
  Building2,
  Phone,
  MapPin,
  Instagram,
  Save,
  LogOut,
  Image,
  Tag,
  DollarSign,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BusinessData {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  address: string | null;
  city: string | null;
  average_rating: number;
  total_reviews: number;
  total_views: number;
  is_active: boolean;
  is_approved: boolean;
  min_price: number | null;
  max_price: number | null;
  price_note: string | null;
}

interface MediaItem {
  id: string;
  media_url: string;
  caption: string | null;
  media_type: string;
}

interface Category {
  id: string;
  name_az: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name_az: string;
}

const BusinessDashboard = () => {
  const { user, loading: authLoading, signOut, userRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [savingCategories, setSavingCategories] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone: "",
    whatsapp: "",
    instagram: "",
    address: "",
    city: "Bakı",
    min_price: "",
    max_price: "",
    price_note: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchBusinessData();
      fetchCategories();
    }
  }, [user]);

  const fetchCategories = async () => {
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
  };

  const fetchBusinessData = async () => {
    if (!user) return;
    
    try {
      const { data: existingBusiness, error: fetchError } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching business:", fetchError);
      }

      if (existingBusiness) {
        setBusiness(existingBusiness as BusinessData);
        setFormData({
          name: existingBusiness.name || "",
          description: existingBusiness.description || "",
          phone: existingBusiness.phone || "",
          whatsapp: existingBusiness.whatsapp || "",
          instagram: existingBusiness.instagram || "",
          address: existingBusiness.address || "",
          city: existingBusiness.city || "Bakı",
          min_price: existingBusiness.min_price?.toString() || "",
          max_price: existingBusiness.max_price?.toString() || "",
          price_note: existingBusiness.price_note || "",
        });
        
        // Fetch media
        const { data: mediaData } = await supabase
          .from("business_media")
          .select("*")
          .eq("business_id", existingBusiness.id);
        
        if (mediaData) {
          setMedia(mediaData);
        }

        // Fetch selected categories
        const { data: servicesData } = await supabase
          .from("business_services")
          .select("subcategory_id")
          .eq("business_id", existingBusiness.id);
        
        if (servicesData) {
          setSelectedCategories(servicesData.map((s) => s.subcategory_id));
        }
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBusiness = async () => {
    if (!user || !formData.name.trim()) {
      toast.error("Biznes adı daxil edin");
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("businesses")
        .insert({
          owner_id: user.id,
          name: formData.name,
          description: formData.description || null,
          phone: formData.phone || null,
          whatsapp: formData.whatsapp || null,
          instagram: formData.instagram || null,
          address: formData.address || null,
          city: formData.city,
          min_price: formData.min_price ? parseFloat(formData.min_price) : null,
          max_price: formData.max_price ? parseFloat(formData.max_price) : null,
          price_note: formData.price_note || null,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating business:", error);
        toast.error("Biznes yaradıla bilmədi");
        return;
      }

      // Update user role to business
      await supabase
        .from("user_roles")
        .update({ role: "business" })
        .eq("user_id", user.id);

      setBusiness(data as BusinessData);
      toast.success("Biznes uğurla yaradıldı!");
    } catch (err) {
      console.error("Error:", err);
      toast.error("Xəta baş verdi");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateBusiness = async () => {
    if (!business) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("businesses")
        .update({
          name: formData.name,
          description: formData.description || null,
          phone: formData.phone || null,
          whatsapp: formData.whatsapp || null,
          instagram: formData.instagram || null,
          address: formData.address || null,
          city: formData.city,
          min_price: formData.min_price ? parseFloat(formData.min_price) : null,
          max_price: formData.max_price ? parseFloat(formData.max_price) : null,
          price_note: formData.price_note || null,
        })
        .eq("id", business.id);

      if (error) {
        toast.error("Yenilənmədi");
        return;
      }

      toast.success("Məlumatlar yeniləndi!");
    } catch (err) {
      toast.error("Xəta baş verdi");
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryToggle = (subcategoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(subcategoryId)
        ? prev.filter((id) => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const saveCategories = async () => {
    if (!business) return;

    setSavingCategories(true);
    try {
      // Delete existing
      await supabase
        .from("business_services")
        .delete()
        .eq("business_id", business.id);

      // Insert new
      if (selectedCategories.length > 0) {
        const { error } = await supabase.from("business_services").insert(
          selectedCategories.map((subcategoryId) => ({
            business_id: business.id,
            subcategory_id: subcategoryId,
          }))
        );

        if (error) {
          toast.error("Kateqoriyalar yadda saxlanılmadı");
          return;
        }
      }

      toast.success("Kateqoriyalar yeniləndi!");
    } catch (err) {
      toast.error("Xəta baş verdi");
    } finally {
      setSavingCategories(false);
    }
  };

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    if (!user) return null;

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${folder}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("business-media")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("business-media")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !business) return;

    setUploadingLogo(true);
    try {
      const url = await uploadFile(file, "logos");
      if (url) {
        await supabase
          .from("businesses")
          .update({ logo_url: url })
          .eq("id", business.id);
        
        setBusiness({ ...business, logo_url: url });
        toast.success("Logo yükləndi!");
      }
    } catch (err) {
      toast.error("Logo yüklənə bilmədi");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !business) return;

    setUploadingCover(true);
    try {
      const url = await uploadFile(file, "covers");
      if (url) {
        await supabase
          .from("businesses")
          .update({ cover_image_url: url })
          .eq("id", business.id);
        
        setBusiness({ ...business, cover_image_url: url });
        toast.success("Üz qabığı şəkli yükləndi!");
      }
    } catch (err) {
      toast.error("Şəkil yüklənə bilmədi");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !business) return;

    setUploadingMedia(true);
    try {
      for (const file of Array.from(files)) {
        const url = await uploadFile(file, "portfolio");
        if (url) {
          const { data, error } = await supabase
            .from("business_media")
            .insert({
              business_id: business.id,
              media_url: url,
              media_type: "image",
            })
            .select()
            .single();

          if (data) {
            setMedia((prev) => [...prev, data]);
          }
        }
      }
      toast.success("Şəkillər yükləndi!");
    } catch (err) {
      toast.error("Şəkillər yüklənə bilmədi");
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleDeleteMedia = async (mediaId: string, mediaUrl: string) => {
    try {
      const urlParts = mediaUrl.split("/business-media/");
      if (urlParts.length > 1) {
        await supabase.storage.from("business-media").remove([urlParts[1]]);
      }

      await supabase.from("business_media").delete().eq("id", mediaId);
      setMedia((prev) => prev.filter((m) => m.id !== mediaId));
      toast.success("Şəkil silindi");
    } catch (err) {
      toast.error("Silinmədi");
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect admin to admin panel
  if (userRole === "admin") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Shield className="w-16 h-16 text-primary" />
        <h1 className="font-serif text-2xl">Siz admin hesabındasınız</h1>
        <div className="flex gap-4">
          <Link to="/admin">
            <Button>Admin Panelinə keç</Button>
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            Çıxış
          </Button>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="font-serif text-2xl font-semibold text-foreground">
              Memora<span className="text-sm text-muted-foreground">.az</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Çıxış
            </Button>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <Building2 className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="font-serif text-3xl text-foreground mb-2">
              Biznesinizi yaradın
            </h1>
            <p className="text-muted-foreground">
              İlk addım olaraq biznesiniz haqqında əsas məlumatları daxil edin
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Biznes adı *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Biznesinizin adı"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Təsvir</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Xidmətləriniz haqqında qısa məlumat"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Telefon</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+994 XX XXX XX XX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">WhatsApp</label>
                <Input
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="+994 XX XXX XX XX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Instagram</label>
              <Input
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="@sizin_hesab"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Ünvan</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Küçə, bina"
              />
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Qiymət aralığı
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Min qiymət (AZN)</label>
                  <Input
                    type="number"
                    value={formData.min_price}
                    onChange={(e) => setFormData({ ...formData, min_price: e.target.value })}
                    placeholder="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Max qiymət (AZN)</label>
                  <Input
                    type="number"
                    value={formData.max_price}
                    onChange={(e) => setFormData({ ...formData, max_price: e.target.value })}
                    placeholder="500"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium mb-1.5">Qiymət qeydi</label>
                <Input
                  value={formData.price_note}
                  onChange={(e) => setFormData({ ...formData, price_note: e.target.value })}
                  placeholder="Məs: Qiymət xidmətdən asılıdır"
                />
              </div>
            </div>

            <Button
              onClick={handleCreateBusiness}
              disabled={saving || !formData.name.trim()}
              className="w-full"
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Biznes yarat
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-serif text-2xl font-semibold text-foreground">
            Memora<span className="text-sm text-muted-foreground">.az</span>
          </Link>
          <div className="flex items-center gap-2">
            {business.is_approved && business.is_active && (
              <Link to={`/business/${business.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Profilə bax
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Çıxış
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {!business.is_approved && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700">
            <p className="text-sm">
              ⏳ Biznesiniz təsdiq gözləyir. Təsdiqləndikdən sonra istifadəçilərə görünəcək.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{business.total_views}</p>
                <p className="text-xs text-muted-foreground">Baxış</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {business.average_rating?.toFixed(1) || "0.0"}
                </p>
                <p className="text-xs text-muted-foreground">Reytinq</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{business.total_reviews}</p>
                <p className="text-xs text-muted-foreground">Rəy</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Image className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{media.length}</p>
                <p className="text-xs text-muted-foreground">Şəkil</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="categories">Kateqoriyalar</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="glass-card rounded-2xl overflow-hidden">
              <div
                className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center cursor-pointer group"
                onClick={() => coverInputRef.current?.click()}
              >
                {business.cover_image_url ? (
                  <img
                    src={business.cover_image_url}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Üz qabığı şəkli əlavə et</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {uploadingCover ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  ) : (
                    <Camera className="w-8 h-8 text-white" />
                  )}
                </div>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
              </div>

              <div className="px-6 pb-6">
                <div
                  className="relative -mt-12 w-24 h-24 rounded-xl bg-background border-4 border-background shadow-lg overflow-hidden cursor-pointer group"
                  onClick={() => logoInputRef.current?.click()}
                >
                  {business.logo_url ? (
                    <img
                      src={business.logo_url}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-primary" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {uploadingLogo ? (
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h3 className="font-serif text-xl text-foreground mb-4">Biznes məlumatları</h3>

              <div>
                <label className="block text-sm font-medium mb-1.5">Biznes adı</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Təsvir</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    <Phone className="w-4 h-4 inline mr-1" /> Telefon
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    <MessageCircle className="w-4 h-4 inline mr-1" /> WhatsApp
                  </label>
                  <Input
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  <Instagram className="w-4 h-4 inline mr-1" /> Instagram
                </label>
                <Input
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  <MapPin className="w-4 h-4 inline mr-1" /> Ünvan
                </label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Qiymət aralığı
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Min qiymət (AZN)</label>
                    <Input
                      type="number"
                      value={formData.min_price}
                      onChange={(e) => setFormData({ ...formData, min_price: e.target.value })}
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Max qiymət (AZN)</label>
                    <Input
                      type="number"
                      value={formData.max_price}
                      onChange={(e) => setFormData({ ...formData, max_price: e.target.value })}
                      placeholder="500"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium mb-1.5">Qiymət qeydi</label>
                  <Input
                    value={formData.price_note}
                    onChange={(e) => setFormData({ ...formData, price_note: e.target.value })}
                    placeholder="Məs: Qiymət xidmətdən asılıdır"
                  />
                </div>
              </div>

              <Button onClick={handleUpdateBusiness} disabled={saving} className="w-full md:w-auto">
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Yadda saxla
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-serif text-xl text-foreground">Xidmət kateqoriyaları</h3>
                  <p className="text-sm text-muted-foreground">Hansı xidmətləri göstərdiyinizi seçin</p>
                </div>
                <Button onClick={saveCategories} disabled={savingCategories}>
                  {savingCategories ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Yadda saxla
                </Button>
              </div>

              <div className="space-y-6">
                {categories.map((category) => (
                  <div key={category.id} className="space-y-3">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" />
                      {category.name_az}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleCategoryToggle(sub.id)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedCategories.includes(sub.id)
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

              {selectedCategories.length > 0 && (
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Seçilmiş: <span className="text-foreground font-medium">{selectedCategories.length}</span> kateqoriya
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl text-foreground">Portfolio şəkilləri</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => mediaInputRef.current?.click()}
                  disabled={uploadingMedia}
                >
                  {uploadingMedia ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Şəkil əlavə et
                </Button>
                <input
                  ref={mediaInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMediaUpload}
                  className="hidden"
                />
              </div>

              {media.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Hələ şəkil yoxdur</p>
                  <p className="text-sm">İşlərinizi göstərmək üçün şəkillər əlavə edin</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {media.map((item) => (
                    <div key={item.id} className="relative group aspect-square rounded-xl overflow-hidden">
                      <img
                        src={item.media_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDeleteMedia(item.id, item.media_url)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default BusinessDashboard;