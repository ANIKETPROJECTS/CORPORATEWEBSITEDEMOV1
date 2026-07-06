import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Calculator,
  FileText,
  Globe,
  Layers,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import {
  useServices,
  useExperts,
  useTestimonials,
  useAwards,
  useIndustries,
} from "@/hooks/use-content";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import vaultLogo from "@assets/logoipsum-344_1767855967338.png";
import ipaLogo from "@assets/logoipsum-349_1767855967339.png";
import accountingTodayLogo from "@assets/logoipsum-356_1767855967339.png";
import forbesLogo from "@assets/logoipsum-385_1767855967342.png";
import logo404 from "@assets/logoipsum-404_1767855967342.png";
import logo411 from "@assets/logoipsum-411_1767855967343.png";
import logo415 from "@assets/logoipsum-415_1767855967343.png";
import logo417 from "@assets/logoipsum-417_1767855967343.png";
import heroImage1 from "@assets/image_1768148843306.png";
import heroImage2 from "@assets/image_1768148862409.png";
import heroImage3 from "@assets/image_1768148880563.png";
import joinUsImage from "@assets/image_1768148300552.png";
import accountingImage from "@assets/image_1768140230807.png";
import taxImage from "@assets/image_1768140464458.png";
import payrollImage from "@assets/image_1768140527133.png";
import analysisImage from "@assets/image_1768140625098.png";
import expertiseImage from "@assets/image_1768143076266.png";
import hospitalityImage from "@assets/image_1768143282206.png";
import constructionImage from "@assets/image_1768143334932.png";
import healthcareImage from "@assets/image_1768143396577.png";
import legalImage from "@assets/image_1768143436752.png";
import retailImage from "@assets/image_1768143203469.png";
import missionVideo from "@assets/uhd_25fps_1768141240054.mp4";
import collaborativeVideo from "@assets/3248136-uhd_3840_2160_25fps_1768144093550.mp4";
import cultureVideo from "@assets/5725959-uhd_3840_2160_30fps_1768144492033.mp4";
import { Link } from "wouter";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function Home() {
  const { data: services } = useServices();
  const { data: experts } = useExperts();
  const { data: testimonials } = useTestimonials();
  const { data: awards } = useAwards();
  const { data: industries } = useIndustries();

  // Fetch all hero settings from admin
  const { data: siteSettings } = useQuery<{
    heroImages: string[];
    heroSlides: { main: string; sub: string; highlight: string }[];
    heroContent: { subtitle: string; primaryBtn: { text: string; link: string }; secondaryBtn: { text: string; link: string } };
  }>({
    queryKey: ["/api/settings"],
    queryFn: () => fetch("/api/settings").then((r) => r.json()),
  });

  const defaultHeroImages = [heroImage1, heroImage2, heroImage3];
  const activeHeroImages = (siteSettings?.heroImages?.length ?? 0) > 0
    ? siteSettings!.heroImages
    : defaultHeroImages;

  const defaultSlides = [
    { main: "Financial", sub: "confidence for", highlight: "today" },
    { main: "Strategic", sub: "guidance for", highlight: "growth" },
    { main: "Expert", sub: "solutions for", highlight: "success" },
  ];
  const heroSlides = siteSettings?.heroSlides?.length ? siteSettings.heroSlides : defaultSlides;

  const defaultContent = {
    subtitle: "Tax, Audit & Advisory Solutions Built for Today's Businesses",
    primaryBtn: { text: "Explore Services", link: "/services" },
    secondaryBtn: { text: "Connect Now", link: "/contact" },
  };
  const heroContent = siteSettings?.heroContent ?? defaultContent;

  const [heroIndex, setHeroIndex] = useState(0);

  // Clamp index to valid range whenever images or slides change
  const totalSlides = Math.max(activeHeroImages.length, heroSlides.length);
  const imgIndex = heroIndex % activeHeroImages.length;
  const slideIndex = heroIndex % heroSlides.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % totalSlides);
    }, 4000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const TypewriterEffect = ({ text }: { text: string }) => {
    return (
      <motion.span>
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.05,
              delay: i * 0.05,
              ease: "easeIn",
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    );
  };

  // Mocks if data is empty (for immediate preview)
  const mockServices = [
    { id: 1, title: "Advisory", icon: "BarChart3" },
    { id: 2, title: "Audit", icon: "ShieldCheck" },
    { id: 3, title: "Tax", icon: "Calculator" },
    { id: 4, title: "Technology", icon: "Globe" },
    { id: 5, title: "Client Accounting", icon: "FileText" },
    { id: 6, title: "Wealth Management", icon: "Layers" },
  ];

  const getIcon = (name: string) => {
    switch (name) {
      case "BarChart3":
        return <BarChart3 className="w-8 h-8" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-8 h-8" />;
      case "Calculator":
        return <Calculator className="w-8 h-8" />;
      case "Globe":
        return <Globe className="w-8 h-8" />;
      case "FileText":
        return <FileText className="w-8 h-8" />;
      case "Layers":
        return <Layers className="w-8 h-8" />;
      default:
        return <BarChart3 className="w-8 h-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-[#002140] overflow-hidden">
        {/* Background Image with Overlay and Pattern */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={imgIndex}
              src={activeHeroImages[imgIndex]}
              alt="Hero Background"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </AnimatePresence>
          {/* Complex Gradient Overlay matching screenshot */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#002140] via-[#002140]/95 to-transparent" />

          {/* Large "BT" Pattern Overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[900px] h-[900px] border-[140px] border-white/10 rounded-full" />
            <div className="absolute -right-40 top-1/2 -translate-y-1/3 w-[700px] h-[700px] border-[120px] border-white/5 rounded-full" />
          </div>
        </div>

        <div className="container-custom relative z-10 grid lg:grid-cols-2 gap-12 items-center lg:-mt-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl w-full"
          >
            <div className="h-[160px] sm:h-[180px] md:h-[240px] mb-4 md:mb-8 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={slideIndex}
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="text-4xl sm:text-6xl md:text-7xl lg:text-[72px] font-medium text-white font-['Poppins',sans-serif] leading-[1.1] tracking-tight"
                >
                  {heroSlides[slideIndex].main} <br />
                  {heroSlides[slideIndex].sub} <br />
                  <span className="text-secondary">
                    {heroSlides[slideIndex].highlight}
                  </span>
                </motion.h1>
              </AnimatePresence>
            </div>

            <motion.p
              variants={fadeIn}
              className="text-lg sm:text-xl md:text-3xl text-white/90 mb-6 md:mb-10 max-w-2xl leading-relaxed font-['Poppins',sans-serif] font-medium min-h-[2.5rem] md:min-h-[3.5rem] px-1"
            >
              <TypewriterEffect text={heroContent.subtitle} />
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full"
            >
              <Link href={heroContent.primaryBtn.link || "/services"} className="w-full sm:w-auto">
                <button className="w-full bg-secondary text-primary px-6 md:px-8 py-4 md:py-4 rounded-full font-bold hover:bg-white transition-all duration-300 shadow-lg shadow-secondary/20 text-base md:text-base whitespace-nowrap">
                  {heroContent.primaryBtn.text || "Explore Services"}
                </button>
              </Link>
              <Link href={heroContent.secondaryBtn.link || "/contact"} className="w-full sm:w-auto">
                <button className="w-full bg-transparent border-2 border-white text-white px-6 md:px-8 py-4 md:py-4 rounded-full font-bold hover:bg-white hover:text-primary transition-all duration-300 text-base md:text-base whitespace-nowrap">
                  {heroContent.secondaryBtn.text || "Connect Now"}
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-16 left-12 flex flex-col items-center gap-2 opacity-80"></div>
      </section>

      {/* Collaborative Approach Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom flex flex-col lg:grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="flex flex-col justify-center h-full order-2 lg:order-1"
          >
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-3 md:space-y-4">
                <motion.span
                  variants={fadeIn}
                  className="text-secondary font-bold tracking-[0.2em] uppercase text-lg md:text-xl block"
                >
                  Our Philosophy
                </motion.span>
                <motion.h2
                  variants={fadeIn}
                  className="text-4xl md:text-6xl font-bold text-primary font-display leading-[1.1]"
                >
                  A Collaborative <br /> Approach
                </motion.h2>
              </div>

              <div className="space-y-4 md:space-y-6 max-w-xl">
                <motion.p
                  variants={fadeIn}
                  className="text-xl md:text-2xl text-primary font-semibold leading-tight"
                >
                  Your goals are our goals. We don't just work for you; we work
                  with you.
                </motion.p>
                <motion.p
                  variants={fadeIn}
                  className="text-base md:text-lg text-gray-600 leading-relaxed"
                >
                  We believe that the best results come from true partnership.
                  By combining our deep technical expertise with a genuine
                  understanding of your business, we create solutions that drive
                  real value and long-term success.
                </motion.p>
              </div>

              <motion.div variants={fadeIn} className="pt-2 md:pt-4">
                <Link href="/about">
                  <button className="group flex items-center gap-3 text-primary font-bold text-lg md:text-xl hover:text-secondary transition-colors">
                    <span className="border-b-2 border-secondary pb-1 group-hover:border-primary transition-colors">
                      Read Our Story
                    </span>
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-1 lg:order-2 w-full"
          >
            {/* Collaboration video */}
            <div className="aspect-[4/3] rounded-tl-[60px] rounded-br-[60px] md:rounded-tl-[120px] md:rounded-br-[120px] overflow-hidden shadow-xl md:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] relative z-10 border-4 md:border-8 border-white">
              <video
                src={collaborativeVideo}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
              />
            </div>
            {/* Decorative background shape */}
            <div className="absolute -bottom-6 -right-6 md:-bottom-12 md:-right-12 w-full h-full bg-[#F5F2EA] rounded-tl-[60px] rounded-br-[60px] md:rounded-tl-[120px] md:rounded-br-[120px] -z-0" />
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-16 md:py-24 bg-white relative overflow-hidden"
      >
        <div className="container-custom">
          <div className="flex flex-col items-center text-center mb-12 md:mb-20 space-y-3 md:space-y-4">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-secondary font-bold tracking-[0.2em] uppercase text-lg md:text-2xl"
            >
              Our Services
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary font-display leading-tight px-4"
            >
              Backed by Deep Industry Knowledge
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                id: 1,
                title: "Accounting & Bookkeeping",
                desc: "Full-cycle bookkeeping and financial statement preparation.",
                image: accountingImage,
                delay: 0,
              },
              {
                id: 2,
                title: "Tax Preparation & Compliance",
                desc: "Expert US & UK tax preparation, planning, and compliance.",
                image: taxImage,
                delay: 0.1,
              },
              {
                id: 3,
                title: "Payroll Processing",
                desc: "Seamless global payroll processing and administration.",
                image: payrollImage,
                delay: 0.2,
              },
              {
                id: 4,
                title: "Financial Analysis & Reporting",
                desc: "Strategic financial insights and business growth consulting.",
                image: analysisImage,
                delay: 0.3,
              },
            ].map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <Link href="/services">
                  <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-500 group cursor-pointer overflow-hidden bg-white rounded-[24px] md:rounded-[32px]">
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img
                        src={service.image}
                        alt={service.title}
                        loading="eager"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/5 transition-colors duration-500" />
                    </div>

                    <CardContent className="p-6 md:p-8 space-y-3 md:space-y-4">
                      <h3 className="text-xl md:text-2xl font-bold text-primary group-hover:text-secondary transition-colors duration-300">
                        {service.title}
                      </h3>
                      <div className="pt-2 md:pt-4 flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all duration-300 text-sm md:text-base">
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-[#002140] text-white overflow-hidden relative">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] border-[60px] md:border-[100px] border-white/20 rounded-full translate-x-1/3 -translate-y-1/3" />
        </div>

        <div className="container-custom relative z-10">
          <div className="flex flex-col items-center text-center mb-12 md:mb-16 space-y-3 md:space-y-4">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-secondary font-bold tracking-[0.2em] uppercase text-lg md:text-xl block"
            >
              Our Working Process
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold font-display leading-tight px-4"
            >
              <span className="text-white">A Simple & Seamless</span> <br />
              <span className="text-secondary">Outsourcing Process</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                step: "01",
                title: "Consultation",
                desc: "We understand your business needs and requirements.",
              },
              {
                step: "02",
                title: "Tailored Solution",
                desc: "We create a customized outsourcing strategy.",
              },
              {
                step: "03",
                title: "Onboarding & Integration",
                desc: "Your dedicated team gets onboarded with full system integration.",
              },
              {
                step: "04",
                title: "Ongoing Support",
                desc: "We provide continuous support and performance monitoring.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative p-6 md:p-8 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex flex-col h-full gap-3 md:gap-4">
                  <span className="text-3xl md:text-4xl font-bold text-secondary/30 group-hover:text-secondary/80 transition-colors duration-500">
                    {item.step}
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-secondary transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm md:text-base text-white/60 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve Section */}
      <section id="industries" className="py-16 md:py-24 bg-[#F5F2EA] overflow-hidden">
        <div className="container-custom">
          <div className="flex flex-col items-center text-center mb-12 md:mb-20 space-y-3 md:space-y-4">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-secondary font-bold tracking-[0.2em] uppercase text-lg md:text-xl"
            >
              Our Expertise
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary font-display px-4"
            >
              Industries We Serve
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg md:text-xl text-gray-600 max-w-3xl px-4"
            >
              We provide specialized accounting outsourcing services to firms across multiple industries
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                id: 1,
                title: "Accounting & CPA Firms",
                desc: "Full-cycle bookkeeping and financial statement preparation specialized for CPA firms.",
                image: expertiseImage,
              },
              {
                id: 2,
                title: "E-commerce & Retail",
                desc: "Inventory management and multi-channel sales tax compliance for modern retailers.",
                image: retailImage,
              },
              {
                id: 3,
                title: "Hospitality & Restaurants",
                desc: "Specialized accounting for restaurants, hotels, and travel services.",
                image: hospitalityImage,
              },
              {
                id: 4,
                title: "Real Estate & Construction",
                desc: "Project-based accounting, job costing, and tax planning for developers and contractors.",
                image: constructionImage,
              },
              {
                id: 5,
                title: "Healthcare & Medical Practices",
                desc: "Revenue cycle management and compliance for medical practices.",
                image: healthcareImage,
              },
              {
                id: 6,
                title: "Financial Services & Wealth Management",
                desc: "Strategic financial insights and reporting for wealth management firms.",
                image: legalImage,
              },
            ].map((industry, idx) => (
              <motion.div
                key={industry.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-500 group overflow-hidden bg-white rounded-[24px] md:rounded-[32px]">
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={industry.image}
                      alt={industry.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                  <CardContent className="p-6 md:p-8">
                    <h3 className="text-xl md:text-2xl font-bold text-primary mb-2 md:mb-4 group-hover:text-secondary transition-colors">
                      {industry.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      {industry.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-16 md:py-24 bg-[#002140] text-white overflow-hidden">
        <div className="container-custom grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative order-1"
          >
            <div className="aspect-[4/3] rounded-tl-[60px] rounded-br-[60px] md:rounded-tl-[100px] md:rounded-br-[100px] overflow-hidden border-4 md:border-8 border-white/10 shadow-2xl">
              <video 
                src={cultureVideo} 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-start space-y-3 md:space-y-4 order-2"
          >
            <div className="space-y-3 md:space-y-4">
              <span className="text-secondary font-bold tracking-widest uppercase text-lg block">Our Culture</span>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight text-white">Our Team, Your Success</h2>
            </div>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-6 md:mb-10">
              We believe that happy employees lead to happy clients. Our unique culture fosters collaboration, innovation, and a relentless commitment to excellence. When our team thrives, so does your business.
            </p>
            <Link href="/about" className="mt-4">
              <button className="bg-secondary text-primary px-8 md:px-10 py-4 rounded-full font-bold hover:bg-white transition-all text-lg">
                Meet Our Team
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-16 md:py-24 bg-[#F5F2EA] overflow-hidden">
        <div className="container-custom flex flex-col lg:grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 md:space-y-8 order-2 lg:order-1"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-primary font-display">Join Us</h2>
            <div className="space-y-4 md:space-y-6">
              <p className="text-xl md:text-2xl font-bold text-primary leading-tight">
                We are one of the largest and fastest-growing certified public accounting and consulting firms.
              </p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                Consistently named one of the Best Accounting Firms to Work for in the United States by Accounting Today, Bennett Thrasher offers you the opportunities of a large accounting firm, with a collaborative, fun culture and a flexible, supportive work atmosphere.
              </p>
            </div>
            <div className="flex">
              <Link href="/contact" className="w-full sm:w-auto">
                <button className="w-full bg-white border-2 border-primary/10 text-primary px-8 py-4 rounded-full font-bold hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 text-lg">
                  Explore Careers <ArrowUpRight className="w-5 h-5 bg-secondary text-primary rounded-full p-1" />
                </button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative order-1 lg:order-2 w-full"
          >
            <div className="aspect-[4/3] rounded-tl-[60px] rounded-br-[60px] md:rounded-tl-[100px] md:rounded-br-[100px] overflow-hidden border-4 md:border-8 border-white shadow-2xl">
              <img 
                src={joinUsImage} 
                alt="Our Team" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Decorative background shape matching previous section */}
            <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 w-full h-full bg-white/50 rounded-tl-[60px] rounded-br-[60px] md:rounded-tl-[100px] md:rounded-br-[100px] -z-10" />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
