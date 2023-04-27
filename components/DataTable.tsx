import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import "tailwindcss/tailwind.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import TextField from "@mui/material/TextField";

type Problem2Props = {
  data: {
    assetName: string;
    lat: number;
    long: number;
    businessCategory: string;
    riskRating: number;
    riskFactors: { [key: string]: number };
    year: number;
  }[];
  selectedDecade: number;
  selectedLocation: { lat: number; lng: number } | null;
};

const Problem2 = (props: any) => {
  const { data, selectedDecade, selectedLocation } = props;

  const [sortedData, setSortedData] = useState<any[]>([]);

  const [sortColumn, setSortColumn] = useState<string>(""); // Column to sort by
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Sort order (ascending or descending)
  const [descriptionText, setDescriptionText] = useState<string>("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const initialStateFilter = { filterCol: "", filterVal: "" };
  const [filter, setFilter] = useState(initialStateFilter);
  const [isUpdatedFilterSort, setIsUpdatedFilterSort] = useState(false);

  const handleSort = (columnName: string) => {
    if (sortColumn === columnName) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnName);
      setSortOrder("asc");
    }
    setIsUpdatedFilterSort(true);
  };

  const getData = () => {
    let getDataArr = [];
    if (selectedLocation && selectedLocation.length > 0) {
      setDescriptionText(
        "Selected Location: Lat(" +
          selectedLocation[0] +
          "), Long(" +
          selectedLocation[1] +
          ")"
      );
      getDataArr = data.filter(
        (asset: any) =>
          asset.lat == selectedLocation[0] && asset.long == selectedLocation[1]
      );
    } else {
      setDescriptionText("Selected Decade: " + selectedDecade);
      getDataArr = data.filter((asset: any) => asset.year == selectedDecade);
    }

    let filteredArr = getDataArr;
    if (filter && filter.filterCol && filter.filterVal.trim() !== "") {
      filteredArr = filteredArr.filter((ele: any) => {
        return ele[filter.filterCol]
          .toLowerCase()
          .includes(filter.filterVal.toLowerCase());
      });
    }

    if (sortColumn && sortOrder && sortColumn.trim() !== "") {
      filteredArr = filteredArr.slice().sort((a: any, b: any) => {
        const columnValueA = a[sortColumn] ?? "";
        const columnValueB = b[sortColumn] ?? "";
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
    }

    setIsUpdatedFilterSort(false);
    setSortedData(filteredArr);
  };

  useEffect(() => {
    setPage(0);
    setFilter(initialStateFilter);
    setSortColumn("");
    setIsUpdatedFilterSort(true);
  }, [data, selectedLocation, selectedDecade]);

  useEffect(() => {
    if (isUpdatedFilterSort) {
      getData();
    }
  }, [isUpdatedFilterSort]);

  // useEffect(() => {
  //   if (data && data.length > 0) {
  //     let getData = [];
  //     if(selectedLocation && selectedLocation.length >0){
  //       setDescriptionText("Selected Location: Lat("+ selectedLocation[0] +"), Long(" + selectedLocation[1] +")");
  //       getData = data.filter((asset: any) => asset.lat == selectedLocation[0] && asset.long == selectedLocation[1] )
  //     }
  //     else{
  //       setDescriptionText("Selected Decade: "+ selectedDecade);
  //        getData = data.filter((asset: any) => asset.year == selectedDecade)
  //     }
  //     // setSortedData(getData);
  //     const sortedData = getData.slice().sort((a, b) => {
  //       const columnValueA = a[sortColumn] ?? "";
  //       const columnValueB = b[sortColumn] ?? "";
  //       if (sortOrder === "asc") {
  //         return columnValueA.localeCompare(columnValueB, undefined, {
  //           numeric: true,
  //         });
  //       } else {
  //         return columnValueB.localeCompare(columnValueA, undefined, {
  //           numeric: true,
  //         });
  //       }
  //     });
  //     setSortedData(sortedData);
  //   }
  // }, [data, sortOrder, sortColumn, selectedLocation, selectedDecade]);

  const columnsName = [
    { label: "Asset", value: "asset_name" },
    { label: "Lat", value: "lat" },
    { label: "Long", value: "long" },
    { label: "Business Category", value: "business_category" },
    { label: "Risk Rating", value: "risk_rating" },
    { label: "Risk Factors", value: "risk_factors" },
    { label: "Year", value: "year" },
  ];

  const columns: GridColDef[] = [
    { field: "asset_name", headerName: "Asset", width: 210 },
    { field: "lat", headerName: "Lat", type: "number", width: 90 },
    { field: "long", headerName: "Long", type: "number", width: 90 },
    { field: "business_category", headerName: "Business Category", width: 130 },
    {
      field: "risk_rating",
      headerName: "Risk Rating",
      type: "number",
      width: 90,
    },
    {
      field: "risk_factors",
      headerName: "Risk Factors",
      sortable: false,
      width: 210,
      // valueGetter: (params: GridValueGetterParams) =>{
      //   const riskFactors = JSON.parse(params.row.risk_factors);
      //   const riskFactorKeys = Object.keys(riskFactors);
      //   const riskFactorValues = Object.values(riskFactors);
      //   var str = [];
      //   for(let i = 0; i < riskFactorKeys.length; i++){
      //     str.push(riskFactorKeys[i]+':'+riskFactorValues[i])
      //   }
      //   return str.join(', ');
      // },
    },
    { field: "year", headerName: "Year", type: "number", width: 90 },
  ];

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // console.log("data ", data)
  const handleBlurFilter = (event: any) => {
    // let data = getData();
    // let filteredArr = getData();
    // if(filter && filter.filterCol && filter.filterVal.trim() !== ""){
    //   filteredArr = filteredArr.filter((ele:any)=>{
    //     return ele[filter.filterCol].toLowerCase().includes( event.target.value.toLowerCase() )
    //   })
    // }
    // setSortedData(filteredArr);
    if (filter && filter.filterCol) {
      setPage(0);
      setIsUpdatedFilterSort(true);
    }
  };

  return (
    <div className=" mt-6 ">
      <div className="text-xl font-bold">Data Table</div>
      <div className="text-lg my-2">{descriptionText}</div>
      {/* <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={sortedData}
        columns={columns}
        // pageSize={5}
        // rowsPerPageOptions={[5]}
      />
    </div> */}

      <TableContainer component={Paper}>
        <Table size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              {columnsName.map((ele) => (
                <TableCell key={ele.value}>
                  <div className="flex flex-col justify-between	text-center ">
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSort(ele.value)}
                    >
                      {ele.label}
                    </div>
                    {sortColumn === ele.value && sortOrder === "asc" && (
                      <span>▲</span>
                    )}
                    {sortColumn === ele.value && sortOrder === "desc" && (
                      <span>▼</span>
                    )}
                    <TextField
                      value={
                        filter?.filterCol === ele.value ? filter?.filterVal : ""
                      }
                      onBlur={handleBlurFilter}
                      onChange={(event) => {
                        setFilter({
                          filterCol: ele.value,
                          filterVal: event.target.value,
                        });
                      }}
                      label=""
                      variant="standard"
                    />
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData &&
              sortedData.length > 0 &&
              sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={index}>
                    {columnsName.map((ele) => (
                      <TableCell key={ele.value}>{row[ele.value]}</TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 50, 100, 250]}
        component="div"
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default Problem2;
