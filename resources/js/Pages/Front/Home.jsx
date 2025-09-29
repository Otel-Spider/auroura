import React from 'react';
import ResortHero from '../../Components/home/ResortHero/ResortHero';
import BookingBar from '../../Components/home/BookingBar/BookingBar';
import ResortIntroGallery from '../../Components/home/ResortIntroGallery';
import EntertainmentStrip from '../../Components/home/EntertainmentStrip/EntertainmentStrip';
import DiningCarousel, { diningData } from '../../Components/home/DiningCarousel';
import ActivityShowcase, { activityData } from '../../Components/home/ActivityShowcase';
import ActivitiesGrid, { activitiesData } from '../../Components/home/ActivitiesGrid';
import { WellnessPairsSlider, wellnessData } from '../../Components/home/WellnessPairsSlider';
import { OffersDeck, offersData } from '../../Components/home/OffersDeck';
import { EventsShowcase, eventsData } from '../../Components/home/EventsShowcase';
import { LocationMap, locationData } from '../../Components/home/LocationMap';
import { GuestReviews, guestReviewsData } from '../../Components/home/GuestReviews';
import { VerticalSpotlightSlider, spotlightData } from '../../Components/home/VerticalSpotlightSlider';
import { BecomeMember } from '../../Components/home/BecomeMember';
import { becomeMemberData, becomeMemberHandlers } from '../../Components/home/BecomeMember/becomeMemberData';
import Facilities from '../../Components/home/Facilities';
import { facilitiesData } from '../../Components/home/Facilities/facilitiesData';
import RoomsSection from '../../Components/home/RoomsSection';
import { roomsData } from '../../Components/home/RoomsSection/roomsData';

const Home = () => {
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
    <div className="home">
      <ResortHero
        logoSrc="/storage/logo/Logo.png"
        bgImageUrl="https://qln0xxt0hw0ogxv1.imgix.net/https%3A%2F%2Fimages.ctfassets.net%2F944fk97h13dc%2F4xadrTCxgBoi6rstnDUJsI%2Ff14ca28071ea66bcf22a16a9f058632a%2FSSH_General_1A.jpg?ixlib=js-3.8.0&auto=compress&fm=webp&w=1536&s=d3d14ec710f6cfa82200a6d13050e8bd"
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
  );
};

export default Home;
