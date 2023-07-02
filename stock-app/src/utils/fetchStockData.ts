export const fetchStockData = (
  ticker: string,
  start: string,
  end: string | undefined
) => {
  const url =
    end === undefined
      ? `http://127.0.0.1:8000/stock_data?ticker_code=${ticker}&start_date=${start}`
      : `http://127.0.0.1:8000/stock_data?ticker_code=${ticker}&start_date=${start}&end_date=${end}`;

  return fetch(url).then((response) => response.json());
};
