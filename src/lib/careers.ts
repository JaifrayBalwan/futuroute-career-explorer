// Curated sample career information for Demo Mode. Descriptive only:
// no salaries, prices or validated predictions are included.

export type Resource = { name: string; url: string; cost: "Free" | "Free to audit" | "Free tier"; note: string };

export type Career = {
  id: string;
  name: string;
  short: string;
  hue: "lavender" | "cyan" | "turquoise" | "pink" | "violet" | "warning";
  day: string;
  responsibilities: string[];
  skills: string[];
  subjects: string[];
  pathways: string[];
  projects: string[];
  commitment: string;
  commitmentLevel: number; // 1-5 relative effort to reach beginner-project level (illustrative)
  pros: string[];
  cons: string[];
  resources: Resource[];
  trial: string;
  challengeId: string;
  tags: string[]; // matching signals
};

const R = {
  fcc: { name: "freeCodeCamp", url: "https://www.freecodecamp.org/learn", cost: "Free", note: "Interactive web & programming curriculum" },
  mdn: { name: "MDN Learn Web Development", url: "https://developer.mozilla.org/en-US/docs/Learn", cost: "Free", note: "Reference-quality HTML/CSS/JS guides" },
  cs50: { name: "Harvard CS50x", url: "https://cs50.harvard.edu/x/", cost: "Free", note: "Foundations of computer science" },
  odin: { name: "The Odin Project", url: "https://www.theodinproject.com/", cost: "Free", note: "Project-based web development path" },
  kaggle: { name: "Kaggle Learn", url: "https://www.kaggle.com/learn", cost: "Free", note: "Short Python, pandas & ML courses" },
  ml: { name: "Machine Learning Specialization (Coursera)", url: "https://www.coursera.org/learn/machine-learning", cost: "Free to audit", note: "Audit option availability may vary" },
  khan: { name: "Khan Academy Computing", url: "https://www.khanacademy.org/computing", cost: "Free", note: "Gentle introduction for school students" },
  w3py: { name: "W3Schools Python", url: "https://www.w3schools.com/python/", cost: "Free", note: "Quick Python syntax practice" },
  thm: { name: "TryHackMe", url: "https://tryhackme.com/", cost: "Free tier", note: "Guided security labs; some rooms paid" },
  owasp: { name: "OWASP Top Ten", url: "https://owasp.org/www-project-top-ten/", cost: "Free", note: "Common web security risks" },
  figma: { name: "Figma Resource Library", url: "https://www.figma.com/resource-library/", cost: "Free", note: "Design fundamentals; Figma has a free plan" },
  laws: { name: "Laws of UX", url: "https://lawsofux.com/", cost: "Free", note: "Psychology principles behind interfaces" },
  skillshop: { name: "Google Skillshop", url: "https://skillshop.withgoogle.com/", cost: "Free", note: "Google Ads & Analytics training" },
  nptel: { name: "NPTEL", url: "https://nptel.ac.in/", cost: "Free", note: "Indian university courses; certificate exams may be paid" },
} satisfies Record<string, Resource>;

export const RESOURCES = R;

export const CAREERS: Career[] = [
  {
    id: "software-developer",
    name: "Software Developer",
    short: "Design, build and maintain applications people use every day.",
    hue: "lavender",
    day: "Writing and reviewing code, breaking features into tasks, fixing bugs and discussing solutions with a team.",
    responsibilities: ["Build features from requirements", "Debug and test code", "Review teammates' code", "Maintain documentation"],
    skills: ["Programming logic", "JavaScript or Python", "Git", "Problem decomposition", "Debugging"],
    subjects: ["Mathematics", "Computer Science", "Physics"],
    pathways: ["B.Tech / B.E. in CSE or IT", "BCA → MCA", "Self-taught with a strong project portfolio"],
    projects: ["Personal portfolio website", "To-do app with local storage", "Quiz game"],
    commitment: "Consistent weekly practice; fundamentals often take a few months.",
    commitmentLevel: 3,
    pros: ["Many learning resources are free", "Build things you can show", "Skills transfer across industries"],
    cons: ["Debugging can be frustrating", "Tools change frequently", "Long focused screen time"],
    resources: [R.cs50, R.fcc, R.mdn, R.odin],
    trial: "Solve a small logic puzzle or build a single HTML page.",
    challengeId: "software",
    tags: ["math", "cs", "logic", "build", "problem", "tech"],
  },
  {
    id: "web-developer",
    name: "Web Developer",
    short: "Craft websites and web apps that work on every screen.",
    hue: "cyan",
    day: "Turning designs into pages, connecting interfaces to data and testing on different browsers.",
    responsibilities: ["Build responsive pages", "Ensure accessibility", "Optimise performance", "Collaborate with designers"],
    skills: ["HTML", "CSS", "JavaScript", "Responsive design", "Accessibility basics"],
    subjects: ["Computer Science", "Art & Design", "Mathematics"],
    pathways: ["B.Tech / BCA", "Diploma in web technologies", "Self-taught with portfolio"],
    projects: ["Landing page for a local shop", "Recipe website", "Weather widget"],
    commitment: "Visible progress within weeks; depth develops over months.",
    commitmentLevel: 2,
    pros: ["Fast visual feedback", "Works well with a laptop and free tools", "Mix of logic and design"],
    cons: ["Browser quirks", "Fast-moving frameworks", "Competitive entry level"],
    resources: [R.mdn, R.fcc, R.odin],
    trial: "Build a one-page profile site with HTML and CSS.",
    challengeId: "software",
    tags: ["cs", "design", "build", "visual", "tech"],
  },
  {
    id: "ai-ml-engineer",
    name: "AI/ML Engineer",
    short: "Teach computers to find patterns and make predictions from data.",
    hue: "pink",
    day: "Preparing datasets, training and evaluating models, and checking results for errors and bias.",
    responsibilities: ["Clean and prepare data", "Train and evaluate models", "Deploy models responsibly", "Monitor model behaviour"],
    skills: ["Python", "Statistics", "Linear algebra", "Data handling", "Model evaluation"],
    subjects: ["Mathematics", "Computer Science", "Physics"],
    pathways: ["B.Tech CSE / AI & DS", "B.Sc. Mathematics/Statistics → specialisation", "Postgraduate study for research roles"],
    projects: ["Predict house prices from a public dataset", "Image classifier with a beginner tutorial", "Spam message detector"],
    commitment: "Strong maths and programming foundations needed first; a longer learning curve.",
    commitmentLevel: 5,
    pros: ["Intellectually challenging", "Applies to many domains", "Rich free learning material"],
    cons: ["Maths-heavy", "Needs programming first", "Results can be uncertain"],
    resources: [R.kaggle, R.ml, R.w3py, R.nptel],
    trial: "Interpret a small dataset and spot a pattern.",
    challengeId: "data",
    tags: ["math", "cs", "logic", "research", "data", "tech"],
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    short: "Turn messy numbers into clear answers and decisions.",
    hue: "turquoise",
    day: "Cleaning spreadsheets, writing queries, building charts and explaining findings to non-technical people.",
    responsibilities: ["Collect and clean data", "Analyse trends", "Build dashboards", "Communicate insights"],
    skills: ["Spreadsheets", "SQL", "Data visualisation", "Basic statistics", "Storytelling with data"],
    subjects: ["Mathematics", "Economics", "Computer Science", "Business Studies"],
    pathways: ["B.Sc. / B.Com / BBA with analytics", "B.Tech CSE", "Self-taught with case-study portfolio"],
    projects: ["Analyse your monthly expenses", "Dashboard of a public dataset", "Survey analysis report"],
    commitment: "Beginner-friendly start with spreadsheets; SQL and visualisation over a few months.",
    commitmentLevel: 2,
    pros: ["Can start with spreadsheets", "Useful in almost every sector", "Mix of logic and communication"],
    cons: ["Data cleaning can be repetitive", "Requires attention to detail", "Insights depend on data quality"],
    resources: [R.kaggle, R.khan, R.nptel],
    trial: "Read a small chart and identify the key trend.",
    challengeId: "data",
    tags: ["math", "economics", "logic", "data", "analyse", "business"],
  },
  {
    id: "ui-ux-designer",
    name: "UI/UX Designer",
    short: "Make products easy, useful and pleasant for real people.",
    hue: "violet",
    day: "Talking to users, sketching flows, designing screens in Figma and testing prototypes.",
    responsibilities: ["Research user needs", "Design wireframes and interfaces", "Prototype and test", "Work with developers"],
    skills: ["Visual design", "User research", "Wireframing", "Figma", "Empathy"],
    subjects: ["Art & Design", "Psychology", "English", "Computer Science"],
    pathways: ["B.Des in Interaction/Communication Design", "Any degree + design portfolio", "HCI specialisation in CSE"],
    projects: ["Redesign a confusing app screen", "Design a college event app", "Usability test with three friends"],
    commitment: "Fundamentals learnable in weeks; a portfolio takes steady practice.",
    commitmentLevel: 2,
    pros: ["Combines creativity and psychology", "Free design tools available", "Visible impact on users"],
    cons: ["Subjective feedback", "Portfolio is essential", "Must defend decisions with evidence"],
    resources: [R.figma, R.laws, R.fcc],
    trial: "Spot usability problems in a sample interface.",
    challengeId: "uiux",
    tags: ["design", "art", "psychology", "visual", "people", "creative"],
  },
  {
    id: "cybersecurity-analyst",
    name: "Cybersecurity Analyst",
    short: "Protect people and systems from digital threats.",
    hue: "cyan",
    day: "Monitoring alerts, investigating suspicious activity, patching weaknesses and teaching safe practices.",
    responsibilities: ["Monitor security alerts", "Investigate incidents", "Assess vulnerabilities", "Promote security awareness"],
    skills: ["Networking basics", "Linux", "Threat analysis", "Attention to detail", "Ethics"],
    subjects: ["Computer Science", "Mathematics", "Physics"],
    pathways: ["B.Tech CSE (cyber security)", "BCA + security certifications", "Self-taught via legal practice labs"],
    projects: ["Secure your home Wi-Fi checklist", "Beginner capture-the-flag rooms", "Phishing awareness poster"],
    commitment: "Requires networking and OS fundamentals; steady hands-on practice.",
    commitmentLevel: 4,
    pros: ["Investigative, puzzle-like work", "Clear social value", "Hands-on legal labs exist"],
    cons: ["Constant learning as threats change", "Can involve pressure during incidents", "Requires strong ethics"],
    resources: [R.thm, R.owasp, R.cs50],
    trial: "Choose the safest action in an online-safety scenario.",
    challengeId: "cyber",
    tags: ["cs", "investigate", "logic", "safety", "tech", "problem"],
  },
  {
    id: "digital-marketer",
    name: "Digital Marketer",
    short: "Connect ideas and products with the right audience online.",
    hue: "warning",
    day: "Planning campaigns, writing content, reviewing analytics and experimenting with messages.",
    responsibilities: ["Plan campaigns", "Create content", "Analyse campaign data", "Manage social channels"],
    skills: ["Copywriting", "Audience research", "Analytics", "Social media", "Creativity"],
    subjects: ["English", "Business Studies", "Economics", "Psychology"],
    pathways: ["BBA / B.Com / BMS", "Mass communication", "Any degree + campaign portfolio"],
    projects: ["Grow a club's Instagram page", "Plan a campaign for a local café", "Write and test two ad headlines"],
    commitment: "Easy to start; skill comes from running real experiments.",
    commitmentLevel: 1,
    pros: ["Creative and fast-paced", "Can practise with a phone", "Measurable results"],
    cons: ["Metrics pressure", "Platforms change often", "Results can be unpredictable"],
    resources: [R.skillshop, R.khan],
    trial: "Pick an audience and sketch a campaign idea.",
    challengeId: "marketing",
    tags: ["communication", "english", "business", "creative", "people", "social"],
  },
];

export const getCareer = (id: string) => CAREERS.find((c) => c.id === id);

export const HUE_CLASS: Record<Career["hue"], { text: string; bg: string; border: string }> = {
  lavender: { text: "text-lavender-bright", bg: "bg-lavender/15", border: "border-lavender/40" },
  cyan: { text: "text-cyan", bg: "bg-cyan/15", border: "border-cyan/40" },
  turquoise: { text: "text-turquoise", bg: "bg-turquoise/15", border: "border-turquoise/40" },
  pink: { text: "text-pink", bg: "bg-pink/15", border: "border-pink/40" },
  violet: { text: "text-lavender", bg: "bg-violet/25", border: "border-violet/50" },
  warning: { text: "text-warning", bg: "bg-warning/15", border: "border-warning/40" },
};
