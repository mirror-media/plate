var config = require('../config');
var extractIPTC = require('../lib/extractIPTC');
var keystone = require('arch-keystone');
var resizeImage = require('../lib/resizeImage');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var Image = new keystone.List('Image', {
    map: { name: 'description' },
    defaultSort: '-createTime',
});
var bucket = config['options']['gcs config']['bucket']

Image.add({
    image: {
        type: Types.GcsImage,
        initial: true,
        autoCleanup: true,
        datePrefix: 'YYYYMMDDHHmmss',
        // TODO move these settings to config
        bucket: bucket,
        destination: 'assets/images/',
        publicRead: true,
        resize: resizeImage,
        resizeOpts: [{
            target: 'desktop',
            width: 2000,
            height: null,
            options: {
              watermark: '/public/images/watermark-120x120.png'
            }
        }, {
            target: 'tablet',
            width: 1200,
            height: null,
            options: {
              watermark: '/public/images/watermark-120x120.png'
            }
        }, {
            target: 'mobile',
            width: 800,
            height: null,
            options: {
              watermark: '/public/images/watermark-120x120.png'
            }
        }, {
            target: 'tiny',
            width: 150,
            height: null,
            options: {}
        }],
        extractIPTC: extractIPTC
    },
    description: {
        type: String,
        index: true
    },
    copyright: {
        type: Types.Select,
        options: 'Creative-Commons, Copyrighted',
        default: 'Copyrighted', index: true
    },
    topics: { label: '專題', type: Types.Relationship, ref: 'Topic' },
    tags: { label: '標籤', type: Types.Relationship, ref: 'Tag', many: true },
    keywords: {
        type: String,
        index: true
    },
    sale: {
        type: Boolean,
        index: true
    },
    createTime: {type: Types.Datetime, default: Date.now, utc: true },
});

Image.relationship({
    ref: 'Post',
    refPath: 'heroImage'
});

transform.toJSON(Image);
Image.defaultColumns = 'description, image';
Image.register();
