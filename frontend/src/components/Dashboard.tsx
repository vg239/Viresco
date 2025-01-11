import { motion } from 'framer-motion';
import Footer from './Footer';
import { FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, Share2Icon, BookOpenIcon, TrendingUpIcon, LeafIcon, LineChartIcon } from "lucide-react";
import { MagicCard } from "@/components/magicui/magic-card";
import { Marquee } from "@/components/magicui/marquee";

const reviews = [
  {
    name: "ESG Portfolio Growth",
    username: "@sustainable_investor",
    body: "Achieved 25% returns focusing on renewable energy and sustainable tech companies.",
    img: "https://avatar.vercel.sh/sustainable",
  },
  {
    name: "Carbon Credit Trading",
    username: "@green_trader",
    body: "Successfully traded carbon credits with a 40% increase in portfolio value.",
    img: "https://avatar.vercel.sh/carbon",
  },
  {
    name: "Clean Energy Investment",
    username: "@energy_future",
    body: "Solar and wind energy investments outperformed traditional energy by 30%.",
    img: "https://avatar.vercel.sh/energy",
  },
  {
    name: "Impact Investing",
    username: "@impact_growth",
    body: "Doubled returns while supporting companies with strong environmental practices.",
    img: "https://avatar.vercel.sh/impact",
  },
  {
    name: "Green Tech Innovation",
    username: "@tech_sustain",
    body: "Early investment in sustainable startups led to 3x portfolio growth.",
    img: "https://avatar.vercel.sh/tech",
  },
  {
    name: "Sustainable Agriculture",
    username: "@agri_future",
    body: "Vertical farming and AgTech investments showed 45% annual growth.",
    img: "https://avatar.vercel.sh/agri",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <motion.figure 
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative w-80 cursor-pointer overflow-hidden rounded-xl border p-6 mx-6 
                 bg-white shadow-lg
                 hover:border-green-500/50 hover:shadow-green-500/10 hover:shadow-xl
                 transition-all duration-300"
    >
      <div className="flex flex-row items-center gap-3">
        <motion.img 
          whileHover={{ scale: 1.1 }}
          className="rounded-full border-2 border-black/10" 
          width="48" 
          height="48" 
          alt="" 
          src={img} 
        />
        <div className="flex flex-col">
          <figcaption className="text-lg font-bold text-black">
            {name}
          </figcaption>
          <p className="text-sm font-medium text-black/60">{username}</p>
        </div>
      </div>
      <blockquote className="mt-4 text-base text-black/80 leading-relaxed">
        {body}
      </blockquote>
    </motion.figure>
  );
};

const features = [
  {
    Icon: LeafIcon,
    name: "Sustainable Investing",
    description: "Learn the fundamentals of ESG investing and sustainable portfolio management.",
    href: "/learning",
    cta: "Start Learning",
  },
  {
    Icon: TrendingUpIcon,
    name: "Portfolio Analytics",
    description: "Track and analyze your sustainable investments with advanced metrics.",
    href: "/portfolio",
    cta: "View Analytics",
  },
  {
    Icon: Share2Icon,
    name: "Market Insights",
    description: "Get real-time updates and analysis on sustainable market trends.",
    href: "/news",
    cta: "Explore Insights",
  },
  {
    Icon: LineChartIcon,
    name: "Smart Recommendations",
    description: "Receive AI-powered suggestions for sustainable investment opportunities.",
    href: "/recommendation",
    cta: "Get Recommendations",
  },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-20">
        {/* Background Image Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative w-[900px] h-[700px] rounded-3xl overflow-hidden"
          >
            <img 
              src="/assets/landing.webp" 
              alt="Background" 
              className="w-full h-full object-cover opacity-40"
              style={{ objectPosition: 'center 20%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="space-y-8">
              <motion.h1 
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl
                          font-serif-primary font-extralight tracking-tight
                          text-white leading-extra-tight"
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="inline-block"
                >
                  Invest
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="inline-block mx-4 text-green-400"
                >
                  ·
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="inline-block"
                >
                  Learn
                </motion.span>
              </motion.h1>

              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl
                          font-serif-primary font-extralight italic
                          bg-gradient-to-r from-green-400 to-emerald-200
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
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-white/80 hover:text-green-400 transition-colors"
          >
            <svg 
              className="w-8 h-8" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 overflow-hidden bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <MagicCard
                  className="flex flex-col items-start p-8 h-full
                            bg-white
                            hover:bg-[#4ade8011]
                            transition-all duration-300"
                  gradientColor="#4ade8033"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <feature.Icon className="h-8 w-8 text-green-600" />
                    <h3 className="text-2xl font-bold text-black tracking-tight">{feature.name}</h3>
                  </div>
                  <p className="text-lg text-black/70 mb-8 flex-grow leading-relaxed font-light">
                    {feature.description}
                  </p>
                  <a
                    href={feature.href}
                    className="inline-flex items-center text-black font-semibold text-lg group hover:text-green-600 transition-colors"
                  >
                    {feature.cta}
                    <motion.span 
                      className="ml-2 group-hover:ml-3 transition-all"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </a>
                </MagicCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="relative py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-7xl font-bold text-black tracking-tight whitespace-nowrap"
            >
              Impact Through Investment<span className="text-green-500">.</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="mt-6 text-2xl text-black/70 font-light"
            >
              Transforming the future of finance, one green investment at a time
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-12 flex justify-center gap-16 text-xl"
            >
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-2xl">→</span>
                <span>
                  <strong className="text-2xl">5 Trees Planted</strong>
                  <br />
                  <span className="text-black/60 font-light">Direct impact on global reforestation and carbon reduction</span>
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-2xl">→</span>
                <span>
                  <strong className="text-2xl">73% Green Portfolio</strong>
                  <br />
                  <span className="text-black/60 font-light">Pioneering the shift towards sustainable financial markets</span>
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <button 
                onClick={() => window.location.href = '/recommendation'}
                className="mt-12 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl text-xl font-semibold 
                         transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/20"
              >
                Eco Recommendations
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who are we Section */}
      <section className="relative py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h4 className="text-sm font-medium text-black/60 mb-6">WHO ARE WE?</h4>
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/2">
                <motion.img
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  src="/assets/land.webp"
                  alt="Sustainable Investment"
                  className="w-full h-[400px] object-cover rounded-2xl"
                />
              </div>
              <div className="w-full md:w-1/2">
                <motion.p
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-xl font-extralight leading-relaxed text-black/80"
                >
                  At Viresco, we're pioneering the future of <i>sustainable finance</i>. Our platform bridges the gap between <i>traditional investing</i> and <i>environmental impact</i>, making it easier than ever to grow your wealth while contributing to a greener future.
                  <br /><br />
                  Through advanced <i>AI-driven analytics</i> and real-time market insights, we help investors make informed decisions that align with both their financial goals and <i>environmental values</i>. Our commitment to <i>transparency</i> and <i>sustainability</i> has made us a trusted partner in the growing ecosystem of responsible investment.
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="relative py-20 bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative flex h-[200px] w-full items-center justify-center overflow-hidden"
        >
          <Marquee pauseOnHover className="[--duration:40s]">
            {reviews.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white"></div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}