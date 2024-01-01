export default function keyFormatter(prefix = '', ...values) {
  return `${prefix}-${values.join('-')}`;
}
