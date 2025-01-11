import { motion } from 'framer-motion';
import Footer from './Footer';
import { FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, Share2Icon, BookOpenIcon } from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";

const features = [
  {
    Icon: FileTextIcon,
    name: "Learn",
    description: "Access comprehensive educational resources about sustainable investing.",
    href: "/learning",
    cta: "Start Learning",
  },
  {
    Icon: BellIcon,
    name: "Invest",
    description: "Track and manage your sustainable investment portfolio.",
    href: "/portfolio",
    cta: "View Portfolio",
  },
  {
    Icon: Share2Icon,
    name: "News",
    description: "Stay updated with the latest in sustainable finance.",
    href: "/news",
    cta: "Read More",
  },
  {
    Icon: BookOpenIcon,
    name: "Recommendation",
    description: "Get personalized sustainable investment recommendations.",
    href: "/recommendation",
    cta: "View Recommendations",
  },
];

function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-4rem)] flex items-center justify-center">
        {/* Background Image Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[90%] max-w-6xl h-[80%] rounded-3xl overflow-hidden">
            <img 
              src="/assets/landing.webp" 
              alt="Background" 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/30" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="space-y-6">
              {/* Invest. Learn. */}
              <motion.h1 
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl
                          font-serif-primary font-extralight tracking-tight
                          text-white leading-extra-tight whitespace-nowrap"
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="inline-block"
                >
                  Invest.
                </motion.span>{" "}
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="inline-block"
                >
                  Learn.
                </motion.span>
              </motion.h1>

              {/* Viresco */}
              <motion.h2 
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl
                          font-serif-primary font-extralight italic
                          bg-gradient-to-r from-green-300 to-white
                          bg-clip-text text-transparent leading-extra-tight"
              >
                Viresco
              </motion.h2>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-white/70"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {features.map((feature, idx) => (
              <MagicCard
                key={idx}
                className="flex flex-col items-start p-8 h-full"
                gradientColor="#D9D9D955"
              >
                <div className="flex items-center gap-3 mb-4">
                  <feature.Icon className="h-6 w-6 text-gray-700" />
                  <h3 className="text-xl font-semibold text-gray-800">{feature.name}</h3>
                </div>
                <p className="text-gray-600 mb-4 flex-grow">{feature.description}</p>
                <a
                  href={feature.href}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group"
                >
                  {feature.cta}
                  <span className="ml-1 transform transition-transform group-hover:translate-x-1">→</span>
                </a>
              </MagicCard>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Dashboard;