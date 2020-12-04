import { Readable } from 'stream';

import BinaryMatrixReader from 'reader/binary';
import * as fixture from 'reader/binary.fixture';
import MatrixReaderError, { MatrixReaderErrorCode } from './error';
import MatrixReaderLimits from './limits';
import Matrix from 'matrix';
import { Binary } from 'core/types';

function testSuccess(
  name: string,
  input: {
    value: string;
    limits?: MatrixReaderLimits;
  },
  expectations: string[],
) {
  test(name, (done) => {
    const readableInput = Readable.from(input.value);
    const reader = new BinaryMatrixReader(readableInput, input.limits);

    reader.on('error', (error) => {
      done.fail(`should not have error, but got: ${error}`);
      readableInput.emit('close');
    });

    reader.on('done', (matrices: Matrix<Binary>[]) => {
      const result = matrices.map((m) => m.toString());
      expect(result).toStrictEqual(expectations);
      done();
      readableInput.emit('close');
    });

    reader.start();
  });
}

function testError(
  name: string,
  input: {
    value: string;
    limits?: MatrixReaderLimits;
  },
  expectedCode: MatrixReaderErrorCode,
) {
  test(name, (done) => {
    const readableInput = Readable.from(input.value);
    const reader = new BinaryMatrixReader(readableInput, input.limits);

    reader.on('error', (error) => {
      expect(error.constructor).toEqual(MatrixReaderError);
      const readerErr = error as MatrixReaderError;
      expect(readerErr.code).toEqual(expectedCode);
      done();
      readableInput.emit('close');
    });

    reader.on('done', () => {
      done.fail('should not succeed');
      readableInput.emit('close');
    });

    reader.start();
  });
}

describe('count', () => {
  testError('negative number', fixture.count.negative, MatrixReaderErrorCode.CountFormatInvalid);
  testError('not a number', fixture.count.notNumeric, MatrixReaderErrorCode.CountFormatInvalid);
  testError('zero', fixture.count.zero, MatrixReaderErrorCode.CountFormatInvalid);
});

describe('dimensions', () => {
  testError('negative rows', fixture.dimensions.negativeRows, MatrixReaderErrorCode.DimensionsFormatInvalid);
  testError('negative columns', fixture.dimensions.negativeColumns, MatrixReaderErrorCode.DimensionsFormatInvalid);
  testError('non numeric rows', fixture.dimensions.nonNumericRows, MatrixReaderErrorCode.DimensionsFormatInvalid);
  testError('non numeric columns', fixture.dimensions.nonNumericColumns, MatrixReaderErrorCode.DimensionsFormatInvalid);
  testError('zero rows', fixture.dimensions.zeroRows, MatrixReaderErrorCode.DimensionsFormatInvalid);
  testError('zero columns', fixture.dimensions.zeroColumns, MatrixReaderErrorCode.DimensionsFormatInvalid);
  testError('no space', fixture.dimensions.noDimensionsSpace, MatrixReaderErrorCode.DimensionsFormatInvalid);
  testError('empty', fixture.dimensions.noDimensions, MatrixReaderErrorCode.DimensionsFormatInvalid);
});

describe('rows', () => {
  testError('not binary', fixture.rows.notBinary, MatrixReaderErrorCode.ColumnFormatInvalid);
  testError('not numeric', fixture.rows.notNumeric, MatrixReaderErrorCode.ColumnFormatInvalid);
  testError('columns count mismatch', fixture.rows.invalidColumnCount, MatrixReaderErrorCode.RowFormatInvalid);
  testError('empty', fixture.rows.empty, MatrixReaderErrorCode.RowFormatInvalid);
});

describe('limits', () => {
  testError('count', fixture.limits.countExceeded, MatrixReaderErrorCode.CountExceedsLimit);
  testError('rows', fixture.limits.rowsExceeded, MatrixReaderErrorCode.DimensionsExceedLimit);
  testError('columns', fixture.limits.columnsExceeded, MatrixReaderErrorCode.DimensionsExceedLimit);
});

testError('input closed', fixture.inputClosed, MatrixReaderErrorCode.InputClosed);

describe('success', () => {
  testSuccess('single', fixture.single, fixture.single.expect);
  testSuccess('multiple', fixture.multiple, fixture.multiple.expect);
});
