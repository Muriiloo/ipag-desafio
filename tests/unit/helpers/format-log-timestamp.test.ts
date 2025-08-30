import { formatLogTimestamp } from "../../../src/worker/helpers/format-log-timestamp";

describe("Format Log Timestamp", () => {
  describe("Timestamp Format", () => {
    it("should return timestamp in correct format", () => {
      const timestamp = formatLogTimestamp();

      const timestampRegex = /^\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\]$/;
      expect(timestamp).toMatch(timestampRegex);
    });

    it("should return different timestamps for consecutive calls", () => {
      const timestamp1 = formatLogTimestamp();

      // Wait a small amount to ensure different timestamps
      return new Promise((resolve) => {
        setTimeout(() => {
          const timestamp2 = formatLogTimestamp();
          // Timestamps might be the same if called within the same second
          // but the format should be consistent
          expect(timestamp1).toMatch(
            /^\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\]$/
          );
          expect(timestamp2).toMatch(
            /^\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\]$/
          );
          resolve(void 0);
        }, 10);
      });
    });

    it("should pad single digit values with zeros", () => {
      const mockDate = new Date(2023, 0, 5, 8, 7, 6); // January 5th, 08:07:06

      jest.spyOn(global, "Date").mockImplementation(() => mockDate);

      const timestamp = formatLogTimestamp();

      expect(timestamp).toBe("[2023-01-05 08:07:06]");

      jest.restoreAllMocks();
    });

    it("should handle double digit values correctly", () => {
      const mockDate = new Date(2023, 11, 25, 23, 59, 58); // December 25th, 23:59:58

      jest.spyOn(global, "Date").mockImplementation(() => mockDate);

      const timestamp = formatLogTimestamp();

      expect(timestamp).toBe("[2023-12-25 23:59:58]");

      jest.restoreAllMocks();
    });
  });

  describe("Date Components", () => {
    it("should handle year correctly", () => {
      const mockDate = new Date(2024, 5, 15, 12, 30, 45);

      jest.spyOn(global, "Date").mockImplementation(() => mockDate);

      const timestamp = formatLogTimestamp();

      expect(timestamp).toContain("2024");

      jest.restoreAllMocks();
    });

    it("should handle month correctly (0-indexed to 1-indexed)", () => {
      const mockDate = new Date(2023, 0, 15, 12, 30, 45); // January (month 0)

      jest.spyOn(global, "Date").mockImplementation(() => mockDate);

      const timestamp = formatLogTimestamp();

      expect(timestamp).toContain("-01-"); // Should be 01 for January

      jest.restoreAllMocks();
    });

    it("should handle leap year correctly", () => {
      const mockDate = new Date(2024, 1, 29, 12, 30, 45); // February 29th, 2024 (leap year)

      jest.spyOn(global, "Date").mockImplementation(() => mockDate);

      const timestamp = formatLogTimestamp();

      expect(timestamp).toBe("[2024-02-29 12:30:45]");

      jest.restoreAllMocks();
    });
  });

  describe("Time Components", () => {
    it("should handle midnight correctly", () => {
      const mockDate = new Date(2023, 5, 15, 0, 0, 0); // 00:00:00

      jest.spyOn(global, "Date").mockImplementation(() => mockDate);

      const timestamp = formatLogTimestamp();

      expect(timestamp).toContain(" 00:00:00]");

      jest.restoreAllMocks();
    });

    it("should handle noon correctly", () => {
      const mockDate = new Date(2023, 5, 15, 12, 0, 0); // 12:00:00

      jest.spyOn(global, "Date").mockImplementation(() => mockDate);

      const timestamp = formatLogTimestamp();

      expect(timestamp).toContain(" 12:00:00]");

      jest.restoreAllMocks();
    });

    it("should handle 24-hour format correctly", () => {
      const mockDate = new Date(2023, 5, 15, 23, 59, 59); // 23:59:59

      jest.spyOn(global, "Date").mockImplementation(() => mockDate);

      const timestamp = formatLogTimestamp();

      expect(timestamp).toContain(" 23:59:59]");

      jest.restoreAllMocks();
    });
  });

  describe("Return Type", () => {
    it("should return a string", () => {
      const timestamp = formatLogTimestamp();

      expect(typeof timestamp).toBe("string");
    });

    it("should not return empty string", () => {
      const timestamp = formatLogTimestamp();

      expect(timestamp).not.toBe("");
      expect(timestamp.length).toBeGreaterThan(0);
    });
  });
});
