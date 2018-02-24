import datetime as dt
import numpy as np
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, and_, or_

from flask import Flask, jsonify


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///hawaii.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to the invoices and invoice_items tables
Measurement = Base.classes.measurement
Station = Base.classes.station

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Avalable Routes:<br/> "

        f"/api/v1.0/precipitation "
        f" - List of dates and temperature observations from the last year<br/>"

        f"/api/v1.0/stations "
        f" - List of stations<br/>"

        f"/api/v1.0/tobs "
        f" - List of Temperature Observations (tobs) for the previous year<br/>"

        f"/api/v1.0/<start> "
        f" - Calculates `TMIN`, `TAVG`, and `TMAX` for all dates greater than and equal to the start date<br/>"
        
        f"/api/v1.0/<start>/<end> "
        f" - Calculates the `TMIN`, `TAVG`, and `TMAX` for dates between the start and end date inclusive<br/>"
    )


@app.route("/api/v1.0/precipitation")
def precipitation():
    """Query for the dates and temperature observations from the last year.
    Convert the query results to a Dictionary using date as the key and tobs as the value.
    Return the json representation of your dictionary."""
    # Query for the dates and temperature observations from the last year.
    results = session.query(Measurement.date, Measurement.prcp).\
    filter(and_(Measurement.date >= '2017-01-01', \
                   Measurement.date <= '2017-12-31')).all()

    # Convert the query results to a Dictionary using date as the key and tobs as the value.
    # Create a list of dicts with `date` and `tobs` as the keys and
    precipitation = []
    for result in results:
        row = {}
        row["date"] = result[0]
        row["tobs"] = float(result[1])
        precipitation.append(row)
    # Return the json representation of your dictionary.         
    return jsonify(precipitation)

@app.route("/api/v1.0/stations")
def stations():
    """Return a json list of stations from the dataset."""
    # Query all stations from the Stations table
    results = session.query(Station.station).all()

    # Convert list of tuples into normal list
    stations = list(np.ravel(results))
    return jsonify(stations)


@app.route("/api/v1.0/tobs")
def temp_observed():
    """Return a json list of Temperature Observations (tobs) for the previous year"""
    results = session.query(Measurement.tobs)\
        .filter(and_(Measurement.date >= '2017-01-01', \
        Measurement.date <= '2017-12-31')).all()

# dict keys that are not of a basic type 
# (str, unicode, int, long, float, bool, None) will through TypeError
    temp_list = []
    for result in results:
        temp_list.append(float(result[0]))

    return jsonify(temp_list)
              
@app.route("/api/v1.0/<start>")
def start_date(start='2010-01-01'):
# start="2010-01-01"
    results = session.query(Measurement.date, \
        func.avg(Measurement.tobs).label('TAVG'), \
        func.max(Measurement.tobs).label('TMAX'), \
        func.min(Measurement.tobs).label('TMIN')) \
        .group_by(Measurement.date)\
        .filter(Measurement.date >= start).all()

    one_date = []
    for result in results:
        row = {}
        row["date"] = result[0]
        row["TAVG"] = result[1]
        row["TMAX"] = result[2]
        row["TMIN"] = result[3]
        one_date.append(row)
    # Return the json representation of your dictionary.         
    return jsonify(one_date)

@app.route("/api/v1.0/<start>/<end>")
def start_to_end_dates(start='2010-01-01',end='2010-12-31'):
    """Return a json list of the minimum temperature, the average temperature, and the max temperature for a given start or start-end range.
    When given the start only, calculate TMIN, TAVG, and TMAX for all dates greater than and equal to the start date.
    When given the start and the end date, calculate the TMIN, TAVG, and TMAX for dates between the start and end date inclusive."""
    # Calculate the total for a given country

    results = session.query(Measurement.date, \
        func.avg(Measurement.tobs).label('TAVG'), \
        func.max(Measurement.tobs).label('TMAX'), \
        func.min(Measurement.tobs).label('TMIN')) \
        .filter(and_(Measurement.date >= start, \
        Measurement.date <= end)).group_by(Measurement.date).all()

    stats = []
    for result in results:
        row = {}
        row["date"] = result[0]
        row["TAVG"] = result[1]
        row["TMAX"] = result[2]
        row["TMIN"] = result[3]
        stats.append(row)


    return jsonify(stats)

if __name__ == '__main__':
    app.debug = True
    app.run()