import axios from 'axios';
import Papa from 'papaparse';

// ID DA PLANILHA (Copiado da URL de edição, NÃO do link de publicação)
// Exemplo: https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit
const SHEET_ID = '14PkGTt0fy5FWd4QeH-DkJCJqdfqJn9r0GDcecAHyqYc';

// Cache to prevent too many requests
const cache: Record<string, { timestamp: number; data: any }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchSheet(sheetName: string) {
  // Check cache
  if (cache[sheetName] && Date.now() - cache[sheetName].timestamp < CACHE_DURATION) {
    return cache[sheetName].data;
  }

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  
  try {
    const response = await axios.get(url);
    const parsed = Papa.parse(response.data, { header: true });
    
    // Update cache
    cache[sheetName] = {
      timestamp: Date.now(),
      data: parsed.data
    };
    
    return parsed.data;
  } catch (error) {
    console.error(`Error fetching sheet ${sheetName}:`, error);
    return [];
  }
}

export const sheetService = {
  async getUsers() {
    const data = await fetchSheet('Login');
    return data
      .filter((row: any) => row.MASP && row.NOME)
      .map((row: any) => ({ 
        masp: row.MASP.toString().trim(), 
        name: row.NOME.trim() 
      }));
  },

  getYears() {
    return [
      // Fundamental
      '6-ANO', '7-ANO', '8-ANO', '9-ANO',
      // Médio Diurno
      '1-REG-DIURNO', '2-REG-DIURNO', '3-REG-DIURNO',
      // Médio Noturno
      '1-REG-NOT-M', '2-REG-NOT-M', '3-REG-NOT-M',
      '1-REG-NOT-S', '2-REG-NOT-S', '3-REG-NOT-S',
      // EJA
      '2-EJA-S', '3-EJA-S',
      '2-EJA-M'
    ];
  },

  async getSubjects(yearName: string) {
    const data = await fetchSheet(yearName);
    
    if (!data || data.length === 0) {
      return [];
    }

    const subjects: any[] = [];
    let currentSubject: { name: string; questionCount: number; startQ: number } | null = null;

    for (const row of data as any[]) {
      const qNo = parseInt(row['Q No']);
      const disciplina = row['DISCIPLINA'] ? row['DISCIPLINA'].trim() : null;

      // Start of a new subject block
      if (disciplina) {
        if (currentSubject) {
          subjects.push(currentSubject);
        }
        // Initialize new subject
        currentSubject = { 
          name: disciplina, 
          questionCount: 0, 
          startQ: !isNaN(qNo) ? qNo : 1 
        };
      }

      // Count questions for the current subject
      if (!isNaN(qNo) && currentSubject) {
        currentSubject.questionCount++;
      }
    }
    
    // Push the last subject
    if (currentSubject) {
      subjects.push(currentSubject);
    }

    return subjects;
  }
};
