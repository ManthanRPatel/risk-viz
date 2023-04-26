import React, { useState, useEffect } from "react";
// import "./css/table.css";
import MyTable from "./Table";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import "tailwindcss/tailwind.css";


const Problem2 = (props) => {
  const { data, selectedDecade, selectedLocation } = props;

  // console.log("data ", data);
  // console.log("sortedData ", sortedData)
  const [sortedData, setSortedData] = useState<any[]>([]);

  const [sortColumn, setSortColumn] = useState<string>(""); // Column to sort by
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Sort order (ascending or descending)

  // const handleSort = (columnName: string) => {
  //   if (sortColumn === columnName) {
  //     setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  //   } else {
  //     setSortColumn(columnName);
  //     setSortOrder("asc");
  //   }
  // };

  useEffect(() => {
    // Sort the data based on the current sort column and order
    if (data && data.length > 0) {
      let getData = [];

      if(selectedLocation && selectedLocation.length >0){
        getData = data.filter((asset: any) => asset.lat == selectedLocation[0] && asset.long == selectedLocation[1] )
      }
      else{
         getData = data.filter((asset: any) => asset.year == selectedDecade)
      }
      // const sortedData = getData.slice().sort((a, b) => {
      //   const columnValueA = a[sortColumn] ?? "";
      //   const columnValueB = b[sortColumn] ?? "";
      //   if (sortOrder === "asc") {
      //     return columnValueA.localeCompare(columnValueB, undefined, {
      //       numeric: true,
      //     });
      //   } else {
      //     return columnValueB.localeCompare(columnValueA, undefined, {
      //       numeric: true,
      //     });
      //   }
      // });
      setSortedData(getData);
    }
  }, [data, sortOrder, sortColumn, selectedLocation, selectedDecade]);

  // const columnsName = [
  //   { label: "Asset", value: "asset_name" },
  //   { label: "Lat", value: "lat" },
  //   { label: "Long", value: "long" },
  //   { label: "Business Category", value: "business_category" },
  //   { label: "Risk Rating", value: "risk_rating" },
  //   { label: "Risk Factors", value: "risk_factors" },
  //   { label: "Year", value: "year" },
  // ];
 
  const columns: GridColDef[] = [
    { field: 'asset_name', headerName: 'Asset', width: 210 },
    { field: 'lat', headerName: 'Lat', type: 'number', width: 90, },
    { field: 'long', headerName: 'Long', type: 'number', width: 90, },
    { field: 'business_category', headerName: 'Business Category', width: 130 },
    { field: 'risk_rating', headerName: 'Risk Rating', type: 'number', width: 90, },
    // { field: 'risk_factors', headerName: 'Risk Factors', width: 210 },
    {
      field: 'risk_factors',
      headerName: 'Risk Factors',
      sortable: false,
      width: 210,
      valueGetter: (params: GridValueGetterParams) =>{
        const riskFactors = JSON.parse(params.row.risk_factors);
        const riskFactorKeys = Object.keys(riskFactors);
        const riskFactorValues = Object.values(riskFactors);

        var str = [];
        for(let i = 0; i < riskFactorKeys.length; i++){
          str.push(riskFactorKeys[i]+':'+riskFactorValues[i])
        }
        return str.join(', ');
      },
    },
    { field: 'year', headerName: 'Year', type: 'number', width: 90, },
  ];

  return (
    <div className=" mt-6 ">
      <div className="text-xl font-bold mb-2">Data Table</div>
      <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={sortedData}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
      {/* <table>
        <thead>
          <tr>
            {columnsName.map((ele) => (
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
          {sortedData &&
            sortedData.length > 0 &&
            sortedData.map((row, index) => (
              <tr key={index}>
                {columnsName.map((ele) => (
                  <td key={ele.value}>
                    {row[ele.value]}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table> */}
    </div>
  );
};

export default Problem2;
