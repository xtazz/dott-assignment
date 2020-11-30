import MatrixCoordinate from './coordinate';

export default class Matrix<Element> {
  private data: Element[][];
  readonly rows: number;
  readonly columns: number;

  constructor(data: Element[][]) {
    if (data.length === 0) {
      throw new Error('matrix data is empty');
    }

    this.rows = data.length;
    this.columns = data[0].length;
    this.data = data;
  }

  getAtCoordinate(coordinate: MatrixCoordinate): Element {
    return this.data[coordinate.row][coordinate.column];
  }

  get(row: number, column: number): Element {
    return this.data[row][column];
  }

  setAtCoordinate(coordinate: MatrixCoordinate, value: Element) {
    this.data[coordinate.row][coordinate.column] = value;
  }

  set(row: number, column: number, value: Element) {
    return (this.data[row][column] = value);
  }

  left(coordinate: MatrixCoordinate): MatrixCoordinate | null {
    if (coordinate.column <= 0) {
      return null;
    }

    return new MatrixCoordinate(coordinate.row, coordinate.column - 1);
  }

  right(coordinate: MatrixCoordinate): MatrixCoordinate | null {
    if (coordinate.column >= this.columns) {
      return null;
    }

    return new MatrixCoordinate(coordinate.row, coordinate.column + 1);
  }

  top(coordinate: MatrixCoordinate): MatrixCoordinate | null {
    if (coordinate.row <= 0) {
      return null;
    }

    return new MatrixCoordinate(coordinate.row - 1, coordinate.column);
  }

  bottom(coordinate: MatrixCoordinate): MatrixCoordinate | null {
    if (coordinate.row >= this.rows) {
      return null;
    }

    return new MatrixCoordinate(coordinate.row + 1, coordinate.column);
  }

  toString(): string {
    return this.data.map((row) => row.join(' ')).join('\n');
  }
}
