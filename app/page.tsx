"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useInView, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import {
  Brain,
  Clock,
  TrendingDown,
  Upload,
  Zap,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function ProblemSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Map scroll progress to title visibility
  const titleOpacity = useTransform(scrollYProgress, [0, 0.04, 0.1], [0, 0, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.04, 0.1], [20, 20, 0]);

  // Map scroll progress to card visibility (0-1 range split into 3 sections)
  const card1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [0, 0, 1]);
  const card1Y = useTransform(scrollYProgress, [0, 0.1, 0.2], [40, 40, 0]);

  const card2Opacity = useTransform(
    scrollYProgress,
    [0.13, 0.23, 0.33],
    [0, 0, 1],
  );
  const card2Y = useTransform(scrollYProgress, [0.13, 0.23, 0.33], [40, 40, 0]);

  const card3Opacity = useTransform(
    scrollYProgress,
    [0.26, 0.36, 0.46],
    [0, 0, 1],
  );
  const card3Y = useTransform(scrollYProgress, [0.26, 0.36, 0.46], [40, 40, 0]);

  const transitionOpacity = useTransform(
    scrollYProgress,
    [0.35, 0.45, 0.55],
    [0, 0, 1],
  );

  const problems = [
    {
      icon: Brain,
      title: "Overwhelming Notes",
      description: "You write too much and remember too little.",
    },
    {
      icon: Clock,
      title: "Time-Consuming Prep",
      description: "Making flashcards manually takes hours.",
    },
    {
      icon: TrendingDown,
      title: "Forgetting Curve",
      description: "You forget most of what you study within days.",
    },
  ];

  return (
    <section
      id="problem-section"
      ref={sectionRef}
      className="relative min-h-[250vh] bg-linear-to-b from-background to-muted/50 px-4"
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="max-w-6xl mx-auto w-full px-4">
          {/* Section Title */}
          <motion.div
            className="text-center mb-16"
            style={{ opacity: titleOpacity, y: titleY }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              The Problem With Traditional Studying
            </h2>
            <p className="text-lg text-muted-foreground">
              Why most students struggle to retain information
            </p>
          </motion.div>

          {/* Problem Cards Grid - Scroll Driven */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Card 1 */}
            <motion.div style={{ opacity: card1Opacity, y: card1Y }}>
              <div className="h-full p-8 rounded-lg border border-border bg-card hover:bg-card/80 transition-colors cursor-pointer group">
                <motion.div
                  className="mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Brain className="w-12 h-12 text-primary group-hover:text-primary/80 transition-colors" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-3">
                  {problems[0].title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {problems[0].description}
                </p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div style={{ opacity: card2Opacity, y: card2Y }}>
              <div className="h-full p-8 rounded-lg border border-border bg-card hover:bg-card/80 transition-colors cursor-pointer group">
                <motion.div
                  className="mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Clock className="w-12 h-12 text-primary group-hover:text-primary/80 transition-colors" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-3">
                  {problems[1].title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {problems[1].description}
                </p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div style={{ opacity: card3Opacity, y: card3Y }}>
              <div className="h-full p-8 rounded-lg border border-border bg-card hover:bg-card/80 transition-colors cursor-pointer group">
                <motion.div
                  className="mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <TrendingDown className="w-12 h-12 text-primary group-hover:text-primary/80 transition-colors" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-3">
                  {problems[2].title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {problems[2].description}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Transition Line */}
          <motion.div
            className="text-center"
            style={{ opacity: transitionOpacity }}
          >
            <p className="text-xl italic text-muted-foreground">
              That&apos;s why{" "}
              <span className="text-primary font-semibold">Recallr</span> was
              built.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ProductSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Map scroll progress to title visibility
  const titleOpacity = useTransform(scrollYProgress, [0, 0.04, 0.1], [0, 0, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.04, 0.1], [20, 20, 0]);

  // Map scroll progress to step visibility
  const step1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [0, 0, 1]);
  const step1X = useTransform(scrollYProgress, [0, 0.1, 0.2], [-40, -40, 0]);

  const step2Opacity = useTransform(
    scrollYProgress,
    [0.13, 0.23, 0.33],
    [0, 0, 1],
  );
  const step2X = useTransform(
    scrollYProgress,
    [0.13, 0.23, 0.33],
    [-40, -40, 0],
  );

  const step3Opacity = useTransform(
    scrollYProgress,
    [0.26, 0.36, 0.46],
    [0, 0, 1],
  );
  const step3X = useTransform(
    scrollYProgress,
    [0.26, 0.36, 0.46],
    [-40, -40, 0],
  );

  const ctaOpacity = useTransform(
    scrollYProgress,
    [0.38, 0.48, 0.58],
    [0, 0, 1],
  );
  const ctaY = useTransform(scrollYProgress, [0.38, 0.48, 0.58], [20, 20, 0]);

  const steps = [
    {
      number: 1,
      icon: Upload,
      title: "Upload Anything",
      description:
        "Screenshot, PDF, notes, slides, or text — Recallr handles it all.",
      details: [
        "Multiple file formats supported",
        "Paste directly or upload files",
        "Instant processing",
      ],
    },
    {
      number: 2,
      icon: Zap,
      title: "AI Generates Smart Cards",
      description: "Concise, structured, and exam-ready flashcards instantly.",
      details: [
        "Intelligent extraction",
        "Perfectly paced content",
        "Multiple question types",
      ],
    },
    {
      number: 3,
      icon: BookOpen,
      title: "Study with Spaced Repetition",
      description: "We show you cards right when you're about to forget them.",
      details: ["Optimized timing", "Better retention", "Progress tracking"],
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[250vh] bg-background px-4"
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="max-w-6xl mx-auto w-full px-4">
          {/* Section Title */}
          <motion.div
            className="text-center mb-20"
            style={{ opacity: titleOpacity, y: titleY }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How Recallr Works
            </h2>
            <p className="text-lg text-muted-foreground">
              From notes to mastery in three simple steps
            </p>
          </motion.div>

          {/* Steps Flow - Scroll Driven */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <motion.div style={{ opacity: step1Opacity, x: step1X }}>
              <div className="relative p-8 rounded-lg border border-border bg-card hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg h-full group">
                {/* Step Number Background */}
                <motion.div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  <div className="w-full h-full flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                    1
                  </div>
                </motion.div>

                {/* Icon */}
                <motion.div
                  className="mb-6 pt-2"
                  whileHover={{
                    scale: 1.15,
                    rotate: 10,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Upload className="w-12 h-12 text-primary" />
                </motion.div>

                {/* Content */}
                <div>
                  <h3 className="text-2xl font-bold mb-3">{steps[0].title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {steps[0].description}
                  </p>

                  {/* Feature List */}
                  <ul className="space-y-2">
                    {steps[0].details.map((detail, detailIdx) => (
                      <li
                        key={detailIdx}
                        className="flex items-center text-sm text-muted-foreground"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-3 shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div style={{ opacity: step2Opacity, x: step2X }}>
              <div className="relative p-8 rounded-lg border border-border bg-card hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg h-full group">
                {/* Step Number Background */}
                <motion.div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  <div className="w-full h-full flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                    2
                  </div>
                </motion.div>

                {/* Icon */}
                <motion.div
                  className="mb-6 pt-2"
                  whileHover={{
                    scale: 1.15,
                    rotate: 10,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Zap className="w-12 h-12 text-primary" />
                </motion.div>

                {/* Content */}
                <div>
                  <h3 className="text-2xl font-bold mb-3">{steps[1].title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {steps[1].description}
                  </p>

                  {/* Feature List */}
                  <ul className="space-y-2">
                    {steps[1].details.map((detail, detailIdx) => (
                      <li
                        key={detailIdx}
                        className="flex items-center text-sm text-muted-foreground"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-3 shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div style={{ opacity: step3Opacity, x: step3X }}>
              <div className="relative p-8 rounded-lg border border-border bg-card hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg h-full group">
                {/* Step Number Background */}
                <motion.div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  <div className="w-full h-full flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                    3
                  </div>
                </motion.div>

                {/* Icon */}
                <motion.div
                  className="mb-6 pt-2"
                  whileHover={{
                    scale: 1.15,
                    rotate: 10,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <BookOpen className="w-12 h-12 text-primary" />
                </motion.div>

                {/* Content */}
                <div>
                  <h3 className="text-2xl font-bold mb-3">{steps[2].title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {steps[2].description}
                  </p>

                  {/* Feature List */}
                  <ul className="space-y-2">
                    {steps[2].details.map((detail, detailIdx) => (
                      <li
                        key={detailIdx}
                        className="flex items-center text-sm text-muted-foreground"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-3 shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            className="text-center mt-16"
            style={{ opacity: ctaOpacity, y: ctaY }}
          >
            <Link
              href="/login"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-primary text-primary-foreground text-sm font-medium h-11 gap-1.5 px-6 transition-all hover:bg-primary/80"
            >
              Start Learning Now
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function MarketingPage() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  return (
    <div ref={containerRef} className="scroll-smooth">
      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Parallax Video Background */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1 }}
          animate={{ scale: isHeroInView ? 1.05 : 1 }}
          transition={{ duration: 2 }}
        >
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="group-study.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </motion.div>

        {/* Animated Black Overlay */}
        <motion.div
          className="absolute inset-0 bg-muted opacity-75"
          initial={{ opacity: 0.5 }}
          animate={isHeroInView ? { opacity: 0.75 } : { opacity: 0.5 }}
          transition={{ duration: 1 }}
        />

        {/* Hero Content - Animated */}
        <motion.div className="relative z-10 text-center space-y-8 max-w-2xl mx-auto px-4">
          {/* Main Title */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={
              isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Welcome to Recallr
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl text-white drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={
              isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Your personal memory assistant. Capture, organize, <br />
            and recall your thoughts effortlessly.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="space-x-4 flex justify-center flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={
              isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/login">
                <Button variant="default">Get Started</Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() =>
                  document
                    .getElementById("problem-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                About Us
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-white/70 text-sm">Scroll to explore</div>
        </motion.div>
      </div>

      {/* Problem Section */}
      <ProblemSection />

      {/* Product Section */}
      <ProductSection />

      <section className="bg-background px-4 py-24">
        <div className="mx-auto max-w-4xl space-y-6 rounded-3xl border border-border/70 bg-card/70 p-8 text-center shadow-lg">
          <h2 className="text-3xl font-semibold text-foreground">
            Ready to start recalling with Recallr?
          </h2>
          <p className="text-lg text-muted-foreground">
            Upload your notes, let Recallr generate smart flashcards, and study on a spaced repetition schedule—all without leaving this page.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/login">
              <Button size="lg">Start Learning Now</Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={() =>
                document
                  .getElementById("problem-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              See the Problem Again
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Spacer */}
      <div className="h-20" />
    </div>
  );
}
