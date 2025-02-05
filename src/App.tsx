import { useState } from "react";
import { Matrix, MatrixProvider } from "./components/Matrix";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import styles from "./App.module.scss";

function App() {
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [highlightAmount, setHighlightAmount] = useState(10);
  const [matrixConfig, setMatrixConfig] = useState<{ rows: number; cols: number } | null>(null);
  const [toggleRerender, setToggleRerender] = useState(false);

  const handleClick = (): void => {
    setMatrixConfig({ rows, cols });
    setToggleRerender((prev) => !prev)
  };

  const handleRowsChange = (rows: number): void => {
    setRows(Math.min(rows, 100));
  };
  const handleColsChange = (cols: number): void => {
    setCols(Math.min(cols, 100));
  };
  const handleHighlightAmountChange = (amount: number): void => {
    setHighlightAmount(Math.min(amount, 10000));
  };


  return (
    <div className={styles.app}>
      <div className={styles.app__inputs}>
        <Input
          type="number"
          title="Rows"
          value={rows}
          onChange={(e) => handleRowsChange(Number(e.target.value))}
          max={100}
          min={1}
        />
        <Input
          type="number"
          title="Columns"
          value={cols}
          onChange={(e) => handleColsChange(Number(e.target.value))}
          max={100}
          min={1}
        />
        <Input
          type="number"
          title="Amount of highlight cells"
          value={highlightAmount}
          onChange={(e) => handleHighlightAmountChange(Number(e.target.value))}
          max={10000}
          min={1}
        />

      </div>
      <Button onClick={handleClick} className={styles.app__generate_btn}>Generate Matrix</Button>
      {matrixConfig ?
        <MatrixProvider
          rows={matrixConfig.rows}
          cols={matrixConfig.cols}
          highlightAmount={highlightAmount}
          key={`${toggleRerender}`}
        >
          <Matrix />
        </MatrixProvider>
        : <div className={styles.app__message}>Press generate button to inspect the Matrix</div>}
    </div>
  );
}

export default App;
