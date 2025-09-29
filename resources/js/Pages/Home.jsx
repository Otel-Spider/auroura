import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

// Import the new component renderer
import HomeComponentRenderer from '../Components/HomeComponentRenderer';
import { Header, SiteFooter } from '../Components/shared';
import { footerData } from '../Components/shared/SiteFooter/footerData.jsx';

// Import CSS
import '../Components/App.css';

export default function Home({ auth }) {
  const [componentOrder, setComponentOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load component order on mount and periodically refresh
  useEffect(() => {
    const loadComponentOrder = async () => {
      try {
        console.log('Home: Loading component order...');
        const response = await axios.get('/api/home-customization/component-order');
        console.log('Home: Component order loaded:', response.data);

        if (response.data.components && response.data.components.length > 0) {
          // Pass the full component data to the renderer
          console.log('Home: Setting component order with', response.data.components.length, 'components');
          setComponentOrder(response.data.components);
        } else {
          console.log('Home: No components found, using default order');
          setComponentOrder(null); // This will trigger default order
        }
      } catch (err) {
        console.error('Error loading component order:', err);
        // If there's an error, componentOrder will remain null and default order will be used
        setComponentOrder(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadComponentOrder();

    // Listen for storage events to refresh when data changes
    const handleStorageChange = (e) => {
      if (e.key === 'hero-data-updated') {
        loadComponentOrder();
        localStorage.removeItem('hero-data-updated'); // Clean up
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Refresh data every 10 seconds to pick up changes
    const refreshInterval = setInterval(loadComponentOrder, 10000);

    // Cleanup interval and event listener on unmount
    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <>
      <Head title="Aurora Resort" />
      <div className="App">
        <Header auth={auth} />
        <main>
          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <HomeComponentRenderer componentOrder={componentOrder} />
              <SiteFooter
                brand={footerData.brand}
                columns={footerData.columns}
                socials={footerData.socials}
                partnerBrands={footerData.partnerBrands}
                legalLinks={footerData.legalLinks}
                copyrightText={footerData.copyrightText}
              />
            </>
          )}
        </main>
      </div>
    </>
  );
}
