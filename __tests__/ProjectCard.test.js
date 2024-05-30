/**
 * unit tests part, focus on functions
 */

describe('Unit test: normalizeProgress', () => {
  beforeAll(async () => {
    await page.goto('https://cse110-sp24-group31.github.io/Dev-Journal/'); //change this for live server
  });
  it('should return the same integer', async () => {
    expect(
      await page.evaluate(() => {
        return normalizeProgress(4);
      })
    ).toBe(4);
  });
  it('should return the same integer', () => {
    expect(normalizeProgress('97')).toBe(97);
  });
  it('should round up', () => {
    expect(normalizeProgress('96.5')).toBe(97);
  });
  it('should return 0', () => {
    expect(normalizeProgress(0.1)).toBe(0);
  });
  it('should return 0', () => {
    expect(normalizeProgress('0.1')).toBe(0);
  });
  it('should return 0', () => {
    expect(normalizeProgress('help')).toBe(0);
  });
  it('should return 0', () => {
    expect(normalizeProgress('-153.2')).toBe(0);
  });
  it('should return 0', () => {
    expect(normalizeProgress('-1534254325325235e32')).toBe(0);
  });
  it('should return 100', () => {
    expect(normalizeProgress('1534254325325235e32')).toBe(100);
  });
  it('should return 100', () => {
    expect(normalizeProgress('100.011')).toBe(100);
  });
});

describe('project card test', () => {
  beforeAll(async () => {
    await page.goto('https://cse110-sp24-group31.github.io/Dev-Journal/'); //change this for live server
  });
  it('test name', () => {});
});
