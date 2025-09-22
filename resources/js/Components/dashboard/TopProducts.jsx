import React from 'react';
import { Card } from 'react-bootstrap';
import * as RiIcons from 'react-icons/ri';

const TopProducts = ({ products }) => {
  const getIcon = (iconName) => {
    const IconComponent = RiIcons[iconName];
    return IconComponent ? <IconComponent size={20} /> : null;
  };

  return (
    <Card>
      <Card.Header>
        <h6 className="mb-0">Top Products</h6>
      </Card.Header>
      <Card.Body className="p-0">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <div className="product-icon">
              {getIcon(product.icon)}
            </div>
            <div className="product-info">
              <div className="product-title">{product.name}</div>
              <div className="product-sales">{product.sales}</div>
            </div>
            <div className="product-price">
              {product.price}
            </div>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

export default TopProducts;
