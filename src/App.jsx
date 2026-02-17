import "./App.css";
import PageActionContainer from "./Components/PageActionContainer/PageActionContainer";
import CellPropsActionContainer from "./Components/CellPropsActionContainer/CellPropsActionContainer";
import FormulaActionContainer from "./Components/FormulaActionContainer/FormulaActionContainer";
import GridContainer from "./Components/GridContainer/GridContainer";
import SheetContainer from "./Components/SheetContainer/SheetContainer";

function App() {
  return (
    <>
      <PageActionContainer></PageActionContainer>
      <CellPropsActionContainer></CellPropsActionContainer>
      <FormulaActionContainer></FormulaActionContainer>
      <GridContainer></GridContainer>
      <SheetContainer></SheetContainer>
    </>
  );
}

export default App;
// #188038
