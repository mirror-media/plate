var config = require('../config');
var extractIPTC = require('../lib/extractIPTC');
var keystone = require('arch-keystone');
var resizeImage = require('../lib/resizeImage');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var ImageCollection = new keystone.List('ImageCollection', {
    map: { name: 'collectionName' }
});
var bucket = config['options']['gcs config']['bucket']

ImageCollection.add({
    collectionName: {
      type: String, required: true, initial: true
    },
    images: {
        type: Types.GcsImages,
        autoCleanup: true,
        datePrefix: 'YYYYMMDDHHmmss',
        bucket: bucket,
        destination: 'assets/images/',
        publicRead: true,
        resize: resizeImage,
        resizeOpts: [{
            target: 'desktop',
            width: 2000,
            height: null,
            options: {
              watermark: '/public/images/2020-mirror-logo.png',
              watermarkBase: 2000
            }
        }, {
            target: 'tablet',
            width: 1200,
            height: null,
            options: {
              watermark: '/public/images/2020-mirror-logo.png',
              watermarkBase: 2000
            }
        }, {
            target: 'mobile',
            width: 800,
            height: null,
            options: {
              watermark: '/public/images/2020-mirror-logo.png',
              watermarkBase: 2000
            }
        }, {
            target: 'tiny',
            width: 150,
            height: null,
            options: {
              watermark: '/public/images/2020-mirror-logo.png',
              watermarkBase: 2000
            }
        }],
        extractIPTC: extractIPTC
    }
});

transform.toJSON(ImageCollection);
ImageCollection.defaultColumns = 'collectionName, images';
ImageCollection.register();
