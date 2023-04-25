import React, { useState, useEffect } from "react";
// import {getData} from '../src/app/api/data';
import './css/table.css';

const Problem2 = () => {
  const [columns, setColumns] = useState<string[]>([]);
  const [data, setData] = useState<any[]>([]);

  const [sortedData, setSortedData] = useState<any[]>([]);

  const [sortColumn, setSortColumn] = useState<string>(""); // Column to sort by
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Sort order (ascending or descending)

  useEffect(() => {
    fetch("/api/data")
      .then((response) => response.json())
      .then((data) => {
        setColumns(data.columns);
        setData(data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSort = (columnName: string) => {
    if (sortColumn === columnName) {
      // If already sorting by this column, toggle the sort order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Otherwise, sort by the new column in ascending order
      setSortColumn(columnName);
      setSortOrder("asc");
    }
  };

  useEffect(() => {
    // Sort the data based on the current sort column and order
    const sortedData = data.slice().sort((a, b) => {
        const columnValueA = a[sortColumn] ?? '';
        const columnValueB = b[sortColumn] ?? '';
      if (sortOrder === "asc") {
        return columnValueA.localeCompare(columnValueB, undefined, {
          numeric: true,
        });
      } else {
        return columnValueB.localeCompare(columnValueA, undefined, {
          numeric: true,
        });
      }
    });

    setSortedData(sortedData);

  }, [data, sortOrder, sortColumn]);

  const columnsName = [
    { label: "Asset", value: "asset_name" },
    { label: "Lat", value: "lat" },
    { label: "Long", value: "long" },
    { label: "Business Category", value: "business_category" },
    { label: "Risk Rating", value: "risk_rating" },
    { label: "Risk Factors", value: "risk_factors" },
    { label: "Year", value: "year" },
  ]

  return (
    <div>
      <h1>Data Table</h1>
      <table>
        <thead>
          {/* <tr>
            {columns.map((columnName) => (
              <th key={columnName} onClick={() => handleSort(columnName)}>
                {columnName}
                {sortColumn === columnName && sortOrder === "asc" && (
                  <span> ▲</span>
                )}
                {sortColumn === columnName && sortOrder === "desc" && (
                  <span> ▼</span>
                )}
              </th>
            ))}
          </tr> */}
          <tr>
            {columnsName.map(ele=>(
              <th key={ele.value} onClick={() => handleSort(ele.value)}>
              {ele.label}
              {sortColumn === ele.value && sortOrder === "asc" && (
                  <span>▲</span>
              )}
              {sortColumn === ele.value && sortOrder === "desc" && (
                <span>▼</span>
              )}
            </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData && sortedData.length > 0 && sortedData.map((row, index) => (
            <tr key={index}>
              {columns.map((columnName) => (
                <td key={columnName}>{row[columnName.toLowerCase().replace(/ /g, '_')]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Problem2;
