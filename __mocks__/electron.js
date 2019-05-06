export const remote = {
  app: {
    getPath: jest.fn(_ => 'mockPath'),
    getName: jest.fn(_ => 'mockName'),
  },
  dialog: {
    showOpenDialog: jest.fn(),
  },
};

export const shell = {
  openItem: jest.fn(),
};
