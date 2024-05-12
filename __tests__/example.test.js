const addNumbers = require('./testcode/example.js'); 

describe('addNumbers', () => {
    test('adds numbers from 1 to n', () => {
        let sum = 0;
        for (let n = 1; n <= 10; n++) {
            sum += n;
            expect(addNumbers(n)).toBe(sum);
        }
    });
});
