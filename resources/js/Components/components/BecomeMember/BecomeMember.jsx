import React from 'react';
import '../../assets/css/home/become-member.css';

const BecomeMember = ({
  logoSrc,
  heading = "Become a member",
  intro = "When making a booking at this resort:",
  benefits = [],
  ctaLabel = "Become a member",
  onCtaClick,
  memberPrompt = "Already a member?",
  memberLinkLabel = "Log in to apply your benefits",
  onMemberLinkClick
}) => {
  return (
    <section className="become-member">
      <div className="container">
        <div className="row align-items-center">
          {/* Logo Column */}
          <div className="col-12 col-md-4">
            <div className="logo-container">
              <img
                src={logoSrc}
                alt="ALL - Accor Live Limitless"
                className="logo"
              />
            </div>
          </div>

          {/* Divider Column (Desktop Only) */}
          <div className="col-12 col-md-auto d-none d-md-flex">
            <div className="divider"></div>
          </div>

          {/* Content Column */}
          <div className="col-12 col-md-5">
            <div className="content">
              <h2 className="heading">{heading}</h2>

              <p className="intro">{intro}</p>

              <ul className="benefits-list">
                {benefits.map((benefit, index) => (
                  <li key={index} className="benefit">
                    <div className="dot" aria-hidden="true"></div>
                    <span className="benefit-text">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="actions">
                <button
                  className="cta-btn"
                  onClick={onCtaClick}
                  type="button"
                >
                  {ctaLabel}
                </button>

                <div className="member-link-container">
                  <span className="member-prompt">{memberPrompt}</span>
                  <button
                    className="member-link"
                    onClick={onMemberLinkClick}
                    type="button"
                  >
                    {memberLinkLabel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeMember;
