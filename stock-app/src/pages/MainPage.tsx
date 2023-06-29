import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { fetchStocks } from "../utils/fetchStocks";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function MainPage() {
  type Stock = {
    ticker: string;
  };

  const [stockList, setStockList] = useState<Stock[] | undefined>([]);
  const [activeStock, setActiveStock] = useState<String>("");
  useEffect(() => {
    fetchStocks()
      .then((data: any) => setStockList(data))
      .catch((e) => console.log(e));
  }, []);
  return (
    <div>
      <NavBar />
      <div style={{ position: "absolute", top: "50%" }}>
        <FormControl>
          <InputLabel id="demo-simple-select-label">Selected Stock</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={activeStock}
            onChange={(e) => setActiveStock(e.target.value)}
          >
            {stockList?.map((row: Stock, index: number) => {
              return (
                <MenuItem key={index} value={row.ticker}>
                  {row.ticker}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>
    </div>
  );
}
