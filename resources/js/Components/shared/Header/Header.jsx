import React, { useState, useEffect, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import '../../../Components/assets/css/shared/Header.css';

const Header = ({ auth }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedCurrency, setSelectedCurrency] = useState('usd');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'de', label: 'Deutsch' },
  ];

  const currencies = [
    { code: 'usd', label: 'US Dollar' },
    { code: 'eur', label: 'Euro' },
    { code: 'rub', label: 'Russian Ruble' },
  ];

  // Navigation menu items
  const navigationItems = [
    { label: 'Accommodation', href: '/accommodation' },
    { label: 'Dining', href: '/dining' },
    { label: 'Facilities', href: '/facilities' },
    { label: 'Meetings & Events', href: '/meetings-events' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Offers', href: '/offers' },
    { label: 'Our Services', href: '/services' },
    { label: 'Downloads', href: '/downloads' },
  ];

  // Handle scroll behavior for header visibility
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const scrollDifference = currentScrollY - lastScrollY;

    // If at top of page, always show header and reset states
    if (currentScrollY < 50) {
      setIsHeaderVisible(true);
      setIsScrolled(false);
      setIsScrollingUp(false);
      setIsFixed(false);
    }
    // When scrolled down from top
    else {
      // Show header when scrolling up (with threshold to avoid jitter)
      if (scrollDifference < -10) {
        setIsHeaderVisible(true);
        setIsScrollingUp(true);
        setIsFixed(true); // Only set fixed when scrolling up
        setIsScrolled(true); // Only set scrolled when scrolling up from down
      }
      // Hide header when scrolling down (with threshold)
      else if (scrollDifference > 10) {
        setIsHeaderVisible(false);
        setIsScrollingUp(false);
        setIsFixed(false); // Remove fixed state when scrolling down
        setIsScrolled(false); // Remove scrolled state when scrolling down
      }
      // When not scrolling much, maintain current state but ensure header is visible
      else {
        setIsHeaderVisible(true);
      }
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);


  return (
    <>
      <header className={`header ${isHeaderVisible ? 'visible' : 'hidden'} ${isFixed ? 'fixed' : 'at-top'} ${isScrolled ? 'scrolled' : ''}`}>
        {/* Top section with menu button, logo, and dropdowns */}
        <div className="header-top">
          <div className="header-container">
            <div className="header-left">
              <button
                className="menu-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="menu-icon">☰</span>
                <span className="menu-text">Menu</span>
              </button>
            </div>

            <div className="header-center">
              <div className="logo">
                <img
                  src="/storage/logo/Logo.png"
                  alt="Aurora Logo"
                  className="logo-image"
                />
              </div>
            </div>

            <div className="header-right">
              <div className="dropdowns">
                <select
                  className="language-dropdown"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>

                <hr className="dropdown-separator" />

                <select
                  className="currency-dropdown"
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Off-canvas menu overlay */}
      {isMenuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Off-canvas menu */}
      <div className={`off-canvas-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <div className="menu-logo">
            <img
              src="/storage/logo/Logo.png"
              alt="Aurora Logo"
              className="menu-logo-image"
            />
          </div>
          <button
            className="close-button"
            onClick={() => setIsMenuOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Navigation menu items */}
        <div className="menu-nav">
          {navigationItems.map((item, index) => (
            <div
              key={index}
              className="menu-nav-link"
              onClick={(e) => {
                e.preventDefault();
                setIsMenuOpen(false);
              }}
            >
              <span className="menu-nav-text">{item.label}</span>
              <span className="menu-nav-arrow">→</span>
            </div>
          ))}
        </div>

        <div className="menu-footer">
          <div className="menu-dropdowns">
            <select
              className="menu-language-dropdown"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>

            <select
              className="menu-currency-dropdown"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
