/**
 * unit tests part, focus on functions
 */
/**
 * test on normalizeProgress
 */
describe('Unit test: normalizeProgress', () => {
  beforeAll(async () => {
    await page.goto('http://127.0.0.1:5501/'); //change this for live server
  });
  it('should return the same integer', async () => {
    expect(
      await page.evaluate(() => {
        return normalizeProgress(4);
      })
    ).toBe(4);
  });
  it('should return the same integer', async () => {
    expect(
      await page.evaluate(() => {
        return normalizeProgress(100);
      })
    ).toBe(100);
  });
  it('should round up', () => {
    async () => {
      expect(
        await page.evaluate(() => {
          return normalizeProgress('96.5');
        })
      ).toBe(97);
    };
  });
  it('should return 0', () => {
    async () => {
      expect(
        await page.evaluate(() => {
          return normalizeProgress('0.0000001');
        })
      ).toBe(0);
    };
  });
  it('should return 0', () => {
    async () => {
      expect(
        await page.evaluate(() => {
          return normalizeProgress(0.4999999999999999);
        })
      ).toBe(0);
    };
  });
  it('should return 0', () => {
    async () => {
      expect(
        await page.evaluate(() => {
          return normalizeProgress('Never gonna give you up');
        })
      ).toBe(0);
    };
  });
  it('should return 0', () => {
    async () => {
      expect(
        await page.evaluate(() => {
          return normalizeProgress('-96.5');
        })
      ).toBe(0);
    };
  });
  it('should return 0', () => {
    async () => {
      expect(
        await page.evaluate(() => {
          return normalizeProgress('-96.5e43');
        })
      ).toBe(0);
    };
  });
  it('should return 100', () => {
    async () => {
      expect(
        await page.evaluate(() => {
          return normalizeProgress('0.23e32');
        })
      ).toBe(100);
    };
  });
  it('should return 100', () => {
    async () => {
      expect(
        await page.evaluate(() => {
          return normalizeProgress('00100.1');
        })
      ).toBe(100);
    };
  });
}, 10000);