var config = require('../config');
var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var Video = new keystone.List('Video', {
    map: { name: 'title' },
	track: true,
    defaultSort: '-createTime',
});
var bucket = config['options']['gcs config']['bucket']

Video.add({
    title: { type: String, required: true, initial: true },
    sections: { label: '分區', type: Types.Relationship, ref: 'Section', many: true },
    categories: { label: '分類', type: Types.Relationship, ref: 'PostCategory', many: true },
    heroImage: { label: '首圖', type: Types.ImageRelationship, ref: 'Image' },
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
    state: { label: '狀態', type: Types.Select, options: 'draft, published, scheduled', default: 'draft', index: true },
	feed: { label: '供稿', type: Types.Boolean, default: true, index: true }, 
    publishedDate: { label: '發佈日期', type: Types.Datetime, index: true, utc: true, default: Date.now, dependsOn: { '$or': { state: [ 'published', 'scheduled' ] } }},
    relateds: { label: '相關文章', type: Types.Relationship, ref: 'Post', many: true },
    createTime: { type: Types.Datetime, default: Date.now, utc: true },
});


transform.toJSON(Video);
Video.defaultColumns = 'title, video, tags';
Video.register();
