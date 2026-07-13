const assert = require('node:assert/strict');
const test = require('node:test');

const {
  collectImageFiles,
  isImageFile,
  renderImageIndex,
} = require('../scripts/generate-image-index.cjs');

test('renders imports and a nested camelCase image object', () => {
  const output = renderImageIndex('../assets/images', [
    'home/banner.png',
    'home/logo.svg',
    'dashboard/chart.jpg',
    'dashboard/sidebar/avatar.png',
    'common/default-user.webp',
  ]);

  assert.match(output, /import home_banner from '\.\.\/assets\/images\/home\/banner\.png';/);
  assert.match(output, /import dashboard_sidebar_avatar from '\.\.\/assets\/images\/dashboard\/sidebar\/avatar\.png';/);
  assert.match(output, /defaultUser: common_default_user,/);
  assert.match(output, /sidebar: \{\n      avatar: dashboard_sidebar_avatar,/);
  assert.match(output, /export default images;/);
});

test('recognizes supported image extensions only', () => {
  assert.equal(isImageFile('logo.svg'), true);
  assert.equal(isImageFile('PHOTO.JPEG'), true);
  assert.equal(isImageFile('notes.md'), false);
});

test('rejects a missing image directory', () => {
  assert.throws(
    () => collectImageFiles('/path/that/does/not/exist'),
    /不存在或不是目录/,
  );
});

test('rejects file names that map to the same object key', () => {
  assert.throws(
    () => renderImageIndex('../assets/images', [
      'common/default-user.png',
      'common/default_user.png',
    ]),
    /命名冲突/,
  );
});
