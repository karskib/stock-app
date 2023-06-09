from fastapi import FastAPI, Query
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
import json
from var import VAR
from connection import Connection
from typing import Union

app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = Connection()
connection = db.connection
engine = db.engine


@app.get("/")
async def root():

    return {"message": "Hello World"}

# my_url(my_id: int = Query(...), my_type: int = Query(None)):


@app.get("/stock_data")
async def get_stock(ticker_code, start_date: str, end_date: Union[str,None] = None):
    print("getting from db...")
    response = db.get_stock_data(
        ticker_code, connection=connection, start=start_date, end=end_date)
    if not response['data']:
        print("here")
        response = db.get_unknown_stock(ticker=ticker_code)
        db.insert_stock_data(response['raw_df'], engine=engine)
        return response['data']
    else:
        return response['data']


@app.get("/var/{ticker_code}")
async def get_var(ticker_code: str, start_date: str, end_date: str):
    model = VAR(
        ticker_code,
        start_date,
        end_date,
        0.95,
        db.get_stock_data(ticker_code, connection=connection)['raw_df']
    )

    return model.var


@app.get("/list_of_stocks")
async def list_of_stocks():
    return db.get_stock_list(connection=connection)
# @app.get("/list_of_stocks")
# async def list_of_stocks():
