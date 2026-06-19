// --- Core Application State Store ---
let currentView = 'home';
let currentTheme = 'light';
let builderFontSize = 13;
let selectedAccentColor = '#6366f1';
let selectedTemplate = 'sidebar';
let selectedFontClass = 'font-sans';
let geminiApiKey = sessionStorage.getItem('gemini_api_key') || '';

// Pre-populating default resume data for Aaditya Kandpal
let resumeData = {
    personal: {
        name: "Aaditya Kandpal",
        title: "Senior Solutions Architect & SDE",
        email: "aaditya.kandpal@gmail.com",
        phone: "+91 98765 43210",
        location: "New Delhi, India",
        website: "https://aadityakandpal.dev",
        summary: "Results-driven Cloud Architect and software engineer with 8+ years designing microservices paradigms and reactive Web engines. Adept at high performance system architectures and clean modern coding styles."
    },
    experience: [
        {
            id: 1,
            role: "Lead Platform Architect",
            company: "AuraCloud Enterprises",
            duration: "2023 - Present",
            highlights: "Designed microservices pipeline managing 4M daily triggers; cut resource overhead by 42% utilizing Node clustering and advanced system optimization parameters."
        },
        {
            id: 2,
            role: "Senior Fullstack Engineer",
            company: "NexaLabs Technologies",
            duration: "2020 - 2023",
            highlights: "Engineered ultra low latency state engines reducing client fetch speeds by 150ms. Oversaw automated deployment cycles on AWS."
        }
    ],
    education: [
        {
            id: 1,
            degree: "B.Tech in Computer Science & Engineering",
            institution: "Indian Institute of Technology",
            duration: "2016 - 2020"
        }
    ],
    skills: "React, Next.js, Node.js, Webpack, Amazon Web Services, Docker, System Architecture, Performance Tuning, CI/CD Pipelines",
    certs: "AWS Certified Solutions Architect Pro, Google Cloud DevOps Expert, Hackathon First Place 2024",
    github: "https://github.com/aadityakandpal",
    linkedin: "https://linkedin.com/in/aadityakandpal",
    projects: [
        {
            id: 1,
            title: "AeroCV Engine Core",
            desc: "Developed a client-side reactive PDF parsing compilation engine using pure Tailwind hooks and raw DOM layouts."
        },
        {
            id: 2,
            title: "Distributed Ledger Cache",
            desc: "Engineered zero-latency state synchronization mechanisms matching 10,000 requests/sec with AWS ECS clusters."
        }
    ]
};

// Pre-populating default tracker data
let jobApplications = [
    { id: 1, title: "Senior Solutions Architect", company: "Google Cloud Labs", salary: "$190,000 / yr", status: "wishlist", date: "2026-07-01", notes: "Targeting internal systems engineering group. Leverage cloud architecture background." },
    { id: 2, title: "Principal DevOps Architect", company: "Netflix Systems", salary: "$220,000 / yr", status: "applied", date: "2026-06-20", notes: "Requires high-performance cache structures knowledge." },
    { id: 3, title: "Lead SDE Cloud Specialist", company: "Meta Tech", salary: "$205,000 / yr", status: "interview", date: "2026-06-18", notes: "First technical round next Wednesday. Focus on distributed computing systems." },
    { id: 4, title: "Solutions Architect Manager", company: "Atlassian Enterprise", salary: "$180,000 / yr", status: "offer", date: "2026-06-12", notes: "Received formal letter. Negotiating relocation details." },
    { id: 5, title: "Staff Infrastructure Engineer", company: "Uber Systems", salary: "$210,000 / yr", status: "wishlist", date: "2026-07-15", notes: "Prepare system architecture highlights document beforehand." }
];

// --- View Switching Engines ---
function switchView(viewName) {
    document.querySelectorAll('.view-panel').forEach(panel => {
        panel.classList.add('hidden');
    });
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
        targetView.classList.remove('hidden');
        currentView = viewName;
    }
    document.querySelectorAll('.nav-tab').forEach(tab => {
        const target = tab.getAttribute('data-target');
        if (target === viewName) {
            tab.className = "nav-tab px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 bg-premium-accent text-white";
        } else {
            tab.className = "nav-tab px-4 py-2 rounded-xl text-sm font-semibold text-premium-600 dark:text-premium-300 hover:text-premium-900 dark:hover:text-white transition-all duration-300";
        }
    });
    if (viewName === 'builder') {
        syncResumePreview();
    } else if (viewName === 'coverletter') {
        syncCoverLetterPreview();
    } else if (viewName === 'tracker') {
        renderTrackerBoard();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToElement(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function toggleDarkMode() {
    const html = document.documentElement;
    const icon = document.getElementById('theme-icon');
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        icon.className = "fa-solid fa-moon text-premium-600 dark:text-premium-400";
        currentTheme = 'light';
    } else {
        html.classList.add('dark');
        icon.className = "fa-solid fa-sun text-yellow-400";
        currentTheme = 'dark';
    }
}

function toggleMobileNav() {
    const mobileNav = document.getElementById('mobile-nav');
    const icon = document.getElementById('mobile-nav-icon');
    if (mobileNav.classList.contains('hidden')) {
        mobileNav.classList.remove('hidden');
        icon.className = "fa-solid fa-xmark text-premium-700 dark:text-premium-300";
    } else {
        mobileNav.classList.add('hidden');
        icon.className = "fa-solid fa-bars text-premium-700 dark:text-premium-300";
    }
}

function toggleAccordion(id) {
    const content = document.getElementById(id);
    const icon = document.getElementById(`${id}-icon`);
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.classList.add('rotate-180');
    } else {
        content.classList.add('hidden');
        icon.classList.remove('rotate-180');
    }
}

function loadExperienceEditorRows() {
    const container = document.getElementById('experience-rows-container');
    container.innerHTML = '';
    resumeData.experience.forEach((exp) => {
        const row = document.createElement('div');
        row.className = "p-4 bg-premium-100/40 dark:bg-premium-900/40 border border-premium-200/50 dark:border-premium-700/50 rounded-2xl space-y-3 relative";
        row.innerHTML = `
            <button onclick="removeExperienceRow(${exp.id})" class="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xs"><i class="fa-solid fa-trash"></i></button>
            <div class="grid grid-cols-2 gap-3 text-xs">
                <div class="space-y-1">
                    <label class="font-bold">Role Title</label>
                    <input type="text" onkeyup="updateExperienceField(${exp.id}, 'role', this.value)" class="w-full p-2 bg-white dark:bg-premium-800 border border-premium-200 dark:border-premium-700 rounded-lg" value="${exp.role}">
                </div>
                <div class="space-y-1">
                    <label class="font-bold">Company</label>
                    <input type="text" onkeyup="updateExperienceField(${exp.id}, 'company', this.value)" class="w-full p-2 bg-white dark:bg-premium-800 border border-premium-200 dark:border-premium-700 rounded-lg" value="${exp.company}">
                </div>
                <div class="space-y-1 col-span-2">
                    <label class="font-bold">Duration / Timeline</label>
                    <input type="text" onkeyup="updateExperienceField(${exp.id}, 'duration', this.value)" class="w-full p-2 bg-white dark:bg-premium-800 border border-premium-200 dark:border-premium-700 rounded-lg" value="${exp.duration}">
                </div>
                <div class="space-y-1 col-span-2">
                    <div class="flex items-center justify-between">
                        <label class="font-bold">Key Deliverables (ATS Optimized)</label>
                        <button onclick="aiOptimizeField('highlights', 'exp-highlights-${exp.id}', ${exp.id})" class="text-[9px] text-teal-600 font-bold"><i class="fa-solid fa-brain mr-1"></i> Optimize Bullet</button>
                    </div>
                    <textarea id="exp-highlights-${exp.id}" onkeyup="updateExperienceField(${exp.id}, 'highlights', this.value)" class="w-full p-2 bg-white dark:bg-premium-800 border border-premium-200 dark:border-premium-700 rounded-lg h-16 resize-none">${exp.highlights}</textarea>
                </div>
            </div>
        `;
        container.appendChild(row);
    });
}

function addExperienceRow() {
    const nextId = resumeData.experience.length ? Math.max(...resumeData.experience.map(e => e.id)) + 1 : 1;
    resumeData.experience.push({
        id: nextId,
        role: "New Position Role",
        company: "Global SDE Inc.",
        duration: "2025 - Present",
        highlights: "Spearheaded technical cloud integration processes driving optimized business workflows across standard microservices components."
    });
    loadExperienceEditorRows();
    syncResumePreview();
}

function removeExperienceRow(id) {
    resumeData.experience = resumeData.experience.filter(e => e.id !== id);
    loadExperienceEditorRows();
    syncResumePreview();
}

function updateExperienceField(id, key, val) {
    const item = resumeData.experience.find(e => e.id === id);
    if (item) {
        item[key] = val;
        syncResumePreview();
    }
}

function loadEducationEditorRows() {
    const container = document.getElementById('education-rows-container');
    container.innerHTML = '';
    resumeData.education.forEach((edu) => {
        const row = document.createElement('div');
        row.className = "p-4 bg-premium-100/40 dark:bg-premium-900/40 border border-premium-200/50 dark:border-premium-700/50 rounded-2xl space-y-3 relative";
        row.innerHTML = `
            <button onclick="removeEducationRow(${edu.id})" class="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xs"><i class="fa-solid fa-trash"></i></button>
            <div class="grid grid-cols-2 gap-3 text-xs">
                <div class="space-y-1">
                    <label class="font-bold">Degree / Program</label>
                    <input type="text" onkeyup="updateEducationField(${edu.id}, 'degree', this.value)" class="w-full p-2 bg-white dark:bg-premium-800 border border-premium-200 dark:border-premium-700 rounded-lg" value="${edu.degree}">
                </div>
                <div class="space-y-1">
                    <label class="font-bold">Institution Name</label>
                    <input type="text" onkeyup="updateEducationField(${edu.id}, 'institution', this.value)" class="w-full p-2 bg-white dark:bg-premium-800 border border-premium-200 dark:border-premium-700 rounded-lg" value="${edu.institution}">
                </div>
                <div class="space-y-1 col-span-2">
                    <label class="font-bold">Duration / Year of Graduation</label>
                    <input type="text" onkeyup="updateEducationField(${edu.id}, 'duration', this.value)" class="w-full p-2 bg-white dark:bg-premium-800 border border-premium-200 dark:border-premium-700 rounded-lg" value="${edu.duration}">
                </div>
            </div>
        `;
        container.appendChild(row);
    });
}

function addEducationRow() {
    const nextId = resumeData.education.length ? Math.max(...resumeData.education.map(e => e.id)) + 1 : 1;
    resumeData.education.push({
        id: nextId,
        degree: "Master of Science in Distributed Networks",
        institution: "Stanford Tech Institute",
        duration: "2020 - 2022"
    });
    loadEducationEditorRows();
    syncResumePreview();
}

function removeEducationRow(id) {
    resumeData.education = resumeData.education.filter(e => e.id !== id);
    loadEducationEditorRows();
    syncResumePreview();
}

function updateEducationField(id, key, val) {
    const item = resumeData.education.find(e => e.id === id);
    if (item) {
        item[key] = val;
        syncResumePreview();
    }
}

function loadProjectEditorRows() {
    const container = document.getElementById('project-rows-container');
    container.innerHTML = '';
    resumeData.projects.forEach((proj) => {
        const row = document.createElement('div');
        row.className = "p-4 bg-premium-100/40 dark:bg-premium-900/40 border border-premium-200/50 dark:border-premium-700/50 rounded-2xl space-y-3 relative";
        row.innerHTML = `
            <button onclick="removeProjectRow(${proj.id})" class="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xs"><i class="fa-solid fa-trash"></i></button>
            <div class="grid grid-cols-1 gap-3 text-xs">
                <div class="space-y-1">
                    <label class="font-bold">Project Name</label>
                    <input type="text" onkeyup="updateProjectField(${proj.id}, 'title', this.value)" class="w-full p-2 bg-white dark:bg-premium-800 border border-premium-200 dark:border-premium-700 rounded-lg" value="${proj.title}">
                </div>
                <div class="space-y-1">
                    <label class="font-bold">Project Description</label>
                    <textarea onkeyup="updateProjectField(${proj.id}, 'desc', this.value)" class="w-full p-2 bg-white dark:bg-premium-800 border border-premium-200 dark:border-premium-700 rounded-lg h-16 resize-none">${proj.desc}</textarea>
                </div>
            </div>
        `;
        container.appendChild(row);
    });
}

function addProjectRow() {
    const nextId = resumeData.projects.length ? Math.max(...resumeData.projects.map(e => e.id)) + 1 : 1;
    resumeData.projects.push({
        id: nextId,
        title: "Decentralized SDE Toolchain",
        desc: "Engineered localized cloud parsers in rust with absolute WebAssembly deployment targets."
    });
    loadProjectEditorRows();
    syncResumePreview();
}

function removeProjectRow(id) {
    resumeData.projects = resumeData.projects.filter(p => p.id !== id);
    loadProjectEditorRows();
    syncResumePreview();
}

function updateProjectField(id, key, val) {
    const item = resumeData.projects.find(p => p.id === id);
    if (item) {
        item[key] = val;
        syncResumePreview();
    }
}

function switchEditorTab(tabName) {
    document.querySelectorAll('.editor-panel-section').forEach(panel => {
        panel.classList.add('hidden');
    });
    document.getElementById(`panel-${tabName}`).classList.remove('hidden');
    document.querySelectorAll('.editor-tab-btn').forEach(btn => {
        const target = btn.getAttribute('data-tab');
        if (target === tabName) {
            btn.className = "editor-tab-btn px-3 py-1.5 bg-premium-accent text-white rounded-lg text-xs font-bold shrink-0";
        } else {
            btn.className = "editor-tab-btn px-3 py-1.5 bg-premium-100 dark:bg-premium-800 text-premium-700 dark:text-premium-300 rounded-lg text-xs font-bold shrink-0";
        }
    });
}

function syncResumePreview() {
    resumeData.personal.name = document.getElementById('cv-name').value;
    resumeData.personal.title = document.getElementById('cv-title').value;
    resumeData.personal.email = document.getElementById('cv-email').value;
    resumeData.personal.phone = document.getElementById('cv-phone').value;
    resumeData.personal.location = document.getElementById('cv-location').value;
    resumeData.personal.website = document.getElementById('cv-website').value;
    resumeData.personal.summary = document.getElementById('cv-summary').value;
    resumeData.skills = document.getElementById('cv-skills').value;
    resumeData.certs = document.getElementById('cv-certs').value;
    resumeData.github = document.getElementById('cv-github').value;
    resumeData.linkedin = document.getElementById('cv-linkedin').value;
    applyTemplateLayout();
}

function updateAccentColor(color) {
    selectedAccentColor = color;
    document.getElementById('accent-hex-label').innerText = color.toUpperCase();
    applyTemplateLayout();
}

function updateBuilderFont(fontClass) {
    selectedFontClass = fontClass;
    applyTemplateLayout();
}

function changeFontSize(amount) {
    builderFontSize = Math.max(10, Math.min(18, builderFontSize + amount));
    document.getElementById('font-size-indicator').innerText = `${builderFontSize}px`;
    applyTemplateLayout();
}

function applyTemplateLayout() {
    const canvas = document.getElementById('canvas-inner-content');
    canvas.className = `w-full h-full flex flex-col justify-between ${selectedFontClass}`;
    canvas.style.fontSize = `${builderFontSize}px`;
    const name = resumeData.personal.name || 'Aaditya Kandpal';
    const title = resumeData.personal.title || 'Senior Software Architect';
    const email = resumeData.personal.email || 'hello@aerocv.dev';
    const phone = resumeData.personal.phone || '+1234567890';
    const location = resumeData.personal.location || 'San Francisco, USA';
    const website = resumeData.personal.website || 'https://aerocv.dev';
    const summary = resumeData.personal.summary || '';
    const skills = resumeData.skills.split(',').map(s => s.trim()).filter(Boolean);
    const certs = resumeData.certs.split(',').map(c => c.trim()).filter(Boolean);
    const github = resumeData.github;
    const linkedin = resumeData.linkedin;
    let expHtml = '';
    resumeData.experience.forEach(exp => {
        expHtml += `
            <div class="space-y-1">
                <div class="flex justify-between items-start font-bold text-slate-800">
                    <div>${exp.role} <span class="text-slate-400 font-normal">at</span> ${exp.company}</div>
                    <span class="text-slate-500 font-mono text-[10px] whitespace-nowrap">${exp.duration}</span>
                </div>
                <p class="text-slate-600 leading-relaxed text-[11px]">${exp.highlights}</p>
            </div>
        `;
    });
    let eduHtml = '';
    resumeData.education.forEach(edu => {
        eduHtml += `
            <div class="space-y-0.5">
                <div class="flex justify-between items-start font-bold text-slate-800">
                    <div>${edu.degree}</div>
                    <span class="text-slate-500 font-mono text-[10px] whitespace-nowrap">${edu.duration}</span>
                </div>
                <p class="text-slate-500 text-[10px]">${edu.institution}</p>
            </div>
        `;
    });
    let projHtml = '';
    resumeData.projects.forEach(proj => {
        projHtml += `
            <div class="space-y-0.5">
                <div class="font-bold text-slate-800">${proj.title}</div>
                <p class="text-slate-600 text-[10px] leading-relaxed">${proj.desc}</p>
            </div>
        `;
    });
    selectedTemplate = document.getElementById('builder-template-select').value;
    if (selectedTemplate === 'sidebar') {
        canvas.innerHTML = `
            <div class="grid grid-cols-12 gap-6 h-full text-slate-800">
                <div class="col-span-4 bg-slate-50 p-4 rounded-2xl flex flex-col justify-between border border-slate-100">
                    <div class="space-y-6">
                        <div class="space-y-1">
                            <h1 class="text-lg font-black tracking-tight leading-none text-slate-900">${name}</h1>
                            <p class="text-[10px] font-bold uppercase tracking-wider" style="color: ${selectedAccentColor}">${title}</p>
                        </div>
                        <div class="space-y-2 text-[10px] text-slate-600">
                            <div class="font-bold uppercase text-[9px] tracking-wider text-slate-400">Contact</div>
                            <p><i class="fa-solid fa-envelope mr-1.5" style="color: ${selectedAccentColor}"></i> ${email}</p>
                            <p><i class="fa-solid fa-phone mr-1.5" style="color: ${selectedAccentColor}"></i> ${phone}</p>
                            <p><i class="fa-solid fa-location-dot mr-1.5" style="color: ${selectedAccentColor}"></i> ${location}</p>
                            <p class="truncate"><i class="fa-solid fa-globe mr-1.5" style="color: ${selectedAccentColor}"></i> ${website}</p>
                        </div>
                        <div class="space-y-2">
                            <div class="font-bold uppercase text-[9px] tracking-wider text-slate-400">Core Expertise</div>
                            <div class="flex flex-wrap gap-1">
                                ${skills.map(s => `<span class="px-2 py-0.5 bg-slate-200/60 rounded text-[9px] font-bold text-slate-700">${s}</span>`).join('')}
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div class="font-bold uppercase text-[9px] tracking-wider text-slate-400">Credentials</div>
                            <div class="space-y-1 text-[10px] text-slate-600">
                                ${certs.map(c => `<p><i class="fa-solid fa-award mr-1.5" style="color: ${selectedAccentColor}"></i> ${c}</p>`).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="space-y-1 text-[10px] text-slate-400 border-t border-slate-200/50 pt-2 font-mono">
                        <p><i class="fa-brands fa-github mr-1"></i> Github</p>
                        <p><i class="fa-brands fa-linkedin mr-1"></i> LinkedIn</p>
                    </div>
                </div>
                <div class="col-span-8 space-y-5 flex flex-col justify-between">
                    <div class="space-y-2">
                        <h3 class="text-xs uppercase tracking-wider font-extrabold pb-1 border-b-2" style="border-color: ${selectedAccentColor}; color: ${selectedAccentColor}">Executive Summary</h3>
                        <p class="text-slate-600 leading-relaxed text-[11px]">${summary}</p>
                    </div>
                    <div class="space-y-3">
                        <h3 class="text-xs uppercase tracking-wider font-extrabold pb-1 border-b-2" style="border-color: ${selectedAccentColor}; color: ${selectedAccentColor}">Work Experience</h3>
                        <div class="space-y-3">${expHtml}</div>
                    </div>
                    <div class="space-y-3">
                        <h3 class="text-xs uppercase tracking-wider font-extrabold pb-1 border-b-2" style="border-color: ${selectedAccentColor}; color: ${selectedAccentColor}">Key Project Milestones</h3>
                        <div class="space-y-2.5">${projHtml}</div>
                    </div>
                    <div class="space-y-3">
                        <h3 class="text-xs uppercase tracking-wider font-extrabold pb-1 border-b-2" style="border-color: ${selectedAccentColor}; color: ${selectedAccentColor}">Academic Profile</h3>
                        <div class="space-y-2">${eduHtml}</div>
                    </div>
                </div>
            </div>
        `;
    } else if (selectedTemplate === 'modern') {
        canvas.innerHTML = `
            <div class="space-y-5 flex flex-col justify-between h-full text-slate-800">
                <div class="text-center space-y-2 border-b-2 pb-4" style="border-color: ${selectedAccentColor}">
                    <h1 class="text-2xl font-black tracking-tight uppercase">${name}</h1>
                    <p class="text-xs font-bold uppercase tracking-widest text-slate-500" style="color: ${selectedAccentColor}">${title}</p>
                    <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-slate-500">
                        <span><i class="fa-solid fa-envelope mr-1"></i> ${email}</span>
                        <span><i class="fa-solid fa-phone mr-1"></i> ${phone}</span>
                        <span><i class="fa-solid fa-location-dot mr-1"></i> ${location}</span>
                        <span><i class="fa-solid fa-globe mr-1"></i> ${website}</span>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-8 space-y-4">
                        <div class="space-y-1">
                            <h3 class="text-xs font-extrabold uppercase tracking-wide border-b border-slate-200 pb-1" style="color: ${selectedAccentColor}">Professional Highlights</h3>
                            <p class="text-slate-600 leading-relaxed text-[11px]">${summary}</p>
                        </div>
                        <div class="space-y-3">
                            <h3 class="text-xs font-extrabold uppercase tracking-wide border-b border-slate-200 pb-1" style="color: ${selectedAccentColor}">Professional Background</h3>
                            <div class="space-y-3">${expHtml}</div>
                        </div>
                    </div>
                    <div class="col-span-4 space-y-4">
                        <div class="space-y-2">
                            <h3 class="text-xs font-extrabold uppercase tracking-wide border-b border-slate-200 pb-1" style="color: ${selectedAccentColor}">Skills & Stack</h3>
                            <div class="flex flex-wrap gap-1">
                                ${skills.map(s => `<span class="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-700">${s}</span>`).join('')}
                            </div>
                        </div>
                        <div class="space-y-2">
                            <h3 class="text-xs font-extrabold uppercase tracking-wide border-b border-slate-200 pb-1" style="color: ${selectedAccentColor}">Key Projects</h3>
                            <div class="space-y-2">${projHtml}</div>
                        </div>
                        <div class="space-y-2">
                            <h3 class="text-xs font-extrabold uppercase tracking-wide border-b border-slate-200 pb-1" style="color: ${selectedAccentColor}">Education</h3>
                            <div class="space-y-2">${eduHtml}</div>
                        </div>
                    </div>
                </div>
                <div class="border-t border-slate-100 pt-3 flex justify-between items-center text-[9px] text-slate-400 font-mono">
                    <span>Github: ${github}</span>
                    <span>LinkedIn: ${linkedin}</span>
                </div>
            </div>
        `;
    } else if (selectedTemplate === 'compact') {
        canvas.innerHTML = `
            <div class="space-y-4 flex flex-col justify-between h-full text-slate-800">
                <div class="flex justify-between items-start border-b border-slate-200 pb-3">
                    <div>
                        <h1 class="text-xl font-black text-slate-900 leading-none">${name}</h1>
                        <p class="text-xs font-bold uppercase tracking-wider mt-1" style="color: ${selectedAccentColor}">${title}</p>
                    </div>
                    <div class="text-right text-[9px] text-slate-500 space-y-0.5 font-mono">
                        <p>${email} | ${phone}</p>
                        <p>${location} | ${website}</p>
                    </div>
                </div>
                <div class="space-y-2">
                    <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400">Core Summary</h3>
                    <p class="text-slate-600 leading-relaxed text-[11px]">${summary}</p>
                </div>
                <div class="space-y-3">
                    <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400">Professional Record</h3>
                    <div class="space-y-2.5">${expHtml}</div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400">Featured Projects</h3>
                        <div class="space-y-2">${projHtml}</div>
                    </div>
                    <div class="space-y-2">
                        <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400">Academic Background</h3>
                        <div class="space-y-2">${eduHtml}</div>
                    </div>
                </div>
                <div class="border-t border-slate-100 pt-3 flex flex-wrap justify-between gap-2 text-[9px] text-slate-400 font-mono">
                    <span>Core Tech: ${skills.slice(0, 6).join(', ')}</span>
                    <span>Socials: GitHub / LinkedIn</span>
                </div>
            </div>
        `;
    } else if (selectedTemplate === 'creative') {
        canvas.innerHTML = `
            <div class="space-y-5 flex flex-col justify-between h-full text-slate-800">
                <div class="p-4 rounded-2xl text-white flex justify-between items-center" style="background: linear-gradient(135deg, ${selectedAccentColor}, #4f46e5)">
                    <div>
                        <h1 class="text-lg font-black tracking-tight">${name}</h1>
                        <p class="text-[10px] font-bold uppercase tracking-widest opacity-90">${title}</p>
                    </div>
                    <div class="text-[9px] opacity-80 text-right space-y-0.5">
                        <p>${email}</p>
                        <p>${phone}</p>
                        <p>${location}</p>
                    </div>
                </div>
                <div class="space-y-2">
                    <p class="text-slate-600 leading-relaxed text-[11px] italic">"${summary}"</p>
                </div>
                <div class="grid grid-cols-12 gap-5">
                    <div class="col-span-8 space-y-4">
                        <div class="space-y-3">
                            <h3 class="text-[10px] uppercase tracking-widest font-bold pb-1 border-b" style="border-color: ${selectedAccentColor}; color: ${selectedAccentColor}">Experience timeline</h3>
                            <div class="space-y-3">${expHtml}</div>
                        </div>
                    </div>
                    <div class="col-span-4 space-y-4">
                        <div class="space-y-2">
                            <h3 class="text-[10px] uppercase tracking-widest font-bold pb-1 border-b" style="border-color: ${selectedAccentColor}; color: ${selectedAccentColor}">Expertise Stack</h3>
                            <div class="flex flex-wrap gap-1">
                                ${skills.map(s => `<span class="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-700">${s}</span>`).join('')}
                            </div>
                        </div>
                        <div class="space-y-2">
                            <h3 class="text-[10px] uppercase tracking-widest font-bold pb-1 border-b" style="border-color: ${selectedAccentColor}; color: ${selectedAccentColor}">Qualifications</h3>
                            <div class="space-y-2">${eduHtml}</div>
                        </div>
                    </div>
                </div>
                <div class="border-t border-slate-100 pt-3 flex justify-between items-center text-[9px] text-slate-400">
                    <span>AeroCV Premium Creative Series Layout</span>
                    <span>Portfolio: ${website}</span>
                </div>
            </div>
        `;
    } else if (selectedTemplate === 'technical') {
        canvas.innerHTML = `
            <div class="space-y-4 flex flex-col justify-between h-full font-mono text-[11px] text-slate-800">
                <div class="border-b border-dashed border-slate-300 pb-3">
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-slate-900">&lt;${name.replace(/\s+/g, '')}.json&gt;</span>
                        <span class="text-[9px] text-slate-400">Generated: 2026-06-16</span>
                    </div>
                    <p class="text-[10px] text-slate-500 mt-1">"title": "${title}", "email": "${email}", "phone": "${phone}"</p>
                </div>
                <div class="space-y-1">
                    <span class="text-slate-400 font-bold">// Executive Abstract</span>
                    <p class="text-slate-600 leading-relaxed">${summary}</p>
                </div>
                <div class="space-y-2">
                    <span class="text-slate-400 font-bold">// System Core Employment</span>
                    <div class="space-y-2">${expHtml}</div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1">
                        <span class="text-slate-400 font-bold">// Stack Modules</span>
                        <p class="text-slate-600">${skills.join(', ')}</p>
                    </div>
                    <div class="space-y-1">
                        <span class="text-slate-400 font-bold">// Academic Nodes</span>
                        <div class="space-y-1">${eduHtml}</div>
                    </div>
                </div>
                <div class="border-t border-dashed border-slate-300 pt-3 flex justify-between text-[9px] text-slate-400">
                    <span>github: "${github}"</span>
                    <span>&lt;/compiled&gt;</span>
                </div>
            </div>
        `;
    }
}

function syncCoverLetterPreview() {
    const recipientName = document.getElementById('cl-recipient-name').value;
    const recipientCompany = document.getElementById('cl-recipient-company').value;
    const clSubject = document.getElementById('cl-subject').value;
    const clBody = document.getElementById('cl-body').value;
    document.getElementById('cl-preview-sender').innerText = resumeData.personal.name || 'Aaditya Kandpal';
    document.getElementById('cl-preview-title').innerText = resumeData.personal.title || 'Senior Solutions Architect & SDE';
    document.getElementById('cl-preview-email').innerText = resumeData.personal.email || 'aaditya.kandpal@gmail.com';
    document.getElementById('cl-preview-phone').innerText = resumeData.personal.phone || '+91 98765 43210';
    document.getElementById('cl-preview-location').innerText = resumeData.personal.location || 'New Delhi, India';
    document.getElementById('cl-preview-recipient-meta').innerText = `To: ${recipientName} at ${recipientCompany}`;
    document.getElementById('cl-preview-subject').innerText = `Subject: ${clSubject}`;
    document.getElementById('cl-preview-body').innerText = clBody;
    document.querySelector('#cover-letter-preview .border-b-2').style.borderColor = selectedAccentColor;
    document.querySelector('#cl-preview-title').style.color = selectedAccentColor;
}

function renderTrackerBoard() {
    const cols = {
        wishlist: document.getElementById('col-wishlist'),
        applied: document.getElementById('col-applied'),
        interview: document.getElementById('col-interview'),
        offer: document.getElementById('col-offer'),
        rejected: document.getElementById('col-rejected')
    };
    Object.values(cols).forEach(el => {
        if (el) el.innerHTML = '';
    });
    const counts = { wishlist: 0, applied: 0, interview: 0, offer: 0, rejected: 0 };
    jobApplications.forEach(app => {
        counts[app.status]++;
        const card = document.createElement('div');
        card.className = "bg-white dark:bg-premium-800 p-4 rounded-2xl border border-premium-200/50 dark:border-premium-700/50 shadow-sm space-y-3 hover-lift relative";
        card.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="font-bold text-xs text-premium-900 dark:text-white leading-tight">${app.title}</h4>
                    <p class="text-[10px] text-premium-500 font-semibold">${app.company}</p>
                </div>
                <button onclick="removeJobCard(${app.id})" class="text-premium-400 hover:text-red-500 text-[10px]"><i class="fa-solid fa-trash-can"></i></button>
            </div>
            <div class="flex justify-between items-center text-[9px] text-premium-500 font-mono">
                <span><i class="fa-solid fa-wallet text-emerald-500 mr-1"></i> ${app.salary}</span>
                <span><i class="fa-solid fa-calendar mr-1"></i> ${app.date}</span>
            </div>
            <p class="text-[10px] text-premium-400 leading-relaxed line-clamp-2 italic border-t border-premium-100 dark:border-premium-700/50 pt-2">"${app.notes}"</p>
            <div class="flex justify-between gap-1 border-t border-premium-100 dark:border-premium-700/50 pt-2">
                <button onclick="shiftJobStatus(${app.id}, 'wishlist')" class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 rounded text-[8px] font-bold" title="Wishlist">⭐</button>
                <button onclick="shiftJobStatus(${app.id}, 'applied')" class="px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/40 hover:bg-indigo-100 rounded text-[8px] font-bold" title="Applied">✈️</button>
                <button onclick="shiftJobStatus(${app.id}, 'interview')" class="px-1.5 py-0.5 bg-amber-50 dark:bg-amber-900/40 hover:bg-amber-100 rounded text-[8px] font-bold" title="Interview">📞</button>
                <button onclick="shiftJobStatus(${app.id}, 'offer')" class="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/40 hover:bg-emerald-100 rounded text-[8px] font-bold" title="Offer">🏆</button>
                <button onclick="shiftJobStatus(${app.id}, 'rejected')" class="px-1.5 py-0.5 bg-red-50 dark:bg-red-900/40 hover:bg-red-100 rounded text-[8px] font-bold" title="Rejected">❌</button>
            </div>
        `;
        if (cols[app.status]) {
            cols[app.status].appendChild(card);
        }
    });
    Object.keys(counts).forEach(status => {
        const el = document.getElementById(`badge-${status}`);
        if (el) el.innerText = counts[status];
    });
    const total = jobApplications.length;
    const interviewCount = counts.interview;
    const offerCount = counts.offer;
    const successRate = total ? Math.round((offerCount / total) * 100) : 0;
    document.getElementById('tracker-stat-total').innerText = total;
    document.getElementById('tracker-stat-interviews').innerText = interviewCount;
    document.getElementById('tracker-stat-offers').innerText = offerCount;
    document.getElementById('tracker-stat-success-rate').innerText = `${successRate}%`;
}

function shiftJobStatus(id, newStatus) {
    const app = jobApplications.find(a => a.id === id);
    if (app) {
        app.status = newStatus;
        renderTrackerBoard();
    }
}

function removeJobCard(id) {
    jobApplications = jobApplications.filter(a => a.id !== id);
    renderTrackerBoard();
}

function openAddJobModal() {
    document.getElementById('add-job-modal').classList.remove('hidden');
}

function closeAddJobModal() {
    document.getElementById('add-job-modal').classList.add('hidden');
}

function saveJobCard() {
    const title = document.getElementById('job-title-input').value || "SDE Specialist Solutions";
    const company = document.getElementById('job-company-input').value || "Acme Tech Solutions";
    const salary = document.getElementById('job-salary-input').value || "$120,000 / year";
    const status = document.getElementById('job-status-input').value;
    const date = document.getElementById('job-date-input').value || "2026-06-16";
    const notes = document.getElementById('job-notes-input').value || "Focus on building clear architecture references.";
    const nextId = jobApplications.length ? Math.max(...jobApplications.map(a => a.id)) + 1 : 1;
    jobApplications.push({
        id: nextId,
        title,
        company,
        salary,
        status,
        date,
        notes
    });
    closeAddJobModal();
    renderTrackerBoard();
    document.getElementById('job-title-input').value = '';
    document.getElementById('job-company-input').value = '';
    document.getElementById('job-salary-input').value = '';
    document.getElementById('job-notes-input').value = '';
}

function openGeminiKeyModal() {
    document.getElementById('gemini-modal').classList.remove('hidden');
    document.getElementById('gemini-key-input').value = geminiApiKey;
}

function closeGeminiKeyModal() {
    document.getElementById('gemini-modal').classList.add('hidden');
}

function saveGeminiApiKey() {
    const val = document.getElementById('gemini-key-input').value.trim();
    geminiApiKey = val;
    sessionStorage.setItem('gemini_api_key', val);
    closeGeminiKeyModal();
    showLocalToast("Gemini Connection secured successfully!");
}

async function callGeminiAPI(systemPrompt, userPrompt) {
    const apiKey = geminiApiKey;
    if (!apiKey) {
        return null;
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
    };
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        return text || null;
    } catch (error) {
        console.error("Gemini API error:", error);
        return null;
    }
}

function getSimulatedOfflineOptimization(fieldName, text) {
    const optimizations = {
        summary: "Highly-accomplished Platform Solutions Architect and Senior Software Developer with 8+ years of experience leading robust enterprise migrations on AWS clouds. Proven success cutting resource costs by 42% through Node.js optimizations and reactive systems architectures. Skilled in leading cross-functional tech squads.",
        highlights: "Architected distributed platform microservices managing 5,000,000+ real-time events daily; reduced resource allocation parameters and cloud operating overheads by 45%.",
        coverletter: "Dear Hiring Manager,\n\nI am writing to express my eager interest in the Cloud Engineer position. Backed by over 8 years of production software development expertise, I possess a highly specialized track record of improving infrastructure latency, boosting throughput, and streamlining complex software models.\n\nAt my previous architecture role, I successfully automated entire microservices clusters, cutting average operating expenses by 30% while retaining zero downtime configurations. I bring direct expert capacity with AWS services, docker instances, and micro-reactive interfaces to instantly benefit your ongoing roadmaps.\n\nI look forward to discussing how my experience will drive significant performance increases.\n\nSincerely,\nAaditya Kandpal"
    };
    return optimizations[fieldName] || `Optimized high-impact SDE metric: ${text}`;
}

async function aiOptimizeField(fieldName, elementId, itemId = null) {
    const currentVal = document.getElementById(elementId)?.value || '';
    showLocalToast("Enhancing text readability...");
    const systemPrompt = "Act as a world-class executive recruiter. Rewrite the provided text to use action verbs, include modern technical keywords, and match high-performing ATS criteria.";
    const userPrompt = `Optimize the following resume bullet/text block for modern recruitment: "${currentVal}"`;
    let optimizedText = await callGeminiAPI(systemPrompt, userPrompt);
    if (!optimizedText) {
        optimizedText = getSimulatedOfflineOptimization(fieldName, currentVal);
    }
    const inputEl = document.getElementById(elementId);
    if (inputEl) {
        inputEl.value = optimizedText.trim();
        if (itemId !== null && fieldName === 'highlights') {
            updateExperienceField(itemId, 'highlights', optimizedText.trim());
        } else {
            syncResumePreview();
        }
    }
}

async function triggerLocalSummaryOptimization() {
    await aiOptimizeField('summary', 'cv-summary');
    showLocalToast("Resume Summary successfully optimized!");
}

async function aiOptimizeCoverLetter() {
    showLocalToast("Generating custom Cover Letter drafts...");
    const recipientName = document.getElementById('cl-recipient-name').value;
    const recipientCompany = document.getElementById('cl-recipient-company').value;
    const systemPrompt = "Act as a specialized technology cover letter writer. Create a compelling, professional 3-paragraph technology cover letter.";
    const userPrompt = `Draft a modern technology cover letter for Senior SDE Architect application addressed to ${recipientName} at ${recipientCompany}. Keep it under 250 words.`;
    let optimizedText = await callGeminiAPI(systemPrompt, userPrompt);
    if (!optimizedText) {
        optimizedText = getSimulatedOfflineOptimization('coverletter', '');
    }
    document.getElementById('cl-body').value = optimizedText;
    syncCoverLetterPreview();
}

function triggerResumeImport() {
    document.getElementById('import-cv-modal').classList.remove('hidden');
}

function closeResumeImportModal() {
    document.getElementById('import-cv-modal').classList.add('hidden');
}

function handleCVFileSelected(event) {
    const file = event.target.files[0];
    if (!file) return;
    const spinner = document.getElementById('parse-loading-spinner');
    const dropzone = document.getElementById('import-drop-zone');
    dropzone.classList.add('hidden');
    spinner.classList.remove('hidden');
    setTimeout(() => {
        spinner.classList.add('hidden');
        dropzone.classList.remove('hidden');
        closeResumeImportModal();
        document.getElementById('cv-name').value = "Aaditya Kandpal";
        document.getElementById('cv-title').value = "Lead Distributed Solutions Architect";
        document.getElementById('cv-summary').value = "Senior Cloud SDE and solutions analyst with direct system experience architecting microservice platforms and custom real-time engines with high reliability configurations.";
        showLocalToast("Successfully parsed and hydrated resume fields!");
        syncResumePreview();
    }, 2500);
}

function showLocalToast(message) {
    const toast = document.createElement('div');
    toast.className = "fixed bottom-6 right-6 z-50 bg-premium-900 text-white dark:bg-white dark:text-premium-950 px-5 py-3 rounded-2xl shadow-2xl border border-premium-200/20 text-xs font-bold flex items-center gap-2.5 animate-bounce";
    toast.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-500"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

function resetBuilderToDefault() {
    document.getElementById('cv-name').value = "Aaditya Kandpal";
    document.getElementById('cv-title').value = "Senior Solutions Architect & SDE";
    document.getElementById('cv-email').value = "aaditya.kandpal@gmail.com";
    document.getElementById('cv-phone').value = "+91 98765 43210";
    document.getElementById('cv-location').value = "New Delhi, India";
    document.getElementById('cv-website').value = "https://aadityakandpal.dev";
    document.getElementById('cv-summary').value = "Results-driven Cloud Architect and software engineer with 8+ years designing microservices paradigms and reactive Web engines. Adept at high performance system architectures and clean modern coding styles.";
    document.getElementById('cv-skills').value = "React, Next.js, Node.js, Webpack, Amazon Web Services, Docker, System Architecture, Performance Tuning, CI/CD Pipelines";
    document.getElementById('cv-certs').value = "AWS Certified Solutions Architect Pro, Google Cloud DevOps Expert, Hackathon First Place 2024";
    syncResumePreview();
    showLocalToast("Builder restored to Aaditya Kandpal's defaults.");
}

function selectTemplateFromCatalog(tplName) {
    document.getElementById('builder-template-select').value = tplName;
    switchView('builder');
    applyTemplateLayout();
    showLocalToast(`Template layout swapped to ${tplName}`);
}

function filterTemplates(cat) {
    document.querySelectorAll('[data-category]').forEach(card => {
        if (cat === 'all' || card.getAttribute('data-category') === cat) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
    document.querySelectorAll('.template-filter-btn').forEach(btn => {
        const filterVal = btn.getAttribute('data-filter');
        if (filterVal === cat) {
            btn.className = "template-filter-btn px-4 py-2 bg-premium-accent text-white rounded-xl text-sm font-bold";
        } else {
            btn.className = "template-filter-btn px-4 py-2 bg-premium-100 dark:bg-premium-800 hover:bg-premium-200 dark:hover:bg-premium-700 text-premium-800 dark:text-white rounded-xl text-sm font-bold";
        }
    });
}

function triggerPrintExport() {
    window.print();
}

window.onload = function() {
    loadExperienceEditorRows();
    loadEducationEditorRows();
    loadProjectEditorRows();
    const dropzone = document.getElementById('import-drop-zone');
    if (dropzone) {
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('border-premium-accent');
        });
        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('border-premium-accent');
        });
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('border-premium-accent');
            if (e.dataTransfer.files.length) {
                handleCVFileSelected({ target: { files: e.dataTransfer.files } });
            }
        });
        dropzone.addEventListener('click', () => {
            document.getElementById('cv-file-input').click();
        });
    }
    syncResumePreview();
}
