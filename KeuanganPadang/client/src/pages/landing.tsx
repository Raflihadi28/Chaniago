import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChartLine, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Shield, 
  Users,
  Star,
  ArrowRight
} from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: ChartLine,
      title: "Dashboard Keuangan",
      description: "Monitor performa bisnis dengan dashboard real-time yang mudah dipahami"
    },
    {
      icon: TrendingUp,
      title: "Analisis Penjualan",
      description: "Lacak penjualan berdasarkan kategori dine-in, takeaway, online, dan catering"
    },
    {
      icon: BarChart3,
      title: "Laporan Lengkap",
      description: "Generate laporan keuangan lengkap dengan fitur download CSV dan PDF"
    },
    {
      icon: Shield,
      title: "Keamanan Data",
      description: "Data bisnis Anda aman dengan sistem autentikasi yang terpercaya"
    }
  ];

  const testimonials = [
    {
      name: "Budi Santoso",
      restaurant: "Rumah Makan Sederhana",
      message: "Aplikasi ini sangat membantu mengelola keuangan restoran kami. Interface yang mudah dipahami!",
      rating: 5
    },
    {
      name: "Sari Dewi",
      restaurant: "Warung Nasi Padang Minang",
      message: "Fitur analisis penjualan membantu kami memahami menu favorit pelanggan.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <ChartLine className="text-primary-foreground h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Masakan Padang Chaniago</h1>
                <p className="text-sm text-muted-foreground">Sistem Laporan Keuangan</p>
              </div>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary hover:bg-primary/90"
              data-testid="login-button"
            >
              Masuk / Daftar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Kelola Keuangan Restoran
            <span className="text-primary block">Dengan Mudah</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sistem manajemen keuangan khusus untuk restoran Padang. 
            Lacak penjualan, kelola pengeluaran, dan analisis performa menu dalam satu platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary hover:bg-primary/90"
              data-testid="hero-login-button"
            >
              Mulai Gratis Sekarang
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="learn-more-button"
            >
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Fitur Unggulan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Semua yang Anda butuhkan untuk mengelola keuangan restoran secara efisien
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Dipercaya Pemilik Restoran
            </h2>
            <p className="text-lg text-muted-foreground">
              Lihat apa kata mereka tentang sistem kami
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.message}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.restaurant}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Siap Memulai?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan pemilik restoran yang sudah merasakan kemudahan 
              mengelola keuangan dengan sistem kami.
            </p>
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary hover:bg-primary/90"
              data-testid="cta-login-button"
            >
              Mulai Sekarang - Gratis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ChartLine className="text-primary-foreground h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Masakan Padang Chaniago</h3>
                <p className="text-sm text-muted-foreground">Sistem Laporan Keuangan</p>
              </div>
            </div>
            <p className="text-muted-foreground text-center md:text-right">
              © 2024 Masakan Padang Chaniago. Semua hak dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}