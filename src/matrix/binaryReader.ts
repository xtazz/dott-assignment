import Readline from 'readline';
import { EventEmitter } from 'events';

enum MatrixReaderStage {
  Count,
  Dimensions,
  Row,
  Done,
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
}

export enum MatrixReaderErrorCode {
  CountFormatInvalid,
  DimensionsFormatInvalid,
  RowFormatInvalid,
}

export class MatrixReaderError extends Error {
  constructor(readonly code: MatrixReaderErrorCode, msg?: string) {
    super(msg);
  }
}

export default class BinaryMatrixReader extends EventEmitter {
  private rl: Readline.Interface;
  private state: MatrixReaderState;

  constructor(input: NodeJS.ReadableStream, output?: NodeJS.WritableStream) {
    super();
    this.rl = Readline.createInterface(input, output);
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
        this.emit('error', err);
      }
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
    }
  }

  private readCount(count: string) {
    const matrixCount = parseInt(count, 10);

    if (isNaN(matrixCount)) {
      throw new MatrixReaderError(MatrixReaderErrorCode.CountFormatInvalid, `Not a number: ${count}`);
    }

    this.state.count = matrixCount;
    this.state.index = 0;
    this.state.stage = MatrixReaderStage.Dimensions;
  }

  private readDimensions(dimensions: string) {
    const components = dimensions.split(' ').map((d) => parseInt(d, 10));

    if (components.length != 2) {
      throw new MatrixReaderError(MatrixReaderErrorCode.DimensionsFormatInvalid, 'Should have two dimensions');
    }

    if (isNaN(components[0]) || isNaN(components[1])) {
      throw new MatrixReaderError(
        MatrixReaderErrorCode.DimensionsFormatInvalid,
        `One of the components is not a number: ${dimensions}`,
      );
    }

    this.state.dimensions = {
      rows: components[0],
      columns: components[1],
    };

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
  }
}
