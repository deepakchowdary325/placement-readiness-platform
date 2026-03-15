// src/lib/analyzer.js

export const CATEGORIES = {
    "Core CS": ["dsa", "oop", "dbms", "os", "networks", "data structures", "algorithms", "object oriented"],
    "Languages": ["java", "python", "javascript", "typescript", "c", "c++", "c#", "go", "ruby", "rust"],
    "Web": ["react", "next.js", "node.js", "express", "rest", "graphql", "html", "css", "vue", "angular", "django", "spring"],
    "Data": ["sql", "mongodb", "postgresql", "mysql", "redis", "nosql", "cassandra", "elasticsearch"],
    "Cloud/DevOps": ["aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "linux", "jenkins", "terraform"],
    "Testing": ["selenium", "cypress", "playwright", "junit", "pytest", "jest", "mocha"]
};

// Heuristic keyword mapping for targeted interview questions
const QUESTION_BANK = {
    "react": "Explain state management options in React, specifically Context API vs Redux.",
    "sql": "Explain indexing in databases and scenarios when it actually hurts performance.",
    "dsa": "How would you optimize search in a massively large set of sorted data?",
    "java": "Explain the difference between HashMap and ConcurrentHashMap in Java.",
    "python": "How does Python's Global Interpreter Lock (GIL) affect multi-threading?",
    "javascript": "Explain the event loop and how Promises are resolved compared to setTimeout.",
    "node.js": "How does Node.js handle asynchronous operations despite being single-threaded?",
    "aws": "Explain the difference between EC2 and Lambda, and when you would choose each.",
    "docker": "How do you minimize the size of a Docker image?",
    "kubernetes": "Explain the difference between a Deployment and a StatefulSet.",
    "mongodb": "When would you choose MongoDB over a traditional relational database?",
    "cypress": "How do you handle flaky tests in an end-to-end testing suite?",
    "oop": "Explain polymorphism and give a real-world example of how you'd structure it.",
    "default": "Describe a difficult technical bug you faced and how you resolved it."
};

/**
 * Extracts skills from JD text and groups them by category
 */
export const extractSkills = (jdText) => {
    if (!jdText) jdText = "";
    const text = jdText.toLowerCase();
    const extracted = {};
    let totalSkills = 0;

    Object.entries(CATEGORIES).forEach(([category, keywords]) => {
        const foundTags = new Set();
        keywords.forEach(keyword => {
            // Create a regex to match the keyword as whole words or specific tech names
            // escape regex special characters just in case, though keeping it simple here
            const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escaped}\\b`, 'i');

            if (regex.test(text)) {
                // format nicely (e.g., node.js -> Node.js, dsa -> DSA)
                let formatted = keyword;
                if (["dsa", "oop", "dbms", "os", "sql", "aws", "gcp", "ci/cd"].includes(keyword)) {
                    formatted = keyword.toUpperCase();
                } else {
                    formatted = keyword.charAt(0).toUpperCase() + keyword.slice(1);
                }
                foundTags.add(formatted);
            }
        });

        if (foundTags.size > 0) {
            extracted[category] = Array.from(foundTags);
            totalSkills += foundTags.size;
        }
    });

    if (totalSkills === 0) {
        return { "General": ["General fresher stack", "Aptitude", "Communication"] };
    }

    return extracted;
};

// Known large companies map
const ENTERPRISE_COMPANIES = [
    "amazon", "google", "meta", "facebook", "apple", "netflix", "microsoft",
    "tcs", "infosys", "wipro", "hcl", "cognizant", "accenture", "ibm", "oracle", "sap",
    "deloitte", "pwc", "kpmg", "ey", "capgemini", "tech mahindra"
];

/**
 * Heuristically determines company intel based on company name
 */
export const generateCompanyIntel = (companyName) => {
    if (!companyName || companyName.trim() === "") return null;

    const normalized = companyName.toLowerCase().trim();
    let isEnterprise = false;

    // Check if the input contains any of the known enterprise keywords
    for (const ent of ENTERPRISE_COMPANIES) {
        if (normalized.includes(ent)) {
            isEnterprise = true;
            break;
        }
    }

    if (isEnterprise) {
        return {
            name: companyName,
            industry: "Technology Services & Consulting",
            size: "Enterprise (2000+)",
            focus: "Structured DSA + core fundamentals"
        };
    } else {
        return {
            name: companyName,
            industry: "Technology Services / Product",
            size: "Startup (<200) / Mid-size",
            focus: "Practical problem solving + stack depth"
        };
    }
};

/**
 * Returns a score between 0 and 100 based on the inputs
 */
export const calculateReadiness = (extractedCategories, company, role, jdText) => {
    let score = 35; // base

    const categoryCount = Object.keys(extractedCategories).filter(k => k !== "General").length;
    score += Math.min(categoryCount * 5, 30); // +5 per category (max 30)

    if (company && company.trim().length > 0) score += 10;
    if (role && role.trim().length > 0) score += 10;
    if (jdText && jdText.trim().length > 800) score += 10;

    return Math.min(score, 100);
};

/**
 * Generates a template-based round checklist adapting to the skills and company size
 */
export const generateChecklist = (extracted, companyIntel) => {
    // Check what categories are present
    const hasWeb = !!extracted["Web"];
    const hasData = !!extracted["Data"];
    const hasCloud = !!extracted["Cloud/DevOps"];
    const hasDSA = !!extracted["Core CS"] && extracted["Core CS"].includes("DSA");

    const isEnterprise = companyIntel && companyIntel.size.includes("Enterprise");

    if (isEnterprise) {
        return [
            {
                title: "Round 1: Online Assessment",
                why: "Enterprise companies strictly filter via automated coding rounds.",
                items: [
                    "Practice solving 2 Medium DSA problems in 45 mins",
                    "Take 2 full-length timed aptitude mock tests",
                    "Review quantitative and logical reasoning patterns"
                ]
            },
            {
                title: "Round 2: Technical Interview (DSA focus)",
                why: "They prioritize algorithm optimization and standard patterns over specific framework knowledge.",
                items: [
                    "Practice explaining code complexity (Time and Space)",
                    "Master sliding window, two-pointer, and tree traversal algorithms",
                    "Brush up on string manipulation and array operations on a whiteboard"
                ]
            },
            {
                title: "Round 3: Core CS + System Design",
                why: "Testing foundational computer science knowledge required for massive scale.",
                items: [
                    "Review Object-Oriented Programming (OOP) core pillars",
                    "Brush up on DBMS concepts (Normal forms, basic queries)",
                    "Review Operating System fundamentals (Threads, Processes, Deadlocks)"
                ]
            },
            {
                title: "Round 4: HR / Managerial",
                why: "Ensuring you fit within massive team structures and global policies.",
                items: [
                    "Prepare behavioral STAR responses for conflict resolution",
                    "Research the company's global leadership principles",
                    "Draft answers for 'Why do you want to join a large enterprise like ours?'"
                ]
            }
        ];
    } else {
        // Startup / Mid-size or default flow
        return [
            {
                title: "Round 1: Practical Coding Task",
                why: "Startups need you to build things immediately, favoring practical stack knowledge over theoretical algorithms.",
                items: [
                    hasWeb ? "Build a small full-stack component (e.g., Todo app) under time pressure" : "Solve applied logic problems prioritizing clean code",
                    hasData ? "Practice writing complex SQL joins and API integrations" : "Practice modularizing functions for readability",
                    "Ensure your GitHub projects are actively running and documented"
                ]
            },
            {
                title: "Round 2: Architecture & System Discussion",
                why: "You'll likely own features end-to-end, requiring broader system awareness.",
                items: [
                    "Prepare a 2-minute pitch explaining your best project's architecture",
                    hasCloud ? "Review Docker containerization and CI/CD pipelines" : "Review general system deployment constraints",
                    "Discuss trade-offs you made in past technical decisions"
                ]
            },
            {
                title: "Round 3: Founder / Culture Fit",
                why: "In small teams, culture alignment and agility are paramount.",
                items: [
                    "Research the specific product the startup is building",
                    "Prepare for open-ended questions about handling ambiguity",
                    "Draft 3 thoughtful questions about the startup's runway, roadmap, or market fit"
                ]
            }
        ];
    }
};

/**
 * Generates a dynamic 7-day study plan
 */
export const generatePlan = (extracted) => {
    const hasWeb = !!extracted["Web"];
    const hasData = !!extracted["Data"];

    return [
        { day: "Day 1", title: "Basics + Core CS", desc: "Revise OOPS, OS, DBMS fundamentals. Start with array and string DSA problems." },
        { day: "Day 2", title: "Core CS Continuation", desc: "Deep dive into DBMS queries, Normalization. Practice Linked Lists and Stacks." },
        { day: "Day 3", title: "DSA + Coding Practice", desc: "Focus on Trees, Graphs, and standard algorithms. Take a timed coding test." },
        { day: "Day 4", title: "Advanced Problem Solving", desc: "Practice Dynamic Programming and greedy algorithms patterns." },
        { day: "Day 5", title: "Project + Resume Alignment", desc: `Align your project explanations with JD requirements. ${hasWeb ? 'Revise Web frameworks mentioned.' : ''}` },
        { day: "Day 6", title: "Mock Interview Questions", desc: `Practice speaking answers out loud. ${hasData ? 'Review database optimization and indexing.' : 'Review core language concepts.'}` },
        { day: "Day 7", title: "Revision + Weak Areas", desc: "Light revision of formulas, behavioral STAR stories, and company research." },
    ];
};

/**
 * Generates 10 specific interview questions based on extracted skills
 */
export const generateQuestions = (extracted) => {
    const questions = [];
    const allSkillsRaw = [];

    // flatten skills
    Object.values(extracted).forEach(arr => {
        arr.forEach(s => allSkillsRaw.push(s.toLowerCase()));
    });

    // pick tailored questions if available
    allSkillsRaw.forEach(skill => {
        if (QUESTION_BANK[skill] && questions.length < 5) {
            if (!questions.includes(QUESTION_BANK[skill])) {
                questions.push(QUESTION_BANK[skill]);
            }
        }
    });

    // pad with generic but good questions
    const genericQuestions = [
        "What is the most complex architecture you've designed or worked with?",
        "Explain how you ensure code quality and maintainability in your team.",
        "Describe a situation where you disagreed with a technical decision.",
        "Walk me through how an HTTPS connection is established.",
        "How do you handle performance bottlenecks in an application?",
        "Explain the concept of Dependency Injection and its benefits.",
        "What is your approach to testing? Explain Unit vs Integration.",
        "How do you keep up with new technology trends?",
        "Describe the process you follow when debugging a critical production issue.",
        "Can you explain the SOLID principles with examples?",
        "How does Garbage Collection work conceptually?"
    ];

    let i = 0;
    while (questions.length < 10 && i < genericQuestions.length) {
        if (!questions.includes(genericQuestions[i])) {
            questions.push(genericQuestions[i]);
        }
        i++;
    }

    // Shuffle slightly just so it's not always identical identical order if repeating
    return questions.sort(() => 0.5 - Math.random());
};
