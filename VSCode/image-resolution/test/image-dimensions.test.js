const assert = require('node:assert/strict');
const test = require('node:test');

const { readImageDimensions } = require('../src/image-dimensions');

test('reads PNG dimensions', () => {
  const png = Buffer.alloc(24);
  png.writeUInt32BE(0x89504e47, 0);
  png.writeUInt32BE(0x0d0a1a0a, 4);
  png.writeUInt32BE(640, 16);
  png.writeUInt32BE(480, 20);

  assert.deepEqual(readImageDimensions(png, 'photo.png'), { width: 640, height: 480 });
});

test('reads JPEG dimensions from a SOF marker', () => {
  const jpeg = Buffer.from([
    0xff, 0xd8, 0xff, 0xc0, 0x00, 0x11, 0x08,
    0x02, 0x58, 0x03, 0x20, 0x01, 0x01, 0x11, 0x00,
    0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
  ]);

  assert.deepEqual(readImageDimensions(jpeg, 'photo.jpg'), { width: 800, height: 600 });
});

test('reads SVG dimensions from viewBox', () => {
  const svg = Buffer.from('<svg viewBox="0 0 24 16"></svg>');

  assert.deepEqual(readImageDimensions(svg, 'icon.svg'), { width: 24, height: 16 });
});

test('returns undefined for unsupported or invalid images', () => {
  assert.equal(readImageDimensions(Buffer.from('not an image'), 'file.txt'), undefined);
});
