var sizeOf = require('image-size');
var _ = require('lodash')
var gm = require('gm');

module.exports = function resize(image, width, height, options) {
  var appDir, path, stream;
  var isWatermark = _.get(options, [ 'isWatermarked' ], false);
  var watermark = _.get(options, [ 'watermark' ]);
  var watermarkBase = _.get(options, [ 'watermarkBase' ], 2000);

  path = require('path');
  appDir = path.dirname(require.main.filename);

  var origSize = {}
  var origSize = sizeOf(image);

  var streamBase = !watermark || !isWatermark
    ? gm(image).stream()
    : gm(image)
      .resize(
        origSize.width > origSize.height ? watermarkBase : null,
        origSize.width > origSize.height ? null : watermarkBase
      )
      .composite(appDir + watermark)
      .gravity('SouthEast')
      .geometry('+50+50')
      .stream();
  var streamSalted = !watermark || !isWatermark
    ? gm(streamBase).stream()
    : gm(streamBase)
        .resize(origSize.width, origSize.height , '!')
        .stream()

  var options = (width == height) ? '!' : '>'

  return gm(streamSalted)
    .resize(width, height, options)
    .stream()
}
