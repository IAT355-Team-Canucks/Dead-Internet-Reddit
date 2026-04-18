// context/CsvDataContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import * as d3 from "d3";

const CsvDataContext = createContext(null);

export const CsvDataProvider = ({ csvPath, children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    d3.csv(csvPath, d3.autoType)
      .then((loaded) => {
        if (!cancelled) {
          setData(loaded);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [csvPath]);

  return (
    <CsvDataContext.Provider value={{ data, loading, error }}>
      {children}
    </CsvDataContext.Provider>
  );
};

export const useCsvData = () => {
  const ctx = useContext(CsvDataContext);
  if (!ctx) throw new Error("useCsvData must be used inside CsvDataProvider");
  return ctx;
};