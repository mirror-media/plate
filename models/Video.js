var config = require('../config');
var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var Video = new keystone.List('Video', {
    map: { name: 'title' },
    defaultSort: '-createTime',
});
var bucket = config['options']['gcs config']['bucket']

Video.add({
    title: { type: String, required: true, initial: true },
    description: { type: Types.Html, wysiwyg: true, height: 150 },
    video: {
        type: Types.GcsFile,
        initial: true,
        autoCleanup: true,
        datePrefix: 'YYYYMMDDHHmmss',
        bucket: bucket,
        destination: 'assets/videos/',
        publicRead: true,
    },
    tags: {
        type: Types.Relationship,
        ref: 'Tag',
        many: true
    },
    createTime: { type: Types.Datetime, default: Date.now, utc: true },
});


transform.toJSON(Video);
Video.defaultColumns = 'title, video, tags';
Video.register();
