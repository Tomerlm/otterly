import fs from "fs";
import XLSX from "xlsx";
import * as cheerio from "cheerio";
import _ from "lodash";
import { TransactionData } from "../types";
import { file } from "bun";
// Load the XLSX file

const removeIdPrefix = (id: string) => id.substring(4);

const cleanData = (mappedData: TransactionData[][]) => {
  return _(mappedData)
    .flatten()
    .filter((data: TransactionData) => _.isNumber(data.dealAmount))
    .value();
};

const getRanges = (
  htmlContent: string
): Array<{ start: string; end: string }> => {
  // Define the URL of the webpage you want to scrape

  // The text content you want to search for in the <td> elements

  const $ = cheerio.load(htmlContent);

  // Find all <td> elements
  const tdElements = $("td");
  const startValues: string[] = [];
  const endValues: string[] = [];
  // Iterate through the <td> elements and check their text content
  tdElements.each((index, element) => {
    const startIndicator = "תאריך רכישה";
    const endIndicator = `סך חיוב בש"ח:`;
    const tdText = $(element).text().trim();
    const id = $(element).prop("id");

    // Check if the text content of the <td> element matches the desired text
    if (tdText === startIndicator) {
      // If it matches, do something with the element
      startValues.push(removeIdPrefix(id));
    }

    if (tdText === endIndicator) {
      const number = parseInt(removeIdPrefix(id).substring(1));

      endValues.push(`H${number}`);
    }
  });

  return startValues.map((s, i) => {
    return { start: s, end: endValues[i] };
  });
};

const parseIsracard = async (filePath: string) => {
  console.log(filePath);
  const workbook = XLSX.readFile(filePath);

  // Specify the column mapping
  const columnMapping: { [k: string]: keyof TransactionData } = {
    "תאריך רכישה": "date",
    "שם בית עסק": "business",
    "סכום עסקה": "dealAmount",
    "מטבע מקור": "currency",
    "סכום חיוב": "chargeAmount",
    "פירוט נוסף": "misc",
  };

  // Get the first sheet from the workbook
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert XLSX data to JSON
  const htmlContent = XLSX.utils.sheet_to_html(worksheet);

  const ranges = getRanges(htmlContent);
  const mappedData: TransactionData[][] = ranges.map((range, index) => {
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      range: `${range.start}:${range.end}`,
    });

    // Map column names and create JSON object
    const mappedData = jsonData.map((row: any) => {
      const mappedRow: any = {};
      for (const key in columnMapping) {
        if (row[key]) {
          mappedRow[columnMapping[key]] = row[key];
        }
      }
      return mappedRow;
    });

    return mappedData;
  });

  return cleanData(mappedData);
};

export default parseIsracard;
