const sharp = jest.fn().mockImplementation(() => ({
  then: jest.fn(),
  resize: jest.fn(),
  png: jest.fn(),
  toFile: jest.fn(),
}));

export default sharp;
