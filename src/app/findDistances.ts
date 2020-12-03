import { Binary } from 'core/types';
import Matrix from 'matrix';
import MatrixCoordinate from 'matrix/coordinate';

export default function findDistances(matrix: Matrix<Binary>): Matrix<number> {
  const queue: MatrixCoordinate[] = [];

  const matrixData: Binary[][] = [];
  const resultData: number[][] = [];

  for (let row = 0; row < matrix.rows; row++) {
    const rowData = new Array<Binary>(matrix.columns);
    const resultRowData = new Array<number>(matrix.columns);

    for (let column = 0; column < matrix.columns; column++) {
      const element = matrix.get(row, column);
      rowData[column] = element;
      resultRowData[column] = 0;

      if (element === 1) {
        queue.push(new MatrixCoordinate(row, column));
      }
    }

    matrixData.push(rowData);
    resultData.push(resultRowData);
  }

  matrix = new Matrix<Binary>(matrixData);

  const result = new Matrix<number>(resultData);

  let currentDistance = 0;

  while (queue.length !== 0) {
    let queueLength = queue.length;

    while (queueLength--) {
      const coordinate = queue.shift()!;
      result.setAtCoordinate(coordinate, currentDistance);

      const left = matrix.left(coordinate);

      if (left && matrix.getAtCoordinate(left) === 0) {
        matrix.setAtCoordinate(left, 1);
        queue.push(left);
      }

      const right = matrix.right(coordinate);

      if (right && matrix.getAtCoordinate(right) === 0) {
        matrix.setAtCoordinate(right, 1);
        queue.push(right);
      }

      const top = matrix.top(coordinate);

      if (top && matrix.getAtCoordinate(top) === 0) {
        matrix.setAtCoordinate(top, 1);
        queue.push(top);
      }

      const bottom = matrix.bottom(coordinate);

      if (bottom && matrix.getAtCoordinate(bottom) === 0) {
        matrix.setAtCoordinate(bottom, 1);
        queue.push(bottom);
      }
    }

    currentDistance++;
  }

  return result;
}
