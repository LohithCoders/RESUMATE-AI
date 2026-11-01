export type SkillState = 'matched' | 'partial' | 'missing';
export interface SkillResult { name: string; state: SkillState; evidence: string; }
export interface AnalysisResult {
  id: string; resumeName: string; role: string; company: string; score: number; date: string;
  skills: SkillResult[]; breakdown: { name: string; value: number }[]; keywordsFound: string[]; keywordsMissing: string[];
  recommendations: { title: string; body: string; type: string }[]; source: 'demo' | 'resume';
}

export const sampleResume = `Alex Johnson\nAspiring AI/ML Engineer | alex.johnson@email.com\n\nPROFESSIONAL SUMMARY\nComputer Science graduate with hands-on experience building Python-based machine learning and NLP applications. Interested in responsible, practical AI systems.\n\nTECHNICAL SKILLS\nPython, Machine Learning, SQL, NLP, Data Analysis, HTML, CSS, JavaScript\n\nPROJECTS\nCustomer Churn Prediction — Built a Python model to analyze structured customer data and evaluate prediction performance.\nAI Chatbot — Created an NLP chatbot prototype with text preprocessing and intent classification.\nResume Analyzer — Developed a tool to identify resume keywords and compare profiles with job descriptions.\n\nEDUCATION\nB.Tech in Computer Science\n\nCERTIFICATIONS\nPython Programming; Machine Learning Fundamentals`;

export const sampleJob = `AI/ML Engineer — Early Career\n\nWe are looking for an early-career AI/ML Engineer to develop machine learning applications and work with structured and unstructured data.\n\nRequirements: Python, Machine Learning, Deep Learning, NLP, Transformers, SQL, Model Deployment, Data Preprocessing.\n\nResponsibilities include implementing NLP-based solutions, evaluating model performance, and collaborating with development teams. Experience deploying models with Docker or cloud platforms is a plus.`;

export const examples = [
  { title: 'AI / ML Engineer', company: 'Northstar Labs', text: sampleJob },
  { title: 'Frontend Developer', company: 'Linearwave', text: 'We are hiring a Frontend Developer to build accessible, responsive web products. Required: JavaScript, TypeScript, React, HTML, CSS, REST APIs, Git, accessibility, testing. Experience with design systems and performance optimization is a plus.' },
  { title: 'Python Developer', company: 'Aster Systems', text: 'Python Developer to build reliable APIs and data services. Requirements: Python, FastAPI, Django, PostgreSQL, SQL, REST APIs, Docker, Git, testing and cloud deployment. Work closely with product and engineering teams.' },
  { title: 'Data Analyst', company: 'Brightside', text: 'Data Analyst who can translate business questions into clear insights. Required: SQL, Python, Excel, Tableau or Power BI, data visualization, statistics and stakeholder communication. Experience cleaning datasets and presenting findings.' },
  { title: 'Full Stack Developer', company: 'Orbit Works', text: 'Full Stack Developer to ship customer-facing applications. Skills: JavaScript, TypeScript, React, Node.js, Express, SQL, REST APIs, Git, HTML and CSS. Familiarity with cloud deployment, testing and CI/CD is valued.' },
];

const dictionary = ['Python','Machine Learning','SQL','NLP','Deep Learning','Transformers','Data Preprocessing','Model Deployment','Docker','Cloud','JavaScript','TypeScript','React','HTML','CSS','REST APIs','Git','FastAPI','Django','PostgreSQL','Excel','Tableau','Data Analysis','Data Visualization','Statistics','Node.js','Express','Accessibility','Testing','API Integration'];
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, ' ').replace(/\s+/g, ' ').trim();
const hasTerm = (haystack: string, term: string) => new RegExp(`(^|[^a-z0-9+#])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').toLowerCase()}([^a-z0-9+#]|$)`, 'i').test(haystack);

export function analyze(resumeText: string, jobText: string, resumeName: string, role: string, company: string): AnalysisResult {
  const resume = norm(resumeText), job = norm(jobText);
  const required = dictionary.filter(s => hasTerm(job, s));
  const skills = (required.length ? required : ['Python','Machine Learning','SQL','NLP','Data Preprocessing','Model Deployment']).map(name => {
    const present = hasTerm(resume, name);
    const partial = !present && name === 'Data Preprocessing' && /preprocess|clean.*data|text processing/.test(resume);
    return { name, state: present ? 'matched' as const : partial ? 'partial' as const : 'missing' as const, evidence: present ? `Found in your resume: “${name}”.` : partial ? `Related experience appears in your resume, but “${name}” is not stated directly.` : `The job description asks for “${name}”; it was not found in the resume text.` };
  });
  const matched = skills.filter(s => s.state === 'matched').length, partial = skills.filter(s => s.state === 'partial').length;
  const coverage = skills.length ? Math.round((matched + partial * .45) / skills.length * 100) : 0;
  const resumeTerms = new Set(dictionary.filter(s => hasTerm(resume, s)).map(norm));
  const overlap = job.split(' ').filter(w => w.length > 4 && resume.includes(w)).length;
  const lexical = Math.min(100, Math.round(overlap / Math.max(1, job.split(' ').filter(w=>w.length>4).length) * 260));
  const score = Math.max(20, Math.min(96, Math.round(coverage * .37 + Math.max(lexical, 35) * .63)));
  const missing = skills.filter(s => s.state === 'missing').map(s => s.name);
  const recommendations = [
    { title: 'Make your strongest evidence easier to find', body: 'Bring the projects that best match this role closer to the top of your resume, and name the tools and methods you used in each bullet.', type: 'Priority' },
    ...(missing.length ? [{ title: `Address the ${missing.slice(0,2).join(' and ')} gap`, body: 'Only add these keywords if they reflect real experience. If they are new areas, build a small project or complete practical training before claiming proficiency.', type: 'Skill gap' }] : []),
    { title: 'Strengthen project descriptions', body: 'Use action, method and outcome: explain what you built, how you approached it, and what changed or what you measured.', type: 'Writing' },
  ];
  return { id: crypto.randomUUID(), resumeName, role: role || examples.find(e => job.includes(e.title))?.title || 'Target role', company, score, date: new Date().toISOString(), skills, breakdown: [
    { name: 'Skills coverage', value: coverage }, { name: 'Experience relevance', value: Math.min(100, 40 + Math.min(60, resume.split(' ').length / 7)) }, { name: 'Keyword overlap', value: Math.max(10, lexical) }, { name: 'Project evidence', value: hasTerm(resume,'Projects') ? Math.min(92, 48 + matched * 6) : 25 }, { name: 'Education alignment', value: /education|degree|b\.tech|bachelor/i.test(resumeText) ? 82 : 45 },
  ], keywordsFound: [...resumeTerms].map(x => dictionary.find(s => norm(s) === x)!).filter(Boolean), keywordsMissing: missing, recommendations, source: resumeText.trim() ? 'resume' : 'demo' };
}

export const seedAnalysis = (): AnalysisResult => analyze(sampleResume, sampleJob, 'Alex-Johnson-Resume.pdf', 'AI / ML Engineer', 'Northstar Labs');

export const stored = {
  get<T>(key: string, fallback: T): T { try { const v = localStorage.getItem(`resumate:${key}`); return v ? JSON.parse(v) as T : fallback; } catch { return fallback; } },
  set(key: string, value: unknown) { try { localStorage.setItem(`resumate:${key}`, JSON.stringify(value)); } catch { /* Storage can be unavailable in private contexts. */ } },
};
