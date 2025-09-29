import React from 'react';
import ResortHero from './home/ResortHero/ResortHero';
import BookingBar from './home/BookingBar/BookingBar';
import ResortIntroGallery from './home/ResortIntroGallery';
import EntertainmentStrip from './home/EntertainmentStrip/EntertainmentStrip';
import DiningCarousel, { diningData } from './home/DiningCarousel';
import ActivityShowcase, { activityData } from './home/ActivityShowcase';
import ActivitiesGrid, { activitiesData } from './home/ActivitiesGrid';
import { WellnessPairsSlider, wellnessData } from './home/WellnessPairsSlider';
import { OffersDeck, offersData } from './home/OffersDeck';
import { EventsShowcase, eventsData } from './home/EventsShowcase';
import { LocationMap, locationData } from './home/LocationMap';
import { GuestReviews, guestReviewsData } from './home/GuestReviews';
import { VerticalSpotlightSlider, spotlightData } from './home/VerticalSpotlightSlider';
import { BecomeMember } from './home/BecomeMember';
import { becomeMemberData, becomeMemberHandlers } from './home/BecomeMember/becomeMemberData';
import Facilities from './home/Facilities';
import { facilitiesData } from './home/Facilities/facilitiesData.jsx';
import RoomsSection from './home/RoomsSection';
import { roomsData } from './home/RoomsSection/roomsData';

// Component mapping object
const componentMap = {
  'resort-hero': {
    component: ResortHero,
    props: {
      onChipClick: (key) => console.log('Chip clicked:', key),
      parallax: true
    }
  },
  'booking-bar': {
    component: BookingBar,
    props: {
      onOpenDates: () => console.log('Open dates picker'),
      onOpenGuests: () => console.log('Open guests picker'),
      onBook: () => console.log('Book now clicked')
    }
  },
  'resort-intro-gallery': {
    component: ResortIntroGallery,
    props: {
      onOpenGallery: (index) => console.log('Gallery opened at index:', index)
    }
  },
  'facilities': {
    component: Facilities,
    props: {
      titleLines: ["Everything you need for the", "perfect resort stay."],
      items: facilitiesData,
      defaultVisible: 9
    }
  },
  'rooms-section': {
    component: RoomsSection,
    props: {
      items: roomsData
    }
  },
  'entertainment-strip': {
    component: EntertainmentStrip,
    props: {}
  },
  'dining-carousel': {
    component: DiningCarousel,
    props: {
      restaurants: diningData
    }
  },
  'activity-showcase': {
    component: ActivityShowcase,
    props: {
      title: activityData.title,
      description: activityData.description,
      images: activityData.images,
      onOpenGallery: (startIndex) => console.log('Activity gallery opened at index:', startIndex)
    }
  },
  'activities-grid': {
    component: ActivitiesGrid,
    props: {
      title: "Sports & fitness activities",
      items: activitiesData
    }
  },
  'wellness-pairs-slider': {
    component: WellnessPairsSlider,
    props: {
      heading: "Reset mind, body and spirit",
      intro: "Discover our curated wellness experiences designed to restore balance and harmony to your daily routine.",
      items: wellnessData
    }
  },
  'offers-deck': {
    component: OffersDeck,
    props: {
      eyebrow: "HOTEL OFFERS",
      heading: "Special offers",
      intro: "Discover exclusive packages and limited-time deals designed to enhance your stay with us.",
      items: offersData
    }
  },
  'events-showcase': {
    component: EventsShowcase,
    props: {
      title: "Private, polished events",
      items: eventsData
    }
  },
  'location-map': {
    component: LocationMap,
    props: {
      heading: locationData.heading,
      addressHtml: locationData.addressHtml,
      phone: locationData.phone,
      email: locationData.email,
      pins: locationData.pins,
      center: locationData.center,
      zoom: locationData.zoom,
      theme: locationData.theme,
      nearest: locationData.nearest
    }
  },
  'guest-reviews': {
    component: GuestReviews,
    props: {
      heading: guestReviewsData.heading,
      subtitle: guestReviewsData.subtitle,
      learnMoreHref: guestReviewsData.learnMoreHref,
      aggregate: guestReviewsData.aggregate,
      reviews: guestReviewsData.reviews,
      pageSize: guestReviewsData.pageSize,
      theme: guestReviewsData.theme
    }
  },
  'vertical-spotlight-slider': {
    component: VerticalSpotlightSlider,
    props: {
      eyebrow: spotlightData.eyebrow,
      heading: spotlightData.heading,
      slides: spotlightData.slides,
      startIndex: 0
    }
  },
  'become-member': {
    component: BecomeMember,
    props: {
      logoSrc: becomeMemberData.logoSrc,
      heading: becomeMemberData.heading,
      intro: becomeMemberData.intro,
      benefits: becomeMemberData.benefits,
      ctaLabel: becomeMemberData.ctaLabel,
      onCtaClick: becomeMemberHandlers.onCtaClick,
      memberPrompt: becomeMemberData.memberPrompt,
      memberLinkLabel: becomeMemberData.memberLinkLabel,
      onMemberLinkClick: becomeMemberHandlers.onMemberLinkClick
    }
  }
};

// Default component order (fallback)
const defaultComponentOrder = [
  'resort-hero',
  'booking-bar',
  'resort-intro-gallery',
  'facilities',
  'rooms-section',
  'entertainment-strip',
  'dining-carousel',
  'activity-showcase',
  'activities-grid',
  'wellness-pairs-slider',
  'offers-deck',
  'events-showcase',
  'location-map',
  'guest-reviews',
  'vertical-spotlight-slider',
  'become-member'
];

export default function HomeComponentRenderer({ componentOrder = null }) {
  // Use provided order or default order
  const orderToUse = componentOrder && componentOrder.length > 0 ? componentOrder : defaultComponentOrder;

  return (
    <div className="home">
      {orderToUse.map((componentData) => {
        // Handle both old format (string) and new format (object)
        const componentId = typeof componentData === 'string' ? componentData : componentData.id;
        const variantName = typeof componentData === 'object' ? componentData.variant_name : null;
        const isVisible = typeof componentData === 'object' ? (componentData.is_visible !== false) : true;

        // Skip hidden components
        if (!isVisible) {
          console.log('Skipping hidden component:', { componentId, variantName, isVisible });
          return null;
        }

        const componentConfig = componentMap[componentId];

        if (!componentConfig) {
          console.warn(`Component ${componentId} not found in componentMap`);
          return null;
        }

        const Component = componentConfig.component;
        const props = componentConfig.props;

        // Create a unique key that includes variant information
        const uniqueKey = variantName ? `${componentId}-${variantName}` : componentId;

        // Merge component data if available
        // For home page display, only use live data (component_data), not draft data
        let variantData = null;
        if (typeof componentData === 'object' && componentData.component_data) {
          // Parse JSON string if it's a string, otherwise use as-is
          variantData = typeof componentData.component_data === 'string'
            ? JSON.parse(componentData.component_data)
            : componentData.component_data;
          console.log('Using live component data for variant:', variantName, variantData);
        }
        const mergedProps = variantData ? { ...props, ...variantData } : props;

        // Debug logging for all components
        console.log('HomeComponentRenderer debug:', {
          componentId,
          variantName,
          componentData,
          variantData,
          hasVariantData: !!variantData,
          componentDataType: typeof componentData,
          componentDataKeys: componentData ? Object.keys(componentData) : []
        });


        console.log('Rendering component:', {
          componentId,
          variantName,
          uniqueKey,
          Component: Component.name || 'Anonymous',
          mergedPropsKeys: Object.keys(mergedProps)
        });

        return (
          <Component
            key={uniqueKey}
            variantName={variantName}
            variantData={variantData}
            {...mergedProps}
          />
        );
      })}
    </div>
  );
}

export { componentMap, defaultComponentOrder };
