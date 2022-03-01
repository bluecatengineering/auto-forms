export default (rx, message) => (value) => value && rx.test(value) ? message : null;
