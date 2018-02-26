var _ = require('lodash')
var gm = require('gm');

module.exports = function resize(image, width, height, options) {
  var appDir, path, stream;
  var isWatermark = _.get(options, [ 'isWatermarked' ], false);
  var watermark = _.get(options, [ 'watermark' ]);
  path = require('path');
  appDir = path.dirname(require.main.filename);
  stream = !watermark ? gm(image).resize(width, height, '>').quality(30).stream()
                      : !isWatermark
                      ? gm(image).resize(width, height, '>').stream()
                      : gm(image).composite(appDir + watermark)
                                  .gravity('SouthEast')
                                  .geometry('+50+50')
                                  .quality(30)
                                  .resize(width, height, '>').stream();
  return stream;
}
