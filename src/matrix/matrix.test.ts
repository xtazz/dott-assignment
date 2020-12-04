import { Binary } from 'core/types';
import Matrix from 'matrix';

let matrix: Matrix<Binary>;

beforeEach(() => {
  matrix = new Matrix<Binary>([
    [0, 1, 0, 1],
    [1, 0, 1, 0],
    [0, 0, 1, 1],
  ]);
});

test('toString', () => {
  expect(matrix.toString()).toStrictEqual(`0 1 0 1\n1 0 1 0\n0 0 1 1`);
});

test('does not accept empty data', () => {
  expect(() => {
    new Matrix<Binary>([]);
  }).toThrow('matrix data is empty');
});

describe('neighbors', () => {
  describe('left', () => {
    test('returns null for top left', () => {
      expect(matrix.left({ row: 0, column: 0 })).toBeNull();
    });

    test('returns null for mid left', () => {
      expect(matrix.left({ row: 1, column: 0 })).toBeNull();
    });

    test('returns left from the middle', () => {
      expect(matrix.left({ row: 0, column: 1 })).toStrictEqual({ row: 0, column: 0 });
    });

    test('returns left from rightmost', () => {
      expect(matrix.left({ row: 1, column: 3 })).toStrictEqual({ row: 1, column: 2 });
    });
  });

  describe('right', () => {
    test('returns null for top right', () => {
      expect(matrix.right({ row: 0, column: 3 })).toBeNull();
    });

    test('returns null for mid right', () => {
      expect(matrix.right({ row: 1, column: 3 })).toBeNull();
    });

    test('returns right from the middle', () => {
      expect(matrix.right({ row: 0, column: 1 })).toStrictEqual({ row: 0, column: 2 });
    });

    test('returns right from leftmost', () => {
      expect(matrix.right({ row: 1, column: 0 })).toStrictEqual({ row: 1, column: 1 });
    });
  });

  describe('top', () => {
    test('returns null for top left', () => {
      expect(matrix.top({ row: 0, column: 0 })).toBeNull();
    });

    test('returns null for top mid', () => {
      expect(matrix.top({ row: 0, column: 2 })).toBeNull();
    });

    test('returns top from the middle', () => {
      expect(matrix.top({ row: 1, column: 1 })).toStrictEqual({ row: 0, column: 1 });
    });

    test('returns top from bottom', () => {
      expect(matrix.top({ row: 2, column: 0 })).toStrictEqual({ row: 1, column: 0 });
    });
  });

  describe('bottom', () => {
    test('returns null for bottom left', () => {
      expect(matrix.bottom({ row: 2, column: 0 })).toBeNull();
    });

    test('returns null for bottom mid', () => {
      expect(matrix.bottom({ row: 2, column: 2 })).toBeNull();
    });

    test('returns bottom from the middle', () => {
      expect(matrix.bottom({ row: 1, column: 1 })).toStrictEqual({ row: 2, column: 1 });
    });

    test('returns bottom from top', () => {
      expect(matrix.bottom({ row: 0, column: 0 })).toStrictEqual({ row: 1, column: 0 });
    });
  });
});
