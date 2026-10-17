import { fail } from './common.js';
export function createPipeline({ maxSteps = 10, maxCodeUnits = 262144 } = {}) {
  let records = [];
  return {
    add(record) {
      if (records.length >= maxSteps) fail('stepLimit');
      const size =
        records.reduce((sum, step) => sum + step.input.length + step.text.length, 0) +
        record.input.length +
        record.text.length;
      if (size > maxCodeUnits) fail('budget');
      records.push(Object.freeze({ ...record }));
    },
    list() {
      return records.slice();
    },
    clear() {
      records = [];
    },
    truncate(index) {
      records = records.slice(0, index);
    },
  };
}
