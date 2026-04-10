export interface EducationItem {
  institution: string;
  degree: string;
  duration: string;
  score: string;
}

export interface SkillItem {
  name: string;
  icon: string;
}

export interface ProjectItem {
  title: string;
  tech: string[];
  description: string[];
  date: string;
  githubLink: string;
  liveLink: string;
  image: string;
  category: string;
}

export interface ExperienceItem {
  role: string;
  organization: string;
  duration: string;
  points: string[];
}

export const personalInfo = {
  name: 'KULSRESTHA JOSHI',
  title: 'Associate Software Engineer',
  email: 'kjkulsrestha2002@gamil.com',
  phone: '8475825367',
  linkedin: 'https://www.linkedin.com/in/contact-kj/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BfTp%2FchkYTXSiyOc%2FFLtIxQ%3D%3D',
  github: 'https://github.com/Kulsrestha',
  resumeLink: '',
  shortBio: 'I build scalable web and mobile experiences.',
  summary:
    'Associate Software Engineer with practical experience in Angular and Ionic, focused on building and maintaining modules for OQSHA. Skilled in component-driven architecture, reactive forms, API integration, responsive UI, and mobile app development. Fast learner and highly adaptable.',
};

export const education: EducationItem[] = [
  {
    institution: 'Graphic Era Hill University, Bhimtal',
    degree: 'B.Tech in Computer Science',
    duration: '2020 - 2024',
    score: 'CGPA: 8.6',
  },
  {
    institution: 'Naini Valley Senior Secondary School',
    degree: 'Senior Secondary (Class 12)',
    duration: '2020',
    score: '87%',
  },
  {
    institution: 'Naini Valley Senior Secondary School',
    degree: 'High School (Class 10)',
    duration: '2018',
    score: '80%',
  },
];

export const skills = {
  languages: [
    { name: 'TypeScript', icon: 'TypeScript' },
    { name: 'JavaScript', icon: 'JavaScript' },
    {name: 'C++', icon: 'C++ (CPlusPlus)'},
    { name: 'HTML', icon: 'HTML5' },
    { name: 'CSS', icon: 'CSS3' },
    { name: 'MySQL', icon: 'MySQL' },
  ] as SkillItem[],
  frameworksAndLibraries: [
    { name: 'Angular', icon: 'Angular' },
    { name: 'Ionic (Mobile)', icon: 'Ionic' },
    { name: 'Firebase', icon: 'Firebase' },
  ] as SkillItem[],
  toolsAndPlatforms: [
    { name: 'Git / GitLab / GitHub', icon: 'Git' },
    { name: 'Postman', icon: 'Postman' },
    { name: 'Mockoon', icon: 'Mockoon' },
  ] as SkillItem[],
  coreCompetencies: [
    'Component-Driven Architecture',
    'Reactive Forms',
    'API Integration',
    'Responsive UI',
    'Mobile App Development',
    'Bug Fixing and QA Validation',
  ],
};

export const projects: ProjectItem[] = [
  {
    title: 'Woodpecker Food Plaza',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
    description: [
      'Built a modern restaurant landing page for Woodpecker Food Plaza with clean UI and responsive layout.',
      'Implemented smooth scrolling navigation, categorized menu sections, reviews carousel, and embedded Google Maps.',
      'Designed interactive hamburger menu, glass blur navbar, scroll shrink animation, and click-to-call support.',
    ],
    date: '2026',
    githubLink: '',
    liveLink: 'https://woodpecker-zeta.vercel.app/',
    image: '/project-images/woodpecker.png',
    category: 'Restaurant Website',
  },
  {
    title: 'OQSHA Quality & Safety',
    tech: ['Angular', 'Ionic', 'Web Portal', 'HSE'],
    description: [
      'Featured the HSE-focused OQSHA platform for quality and safety management in operations and compliance.',
      'Showcased professional business workflows and module-driven interaction for audits, inspections, and reporting.',
      'Added modern navbar effects, dashboards, and operational safety visuals for HSE business users.',
    ],
    date: '2026',
    githubLink: '',
    liveLink: 'https://oqsha.com/#/home',
    image: '/project-images/oqsha.png',
    category: 'Quality & Safety',
  },
  {
    title: 'Drum Kit',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    description: [
      'Created an interactive web-based drum kit with clickable buttons and keyboard controls.',
      'Built audio playback for multiple drum sounds and responsive interaction feedback.',
      'Designed a fun frontend experience for aspiring developers and musicians.',
    ],
    date: '2025',
    githubLink: 'https://github.com/Kulsrestha/Drum-Kit',
    liveLink: 'https://drum-kit-rouge-eight.vercel.app/',
    image: '/project-images/drum-kit.png',
    category: 'Web Demo',
  },
  {
    title: 'Simon Game',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'jQuery'],
    description: [
      'Developed a classic Simon memory game with color pattern challenges and sound effects.',
      'Implemented game logic for sequence generation, user input validation, and progressive difficulty.',
      'Delivered an engaging interactive experience with clear visual feedback and sound cues.',
    ],
    date: '2025',
    githubLink: 'https://github.com/Kulsrestha/Simon-Game',
    liveLink: 'https://simon-game-six-ivory.vercel.app/',
    image: '/project-images/simon-game.png',
    category: 'Web Game',
  },
];

export const experience: ExperienceItem[] = [
  {
    role: 'Associate Software Engineer',
    organization: 'Osmosys Software Solutions',
    duration: 'Nov 2024 - Present',
    points: [
      'Project: OQSHA (Operational Quality and Safety Handling Application).',
      'Developed and enhanced modules including PSSR, Assets, Inspections, Attendance, Contractors, and KPIs.',
      'Built and maintained the Ionic mobile app with feature parity to the Angular web portal.',
      'Refactored UI and created reusable Angular components for consistency and speed.',
      'Implemented post-based pagination, dynamic dropdowns, and reactive forms.',
      'Improved data patching logic and aligned payload structures with backend teams.',
      'Reduced repetitive code using reusable services and contributed to bug fixing and deployments.',
    ],
  },
];

export const heroTypewriterLines = [
  'build Angular web experiences.',
  'ship Ionic mobile features.',
  'solve real operational problems.',
  'love clean, reusable architecture.',
];
