export const count = {
  negative: '-1\n',
  notNumeric: 'abc\n',
  zero: '0\n',
};

export const dimensions = {
  negativeColumns: '1\n1 -2\n',
  negativeRows: '1\n-1 2\n',
  nonNumericColumns: '1\n2 abc\n',
  nonNumericRows: '1\nabc 2\n',
  zeroRows: '1\n0 2\n',
  zeroColumns: '1\n1 0\n',
  noDimensionsSpace: '1\n11\n',
  noDimensions: '1\n\n',
};

export const rows = {
  notBinary: '1\n2 2\n10\n95\n',
  invalidColumnCount: '1\n2 2\n10\n110\n',
  notNumeric: '1\n2 2\n10\na0\n',
  empty: '1\n2 2\n10\n\n',
};
