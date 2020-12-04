import { Binary } from 'core/types';
import Matrix from 'matrix';
import MatrixCoordinate from 'matrix/coordinate';

/**
 * Finds distances to nearest 1s in the binary matrix.
 * Algorithm is inspired by Breadth-first graph search.
 * @param matrix Binary matrix
 * @returns {Matrix<number>} Matrix with the same dimensions as source matrix filled with distances to nearest 1
 */
export default function findDistances(matrix: Matrix<Binary>): Matrix<number> {
  const queue: MatrixCoordinate[] = [];

  const matrixData: Binary[][] = []; // matrixData holds copy of the original matrix and will be mutated
  const resultData: number[][] = []; // resultData holds distances to 1s, initially filled with 0s

  // Preparing the data
  for (let row = 0; row < matrix.rows; row++) {
    const rowData = new Array<Binary>(matrix.columns);
    const resultRowData = new Array<number>(matrix.columns);

    for (let column = 0; column < matrix.columns; column++) {
      const element = matrix.get(row, column);
      rowData[column] = element;
      resultRowData[column] = 0;

      // putting all 1s to the queue
      if (element === 1) {
        queue.push(new MatrixCoordinate(row, column));
      }
    }

    matrixData.push(rowData);
    resultData.push(resultRowData);
  }

  matrix = new Matrix<Binary>(matrixData);

  const result = new Matrix<number>(resultData);

  let currentDistance = 0; // holds current distance from nearest 1

  while (queue.length !== 0) {
    // queue can grow during the loop iteration, but we only want to process what was there at the beginning
    let queueLength = queue.length;

    while (queueLength--) {
      const coordinate = queue.shift();

      if (!coordinate) {
        throw new Error('Invalid state: no coordinate in the queue');
      }

      result.setAtCoordinate(coordinate, currentDistance); // updating result matrix with current distance to 1

      const left = matrix.left(coordinate);

      // if there is a neighbor on the left and it was not visited before
      if (left && matrix.getAtCoordinate(left) === 0) {
        matrix.setAtCoordinate(left, 1); // mark as visited
        queue.push(left); // and push to the queue to lookup it's neighbors on the next iteration
      }

      // do the same for right, top and bottom neighbors

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
