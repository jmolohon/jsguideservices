/** Site-wide configuration for Joe Scegura's Guide Service */

export const site = {
  name: "Joe Scegura's Guide Service",
  description: "Alexandria, Mille Lacs Lake Minnesota fishing guide",
  phone: "(320) 260-9056",
  phoneTel: "+13202609056",
  email: "big.walleye@jsguideservice.com",
  emailSubject: "Fishing Inquiry - jsguideservice.com",
  url: "https://jsguideservices.com",
} as const;

export type NavItem = {
  href: string;
  label: string;
};

/** Main navigation — matches WordPress page menu order */
export const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/2020-pictures/", label: "2020 Pictures" },
  { href: "/rates/", label: "2022 Rates" },
  { href: "/about-joe/", label: "About Joe" },
  { href: "/about-your-trip/", label: "About Your Trip" },
  { href: "/alexandria/", label: "Alexandria" },
  { href: "/areas-we-serve/", label: "Areas We Serve" },
  { href: "/contact/", label: "Contact" },
  { href: "/mille-lacs-lake/", label: "Mille Lacs Lake" },
  { href: "/recommended-links/", label: "Recommended Links" },
  { href: "/trophies/", label: "Trophy Room - Years Past" },
];

/** Home page photo slideshow (from original WP gallery) */
export const homeSlides = [
  { src: "/uploads/2013/05/P1010115-fp.jpg", alt: "Guided fishing catch" },
  { src: "/uploads/2013/05/P1010180-fp.jpg", alt: "Walleye fishing success" },
  { src: "/uploads/2013/05/P1010196-1-fp.jpg", alt: "Happy anglers with fish" },
  { src: "/uploads/2013/05/P1010237-fp.jpg", alt: "Trophy catch on the boat" },
  { src: "/uploads/2013/05/P1010255-1-fp.jpg", alt: "Minnesota fishing trip" },
  { src: "/uploads/2013/05/P1010445-fp.jpg", alt: "Fishing on Central Minnesota lakes" },
  { src: "/uploads/2013/05/P1010321-fp.jpg", alt: "Guide service catch" },
  { src: "/uploads/2013/05/P1010457-fp.jpg", alt: "Great day of fishing" },
];

/** Sponsor / recommended brands shown in sidebar */
export const recommends = [
  {
    name: "Lindy",
    href: "https://www.lindyfishingtackle.com/",
    img: "/uploads/partners/lindy_logo.png",
  },
  {
    name: "Otter Outdoors",
    href: "https://www.otteroutdoors.com/",
    img: "/uploads/partners/otteroutdoors_logo.png",
  },
];
