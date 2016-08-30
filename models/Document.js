var config = require('../config');
var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var Document = new keystone.List('Document', {
    map: { name: 'title' }
});
var bucket = config['options']['gcs config']['bucket']

Document.add({
    title: { type: String, required: true, initial: true },
    description: { type: Types.Html, wysiwyg: true, height: 150 },
    document: {
        type: Types.GcsFile,
        initial: true,
        autoCleanup: true,
        datePrefix: 'YYYYMMDDHHmmss',
        bucket: bucket,
        destination: 'documents/',
        publicRead: true,
    },
    coverPhoto: { type: Types.ImageRelationship, ref: 'Image' },
});


transform.toJSON(Document);
Document.defaultColumns = 'title, document, tags';
Document.register();
