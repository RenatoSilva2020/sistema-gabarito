import axios from 'axios';

const SHEET_ID = '14PkGTt0fy5FWd4QeH-DkJCJqdfqJn9r0GDcecAHyqYc';

async function fetchSheetMetadata() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`;
  try {
    const response = await axios.get(url);
    const html = response.data;
    
    // Search for "6º"
    const index = html.indexOf('6º');
    if (index !== -1) {
      console.log('Found "6º" at index:', index);
      console.log('Context:', html.substring(index - 100, index + 100));
    } else {
      console.log('"6º" not found in HTML.');
    }

    // Search for "Login"
    const loginIndex = html.indexOf('Login');
    if (loginIndex !== -1) {
      console.log('Found "Login" at index:', loginIndex);
      console.log('Context:', html.substring(loginIndex - 100, loginIndex + 100));
    }
  } catch (error) {
    console.error(`Error fetching metadata:`, error.message);
  }
}

fetchSheetMetadata();
