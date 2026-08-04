import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

interface Props {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/** Single element: fade + slide up on scroll */
export function FadeUp({ children, delay = 0, className = "" }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.4, ease, delay: reduce ? 0 : delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Single element: fade only on scroll */
export function FadeIn({ children, delay = 0, className = "" }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0 }}
      animate={inView ? { opacity: 1 } : undefined}
      transition={{ duration: 0.45, ease, delay: reduce ? 0 : delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Grid/list container: children stagger in when parent enters view */
export function FadeUpGroup({
  children,
  className = "",
  stagger = 0.1,
}: {
  children: React.ReactNode[];
  className?: string;
  stagger?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const reduce = useReducedMotion();
  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.4, ease, delay: reduce ? 0 : i * stagger }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

/** Text line reveal — clips text and slides up from below */
export function LineReveal({ children, delay = 0, className = "" }: Props) {
  const reduce = useReducedMotion();
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={reduce ? false : { y: "105%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease, delay: reduce ? 0 : delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Wraps page route content with a smooth fade-in on mount */
export function PageEnter({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
