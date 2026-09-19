import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, Download, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';

interface ResumeViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const ResumeViewModal: React.FC<ResumeViewModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const text = `
=====================================================
${PORTFOLIO_DATA.resume.name}
${PORTFOLIO_DATA.resume.title}
=====================================================

CONTACT
Email:    ${PORTFOLIO_DATA.resume.email}
Phone:    ${PORTFOLIO_DATA.resume.phone}
Location: ${PORTFOLIO_DATA.resume.location}

CAREER SUMMARY
${PORTFOLIO_DATA.resume.objective}

EDUCATION
1. Master of Computer Applications (MCA)
   Cochin University of Science and Technology (CUSAT)
   Grade: 7.66/10 (First Class)

2. Bachelor of Computer Applications (BCA)
   Bharata Mata College of Science and Arts (2019 - 2022)
   Grade: 6.24/10 (B Class)

3. Higher Secondary / Plus Two (Science Biology)
   Cardinal Higher Secondary, Thrikkakara (2017 - 2019)

4. 10th Standard (SSLC)
   St Alberts HS, Ernakulam (2012 - 2017)

CERTIFICATIONS & TRAINING
- Diploma in Web Designing (Softmedia Computer Training, 2019)
- Desktop Publishing / DTP (Softmedia Computer Training, 2018)
- Diploma in Computer Applications (Softmedia Computer Training, 2017)

TECHNICAL SKILLS
- Programming Languages: Python, Java, C
- Web & Databases: HTML, CSS, JavaScript, Web Development, SQL, MySQL
- Core & Tools: Machine Learning, Git, GitHub

PROJECTS
- Sarang3DDesktop / 3D Portfolio:
  An interactive 3D portfolio designed as a virtual desktop experience that presents personal information, skills, education, projects, resume and contact information through an immersive desktop-style interface.
=====================================================
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Resume_${PORTFOLIO_DATA.resume.name.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none print:p-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#1e1b18]/40 backdrop-blur-xs print:hidden"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl border border-[#ded5c7] bg-[#ffffff] text-[#1e1b18] shadow-2xl overflow-hidden print:border-none print:shadow-none print:max-h-none print:rounded-none"
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#eee7dc] bg-[#faf8f5] print:hidden">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-[#2c2825]">
                Curriculum Vitae Preview
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-[#ddd5c7] bg-white text-[#2c2825] hover:bg-[#f3ede3] transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              <button
                onClick={handleDownloadTxt}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#2c2825] text-white hover:bg-[#453e38] transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .txt</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-[#ede6d8] text-[#6d6153] transition-colors cursor-pointer ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Document Paper */}
          <div className="p-8 sm:p-12 overflow-y-auto max-h-[calc(90vh-70px)] bg-white print:p-0 print:overflow-visible">
            {/* Header */}
            <div className="border-b-2 border-[#1e1b18] pb-6 mb-6">
              <h1 className="text-3xl font-bold font-serif tracking-tight text-[#1e1b18]">
                {PORTFOLIO_DATA.resume.name}
              </h1>
              <p className="text-xs font-mono tracking-wider font-semibold text-[#5a4e40] uppercase mt-1">
                {PORTFOLIO_DATA.resume.title}
              </p>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#52493f] mt-3">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#796c5e]" />
                  {PORTFOLIO_DATA.resume.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#796c5e]" />
                  {PORTFOLIO_DATA.resume.phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#796c5e]" />
                  {PORTFOLIO_DATA.resume.location}
                </span>
              </div>
            </div>

            {/* Profile Objective */}
            <section className="mb-6">
              <h2 className="text-xs font-bold font-mono tracking-widest uppercase text-[#796c5e] border-b border-[#e5ded4] pb-1 mb-2">
                Career Objective
              </h2>
              <p className="text-xs leading-relaxed text-[#3a332c]">
                {PORTFOLIO_DATA.resume.objective}
              </p>
            </section>

            {/* Education */}
            <section className="mb-6">
              <h2 className="text-xs font-bold font-mono tracking-widest uppercase text-[#796c5e] border-b border-[#e5ded4] pb-1 mb-3">
                Education
              </h2>
              <div className="space-y-3 text-xs">
                {PORTFOLIO_DATA.education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-[#1e1b18]">{edu.degree}</div>
                      <div className="text-[#645648]">{edu.institution}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-emerald-800">{edu.grade}</div>
                      <div className="text-[11px] text-[#7d7164]">
                        {edu.classification || edu.period}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Technical Skills */}
            <section className="mb-6">
              <h2 className="text-xs font-bold font-mono tracking-widest uppercase text-[#796c5e] border-b border-[#e5ded4] pb-1 mb-2">
                Technical Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {PORTFOLIO_DATA.skills.map((s) => (
                  <span
                    key={s.name}
                    className="px-2.5 py-1 rounded bg-[#f5f1eb] text-[#2c2825] text-xs font-medium border border-[#e5ded4]"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </section>

            {/* Certifications */}
            <section className="mb-6">
              <h2 className="text-xs font-bold font-mono tracking-widest uppercase text-[#796c5e] border-b border-[#e5ded4] pb-1 mb-3">
                Certifications & Training
              </h2>
              <div className="space-y-2 text-xs">
                {PORTFOLIO_DATA.certifications.map((c) => (
                  <div key={c.id} className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-[#1e1b18]">{c.title}</span>
                      <span className="text-[#645648] ml-2">— {c.institution}</span>
                    </div>
                    <span className="font-mono text-[#7d7164]">{c.year}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Project */}
            <section>
              <h2 className="text-xs font-bold font-mono tracking-widest uppercase text-[#796c5e] border-b border-[#e5ded4] pb-1 mb-2">
                Project Experience
              </h2>
              <div className="text-xs space-y-1">
                <div className="font-bold text-[#1e1b18]">
                  {PORTFOLIO_DATA.projects[0].title}
                </div>
                <p className="text-[#4b4136] leading-relaxed">
                  {PORTFOLIO_DATA.projects[0].description}
                </p>
                <div className="text-[11px] font-mono text-[#796c5e]">
                  Tech Stack: {PORTFOLIO_DATA.projects[0].tags.join(', ')}
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
