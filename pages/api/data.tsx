import csv from "csv-parser";
import fs from "fs";
import path from "path";

function convertJSONString(jsonString:any) {
  const parsedJson = JSON.parse(jsonString);
  const keys = Object.keys(parsedJson);
  let result = '';
  for (let i = 0; i < keys.length; i++) {
    result += `${keys[i]}: ${parsedJson[keys[i]]}`;
    if (i !== keys.length - 1) {
      result += ', ';
    }
  }
  return result;
}

export default async function handler(req: any, res: any) {
  const filePath = path.join(process.cwd(), "./public/sample_data.csv");
  const data: any[] = [];
  const columnNames: string[] = [];
  let isFirstRow = true;
  let id = 0;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row: any) => {
      if (isFirstRow) {
        // Get the column names from the first row
        columnNames.push(...Object.keys(row));
        isFirstRow = false;
      }
      const newRow: any = { id: id };
      for (const [key, value] of Object.entries(row)) {
        if(key.toLowerCase().replace(/ /g, "_") === "risk_factors"){
          newRow["risk_factors"] = convertJSONString(value);
        }
        else{
          newRow[key.toLowerCase().replace(/ /g, "_")] = value;
        }
      }
      data.push(newRow);
      id++;
    })
    .on("end", () => {
      res.status(200).json({ columns: columnNames, data });
    })
    .on("error", (error: any) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
}
