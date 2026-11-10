import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container } from '../../components/common/Container';
import { TOC_BY_TAB } from '../../components/legal/legalData';
import { LegalHeader } from '../../components/legal/LegalHeader';
import { LegalMobileQuickNav, LegalDesktopSidebar } from '../../components/legal/LegalSidebar';
import { AccountDeletionSection } from '../../components/legal/AccountDeletionSection';
import { TermsConditionsSection } from '../../components/legal/TermsConditionsSection';
import { PrivacyPolicySection } from '../../components/legal/PrivacyPolicySection';

export const PrivacyPolicyPage = ({ initialTab = 'privacy' }) => {
  const location = useLocation();

  const activeTab = location.pathname.includes('terms')
    ? 'terms'
    : location.pathname.includes('account-deletion')
    ? 'deletion'
    : initialTab;

  const currentTableOfContents = TOC_BY_TAB[activeTab] || TOC_BY_TAB.privacy;
  const [selectedSection, setSelectedSection] = useState(currentTableOfContents[0].id);

  // Automatically fall back to first section of active tab when route switches tabs
  const activeSection = currentTableOfContents.some((item) => item.id === selectedSection)
    ? selectedSection
    : currentTableOfContents[0].id;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleSelectTab = (_tab, defaultSectionId) => {
    setSelectedSection(defaultSectionId);
  };

  // Smooth scroll handler accounting for fixed navbar and ticker height
  const scrollToAnchor = (id) => {
    setSelectedSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -130;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Scrollspy to highlight active section in navigation sidebar
  useEffect(() => {
    const handleScroll = () => {
      for (const item of currentTableOfContents) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 170 && rect.bottom >= 170) {
            setSelectedSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentTableOfContents]);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
      <LegalHeader activeTab={activeTab} onSelectTab={handleSelectTab} />

      <LegalMobileQuickNav
        items={currentTableOfContents}
        activeSection={activeSection}
        onSelectSection={scrollToAnchor}
      />

      <section className="py-10 sm:py-14 bg-white text-slate-900">
        <Container className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <LegalDesktopSidebar
              items={currentTableOfContents}
              activeSection={activeSection}
              onSelectSection={scrollToAnchor}
            />

            <main className="lg:col-span-8 space-y-8 sm:space-y-10">
              {activeTab === 'deletion' ? (
                <AccountDeletionSection />
              ) : activeTab === 'terms' ? (
                <TermsConditionsSection />
              ) : (
                <PrivacyPolicySection />
              )}
            </main>
          </div>
        </Container>
      </section>
    </div>
  );
};
