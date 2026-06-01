export interface NavLink {
  label: string
  href: string
}

export interface HeroBadge {
  icon: string
  text: string
}

export interface Feature {
  icon: string
  title: string
  description: string
}

export interface PhilosophyPoint {
  icon: string
  text: string
}

export interface Testimonial {
  quote: string
  author: string
}

export interface Stat {
  value: string
  label: string
}

export interface FooterLink {
  label: string
  href: string
}

export interface FooterSection {
  title: string
  links: FooterLink[]
}
