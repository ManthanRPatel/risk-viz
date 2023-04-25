import csv from "csv-parser";
import fs from "fs";
import path from "path";

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
        newRow[key.toLowerCase().replace(/ /g, "_")] = value;
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
