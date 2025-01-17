# Web Scraping & Machine Learning Applied Project

## Project Aim & Context
In response to growing environmental concerns, both travelers and the tourism industry are increasingly prioritizing sustainability. Eco-conscious travelers seek accommodations that offer comfort while adhering to sustainable practices. However, finding such hotels that align with specific location preferences can be challenging. This project aims to bridge this gap by developing a system that recommends sustainability-certified hotels in Paris based on user-specified locations and preferences, utilizing Natural Language Processing (NLP).

## Use Case
A traveler planning a trip to Paris wants to stay in a hotel that is both eco-friendly and conveniently located near specific attractions or neighborhoods. Instead of manually searching through numerous listings, the traveler can input their desired location and preferences in a query. The system will then recommend hotels that meet sustainability certifications and are in proximity to the specified area, leveraging user reviews to ensure quality and satisfaction.

## Data Sources
We scraped our data (hotel descriptions and reviews) using Selenium. Additionally, we used the OpenCage Geocode API to obtain latitude and longitude based on hotel addresses.

## Machine Learning Part
In the machine learning component, we utilized RoBERTa to generate embeddings for the reviews and hotel descriptions. These embeddings were combined to calculate similarities to the user query, thereby recommending hotels that are near the specified location (using Haversine distance) and semantically similar to the user's preferences.

## Web Development Part
We used FastAPI for the backend API and React for the frontend development.

## Authors
- Ahmed MAALOUL
- Aksel YILMAZ
- Martin Pujol
