import React from 'react';
import { Card } from 'react-bootstrap';
import * as RiIcons from 'react-icons/ri';

const KpiCard = ({ title, value, trend, trendType, icon }) => {
  const getIcon = (iconName) => {
    const IconComponent = RiIcons[iconName];
    return IconComponent ? <IconComponent size={20} /> : null;
  };

  return (
    <Card className="p-3 h-100 p-md-3">
      <div className="kpi">
        <div className="kpi-body">
          <div className="kpi-title">{title}</div>
          <div className="kpi-value">{value}</div>
          <div className="kpi-sub">{trend} from last week</div>
        </div>
        <div className="kpi-icon">
          {getIcon(icon)}
        </div>
      </div>
    </Card>
  );
};

export default KpiCard;
