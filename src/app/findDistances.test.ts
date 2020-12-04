import Matrix from 'matrix';
import findDistances from 'app/findDistances';

import * as fixture from './findDistances.fixture';

function testSuccess(fixture: fixture.TestCase) {
  test(fixture.name, () => {
    const matrix = new Matrix(fixture.value);
    const result = findDistances(matrix);
    expect(result.toString()).toStrictEqual(fixture.expect);
  });
}

fixture.testCases.forEach(testSuccess);
