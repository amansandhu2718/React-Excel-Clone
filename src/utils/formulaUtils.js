/**
 * Parses and evaluates a formula string using cell values.
 * @param {string} formula - The formula string (e.g., "( A1 + B1 )").
 * @param {Object} cells - The cells object from state.
 * @returns {string|number} - The evaluated result or "ERROR".
 */
export function evaluateFormula(formula, cells) {
  try {
    // Basic  splitting by spaces and operators
    // e.g., "( A1 + B1 )" -> ["(", "A1", "+", "B1", ")"]
    const tokens = formula.split(/([\s()+\-*/])/).filter(t => t.trim().length > 0);

    const evaluatedFormula = tokens.map(token => {
      // Check if token is a cell ID (e.g., A1, B12, AA100)
      if (/^[A-Z]+\d+$/.test(token)) {
        const cellValue = cells[token]?.value || "0";
        // Ensure the value is a number for calculation
        return isNaN(cellValue) ? 0 : cellValue;
      }
      return token;
    }).join(" ");

    // Using eval for simplicity in this project context
    // In production, a safer math parser like mathjs would be better
    const result = eval(evaluatedFormula);
    return result.toString();
  } catch (error) {
    console.error("Formula evaluation error:", error);
    return "ERROR";
  }
}

/**
 * Recursively updates children of a cell.
 * This is a visual/logic helper, but usually managed within the reducer for state consistency.
 */
export function getUpdatedCells(cellId, cells) {
  const cell = cells[cellId];
  if (!cell || !cell.children) return cells;

  let newCells = { ...cells };

  cell.children.forEach(childId => {
    const childCell = newCells[childId];
    if (childCell && childCell.formula) {
      const newValue = evaluateFormula(childCell.formula, newCells);
      newCells[childId] = { ...childCell, value: newValue };
      // Recurse
      newCells = getUpdatedCells(childId, newCells);
    }
  });

  return newCells;
}
