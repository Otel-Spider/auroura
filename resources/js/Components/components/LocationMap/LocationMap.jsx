import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../assets/css/home/location-map.css';

const LocationMap = ({
  heading = "Location",
  addressHtml = "123 Resort Avenue<br/>Paradise Island, Bahamas",
  phone = "+1 (555) 123-4567",
  email = "info@resort.com",
  pins = [],
  center,
  zoom = 13,
  tilesUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  tilesAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  theme = {},
  nearest = []
}) => {
  const [expandedNearest, setExpandedNearest] = useState(false);
  const [map, setMap] = useState(null);

  // Merge theme with defaults
  const mergedTheme = useMemo(() => ({
    pinColor: '#d1bb4f',
    ringColor: '#d1bb4f',
    ringFill: 'rgba(209,187,79,.12)',
    textColor: '#111321',
    headingColor: '#0f1d35',
    linkColor: '#0f1d35',
    panelBg: 'rgba(255,255,255,.92)',
    mapFilter: 'none',
    ...theme
  }), [theme]);

  // Create custom pin icon
  const createPinIcon = (color) => {
    const svgIcon = `
      <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 11.045 16 24 16 24s16-12.955 16-24c0-8.837-7.163-16-16-16z" fill="${color}" stroke="#fff" stroke-width="2"/>
        <circle cx="16" cy="16" r="6" fill="#fff"/>
      </svg>
    `;

    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
      iconSize: [32, 40],
      iconAnchor: [16, 40],
      popupAnchor: [0, -40]
    });
  };

  // Calculate map bounds from pins
  const mapBounds = useMemo(() => {
    if (pins.length === 0) return null;

    const lats = pins.map(pin => pin.lat);
    const lngs = pins.map(pin => pin.lng);

    return [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)]
    ];
  }, [pins]);

  // Fit map to bounds when pins change
  useEffect(() => {
    if (map && mapBounds && !center) {
      map.fitBounds(mapBounds, { padding: [20, 20] });
    }
  }, [map, mapBounds, center]);

  // Create pin icon with theme color
  const pinIcon = useMemo(() => createPinIcon(mergedTheme.pinColor), [mergedTheme.pinColor]);

  // Handle nearest attractions expand/collapse
  const toggleNearest = () => {
    setExpandedNearest(!expandedNearest);
  };

  const visibleNearest = expandedNearest ? nearest : nearest.slice(0, 3);

  return (
    <section className="location-map-section">
      <div className="location-map-container">
        {/* Desktop Layout - Map as background with overlaid info panel */}
        <div className="location-desktop-layout d-none d-md-block">
          <MapContainer
            center={center || (pins.length > 0 ? [pins[0].lat, pins[0].lng] : [25.7617, -80.1918])}
            zoom={zoom}
            className="location-map"
            whenCreated={setMap}
            scrollWheelZoom={false}
            style={{ filter: mergedTheme.mapFilter }}
          >
            <TileLayer
              url={tilesUrl}
              attribution={tilesAttribution}
            />

            {pins.map((pin) => (
              <React.Fragment key={pin.id}>
                <Marker
                  position={[pin.lat, pin.lng]}
                  icon={pinIcon}
                  aria-label={`Location: ${pin.title}`}
                >
                  <Popup>
                    <div className="location-popup">
                      <h4 className="popup-title">{pin.title}</h4>
                      {pin.subtitle && (
                        <p className="popup-subtitle">{pin.subtitle}</p>
                      )}
                    </div>
                  </Popup>
                </Marker>

                {pin.radiusMeters && (
                  <Circle
                    center={[pin.lat, pin.lng]}
                    radius={pin.radiusMeters}
                    pathOptions={{
                      color: mergedTheme.ringColor,
                      fillColor: mergedTheme.ringFill,
                      fillOpacity: 0.15,
                      weight: 2
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </MapContainer>

          <div className="location-info-panel">
            <div className="container-xxl">
              <div className="row">
                <div className="col-12 col-md-5 col-lg-4">
                  <div
                    className="info-panel"
                    style={{
                      backgroundColor: mergedTheme.panelBg,
                      color: mergedTheme.textColor
                    }}
                  >
                    <h2
                      className="info-heading"
                      style={{ color: mergedTheme.headingColor }}
                    >
                      {heading}
                    </h2>

                    <div
                      className="info-address"
                      dangerouslySetInnerHTML={{ __html: addressHtml }}
                      style={{ color: mergedTheme.textColor }}
                    />

                    <div className="info-contact">
                      <p className="contact-item">
                        <a
                          href={`tel:${phone}`}
                          style={{ color: mergedTheme.linkColor }}
                        >
                          {phone}
                        </a>
                      </p>
                      <p className="contact-item">
                        <a
                          href={`mailto:${email}`}
                          style={{ color: mergedTheme.linkColor }}
                        >
                          {email}
                        </a>
                      </p>
                    </div>

                    {nearest.length > 0 && (
                      <div className="nearest-attractions">
                        <h3 className="nearest-title">Nearest attractions</h3>
                        <ul className="nearest-list">
                          {visibleNearest.map((item, index) => (
                            <li key={index} className="nearest-item">
                              <span className="nearest-label">{item.label}</span>
                              <span className="nearest-distance">{item.km} km</span>
                            </li>
                          ))}
                        </ul>
                        {nearest.length > 3 && (
                          <button
                            className="nearest-toggle"
                            onClick={toggleNearest}
                            style={{ color: mergedTheme.linkColor }}
                          >
                            {expandedNearest ? 'See less' : 'See more'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Map above info panel */}
        <div className="location-mobile-layout d-md-none">
          <div className="location-mobile-map">
            <MapContainer
              center={center || (pins.length > 0 ? [pins[0].lat, pins[0].lng] : [25.7617, -80.1918])}
              zoom={zoom}
              className="location-map"
              whenCreated={setMap}
              scrollWheelZoom={false}
              style={{ filter: mergedTheme.mapFilter }}
            >
              <TileLayer
                url={tilesUrl}
                attribution={tilesAttribution}
              />

              {pins.map((pin) => (
                <React.Fragment key={pin.id}>
                  <Marker
                    position={[pin.lat, pin.lng]}
                    icon={pinIcon}
                    aria-label={`Location: ${pin.title}`}
                  >
                    <Popup>
                      <div className="location-popup">
                        <h4 className="popup-title">{pin.title}</h4>
                        {pin.subtitle && (
                          <p className="popup-subtitle">{pin.subtitle}</p>
                        )}
                      </div>
                    </Popup>
                  </Marker>

                  {pin.radiusMeters && (
                    <Circle
                      center={[pin.lat, pin.lng]}
                      radius={pin.radiusMeters}
                      pathOptions={{
                        color: mergedTheme.ringColor,
                        fillColor: mergedTheme.ringFill,
                        fillOpacity: 0.15,
                        weight: 2
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </MapContainer>
          </div>

          <div className="location-mobile-info">
            <div className="container">
              <div
                className="info-panel"
                style={{
                  backgroundColor: mergedTheme.panelBg,
                  color: mergedTheme.textColor
                }}
              >
                <h2
                  className="info-heading"
                  style={{ color: mergedTheme.headingColor }}
                >
                  {heading}
                </h2>

                <div
                  className="info-address"
                  dangerouslySetInnerHTML={{ __html: addressHtml }}
                  style={{ color: mergedTheme.textColor }}
                />

                <div className="info-contact">
                  <p className="contact-item">
                    <a
                      href={`tel:${phone}`}
                      style={{ color: mergedTheme.linkColor }}
                    >
                      {phone}
                    </a>
                  </p>
                  <p className="contact-item">
                    <a
                      href={`mailto:${email}`}
                      style={{ color: mergedTheme.linkColor }}
                    >
                      {email}
                    </a>
                  </p>
                </div>

                {nearest.length > 0 && (
                  <div className="nearest-attractions">
                    <h3 className="nearest-title">Nearest attractions</h3>
                    <ul className="nearest-list">
                      {visibleNearest.map((item, index) => (
                        <li key={index} className="nearest-item">
                          <span className="nearest-label">{item.label}</span>
                          <span className="nearest-distance">{item.km} km</span>
                        </li>
                      ))}
                    </ul>
                    {nearest.length > 3 && (
                      <button
                        className="nearest-toggle"
                        onClick={toggleNearest}
                        style={{ color: mergedTheme.linkColor }}
                      >
                        {expandedNearest ? 'See less' : 'See more'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;
