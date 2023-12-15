export default function keyFormatter(prefix = '', ...values) {
  const partials = [];

  // eslint-disable-next-line
  for (const value of values) {
    partials.push(value);
  }
  return `${prefix}-${partials.join('-')}`;
}
