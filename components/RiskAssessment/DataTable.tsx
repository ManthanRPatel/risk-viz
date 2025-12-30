import React, { useState, useEffect } from "react";
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
import { DataRow } from "@/app/types/types";
import { NextPage } from "next";

interface TableProps {
  data: DataRow[];
  years: string[];
  selectedDecade: number | null;
  setSelectedDecade: React.Dispatch<React.SetStateAction<number | null>>;
  selectedLocation: [number, number] | null;
}

interface FilterState {
  filterCol: string;
  filterVal: string;
}

const DataTable: NextPage<TableProps> = ({  data, selectedDecade, selectedLocation }: TableProps) => {
  
  const [sortedData, setSortedData] = useState<DataRow[]>([]);

  const [sortColumn, setSortColumn] = useState<string>(""); // Column to sort by
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Sort order (ascending or descending)
  const [descriptionText, setDescriptionText] = useState<string>("");

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const initialStateFilter = { filterCol: "", filterVal: "" };
  const [filter, setFilter] = useState<FilterState>(initialStateFilter);
  const [isUpdatedFilterSort, setIsUpdatedFilterSort] = useState<boolean>(false);

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
        (asset: DataRow) =>
          Number(asset.lat) == selectedLocation[0] && Number(asset.long) == selectedLocation[1]
      );
    } else {
      setDescriptionText("Selected Decade: " + selectedDecade);
      getDataArr = data.filter((asset: DataRow) => Number(asset.year) == selectedDecade);
    }

    let filteredArr = getDataArr;
    if (filter && filter.filterCol && filter.filterVal.trim() !== "") {
      filteredArr = filteredArr.filter((ele : any) => {
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

  const columnsName = [
    { label: "Asset", value: "asset_name" },
    { label: "Lat", value: "lat" },
    { label: "Long", value: "long" },
    { label: "Business Category", value: "business_category" },
    { label: "Risk Rating", value: "risk_rating" },
    { label: "Risk Factors", value: "risk_factors" },
    { label: "Year", value: "year" },
  ];

  const handleChangePage = ( event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // console.log("data ", data)
  const handleBlurFilter = () => {
    if (filter && filter.filterCol) {
      setPage(0);
      setIsUpdatedFilterSort(true);
    }
  };

  return (
    <div className=" mt-6 ">
      <div className="text-xl font-bold">Data Table</div>
      <div className="text-lg my-2">{descriptionText}</div>

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
                      //@ts-ignore
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

export default DataTable;
