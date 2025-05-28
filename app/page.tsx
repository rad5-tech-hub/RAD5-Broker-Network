"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  ArrowRight,
  Users,
  DollarSign,
  Code,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

interface Program {
  name: string;
  duration: string;
  price: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Chinedu O.",
    role: "RBN Ambassador",
    quote:
      "RBN made it easy to earn by referring students to RAD5’s web dev course. I’ve earned over $500!",
  },
  {
    name: "Fatima B.",
    role: "Digital Marketer",
    quote:
      "The referral system is seamless. I love promoting RAD5’s programs and seeing my commissions grow.",
  },
  {
    name: "Emeka N.",
    role: "Tech Enthusiast",
    quote:
      "As an RBN ambassador, I’ve built a network and earned passive income. Highly recommend!",
  },
];

const programs: Program[] = [
  { name: "Digital Marketing", duration: "8 weeks", price: 800 },
  { name: "Frontend Web Development", duration: "12 weeks", price: 1200 },
  { name: "Data Analytics", duration: "10 weeks", price: 1000 },
  { name: "UI/UX Design", duration: "8 weeks", price: 900 },
  { name: "Mobile App Development", duration: "12 weeks", price: 1300 },
];

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedProgram, setSelectedProgram] = useState("1200");
  const [commission, setCommission] = useState(120);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const features: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }[] = [
    {
      icon: <Code className="h-8 w-8 text-gray-700 dark:text-gray-300 " />,
      title: "Promote Elite Courses",
      description: "Share RAD5 Tech Hub’s top-tier tech programs.",
    },
    {
      icon: <Users className="h-8 w-8 text-gray-700 dark:text-gray-300" />,
      title: "Grow Your Reach",
      description: "Refer clients with your unique link.",
    },
    {
      icon: <DollarSign className="h-8 w-8 text-gray-700 dark:text-gray-300" />,
      title: "Earn Instantly",
      description: "Get 10% commission per enrollment.",
    },
  ];

  const stats: { label: string; value: number }[] = [
    { label: "Ambassadors", value: 5000 },
    { label: "Referrals", value: 20000 },
    { label: "Commissions Paid", value: 500000 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  const calculateCommission = (price: string) => {
    const amount = parseInt(price, 10);
    setCommission(amount * 0.1);
  };

  useEffect(() => {
    calculateCommission(selectedProgram);
  }, [selectedProgram]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () =>
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () =>
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

  return (
    <div className="min-h-screen bg-[#ffff]/20 dark:bg-gray-900 font-poppins">
      {/* Single Color Background */}
      <div
        className="fixed inset-0 bg-[#ffff]/20 dark:bg-gray-900 z-0"
        aria-hidden="true"
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center space-x-2"
            aria-label="RAD5 Brokers Network Home"
          >
            <Image src="/rad5hub.png" alt="RAD5 Logo" width={70} height={70} />
            {/* <span className="max-lg:hidden text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
              RAD5 Brokers Network
            </span> */}
          </Link>
          <nav>
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open Menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
            <div className="hidden md:flex space-x-6" role="navigation">
              <Link
                href="#features"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              >
                Features
              </Link>
              <Link
                href="#programs"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              >
                Programs
              </Link>
              <Link
                href="#testimonials"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              >
                Testimonials
              </Link>
              <Link
                href="#contact"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              >
                Contact
              </Link>
            </div>
          </nav>
          <div className="flex items-center space-x-4">
            <Button
              asChild
              variant="ghost"
              className="text-gray-800 dark:text-gray-100"
              aria-label="Sign In"
            >
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button
              asChild
              className="bg-gray-700 text-white hover:bg-gray-800 dark:bg-gray-300 dark:text-gray-900 dark:hover:bg-gray-400"
              aria-label="Become an Ambassador"
            >
              <Link href="/signup">Become an Ambassador</Link>
            </Button>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-gray-200/20 dark:hover:bg-gray-700/20"
              aria-label={`Switch to ${
                theme === "dark" ? "light" : "dark"
              } mode`}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              className=" fixed inset-y-0 left-0 w-[70vw] h-screen bg-white dark:bg-gray-800 shadow-xl z-50"
            >
              <div className="p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(false)}
                  aria-label="Close Menu"
                  className="mb-4"
                >
                  <X className="h-6 w-6" />
                </Button>
                <nav className="flex flex-col space-y-4">
                  <span className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                    RAD5 Brokers Network
                  </span>
                  <Link
                    href="#features"
                    className="text-gray-800 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 text-lg"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    Features
                  </Link>
                  <Link
                    href="#programs"
                    className="text-gray-800 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 text-lg"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    Programs
                  </Link>
                  <Link
                    href="#testimonials"
                    className="text-gray-800 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 text-lg"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    Testimonials
                  </Link>
                  <Link
                    href="#contact"
                    className="text-gray-800 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 text-lg"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    Contact
                  </Link>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative z-10 py-12">
        <div
          className="absolute inset-0 bg-circuit-pattern opacity-10 dark:opacity-20"
          aria-hidden="true"
        />
        <motion.div
          className="container mx-auto px-4 sm:px-6 text-center bg-[#ffff]/20 dark:bg-gray-800/10 backdrop-blur-md rounded-2xl py-8 sm:py-12 max-w-4xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 dark:text-gray-100 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Earn with RAD5 Brokers Network
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Join as an ambassador, refer students to RAD5 Tech Hub’s tech
            programs, and earn up to 10% commission instantly.
          </motion.p>
          <motion.div
            className="mb-8 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 bg-white/20 dark:bg-gray-800/20 rounded-lg p-4">
              <Select
                value={selectedProgram}
                onValueChange={setSelectedProgram}
                aria-label="Select a program"
              >
                <SelectTrigger className="bg-transparent border-none text-gray-800 dark:text-gray-100">
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem
                      key={program.name}
                      value={program.price.toString()}
                    >
                      {program.name} (${program.price})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p
                className="text-gray-700 dark:text-gray-300 font-semibold"
                aria-live="polite"
              >
                Earn ${commission.toFixed(0)}
              </p>
            </div>
          </motion.div>
          <motion.div
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button
              size="lg"
              asChild
              className="bg-gray-700 text-white hover:bg-gray-800 dark:bg-gray-300 dark:text-gray-900 dark:hover:bg-gray-400 transform hover:scale-105 transition-transform"
              aria-label="Start Earning"
            >
              <Link href="/signup">
                Start Earning <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-gray-700 border-gray-700 hover:bg-gray-200/20 dark:text-gray-300 dark:border-gray-300 dark:hover:bg-gray-700/20 transform hover:scale-105 transition-transform"
              aria-label="Learn How It Works"
            >
              <Link href="#features">How It Works</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-16 sm:py-20 container mx-auto px-4 sm:px-6 relative z-10"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12">
          Why Join RBN?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-lg sm:text-xl text-gray-800 dark:text-gray-100">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Programs Section */}
      <section
        id="programs"
        className="py-16 sm:py-20 bg-[#ffff]/20 dark:bg-gray-800 relative z-10"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12">
            RAD5 Tech Hub Programs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <motion.div
                key={program.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">
                      {program.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      Duration: {program.duration}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Price: ${program.price}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      Earn ${(program.price * 0.1).toFixed(0)} per referral
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-gray-100 dark:bg-gray-900 relative z-10">
        <div
          className="absolute inset-0 bg-circuit-pattern opacity-10 dark:opacity-20"
          aria-hidden="true"
        />
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-12">
            RBN’s Impact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-4xl sm:text-5xl font-bold text-gray-700 dark:text-gray-300 mb-4">
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                  >
                    {stat.value.toLocaleString()}+
                  </motion.span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 sm:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12">
            What Our Clients Say
          </h2>
          <div className="relative h-auto min-h-[200px] sm:min-h-[250px]">
            <AnimatePresence>
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                // exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800">
                  <CardContent className="p-4 sm:p-6">
                    <p className="text-gray-600 dark:text-gray-300 italic mb-4">
                      {`"${
                        testimonials[currentTestimonial]?.quote ||
                        "No testimonial available"
                      }"`}
                    </p>
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarFallback>
                          {testimonials[currentTestimonial]?.name[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-100">
                          {testimonials[currentTestimonial]?.name || "Unknown"}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {testimonials[currentTestimonial]?.role || "User"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center space-x-4 mt-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevTestimonial}
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextTestimonial}
                aria-label="Next Testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section
        id="contact"
        className="py-16 sm:py-20 bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900 relative z-10"
      >
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Join RBN Today
          </h2>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Become an ambassador, promote RAD5 Tech Hub, and start earning
            commissions. Subscribe for updates!
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row max-w-md mx-auto space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100"
              aria-label="Email for newsletter"
            />
            <Button
              type="submit"
              className="bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-400 dark:text-gray-900 dark:hover:bg-gray-500"
              aria-label="Subscribe to newsletter"
            >
              Subscribe
            </Button>
          </form>
          <div className="mt-8 flex justify-center space-x-6">
            <Link
              href="https://twitter.com"
              className="text-white dark:text-gray-900 hover:text-gray-300 dark:hover:text-gray-700"
              aria-label="Follow us on Twitter"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </Link>
            <Link
              href="https://linkedin.com"
              className="text-white dark:text-gray-900 hover:text-gray-300 dark:hover:text-gray-700"
              aria-label="Follow us on LinkedIn"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.447h-3.172v-4.972c0-2.266-.012-5.176-3.147-5.147 0-1.1-.2-2.2v-3.128h3.172V3c0 1.1 1.1-1.1 2.2 2.2h3.147z" />
              </svg>
            </Link>
            <Link
              href="https://github.com"
              className="text-white dark:text-gray-900 hover:text-gray-300 dark:hover:text-gray-700"
              aria-label="GitHub"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.3 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.334-4.033-1.334-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap");
        .font-poppins {
          font-family: "Poppins", sans-serif;
        }
        .bg-circuit-pattern {
          background-image: url("data:image/svg+xml;utf8,%3Csvg%20width=%22100%22%20height=%22100%22%20viewBox=%220%200%20100%20100%22%20fill=%22none%22%20stroke=%22%23000000%22%20stroke-width=%221%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%3E%3Cpath%20d=%22M10%2010h80M10%2050h80M10%2090h80M50%2010v80M10%2030h20M70%2030h20M10%2070h20M70%2070h20%22/%3E%3C/svg%3E");
          background-repeat: repeat;
        }
      `}</style>
    </div>
  );
}
