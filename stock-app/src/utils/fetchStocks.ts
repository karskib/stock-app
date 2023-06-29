export const fetchStocks = async () => {
  return fetch("http://127.0.0.1:8000/list_of_stocks").then((response) =>
    response.json()
  );
};
