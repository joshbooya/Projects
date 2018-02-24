import datetime as dt
import numpy as np
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, and_, or_, inspect

from flask import Flask, jsonify, render_template

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///belly_button_biodiversity.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to the OTU and otu table
OTU = Base.classes.otu
# Save references to the Samples and samples table
Samples = Base.classes.samples
# Save references to the Samples_Metadata and samples_metadata table
Samples_Metadata = Base.classes.samples_metadata

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
def index():
    """Return the dashboard homepage."""
    return render_template("index.html", sample_names=sample_names)

@app.route('/names')
def sample_names():
    """List of sample names.

    Returns a list of sample names in the format
    [
        "BB_940",
        "BB_941",
        "BB_943",
        "BB_944",
        "BB_945",
        "BB_946",
        "BB_947",
        ...
    ]

    """
    inspector = inspect(engine)
    samples_columns = inspector.get_columns("samples")
    sample_names = []
    for n in np.arange(len(samples_columns)-1):
        sample_names.append(samples_columns[n+1]["name"])

    return jsonify(sample_names)

@app.route('/otu')
def OTU_descriptions():
    """List of OTU descriptions.

    Returns a list of OTU descriptions in the following format

    [
        "Archaea;Euryarchaeota;Halobacteria;Halobacteriales;Halobacteriaceae;Halococcus",
        "Archaea;Euryarchaeota;Halobacteria;Halobacteriales;Halobacteriaceae;Halococcus",
        "Bacteria",
        "Bacteria",
        "Bacteria",
        ...
    ]
    """
    OTU_taxonomy = engine.execute('SELECT lowest_taxonomic_unit_found FROM otu')
    OTU_descriptions = []
    for row in OTU_taxonomy:
        OTU_descriptions.append(row[0])
    
    return jsonify(OTU_descriptions)

@app.route('/metadata/<sample>')
def sample_metadata(sample='BB_940'):
    """MetaData for a given sample.

    Args: Sample in the format: `BB_940`

    Returns a json dictionary of sample metadata in the format

    {
        AGE: 24,
        BBTYPE: "I",
        ETHNICITY: "Caucasian",
        GENDER: "F",
        LOCATION: "Beaufort/NC",
        SAMPLEID: 940
    }
    """
    results = session.query(Samples_Metadata.AGE, \
            Samples_Metadata.BBTYPE, \
            Samples_Metadata.ETHNICITY, \
            Samples_Metadata.GENDER, \
            Samples_Metadata.LOCATION, \
            Samples_Metadata.SAMPLEID).all()
    
    samples_df = pd.DataFrame(results)
    sample_metadata = samples_df[samples_df.SAMPLEID==int(sample[3:])].to_dict('records')
    return jsonify(sample_metadata[0])

@app.route('/wfreq/<sample>')
def wash_freq(sample='BB_940'):
    """Weekly Washing Frequency as a number.

    Args: Sample in the format: `BB_940`

    Returns an integer value for the weekly washing frequency `WFREQ`
    """
    results = session.query(Samples_Metadata.WFREQ, \
            Samples_Metadata.SAMPLEID).all()

    samples_df = pd.DataFrame(results)
    wash_freq_metadata = samples_df[samples_df.SAMPLEID==int(sample[3:])].to_dict('records')

    return jsonify(wash_freq_metadata[0]['WFREQ'])

@app.route('/samples/<sample>')
def samples(sample='BB_940'):
    """OTU IDs and Sample Values for a given sample.

    Sort your Pandas DataFrame (OTU ID and Sample Value)
    in Descending Order by Sample Value

    Return a list of dictionaries containing sorted lists  for `otu_ids`
    and `sample_values`

    [
        {
            otu_ids: [
                1166,
                2858,
                481,
                ...
            ],
            sample_values: [
                163,
                126,
                113,
                ...
            ]
        }
    ]
    """
    sample_interest = engine.execute("SELECT otu_id, %s AS sample_values FROM samples ORDER BY sample_values DESC" %sample)

    # results = session.query(Samples.otu_id,'Samples.%'%sample).all()
    otu_ids = []
    sample_values = []
    for row in sample_interest:
        otu_ids.append(row[0])
        sample_values.append(row[1])
    otuID_samplesValues = [dict([('otu_ids', otu_ids), ('sample_values', sample_values)])]
    return jsonify(otuID_samplesValues)
    

if __name__ == '__main__':
    app.debug = True
    app.run()