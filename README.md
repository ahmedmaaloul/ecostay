# Web Scraping & Machine Learning Applied Project

## Project Aim & Context
In response to growing environmental concerns, both travelers and the tourism industry are increasingly prioritizing sustainability. Eco-conscious travelers seek accommodations that offer comfort while adhering to sustainable practices. However, finding such hotels that align with specific location preferences can be challenging. This project aims to bridge this gap by developing a system that recommends sustainability-certified hotels in Paris based on user-specified locations and preferences, utilizing Natural Language Processing (NLP).

## Use Case
A traveler planning a trip to Paris wants to stay in a hotel that is both eco-friendly and conveniently located near specific attractions or neighborhoods. Instead of manually searching through numerous listings, the traveler can input their desired location and preferences in a query. The system will then recommend hotels that meet sustainability certifications and are in proximity to the specified area, leveraging user reviews to ensure quality and satisfaction.

## Data Sources
- **Web Scraping:** Hotel descriptions and reviews were scraped using **Selenium**.
- **Geolocation API:** We used the **OpenCage Geocode API** to obtain latitude and longitude based on hotel addresses.

## Machine Learning Part
- **Model Used:** The system employs **RoBERTa** to generate embeddings for hotel reviews and descriptions.
- **Recommendation Process:** These embeddings are used to calculate semantic similarity to the user's query, while proximity to the specified location is determined using the **Haversine distance**. Hotels are ranked and recommended based on these combined criteria.

## Web Development Part
- **Backend:** Developed with **FastAPI** to serve the recommendation API.
- **Frontend:** Built using **React** with **Vite** for a fast and responsive user interface.

---

## How to Run the App “EcoStay”

### API

1. Navigate to the `hotel_recommender` directory.
2. Build the Docker image:

    ```bash
    docker build --no-cache -t hotel-recommender .
    ```

3. Run the Docker container:

    ```bash
    docker run -d -p 8000:8000 --name hotel-recommender-app hotel-recommender
    ```

4. Check the container logs to ensure the server has started successfully.

---

### Frontend

1. Navigate to the `frontend` directory.
2. Start the React application using the following command:

    ```bash
    npm run dev
    ```

---

## Authors
- Ahmed Maaloul
- Aksel Yilmaz
- Martin Pujol
