import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import WhyRais from '../components/WhyRais';
import TechStack from '../components/TechStack';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Services />
      <WhyRais />
      <TechStack />
      <Contact />
      <Footer />
    </div>
  );
}
