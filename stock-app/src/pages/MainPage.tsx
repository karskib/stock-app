import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { fetchStocks } from "../utils/fetchStocks";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { stockSelected, listOfStocksInserted } from "../store/stockDataReducer";
import { fetchStockData } from "../utils/fetchStockData";

export default function MainPage() {
  const selectedStock = useSelector(
    (state: RootState) => state.stock.selectedStock
  );
  const listOfStocks = useSelector(
    (state: RootState) => state.stock.listOfStocks
  );
  const dispatch = useDispatch();
  useEffect(() => {
    fetchStocks()
      .then((data: any) => dispatch(listOfStocksInserted(data)))
      .catch((e) => console.log(e));
  }, []);
  return (
    <div>
      <NavBar />
      <div style={{ position: "absolute", top: "50%" }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-autowidth-label" size="normal">
            Selected Stock
          </InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select"
            value={selectedStock}
            onChange={(e) => {
              console.log(e.target.value);
              dispatch(stockSelected(e.target.value));
            }}
          >
            {listOfStocks?.map((row, index: number) => {
              return (
                <MenuItem key={index} value={row.ticker}>
                  {row.ticker}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <button
          onClick={() => {
            fetchStockData("TSLA", "2020-01-01", undefined).then((data: any) =>
              console.log(data)
            );
          }}
        >
          getData
        </button>
      </div>
    </div>
  );
}
