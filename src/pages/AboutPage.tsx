import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Heart, Star, Users, Shield, Award, Sparkles } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-6">
              Memora.az haqqında
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Azərbaycanın ən zərif celebration marketplace-i. Biz xüsusi anlarınızı 
              unudulmaz etmək üçün sizə ən yaxşı yerli bizneslərə qoşulmağa kömək edirik.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="px-4 py-16 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">
                  Missiyamız
                </h2>
                <p className="text-muted-foreground mb-4">
                  Memora.az olaraq biz inanırıq ki, hər bir bayram, hər bir xüsusi an 
                  mükəmməl olmağa layiqdir. Toy planlaşdırmağın stress-li olmamalıdır — 
                  əksinə, bu, sevincli bir təcrübə olmalıdır.
                </p>
                <p className="text-muted-foreground">
                  Biz Azərbaycandakı ən yaxşı xidmət təminatçılarını bir yerə toplayaraq, 
                  sizə vaxt və enerji qənaət etməyə kömək edirik. Siz sadəcə seçin və 
                  sevdiklərinizlə xüsusi anlarınızın keyfini çıxarın.
                </p>
              </div>
              <div className="glass-card rounded-3xl p-8 text-center">
                <Heart className="w-16 h-16 text-primary mx-auto mb-4" />
                <p className="font-serif text-2xl text-foreground">
                  "Hər bir xüsusi anı unudulmaz edək"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="px-4 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                Dəyərlərimiz
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Bizi digərlərindən fərqləndirən əsas prinsiplər
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Star,
                  title: "Keyfiyyət",
                  description: "Yalnız ən yaxşı, yoxlanılmış bizneslər platformamızda yer alır.",
                },
                {
                  icon: Shield,
                  title: "Etibarlılıq",
                  description: "Şəffaf qiymətlər, real rəylər və etibarlı xidmət təminatı.",
                },
                {
                  icon: Users,
                  title: "Cəmiyyət",
                  description: "Yerli bizneslərə dəstək verərək güclü bir cəmiyyət qururuq.",
                },
                {
                  icon: Award,
                  title: "Mükəmməllik",
                  description: "Hər detala diqqət yetirərək mükəmməlliyə çalışırıq.",
                },
                {
                  icon: Sparkles,
                  title: "İnnovasiya",
                  description: "Texnologiyadan istifadə edərək sizə ən rahat təcrübəni təqdim edirik.",
                },
                {
                  icon: Heart,
                  title: "Sevgi",
                  description: "İşimizi sevgi ilə görür, hər müştərimizə xüsusi yanaşırıq.",
                },
              ].map((value, index) => (
                <div
                  key={value.title}
                  className="glass-card rounded-2xl p-6 text-center"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <value.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-serif text-xl text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-4 py-16 bg-primary/5">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "500+", label: "Biznes" },
                { number: "10,000+", label: "Müştəri" },
                { number: "9", label: "Kateqoriya" },
                { number: "4.8", label: "Orta reytinq" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-serif text-4xl md:text-5xl text-foreground mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Bizimlə əlaqə saxlayın
            </h2>
            <p className="text-muted-foreground mb-8">
              Suallarınız var? Biz sizə kömək etməyə hazırıq.
            </p>
            <a
              href="mailto:info@memora.az"
              className="button-gradient text-primary-foreground px-8 py-3 rounded-full font-medium inline-block transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Bizə yazın
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
