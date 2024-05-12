import { addNumbers } from '../testcode/example';

test('adds 1 + .. 10 to equal 55', () => {
    expect(addNumbers(10)).toBe(55);
});
test('adds 1 + .. 10 to equal 55', () => {
    expect(1+2+3+4+5+6+7+8+9+10).toBe(55);
});
