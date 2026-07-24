import { SubjectType, SubjectDetailConfig, ClassLevel, Chapter } from './types';
import { Atom, Calculator, Cpu, Zap, BookOpen, Briefcase, TrendingUp, Scale, Landmark, Brain, Activity, Palette, Gavel, Globe, Database, Lightbulb } from 'lucide-react';

export const SUBJECTS = [
  // Science Core
  {
    id: SubjectType.PHYSICS,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-600/10 dark:bg-blue-400/10',
    border: 'border-blue-600/20 dark:border-blue-400/20',
    icon: Zap,
    description: "Forces, Motion, and Energy.",
    themeColor: '#3b82f6'
  },
  {
    id: SubjectType.CHEMISTRY,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-600/10 dark:bg-green-400/10',
    border: 'border-green-600/20 dark:border-green-400/20',
    icon: Atom,
    description: "Reactions and Matter.",
    themeColor: '#10b981'
  },
  {
    id: SubjectType.MATH,
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-600/10 dark:bg-yellow-400/10',
    border: 'border-yellow-600/20 dark:border-yellow-400/20',
    icon: Calculator,
    description: "Calculus, Algebra, and Trig.",
    themeColor: '#fbbf24'
  },
  {
    id: SubjectType.BIOLOGY,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-600/10 dark:bg-emerald-400/10',
    border: 'border-emerald-600/20 dark:border-emerald-400/20',
    icon: Activity,
    description: "Life Sciences and Botany.",
    themeColor: '#34d399'
  },
  {
    id: SubjectType.CS,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-600/10 dark:bg-purple-400/10',
    border: 'border-purple-600/20 dark:border-purple-400/20',
    icon: Cpu,
    description: "Python and Algorithms.",
    themeColor: '#a855f7'
  },
  
  // Commerce
  {
    id: SubjectType.ACCOUNTANCY,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-600/10 dark:bg-indigo-400/10',
    border: 'border-indigo-600/20 dark:border-indigo-400/20',
    icon: Calculator, 
    description: "Financial Accounting.",
    themeColor: '#818cf8'
  },
  {
    id: SubjectType.BUSINESS_STUDIES,
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-600/10 dark:bg-sky-400/10',
    border: 'border-sky-600/20 dark:border-sky-400/20',
    icon: Briefcase,
    description: "Business Management.",
    themeColor: '#38bdf8'
  },
  {
    id: SubjectType.ECONOMICS,
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-600/10 dark:bg-teal-400/10',
    border: 'border-teal-600/20 dark:border-teal-400/20',
    icon: TrendingUp,
    description: "Micro and Macro Economics.",
    themeColor: '#2dd4bf'
  },
  {
    id: SubjectType.ENTREPRENEURSHIP,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-600/10 dark:bg-orange-400/10',
    border: 'border-orange-600/20 dark:border-orange-400/20',
    icon: Lightbulb,
    description: "Innovation and Startups.",
    themeColor: '#fb923c'
  },
  {
    id: SubjectType.APPLIED_MATH,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-600/10 dark:bg-amber-400/10',
    border: 'border-amber-600/20 dark:border-amber-400/20',
    icon: Calculator,
    description: "Quantitative Aptitude.",
    themeColor: '#fcd34d'
  },
  {
    id: SubjectType.IP,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-600/10 dark:bg-violet-400/10',
    border: 'border-violet-600/20 dark:border-violet-400/20',
    icon: Database,
    description: "Data Handling and SQL.",
    themeColor: '#a78bfa'
  },

  // Humanities
  {
    id: SubjectType.POLITICAL_SCIENCE,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-600/10 dark:bg-red-400/10',
    border: 'border-red-600/20 dark:border-red-400/20',
    icon: Globe,
    description: "Constitution and Theory.",
    themeColor: '#f87171'
  },
  {
    id: SubjectType.HISTORY,
    color: 'text-stone-600 dark:text-stone-400',
    bg: 'bg-stone-600/10 dark:bg-stone-400/10',
    border: 'border-stone-600/20 dark:border-stone-400/20',
    icon: Landmark,
    description: "World and Indian History.",
    themeColor: '#a8a29e'
  },
  {
    id: SubjectType.PSYCHOLOGY,
    color: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-600/10 dark:bg-pink-400/10',
    border: 'border-pink-600/20 dark:border-pink-400/20',
    icon: Brain,
    description: "Human Behavior.",
    themeColor: '#f472b6'
  },
  {
    id: SubjectType.LEGAL_STUDIES,
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-600/10 dark:bg-slate-400/10',
    border: 'border-slate-600/20 dark:border-slate-400/20',
    icon: Scale,
    description: "Judiciary and Law.",
    themeColor: '#94a3b8'
  },
  {
    id: SubjectType.COMMERCIAL_ARTS,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-600/10 dark:bg-rose-400/10',
    border: 'border-rose-600/20 dark:border-rose-400/20',
    icon: Palette,
    description: "Art and Design.",
    themeColor: '#fb7185'
  },
  {
    id: SubjectType.PHYSICAL_EDUCATION,
    color: 'text-lime-600 dark:text-lime-400',
    bg: 'bg-lime-600/10 dark:bg-lime-400/10',
    border: 'border-lime-600/20 dark:border-lime-400/20',
    icon: Activity,
    description: "Health and Sports.",
    themeColor: '#a3e635'
  },
  
  // Common
  {
    id: SubjectType.ENGLISH,
    color: 'text-orange-600 dark:text-orange-300',
    bg: 'bg-orange-600/10 dark:bg-orange-300/10',
    border: 'border-orange-600/20 dark:border-orange-300/20',
    icon: BookOpen,
    description: "Literature and Grammar.",
    themeColor: '#fdba74'
  }
];

const DEFAULT_CONFIG: SubjectDetailConfig = {
    actionLabel: "AI Tutor",
    placeholder: "Ask any question related to this subject...",
    tools: ["Notes", "Flashcards"],
    chatExamples: ["Explain the key concept", "Summarize this chapter"],
    quizTypes: ["MCQ", "Short Answer"],
    notePlaceholder: "Start typing your notes here..."
};

// Generate default configs for all subjects to prevent crashes
export const SUBJECT_DETAILS: Record<SubjectType, SubjectDetailConfig> = Object.values(SubjectType).reduce((acc, subject) => {
    acc[subject] = DEFAULT_CONFIG;
    return acc;
}, {} as Record<SubjectType, SubjectDetailConfig>);

// Overwrite with specific details
SUBJECT_DETAILS[SubjectType.PHYSICS] = {
    actionLabel: "Physics Solver",
    placeholder: "Calculate the projectile motion of...",
    tools: ["Vector Calculator", "Unit Converter"],
    chatExamples: ["Explain Newton's Laws", "Derive kinematic equations"],
    quizTypes: ["Numerical", "Conceptual"],
    notePlaceholder: "Record formulas: $F=ma$"
};
SUBJECT_DETAILS[SubjectType.MATH] = {
    actionLabel: "Math Solver",
    placeholder: "Solve the integral of...",
    tools: ["Grapher", "Matrix Calc"],
    chatExamples: ["Solve this differential equation", "Explain limits"],
    quizTypes: ["Problem Solving", "Proofs"],
    notePlaceholder: "Write proofs: $\\int x dx$"
};
SUBJECT_DETAILS[SubjectType.CS] = {
    actionLabel: "Code Generator",
    placeholder: "Write a Python program to...",
    tools: ["Snippets", "Debugger"],
    chatExamples: ["Write a binary search algorithm", "Explain this code snippet"],
    quizTypes: ["Coding", "Output Prediction"],
    notePlaceholder: "Code snippets: `print('Hello')`"
};

// Full Syllabus Data mapped from NCERT for Class 11
export const SYLLABUS_DATA: Record<SubjectType, Record<string, Chapter[]>> = {
  [SubjectType.ENGLISH]: {
    'Grade 11': [
      // Hornbill (Prose)
      { id: 'eng-11-1', title: 'The Portrait of a Lady', description: 'A grandmother’s bond', topics: ['Khushwant Singh'] },
      { id: 'eng-11-2', title: 'We’re Not Afraid to Die... if We Can All Be Together', description: 'Sea adventure and survival', topics: ['Gordon Cook'] },
      { id: 'eng-11-3', title: 'Discovering Tut: the Saga Continues', description: 'Egyptian history and mystery', topics: ['A.R. Williams'] },
      { id: 'eng-11-4', title: 'The Adventure', description: 'Science fiction and history', topics: ['Jayant Narlikar'] },
      { id: 'eng-11-5', title: 'Silk Road', description: 'Travelogue to Mount Kailash', topics: ['Nick Middleton'] },
      // Hornbill (Poetry)
      { id: 'eng-11-6', title: 'A Photograph', description: 'Poem about loss and memory', topics: ['Shirley Toulson'] },
      { id: 'eng-11-7', title: 'The Laburnum Top', description: 'Nature and symbiotic relationship', topics: ['Ted Hughes'] },
      { id: 'eng-11-8', title: 'The Voice of the Rain', description: 'Cycle of rain and life', topics: ['Walt Whitman'] },
      { id: 'eng-11-9', title: 'Childhood', description: 'Loss of innocence', topics: ['Markus Natten'] },
      { id: 'eng-11-10', title: 'Father to Son', description: 'Generational gap', topics: ['Elizabeth Jennings'] },
      // Snapshots
      { id: 'eng-11-11', title: 'The Summer of the Beautiful White Horse', description: 'Trust and honesty', topics: ['William Saroyan'] },
      { id: 'eng-11-12', title: 'The Address', description: 'War and memory', topics: ['Marga Minco'] },
      { id: 'eng-11-13', title: 'Mother’s Day', description: 'Humorous play on housewives', topics: ['J.B. Priestley'] },
      { id: 'eng-11-14', title: 'Birth', description: 'Medical drama', topics: ['A.J. Cronin'] },
      { id: 'eng-11-15', title: 'The Tale of Melon City', description: 'Satire', topics: ['Vikram Seth'] },
      // Skills
      { id: 'eng-11-16', title: 'Writing Skills & Grammar', description: 'Note Making, Poster, Speech, Debate', topics: [] },
    ],
    'Grade 12': [
      // Flamingo Prose
      { id: 'eng-12-1', title: 'The Last Lesson', description: 'Flamingo Prose - Patriotism & Language Preservation', topics: ['Alphonse Daudet'] },
      { id: 'eng-12-2', title: 'Lost Spring', description: 'Flamingo Prose - Stories of Stolen Childhood', topics: ['Anees Jung'] },
      { id: 'eng-12-3', title: 'Deep Water', description: 'Flamingo Prose - Overcoming Fear', topics: ['William Douglas'] },
      { id: 'eng-12-4', title: 'The Rattrap', description: 'Flamingo Prose - Human Goodness and Redemption', topics: ['Selma Lagerlöf'] },
      { id: 'eng-12-5', title: 'Indigo', description: 'Flamingo Prose - Champaran Satyagraha', topics: ['Louis Fischer'] },
      { id: 'eng-12-6', title: 'Poets and Pancakes', description: 'Flamingo Prose - Gemini Studios & Film Industry', topics: ['Asokamitran'] },
      { id: 'eng-12-7', title: 'The Interview', description: 'Flamingo Prose - Journalism & Eco\'s Interview', topics: ['Christopher Silvester'] },
      { id: 'eng-12-8', title: 'Going Places', description: 'Flamingo Prose - Adolescent Fantasies & Hero Worship', topics: ['A.R. Barton'] },
      // Flamingo Poetry
      { id: 'eng-12-9', title: 'My Mother at Sixty-Six', description: 'Flamingo Poetry - Aging & Separation Fear', topics: ['Kamala Das'] },
      { id: 'eng-12-10', title: 'Keeping Quiet', description: 'Flamingo Poetry - Quiet Introspection & Universal Brotherhood', topics: ['Pablo Neruda'] },
      { id: 'eng-12-11', title: 'A Thing of Beauty', description: 'Flamingo Poetry - Endless Fountain of Joy', topics: ['John Keats'] },
      { id: 'eng-12-12', title: 'A Roadside Stand', description: 'Flamingo Poetry - Rural Upliftment & Economic Inequality', topics: ['Robert Frost'] },
      { id: 'eng-12-13', title: 'Aunt Jennifer’s Tigers', description: 'Flamingo Poetry - Freedom from Constraints', topics: ['Adrienne Rich'] },
      // Vistas
      { id: 'eng-12-14', title: 'The Third Level', description: 'Vistas - Escapism & Grand Central Station', topics: ['Jack Finney'] },
      { id: 'eng-12-15', title: 'The Tiger King', description: 'Vistas - Satire on Pride & Autocracy', topics: ['Kalki'] },
      { id: 'eng-12-16', title: 'Journey to the End of the Earth', description: 'Vistas - Antarctica & Environmental Awareness', topics: ['Tishani Doshi'] },
      { id: 'eng-12-17', title: 'The Enemy', description: 'Vistas - Humanity Beyond War', topics: ['Pearl S. Buck'] },
      { id: 'eng-12-18', title: 'On the Face of It', description: 'Vistas - Bonding Over Physical Impairment', topics: ['Susan Hill'] },
      { id: 'eng-12-19', title: 'Memories of Childhood', description: 'Vistas - Autobiographical Extracts on Discrimination', topics: ['Zitkala-Sa & Bama'] },
      // Writing
      { id: 'eng-12-20', title: 'Writing Skills & Advanced Composition', description: 'Notice, Invitations & Replies, Letter to Editor, Article, Job Applications', topics: ['Format & Expression'] }
    ]
  },
  [SubjectType.PHYSICS]: {
    'Grade 11': [
      { id: 'phy-11-1', title: 'Units and Measurements', description: 'Dimensions, Errors, and SI units', topics: [] },
      { id: 'phy-11-2', title: 'Motion in a Straight Line', description: 'Rectilinear motion, velocity, acceleration', topics: [] },
      { id: 'phy-11-3', title: 'Motion in a Plane', description: 'Vectors, Projectile, and Circular motion', topics: [] },
      { id: 'phy-11-4', title: 'Laws of Motion', description: 'Newton\'s laws, Friction, Dynamics', topics: [] },
      { id: 'phy-11-5', title: 'Work, Energy and Power', description: 'Collisions, Conservation of energy', topics: [] },
      { id: 'phy-11-6', title: 'System of Particles and Rotational Motion', description: 'Center of mass, Torque, Moment of Inertia', topics: [] },
      { id: 'phy-11-7', title: 'Gravitation', description: 'Kepler\'s laws, Satellite motion', topics: [] },
      { id: 'phy-11-8', title: 'Mechanical Properties of Solids', description: 'Stress, Strain, Elasticity', topics: [] },
      { id: 'phy-11-9', title: 'Mechanical Properties of Fluids', description: 'Bernoulli\'s theorem, Viscosity', topics: [] },
      { id: 'phy-11-10', title: 'Thermal Properties of Matter', description: 'Calorimetry, Heat transfer', topics: [] },
      { id: 'phy-11-11', title: 'Thermodynamics', description: 'Laws of thermodynamics, Engines', topics: [] },
      { id: 'phy-11-12', title: 'Kinetic Theory', description: 'Ideal gas behavior', topics: [] },
      { id: 'phy-11-13', title: 'Oscillations', description: 'SHM, Periodic motion', topics: [] },
      { id: 'phy-11-14', title: 'Waves', description: 'Sound waves, Doppler effect', topics: [] },
    ],
    'Grade 12': [
      { id: 'phy-12-1', title: 'Electric Charges and Fields', description: 'Coulomb’s law, Electric dipoles, Gauss’s law', topics: ['Electric Field', 'Gauss Law'] },
      { id: 'phy-12-2', title: 'Electrostatic Potential and Capacitance', description: 'Equipotential surfaces, Capacitors, Dielectrics', topics: ['Potential', 'Capacitors'] },
      { id: 'phy-12-3', title: 'Current Electricity', description: 'Ohm’s law, Kirchhoff’s rules, Wheatstone bridge', topics: ['Drift Velocity', 'Kirchhoff Laws'] },
      { id: 'phy-12-4', title: 'Moving Charges and Magnetism', description: 'Biot-Savart law, Ampere’s law, Cyclotron', topics: ['Lorentz Force', 'Torque on Loop'] },
      { id: 'phy-12-5', title: 'Magnetism and Matter', description: 'Magnetic dipole, Earth’s magnetism, Hysteresis', topics: ['Paramagnetism', 'Ferromagnetism'] },
      { id: 'phy-12-6', title: 'Electromagnetic Induction', description: 'Faraday’s law, Lenz’s law, Eddy currents', topics: ['Self & Mutual Induction'] },
      { id: 'phy-12-7', title: 'Alternating Current', description: 'LCR circuits, Resonance, Transformers', topics: ['AC Generators', 'Phasor Diagrams'] },
      { id: 'phy-12-8', title: 'Electromagnetic Waves', description: 'Displacement current, EM spectrum', topics: ['Maxwell Equations', 'EM Spectrum'] },
      { id: 'phy-12-9', title: 'Ray Optics and Optical Instruments', description: 'Reflection, Refraction, Lenses, Microscope & Telescope', topics: ['Prism', 'Optical Instruments'] },
      { id: 'phy-12-10', title: 'Wave Optics', description: 'Huygens principle, Interference, Young’s double slit, Diffraction', topics: ['Interference', 'Diffraction'] },
      { id: 'phy-12-11', title: 'Dual Nature of Radiation and Matter', description: 'Photoelectric effect, Einstein’s equation, de Broglie wavelength', topics: ['Photoelectric Effect', 'Matter Waves'] },
      { id: 'phy-12-12', title: 'Atoms', description: 'Rutherford scattering, Bohr model of Hydrogen atom', topics: ['Bohr Spectra', 'Energy Levels'] },
      { id: 'phy-12-13', title: 'Nuclei', description: 'Binding energy, Radioactivity, Nuclear fission & fusion', topics: ['Mass Defect', 'Nuclear Energy'] },
      { id: 'phy-12-14', title: 'Semiconductor Electronics', description: 'p-n junction diodes, Rectifiers, Logic gates', topics: ['Diodes', 'Semiconductors'] }
    ]
  },
  [SubjectType.CHEMISTRY]: {
    'Grade 11': [
      { id: 'chem-11-1', title: 'Some Basic Concepts of Chemistry', description: 'Mole concept, Stoichiometry', topics: [] },
      { id: 'chem-11-2', title: 'Structure of Atom', description: 'Quantum numbers, Orbitals', topics: [] },
      { id: 'chem-11-3', title: 'Classification of Elements and Periodicity', description: 'Periodic trends', topics: [] },
      { id: 'chem-11-4', title: 'Chemical Bonding and Molecular Structure', description: 'VSEPR, Hybridisation, MO theory', topics: [] },
      { id: 'chem-11-5', title: 'Thermodynamics', description: 'Enthalpy, Entropy, Gibbs Energy', topics: [] },
      { id: 'chem-11-6', title: 'Equilibrium', description: 'Chemical and Ionic Equilibrium', topics: [] },
      { id: 'chem-11-7', title: 'Redox Reactions', description: 'Oxidation numbers, Balancing', topics: [] },
      { id: 'chem-11-8', title: 'Organic Chemistry: Basic Principles', description: 'IUPAC, Isomerism, Electronic effects', topics: [] },
      { id: 'chem-11-9', title: 'Hydrocarbons', description: 'Alkanes, Alkenes, Alkynes, Aromatic', topics: [] },
    ],
    'Grade 12': [
      { id: 'chem-12-1', title: 'Solutions', description: 'Raoult’s law, Colligative properties, van \'t Hoff factor', topics: ['Henry Law', 'Osmotic Pressure'] },
      { id: 'chem-12-2', title: 'Electrochemistry', description: 'Nernst equation, Kohlrausch’s law, Batteries & Corrosion', topics: ['Conductance', 'Fuel Cells'] },
      { id: 'chem-12-3', title: 'Chemical Kinetics', description: 'Order of reaction, Arrhenius equation, Catalysis', topics: ['Rate Law', 'Activation Energy'] },
      { id: 'chem-12-4', title: 'The d- and f- Block Elements', description: 'Transition metals, Lanthanoids and Actinoids contraction', topics: ['Oxidation States', 'Potassium Permanganate'] },
      { id: 'chem-12-5', title: 'Coordination Compounds', description: 'Werner’s theory, IUPAC naming, Crystal Field Theory', topics: ['Isomerism', 'CFT'] },
      { id: 'chem-12-6', title: 'Haloalkanes and Haloarenes', description: 'SN1 and SN2 mechanisms, Organometallic compounds', topics: ['Nucleophilic Substitution'] },
      { id: 'chem-12-7', title: 'Alcohols, Phenols and Ethers', description: 'Preparation, Acidity of phenols, Kolbe & Reimer-Tiemann reactions', topics: ['Ethers', 'Phenol Reactions'] },
      { id: 'chem-12-8', title: 'Aldehydes, Ketones and Carboxylic Acids', description: 'Nucleophilic addition, Aldol condensation, Cannizzaro reaction', topics: ['Nucleophilic Addition', 'Carboxylic Acids'] },
      { id: 'chem-12-9', title: 'Amines', description: 'Basicity of amines, Diazonium salts, Hinsberg test', topics: ['Diazotisation', 'Basicity'] },
      { id: 'chem-12-10', title: 'Biomolecules', description: 'Carbohydrates, Proteins, Nucleic Acids (DNA & RNA), Vitamins', topics: ['Glucose Structure', 'Enzymes'] }
    ]
  },
  [SubjectType.MATH]: {
    'Grade 11': [
       { id: 'math-11-1', title: 'Sets', description: 'Set theory and operations', topics: [] },
       { id: 'math-11-2', title: 'Relations and Functions', description: 'Domain, Range, Function types', topics: [] },
       { id: 'math-11-3', title: 'Trigonometric Functions', description: 'Angles, Identities, Graphs', topics: [] },
       { id: 'math-11-4', title: 'Complex Numbers and Quadratic Equations', description: 'Argand plane, Roots', topics: [] },
       { id: 'math-11-5', title: 'Linear Inequalities', description: 'Algebraic solutions, Graphing', topics: [] },
       { id: 'math-11-6', title: 'Permutations and Combinations', description: 'Counting principles', topics: [] },
       { id: 'math-11-7', title: 'Binomial Theorem', description: 'Expansion of powers', topics: [] },
       { id: 'math-11-8', title: 'Sequence and Series', description: 'AP, GP, Special series', topics: [] },
       { id: 'math-11-9', title: 'Straight Lines', description: 'Slopes, Forms of lines', topics: [] },
       { id: 'math-11-10', title: 'Conic Sections', description: 'Circles, Parabola, Ellipse, Hyperbola', topics: [] },
       { id: 'math-11-11', title: 'Introduction to 3D Geometry', description: 'Coordinate axes and planes', topics: [] },
       { id: 'math-11-12', title: 'Limits and Derivatives', description: 'Calculus fundamentals', topics: [] },
       { id: 'math-11-13', title: 'Statistics', description: 'Mean, Variance, Standard Deviation', topics: [] },
       { id: 'math-11-14', title: 'Probability', description: 'Events, Axiomatic approach', topics: [] },
    ],
    'Grade 12': [
      { id: 'math-12-1', title: 'Relations and Functions', description: 'Types of relations, One-one and Onto functions', topics: ['Equivalence Relations', 'Composition'] },
      { id: 'math-12-2', title: 'Inverse Trigonometric Functions', description: 'Domain, Range, Principal values and Properties', topics: ['Principal Value Branches'] },
      { id: 'math-12-3', title: 'Matrices', description: 'Matrix operations, Transpose, Symmetric and Skew-symmetric', topics: ['Matrix Multiplication', 'Invertible Matrices'] },
      { id: 'math-12-4', title: 'Determinants', description: 'Properties, Minors, Cofactors, Adjoint and System of Linear Equations', topics: ['Inverse of Matrix', 'Cramer Rule'] },
      { id: 'math-12-5', title: 'Continuity and Differentiability', description: 'Chain rule, Implicit functions, Logarithmic differentiation', topics: ['Parametric Forms', 'Mean Value Theorem'] },
      { id: 'math-12-6', title: 'Application of Derivatives', description: 'Rate of change, Increasing/Decreasing, Maxima and Minima', topics: ['Tangents & Normals', 'Optimization'] },
      { id: 'math-12-7', title: 'Integrals', description: 'Indefinite & Definite integrals, Integration by parts & partial fractions', topics: ['Definite Integral Properties'] },
      { id: 'math-12-8', title: 'Applications of Integrals', description: 'Area under simple curves, Area between two curves', topics: ['Bounded Region Area'] },
      { id: 'math-12-9', title: 'Differential Equations', description: 'Order & Degree, Variable separable, Homogeneous & Linear differential equations', topics: ['Integrating Factor'] },
      { id: 'math-12-10', title: 'Vector Algebra', description: 'Dot product, Cross product, Projection of vectors', topics: ['Scalar & Vector Product'] },
      { id: 'math-12-11', title: 'Three Dimensional Geometry', description: 'Direction cosines, Line equations, Shortest distance between skew lines', topics: ['Line in 3D', 'Angle between Lines'] },
      { id: 'math-12-12', title: 'Linear Programming', description: 'Formulation, Graphical method, Feasible region & Optimization', topics: ['LPP Constraints'] },
      { id: 'math-12-13', title: 'Probability', description: 'Conditional probability, Multiplication theorem, Bayes’ theorem, Random variables', topics: ['Bayes Theorem', 'Independent Events'] }
    ]
  },
  [SubjectType.BIOLOGY]: {
    'Grade 11': [
      { id: 'bio-11-1', title: 'The Living World', description: 'Taxonomy and diversity', topics: [] },
      { id: 'bio-11-2', title: 'Biological Classification', description: 'Five kingdom classification', topics: [] },
      { id: 'bio-11-3', title: 'Plant Kingdom', description: 'Algae to Angiosperms', topics: [] },
      { id: 'bio-11-4', title: 'Animal Kingdom', description: 'Invertebrates and Vertebrates', topics: [] },
      { id: 'bio-11-5', title: 'Morphology of Flowering Plants', description: 'Root, Stem, Leaf, Flower', topics: [] },
      { id: 'bio-11-6', title: 'Anatomy of Flowering Plants', description: 'Tissues and internal structure', topics: [] },
      { id: 'bio-11-7', title: 'Structural Organisation in Animals', description: 'Animal tissues and morphology', topics: [] },
      { id: 'bio-11-8', title: 'Cell: The Unit of Life', description: 'Prokaryotic and Eukaryotic cells', topics: [] },
      { id: 'bio-11-9', title: 'Biomolecules', description: 'Proteins, Carbs, Enzymes', topics: [] },
      { id: 'bio-11-10', title: 'Cell Cycle and Cell Division', description: 'Mitosis and Meiosis', topics: [] },
      { id: 'bio-11-11', title: 'Photosynthesis in Higher Plants', description: 'Light and Dark reactions', topics: [] },
      { id: 'bio-11-12', title: 'Respiration in Plants', description: 'Glycolysis, Krebs cycle', topics: [] },
      { id: 'bio-11-13', title: 'Plant Growth and Development', description: 'Growth regulators', topics: [] },
      { id: 'bio-11-14', title: 'Breathing and Exchange of Gases', description: 'Respiratory system', topics: [] },
      { id: 'bio-11-15', title: 'Body Fluids and Circulation', description: 'Blood, Heart, Cardiac cycle', topics: [] },
      { id: 'bio-11-16', title: 'Excretory Products and their Elimination', description: 'Kidney function', topics: [] },
      { id: 'bio-11-17', title: 'Locomotion and Movement', description: 'Muscles and Skeletal system', topics: [] },
      { id: 'bio-11-18', title: 'Neural Control and Coordination', description: 'Nervous system, Eye, Ear', topics: [] },
      { id: 'bio-11-19', title: 'Chemical Coordination and Integration', description: 'Endocrine glands and Hormones', topics: [] },
    ],
    'Grade 12': [
      { id: 'bio-12-1', title: 'Sexual Reproduction in Flowering Plants', description: 'Flower structure, Pollination, Double fertilization, Seed development', topics: ['Microsporogenesis', 'Endosperm'] },
      { id: 'bio-12-2', title: 'Human Reproduction', description: 'Male & Female reproductive systems, Gametogenesis, Menstrual cycle, Embryo development', topics: ['Spermatogenesis', 'Placenta'] },
      { id: 'bio-12-3', title: 'Reproductive Health', description: 'Contraception, Contraceptive methods, ART (IVF, ZIFT), STDs', topics: ['Birth Control', 'Infertility'] },
      { id: 'bio-12-4', title: 'Principles of Inheritance and Variation', description: 'Mendelism, Sex determination, Genetic disorders (Pedigree analysis)', topics: ['Punnett Square', 'Linkage'] },
      { id: 'bio-12-5', title: 'Molecular Basis of Inheritance', description: 'DNA structure, Replication, Transcription, Translation, Human Genome Project', topics: ['Genetic Code', 'Lac Operon'] },
      { id: 'bio-12-6', title: 'Evolution', description: 'Origin of life, Evidence of evolution, Hardy-Weinberg principle, Human evolution', topics: ['Natural Selection', 'Adaptive Radiation'] },
      { id: 'bio-12-7', title: 'Human Health and Disease', description: 'Common diseases, Immunity, Vaccination, Cancer, AIDS, Drug abuse', topics: ['Innate & Acquired Immunity'] },
      { id: 'bio-12-8', title: 'Microbes in Human Welfare', description: 'Household products, Sewage treatment, Biocontrol agents, Biofertilizers', topics: ['STP', 'Biogas'] },
      { id: 'bio-12-9', title: 'Biotechnology: Principles and Processes', description: 'Recombinant DNA technology, Restriction enzymes, PCR, Vectors', topics: ['Gel Electrophoresis', 'Cloning'] },
      { id: 'bio-12-10', title: 'Biotechnology and its Applications', description: 'Bt Cotton, RNA interference, Gene therapy, Transgenic animals, Biopiracy', topics: ['Insulin Production', 'Biosafety'] },
      { id: 'bio-12-11', title: 'Organisms and Populations', description: 'Organisms and environment, Population attributes, Population interactions', topics: ['Mutualism', 'Competition'] },
      { id: 'bio-12-12', title: 'Ecosystem', description: 'Structure and function, Productivity, Decomposition, Energy flow, Ecological pyramids', topics: ['Trophic Levels', 'Food Web'] },
      { id: 'bio-12-13', title: 'Biodiversity and Conservation', description: 'Biodiversity patterns, Loss of biodiversity, In-situ & Ex-situ conservation', topics: ['Hotspots', 'National Parks'] }
    ]
  },
  [SubjectType.ACCOUNTANCY]: {
    'Grade 11': [
        { id: 'acc-11-1', title: 'Introduction to Accounting', description: 'Meaning, Objectives, Users', topics: [] },
        { id: 'acc-11-2', title: 'Theory Base of Accounting', description: 'Concepts, Standards, GST', topics: [] },
        { id: 'acc-11-3', title: 'Recording of Transactions - I', description: 'Vouchers, Journal, Ledger', topics: [] },
        { id: 'acc-11-4', title: 'Recording of Transactions - II', description: 'Cash Book, Purchases/Sales Book', topics: [] },
        { id: 'acc-11-5', title: 'Bank Reconciliation Statement', description: 'Matching passbook and cashbook', topics: [] },
        { id: 'acc-11-6', title: 'Trial Balance and Rectification of Errors', description: 'Detecting and correcting errors', topics: [] },
        { id: 'acc-11-7', title: 'Depreciation, Provisions and Reserves', description: 'Asset value reduction concepts', topics: [] },
        { id: 'acc-11-8', title: 'Financial Statements - I', description: 'Trading and P&L Account w/o adjustments', topics: [] },
        { id: 'acc-11-9', title: 'Financial Statements - II', description: 'Final accounts with adjustments', topics: [] },
        { id: 'acc-11-10', title: 'Accounts from Incomplete Records', description: 'Single entry system', topics: [] },
    ],
    'Grade 12': [
      { id: 'acc-12-1', title: 'Accounting for Partnership - Fundamentals', description: 'Partnership deed, Profit and Loss Appropriation Account, Interest on Capital & Drawings', topics: ['P&L Appropriation', 'Capital Accounts'] },
      { id: 'acc-12-2', title: 'Goodwill: Nature and Valuation', description: 'Average Profit method, Super Profit method, Capitalisation method', topics: ['Valuation Methods'] },
      { id: 'acc-12-3', title: 'Change in Profit Sharing Ratio', description: 'Sacrificing and Gaining ratio, Revaluation Account, Reserve adjustments', topics: ['Revaluation'] },
      { id: 'acc-12-4', title: 'Admission of a Partner', description: 'New profit sharing ratio, Treatment of goodwill, Adjustment of capitals', topics: ['Goodwill Adjustment'] },
      { id: 'acc-12-5', title: 'Retirement and Death of a Partner', description: 'Ascertainment of amount due, Executorship accounts, Settlement of dues', topics: ['Deceased Partner Share'] },
      { id: 'acc-12-6', title: 'Dissolution of a Partnership Firm', description: 'Realisation Account, Settlement of liabilities, Closing of accounts', topics: ['Realisation Account'] },
      { id: 'acc-12-7', title: 'Accounting for Share Capital', description: 'Issue of shares, Forfeiture & Reissue of shares, Pro-rata allotment', topics: ['Pro-Rata', 'Forfeiture'] },
      { id: 'acc-12-8', title: 'Accounting for Debentures', description: 'Issue of debentures with redemption terms, Discount on debentures', topics: ['Issue at Discount'] },
      { id: 'acc-12-9', title: 'Financial Statements of a Company', description: 'Balance Sheet & Statement of Profit and Loss as per Schedule III', topics: ['Schedule III'] },
      { id: 'acc-12-10', title: 'Financial Statement Analysis & Tools', description: 'Comparative & Common Size Statements', topics: ['Horizontal & Vertical Analysis'] },
      { id: 'acc-12-11', title: 'Accounting Ratios', description: 'Liquidity, Solvency, Activity, and Profitability ratios', topics: ['Current Ratio', 'ROCE'] },
      { id: 'acc-12-12', title: 'Cash Flow Statement', description: 'Operating, Investing, and Financing activities as per AS-3', topics: ['Indirect Method'] }
    ]
  },
  [SubjectType.BUSINESS_STUDIES]: {
      'Grade 11': [
          { id: 'bst-11-1', title: 'Nature and Purpose of Business', description: 'Economic activities, Risk', topics: [] },
          { id: 'bst-11-2', title: 'Forms of Business Organisations', description: 'Sole prop, Partnership, Company', topics: [] },
          { id: 'bst-11-3', title: 'Public, Private and Global Enterprises', description: 'Departmental, Statutory, MNCs', topics: [] },
          { id: 'bst-11-4', title: 'Business Services', description: 'Banking, Insurance, Communication', topics: [] },
          { id: 'bst-11-5', title: 'Emerging Modes of Business', description: 'E-business and Outsourcing', topics: [] },
          { id: 'bst-11-6', title: 'Social Responsibility and Business Ethics', description: 'Environment, Consumer protection', topics: [] },
          { id: 'bst-11-7', title: 'Sources of Business Finance', description: 'Equity, Debentures, Loans', topics: [] },
          { id: 'bst-11-8', title: 'Small Business and Enterprises', description: 'MSME, Entrepreneurship', topics: [] },
          { id: 'bst-11-9', title: 'Internal Trade', description: 'Wholesale and Retail trade', topics: [] },
          { id: 'bst-11-10', title: 'International Business', description: 'Import, Export, WTO', topics: [] },
      ],
      'Grade 12': [
        { id: 'bst-12-1', title: 'Nature and Significance of Management', description: 'Management characteristics, Objectives, Levels, Coordination', topics: ['Management Functions'] },
        { id: 'bst-12-2', title: 'Principles of Management', description: 'Fayol’s general principles, Taylor’s scientific management', topics: ['Fayol vs Taylor'] },
        { id: 'bst-12-3', title: 'Business Environment', description: 'Dimensions (PESTLE), LPG reforms, Impact of demonetisation', topics: ['Economic Environment'] },
        { id: 'bst-12-4', title: 'Planning', description: 'Planning process, Single-use & Standing plans', topics: ['Types of Plans'] },
        { id: 'bst-12-5', title: 'Organising', description: 'Organizational structure, Delegation, Decentralization', topics: ['Formal vs Informal'] },
        { id: 'bst-12-6', title: 'Staffing', description: 'Recruitment, Selection process, Training and Development', topics: ['On the job training'] },
        { id: 'bst-12-7', title: 'Directing', description: 'Supervision, Motivation (Maslow’s Hierarchy), Leadership styles, Communication', topics: ['Barriers to Communication'] },
        { id: 'bst-12-8', title: 'Controlling', description: 'Controlling process, Relationship with planning', topics: ['Critical Point Control'] },
        { id: 'bst-12-9', title: 'Financial Management', description: 'Capital structure, Financial decisions, Working capital factors', topics: ['Capital Budgeting'] },
        { id: 'bst-12-10', title: 'Financial Markets', description: 'Money market instruments, Capital market (Primary & Secondary), SEBI functions', topics: ['SEBI', 'NSE'] },
        { id: 'bst-12-11', title: 'Marketing Management', description: 'Marketing mix (4 Ps), Branding, Packaging, Labeling, Sales promotion', topics: ['Advertising', 'Channels'] },
        { id: 'bst-12-12', title: 'Consumer Protection', description: 'Consumer rights & responsibilities, Redressal agencies (COPRA 2019)', topics: ['District Forum', 'Rights'] }
      ]
  },
  [SubjectType.ECONOMICS]: {
      'Grade 11': [
          // Statistics
          { id: 'eco-11-1', title: 'Introduction to Statistics', description: 'Meaning and scope', topics: [] },
          { id: 'eco-11-2', title: 'Collection of Data', description: 'Primary/Secondary data, Census', topics: [] },
          { id: 'eco-11-3', title: 'Organisation of Data', description: 'Variables, Frequency distribution', topics: [] },
          { id: 'eco-11-4', title: 'Presentation of Data', description: 'Tables, Diagrams, Graphs', topics: [] },
          { id: 'eco-11-5', title: 'Measures of Central Tendency', description: 'Mean, Median, Mode', topics: [] },
          { id: 'eco-11-6', title: 'Correlation', description: 'Relationship between variables', topics: [] },
          { id: 'eco-11-7', title: 'Index Numbers', description: 'CPI, Inflation measurement', topics: [] },
          // Microeconomics
          { id: 'eco-11-8', title: 'Introduction to Microeconomics', description: 'PPC, Central problems', topics: [] },
          { id: 'eco-11-9', title: 'Consumer\'s Equilibrium and Demand', description: 'Utility, Indifference curve', topics: [] },
          { id: 'eco-11-10', title: 'Producer Behaviour and Supply', description: 'Cost, Revenue, Production', topics: [] },
          { id: 'eco-11-11', title: 'Forms of Market and Price Determination', description: 'Perfect competition', topics: [] },
      ],
      'Grade 12': [
        { id: 'eco-12-1', title: 'National Income Accounting and Related Aggregates', description: 'GDP, NDP, GNP, NNP at FC/MP, Circular flow of income, Calculation methods', topics: ['Value Added Method', 'Income Method'] },
        { id: 'eco-12-2', title: 'Money and Banking', description: 'Money supply (M1, M2), Commercial banks credit creation, Central Bank (RBI) functions', topics: ['Repo Rate', 'CRR/SLR'] },
        { id: 'eco-12-3', title: 'Determination of Income and Employment', description: 'Aggregate Demand & Supply, Propensity to consume/save, Investment multiplier', topics: ['Excess Demand', 'Multiplier'] },
        { id: 'eco-12-4', title: 'Government Budget and the Economy', description: 'Revenue & Capital budget, Revenue deficit, Fiscal deficit, Primary deficit', topics: ['Deficit Types'] },
        { id: 'eco-12-5', title: 'Balance of Payments & Foreign Exchange', description: 'Autonomous & Accommodating items, Foreign exchange rate determination', topics: ['Current Account', 'BoP'] },
        { id: 'eco-12-6', title: 'Indian Economy 1950-1990 & LPG Reforms 1991', description: 'Five Year Plans, Agriculture, Industry, Liberalisation, Privatisation, Globalisation', topics: ['LPG Policy', 'NITI Aayog'] },
        { id: 'eco-12-7', title: 'Human Capital Formation & Rural Development', description: 'Education & Health investment, Rural credit, Agricultural marketing, Organic farming', topics: ['NABARD', 'Human Capital'] },
        { id: 'eco-12-8', title: 'Employment & Sustainable Development', description: 'Formal/Informal sector employment, Environmental degradation, Sustainable growth', topics: ['Unemployment'] },
        { id: 'eco-12-9', title: 'Comparative Development Experiences', description: 'India, Pakistan, and China development indicators and economic paths', topics: ['Great Leap Forward', 'HDI'] }
      ]
  },
  [SubjectType.POLITICAL_SCIENCE]: {
      'Grade 11': [
          // Constitution at Work
          { id: 'pol-11-1', title: 'Constitution: Why and How?', description: 'Philosophy and making', topics: [] },
          { id: 'pol-11-2', title: 'Rights in the Indian Constitution', description: 'Fundamental Rights', topics: [] },
          { id: 'pol-11-3', title: 'Election and Representation', description: 'FPTP vs PR system', topics: [] },
          { id: 'pol-11-4', title: 'Executive', description: 'President, PM, Council', topics: [] },
          { id: 'pol-11-5', title: 'Legislature', description: 'Parliament, Law making', topics: [] },
          { id: 'pol-11-6', title: 'Judiciary', description: 'Supreme Court, Independence', topics: [] },
          { id: 'pol-11-7', title: 'Federalism', description: 'Centre-State relations', topics: [] },
          { id: 'pol-11-8', title: 'Local Governments', description: '73rd and 74th Amendments', topics: [] },
          // Political Theory
          { id: 'pol-11-9', title: 'Political Theory: An Introduction', description: 'Meaning and scope', topics: [] },
          { id: 'pol-11-10', title: 'Freedom', description: 'Liberty and constraints', topics: [] },
          { id: 'pol-11-11', title: 'Equality', description: 'Types and dimensions', topics: [] },
          { id: 'pol-11-12', title: 'Social Justice', description: 'Rawls theory, Distribution', topics: [] },
          { id: 'pol-11-13', title: 'Rights', description: 'Legal and Moral rights', topics: [] },
          { id: 'pol-11-14', title: 'Citizenship', description: 'Full and equal membership', topics: [] },
          { id: 'pol-11-15', title: 'Nationalism', description: 'Nation and state', topics: [] },
          { id: 'pol-11-16', title: 'Secularism', description: 'State and religion', topics: [] },
      ],
      'Grade 12': [
        { id: 'pol-12-1', title: 'The End of Bipolarity', description: 'Soviet system, Shock Therapy, Disintegration of USSR, Post-Communist regimes', topics: ['Fall of Berlin Wall', 'Gorbachev'] },
        { id: 'pol-12-2', title: 'Contemporary Centres of Power', description: 'European Union, ASEAN, China economic rise, Rise of Japan and South Korea', topics: ['EU', 'BRICS'] },
        { id: 'pol-12-3', title: 'Contemporary South Asia', description: 'Democracy in Pakistan and Bangladesh, Monarchy/Democracy in Nepal, Sri Lanka conflict', topics: ['SAARC', 'India-Pakistan'] },
        { id: 'pol-12-4', title: 'International Organizations', description: 'UN structure, Security Council reform, NGO agencies (Amnesty, Human Rights Watch)', topics: ['UNSC', 'IMF/World Bank'] },
        { id: 'pol-12-5', title: 'Security in the Contemporary World', description: 'Traditional vs Non-traditional security, Terrorism, Human rights, Global poverty', topics: ['Disarmament', 'Cyber Threat'] },
        { id: 'pol-12-6', title: 'Environment and Natural Resources', description: 'Global commons, Kyoto protocol, Earth Summit, Resource geopolitics', topics: ['Climate Change', 'Indigenous Rights'] },
        { id: 'pol-12-7', title: 'Globalisation', description: 'Economic, Cultural, Political consequences of Globalisation, Resistance movements', topics: ['WSF', 'Cultural Homogenisation'] },
        { id: 'pol-12-8', title: 'Challenges of Nation Building', description: 'Partition consequences, Integration of Princely States, Reorganisation of States', topics: ['Sardar Patel', 'Nehru Speech'] },
        { id: 'pol-12-9', title: 'Politics of Planned Development & External Relations', description: 'Planning Commission, Green Revolution, India’s Foreign Policy & NAM', topics: ['Non-Alignment', 'Panchsheel'] },
        { id: 'pol-12-10', title: 'Challenges to Congress System & Emergency', description: '1967 Elections, Congress Split, National Emergency 1975, Post-Emergency politics', topics: ['JP Movement', '1975 Emergency'] },
        { id: 'pol-12-11', title: 'Regional Aspirations & Recent Developments', description: 'Punjab crisis, Assam movement, Jammu & Kashmir, Coalition era, NDA governments', topics: ['Mandal Commission', 'Rise of BJP'] }
      ]
  },
  [SubjectType.HISTORY]: {
      'Grade 11': [
          { id: 'hist-11-1', title: 'Writing and City Life', description: 'Mesopotamia', topics: [] },
          { id: 'hist-11-2', title: 'An Empire Across Three Continents', description: 'Roman Empire', topics: [] },
          { id: 'hist-11-3', title: 'Nomadic Empires', description: 'The Mongols', topics: [] },
          { id: 'hist-11-4', title: 'The Three Orders', description: 'Western European Feudalism', topics: [] },
          { id: 'hist-11-5', title: 'Changing Cultural Traditions', description: 'The Renaissance', topics: [] },
          { id: 'hist-11-6', title: 'Displacing Indigenous Peoples', description: 'North America and Australia', topics: [] },
          { id: 'hist-11-7', title: 'Paths to Modernisation', description: 'Japan and China', topics: [] },
      ],
      'Grade 12': [
        { id: 'hist-12-1', title: 'Bricks, Beads and Bones', description: 'The Harappan Civilisation - Town planning, trade, craft production', topics: ['Mohenjodaro', 'Seals'] },
        { id: 'hist-12-2', title: 'Kings, Farmers and Towns', description: 'Early States & Economies (c.600 BCE - 600 CE) - Mauryan empire, Ashokan edicts', topics: ['Inscriptions', 'Mahajanapadas'] },
        { id: 'hist-12-3', title: 'Kingship, Caste and Class', description: 'Early Societies (c.600 BCE - 600 CE) - Mahabharata textual tradition, Kinship rules', topics: ['Varna System', 'Gender Rights'] },
        { id: 'hist-12-4', title: 'Thinkers, Beliefs and Buildings', description: 'Cultural Developments (c.600 BCE - 600 CE) - Buddhism, Jainism, Stupa architecture', topics: ['Sanchi Stupa', 'Buddha Teachings'] },
        { id: 'hist-12-5', title: 'Through the Eyes of Travellers', description: 'Perceptions of Society (10th - 17th Century) - Al-Biruni, Ibn Battuta, Bernier', topics: ['Travelogues', 'Sati System'] },
        { id: 'hist-12-6', title: 'Bhakti-Sufi Traditions', description: 'Changes in Religious Beliefs (8th - 18th Century) - Alvars, Nayanars, Kabir, Guru Nanak, Sufi Silsilas', topics: ['Devotional Poetry', 'Shrines'] },
        { id: 'hist-12-7', title: 'An Imperial Capital: Vijayanagara', description: 'Fourteenth to Sixteenth Century - Hampi ruins, Royal center, Mahanavami Dibba', topics: ['Krishnadevaraya', 'Hampi'] },
        { id: 'hist-12-8', title: 'Peasants, Zamindars and the State', description: 'Agrarian Society & Mughal Empire (16th - 17th Century) - Ain-i Akbari, Land revenue', topics: ['Panchayats', 'Mughal Revenue'] },
        { id: 'hist-12-9', title: 'Colonialism and The Countryside', description: 'Exploring Official Archives - Permanent Settlement, Santhals, Deccan Riots', topics: ['Zamindari', 'Fifth Report'] },
        { id: 'hist-12-10', title: 'Rebels and Raj', description: '1857 Revolt and its Representations - Leaders, Sepoy mutiny, Visual representations', topics: ['Mangal Pandey', 'Rani Lakshmibai'] },
        { id: 'hist-12-11', title: 'Mahatma Gandhi and the National Movement', description: 'Civil Disobedience and Beyond - Salt March, Quit India, Khilafat movement', topics: ['Non-Cooperation', 'Dandi March'] },
        { id: 'hist-12-12', title: 'Framing of the Constitution', description: 'The Beginning of a New Era - Constituent Assembly debates, Rights, Language debate', topics: ['Dr. B.R. Ambedkar', 'Drafting'] }
      ]
  },
  [SubjectType.CS]: {
      'Grade 11': [
          { id: 'cs-11-1', title: 'Computer Systems and Organisation', description: 'Hardware, OS, Boolean Logic', topics: [] },
          { id: 'cs-11-2', title: 'Computational Thinking and Programming - 1', description: 'Python Basics, Loops, Lists, Dicts', topics: [] },
          { id: 'cs-11-3', title: 'Society, Law and Ethics', description: 'Cyber safety, IP rights', topics: [] },
      ],
      'Grade 12': [
        { id: 'cs-12-1', title: 'Python Revision & Functions', description: 'Scope, Parameter passing, Recursion, File handling (Text, CSV, Binary)', topics: ['File I/O', 'Pickle Module'] },
        { id: 'cs-12-2', title: 'Data Structure - Stack', description: 'LIFO principle, Push/Pop operations using Python List', topics: ['Stack', 'LIFO'] },
        { id: 'cs-12-3', title: 'Computer Networks', description: 'Network devices, Routing, IP addressing, DNS, Protocol suite (TCP/IP)', topics: ['Protocols', 'IP Address'] },
        { id: 'cs-12-4', title: 'Database Management & SQL Connectivity', description: 'DDL/DML statements, Foreign keys, Python-MySQL connector interface', topics: ['MySQL Connector', 'Queries'] }
      ]
  },
  [SubjectType.IP]: {
      'Grade 11': [
          { id: 'ip-11-1', title: 'Introduction to Computer System', description: 'Hardware, Software, Memory', topics: [] },
          { id: 'ip-11-2', title: 'Introduction to Python', description: 'Control flow, Lists, Dictionaries', topics: [] },
          { id: 'ip-11-3', title: 'Database Concepts and the SQL', description: 'RDBMS, Simple Queries', topics: [] },
          { id: 'ip-11-4', title: 'Introduction to Emerging Trends', description: 'AI, Big Data, Cloud', topics: [] },
      ],
      'Grade 12': [
        { id: 'ip-12-1', title: 'Data Handling using Pandas - I & II', description: 'Series, DataFrame, Indexing, GroupBy, Sorting, Handling Missing Data', topics: ['DataFrame', 'GroupBy'] },
        { id: 'ip-12-2', title: 'Data Visualization with PyPlot', description: 'Line plot, Bar chart, Histogram, Customizing plots', topics: ['Matplotlib', 'Customization'] },
        { id: 'ip-12-3', title: 'Database Query using SQL', description: 'Math functions, String functions, Aggregate functions, GROUP BY, HAVING, Joins', topics: ['SQL Functions', 'Joins'] },
        { id: 'ip-12-4', title: 'Introduction to Computer Networks', description: 'Network types, Topologies, Devices, Web services, Cloud computing', topics: ['Topologies', 'HTTP/HTTPS'] },
        { id: 'ip-12-5', title: 'Societal Impacts & Data Protection', description: 'Digital footprint, Netiquettes, Cybercrime, IT Act, E-waste management', topics: ['Cyber Safety', 'IT Act'] }
      ]
  },
  [SubjectType.ENTREPRENEURSHIP]: {
      'Grade 11': [
          { id: 'ent-11-1', title: 'Entrepreneurship: Concept and Functions', description: 'Definitions and roles', topics: [] },
          { id: 'ent-11-2', title: 'An Entrepreneur', description: 'Qualities and types', topics: [] },
          { id: 'ent-11-3', title: 'Entrepreneurial Journey', description: 'Ideation to setup', topics: [] },
          { id: 'ent-11-4', title: 'Entrepreneurship as Innovation and Problem Solving', description: 'Creative process', topics: [] },
          { id: 'ent-11-5', title: 'Understanding the Market', description: 'Market research', topics: [] },
          { id: 'ent-11-6', title: 'Business Finance and Arithmetic', description: 'Cash flow, Unit cost', topics: [] },
          { id: 'ent-11-7', title: 'Resource Mobilization', description: 'Manpower, Material, Money', topics: [] },
      ],
      'Grade 12': [
        { id: 'ent-12-1', title: 'Entrepreneurial Opportunity', description: 'Sensing opportunity, Environment scanning, Problem identification', topics: ['Ideation', 'Trend Spotting'] },
        { id: 'ent-12-2', title: 'Entrepreneurial Planning', description: 'Business Plan components: Operational, Financial, Marketing plan', topics: ['Business Plan', 'Executive Summary'] },
        { id: 'ent-12-3', title: 'Enterprise Marketing', description: 'Marketing strategy, Brand positioning, Pricing methods, Distribution channels', topics: ['Sales Strategy', 'Promotions'] },
        { id: 'ent-12-4', title: 'Enterprise Growth Strategies', description: 'Franchising, Mergers & Acquisitions, Joint Ventures', topics: ['Scale Up', 'Acquisitions'] },
        { id: 'ent-12-5', title: 'Business Arithmetic', description: 'Unit cost, Break-Even Analysis, Cash Flow projection, Return on Investment', topics: ['BEP', 'Working Capital'] },
        { id: 'ent-12-6', title: 'Resource Mobilisation', description: 'Angel Investors, Venture Capital, Crowdfunding, Stock Market listing', topics: ['VC Funding', 'Debt vs Equity'] }
      ]
  },
  [SubjectType.PSYCHOLOGY]: {
      'Grade 11': [
          { id: 'psy-11-1', title: 'What is Psychology?', description: 'Evolution and fields', topics: [] },
          { id: 'psy-11-2', title: 'Methods of Enquiry in Psychology', description: 'Observation, Experiment', topics: [] },
          { id: 'psy-11-3', title: 'Human Development', description: 'Life span perspective', topics: [] },
          { id: 'psy-11-4', title: 'Sensory, Attentional and Perceptual Processes', description: 'Vision, Hearing, Attention', topics: [] },
          { id: 'psy-11-5', title: 'Learning', description: 'Conditioning, Observational', topics: [] },
          { id: 'psy-11-6', title: 'Human Memory', description: 'Encoding, Storage, Retrieval', topics: [] },
          { id: 'psy-11-7', title: 'Thinking', description: 'Problem solving, Reasoning', topics: [] },
          { id: 'psy-11-8', title: 'Motivation and Emotion', description: 'Needs, Physiological bases', topics: [] },
      ],
      'Grade 12': [
        { id: 'psy-12-1', title: 'Variations in Psychological Attributes', description: 'Individual differences, Theories of Intelligence, Assessment, Creativity', topics: ['IQ Tests', 'Multiple Intelligences'] },
        { id: 'psy-12-2', title: 'Self and Personality', description: 'Concept of Self, Psychodynamic, Humanistic, and Trait theories of Personality', topics: ['Freud', 'Big Five Traits'] },
        { id: 'psy-12-3', title: 'Meeting Life Challenges', description: 'Nature and sources of Stress, Coping mechanisms, Positive health', topics: ['GAS Model', 'Stress Management'] },
        { id: 'psy-12-4', title: 'Psychological Disorders', description: 'Concepts of abnormality, Anxiety, Mood, Schizophrenia, Neurodevelopmental disorders', topics: ['DSM-5', 'Phobias'] },
        { id: 'psy-12-5', title: 'Therapeutic Approaches', description: 'Psychotherapy, Behavior therapy, Cognitive Therapy (CBT), Humanistic therapy', topics: ['CBT', 'Systematic Desensitization'] },
        { id: 'psy-12-6', title: 'Attitude and Social Cognition', description: 'Attitude formation, Change, Prejudice, Impression formation, Pro-social behavior', topics: ['Cognitive Dissonance'] },
        { id: 'psy-12-7', title: 'Social Influence and Group Processes', description: 'Conformity, Compliance, Obedience, Group cohesion, Leadership', topics: ['Asch Experiment', 'Milgram'] }
      ]
  },
  [SubjectType.LEGAL_STUDIES]: {
      'Grade 11': [
          { id: 'law-11-1', title: 'Theory and Nature of Political Institutions', description: 'Organs of Govt', topics: [] },
          { id: 'law-11-2', title: 'Nature and Sources of Law', description: 'Jurisprudence', topics: [] },
          { id: 'law-11-3', title: 'Historical Evolution of Indian Legal System', description: 'Ancient to Modern', topics: [] },
          { id: 'law-11-4', title: 'Judiciary: Constitutional, Civil and Criminal', description: 'Court structure', topics: [] },
          { id: 'law-11-5', title: 'Family Justice System', description: 'Marriage, Divorce, Adoption', topics: [] },
      ],
      'Grade 12': [
        { id: 'law-12-1', title: 'Unit 1: Judiciary', description: 'Structure and hierarchy of courts, Judicial review, PIL, Appointments', topics: ['Supreme Court', 'PIL'] },
        { id: 'law-12-2', title: 'Unit 2: Alternative Dispute Resolution (ADR)', description: 'Arbitration, Conciliation, Mediation, Lok Adalats', topics: ['Lok Adalat', 'Arbitration Act'] },
        { id: 'law-12-3', title: 'Unit 3: Topics in Law I (Business Laws)', description: 'Law of Contract, Law of Torts, Law of Property, Intellectual Property Law', topics: ['Patents', 'Contract Act'] },
        { id: 'law-12-4', title: 'Unit 4: Topics in Law II (General Laws)', description: 'Law & Sustainable Development, Forms of Legal Entities, Criminal Laws in India', topics: ['IPC/CrPC', 'Environmental Law'] },
        { id: 'law-12-5', title: 'Unit 5: Concept of Human Rights', description: 'UDHR, Fundamental Rights vs Human Rights, NHRC functions', topics: ['NHRC', 'UDHR'] },
        { id: 'law-12-6', title: 'Unit 6: International Law', description: 'Sources of International Law, Treaties, ICJ, UN Security Council', topics: ['ICJ', 'Treaties'] },
        { id: 'law-12-7', title: 'Unit 7: Legal Profession in India', description: 'Bar Council of India, Legal education, Advocates Act, Ethics', topics: ['BCI', 'Advocates Act'] },
        { id: 'law-12-8', title: 'Unit 8: Legal Services', description: 'Free legal aid, NALSA, Legal Aid Clinics, Constitutional provisions', topics: ['NALSA', 'Article 39A'] }
      ]
  },
  [SubjectType.PHYSICAL_EDUCATION]: {
      'Grade 11': [
          { id: 'pe-11-1', title: 'Changing Trends & Career in Physical Education', description: 'Career options', topics: [] },
          { id: 'pe-11-2', title: 'Olympism', description: 'Olympic values', topics: [] },
          { id: 'pe-11-3', title: 'Yoga', description: 'Asanas and benefits', topics: [] },
          { id: 'pe-11-4', title: 'Physical Education & Sports for CWSN', description: 'Adaptive sports', topics: [] },
          { id: 'pe-11-5', title: 'Physical Fitness, Health and Wellness', description: 'Components of wellness', topics: [] },
          { id: 'pe-11-6', title: 'Test, Measurement & Evaluation', description: 'BMI, Somatotypes', topics: [] },
          { id: 'pe-11-7', title: 'Fundamentals of Anatomy, Physiology in Sports', description: 'Body systems', topics: [] },
          { id: 'pe-11-8', title: 'Fundamentals of Kinesiology and Biomechanics', description: 'Motion laws', topics: [] },
          { id: 'pe-11-9', title: 'Psychology & Sports', description: 'Motivation, Teamwork', topics: [] },
          { id: 'pe-11-10', title: 'Training and Doping in Sports', description: 'Principles of training', topics: [] },
      ],
      'Grade 12': [
        { id: 'pe-12-1', title: 'Management of Sporting Events', description: 'Functions of Sports Management, Committees, Tournament Fixtures (Knock-out, League, Combination)', topics: ['Fixtures', 'Intramurals'] },
        { id: 'pe-12-2', title: 'Children and Women in Sports', description: 'Exercise guidelines, Common postural deformities, Special consideration for women (Triad)', topics: ['Postural Fixes', 'Female Triad'] },
        { id: 'pe-12-3', title: 'Yoga as Preventive Measure for Lifestyle Diseases', description: 'Asanas for Obesity, Diabetes, Asthma, Hypertension, Back Pain', topics: ['Pranayama', 'Asanas'] },
        { id: 'pe-12-4', title: 'Physical Education & Sports for CWSN', description: 'Divyang sports, Disability etiquette, Role of assistive technology', topics: ['Adaptive Sports', 'Paralympics'] },
        { id: 'pe-12-5', title: 'Sports & Nutrition', description: 'Balanced diet, Macro and Micro nutrients, Nutritive & Non-nutritive components', topics: ['BMI', 'Food Myths'] },
        { id: 'pe-12-6', title: 'Test & Measurement in Sports', description: 'Fitness tests, Rikli & Jones Senior Citizen test, SAI Khelo India test', topics: ['Senior Fitness', 'Motor Fitness'] },
        { id: 'pe-12-7', title: 'Physiology & Injuries in Sports', description: 'Physiological factors determining fitness components, Soft tissue vs Bone injuries, First Aid', topics: ['PRICE Therapy', 'Lactic Acid'] },
        { id: 'pe-12-8', title: 'Biomechanics & Sports', description: 'Newton’s laws of motion applied to sports, Friction, Equilibrium, Projectile trajectory', topics: ['Projectile Motion', 'Friction'] },
        { id: 'pe-12-9', title: 'Psychology & Sports', description: 'Personality types (Big Five), Motivation techniques, Aggression in sports', topics: ['Self Esteem', 'Aggression'] },
        { id: 'pe-12-10', title: 'Training in Sports', description: 'Strength, Endurance, Speed, Flexibility, Coordinative abilities training methods', topics: ['Fartlek', 'Interval Training'] }
      ]
  },
  [SubjectType.COMMERCIAL_ARTS]: {
      'Grade 11': [
          { id: 'art-11-1', title: 'Pre-Historic Rock Paintings', description: 'Bhimbetka', topics: [] },
          { id: 'art-11-2', title: 'Arts of the Indus Valley', description: 'Harappan art', topics: [] },
          { id: 'art-11-3', title: 'Arts of the Mauryan Period', description: 'Lion Capital', topics: [] },
          { id: 'art-11-4', title: 'Post-Mauryan Trends', description: 'Stupas and Sculptures', topics: [] },
          { id: 'art-11-5', title: 'Later Mural Traditions', description: 'Ajanta Caves', topics: [] },
          { id: 'art-11-6', title: 'Temple Architecture and Sculpture', description: 'Nagara and Dravida', topics: [] },
          { id: 'art-11-7', title: 'Indian Bronzes', description: 'Chola Bronzes', topics: [] },
          { id: 'art-11-8', title: 'Indo-Islamic Architecture', description: 'Taj Mahal, Qutub Minar', topics: [] },
      ],
      'Grade 12': [
        { id: 'art-12-1', title: 'Manuscript Painting & Rajasthani School', description: 'Mewar, Bundi, Bikaner, Kishangarh (Bani Thani), Jaipur schools', topics: ['Bani Thani', 'Miniature Style'] },
        { id: 'art-12-2', title: 'Mughal School of Miniature Painting', description: 'Akbar, Jahangir, Shah Jahan periods; Akbar Nama, Falcon on perch', topics: ['Mughal Court Art'] },
        { id: 'art-12-3', title: 'Deccan & Pahari Schools of Painting', description: 'Basohli, Kangra, Ahmednagar, Bijapur painting characteristics', topics: ['Kangra Style', 'Deccan Colors'] },
        { id: 'art-12-4', title: 'Bengal School & Cultural Nationalism', description: 'Abanindranath Tagore, Nandalal Bose, Bharat Mata, Evolution of Indian Flag', topics: ['Bharat Mata', 'Flag Evolution'] },
        { id: 'art-12-5', title: 'Modern Trends in Indian Art', description: 'Sculptures, Graphics, Oil paintings by Raja Ravi Varma, Amrita Sher-Gil, MF Husain', topics: ['Modern Masters'] },
        { id: 'art-12-6', title: 'Indian Folk Art', description: 'Patachitra, Tanjore, Gond, Madhubani, Pichwai, Kalighat & Kalamkari styles', topics: ['Traditional Folk Art'] }
      ]
  },
  [SubjectType.APPLIED_MATH]: {
    'Grade 11': [
        { id: 'appmath-11-1', title: 'Numbers, Quantification and Numerical Applications', description: 'Binary, Logs', topics: [] },
        { id: 'appmath-11-2', title: 'Interpretation of Data', description: 'Charts and Graphs', topics: [] },
        { id: 'appmath-11-3', title: 'Mathematical Reasoning', description: 'Logic', topics: [] },
        { id: 'appmath-11-4', title: 'Calculus', description: 'Differentiation', topics: [] },
        { id: 'appmath-11-5', title: 'Probability', description: 'Basic concepts', topics: [] },
        { id: 'appmath-11-6', title: 'Descriptive Statistics', description: 'Central tendency', topics: [] },
        { id: 'appmath-11-7', title: 'Basics of Financial Mathematics', description: 'Interest, Annuity', topics: [] },
        { id: 'appmath-11-8', title: 'Coordinate Geometry', description: 'Straight lines, Circles', topics: [] },
    ],
    'Grade 12': [
      { id: 'appmath-12-1', title: 'Numbers, Quantification and Numerical Applications', description: 'Modulo arithmetic, Congruence, Allegation & Mixture, Boats & Streams', topics: ['Modulo Arithmetic', 'Streams'] },
      { id: 'appmath-12-2', title: 'Matrices and Determinants', description: 'Types of matrices, Determinants, Inverse matrix, Leontief Input-Output model', topics: ['Input Output Model'] },
      { id: 'appmath-12-3', title: 'Differentiation and Application of Derivatives', description: 'Higher order derivatives, Marginal cost, Marginal revenue, Optimization problems', topics: ['Cost Function', 'Elasticity'] },
      { id: 'appmath-12-4', title: 'Integrals and Differential Equations', description: 'Definite integrals, Consumer & Producer Surplus, Growth & Decay differential equations', topics: ['Consumer Surplus'] },
      { id: 'appmath-12-5', title: 'Probability Distributions', description: 'Poisson distribution, Normal distribution, Binomial distribution', topics: ['Normal Distribution'] },
      { id: 'appmath-12-6', title: 'Time-Based Data and Inferential Statistics', description: 'Time series components, Moving average, Hypothesis testing (t-test, Z-test)', topics: ['Time Series', 'Null Hypothesis'] },
      { id: 'appmath-12-7', title: 'Financial Mathematics', description: 'Perpetuity, Sinking funds, EMI calculation, Amortization schedule', topics: ['EMI Formula', 'Sinking Funds'] },
      { id: 'appmath-12-8', title: 'Returns, Growth and Depreciation', description: 'CAGR, Effective rate of return, Linear vs Reducing balance depreciation', topics: ['CAGR', 'Depreciation'] },
      { id: 'appmath-12-9', title: 'Linear Programming Problems', description: 'Formulation, Graphical solution, Feasible region for business decisions', topics: ['Optimization'] }
    ]
  }
};

export const MOCK_CONCEPT_NODES = [
  { id: '1', x: 50, y: 50, label: 'Kinematics', status: 'mastered', connections: ['2', '3'] },
  { id: '2', x: 250, y: 50, label: 'Forces', status: 'unlocked', connections: ['4'] },
  { id: '3', x: 50, y: 250, label: 'Energy', status: 'unlocked', connections: ['4'] },
  { id: '4', x: 250, y: 250, label: 'Momentum', status: 'locked', connections: ['5'] },
  { id: '5', x: 450, y: 150, label: 'Rotation', status: 'locked', connections: [] },
];
