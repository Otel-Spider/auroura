import React from 'react';
import { Card } from 'react-bootstrap';
import * as RiIcons from 'react-icons/ri';

const NewCustomers = ({ customers }) => {
  return (
    <Card>
      <Card.Header>
        <h6 className="mb-0">New Customers</h6>
      </Card.Header>
      <Card.Body className="p-0">
        {customers.map((customer) => (
          <div key={customer.id} className="list-item">
            <div className="list-avatar">
              {customer.avatar}
            </div>
            <div className="list-content">
              <div className="list-title">{customer.name}</div>
              <div className="list-subtitle">{customer.email}</div>
            </div>
            <div className="list-actions">
              <button className="list-action-btn">
                <RiIcons.RiMailLine size={16} />
              </button>
              <button className="list-action-btn">
                <RiIcons.RiBellLine size={16} />
              </button>
              <button className="list-action-btn">
                <RiIcons.RiMore2Fill size={16} />
              </button>
            </div>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

export default NewCustomers;
