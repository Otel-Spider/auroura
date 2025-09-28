import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import components and data
import ResortHero from '../Components/components/ResortHero/ResortHero';
import BookingBar from '../Components/components/BookingBar/BookingBar';
import ResortIntroGallery from '../Components/components/ResortIntroGallery';
import EntertainmentStrip from '../Components/components/EntertainmentStrip/EntertainmentStrip';
import DiningCarousel, { diningData } from '../Components/components/DiningCarousel';
import ActivityShowcase, { activityData } from '../Components/components/ActivityShowcase';
import ActivitiesGrid, { activitiesData } from '../Components/components/ActivitiesGrid';
import { WellnessPairsSlider, wellnessData } from '../Components/components/WellnessPairsSlider';
import { OffersDeck, offersData } from '../Components/components/OffersDeck';
import { EventsShowcase, eventsData } from '../Components/components/EventsShowcase';
import { LocationMap, locationData } from '../Components/components/LocationMap';
import { GuestReviews, guestReviewsData } from '../Components/components/GuestReviews';
import { VerticalSpotlightSlider, spotlightData } from '../Components/components/VerticalSpotlightSlider';
import { BecomeMember } from '../Components/components/BecomeMember';
import { becomeMemberData, becomeMemberHandlers } from '../Components/components/BecomeMember/becomeMemberData';
import Facilities from '../Components/components/Facilities';
import { facilitiesData } from '../Components/components/Facilities/facilitiesData.jsx';
import RoomsSection from '../Components/components/RoomsSection';
import { roomsData } from '../Components/components/RoomsSection/roomsData';
import { Header, SiteFooter } from '../Components/shared';
import { footerData } from '../Components/shared/SiteFooter/footerData.jsx';

// Import CSS
import '../Components/App.css';

export default function Home({ auth }) {
  const handleChipClick = (key) => {
    console.log('Chip clicked:', key);
  };

  const handleOpenDates = () => {
    console.log('Open dates picker');
  };

  const handleOpenGuests = () => {
    console.log('Open guests picker');
  };

  const handleBook = () => {
    console.log('Book now clicked');
  };

  const handleOpenGallery = (index) => {
    console.log('Gallery opened at index:', index);
  };

  const handleOpenActivityGallery = (startIndex) => {
    console.log('Activity gallery opened at index:', startIndex);
  };

  return (
    <>
      <Head title="Aurora Resort" />
      <div className="App">
        <Header auth={auth} />
        <main>
          <div className="home">
            <ResortHero
              onChipClick={handleChipClick}
              parallax={true}
            />

            <BookingBar
              onOpenDates={handleOpenDates}
              onOpenGuests={handleOpenGuests}
              onBook={handleBook}
            />

            <ResortIntroGallery
              onOpenGallery={handleOpenGallery}
            />

            <Facilities
              titleLines={["Everything you need for the", "perfect resort stay."]}
              items={facilitiesData}
              defaultVisible={9}
            />

            <RoomsSection
              items={roomsData}
            />

            <EntertainmentStrip />

            <DiningCarousel restaurants={diningData} />

            <ActivityShowcase
              title={activityData.title}
              description={activityData.description}
              images={activityData.images}
              onOpenGallery={handleOpenActivityGallery}
            />

            <ActivitiesGrid
              title="Sports & fitness activities"
              items={activitiesData}
            />

            <WellnessPairsSlider
              heading="Reset mind, body and spirit"
              intro="Discover our curated wellness experiences designed to restore balance and harmony to your daily routine."
              items={wellnessData}
            />

            <OffersDeck
              eyebrow="HOTEL OFFERS"
              heading="Special offers"
              intro="Discover exclusive packages and limited-time deals designed to enhance your stay with us."
              items={offersData}
            />

            <EventsShowcase
              title="Private, polished events"
              items={eventsData}
            />

            <LocationMap
              heading={locationData.heading}
              addressHtml={locationData.addressHtml}
              phone={locationData.phone}
              email={locationData.email}
              pins={locationData.pins}
              center={locationData.center}
              zoom={locationData.zoom}
              theme={locationData.theme}
              nearest={locationData.nearest}
            />

            <GuestReviews
              heading={guestReviewsData.heading}
              subtitle={guestReviewsData.subtitle}
              learnMoreHref={guestReviewsData.learnMoreHref}
              aggregate={guestReviewsData.aggregate}
              reviews={guestReviewsData.reviews}
              pageSize={guestReviewsData.pageSize}
              theme={guestReviewsData.theme}
            />

            <VerticalSpotlightSlider
              eyebrow={spotlightData.eyebrow}
              heading={spotlightData.heading}
              slides={spotlightData.slides}
              startIndex={0}
            />

            <BecomeMember
              logoSrc={becomeMemberData.logoSrc}
              heading={becomeMemberData.heading}
              intro={becomeMemberData.intro}
              benefits={becomeMemberData.benefits}
              ctaLabel={becomeMemberData.ctaLabel}
              onCtaClick={becomeMemberHandlers.onCtaClick}
              memberPrompt={becomeMemberData.memberPrompt}
              memberLinkLabel={becomeMemberData.memberLinkLabel}
              onMemberLinkClick={becomeMemberHandlers.onMemberLinkClick}
            />
          </div>
        </main>
        <SiteFooter
          brand={footerData.brand}
          columns={footerData.columns}
          socials={footerData.socials}
          partnerBrands={footerData.partnerBrands}
          legalLinks={footerData.legalLinks}
          copyrightText={footerData.copyrightText}
        />
      </div>
    </>
  );
}
