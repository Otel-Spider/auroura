import React from "react";
import "../../assets/css/home/activities-grid.css";

const ActivitiesGrid = ({
  title = "Sports & fitness activities",
  items = []
}) => {
  return (
    <section className="activities-grid-section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="activities-title">{title}</h2>
          </div>
        </div>
        
        <div className="row g-4">
          {items.map((activity) => (
            <div key={activity.id} className="col-12 col-md-6 col-lg-4">
              <div className="activity-card">
                <div className="activity-image">
                  <img 
                    src={activity.image} 
                    alt={activity.alt || activity.title}
                    loading="lazy"
                  />
                </div>
                
                <div className="activity-content">
                  <h3 className="activity-title">{activity.title}</h3>
                  <p className="activity-description">{activity.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActivitiesGrid;
