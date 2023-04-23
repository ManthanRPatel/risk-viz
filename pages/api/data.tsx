import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';

export default async function handler(req: any, res: any) {
  const filePath = path.join(process.cwd(), './public/sample_data.csv');
  const data: any[] = [];
  const columnNames: string[] = [];
  let isFirstRow = true;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row: any) => {
      // console.log("data",data);
      if (isFirstRow) {
        // Get the column names from the first row
        columnNames.push(...Object.keys(row));
        isFirstRow = false;
      }
      data.push(row);
    })
    .on('end', () => {
      res.status(200).json({ columns: columnNames, data });
    })
    .on('error', (error: any) => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
}
