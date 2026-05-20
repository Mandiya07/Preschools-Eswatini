import { School, Program, Staff } from "@/types";

export const MOCK_SCHOOLS: School[] = [
  {
    id: "1",
    name: "Little Stars Academy",
    region: "Hhohho",
    town: "Mbabane",
    address: "123 Mhlambanyatsi Road",
    type: "Daycare",
    curriculum: "Montessori",
    boarding: "Day",
    feePerTerm: 4500,
    ageGroups: ["0-2 years", "2-4 years", "4-6 years"],
    heroImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1600",
    rating: 4.8,
    reviews: 24,
    description: "Welcome to Little Stars Academy, a place where children are encouraged to explore, discover, and learn in a safe and nurturing environment. We follow the Montessori method, emphasizing independence, freedom within limits, and respect for a child's natural psychological, physical, and social development.",
    mission: "To provide a highly stimulating, safe, and nurturing environment that fosters the holistic development of every child.",
    phone: "+268 2404 1234",
    email: "admissions@littlestars.sz",
    hours: "07:30 AM - 04:30 PM",
    programs: [
      { name: "Toddlers", age: "18 months - 3 years", desc: "Focuses on sensory-motor development, language, and practical life skills." },
      { name: "Pre-Primary", age: "3 - 6 years", desc: "Introduces foundational literacy, numeracy, cultural studies, and grace and courtesy." }
    ],
    facilities: [
      "Spacious outdoor play area",
      "Purpose-built Montessori classrooms",
      "Sick bay with trained nurse",
      "Nutritious meals provided",
      "Secure campus with CCTV",
      "Digital Document Management",
      "Content & Media Hub",
      "Advanced Financial Management",
      "24/7 AI Support Ecosystem",
      "Professional photo galleries",
      "Video hosting",
      "School podcasts",
      "News publishing",
      "Event streaming",
      "Downloadable brochures"
    ],
    staff: [
      { name: "Mrs. Zandi Thwala", role: "Principal / Lead Educator" },
      { name: "Ms. Siphesihle Dlamini", role: "Toddler Class Teacher" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1587691592099-24045742c181?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1663431263071-70bf81f33f06?auto=format&fit=crop&q=80&w=400"
    ],
    admissionsDetails: [
      "Registration fee: E500 (Non-refundable)",
      "Required documents: Birth certificate, Immunization card, Parent ID",
      "Enrollment open year-round based on availability"
    ],
    socialMedia: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com"
    },
    featured: true,
    verified: true,
    tags: ["Ages 2-5", "Full Day", "Meals Included"],
    subscriptionPlan: "Professional",
    subscriptionStatus: "active",
    coordinates: { lat: -26.3211, lng: 31.1448 },
    createdAt: new Date(2023, 0, 15).toISOString()
  },
  {
    id: "2",
    name: "Sunshine Early Learning Centre",
    region: "Manzini",
    town: "Manzini",
    address: "45 Ngwane Street",
    type: "Preschool",
    curriculum: "Traditional",
    boarding: "Day",
    feePerTerm: 3800,
    ageGroups: ["2-4 years", "4-6 years"],
    heroImage: "https://images.unsplash.com/photo-1587691592099-24045742c181?auto=format&fit=crop&q=80&w=1600",
    rating: 4.5,
    reviews: 18,
    description: "Sunshine Early Learning Centre offers a traditional, structured curriculum designed to prepare children for primary school. We focus on academic readiness, social skills, and creative expression.",
    mission: "To lay a strong foundation for lifelong learning through quality early childhood education.",
    phone: "+268 2505 5678",
    email: "info@sunshineelc.sz",
    hours: "07:30 AM - 01:00 PM (Half Day)",
    programs: [
      { name: "Grade 00", age: "4 - 5 years", desc: "School readiness program focusing on pre-reading and math skills." },
      { name: "Grade 0", age: "5 - 6 years", desc: "Comprehensive preparation for Grade 1." }
    ],
    facilities: [
      "Large classrooms",
      "Well-equipped library corner",
      "Safe transport available"
    ],
    staff: [
      { name: "Mr. Bheki Ndlovu", role: "Director" }
    ],
    gallery: [],
    admissionsDetails: [
      "Interviews required for Grade 0",
      "Termly intake"
    ],
    socialMedia: {},
    featured: true,
    verified: true,
    tags: ["Ages 3-6", "Half Day", "Transport"],
    subscriptionPlan: "Basic",
    subscriptionStatus: "active",
    coordinates: { lat: -26.4950, lng: 31.3789 },
    createdAt: new Date(2023, 2, 10).toISOString()
  },
  {
    id: "3",
    name: "Happy Kids Daycare",
    region: "Lubombo",
    town: "Siteki",
    address: "Siteki Main Road",
    type: "Daycare",
    curriculum: "Play-based",
    boarding: "Day",
    feePerTerm: 2500,
    ageGroups: ["0-2 years", "2-4 years"],
    heroImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1600",
    rating: 4.2,
    reviews: 12,
    description: "A loving, home-away-from-home daycare in Siteki focusing on learning through play.",
    mission: "To provide a fun and safe space for children to grow physically and emotionally.",
    phone: "+268 7600 1234",
    email: "happykids@gmail.com",
    hours: "07:00 AM - 05:00 PM",
    programs: [],
    facilities: ["Playground", "Resting area"],
    staff: [],
    gallery: [],
    admissionsDetails: [],
    socialMedia: {},
    featured: false,
    verified: false,
    tags: ["Ages 1-4", "Full Day"],
    subscriptionPlan: "Free",
    subscriptionStatus: "active",
    coordinates: { lat: -26.4485, lng: 31.9480 },
    createdAt: new Date(2024, 1, 5).toISOString()
  }
];
