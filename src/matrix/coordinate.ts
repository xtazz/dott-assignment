/**
 * Holds (row, column) coordinate within the matrix
 */
export default class MatrixCoordinate {
  // Matrix row
  readonly row: number;
  // Matrix column
  readonly column: number;

  /**
   * Creates a matrix coordinate
   * @param {number} row Matrix row
   * @param {number} column Matrix column
   */
  constructor(row: number, column: number) {
    this.row = row;
    this.column = column;
  }
}
