from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import functools
import mysql.connector
import math
import random

NUM_CITIES = 28338
current_city = None

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mydb = mysql.connector.connect(
  host="localhost",
  user="Maple",
  password="v5r8`_&Y2p~KAZC4",
  database="cities"
)

mycursor = mydb.cursor()

def get_city_data(city_id : int):
    mycursor.execute("SELECT * FROM cities WHERE id=%s", [city_id])
    return mycursor.fetchall()[0]

def correct_state(guessed_city):
    return guessed_city[2] == current_city[2]

def deg_to_rad(degrees):
    return degrees * (math.pi/180)

def get_distance(guessed_city):
    earthRadius = 3958.8
    latA = guessed_city[3]
    lngA = guessed_city[4]
    latB = current_city[3]
    lngB = current_city[4]

    dLat = deg_to_rad(latB - latA)
    dLng = deg_to_rad(lngB - lngA)
  
    a = math.sin(dLat/2) * math.sin(dLat/2)
    a += math.cos(deg_to_rad(latA)) * math.cos(deg_to_rad(latB)) * math.sin(dLng/2) * math.sin(dLng/2)

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return earthRadius * c


@functools.lru_cache(1)
def get_cities(search: str):
    mycursor.execute("SELECT id, name, state FROM cities WHERE name LIKE %s", [search.capitalize()+"%"])
    return mycursor.fetchall()[:10]

@app.get("/get_location/")
async def get_location():
    global current_city
    current_city = get_city_data(math.floor(random.random()*NUM_CITIES))
    return {"lat": current_city[3], "lng" : current_city[4]}


@app.get("/guess/{city_id}")
async def guess(city_id: int):
    if(city_id == current_city[0]):
        return {"correct_city" : True,
                "correct_state": True}
    else:
        guessed_city = get_city_data(city_id)
        return {"correct_city" : False,
                "correct_state" : correct_state(guessed_city),
                "guessed_city" : guessed_city,
                "distance" : get_distance(guessed_city)}


@app.get("/search/{searchTerm}")
async def search(searchTerm : str):
    return {"results" : get_cities(searchTerm)}

@app.get("/get_current_city/")
async def get_city():
    return {"city_data" : current_city}