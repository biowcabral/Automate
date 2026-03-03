// Tipos compartilhados para as landing pages de automação

export interface SectionProps {
  className?: string;
}

export interface TestimonialItem {
  name: string;
  role: string;
  company: string;
  text: string;
  avatar?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BenefitItem {
  icon: string;
  title: string;
  description: string;
}

export interface PricingPlan {
  name: string;
  price: number;
  period: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel?: string;
}
