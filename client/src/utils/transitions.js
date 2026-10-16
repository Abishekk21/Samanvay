// Cinematic easing curves
export const easings = {
  smooth: [0.43, 0.13, 0.23, 0.96],
  easeOutExpo: [0.19, 1, 0.22, 1],
  easeInOutQuart: [0.76, 0, 0.24, 1],
  cinematic: [0.83, 0, 0.17, 1],
};

// Stagger animation for child elements
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

export const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easings.smooth,
    },
  },
};

export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easings.easeOutExpo,
    },
  },
};

// Card hover effect
export const cardHover = {
  rest: {
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
};

// Button tap effect
export const buttonTap = {
  scale: 0.97,
  transition: {
    duration: 0.1,
  },
};
