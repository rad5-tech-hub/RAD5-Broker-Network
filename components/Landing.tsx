"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

const stats: { label: string; value: number }[] = [
  { label: "Ambassadors", value: 5000 },
  { label: "Referrals", value: 20000 },
  { label: "Commissions Paid", value: 500000 },
];

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedProgram, setSelectedProgram] = useState("1200");
  const [commission, setCommission] = useState(120);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    track: "Backend",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  // Show registration form if ref exists
  useEffect(() => {
    if (ref && typeof ref === "string") {
      setIsRegisterOpen(true);
    }
  }, [ref]);

  const { ref: statsRef, inView } = useInView({
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
      description: "Get 10% commission per enrollment.",
    },
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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ref) {
      alert("Invalid referral link.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `http://rbn.bookbank.com.ng/api/v1/user/register/${ref}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Registration successful!");
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          track: "Backend",
        });
        setIsRegisterOpen(false);
      } else {
        throw new Error(data.message || "Registration failed.");
      }
    } catch (error: any) {
      alert(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffff]/20 dark:bg-gray-900 font-poppins">
      {/* Single Color Background */}
      <div
        className="fixed inset-0 bg-[#ffff]/20 dark:bg-gray-900 z-0"
        aria-hidden="true"
      />

      {/* Registration Modal */}
      <AnimatePresence>
        {isRegisterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setIsRegisterOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Register with RBN
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsRegisterOpen(false)}
                  aria-label="Close"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Full Name
                  </label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    required
                    className="mt-1 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="mt-1 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Phone Number
                  </label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    required
                    className="mt-1 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label
                    htmlFor="track"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Program Track
                  </label>
                  <Select
                    value={formData.track}
                    onValueChange={(value) =>
                      setFormData({ ...formData, track: value })
                    }
                  >
                    <SelectTrigger className="mt-1 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100">
                      <SelectValue placeholder="Select a track" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Backend">Backend</SelectItem>
                      <SelectItem value="Frontend">Frontend</SelectItem>
                      <SelectItem value="Data Analytics">
                        Data Analytics
                      </SelectItem>
                      <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                      <SelectItem value="Mobile App Development">
                        Mobile App Development
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-gray-800 dark:bg-gray-300 dark:text-gray-900 dark:hover:bg-gray-400"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center space-x-2"
            aria-label="RAD5 Brokers Network Home"
          >
            <Image src="/rad5hub.png" alt="RBN Logo" width={70} height={70} />
          </Link>
          <nav>
            <div className="hidden md:flex space-x-6">
              <Link
                href="#features"
                className="text-black dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              >
                Features
              </Link>
              <Link
                href="#programs"
                className="text-black dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              >
                Programs
              </Link>
              <Link
                href="#testimonials"
                className="text-black dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              >
                Testimonials
              </Link>
              <Link
                href="#contact"
                className="text-black dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
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
            >
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button
              asChild
              className="bg-black/60 text-white hover:bg-gray-800 dark:bg-gray-300 dark:text-gray-900 dark:hover:bg-gray-400 max-lg:hidden"
            >
              <Link href="/signup">Become an Ambassador</Link>
            </Button>
            <Button
              asChild
              className="bg-black/60 text-white hover:bg-gray-800 dark:bg-gray-300 dark:text-gray-900 dark:hover:bg-gray-400 lg:hidden"
            >
              <Link href="/signup">Signup</Link>
            </Button>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-gray-200/20 dark:hover:bg-gray-700/20"
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
                  className="mb-4"
                >
                  <X className="h-6 w-6" />
                </Button>
                <nav className="flex flex-col space-y-4">
                  <Link href="/" className="flex items-center space-x-2">
                    <Image
                      src="/rbn.png"
                      alt="RBN Logo"
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
          />
        )}
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative z-10 py-12 bg-[url('/bg03.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 opacity-10 dark:opacity-20" />
        <motion.div
          className="container mx-auto px-4 sm:px-6 text-center bg-[#ffff]/20 dark:bg-gray-800/10 backdrop-blur-md rounded-2xl py-8 sm:py-12 max-w-4xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-black dark:text-gray-100 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Earn with RAD5 Brokers Network
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-black dark:text-gray-300 mb-8 max-w-2xl mx-auto"
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
              <p className="text-gray-700 dark:text-gray-300 font-semibold">
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
              className="bg-black text-white hover:bg-gray-800 dark:bg-gray-300 dark:text-gray-900 dark:hover:bg-gray-400"
            >
              <Link href="/signup">
                Start Earning <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-gray-700 border-gray-700 hover:bg-gray-200/20 dark:text-gray-300 dark:border-gray-300 dark:hover:bg-gray-700/20"
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

      {/* Stats Section with Counting Animation */}
      <section
        id="stats"
        className="py-16 sm:py-20 bg-gray-100 dark:bg-gray-900 relative z-10"
      >
        <div className="absolute inset-0 bg-circuit-pattern opacity-10 dark:opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-12">
            RBN’s Impact
          </h2>
          <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-8">
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
                    {inView ? (
                      <CountUp
                        end={stat.value}
                        duration={2.5}
                        separator=","
                        suffix="+"
                      />
                    ) : (
                      "0+"
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
              <Button variant="ghost" size="icon" onClick={prevTestimonial}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={nextTestimonial}>
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
            />
            <Button
              type="submit"
              className="bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-400 dark:text-gray-900 dark:hover:bg-gray-500"
            >
              Subscribe
            </Button>
          </form>
          <div className="mt-8 flex justify-center space-x-6">
            <Link
              href="https://twitter.com"
              className="dark:text-white text-gray-900 hover:text-gray-300 dark:hover:text-gray-700"
            >
              <RiTwitterXLine className="h-6 w-6" />
            </Link>
            <Link
              href="https://linkedin.com"
              className="dark:text-white text-gray-900 hover:text-gray-300 dark:hover:text-gray-700"
            >
              <FaLinkedin className="h-6 w-6" />
            </Link>
            <Link
              href="https://github.com"
              className="dark:text-white text-gray-900 hover:text-gray-300 dark:hover:text-gray-700"
            >
              <FaGithub className="h-6 w-6" />
            </Link>
          </div>
        </div>
        <section className="mt-8 dark:text-white text-gray-900 border-t p-4">
          <div className="container mx-auto text-center">
            © All Copyright 2025 by{" "}
            <Link href="https://rad5.com.ng/" className="underline">
              RAD5 Tech Hub
            </Link>
          </div>
        </section>
      </section>
    </div>
  );
}
