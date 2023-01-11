const {itBench, setBenchOpts} = require("@dapplion/benchmark");
const crypto = require("node:crypto");
const nodeRsCrc32c = require('@node-rs/crc32').crc32c;
const sse42Crc = require('sse4_crc32').sse42_crc;
const tableCrc = require('sse4_crc32').table_crc;
const jsCrc32c = require('../impls/js_crc32c').calculate;
const jsCrc32 = require('buffer-crc32').unsigned;

const tests = [{
  name: '@node-rs/crc32c',
  calculate: nodeRsCrc32c,
},
{
  name: 'sse4_crc32c_hw',
  calculate: sse42Crc,
}, {
  name: 'sse4_crc32c_sw',
  calculate: tableCrc,
}, {
  name: 'js_crc32c',
  calculate: jsCrc32c,
}, {
  name: 'js_crc32',
  calculate: jsCrc32,
}];

describe("crc32 implementations", function () {
  setBenchOpts({
    minMs: 10 * 1000,
  })

  const counts = [500, 1000, 10_000, 100_000, 1_000_000];
  for (const c of counts) {
    const bytes = crypto.randomBytes(c);

    for (const {name, calculate} of tests) {
      itBench({
        id: `${name} ${c} bytes`,
        fn: () => calculate(bytes),
      })
    }
  }
});
