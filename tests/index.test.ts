import { testBuld } from '../src';

test('index', () => {
  expect(testBuld()).toMatchInlineSnapshot(`"ok its working"`);
});
