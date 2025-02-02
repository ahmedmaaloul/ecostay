import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from .recommender import HotelRecommender

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:5173",  # Frontend origin
    "http://localhost:8000",  # Backend origin 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Allows specified origins
    allow_credentials=True,
    allow_methods=["*"],         # Allows all HTTP methods
    allow_headers=["*"],         # Allows all headers
)

# Load the preprocessed hotel data
df = pd.read_pickle('app/models/hotel_data.pkl')
df['combined_embedding'] = df['combined_embedding'].apply(
    lambda x: np.array(x) if isinstance(x, (list, np.ndarray)) else x
)

# Initialize the recommender system
recommender = HotelRecommender(df)

# Define request and response models
class RecommendationRequest(BaseModel):
    user_query: str
    user_lat: float
    user_lng: float
    top_n: int = 5

class HotelRecommendation(BaseModel):
    Name: str
    Rating: float
    HotelLink: str
    description: str
    address: str
    images_parsed: List[str]  # New field added

class RecommendationResponse(BaseModel):
    recommendations: List[HotelRecommendation]

# Define API endpoints
@app.post("/recommend", response_model=RecommendationResponse)
def get_recommendations(request: RecommendationRequest):
    try:
        recommendations_df = recommender.recommend(
            user_query=request.user_query,
            user_lat=request.user_lat,
            user_lng=request.user_lng,
            top_n=request.top_n
        )
        recommendations = recommendations_df.rename(columns={'full_description_en': 'description'}).to_dict(orient='records')
        formatted_recommendations = [
            HotelRecommendation(**hotel) for hotel in recommendations
        ]
        return RecommendationResponse(recommendations=formatted_recommendations)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "Welcome to the Hotel Recommendation API"}
