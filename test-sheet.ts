import axios from 'axios';
import Papa from 'papaparse';

const SHEET_ID = '14PkGTt0fy5FWd4QeH-DkJCJqdfqJn9r0GDcecAHyqYc';

async function fetchSheet(sheetName: string) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  try {
    const response = await axios.get(url);
    const parsed = Papa.parse(response.data, { header: true });
    console.log(`--- Sheet: ${sheetName} ---`);
    console.log('Headers:', parsed.meta.fields);
    console.log('First row:', parsed.data[0]);
    return parsed.data;
  } catch (error) {
    console.error(`Error fetching ${sheetName}:`, error.message);
    return null;
  }
}

async function main() {
  const variations = [
    '1-EJA-M', '2-EJA-M', '3-EJA-M'
  ];

  for (const name of variations) {
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(name)}`;
      const response = await axios.get(url);
      const parsed = Papa.parse(response.data, { header: true });
      
      const hasMasp = parsed.meta.fields.includes('MASP');
      
      if (!hasMasp && parsed.data.length > 0) {
        console.log(`CONFIRMED SHEET: "${name}"`);
      }
    } catch (e) {
    }
  }
}

main();
