import React from 'react';
import { Card } from 'react-bootstrap';
import * as RiIcons from 'react-icons/ri';

const SocialLeads = ({ leads }) => {
  const getIcon = (iconName) => {
    const IconComponent = RiIcons[iconName];
    return IconComponent ? <IconComponent size={16} /> : null;
  };

  // Colorful colors for social icons
  const colorfulColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <Card>
      <Card.Header>
        <h6 className="mb-0">Social Leads</h6>
      </Card.Header>
      <Card.Body className="p-0">
        {leads.map((lead, index) => (
          <div key={lead.id} className="social-item">
            <div className="social-info">
              <div
                className="social-icon"
                style={{ backgroundColor: colorfulColors[index % colorfulColors.length] }}
              >
                {getIcon(lead.icon)}
              </div>
              <div className="social-name">{lead.name}</div>
            </div>
            <div className="social-metrics">
              <div className="social-percentage">{lead.percentage}</div>
              <div className="social-value">{lead.value}</div>
            </div>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

export default SocialLeads;
