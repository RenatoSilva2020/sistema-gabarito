import axios from 'axios';
import Papa from 'papaparse';

const SHEET_ID = '14PkGTt0fy5FWd4QeH-DkJCJqdfqJn9r0GDcecAHyqYc';

async function main() {
  const sheetName = '1-REG-DIURNO';
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  
  try {
    const response = await axios.get(url);
    const parsed = Papa.parse(response.data, { header: true });
    console.log(`--- Sheet: ${sheetName} ---`);
    console.log('Headers:', parsed.meta.fields);
    console.log('First 5 rows:', parsed.data.slice(0, 5));
    
    // Test parsing logic
    const subjects: any[] = [];
    let currentSubject = null;
    
    // We need to handle the case where the CSV might return empty strings for merged cells
    // In the image, "LÍNGUA PORTUGUESA" is in the first row of the block.
    
    for (const row of parsed.data as any[]) {
      const qNo = parseInt(row['Q No']);
      const disciplina = row['DISCIPLINA'] ? row['DISCIPLINA'].trim() : null;
      
      if (disciplina) {
        if (currentSubject) {
          subjects.push(currentSubject);
        }
        currentSubject = { name: disciplina, questionCount: 0, startQ: qNo || 1 };
      }
      
      if (!isNaN(qNo) && currentSubject) {
        currentSubject.questionCount++;
      }
    }
    if (currentSubject) {
      subjects.push(currentSubject);
    }
    
    console.log('Parsed Subjects:', subjects);

  } catch (error) {
    console.error(`Error fetching ${sheetName}:`, error.message);
  }
}

main();
