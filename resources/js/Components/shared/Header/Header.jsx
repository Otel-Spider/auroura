import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import '../../../Components/assets/css/shared/Header.css';

const Header = ({ auth }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedCurrency, setSelectedCurrency] = useState('usd');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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


  return (
    <>
      <header className="header">
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
                  src="https://static.wixstatic.com/media/f57497_e724bd3950134b9badbd5bca5b0824b4~mv2.png/v1/fill/w_223,h_80,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20Head%20Office%20Base%20Horizontal%20Transpa.png"
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
          <h2>Menu</h2>
          <button
            className="close-button"
            onClick={() => setIsMenuOpen(false)}
          >
            ✕
          </button>
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
