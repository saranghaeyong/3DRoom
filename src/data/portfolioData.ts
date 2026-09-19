export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period?: string;
  grade: string;
  classification?: string;
  details?: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  institution: string;
  year: string;
}

export interface SkillItem {
  name: string;
  category: 'Languages' | 'Web & Database' | 'Core & Tools';
}

export interface InteractiveObjectInfo {
  id: string;
  label: string;
  targetSection: string;
  description: string;
  hint: string;
  iconName: string;
}

export const PORTFOLIO_DATA = {
  brand: {
    name: "SARANG R N",
    projectName: "Sarang3DRoom",
    title: "MCA GRADUATE | SOFTWARE DEVELOPMENT | PYTHON | MACHINE LEARNING",
    location: "Kakkanad, Ernakulam, Kerala, India",
    email: "rnsarang@gmail.com",
    phone: "7994963196",
    githubUrl: "https://github.com",
    linkedinUrl: "", // Only valid links configured
  },
  
  about: {
    name: "SARANG R N",
    headline: "MCA Graduate & Software Developer",
    summary:
      "MCA Graduate with a foundation in software development, Python, Java, C, SQL/MySQL and web technologies.",
    currentDegree: "Master of Computer Applications (MCA)",
    institution: "Cochin University of Science and Technology (CUSAT)",
    cgpa: "7.66 / 10",
    classification: "First Class",
    location: "Kakkanad, Ernakulam, Kerala, India",
    highlights: [
      "Software Development & Algorithmic Problem Solving",
      "Python & Machine Learning Fundamentals",
      "Full-Stack Web Foundations (HTML, CSS, JavaScript, React)",
      "Relational Database Design with SQL & MySQL",
    ],
  },

  education: [
    {
      id: "mca",
      degree: "Master of Computer Applications (MCA)",
      institution: "Cochin University of Science and Technology (CUSAT)",
      grade: "CGPA: 7.66/10",
      classification: "First Class",
      details: "Comprehensive postgraduate study in software engineering, database systems, advanced computer science, and machine learning.",
    },
    {
      id: "bca",
      degree: "Bachelor of Computer Applications (BCA)",
      institution: "Bharata Mata College of Science and Arts",
      period: "2019 – 2022",
      grade: "CCPA: 6.24/10",
      classification: "B Class",
      details: "Undergraduate curriculum covering data structures, object-oriented programming, relational databases, and web basics.",
    },
    {
      id: "plus_two",
      degree: "Higher Secondary / Plus Two",
      institution: "Cardinal Higher Secondary, Thrikkakara",
      period: "2017 – 2019",
      grade: "Science Biology",
      classification: "Higher Secondary Board Examination",
      details: "Rigorous focus on core sciences, analytical mathematics, and biology.",
    },
    {
      id: "tenth",
      degree: "Secondary School Leaving Certificate (10th)",
      institution: "St Alberts HS, Ernakulam",
      period: "2012 – 2017",
      grade: "SSLC Board",
      classification: "High School Education",
      details: "Foundational academics, mathematics, and extracurricular science activities.",
    },
  ] as EducationItem[],

  certifications: [
    {
      id: "cert-web",
      title: "Diploma in Web Designing",
      institution: "Softmedia Computer Training",
      year: "2019",
    },
    {
      id: "cert-dtp",
      title: "Desktop Publishing (DTP)",
      institution: "Softmedia Computer Training",
      year: "2018",
    },
    {
      id: "cert-dca",
      title: "Diploma in Computer Applications",
      institution: "Softmedia Computer Training",
      year: "2017",
    },
  ] as CertificationItem[],

  skills: [
    { name: "Python", category: "Languages" },
    { name: "Java", category: "Languages" },
    { name: "C", category: "Languages" },
    { name: "SQL", category: "Web & Database" },
    { name: "MySQL", category: "Web & Database" },
    { name: "HTML", category: "Web & Database" },
    { name: "CSS", category: "Web & Database" },
    { name: "JavaScript", category: "Web & Database" },
    { name: "Web Development", category: "Web & Database" },
    { name: "Machine Learning", category: "Core & Tools" },
    { name: "Git", category: "Core & Tools" },
    { name: "GitHub", category: "Core & Tools" },
  ] as SkillItem[],

  projects: [
    {
      id: "sarang-3d-room",
      title: "Sarang3DDesktop / 3D Portfolio",
      subtitle: "Interactive 3D Workspace Experience",
      description:
        "An interactive 3D portfolio designed as a virtual desktop experience that presents personal information, skills, education, projects, resume and contact information through an immersive desktop-style interface.",
      tags: ["Three.js", "React", "TypeScript", "Tailwind CSS", "Web Audio"],
      liveUrl: "#",
      githubUrl: "https://github.com",
      featured: true,
    },
  ] as ProjectItem[],

  resume: {
    name: "SARANG R N",
    title: "MCA GRADUATE | SOFTWARE DEVELOPMENT | PYTHON | MACHINE LEARNING",
    email: "rnsarang@gmail.com",
    phone: "7994963196",
    location: "Kakkanad, Ernakulam, Kerala, India",
    objective:
      "Motivated MCA graduate with a solid academic foundation in software engineering, object-oriented development, and databases. Seeking a developer position where I can apply Python, web technologies, and machine learning concepts to deliver impactful real-world solutions.",
  },

  gallery: {
    title: "Personal Workspace & Creative Corner",
    description: "Welcome to my aesthetic personal 3D studio — designed to celebrate thoughtful programming, minimalist design, and warm cozy vibes.",
    items: [
      { label: "Dual Display Setup", desc: "Designed for focused code development & live previews" },
      { label: "Ergonomic Workspace", desc: "Clean wooden surface with mechanical keyboard & ambient warm lighting" },
      { label: "Indoor Greenery", desc: "Lush plants bringing calm and freshness into the creative space" },
      { label: "Developer Library", desc: "Curated bookshelf with algorithms, system architecture & computer science texts" },
    ]
  },

  interactiveObjects: [
    {
      id: "computer",
      label: "Desktop Computer",
      targetSection: "about",
      description: "Learn more about Sarang R N, background & bio",
      hint: "Click to view Profile & About",
      iconName: "Monitor",
    },
    {
      id: "laptop",
      label: "Laptop",
      targetSection: "projects",
      description: "Explore interactive projects & code repositories",
      hint: "Click to explore Projects",
      iconName: "Laptop",
    },
    {
      id: "bookshelf",
      label: "Bookshelf",
      targetSection: "education",
      description: "Academic journey: MCA (CUSAT), BCA & schooling",
      hint: "Click to view Education",
      iconName: "GraduationCap",
    },
    {
      id: "certificate",
      label: "Framed Certificate",
      targetSection: "certifications",
      description: "Diplomas in Web Designing, DTP & Computer Applications",
      hint: "Click to view Certifications",
      iconName: "Award",
    },
    {
      id: "desk",
      label: "Developer Desk",
      targetSection: "skills",
      description: "Technical stack: Python, Java, SQL, ML & Web",
      hint: "Click to view Skills",
      iconName: "Cpu",
    },
    {
      id: "phone",
      label: "Smartphone",
      targetSection: "contact",
      description: "Direct email, phone, location & communication",
      hint: "Click to open Contact",
      iconName: "Phone",
    },
    {
      id: "resume",
      label: "Resume Document",
      targetSection: "resume",
      description: "Official resume document with view & download options",
      hint: "Click to open Resume",
      iconName: "FileText",
    },
    {
      id: "camera",
      label: "Retro Camera & Art",
      targetSection: "gallery",
      description: "Personal corner & workspace inspiration",
      hint: "Click to view Gallery",
      iconName: "Camera",
    },
    {
      id: "github",
      label: "GitHub Logo",
      targetSection: "contact",
      description: "Visit GitHub developer profile",
      hint: "Click to visit GitHub",
      iconName: "Github",
    },
  ] as InteractiveObjectInfo[],
};
