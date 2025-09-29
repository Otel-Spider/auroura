import React from "react";
import "../../assets/css/home/events-showcase.css";

const EventsShowcase = ({
  title = "Private, polished events",
  items = []
}) => {
  return (
    <section className="events-showcase-section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="events-title">{title}</h2>
          </div>
        </div>
        
        <div className="row g-4">
          {items.map((event) => (
            <div key={event.id} className="col-12 col-md-6 col-lg-4">
              <div className="event-card">
                <div className="event-image">
                  <img 
                    src={event.image} 
                    alt={event.alt || event.title}
                    loading="lazy"
                  />
                </div>
                
                <div className="event-content">
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-description">{event.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsShowcase;
