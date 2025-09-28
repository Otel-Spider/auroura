import React from 'react';

const DashboardFooter = () => {
  return (
    <div className="mt-4 pt-2" style={{
      borderTop: '1px solid var(--line)',
      marginTop: 'auto',
      padding: '1rem 2rem',
      textAlign: 'center'
    }}>
      <p className="mb-0 text-muted" style={{ fontSize: '0.7rem' }}>
        © 2025 Otel Spider. All rights reserved.
      </p>
    </div>
  );
};

export default DashboardFooter;
