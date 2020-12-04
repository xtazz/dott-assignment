import Readline from 'readline';
import { EventEmitter } from 'events';

import { Binary } from 'core/types';

import Matrix from 'matrix';

import MatrixReaderError, { MatrixReaderErrorCode } from 'reader/error';
import MatrixReaderLimits from 'reader/limits';
import MatrixReaderEvent from 'reader/event';

/**
 * Defines possible matrix reader stages
 */
enum MatrixReaderStage {
  Count,
  Dimensions,
  Row,
  EmptyLine,
  Done,
  Error,
}

/**
 * Defines current state of the matrix reader
 */
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

/**
 * Reads matrices from the stream in a following format:
 * 2 // count
 * 3 3 // space separated dimensions: rows and columns
 * 000 // rows
 * 111
 * 000
 * // new line between matrices
 * 3 4
 * 0011
 * 0100
 * 1000
 *
 * Emits three events types:
 * - MatrixReaderEvent.Matrix - for every new parsed matrix
 * - MatrixReaderEvent.Done - parsing is completed successfully
 * - MatrixReaderEvent.Error - there is an error with either input format or the stream
 */
export default class BinaryMatrixReader extends EventEmitter {
  private readonly rl: Readline.Interface;
  private state: MatrixReaderState;

  /**
   * Creates a binary matrix reader
   * @param {NodeJS.ReadableStream} input Any readable stream
   * @param {MatrixReaderLimits} limits Limits on matrices count and dimensions
   */
  constructor(input: NodeJS.ReadableStream, private readonly limits?: MatrixReaderLimits) {
    super();
    this.rl = Readline.createInterface(input);
    this.state = {
      stage: MatrixReaderStage.Count,
    };
  }

  /**
   * Returns matrices read so far
   * @returns {Matrix<Binary>[]} Array of read matrices
   */
  matrices(): Matrix<Binary>[] {
    return this.state.matrices ?? [];
  }

  /**
   * Starts reading matrices from the input stream
   */
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

  /**
   * Handles one line of input for the current parsing stage
   * @param {string} line Line from input stream
   */
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

  /**
   * Reads matrices count
   * @param {string} count String from input containing matrices count
   */
  private readCount(count: string) {
    const matrixCount = parseInt(count, 10);

    if (isNaN(matrixCount) || matrixCount < 1) {
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

  /**
   * Reads matrix dimensions
   * @param {string} dimensions Matrix dimensions in the following format: 'rows columns'
   */
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

    if (isNaN(rows) || isNaN(columns) || rows < 1 || columns < 1) {
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

  /**
   * Reads matrix row
   * @param {string} row Matrix row with non-space separated columns, e.g. '0011'
   */
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
