const isNotNull = value => (Array.isArray(value) ? value.some(isNotNull) : value !== null);

export default isNotNull;
