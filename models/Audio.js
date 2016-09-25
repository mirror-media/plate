var config = require('../config');
var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var Audio = new keystone.List('Audio', {
    map: { name: 'title' },
    defaultSort: '-createTime',
});
var bucket = config['options']['gcs config']['bucket']

Audio.add({
    title: { type: String, required: true, initial: true },
    description: { type: Types.Html, wysiwyg: true, height: 150 },
    audio: {
        type: Types.GcsFile,
        initial: true,
        autoCleanup: true,
        datePrefix: 'YYYYMMDDHHmmss',
        bucket: bucket,
        destination: 'assets/audios/',
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


transform.toJSON(Audio);
Audio.defaultColumns = 'title, audio, tags';
Audio.register();
