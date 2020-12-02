import Readline from 'readline';
import { EventEmitter } from 'events';

import Matrix from './matrix';
import { Binary } from './types';

enum MatrixReaderStage {
  Count,
  Dimensions,
  Row,
  EmptyLine,
  Done,
  Error,
}

interface MatrixReaderState {
  stage: MatrixReaderStage;
  count?: number;
  dimensions?: {
    rows: number;
    columns: number;
  };
  index?: number;
  rows?: Binary[][];
  matrices?: Matrix<Binary>[];
}

export enum MatrixReaderEvent {
  Matrix = 'matrix',
  Error = 'error',
  Done = 'done',
}

export enum MatrixReaderErrorCode {
  CountFormatInvalid,
  CountExceedsLimit,
  DimensionsFormatInvalid,
  DimensionsExceedLimit,
  RowFormatInvalid,
  ColumnFormatInvalid,
  InputClosed,
}

export class MatrixReaderError extends Error {
  constructor(readonly code: MatrixReaderErrorCode, msg?: string) {
    super(msg);
  }
}

export interface MatrixReaderLimits {
  count?: number;
  dimensions?: {
    rows: number;
    columns: number;
  };
}

export default class BinaryMatrixReader extends EventEmitter {
  private rl: Readline.Interface;
  private state: MatrixReaderState;

  constructor(input: NodeJS.ReadableStream, private readonly limits?: MatrixReaderLimits) {
    super();
    this.rl = Readline.createInterface(input);
    this.state = {
      stage: MatrixReaderStage.Count,
    };
  }

  start() {
    this.state = {
      stage: MatrixReaderStage.Count,
    };

    this.rl.on('line', (line) => {
      try {
        this.handleLine(line);
      } catch (err) {
        this.emit(MatrixReaderEvent.Error, err);
        this.state.stage = MatrixReaderStage.Error;
        this.rl.close();
      }
    });

    this.rl.on('close', () => {
      if (this.state.stage === MatrixReaderStage.Done || this.state.stage === MatrixReaderStage.Error) {
        return;
      }

      const err = new MatrixReaderError(MatrixReaderErrorCode.InputClosed, 'Input closed unexpectedly');
      this.emit(MatrixReaderEvent.Error, err);
      this.state.stage = MatrixReaderStage.Error;
    });
  }

  private handleLine(line: string) {
    switch (this.state.stage) {
      case MatrixReaderStage.Count:
        this.readCount(line);
        break;
      case MatrixReaderStage.Dimensions:
        this.readDimensions(line);
        break;
      case MatrixReaderStage.Row:
        this.readRow(line);
        break;
      case MatrixReaderStage.EmptyLine:
        this.state.stage = MatrixReaderStage.Dimensions;
        break;
    }
  }

  private readCount(count: string) {
    const matrixCount = parseInt(count, 10);

    if (isNaN(matrixCount)) {
      throw new MatrixReaderError(MatrixReaderErrorCode.CountFormatInvalid, `Count should be a number, got: ${count}`);
    }

    if (this.limits?.count && matrixCount > this.limits.count) {
      throw new MatrixReaderError(
        MatrixReaderErrorCode.CountExceedsLimit,
        `Count ${matrixCount} exceeds limit of ${this.limits.count}`,
      );
    }

    this.state.count = matrixCount;
    this.state.index = 0;
    this.state.stage = MatrixReaderStage.Dimensions;
  }

  private readDimensions(dimensions: string) {
    const components = dimensions.split(' ').map((d) => parseInt(d, 10));

    if (components.length != 2) {
      throw new MatrixReaderError(
        MatrixReaderErrorCode.DimensionsFormatInvalid,
        `Should have two numeric dimensions separated by space, got: ${dimensions}`,
      );
    }

    const rows = components[0];
    const columns = components[1];

    if (isNaN(rows) || isNaN(columns)) {
      throw new MatrixReaderError(
        MatrixReaderErrorCode.DimensionsFormatInvalid,
        `One of the dimensions is not a number: ${dimensions}`,
      );
    }

    const limits = this.limits?.dimensions;

    if (limits && (rows > limits.rows || columns > limits.columns)) {
      throw new MatrixReaderError(
        MatrixReaderErrorCode.CountExceedsLimit,
        `Matrix dimensions (${rows}, ${columns}) exceed limit of (${limits.rows}, ${limits.columns})`,
      );
    }

    this.state.dimensions = { rows, columns };
    this.state.stage = MatrixReaderStage.Row;
  }

  private readRow(row: string) {
    const columns = this.state.dimensions!.columns;

    if (row.length < columns) {
      throw new MatrixReaderError(
        MatrixReaderErrorCode.RowFormatInvalid,
        `Should have exactly ${columns} columns, got ${row.length}`,
      );
    }

    const binaryRow: Binary[] = Array.from(row).map((c, index) => {
      const val = parseInt(c, 10);

      if (isNaN(val) || val < 0 || val > 1) {
        throw new MatrixReaderError(
          MatrixReaderErrorCode.ColumnFormatInvalid,
          `Column ${index} of row ${this.state.index} should be 0 or 1, got ${c}`,
        );
      }

      return val as Binary;
    });

    if (!this.state.rows) {
      this.state.rows = [binaryRow];
    } else {
      this.state.rows.push(binaryRow);
    }

    // Check if still has rows to read
    if (this.state.dimensions!.rows > this.state.rows!.length) {
      return;
    }

    const matrix = new Matrix<Binary>(this.state.rows!);

    if (!this.state.matrices) {
      this.state.matrices = [matrix];
    } else {
      this.state.matrices!.push(matrix);
    }

    this.emit(MatrixReaderEvent.Matrix, matrix);

    this.state.index! += 1;
    this.state.rows = undefined;

    if (this.state.index! < this.state.count!) {
      this.state.stage = MatrixReaderStage.EmptyLine;
    } else {
      this.state.stage = MatrixReaderStage.Done;
      this.emit(MatrixReaderEvent.Done, this.state.matrices);
      this.rl.close();
    }
  }
}
