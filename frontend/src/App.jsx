import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; 

// Fix default Marker icon paths (due to parcel/webpack issues). 
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

function App() {
  // States for user input
  const [userQuery, setUserQuery] = useState('I want a quiet hotel with great Wi-Fi');
  const [lat, setLat] = useState(48.8566);
  const [lng, setLng] = useState(2.3522);

  // For the hero animation and results
  const [showHero, setShowHero] = useState(true);
  const [showResults, setShowResults] = useState(false);

  // Hotel data from the backend
  const [recommendations, setRecommendations] = useState([]);

  // For “More details” modal
  const [selectedHotel, setSelectedHotel] = useState(null);

  // For toggling map popup
  const [showMapPopup, setShowMapPopup] = useState(false);

  // Animate "EcoStay" text by cycling fonts
  const [ecoStayFont, setEcoStayFont] = useState("'Arial', sans-serif");
  const fontFamilies = [
    "'Arial', sans-serif",
    "'Pacifico', cursive",
    "'Merriweather', serif",
    "'Monoton', cursive",
    "'Roboto', sans-serif",
  ];
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % fontFamilies.length;
      setEcoStayFont(fontFamilies[index]);
    }, 500); 
    return () => clearInterval(interval);
  }, []);

  // Handler for searching hotels
  const handleSearch = async () => {
    try {
      const body = {
        user_query: userQuery,
        user_lat: lat,
        user_lng: lng,
        top_n: 4,
      };
      const response = await fetch('http://localhost:8000/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      // Hide the hero
      setShowHero(false);
      // Wait a bit, then show results
      setTimeout(() => {
        setRecommendations(data.recommendations || []);
        setShowResults(true);
      }, 400);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setShowHero(false);
      setRecommendations([]);
      setShowResults(true);
    }
  };

  // Convert /10 rating to a star-based rating out of 5
  const renderStars = (rating) => {
    const ratingOutOfFive = (rating / 10) * 5;
    const fullStars = Math.floor(ratingOutOfFive);
    const halfStar = ratingOutOfFive - fullStars >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`star-${i}`} style={styles.starFilled}>
          ★
        </span>
      );
    }
    if (halfStar) {
      stars.push(<span key="half-star" style={styles.starFilled}>★</span>);
    }
    while (stars.length < 5) {
      stars.push(
        <span key={`empty-${stars.length}`} style={styles.starEmpty}>
          ★
        </span>
      );
    }
    return stars;
  };

  // Toggles the map popup
  const handleOpenMapPopup = () => {
    setShowMapPopup(true);
  };
  const handleCloseMapPopup = () => {
    setShowMapPopup(false);
  };

  // "More" details popup
  const handleSelectHotel = (hotel) => {
    setSelectedHotel(hotel);
  };
  const handleCloseDetails = () => {
    setSelectedHotel(null);
  };

  // Leaflet map event: update lat/lng on click
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setLat(e.latlng.lat);
        setLng(e.latlng.lng);
      },
    });
    return (
      <Marker position={[lat, lng]}>
        <Popup>Your chosen location!</Popup>
      </Marker>
    );
  }

  return (
    <div style={styles.appContainer}>
      {/* Navbar */}
      <header style={styles.navbar}>
        <div style={styles.navLeft}>
          <h3 style={styles.logo}>EcoStay</h3>
        </div>
        <nav style={styles.navRight}>
          <a href="#about" style={styles.navLink}>About us</a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            style={{ marginLeft: '1rem' }}
          >
            <img
              src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
              alt="GitHub"
              style={{ width: 24, height: 24 }}
            />
          </a>
        </nav>
      </header>

      {/* Hero section */}
      <section
        style={{
          ...styles.heroSection,
          ...(showHero ? styles.heroVisible : styles.heroHidden),
        }}
      >
        <div style={styles.heroText}>
          <div style={styles.heroLine}>Find your dream hotel</div>
          <div style={styles.heroLine}>
            Find your <span style={{ fontFamily: ecoStayFont }}>EcoStay</span>
          </div>
        </div>
      </section>

      {/* Search bar */}
      <div style={styles.searchArea}>
        <input
          style={styles.searchInput}
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
        />
        {/* A modern map icon (SVG). Replace with your own logo if you wish */}
        <button style={styles.mapButton} onClick={handleOpenMapPopup}>
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="#333"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ display: 'block' }}
            viewBox="0 0 24 24"
          >
            <path d="M1 6l7.5 2v13L1 19V6zm7.5 2l8-2v13l-8 2V8zM16.5 6L23 4v13l-6.5 2V6z" />
            <circle cx="10" cy="10" r="2" />
          </svg>
        </button>
        <button style={styles.searchButton} onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Cards */}
      {showResults && (
        <div style={styles.cardsContainer}>
          {recommendations.map((hotel, idx) => (
            <div style={styles.card} key={idx}>
              <h2 style={styles.cardTitle}>{hotel.Name}</h2>
              <div style={styles.starsRow}>{renderStars(hotel.Rating)}</div>
              <div style={styles.cardActions}>
                <a
                  href={hotel.HotelLink}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.linkIcon}
                >
                  🔗
                </a>
                <button
                  style={styles.moreButton}
                  onClick={() => handleSelectHotel(hotel)}
                >
                  More
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Map popup (Leaflet) */}
      {showMapPopup && (
        <div style={styles.modalBackdrop} onClick={handleCloseMapPopup}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Pick a place in Paris</h3>
            <p style={{ margin: '4px 0' }}>
              Current location: <b>lat={lat}, lng={lng}</b>
            </p>

            <MapContainer
              center={[lat, lng]}
              zoom={13}
              scrollWheelZoom={true}
              style={{ width: '100%', height: '300px', borderRadius: '8px' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
                  OpenStreetMap
                  </a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker />
            </MapContainer>

            <button style={styles.closeModalButton} onClick={handleCloseMapPopup}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* "More details" popup */}
      {selectedHotel && (
        <div style={styles.modalBackdrop} onClick={handleCloseDetails}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{selectedHotel.Name}</h2>
            <p>
              <strong>Address:</strong> {selectedHotel.address}
            </p>
            <p style={{ whiteSpace: 'pre-line', marginTop: '1rem' }}>
              {selectedHotel.description}
            </p>
            <button style={styles.closeModalButton} onClick={handleCloseDetails}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Some basic styling
const styles = {
  appContainer: {
    width: '100%',
    height: '100%', 
    minHeight: '100vh',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    // The gradient from the original design
    background: 'linear-gradient(135deg, #dfffe8 0%, #e7d7ff 100%)',
    fontFamily: 'sans-serif',
  },
  navbar: {
    display: 'flex',
    alignItems: 'center',
    height: 60,
    padding: '0 2rem',
    backgroundColor: 'transparent', // same gradient background showing through
    justifyContent: 'space-between',
  },
  navLeft: {
    display: 'flex',
  },
  logo: {
    margin: 0,
    fontSize: '1.5rem',
    color: '#333',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
  },
  navLink: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: 500,
  },
  heroSection: {
    textAlign: 'center',
    transition: 'all 0.4s ease',
    overflow: 'hidden',
  },
  heroVisible: {
    padding: '5rem 1rem 2rem',
    opacity: 1,
    transform: 'translateY(0)',
  },
  heroHidden: {
    padding: 0,
    height: 0,
    opacity: 0,
    transform: 'translateY(-40px)',
  },
  heroText: {
    fontSize: '3.5rem',
    fontWeight: '600',
    lineHeight: '1.3em',
    color: '#333',
  },
  heroLine: {
    marginBottom: '0.5em',
  },
  searchArea: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem',
    flexShrink: 0,
  },
  searchInput: {
    width: '350px',
    maxWidth: '80%',
    padding: '0.75rem 1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  mapButton: {
    border: 'none',
    backgroundColor: '#fff',
    padding: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  },
  searchButton: {
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
    padding: '2rem',
    maxWidth: '1400px',
    width: '100%',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  cardTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.2rem',
    color: '#333',
  },
  starsRow: {
    fontSize: '1.25rem',
    marginBottom: '0.5rem',
  },
  starFilled: {
    color: '#FFD700',
  },
  starEmpty: {
    color: '#ccc',
  },
  cardActions: {
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkIcon: {
    fontSize: '1.5rem',
  },
  moreButton: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
  },
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    width: '400px',
    maxWidth: '90%',
    maxHeight: '85vh',
    overflowY: 'auto',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    position: 'relative',
  },
  closeModalButton: {
    marginTop: '1rem',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default App;
