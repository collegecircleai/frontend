import { motion } from "motion/react";
import React from 'react';

interface CustomProps {
  index: number;
  angle: string;
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.2 },
  visible: (custom: CustomProps) => ({
    opacity: 1,
    scale: 1,
    rotate: custom.angle,
    transition: {
      delay: custom.index * 0.1,
      duration: 0.3,
      type: "spring" as const,
      stiffness: 150,
      damping: 20,
      mass: 0.5,
    },
  }),
};

export default function ImagesReveal({ children }: { children: React.ReactNode }) {
  // Pre-defined angles for the scattered look
  const angles = ["8deg", "-15deg", "-5deg", "10deg", "-5deg", "12deg", "-8deg"];
  const yOffsets = ["20px", "-30px", "15px", "-10px", "30px", "-20px"];
  
  return (
    <div className="relative flex flex-row justify-center w-full py-20" style={{ perspective: 1000 }}>
      {React.Children.map(children, (child, i) => {
        // Determine overlap margin depending on index (first item has no left margin)
        const marginLeft = i === 0 ? '0' : '-200px'; // Tight overlap so the full deck fits the flex container width
        
        return (
          <motion.div
            key={i}
            className="relative origin-center"
            style={{ marginLeft, marginTop: yOffsets[i % yOffsets.length] }}
            custom={{ index: i, angle: angles[i % angles.length] }}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{
              scale: 1.05,
              rotate: "0deg",
              zIndex: 50,
              y: -10,
              transition: { duration: 0.3, type: "spring", stiffness: 150, damping: 20 },
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
}
