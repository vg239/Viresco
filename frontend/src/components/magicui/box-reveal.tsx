import React from "react";
import { motion, useInView } from "framer-motion";

interface BoxRevealProps {
  children: React.ReactNode;
  boxColor?: string;
  duration?: number;
  delay?: number;
}

const BoxReveal: React.FC<BoxRevealProps> = ({
  children,
  boxColor = "#4ade80",
  duration = 0.5,
  delay = 0,
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="relative">
      <div className="relative overflow-hidden">
        {children}
        <motion.div
          initial={{ scaleX: 1 }}
          animate={isInView ? { scaleX: 0 } : { scaleX: 1 }}
          transition={{
            duration,
            delay,
            ease: "easeInOut",
            transformOrigin: "right",
          }}
          style={{ backgroundColor: boxColor }}
          className="absolute inset-0 z-10"
        />
      </div>
    </div>
  );
};

export default BoxReveal; 