import { Readable } from 'stream';

import BinaryMatrixReader from 'reader/binary';
import * as fixture from 'reader/binary.fixture';
import MatrixReaderError, { MatrixReaderErrorCode } from './error';

function testError(input: string, expectedCode: MatrixReaderErrorCode, done: jest.DoneCallback) {
  const readableInput = Readable.from(input);
  const reader = new BinaryMatrixReader(readableInput);

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
}

describe('count negative scenarios', () => {
  test('negative number', (done) => {
    testError(fixture.count.negative, MatrixReaderErrorCode.CountFormatInvalid, done);
  });

  test('not a number', (done) => {
    testError(fixture.count.notNumeric, MatrixReaderErrorCode.CountFormatInvalid, done);
  });

  test('zero', (done) => {
    testError(fixture.count.zero, MatrixReaderErrorCode.CountFormatInvalid, done);
  });
});

describe('dimensions negative scenarios', () => {
  test('negative rows', (done) => {
    testError(fixture.dimensions.negativeRows, MatrixReaderErrorCode.DimensionsFormatInvalid, done);
  });

  test('negative columns', (done) => {
    testError(fixture.dimensions.negativeColumns, MatrixReaderErrorCode.DimensionsFormatInvalid, done);
  });

  test('non numeric rows', (done) => {
    testError(fixture.dimensions.nonNumericRows, MatrixReaderErrorCode.DimensionsFormatInvalid, done);
  });

  test('non numeric columns', (done) => {
    testError(fixture.dimensions.nonNumericColumns, MatrixReaderErrorCode.DimensionsFormatInvalid, done);
  });

  test('zero rows', (done) => {
    testError(fixture.dimensions.zeroRows, MatrixReaderErrorCode.DimensionsFormatInvalid, done);
  });

  test('zero columns', (done) => {
    testError(fixture.dimensions.zeroColumns, MatrixReaderErrorCode.DimensionsFormatInvalid, done);
  });

  test('no space', (done) => {
    testError(fixture.dimensions.noDimensionsSpace, MatrixReaderErrorCode.DimensionsFormatInvalid, done);
  });

  test('empty', (done) => {
    testError(fixture.dimensions.noDimensions, MatrixReaderErrorCode.DimensionsFormatInvalid, done);
  });
});

describe('rows negative scenarios', () => {
  test('not binary', (done) => {
    testError(fixture.rows.notBinary, MatrixReaderErrorCode.ColumnFormatInvalid, done);
  });

  test('not numeric', (done) => {
    testError(fixture.rows.notNumeric, MatrixReaderErrorCode.ColumnFormatInvalid, done);
  });

  test('columns count mismatch', (done) => {
    testError(fixture.rows.invalidColumnCount, MatrixReaderErrorCode.RowFormatInvalid, done);
  });

  test('empty', (done) => {
    testError(fixture.rows.empty, MatrixReaderErrorCode.RowFormatInvalid, done);
  });
});
