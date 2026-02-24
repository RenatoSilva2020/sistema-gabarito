import axios from 'axios';

const SHEET_ID = '14PkGTt0fy5FWd4QeH-DkJCJqdfqJn9r0GDcecAHyqYc';

async function main() {
  try {
    const response = await axios.get(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`);
    const html = response.data;
    
    // The sheet data is often in a big JSON object in the HTML.
    // We can look for the pattern: "name":"SHEET_NAME"
    // or [gid,"SHEET_NAME"]
    
    const regex = /"name":"([^"]+)"/g;
    const matches = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      matches.push(match[1]);
    }
    
    // Filter for likely sheet names (exclude common JS/CSS strings)
    const sheetNames = matches.filter(name => 
      !name.includes('.') && 
      !name.includes('/') && 
      !name.includes('google') &&
      name.length < 30 &&
      (name.includes('ANO') || name.includes('REG') || name.includes('EJA') || name.includes('NOT'))
    );
    
    console.log('Detected Sheets:', [...new Set(sheetNames)]);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
