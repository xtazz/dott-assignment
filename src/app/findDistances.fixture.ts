import { Binary } from 'core/types';

export interface TestCase {
  name: string;
  value: Binary[][];
  expect: string;
}

export const testCases: TestCase[] = [
  {
    name: 'sample',
    value: [
      [0, 0, 0, 1],
      [0, 0, 1, 1],
      [0, 1, 1, 0],
    ],
    expect: '3 2 1 0\n2 1 0 0\n1 0 0 1',
  },
  {
    name: 'single',
    value: [[0]],
    expect: '0',
  },
  {
    name: 'small',
    value: [
      [0, 1],
      [1, 0],
    ],
    expect: '1 0\n0 1',
  },
  {
    name: 'only 1',
    value: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    expect: '0 0 0\n0 0 0\n0 0 0',
  },
  {
    name: 'alternating lines',
    value: [
      [1, 1, 1],
      [0, 0, 0],
      [1, 1, 1],
    ],
    expect: '0 0 0\n1 1 1\n0 0 0',
  },
  {
    name: 'two bottom 1 lines',
    value: [
      [0, 0, 0],
      [1, 1, 1],
      [1, 1, 1],
    ],
    expect: '1 1 1\n0 0 0\n0 0 0',
  },
  {
    name: 'two 0 lines, two 1 lines',
    value: [
      [0, 0, 0],
      [0, 0, 0],
      [1, 1, 1],
      [1, 1, 1],
    ],
    expect: '2 2 2\n1 1 1\n0 0 0\n0 0 0',
  },
  {
    name: 'one 1',
    value: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 1],
    ],
    expect: '4 3 2\n3 2 1\n2 1 0',
  },
  {
    name: 'one line',
    value: [[0, 0, 0, 0, 0, 0, 0, 1]],
    expect: '7 6 5 4 3 2 1 0',
  },
];
