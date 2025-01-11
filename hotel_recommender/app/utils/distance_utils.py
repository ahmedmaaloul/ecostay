import numpy as np

def haversine_distance(lat1, lng1, lat2, lng2):
    R = 6371
    d_lat = np.radians(lat2 - lat1)
    d_lng = np.radians(lng2 - lng1)
    a = (np.sin(d_lat / 2) ** 2 +
         np.cos(np.radians(lat1)) *
         np.cos(np.radians(lat2)) *
         np.sin(d_lng / 2) ** 2)
    c = 2 * np.arcsin(np.sqrt(a))
    return R * c
