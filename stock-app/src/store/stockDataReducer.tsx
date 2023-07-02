import { createSlice } from "@reduxjs/toolkit";

interface Stock {
  ticker: string;
}

interface StockState {
  selectedStock: string;
  listOfStocks: Stock[];
}

const initialState: StockState = {
  selectedStock: "",
  listOfStocks: [],
};

export const stockSlice = createSlice({
  name: "stock",
  initialState: initialState,
  reducers: {
    stockSelected: (state, action) => {
      return { ...state, selectedStock: action.payload };
    },
    listOfStocksInserted: (state, action) => {
      return {
        ...state,
        listOfStocks: action.payload,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { stockSelected, listOfStocksInserted } = stockSlice.actions;

export default stockSlice.reducer;
