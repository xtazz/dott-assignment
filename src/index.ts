import { Binary } from './types';
import Matrix from './matrix';
import findDistances from './findDistances';
import BinaryMatrixReader, { MatrixReaderEvent, MatrixReaderLimits } from './binaryMatrixReader';

async function readMatrices(input: NodeJS.ReadStream, limits?: MatrixReaderLimits): Promise<Matrix<Binary>[]> {
  return new Promise((resolve, reject) => {
    const matrixReader = new BinaryMatrixReader(input, limits);
    matrixReader.on(MatrixReaderEvent.Error, (error: Error) => reject(error));
    matrixReader.on(MatrixReaderEvent.Done, (matrices: Matrix<Binary>[]) => resolve(matrices));
    matrixReader.start();
  });
}

async function main() {
  const limits: MatrixReaderLimits = {
    count: 1000,
    dimensions: {
      rows: 182,
      columns: 182,
    },
  };

  try {
    const matrices = await readMatrices(process.stdin, limits);
    const output = matrices.map((m) => findDistances(m)).join('\n\n');
    console.log(output);
  } catch (error) {
    console.log(error);
  }
}

(async () => {
  await main();
})();
