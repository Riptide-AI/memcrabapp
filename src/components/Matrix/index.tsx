import React, { createContext, useContext, useState, ReactNode } from "react";
import styles from "./styles.module.scss"
import Button from "@/components/ui/Button";

type Cell = {
  id: number;
  amount: number;
};
type Row = {
  row: Array<Cell>;
  rowIndex: number;
};

type MatrixContextType = {
  matrix: Cell[][];
  incrementCell: (row: number, col: number) => void;
  addRow: () => void;
  removeRow: (rowIndex: number) => void;
  findNearestCells: (row: number, col: number, highlightAmount: number) => void;
  highlightAmount: number;
  highlightedCells: Set<number>;
  clearHighlight: () => void;
};

const MatrixContext = createContext<MatrixContextType | undefined>(undefined);

type MatrixProviderProps = {
  rows: number;
  cols: number;
  highlightAmount: number;
  children: ReactNode;
};

const MatrixProvider: React.FC<MatrixProviderProps> = ({ rows, cols, highlightAmount, children }) => {
  const generateMatrix = (rows: number, cols: number): Cell[][] => {
    let idCounter = 0;
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        id: idCounter++,
        amount: Math.floor(Math.random() * 900) + 100,
      }))
    );
  };
  const [matrix, setMatrix] = useState<Cell[][]>(generateMatrix(rows, cols));
  const [highlightedCells, setHighlightedCells] = useState<Set<number>>(new Set());

  const incrementCell = (row: number, col: number) => {
    setMatrix((prev) => {
      const newMatrix = [...prev]
      newMatrix[row][col].amount += 1;
      return newMatrix;
    });
  };

  const addRow = () => {
    setMatrix((prev) => {
      const newRow = Array.from({ length: cols }, (_, col) => ({
        id: prev.flat().length + col,
        amount: Math.floor(Math.random() * 900) + 100,
      }))
      const newMatrix = [...prev, newRow]
      return newMatrix;
    });
  };

  const removeRow = (rowIndex: number) => {
    setMatrix((prev) => prev.filter((_, index) => index !== rowIndex));
  };

  const findNearestCells = (row: number, col: number, highlightAmount: number) => {

    const targetCell = matrix[row][col];
    const allCells = matrix.flat();
    allCells.sort((a, b) => Math.abs(a.amount - targetCell.amount) - Math.abs(b.amount - targetCell.amount));
    setHighlightedCells(new Set(allCells.slice(1, highlightAmount + 1).map((cell) => cell.id)));
  };

  const clearHighlight = () => {
    setHighlightedCells(new Set());
  };

  return (
    <MatrixContext.Provider value={{ matrix, incrementCell, addRow, removeRow, findNearestCells, highlightedCells, highlightAmount, clearHighlight }}>
      {children}
    </MatrixContext.Provider>
  );
};

const useMatrix = () => {
  const context = useContext(MatrixContext);
  if (!context) throw new Error("No context found");
  return context;
};

const Row: React.FC<Row> = ({ row, rowIndex }) => {
  const { removeRow, highlightedCells } = useMatrix();
  const [hovered, setHovered] = useState(false);

  const total = row.reduce((sum, cell) => sum + cell.amount, 0)
  const maxRowValue = Math.max(...row.map((cell) => cell.amount));

  return (
    <tr data-row={rowIndex} className={styles.matrix__row}>
      {row.map((cell) => {
        const percentage = hovered ? (cell.amount / total) * 100 : cell.amount;
        const heatmapBg = total > 0 ? (cell.amount / maxRowValue) * 100 : 0;
        return (
          <td key={cell.id} data-col
            className={`${styles.matrix__cell} ${highlightedCells.has(cell.id) ? styles.highlighted : ''}`}
            style={{
              background: hovered
                ? `linear-gradient(to top, var(--color-primary) ${heatmapBg}%, transparent 0%)`
                : undefined
            }}>
            <span className={styles.matrix__cell__value}>
              {hovered ? `${percentage.toFixed(1)}%` : cell.amount}
            </span>
          </td>
        );
      })}
      <th className={styles.matrix__row__header}>
        <div className={styles.matrix__row__header_wrapper}>
          <span className={styles.matrix__cell__total} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} >{total}</span>
          <Button onClick={() => removeRow(rowIndex)} className={styles.matrix__cell__remove_btn}><div className={styles.cross_icon}></div></Button>
        </div>
      </th>
    </tr >
  );
};

const Matrix: React.FC = () => {
  const { matrix, addRow, incrementCell, findNearestCells, clearHighlight, highlightAmount } = useMatrix();

  const handleCellEvent = (event: React.MouseEvent<HTMLTableSectionElement>) => {
    const target = event.target as HTMLElement;

    const td = target.closest("td[data-col]");

    if (!td) {
      clearHighlight();
      return;
    }

    const rowElement = td.closest("tr");
    if (!rowElement) return;

    const rowIndex = Number(rowElement.getAttribute("data-row"));
    const colIndex = Array.from(rowElement.children).indexOf(td);

    if (event.type === "click") {
      incrementCell(rowIndex, colIndex);
    } else if (event.type === "mouseover") {
      findNearestCells(rowIndex, colIndex, highlightAmount);

    }
    else if (event.type === "mouseleave") {
      clearHighlight();
    }
  };

  return (
    <div className={styles.matrix}>
      <div className={styles.matrix__wrapper}>
        <table className={styles.matrix__table}>
          <tbody onClick={handleCellEvent} onMouseOver={handleCellEvent} onMouseLeave={handleCellEvent} className={styles.matrix__body}>
            {matrix.map((row, rowIndex) => (
              <Row row={row} rowIndex={rowIndex} key={rowIndex} />
            ))}
          </tbody>
          <tfoot className={styles.matrix__footer}>
            <tr >
              {matrix[0]?.map((_, colIndex) => {
                const average =
                  matrix.reduce((sum, row) => sum + (row[colIndex]?.amount || 0), 0) / matrix.length;
                return (
                  <th key={colIndex} className={styles.matrix__footer__cell}>
                    <span>{average.toFixed(1)}</span>
                  </th>
                );

              })}
              <th></th>
            </tr>
          </tfoot>
        </table>

      </div>
      <Button onClick={addRow} className={styles.matrix__add_btn}>Add Row</Button>
    </div>
  );
};

export { MatrixProvider, useMatrix, Matrix };
