import mysql.connector
import csv

mydb = mysql.connector.connect(
  host="localhost",
  user="Maple",
  password="v5r8`_&Y2p~KAZC4",
  database="cities"
)

mycursor = mydb.cursor()

with open('uscities.csv') as csvfile:
    csv_reader = csv.reader(csvfile)
    next(csv_reader)
    for row in csv_reader:
        values = [row[0], row[2], float(row[6]), float(row[7])]
        mycursor.execute('INSERT INTO cities(name, \
          state, lat, lng )' \
          'VALUES(%s, %s, %s, %s)', 
          values)
        

mydb.commit()
mycursor.close()
