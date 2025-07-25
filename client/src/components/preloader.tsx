import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState("Initializing...");

  const loadingTexts = [
    "Initializing spa system...",
    "Loading services...",
    "Preparing appointments...",
    "Setting up inventory...",
    "Almost ready...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15 + 5;
        
        // Update loading text based on progress
        if (newProgress > 20) setCurrentText(loadingTexts[1]);
        if (newProgress > 40) setCurrentText(loadingTexts[2]);
        if (newProgress > 60) setCurrentText(loadingTexts[3]);
        if (newProgress > 80) setCurrentText(loadingTexts[4]);

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 text-center">
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="relative">
              <motion.h1
                className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-500 to-purple-600"
                style={{ fontFamily: "'Dancing Script', cursive" }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                Serenity
              </motion.h1>
              <motion.p
                className="text-2xl md:text-3xl text-slate-600 mt-2"
                style={{ fontFamily: "'Dancing Script', cursive" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Spa & Salon
              </motion.p>
              
              {/* Sparkle Effects */}
              <motion.div
                className="absolute -top-2 -right-2 text-pink-400 text-2xl"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ✨
              </motion.div>
              <motion.div
                className="absolute bottom-0 -left-4 text-rose-400 text-xl"
                animate={{
                  rotate: [360, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                💫
              </motion.div>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "300px", opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mx-auto mb-6"
          >
            <div className="bg-white/30 backdrop-blur-sm rounded-full h-3 border border-white/20 shadow-lg">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full shadow-sm"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            <p className="text-sm text-slate-600 mt-2">{Math.round(progress)}%</p>
          </motion.div>

          {/* Loading Text */}
          <motion.p
            key={currentText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-slate-600 font-medium"
          >
            {currentText}
          </motion.p>

          {/* Floating Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-pink-300 rounded-full"
                style={{
                  left: `${20 + (i * 15)}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2 + (i * 0.2),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}