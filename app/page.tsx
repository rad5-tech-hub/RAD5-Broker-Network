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
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RiTwitterXLine } from "react-icons/ri";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

interface Program {
  id: number;
  name: string;
  duration: string;
  price: number;
  abbreviation: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Chinedu O.",
    role: "RBN Ambassador",
    quote:
      "RBN made it easy to earn by referring students to RAD5’s web dev course. I’ve earned over ₦125,000!",
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
  {
    id: 1,
    name: "Frontend Web Development",
    duration: "6 months",
    price: 250000,
    abbreviation: "Frontend Web Dev",
  },
  {
    id: 2,
    name: "Data Analytics",
    duration: "4 months",
    price: 250000,
    abbreviation: "Data Analytics",
  },
  {
    id: 3,
    name: "UI/UX Design",
    duration: "4 months",
    price: 200000,
    abbreviation: "UI/UX Design",
  },
  {
    id: 4,
    name: "Digital Marketing",
    duration: "4 months",
    price: 200000,
    abbreviation: "Digital Mktg",
  },
  {
    id: 5,
    name: "Data Analytics Virtual Class",
    duration: "4 months",
    price: 200000,
    abbreviation: "Data Analytics Virt",
  },
  {
    id: 6,
    name: "Social Media Management",
    duration: "2 months",
    price: 100000,
    abbreviation: "Social Media Mgmt",
  },
];

const stats: { label: string; value: number }[] = [
  { label: "Ambassadors", value: 5000 },
  { label: "Referrals", value: 20000 },
  { label: "Commissions Paid (₦)", value: 50000000 },
];

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedProgramId, setSelectedProgramId] = useState(1); // Default to id 1 (Frontend Web Development)
  const [selectedProgramName, setSelectedProgramName] =
    useState("Frontend Web Dev");
  const [commission, setCommission] = useState(12500);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const features: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }[] = [
    {
      icon: <Code className="h-8 w-8 text-gray-700 dark:text-gray-300" />,
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
      description: "Get 5% commission per enrollment.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  const calculateCommission = (price: number) => {
    setCommission(price * 0.05);
  };

  useEffect(() => {
    const selectedProgram = programs.find((p) => p.id === selectedProgramId);
    if (selectedProgram) {
      setSelectedProgramName(selectedProgram.abbreviation);
      calculateCommission(selectedProgram.price);
    }
  }, [selectedProgramId]);

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
          </Link>
          <nav>
            <div className="hidden md:flex space-x-6" role="navigation">
              <Link
                href="#features"
                className="text-black dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              >
                Features
              </Link>
              <Link
                href="#programs"
                className="text-black dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              >
                Programs
              </Link>
              <Link
                href="#testimonials"
                className="text-black dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              >
                Testimonials
              </Link>
              <Link
                href="#contact"
                className="text-black dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
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
              className="bg-black/60 text-white hover:bg-gray-800 dark:bg-gray-300 dark:text-gray-900 dark:hover:bg-gray-400 max-lg:hidden"
              aria-label="Become an Ambassador"
            >
              <Link href="/signup">Become an Ambassador</Link>
            </Button>
            <Button
              asChild
              className="bg-black/60 text-white hover:bg-gray-800 dark:bg-gray-300 dark:text-gray-900 dark:hover:bg-gray-400 lg:hidden"
              aria-label="Become an Ambassador"
            >
              <Link href="/signup">Signup</Link>
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
                <Moon className="h-5 w-5 text-black" />
              )}
            </button>
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
              className="fixed inset-y-0 left-0 w-[70vw] h-screen bg-white dark:bg-gray-800 shadow-xl z-50"
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
                  <Link
                    href="/"
                    className="flex items-center space-x-2"
                    aria-label="RAD5 Brokers Network Home"
                  >
                    <Image
                      src="/rad5hub.png"
                      alt="RAD5 Logo"
                      width={70}
                      height={70}
                    />
                  </Link>
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
      <section className="min-h-screen flex items-center justify-center relative z-10 py-12 bg-[url('/bg03.jpg')] bg-cover bg-center">
        <motion.div
          className="container mx-auto px-4 sm:px-6 text-center bg-transparent py-8 sm:py-12 max-w-4xl relative z-20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="bg-gradient-to-b from-black/20 to-transparent dark:from-black/30 dark:to-transparent rounded-2xl p-6 sm:p-8 sm:backdrop-blur-xs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white dark:text-gray-100 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Earn with RAD5 Brokers Network
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-white dark:text-gray-200 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Join as an ambassador, refer students to RAD5 Tech Hub’s tech
              programs, and earn up to 5% commission instantly.
            </motion.p>
            <motion.div
              className="mb-8 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 bg-white/20 dark:bg-gray-800/20 rounded-lg p-4">
                <Select
                  value={selectedProgramId.toString()}
                  onValueChange={(value) =>
                    setSelectedProgramId(parseInt(value))
                  }
                  aria-label="Select a program"
                >
                  <SelectTrigger className="bg-transparent border-none text-white dark:text-gray-100 w-full max-w-xs flex items-center justify-between pr-2">
                    <span>{selectedProgramName}</span>
                    <ChevronDown className="h-6 w-6 text-white dark:text-gray-200" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    className="w-full max-h-60 overflow-auto bg-white dark:bg-gray-800"
                  >
                    {programs.map((program) => (
                      <SelectItem
                        key={program.id}
                        value={program.id.toString()}
                        className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {program.name} (₦{program.price.toLocaleString()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p
                  className="text-white dark:text-gray-200 font-semibold text-right flex-1"
                  aria-live="polite"
                >
                  Earn ₦{commission.toLocaleString()}
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
                className="bg-black text-white hover:bg-gray-800 dark:bg-gray-300 dark:text-gray-900 dark:hover:bg-gray-400 transform hover:scale-105 transition-transform"
                aria-label="Start Earning"
              >
                <Link href="/signup">
                  Start Earning <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white hover:bg-gray-200/20 dark:text-gray-200 dark:border-gray-200 dark:hover:bg-gray-700/20 transform hover:scale-105 transition-transform"
                aria-label="Learn How It Works"
              >
                <Link href="#features">How It Works</Link>
              </Button>
            </motion.div>
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
                key={program.id}
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
                      Price: ₦{program.price.toLocaleString()}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      Earn ₦{(program.price * 0.05).toLocaleString()} per
                      referral
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Counting Animation */}
      <section
        id="stats"
        className="py-16 sm:py-20 bg-gray-100 dark:bg-gray-900 relative z-10"
      >
        <div
          className="absolute inset-0 bg-circuit-pattern opacity-10 dark:opacity-20"
          aria-hidden="true"
        />
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-12">
            RBN’s Impact
          </h2>
          <div ref={ref} className="grid grid-cols-1 sm:grid-cols-3 gap-8">
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
                    aria-live="polite"
                  >
                    {inView ? (
                      <CountUp
                        end={stat.value}
                        duration={2.5}
                        separator=","
                        suffix={
                          stat.label === "Commissions Paid (₦)" ? "" : "+"
                        }
                        prefix={
                          stat.label === "Commissions Paid (₦)" ? "₦" : ""
                        }
                      />
                    ) : (
                      `${stat.label === "Commissions Paid (₦)" ? "₦" : ""}0${
                        stat.label === "Commissions Paid (₦)" ? "" : "+"
                      }`
                    )}
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
          <div className="relative max-w-2xl mx-auto overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full"
              >
                <Card className="bg-white dark:bg-gray-800">
                  <CardContent className="p-4 sm:p-6">
                    <p className="text-gray-600 dark:text-gray-300 italic mb-4">
                      {`"${testimonials[currentTestimonial].quote}"`}
                    </p>
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarFallback>
                          {testimonials[currentTestimonial].name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-100">
                          {testimonials[currentTestimonial].name}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {testimonials[currentTestimonial].role}
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
        className="pt-16 dark:bg-gray-900 bg-gray-300 dark:text-white text-black relative z-10 dark:border-t"
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
              className="dark:text-white text-gray-900 hover:text-gray-300 dark:hover:text-gray-700"
              aria-label="Follow us on Twitter"
            >
              <RiTwitterXLine className="h-6 w-6" />
            </Link>
            <Link
              href="https://linkedin.com"
              className="dark:text-white text-gray-900 hover:text-gray-300 dark:hover:text-gray-700"
              aria-label="Follow us on LinkedIn"
            >
              <FaLinkedin className="h-6 w-6" />
            </Link>
            <Link
              href="https://github.com"
              className="dark:text-white text-gray-900 hover:text-gray-300 dark:hover:text-gray-700"
              aria-label="GitHub"
            >
              <FaGithub className="h-6 w-6" />
            </Link>
          </div>
        </div>
        <section className="mt-8 dark:text-white text-gray-900 border-t p-4">
          <div className="container text-center">
            © All Copyright 2025 by{" "}
            <Link href="https://rad5.com.ng/" className="underline">
              RAD5 Tech Hub
            </Link>
          </div>
        </section>
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
