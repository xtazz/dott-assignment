import MatrixCoordinate from './coordinate';

/**
 * Contains data and dimensional information of the matrix.
 * Supports get/set operations as well as retrieving adjacent elements.
 */
export default class Matrix<Element> {
  private data: Element[][];

  readonly rows: number;
  readonly columns: number;

  /**
   * Creates a matrix holding provided data.
   * @param data Two-dimensional array containing matrix elements.
   */
  constructor(data: Element[][]) {
    if (data.length === 0) {
      throw new Error('matrix data is empty');
    }

    this.rows = data.length;
    this.columns = data[0].length;
    this.data = data;
  }

  /**
   * Gets element value using specified coordinate.
   * @param {MatrixCoordinate} coordinate Element coordinate in the matrix.
   * @returns {Element} Value at specified coordinate
   */
  getAtCoordinate(coordinate: MatrixCoordinate): Element {
    return this.data[coordinate.row][coordinate.column];
  }

  /**
   * Gets element value at specified row and column.
   * @param {number} row Matrix row
   * @param {number} column Matrix column
   * @returns {Element} Value at specified row and column
   */
  get(row: number, column: number): Element {
    return this.data[row][column];
  }

  /**
   * Updates value at specified coordinate.
   * @param {MatrixCoordinate} coordinate Coordinate within the matrix
   * @param {Element} value New value to set
   */
  setAtCoordinate(coordinate: MatrixCoordinate, value: Element) {
    this.data[coordinate.row][coordinate.column] = value;
  }

  /**
   * Updates value at specified row and column.
   * @param {number} row Matrix row
   * @param {number} column Matrix column
   * @param {Element} value New value to set
   */
  set(row: number, column: number, value: Element) {
    return (this.data[row][column] = value);
  }

  /**
   * Gets coordinate of the left adjacent of the specified coordinate.
   * @param {MatrixCoordinate} coordinate Element coordinate in the matrix.
   * @returns {MatrixCoordinate | null} Coordinate of the left adjacent or null if there is none.
   */
  left(coordinate: MatrixCoordinate): MatrixCoordinate | null {
    if (coordinate.column <= 0) {
      return null;
    }

    return new MatrixCoordinate(coordinate.row, coordinate.column - 1);
  }

  /**
   * Gets coordinate of the right adjacent of the specified coordinate.
   * @param {MatrixCoordinate} coordinate Element coordinate in the matrix.
   * @returns {MatrixCoordinate | null} Coordinate of the right adjacent or null if there is none.
   */
  right(coordinate: MatrixCoordinate): MatrixCoordinate | null {
    const rightColumn = coordinate.column + 1;

    if (rightColumn >= this.columns) {
      return null;
    }

    return new MatrixCoordinate(coordinate.row, rightColumn);
  }

  /**
   * Gets coordinate of the top adjacent of the specified coordinate.
   * @param {MatrixCoordinate} coordinate Element coordinate in the matrix.
   * @returns {MatrixCoordinate | null} Coordinate of the top adjacent or null if there is none.
   */
  top(coordinate: MatrixCoordinate): MatrixCoordinate | null {
    if (coordinate.row <= 0) {
      return null;
    }

    return new MatrixCoordinate(coordinate.row - 1, coordinate.column);
  }

  /**
   * Gets coordinate of the bottom adjacent of the specified coordinate.
   * @param {MatrixCoordinate} coordinate Element coordinate in the matrix.
   * @returns {MatrixCoordinate | null} Coordinate of the bottom adjacent or null if there is none.
   */
  bottom(coordinate: MatrixCoordinate): MatrixCoordinate | null {
    const bottomRow = coordinate.row + 1;

    if (bottomRow >= this.rows) {
      return null;
    }

    return new MatrixCoordinate(bottomRow, coordinate.column);
  }

  /**
   * Converts matrix to string with columns separated by space and
   * rows separated by new line, e.g.:
   * 1 0 1 0
   * 0 1 0 0
   * 0 0 1 0
   * @returns {string} Matrix string representation
   */
  toString(): string {
    return this.data.map((row) => row.join(' ')).join('\n');
  }
}
