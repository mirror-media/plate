var config = require('../config');
var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var Magazine = new keystone.List('Magazine', {
    map: { name: 'title' },
    defaultSort: '-createTime',
});
var bucket = config['options']['gcs config']['bucket']

Magazine.add({
    title: { type: String, required: true, initial: true },
    description: { type: Types.Html, wysiwyg: true, height: 150 },
    magazine: {
        type: Types.GcsFile,
        initial: true,
        autoCleanup: true,
        datePrefix: 'YYYYMMDDHHmmss',
        bucket: bucket,
        destination: 'assets/magazine/',
        publicRead: true,
    },
    coverPhoto: { type: Types.ImageRelationship, ref: 'Image' },
    tags: {
        type: Types.Relationship,
        ref: 'Tag',
        many: true
    },
    createTime: { type: Types.Datetime, default: Date.now, utc: true },
});


transform.toJSON(Magazine);
Magazine.defaultColumns = 'title, magazine, tags';
Magazine.register();
