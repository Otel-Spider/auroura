import React from 'react';
import { Card, Table, Badge, Button } from 'react-bootstrap';
import * as RiIcons from 'react-icons/ri';

const OrdersTable = ({ orders }) => {
  const getIcon = (iconName) => {
    const IconComponent = RiIcons[iconName];
    return IconComponent ? <IconComponent size={16} /> : null;
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge-soft',
      dispatched: 'badge-soft badge-soft--mid',
      completed: 'badge-soft badge-soft--ok'
    };

    return (
      <Badge className={statusClasses[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Card>
      <Card.Header>
        <h6 className="mb-0">Orders Summary</h6>
      </Card.Header>
      <Card.Body className="p-0">
        <Table responsive className="table table-dark table-borderless align-middle mb-0">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <span className="text-primary">{order.id}</span>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-2"
                      style={{
                        width: '32px',
                        height: '32px',
                        background: 'var(--accent)',
                        color: 'white'
                      }}
                    >
                      {getIcon(order.productIcon)}
                    </div>
                    <span>{order.product}</span>
                  </div>
                </td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td className="text-success fw-bold">{order.price}</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button variant="outline-light" size="sm" className="opacity-75">
                      <RiIcons.RiEyeLine size={16} />
                    </Button>
                    <Button variant="outline-light" size="sm" className="opacity-75">
                      <RiIcons.RiDeleteBin6Line size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default OrdersTable;
