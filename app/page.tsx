"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  ArrowRight,
  Users,
  DollarSign,
  Code,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    {
      icon: <Code className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
      title: "Promote Tech Programs",
      description:
        "Share RAD5 Tech Hub’s courses like Digital Marketing, Web Dev, and UI/UX Design.",
    },
    {
      icon: <Users className="h-8 w-8 text-green-600 dark:text-green-400" />,
      title: "Build Your Network",
      description:
        "Refer friends and clients using your unique link and track earnings in real-time.",
    },
    {
      icon: (
        <DollarSign className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
      ),
      title: "Earn Commissions",
      description:
        "Get paid a percentage of each enrollment directly to your account.",
    },
  ];

  const programs = [
    { name: "Digital Marketing", duration: "8 weeks", price: "$800" },
    { name: "Frontend Web Development", duration: "12 weeks", price: "$1,200" },
    { name: "Data Analytics", duration: "10 weeks", price: "$1,000" },
    { name: "UI/UX Design", duration: "8 weeks", price: "$900" },
    { name: "Mobile App Development", duration: "12 weeks", price: "$1,300" },
  ];

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

  const stats = [
    { label: "Ambassadors", value: 5000 },
    { label: "Referrals Made", value: 20000 },
    { label: "Commissions Paid", value: 500000 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup (e.g., API call)
    setEmail("");
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/rad5hub.png" alt="RAD5 Logo" className="h-8" />
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              RAD5 Brokers Network
            </span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link
              href="#features"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Features
            </Link>
            <Link
              href="#programs"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Programs
            </Link>
            <Link
              href="#testimonials"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Testimonials
            </Link>
            <Link
              href="#contact"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/signup">Become an Ambassador</Link>
            </Button>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-500 dark:from-blue-800 dark:to-cyan-700 text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Earn with RAD5 Brokers Network
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Join as an ambassador, refer students to RAD5 Tech Hub’s tech
            programs, and earn commissions on every enrollment.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" asChild>
              <Link href="/signup">
                Start Earning <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/20"
            >
              <Link href="#features">How It Works</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12">
          Why Join RBN?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
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
      <section id="programs" className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12">
            RAD5 Tech Hub Programs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{program.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      Duration: {program.duration}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Price: {program.price}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      Commission: Earn 10% per referral (~
                      {(parseInt(program.price.replace("$", "")) * 0.1).toFixed(
                        0
                      )}
                      )
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-12">
            RBN’s Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <h3 className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-4">
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
      <section id="testimonials" className="py-20 container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12">
          What Our Ambassadors Say
        </h2>
        <div className="relative h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 italic mb-4">
                    "{testimonials[currentTestimonial].quote}"
                  </p>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarFallback>
                        {testimonials[currentTestimonial].name[0] || "U"}
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
        </div>
      </section>

      {/* CTA Footer */}
      <section
        id="contact"
        className="py-20 bg-blue-600 dark:bg-blue-800 text-white"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Join RBN Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Become an ambassador, promote RAD5 Tech Hub, and start earning
            commissions. Subscribe for updates!
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex max-w-md mx-auto space-x-4"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white text-gray-800"
            />
            <Button type="submit">Subscribe</Button>
          </form>
          <div className="mt-8 flex justify-center space-x-6">
            <Link href="#" className="text-white hover:text-gray-300">
              Twitter
            </Link>
            <Link href="#" className="text-white hover:text-gray-300">
              LinkedIn
            </Link>
            <Link href="#" className="text-white hover:text-gray-300">
              GitHub
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
