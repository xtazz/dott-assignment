export const count = {
  negative: { value: '-1\n' },
  notNumeric: { value: 'abc\n' },
  zero: { value: '0\n' },
};

export const dimensions = {
  negativeColumns: { value: '1\n1 -2\n' },
  negativeRows: { value: '1\n-1 2\n' },
  nonNumericColumns: { value: '1\n2 abc\n' },
  nonNumericRows: { value: '1\nabc 2\n' },
  zeroRows: { value: '1\n0 2\n' },
  zeroColumns: { value: '1\n1 0\n' },
  noDimensionsSpace: { value: '1\n11\n' },
  noDimensions: { value: '1\n\n' },
};

export const rows = {
  notBinary: { value: '1\n2 2\n10\n95\n' },
  invalidColumnCount: { value: '1\n2 2\n10\n110\n' },
  notNumeric: { value: '1\n2 2\n10\na0\n' },
  empty: { value: '1\n2 2\n10\n\n' },
};

export const limits = {
  countExceeded: { value: '1001\n', limits: { count: 1000 } },
  rowsExceeded: { value: '1\n200 2\n', limits: { dimensions: { rows: 182, columns: 182 } } },
  columnsExceeded: { value: '1\n2 200\n', limits: { dimensions: { rows: 182, columns: 182 } } },
};

export const inputClosed = { value: '1' };

export const single = {
  value: '1\n3 4\n0001\n1100\n1010\n',
  expect: ['0 0 0 1\n1 1 0 0\n1 0 1 0'],
};

export const multiple = {
  value: '2\n3 4\n0001\n1100\n1010\n\n2 2\n10\n01',
  expect: ['0 0 0 1\n1 1 0 0\n1 0 1 0', '1 0\n0 1'],
};
