import React from 'react';
import { Link } from 'react-router-dom';
import ahmedImage from './assets/members/ahmed.jpeg';
import akselImage from './assets/members/aksel.jpeg';
import martinImage from './assets/members/martin.jpeg';
import schoolLogo from './assets/logos/logo_esilv_png_blanc.png';

function AboutUs() {
  return (
    <div style={styles.appContainer}>
      {/* Navbar (same as HomePage) */}
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

      {/* Team Section */}
      <div style={styles.aboutContainer}>
        <h1 style={styles.aboutTitle}>Our Team</h1>
        <div style={styles.membersContainer}>
          <div style={styles.memberCard}>
            <img
              src={ahmedImage}
              alt="Ahmed"
              style={styles.memberImg}
            />
            <h3 style={styles.memberName}>Ahmed MAALOUL</h3>
          </div>
          <div style={styles.memberCard}>
            <img
              src={akselImage} 
              alt="Aksel"
              style={styles.memberImg}
            />
            <h3 style={styles.memberName}>Aksel YILMAZ</h3>
          </div>
          <div style={styles.memberCard}>
            <img
              src={martinImage}
              alt="Martin"
              style={styles.memberImg}
            />
            <h3 style={styles.memberName}>Martin PUJOL</h3>
          </div>
        </div>
        <img
          src={schoolLogo}
          alt="School Logo"
          style={styles.schoolLogo}
        />
      </div>
    </div>
  );
}

const styles = {
  appContainer: {
    width: '100%',
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
  navLinkLogo: {
    textDecoration: 'none',
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
  aboutContainer: {
    width: '100%',
    minHeight: 'calc(100vh - 60px)', // subtract navbar height
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #dfffe8 0%, #e7d7ff 100%)',
  },
  aboutTitle: {
    fontSize: '2.5rem',
    marginBottom: '2rem',
    color: '#333',
  },
  membersContainer: {
    display: 'flex',
    gap: '2rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  memberCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  memberImg: {
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '0.5rem',
  },
  memberName: {
    fontSize: '1.2rem',
    color: '#333',
  },
  schoolLogo: {
    width: '200px',
    height: 'auto',
    marginTop: '1rem',
  },
};

export default AboutUs;
