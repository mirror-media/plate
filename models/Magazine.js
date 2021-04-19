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
    title: { label: '標題', type: String, required: true, initial: true },
    issue: { label: '期數', type: String, required: true, initial: true },
    description: { label: '敘述', type: Types.Html, wysiwyg: true, height: 150 },
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
    type: { label: '種類', type: Types.Select, options: 'weekly, special', default: 'weekly', index: true },
    publishedDate: { label: '發佈日期', type: Types.Datetime, index: true, utc: true, default: Date.now, dependsOn: { '$or': { state: [ 'published', 'scheduled' ] } }},
    state: { label: '狀態', type: Types.Select, options: 'published, archived', default: 'draft', index: true },
    createTime: { type: Types.Datetime, default: Date.now, utc: true },
});


transform.toJSON(Magazine);
Magazine.defaultColumns = 'title, magazine, issue';
Magazine.register();
