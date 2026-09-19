import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ExternalLink,
  Github,
  Mail,
  Phone,
  MapPin,
  FileDown,
  Eye,
  Check,
  Copy,
  BookOpen,
  Award,
  Cpu,
  Monitor,
  Laptop,
  GraduationCap,
  Sparkles,
  Camera,
  FolderCode,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PORTFOLIO_DATA } from '../../data/portfolioData';

interface PortfolioModalProps {
  section: string | null;
  onClose: () => void;
  isDarkMode: boolean;
  onOpenResumeViewer: () => void;
  onNavigateToSection: (section: string) => void;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({
  section,
  onClose,
  isDarkMode,
  onOpenResumeViewer,
  onNavigateToSection,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!section || section === 'explore') return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#8ea89d', '#e6b9a8', '#9cb4c9', '#d6b77e'],
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const renderContent = () => {
    switch (section) {
      case 'about':
        return (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#918373] dark:text-[#a094b0] font-mono">
                  Profile & Background
                </span>
                <h2 className="text-2xl font-bold font-serif text-[#1e1b18] dark:text-[#f8f6f2] mt-0.5">
                  {PORTFOLIO_DATA.about.name}
                </h2>
                <p className="text-xs text-[#796c5d] dark:text-[#b0a4c0] font-mono mt-0.5">
                  {PORTFOLIO_DATA.about.headline} • {PORTFOLIO_DATA.about.location}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-[#f2ecdf] dark:bg-[#282333] text-[#4f4337] dark:text-[#e4dcf0]">
                <Monitor className="w-6 h-6" />
              </div>
            </div>

            <p className="text-sm leading-relaxed text-[#4d443b] dark:text-[#d3c8de]">
              {PORTFOLIO_DATA.about.summary}
            </p>

            <div className="p-4 rounded-2xl border border-[#e8e1d7] bg-[#fdfcf9] dark:border-[#383344] dark:bg-[#1a1724]">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#635749] dark:text-[#b4a9c2]">
                  Current Qualification
                </span>
              </div>
              <h3 className="font-semibold text-sm text-[#1e1b18] dark:text-[#f8f6f2]">
                {PORTFOLIO_DATA.about.currentDegree}
              </h3>
              <p className="text-xs text-[#756758] dark:text-[#a79bb7] mt-0.5">
                {PORTFOLIO_DATA.about.institution}
              </p>
              <div className="mt-2.5 inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#eef5ee] text-emerald-800 border border-[#d4e8d4] dark:bg-[#1b2b20] dark:text-emerald-300 dark:border-[#284230]">
                <span>{PORTFOLIO_DATA.about.cgpa}</span>
                <span>•</span>
                <span>{PORTFOLIO_DATA.about.classification}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8b7d6e] dark:text-[#a497b3] mb-3 font-mono">
                Core Competencies
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PORTFOLIO_DATA.about.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-[#ede7dd] bg-[#fbf9f5] dark:border-[#322d3d] dark:bg-[#1e1b29] text-xs text-[#4b4238] dark:text-[#d7cde3]"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8ea89d]" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#918373] dark:text-[#a094b0] font-mono">
                  Portfolio Works
                </span>
                <h2 className="text-2xl font-bold font-serif text-[#1e1b18] dark:text-[#f8f6f2] mt-0.5">
                  Featured Projects
                </h2>
                <p className="text-xs text-[#796c5d] dark:text-[#b0a4c0] mt-0.5">
                  Interactive implementations & engineering repositories
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-[#f2ecdf] dark:bg-[#282333] text-[#4f4337] dark:text-[#e4dcf0]">
                <FolderCode className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-4">
              {PORTFOLIO_DATA.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-5 rounded-2xl border border-[#e8e1d7] bg-[#fdfcf9] dark:border-[#383344] dark:bg-[#1a1724] space-y-3.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-[#1e1b18] dark:text-[#f8f6f2]">
                          {proj.title}
                        </h3>
                        {proj.featured && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md font-mono uppercase bg-amber-100 text-amber-900 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
                            Active 3D Room
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#8c7e6e] dark:text-[#9e92ad] mt-0.5">
                        {proj.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed text-[#544a40] dark:text-[#c7bcd4]">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {proj.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-[#f2ede4] text-[#635546] dark:bg-[#262132] dark:text-[#b7abcb]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-[#dbd3c6] bg-[#faf8f4] text-[#2c2825] hover:bg-[#ede6da] dark:border-[#3d374a] dark:bg-[#201c2c] dark:text-[#eae4f2] dark:hover:bg-[#2c273c] transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>GitHub Repo</span>
                      </a>
                    )}
                    <button
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-[#2c2825] text-[#faf8f5] hover:bg-[#453e38] dark:bg-[#eee8df] dark:text-[#18161e] dark:hover:bg-[#ffffff] transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Live 3D Preview</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#918373] dark:text-[#a094b0] font-mono">
                  Academic Journey
                </span>
                <h2 className="text-2xl font-bold font-serif text-[#1e1b18] dark:text-[#f8f6f2] mt-0.5">
                  Education & Qualifications
                </h2>
                <p className="text-xs text-[#796c5d] dark:text-[#b0a4c0] mt-0.5">
                  From higher secondary foundations to post-graduate studies
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-[#f2ecdf] dark:bg-[#282333] text-[#4f4337] dark:text-[#e4dcf0]">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-3.5">
              {PORTFOLIO_DATA.education.map((edu, idx) => (
                <div
                  key={edu.id}
                  className="p-4 rounded-2xl border border-[#e8e1d7] bg-[#fdfcf9] dark:border-[#383344] dark:bg-[#1a1724] relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                    <div>
                      <h3 className="font-bold text-sm text-[#1e1b18] dark:text-[#f8f6f2]">
                        {edu.degree}
                      </h3>
                      <p className="text-xs text-[#726455] dark:text-[#a598b5] font-medium mt-0.5">
                        {edu.institution}
                      </p>
                    </div>
                    {edu.period && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#ede6db] text-[#695d4f] dark:bg-[#292435] dark:text-[#b2a6c2] self-start">
                        {edu.period}
                      </span>
                    )}
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#eef4ee] text-emerald-800 border border-[#d6e8d6] dark:bg-[#1a2b1f] dark:text-emerald-300 dark:border-[#27452f]">
                      {edu.grade}
                    </span>
                    {edu.classification && (
                      <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-[#f3ede4] text-[#6b5c4d] dark:bg-[#241f2e] dark:text-[#b4a8c4]">
                        {edu.classification}
                      </span>
                    )}
                  </div>

                  {edu.details && (
                    <p className="mt-2 text-xs leading-relaxed text-[#615549] dark:text-[#bcb0cb]">
                      {edu.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        return (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#918373] dark:text-[#a094b0] font-mono">
                  Professional Credentials
                </span>
                <h2 className="text-2xl font-bold font-serif text-[#1e1b18] dark:text-[#f8f6f2] mt-0.5">
                  Certifications & Training
                </h2>
                <p className="text-xs text-[#796c5d] dark:text-[#b0a4c0] mt-0.5">
                  Specialized vocational training in computer science & design
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-[#f2ecdf] dark:bg-[#282333] text-[#4f4337] dark:text-[#e4dcf0]">
                <Award className="w-6 h-6" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {PORTFOLIO_DATA.certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="p-4 rounded-2xl border border-[#e8e1d7] bg-[#fdfcf9] dark:border-[#383344] dark:bg-[#1a1724] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#f1ece2] dark:bg-[#262132] flex items-center justify-center text-[#9b7332] dark:text-[#f3ba63]">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#1e1b18] dark:text-[#f8f6f2]">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-[#796b5c] dark:text-[#a89cb8]">
                        {cert.institution}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#eee7dd] text-[#5e5142] dark:bg-[#292436] dark:text-[#c0b4ce]">
                    {cert.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#918373] dark:text-[#a094b0] font-mono">
                  Technical Stack
                </span>
                <h2 className="text-2xl font-bold font-serif text-[#1e1b18] dark:text-[#f8f6f2] mt-0.5">
                  Core Skills
                </h2>
                <p className="text-xs text-[#796c5d] dark:text-[#b0a4c0] mt-0.5">
                  Languages, databases, machine learning, and tools
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-[#f2ecdf] dark:bg-[#282333] text-[#4f4337] dark:text-[#e4dcf0]">
                <Cpu className="w-6 h-6" />
              </div>
            </div>

            {/* Categories */}
            {(['Languages', 'Web & Database', 'Core & Tools'] as const).map((category) => {
              const categorySkills = PORTFOLIO_DATA.skills.filter((s) => s.category === category);
              return (
                <div key={category} className="space-y-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8b7e6f] dark:text-[#a599b5] font-mono">
                    {category}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <div
                        key={skill.name}
                        className="px-3 py-1.5 rounded-xl border border-[#e4dcce] bg-[#fbf9f5] dark:border-[#352f41] dark:bg-[#1d1a28] text-xs font-medium text-[#2d2822] dark:text-[#ede7f5] flex items-center gap-2 hover:border-[#bdafa0] transition-colors"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#8ea89d]" />
                        <span>{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'resume':
        return (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#918373] dark:text-[#a094b0] font-mono">
                  Curriculum Vitae
                </span>
                <h2 className="text-2xl font-bold font-serif text-[#1e1b18] dark:text-[#f8f6f2] mt-0.5">
                  Resume Document
                </h2>
                <p className="text-xs text-[#796c5d] dark:text-[#b0a4c0] mt-0.5">
                  {PORTFOLIO_DATA.resume.name} • {PORTFOLIO_DATA.resume.title}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-[#f2ecdf] dark:bg-[#282333] text-[#4f4337] dark:text-[#e4dcf0]">
                <FileDown className="w-6 h-6" />
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-[#e8e1d7] bg-[#fdfcf9] dark:border-[#383344] dark:bg-[#1a1724] space-y-3">
              <div className="space-y-1">
                <h3 className="font-bold text-base text-[#1e1b18] dark:text-[#f8f6f2]">
                  {PORTFOLIO_DATA.resume.name}
                </h3>
                <p className="text-xs font-mono text-[#827464] dark:text-[#a599b5]">
                  {PORTFOLIO_DATA.resume.title}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#5f5346] dark:text-[#c4b9d1] pt-1">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#8ea89d]" />
                  <span>{PORTFOLIO_DATA.resume.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#8ea89d]" />
                  <span>{PORTFOLIO_DATA.resume.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:col-span-2">
                  <MapPin className="w-3.5 h-3.5 text-[#8ea89d]" />
                  <span>{PORTFOLIO_DATA.resume.location}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#eee7dc] dark:border-[#2e293a]">
                <p className="text-xs leading-relaxed text-[#594e43] dark:text-[#beafcd]">
                  {PORTFOLIO_DATA.resume.objective}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenResumeViewer}
                id="btn-view-resume"
                className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-[#2c2825] text-[#faf8f5] hover:bg-[#433d38] dark:bg-[#eee8df] dark:text-[#18161e] dark:hover:bg-[#ffffff] transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>View Full Resume</span>
              </button>

              <button
                onClick={() => {
                  handleCopy(
                    `${PORTFOLIO_DATA.resume.name}\n${PORTFOLIO_DATA.resume.title}\nEmail: ${PORTFOLIO_DATA.resume.email}\nPhone: ${PORTFOLIO_DATA.resume.phone}\nLocation: ${PORTFOLIO_DATA.resume.location}\n\nMCA: Cochin University of Science and Technology (CUSAT) - CGPA 7.66/10 First Class\nBCA: Bharata Mata College (2019-2022) - CCPA 6.24/10 B Class\n\nSkills: Python, Java, C, SQL, MySQL, HTML, CSS, JavaScript, Web Development, Machine Learning, Git, GitHub\nCertifications: Diploma in Web Designing (2019), Desktop Publishing (2018), Diploma in Computer Applications (2017)`,
                    'download-cv'
                  );
                }}
                id="btn-download-resume"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium border border-[#dbd3c6] bg-[#faf8f4] text-[#2c2825] hover:bg-[#ede6da] dark:border-[#3d374a] dark:bg-[#201c2c] dark:text-[#eae4f2] dark:hover:bg-[#2c273c] transition-colors cursor-pointer"
              >
                {copiedKey === 'download-cv' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Copied Text CV!</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" />
                    <span>Download CV Text</span>
                  </>
                )}
              </button>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#918373] dark:text-[#a094b0] font-mono">
                  Get In Touch
                </span>
                <h2 className="text-2xl font-bold font-serif text-[#1e1b18] dark:text-[#f8f6f2] mt-0.5">
                  Contact Information
                </h2>
                <p className="text-xs text-[#796c5d] dark:text-[#b0a4c0] mt-0.5">
                  Available for developer opportunities and discussions
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-[#f2ecdf] dark:bg-[#282333] text-[#4f4337] dark:text-[#e4dcf0]">
                <Mail className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-3">
              {/* Email */}
              <div className="p-3.5 rounded-2xl border border-[#e8e1d7] bg-[#fdfcf9] dark:border-[#383344] dark:bg-[#1a1724] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#eef4f1] text-[#426a57] dark:bg-[#1e2e25] dark:text-[#88c5a4] flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#8b7e71] dark:text-[#9e92ad]">
                      Email
                    </span>
                    <p className="text-xs font-semibold text-[#1e1b18] dark:text-[#f8f6f2]">
                      {PORTFOLIO_DATA.brand.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(PORTFOLIO_DATA.brand.email, 'email')}
                    title="Copy Email"
                    className="p-2 rounded-lg hover:bg-[#eee8dd] dark:hover:bg-[#272334] text-[#6d6052] dark:text-[#b0a3c2] cursor-pointer"
                  >
                    {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={`mailto:${PORTFOLIO_DATA.brand.email}`}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#2c2825] text-[#faf8f5] hover:bg-[#433d38] dark:bg-[#eee8df] dark:text-[#18161e] dark:hover:bg-[#ffffff] transition-colors"
                  >
                    Email
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="p-3.5 rounded-2xl border border-[#e8e1d7] bg-[#fdfcf9] dark:border-[#383344] dark:bg-[#1a1724] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#f8efe9] text-[#a45e43] dark:bg-[#2e211e] dark:text-[#e4a18b] flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#8b7e71] dark:text-[#9e92ad]">
                      Phone
                    </span>
                    <p className="text-xs font-semibold text-[#1e1b18] dark:text-[#f8f6f2]">
                      {PORTFOLIO_DATA.brand.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(PORTFOLIO_DATA.brand.phone, 'phone')}
                    title="Copy Phone"
                    className="p-2 rounded-lg hover:bg-[#eee8dd] dark:hover:bg-[#272334] text-[#6d6052] dark:text-[#b0a3c2] cursor-pointer"
                  >
                    {copiedKey === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={`tel:${PORTFOLIO_DATA.brand.phone}`}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#2c2825] text-[#faf8f5] hover:bg-[#433d38] dark:bg-[#eee8df] dark:text-[#18161e] dark:hover:bg-[#ffffff] transition-colors"
                  >
                    Call
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="p-3.5 rounded-2xl border border-[#e8e1d7] bg-[#fdfcf9] dark:border-[#383344] dark:bg-[#1a1724] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#edf2f6] text-[#496f8c] dark:bg-[#1c2933] dark:text-[#93bfdf] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#8b7e71] dark:text-[#9e92ad]">
                    Location
                  </span>
                  <p className="text-xs font-semibold text-[#1e1b18] dark:text-[#f8f6f2]">
                    {PORTFOLIO_DATA.brand.location}
                  </p>
                </div>
              </div>

              {/* GitHub */}
              <div className="p-3.5 rounded-2xl border border-[#e8e1d7] bg-[#fdfcf9] dark:border-[#383344] dark:bg-[#1a1724] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#f2ece2] text-[#2c2825] dark:bg-[#252030] dark:text-[#efeaf6] flex items-center justify-center">
                    <Github className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#8b7e71] dark:text-[#9e92ad]">
                      GitHub
                    </span>
                    <p className="text-xs font-semibold text-[#1e1b18] dark:text-[#f8f6f2]">
                      SARANG R N Code Profile
                    </p>
                  </div>
                </div>
                <a
                  href={PORTFOLIO_DATA.brand.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#dbd3c6] bg-[#faf8f4] text-[#2c2825] hover:bg-[#ede6da] dark:border-[#3d374a] dark:bg-[#201c2c] dark:text-[#eae4f2] dark:hover:bg-[#2c273c] transition-colors"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#918373] dark:text-[#a094b0] font-mono">
                  Personal Space
                </span>
                <h2 className="text-2xl font-bold font-serif text-[#1e1b18] dark:text-[#f8f6f2] mt-0.5">
                  {PORTFOLIO_DATA.gallery.title}
                </h2>
                <p className="text-xs text-[#796c5d] dark:text-[#b0a4c0] mt-0.5">
                  {PORTFOLIO_DATA.gallery.description}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-[#f2ecdf] dark:bg-[#282333] text-[#4f4337] dark:text-[#e4dcf0]">
                <Camera className="w-6 h-6" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PORTFOLIO_DATA.gallery.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-[#e8e1d7] bg-[#fdfcf9] dark:border-[#383344] dark:bg-[#1a1724] space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#8ea89d]" />
                    <h3 className="font-semibold text-xs text-[#1e1b18] dark:text-[#f8f6f2]">
                      {item.label}
                    </h3>
                  </div>
                  <p className="text-xs text-[#736556] dark:text-[#a99db8]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'guide':
        return (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#918373] dark:text-[#a094b0] font-mono">
                  Room Exploration
                </span>
                <h2 className="text-2xl font-bold font-serif text-[#1e1b18] dark:text-[#f8f6f2] mt-0.5">
                  Interactive Objects Guide
                </h2>
                <p className="text-xs text-[#796c5d] dark:text-[#b0a4c0] mt-0.5">
                  Click objects in the room or select any shortcut below
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-[#f2ecdf] dark:bg-[#282333] text-[#4f4337] dark:text-[#e4dcf0]">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PORTFOLIO_DATA.interactiveObjects.map((obj) => (
                <button
                  key={obj.id}
                  onClick={() => {
                    onNavigateToSection(obj.targetSection);
                  }}
                  className="text-left p-3 rounded-xl border border-[#e8e1d7] bg-[#fdfcf9] hover:bg-[#f3ede3] dark:border-[#383344] dark:bg-[#1a1724] dark:hover:bg-[#262132] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#1e1b18] dark:text-[#f8f6f2] group-hover:text-amber-700 dark:group-hover:text-amber-300">
                      {obj.label}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-[#96897b] dark:text-[#8d8299]">
                      {obj.targetSection}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#786c5e] dark:text-[#aca1ba] mt-0.5">
                    {obj.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6 select-none">
        {/* Subtle Backdrop - allows the 3D room to remain visible around the panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#211d19]/25 dark:bg-[#07060a]/50 backdrop-blur-[2px]"
        />

        {/* Floating Modal Panel */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-xl max-h-[85vh] flex flex-col rounded-3xl border border-[#ded5c7] bg-[#fdfcf9]/96 text-[#2c2825] shadow-2xl backdrop-blur-xl dark:border-[#3b3447] dark:bg-[#181522]/96 dark:text-[#f5f0fb] overflow-hidden"
        >
          {/* Top Panel Bar with Close Button */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#eee7db] dark:border-[#2b2637]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#8ea89d]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#796c5e] dark:text-[#aba0ba]">
                Sarang3DRoom • {section}
              </span>
            </div>

            <button
              onClick={onClose}
              id="btn-close-modal"
              className="p-1.5 rounded-xl hover:bg-[#ede6d8] dark:hover:bg-[#2a2436] text-[#6d6153] dark:text-[#aba0ba] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-7 overflow-y-auto max-h-[calc(85vh-70px)]">
            {renderContent()}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
