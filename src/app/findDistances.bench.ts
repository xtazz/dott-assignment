import Benchmark from 'benchmark';
import { Binary } from 'core/types';
import Matrix from 'matrix';

import findDistances from 'app/findDistances';

function generateMatrix(rows: number, columns: number): Matrix<Binary> {
  const data: Binary[][] = Array.from({ length: rows }, () => {
    return Array.from({ length: columns }, () => Math.round(Math.random()) as Binary);
  });

  return new Matrix(data);
}

const data = {
  matrix10: generateMatrix(10, 10),
  matrix100: generateMatrix(100, 100),
  matrix1000: generateMatrix(1000, 1000),
  matrix10000: generateMatrix(10000, 10000),
};

const suite = new Benchmark.Suite('findDistances');

suite
  .add('findDistances#10', () => {
    findDistances(data.matrix10);
  })
  .add('findDistances#100', () => {
    findDistances(data.matrix100);
  })
  .add('findDistances#1000', () => {
    findDistances(data.matrix1000);
  })
  .add('findDistances#10000', () => {
    findDistances(data.matrix10000);
  });

suite
  .on('cycle', (event: { target: { toString(): void } }) => {
    console.log(event.target.toString());
  })
  .on('complete', () => {
    console.log('Completed');
  })
  .run({ async: true });
