// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";

// Enable fetch mocks
fetchMock.enableMocks();

// Mock next/navigation functions
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useParams: () => ({}),
  usePathname: () => "",
}));

// Extend expect with jest-dom matchers
expect.extend({
  toBeDisabled(received) {
    const pass = received.disabled === true;
    return {
      pass,
      message: () => `expected ${received} to${pass ? " not" : ""} be disabled`,
    };
  },
  toBeInTheDocument(received) {
    const pass = received !== null;
    return {
      pass,
      message: () =>
        `expected ${received} to${pass ? " not" : ""} be in the document`,
    };
  },
});
