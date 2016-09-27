var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var Choice = new keystone.List('Choice', {
	autokey: { from: 'pickDate', path: 'key', unique: true },
    defaultSort: '-pickDate',
});

Choice.add({
	pickDate: { label: '日期', type: Types.Datetime, default: Date.now, required: true },
    choices: { label: '精選文章', type: Types.Relationship, ref: 'Post', many: true },
});

Choice.defaultColumns = 'key, pickDate';
Choice.relationship({ ref: 'Post', refPath: 'choices' });

transform.toJSON(Choice);
Choice.register();
