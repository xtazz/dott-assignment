import { Binary } from './types';
import Matrix from './matrix';

const data: Binary[][] = [
  [0, 0, 0, 1],
  [0, 0, 1, 1],
  [0, 1, 1, 0],
];

const matrix = new Matrix<Binary>(data);

console.log(matrix.toString());
