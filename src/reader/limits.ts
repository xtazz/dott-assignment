/**
 * Defines matrix reader limits.
 * count - limits number of matrices in the input
 * dimensions - limits each matrix dimensions
 */
export default interface MatrixReaderLimits {
  count?: number;
  dimensions?: {
    rows: number;
    columns: number;
  };
}
