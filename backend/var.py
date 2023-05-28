import pandas as pd
import numpy as np
from dataclasses import dataclass
import datetime
from scipy.stats import norm

@dataclass
class VAR:

    ticker: str
    date_start: datetime
    date_end: datetime
    percentile: float
    data : pd.DataFrame
    
    @property
    def var(self):
        df = self.data.sort_values(by = ['record_date'])
        df = df[(df['record_date']>=self.date_start) & (df['record_date']<=self.date_end)]
        df['Returns'] = np.log(df['close']/df['close'].shift(1))
        mean = np.mean(df['Returns'])
        std_dev = np.std(df['Returns']) 
        
        return norm.ppf(self.percentile, mean, std_dev)
     