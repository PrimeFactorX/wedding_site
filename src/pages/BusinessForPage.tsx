import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Check, TrendingUp, Users, Star, Shield, Zap, MessageCircle } from "lucide-react";

const BusinessForPage = () => {
  const benefits = [
    {
      icon: Users,
      title: "Geniş müştəri bazası",
      description: "Minlərlə potensial müştəriyə çatın",
    },
    {
      icon: Star,
      title: "Rəy sistemi",
      description: "Müştəri rəyləri ilə inamınızı artırın",
    },
    {
      icon: TrendingUp,
      title: "Analitika",
      description: "Biznesinizin performansını izləyin",
    },
    {
      icon: Shield,
      title: "Etibarlı platforma",
      description: "Güvənli və professional mühit",
    },
    {
      icon: Zap,
      title: "Asan idarəetmə",
      description: "Sadə və rahat panel",
    },
    {
      icon: MessageCircle,
      title: "Birbaşa əlaqə",
      description: "Müştərilərlə WhatsApp üzərindən əlaqə",
    },
  ];

  const plans = [
    {
      name: "Başlanğıc",
      price: "Pulsuz",
      period: "",
      features: [
        "Biznes profili",
        "5 şəkil yükləmə",
        "WhatsApp əlaqə linki",
        "Əsas statistika",
      ],
      highlighted: false,
    },
    {
      name: "Professional",
      price: "29 AZN",
      period: "/ay",
      features: [
        "Bütün Başlanğıc özəllikləri",
        "Limitsiz şəkil yükləmə",
        "Öncəlikli sıralama",
        "Detallı analitika",
        "Müştəri rəylərinə cavab",
        "Xüsusi dəstək",
      ],
      highlighted: true,
    },
    {
      name: "Premium",
      price: "49 AZN",
      period: "/ay",
      features: [
        "Bütün Professional özəllikləri",
        "Ana səhifədə yer",
        "Video yükləmə",
        "VIP nişanı",
        "Sosial media inteqrasiyası",
        "24/7 dəstək",
      ],
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-6">
              Biznesinizi böyüdün
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Memora.az-da biznesinizi qeydiyyatdan keçirin və minlərlə potensial 
              müştəriyə çatın. Toy və bayram sektorunda ən böyük platformada yer alın.
            </p>
            <Link
              to="/auth?mode=register"
              className="button-gradient text-primary-foreground px-8 py-4 rounded-full font-medium text-lg inline-block transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Pulsuz qeydiyyat
            </Link>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="px-4 py-16 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                Niyə Memora.az?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Platformamızda yer almağın üstünlükləri
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.title}
                  className="glass-card rounded-2xl p-6"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <benefit.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="font-serif text-xl text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-4 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                Necə işləyir?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Qeydiyyatdan keçin",
                  description: "Sadə formamızı dolduraraq hesab yaradın",
                },
                {
                  step: "2",
                  title: "Profilinizi yaradın",
                  description: "Şəkillər, məlumatlar və xidmətlərinizi əlavə edin",
                },
                {
                  step: "3",
                  title: "Müştərilər tapın",
                  description: "Müştərilər sizi tapır və birbaşa əlaqə saxlayır",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="font-serif text-2xl text-primary">{item.step}</span>
                  </div>
                  <h3 className="font-serif text-xl text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="px-4 py-16 bg-primary/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                Abunəlik planları
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Biznesinizə uyğun planı seçin
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl p-6 ${
                    plan.highlighted
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "glass-card"
                  }`}
                >
                  <h3 className="font-serif text-2xl mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className={plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}>
                      {plan.period}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className={`w-5 h-5 ${plan.highlighted ? "text-primary-foreground" : "text-primary"}`} />
                        <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/auth?mode=register"
                    className={`block text-center py-3 rounded-full font-medium transition-all duration-300 ${
                      plan.highlighted
                        ? "bg-background text-foreground hover:bg-background/90"
                        : "button-gradient text-primary-foreground"
                    }`}
                  >
                    Başla
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                Tez-tez soruşulan suallar
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "Qeydiyyat pulsuzdurmı?",
                  a: "Bəli, Memora.az-da qeydiyyat tamamilə pulsuzdur. Başlanğıc planı ilə dərhal biznesinizi tanıda bilərsiniz.",
                },
                {
                  q: "Ödəniş necə həyata keçirilir?",
                  a: "Ödənişlər aylıq əsasda bank kartı və ya nağd olaraq həyata keçirilir.",
                },
                {
                  q: "Planımı dəyişə bilərəmmi?",
                  a: "Bəli, istənilən vaxt planınızı artıra və ya azalda bilərsiniz.",
                },
                {
                  q: "Müştərilər mənimlə necə əlaqə saxlayır?",
                  a: "Müştərilər profildəki WhatsApp düyməsi ilə birbaşa sizinlə əlaqə saxlaya bilər.",
                },
              ].map((faq, index) => (
                <div key={index} className="glass-card rounded-xl p-6">
                  <h4 className="font-serif text-lg text-foreground mb-2">{faq.q}</h4>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-16 bg-secondary/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Hazırsınız?
            </h2>
            <p className="text-muted-foreground mb-8">
              İndi qeydiyyatdan keçin və biznesinizi böyütməyə başlayın!
            </p>
            <Link
              to="/auth?mode=register"
              className="button-gradient text-primary-foreground px-8 py-4 rounded-full font-medium text-lg inline-block transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Pulsuz başla
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BusinessForPage;
