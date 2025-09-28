// Demo data for BecomeMember component
export const becomeMemberData = {
    logoSrc: "/storage/logo/Logo.png",
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
