export enum MatrixReaderErrorCode {
  CountFormatInvalid,
  CountExceedsLimit,
  DimensionsFormatInvalid,
  DimensionsExceedLimit,
  RowFormatInvalid,
  ColumnFormatInvalid,
  InputClosed,
}

export default class MatrixReaderError extends Error {
  constructor(readonly code: MatrixReaderErrorCode, msg?: string) {
    super(msg);
  }
}
