import "./App.css";
import PageActionContainer from "./Components/PageActionContainer/PageActionContainer";
import CellPropsActionContainer from "./Components/CellPropsActionContainer/CellPropsActionContainer";
import FormulaActionContainer from "./Components/FormulaActionContainer/FormulaActionContainer";
import GridContainer from "./Components/GridContainer/GridContainer";
import SheetContainer from "./Components/SheetContainer/SheetContainer";
import VirtualGridContainer from "./Components/VirtualizedGrid/VirtualizedGrid";

function App() {
  return (
    <>
      <PageActionContainer></PageActionContainer>
      <CellPropsActionContainer></CellPropsActionContainer>
      <FormulaActionContainer></FormulaActionContainer>
      {/* <GridContainer></GridContainer> */}
      <div style={{ height: "calc(100vh - 10.5rem)" }}>
        <VirtualGridContainer />
      </div>
      <SheetContainer></SheetContainer>
    </>
  );
}

export default App;
// #188038
