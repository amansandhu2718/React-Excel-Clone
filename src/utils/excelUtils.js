import * as XLSX from "xlsx";

export const exportToExcel = (sheets, sheetOrder, workbookName = "Untitled Spreadsheet") => {
  const fileName = `${workbookName}.xlsx`;
  const workbook = XLSX.utils.book_new();

  sheetOrder.forEach((sheetId) => {
    const sheetData = sheets[sheetId];
    const cells = sheetData.cells;
    
    // We need to find the maximum row and column to build the grid
    // For simplicity, we'll collect all cell keys and parse them
    const cellKeys = Object.keys(cells);
    if (cellKeys.length === 0) {
      // Empty sheet
      const ws = XLSX.utils.aoa_to_sheet([[""]]);
      XLSX.utils.book_append_sheet(workbook, ws, sheetData.name);
      return;
    }

    // Convert cells map to AOA (Array of Arrays)
    // First, determine dimensions
    let maxRow = 0;
    let maxCol = 0;

    const parsedCells = cellKeys.map(key => {
      const match = key.match(/([A-Z]+)(\d+)/);
      if (match) {
        const colStr = match[1];
        const row = parseInt(match[2], 10);
        
        // Convert colStr to index
        let col = 0;
        for (let i = 0; i < colStr.length; i++) {
          col = col * 26 + (colStr.charCodeAt(i) - 64);
        }
        
        maxRow = Math.max(maxRow, row);
        maxCol = Math.max(maxCol, col);
        
        return { r: row - 1, c: col - 1, v: cells[key].value };
      }
      return null;
    }).filter(Boolean);

    // Create a sparse array
    const aoa = Array.from({ length: maxRow }, () => Array(maxCol).fill(""));
    
    parsedCells.forEach(cell => {
      aoa[cell.r][cell.c] = cell.v;
    });

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    XLSX.utils.book_append_sheet(workbook, ws, sheetData.name);
  });

  XLSX.writeFile(workbook, fileName);
};
