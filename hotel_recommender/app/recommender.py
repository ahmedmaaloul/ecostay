import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from googletrans import Translator
from .utils.embedding_utils import roberta_encode
from .utils.distance_utils import haversine_distance
import re
import emoji
import contractions
from spellchecker import SpellChecker
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()
spell = SpellChecker()
translator = Translator()

def correct_spelling_batch(text: str) -> str:
    words = text.split()
    candidates = {w for w in words if w.isalpha() and len(w) > 2 and w not in spell}
    corrections = {word: (spell.correction(word) or word) for word in candidates}
    corrected_tokens = [corrections[w] if w in corrections else w for w in words]
    return " ".join(corrected_tokens)

def advanced_cleaning_pipeline(text: str, do_spellcheck=True) -> str:
    if not isinstance(text, str):
        return ""

    text = text.strip()
    if not text:
        return ""

    text = re.sub(r'<.*?>', '', text)
    text = contractions.fix(text)
    text = emoji.replace_emoji(text, "")
    text = re.sub(r'http\S+|www\S+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+', '', text)
    text = re.sub(r'(.)\1{2,}', r'\1\1', text)
    if do_spellcheck:
        text = correct_spelling_batch(text)
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    tokens = [word for word in text.split() if word not in stop_words and len(word) > 1]
    tokens = [lemmatizer.lemmatize(token) for token in tokens]
    return " ".join(tokens)

class HotelRecommender:
    def __init__(self, df: pd.DataFrame, K: int = 5, alpha: float = 0.5, beta: float = 0.3, gamma: float = 0.2):
        self.df = df
        self.K = K
        self.alpha = alpha
        self.beta = beta
        self.gamma = gamma
        self.hotel_embeddings = np.stack(self.df['combined_embedding'].values)
        self.translator = Translator()

    def recommend(self, user_query: str, user_lat: float, user_lng: float, top_n: int = 5) -> pd.DataFrame:
        translated_query = self.translator.translate(user_query, dest='en').text
        cleaned_query = advanced_cleaning_pipeline(translated_query)
        user_embedding = roberta_encode(cleaned_query)
        similarities = cosine_similarity(self.hotel_embeddings, user_embedding.reshape(1, -1)).flatten()

        # Calculate location score
        distance_km = self.df.apply(
            lambda row: haversine_distance(user_lat, user_lng, row['lat'], row['lng']),
            axis=1
        )
        location_score = 1 / (1 + distance_km)

        # Calculate subscore score
        subscore_columns = ['Personnel', 'Equipment', 'Cleanliness', 'Comfort', 'Value for money', 'Geographic location', 'Free Wi-Fi']
        subscore_score = self.df[subscore_columns].mean(axis=1) / 10

        # Calculate final score
        final_score = (
            self.alpha * similarities +
            self.beta * location_score +
            self.gamma * subscore_score
        )

        # Create a temporary DataFrame for recommendations
        recommendations_df = self.df.copy()
        recommendations_df['final_score'] = final_score

        # Select top_n hotels based on final_score
        top_hotels = recommendations_df.sort_values(by='final_score', ascending=False).head(top_n)

        # Return only the necessary columns
        return top_hotels[['Name', 'Rating', 'HotelLink', 'full_description_en', 'address', 'images_parsed']]
