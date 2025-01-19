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
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import AboutUs from './about-us';

// Fix Leaflet's default Marker icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

function HomePage() {
  const [userQuery, setUserQuery] = useState('I want a quiet hotel with great Wi-Fi');
  const [lat, setLat] = useState(48.8566);
  const [lng, setLng] = useState(2.3522);
  const [showHero, setShowHero] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showMapPopup, setShowMapPopup] = useState(false);

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
      setShowHero(false);
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
      stars.push(
        <span key="half-star" style={styles.starFilled}>
          ★
        </span>
      );
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

  const handleOpenMapPopup = () => setShowMapPopup(true);
  const handleCloseMapPopup = () => setShowMapPopup(false);

  const handleSelectHotel = (hotel) => setSelectedHotel(hotel);
  const handleCloseDetails = () => setSelectedHotel(null);

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
      <header style={styles.navbar}>
        <div style={styles.navLeft}>
          <h3 style={styles.logo}>
            <Link to="/" style={styles.navLinkLogo}>
              EcoStay
            </Link>
          </h3>
        </div>
        <nav style={styles.navRight}>
          <Link to="/about" style={styles.navLink}>
            About us
          </Link>
          <a
            href="https://github.com/ahmedmaaloul/ecostay"
            target="_blank"
            rel="noreferrer"
            style={{ marginLeft: '1rem' }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 55 55"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M27.5 2.2917C20.885 2.22448 14.5139 4.78642 9.78705 9.41448C5.06016 14.0425 2.36418 20.358 2.29163 26.9729C2.31711 32.2006 3.99879 37.2857 7.0951 41.4979C10.1914 45.71 14.543 48.8324 19.525 50.4167C20.7854 50.6459 21.2437 49.8896 21.2437 49.225C21.2437 48.5604 21.2437 47.0938 21.2437 45.0313C14.2312 46.5209 12.7416 41.7313 12.7416 41.7313C12.2748 40.2277 11.2824 38.9424 9.94579 38.1104C7.65413 36.5979 10.1291 36.6209 10.1291 36.6209C10.9212 36.7268 11.6791 37.0106 12.3459 37.4512C13.0126 37.8917 13.571 38.4775 13.9791 39.1646C14.6903 40.3978 15.8572 41.3025 17.2287 41.6839C18.6002 42.0654 20.0667 41.8931 21.3125 41.2042C21.4406 39.9492 22.0089 38.7802 22.9166 37.9042C17.325 37.2854 11.4583 35.1771 11.4583 25.7125C11.4083 23.2437 12.3205 20.8522 14.002 19.0438C13.2362 16.9241 13.3267 14.5895 14.2541 12.5354C14.2541 12.5354 16.3854 11.8709 21.1291 15.0563C25.2585 13.9559 29.604 13.9559 33.7333 15.0563C38.5458 11.8709 40.6083 12.5354 40.6083 12.5354C41.5358 14.5895 41.6262 16.9241 40.8604 19.0438C42.581 20.819 43.5427 23.1945 43.5416 25.6667C43.5416 35.1542 37.6291 37.2396 32.0833 37.8584C32.6905 38.4479 33.1596 39.1647 33.4568 39.9572C33.754 40.7497 33.8719 41.5982 33.802 42.4417V49.2021C33.802 49.2021 34.2604 50.6459 35.5208 50.3938C40.4886 48.7997 44.8256 45.6765 47.9123 41.4703C50.999 37.2642 52.6776 32.1901 52.7083 26.9729C52.6357 20.358 49.9398 14.0425 45.2129 9.41448C40.486 4.78642 34.1149 2.22448 27.5 2.2917Z" fill="#231F20"/>
            </svg>
          </a>
        </nav>
      </header>

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

      <div style={styles.searchArea}>
        <input
          style={styles.searchInput}
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
        />
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

      {showResults && (
        <div style={styles.cardsContainer}>
          {recommendations.map((hotel, idx) => (
            <div style={styles.card} key={idx}>
              {hotel.images_parsed && hotel.images_parsed.length > 0 && (
                <img
                  src={hotel.images_parsed[0]}
                  alt={hotel.Name}
                  style={styles.cardImage}
                />
              )}
              <h2 style={styles.cardTitle}>{hotel.Name}</h2>
              <div style={styles.starsRow}>{renderStars(hotel.Rating)}</div>
              <div style={styles.cardActions}>
                <a
                  href={hotel.HotelLink}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.linkIcon}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: 24, height: 24 }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
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

      {selectedHotel && (
        <MoreDetailsModal
          hotel={selectedHotel}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}

function MoreDetailsModal({ hotel, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = hotel.images_parsed || [];
  const hasImages = images.length > 0;

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div style={styles.modalBackdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {hasImages && (
          <div style={styles.slideshowContainer}>
            <img
              src={images[currentIndex]}
              alt={`Hotel Slide ${currentIndex + 1}`}
              style={styles.slideshowImage}
            />
            {images.length > 1 && (
              <>
                <button style={styles.slideNavButtonLeft} onClick={handlePrev}>
                  ‹
                </button>
                <button style={styles.slideNavButtonRight} onClick={handleNext}>
                  ›
                </button>
              </>
            )}
          </div>
        )}
        <h2 style={{ marginTop: '1rem' }}>{hotel.Name}</h2>
        <p>
          <strong>Address:</strong> {hotel.address}
        </p>
        <p style={{ whiteSpace: 'pre-line', marginTop: '1rem' }}>
          {hotel.description}
        </p>
        <button style={styles.closeModalButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </Router>
  );
}

const styles = {
  appContainer: {
    width: '100%',
    height: '100%',
    minHeight: '100vh',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #dfffe8 0%, #e7d7ff 100%)',
    fontFamily: 'sans-serif',
  },
  navbar: {
    display: 'flex',
    alignItems: 'center',
    height: 60,
    padding: '0 2rem',
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  navLeft: {
    display: 'flex',
  },
  logo: {
    margin: 0,
    fontSize: '1.5rem',
    fontFamily: 'Lalezar',
    color: '#333',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
  },
  navLinkLogo: {
    textDecoration: 'none',
    fontFamily: 'Lalezar',
    fontWeight: 400,
    fontSize: '1.5rem',
    color: '#333',
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
  cardImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '6px',
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
    display: 'flex',
    alignItems: 'center',
    color: '#333',
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
    width: '500px',
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
  slideshowContainer: {
    position: 'relative',
    width: '100%',
    height: '300px',
    marginBottom: '1rem',
    overflow: 'hidden',
    borderRadius: '8px',
  },
  slideshowImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  slideNavButtonLeft: {
    position: 'absolute',
    top: '50%',
    left: '10px',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    fontSize: '1.5rem',
    lineHeight: '1',
  },
  slideNavButtonRight: {
    position: 'absolute',
    top: '50%',
    right: '10px',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    fontSize: '1.5rem',
    lineHeight: '1',
  },
  // About us
  aboutContainer: {
    width: '100%',
    minHeight: '100vh',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #dfffe8 0%, #e7d7ff 100%)',
    fontFamily: 'sans-serif',
  },
  aboutTitle: {
    fontSize: '2rem',
    marginBottom: '2rem',
    color: '#333',
  },
  membersContainer: {
    display: 'flex',
    gap: '2rem',
    marginBottom: '2rem',
  },
  memberCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  memberImg: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '0.5rem',
  },
  memberName: {
    fontSize: '1.1rem',
    color: '#333',
  },
  schoolLogo: {
    width: '250px',
    height: '100px',
    objectFit: 'contain',
  },
};

export default App;
