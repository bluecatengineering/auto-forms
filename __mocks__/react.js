module.exports = {
    ...jest.requireActual('react'),
    useCallback: jest.fn((fn) => fn),
    useContext: jest.fn(),
    useReducer: jest.fn((reducer, initial) => [initial, jest.fn()]),
};
