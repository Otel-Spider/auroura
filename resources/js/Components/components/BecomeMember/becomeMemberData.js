// Demo data for BecomeMember component
export const becomeMemberData = {
    logoSrc: "https://static.wixstatic.com/media/f57497_e724bd3950134b9badbd5bca5b0824b4~mv2.png/v1/fill/w_223,h_80,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20Head%20Office%20Base%20Horizontal%20Transpa.png",
    heading: "Become a member",
    intro: "When making a booking at this resort:",
    benefits: [
        "I earn Status & Rewards points",
        "I can use my Rewards points",
        "I benefit from advantages",
        "I can take advantage of the Members rate",
        "And much more!"
    ],
    ctaLabel: "Become a member",
    memberPrompt: "Already a member?",
    memberLinkLabel: "Log in to apply your benefits"
};

// Event handlers for demo
export const becomeMemberHandlers = {
    onCtaClick: () => {
        console.log('Become a member clicked');
        // Handle CTA button click
    },
    onMemberLinkClick: () => {
        console.log('Member login clicked');
        // Handle member login link click
    }
};
