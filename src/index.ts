import { Binary } from './types';
import Matrix from './matrix';
import findDistances from './findDistances';

const data: Binary[][] = [
  [0, 0, 0, 1],
  [0, 0, 1, 1],
  [0, 1, 1, 0],
];

const matrix = new Matrix<Binary>(data);

const distances = findDistances(matrix);

console.log(matrix.toString());
console.log(distances.toString());
