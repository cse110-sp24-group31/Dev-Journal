import { addNumbers } from '../testcode/example';

test('adds 1 + .. 10 to equal 55', () => {
    expect(addNumbers(10)).toBe(55);
});
