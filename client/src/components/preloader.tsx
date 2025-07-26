import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoPath from "@assets/Hiblalogo_1753513948082.png";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 7000);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 1.5;
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900/95 via-black to-cyan-900/95 backdrop-blur-md"
        >
          {/* Animated hair strands background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Long flowing hair strands */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`long-${i}`}
                className="absolute bg-gradient-to-b from-purple-400/40 via-pink-400/30 to-cyan-400/40 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 300 + 200}px`,
                  transformOrigin: 'top center',
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  rotateZ: [0, Math.random() * 10 - 5, 0],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Medium hair strands */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`medium-${i}`}
                className="absolute bg-gradient-to-b from-cyan-400/35 via-purple-400/25 to-pink-400/35 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 200 + 150}px`,
                  transformOrigin: 'top center',
                }}
                animate={{
                  y: [0, -25, 0],
                  x: [0, Math.random() * 15 - 7.5, 0],
                  rotateZ: [0, Math.random() * 8 - 4, 0],
                  opacity: [0.3, 0.7, 0.3],
                  scaleY: [1, 1.1, 1],
                }}
                transition={{
                  duration: Math.random() * 3 + 2.5,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Short floating hair strands */}
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={`short-${i}`}
                className="absolute bg-gradient-to-b from-pink-400/30 via-cyan-400/20 to-purple-400/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 1.5 + 0.5}px`,
                  height: `${Math.random() * 100 + 50}px`,
                  transformOrigin: 'center',
                }}
                animate={{
                  y: [0, -15, 0],
                  x: [0, Math.random() * 10 - 5, 0],
                  rotateZ: [0, Math.random() * 360, 360],
                  opacity: [0.1, 0.6, 0.1],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Wavy hair effect */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`wave-${i}`}
                className="absolute"
                style={{
                  left: `${i * 12.5}%`,
                  top: `${Math.random() * 50 + 25}%`,
                  width: '2px',
                  height: '150px',
                }}
              >
                <motion.div
                  className="w-full h-full bg-gradient-to-b from-purple-500/40 to-cyan-500/40 rounded-full"
                  animate={{
                    scaleX: [1, 1.5, 1],
                    rotateZ: [0, 15, -15, 0],
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            ))}
          </div>

          <div className="relative z-10 text-center">
            {/* Logo with hair-like animation */}
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="mb-8 relative"
            >
              <div className="w-28 h-28 mx-auto rounded-full overflow-hidden glass-card neon-glow-light flex items-center justify-center relative">
                <img src={logoPath} alt="Hibla Filipino Hair" className="h-24 w-24 object-contain" />
                
                {/* Floating hair particles around logo */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={`particle-${i}`}
                    className="absolute w-1 h-8 bg-gradient-to-b from-purple-400/60 to-transparent rounded-full"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      x: [0, Math.random() * 10 - 5, 0],
                      opacity: [0, 1, 0],
                      rotateZ: [0, Math.random() * 180, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Brand name with flowing text effect */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-4xl font-bold mb-2 relative"
            >
              <span className="neon-text-purple">Hibla Filipino Hair</span>
              {/* Flowing text underlays */}
              <motion.div
                className="absolute inset-0 text-4xl font-bold text-purple-400/20"
                animate={{
                  x: [0, 2, -2, 0],
                  y: [0, -1, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Hibla Filipino Hair
              </motion.div>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-lg text-foreground/80 mb-8 neon-text-cyan"
            >
              Premium Hair Extensions
            </motion.p>

            {/* Enhanced progress bar with hair-like effects */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="w-80 mx-auto"
            >
              <div className="glass-card p-3 rounded-full relative overflow-hidden">
                {/* Background hair strands in progress bar */}
                <div className="absolute inset-0">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={`progress-hair-${i}`}
                      className="absolute w-px h-full bg-gradient-to-b from-purple-400/20 to-cyan-400/20"
                      style={{ left: `${i * 20 + 10}%` }}
                      animate={{
                        scaleY: [0.5, 1, 0.5],
                        opacity: [0.2, 0.6, 0.2],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
                
                <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full relative"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  >
                    {/* Flowing effect inside progress bar */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </motion.div>
                </div>
              </div>
              
              <motion.div 
                className="text-center mt-3 text-sm text-foreground/60"
                animate={{
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Loading beautiful hair extensions... {progress}%
              </motion.div>
            </motion.div>

            {/* Subtle loading text animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="mt-6"
            >
              <motion.p
                className="text-xs text-foreground/40"
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Preparing your premium shopping experience
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}