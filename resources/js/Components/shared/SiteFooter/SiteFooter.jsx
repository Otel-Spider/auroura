import React from 'react';
import './site-footer.css';

const SiteFooter = ({
  brand = {
    titleLine1: "All Inclusive",
    titleLine2: "COLLECTION",
    href: "/"
  },
  columns = [
    {
      title: "DISCOVER",
      items: [
        { label: "The Experience", href: "#" },
        { label: "Hotels & Resorts", href: "#" },
        { label: "Destinations", href: "#" },
      ],
    },
    {
      title: "EXPLORE",
      items: [
        { label: "Offers", href: "#" },
        { label: "Accor Live Limitless", href: "#" },
      ],
    },
  ],
  socials = [
    { label: "Instagram", href: "#", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
    { label: "Facebook", href: "#", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
    { label: "YouTube", href: "#", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75,15.02 15.5,11.75 9.75,8.48"/></svg> },
    { label: "LinkedIn", href: "#", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
  ],
  partnerBrands = [
    { src: "https://qln0xxt0hw0ogxv1.imgix.net/https%3A%2F%2Fimages.ctfassets.net%2F944fk97h13dc%2FZB5OqAoNZjCg8OZXqRZN1%2F2442a3fcd053befa028d4fef4d11350d%2Fvector__3_.svg?ixlib=js-3.8.0&auto=compress&fm=webp&w=1536&s=79e486381c9bad626cb1a9c6029f4085", alt: "Rixos" },
    { src: "https://qln0xxt0hw0ogxv1.imgix.net/https%3A%2F%2Fimages.ctfassets.net%2F944fk97h13dc%2FZB5OqAoNZjCg8OZXqRZN1%2F2442a3fcd053befa028d4fef4d11350d%2Fvector__3_.svg?ixlib=js-3.8.0&auto=compress&fm=webp&w=1536&s=79e486381c9bad626cb1a9c6029f4085", alt: "SO/" },
    { src: "https://qln0xxt0hw0ogxv1.imgix.net/https%3A%2F%2Fimages.ctfassets.net%2F944fk97h13dc%2FZB5OqAoNZjCg8OZXqRZN1%2F2442a3fcd053befa028d4fef4d11350d%2Fvector__3_.svg?ixlib=js-3.8.0&auto=compress&fm=webp&w=1536&s=79e486381c9bad626cb1a9c6029f4085", alt: "Swissôtel" },
    { src: "https://qln0xxt0hw0ogxv1.imgix.net/https%3A%2F%2Fimages.ctfassets.net%2F944fk97h13dc%2FZB5OqAoNZjCg8OZXqRZN1%2F2442a3fcd053befa028d4fef4d11350d%2Fvector__3_.svg?ixlib=js-3.8.0&auto=compress&fm=webp&w=1536&s=79e486381c9bad626cb1a9c6029f4085", alt: "HYDE" },
    { src: "https://qln0xxt0hw0ogxv1.imgix.net/https%3A%2F%2Fimages.ctfassets.net%2F944fk97h13dc%2FZB5OqAoNZjCg8OZXqRZN1%2F2442a3fcd053befa028d4fef4d11350d%2Fvector__3_.svg?ixlib=js-3.8.0&auto=compress&fm=webp&w=1536&s=79e486381c9bad626cb1a9c6029f4085", alt: "SLS" },
  ],
  legalLinks = [
    { label: "Terms & Conditions", href: "#" },
    { label: "Membership T&Cs", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Cookies", href: "#" },
    { label: "Web Accessibility", href: "#" },
    { label: "Legal Notice", href: "#" },
    { label: "Do Not Sell My Personal Information", href: "#" },
  ],
  copyrightText = "© 2025 All Rights Reserved"
}) => {
  return (
    <footer className="site-footer">
      <div className="container-fluid">
        {/* Brand logo */}
        <div className="row">
          <div className="col-12 text-start mb-4">
            <a href={brand.href} className="text-decoration-none">
              <img 
                src="https://static.wixstatic.com/media/f57497_e724bd3950134b9badbd5bca5b0824b4~mv2.png/v1/fill/w_223,h_80,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20Head%20Office%20Base%20Horizontal%20Transpa.png"
                alt="Aurora Logo"
                className="logo-image"
              />
            </a>
          </div>
        </div>

        {/* Navigation sections */}
        <div className="row g-4">
          {/* Navigation columns */}
          {columns.map((col, index) => (
            <div key={col.title} className="col-12 col-md-3">
              <div className="section-title">{col.title}</div>
              <ul className="list-unstyled mb-0">
                {col.items.map(item => (
                  <li key={item.label} className="mb-2">
                    <a 
                      href={item.href} 
                      target={item.external ? "_blank" : undefined} 
                      rel={item.external ? "noopener noreferrer" : undefined}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social media */}
          <div className="col-12 col-md-3">
            <div className="section-title">Follow us</div>
            <div className="d-flex gap-2">
              {socials.map(social => (
                <a 
                  key={social.label} 
                  href={social.href} 
                  aria-label={`Follow us on ${social.label}`} 
                  className="social-btn"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Partner logos */}
        <div className="row brand-logos border-top justify-content-center gy-4">
          {partnerBrands.map(brand => (
            <div key={brand.alt} className="col-auto">
              {brand.href ? (
                <a href={brand.href} aria-label={brand.alt}>
                  <img src={brand.src} alt={brand.alt} />
                </a>
              ) : (
                <img src={brand.src} alt={brand.alt} />
              )}
            </div>
          ))}
        </div>

        {/* Bottom legal bar */}
        <div className="pt-3 mt-3 border-top border-opacity-25 d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <nav className="legal mb-2 mb-lg-0">
            {legalLinks.map((link, index) => (
              <React.Fragment key={link.label}>
                <a href={link.href} className="me-3">{link.label}</a>
              </React.Fragment>
            ))}
          </nav>
          <div className="text-nowrap">{copyrightText}</div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
