from sqlalchemy import create_engine
import psycopg2
from dataclasses import dataclass
import pandas as pd
import numpy as np
import json
import pandas_datareader as pdr
import yfinance as yf

yf.pdr_override()


@dataclass
class Connection:

    user: str = 'postgres'
    password: str = 'password'
    host: str = '127.0.0.1'
    port: str = '5432'
    database: str = 'stock_db'

    @property
    def engine(self):
        return create_engine(
            f'postgresql+psycopg2://{self.user}:{self.password}@{self.host}:{self.port}/{self.database}')

    @property
    def connection(self):
        return psycopg2.connect(user=self.user,
                                password=self.password,
                                host=self.host,
                                port=self.port,
                                database=self.database)

    def get_stock_data(self, ticker, connection, start: str, end: str):
        df = pd.read_sql(f"""
         select ticker, close, record_date from stock_db.stock_info_data
         where ticker = '{ticker}'
         and record_date between '{start}' and '{end}'
         """, connection)
        df['record_date'] = pd.to_datetime(df['record_date'])
        df['record_date'] = df['record_date'].dt.strftime('%Y-%m-%d')
        temp = df.to_json(orient='records')
        parsed = json.loads(temp)
        return {
            'data': parsed,
            'raw_df': df
        }

    def get_unknown_stock(self, ticker, start='2019-01-01', end='2023-04-01'):
        df = pdr.DataReader(ticker, 'stooq', start=start, end=end)
        df['ticker'] = ticker
        df['record_date'] = pd.to_datetime(df.index)
        df['record_date'] = df['record_date'].dt.strftime('%Y-%m-%d')
        df.rename(columns={'Close': 'close'}, inplace=True)
        df = df[['ticker', 'close', 'record_date']
                ].sort_values(by='record_date')
        temp = df.to_json(orient='records')
        parsed = json.loads(temp)
        return {'message': f"Data for {ticker} has been retrieved",
                'data': parsed,
                'raw_df': df}

    def insert_stock_data(self, data, engine):
        data.to_sql(name='stock_info_data', schema='stock_db',
                    con=engine, if_exists='append', index=False, method='multi')
        print('Data for has been inserted')

    def get_stock_list(self, connection):
        stocks = pd.read_sql(
            """ select distinct ticker from stock_db.stock_info_data""", connection)
        temp = stocks.to_json(orient="records")

        return json.loads(temp)
