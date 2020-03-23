var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var EditorChoices = new keystone.List('EditorChoices', {
    track: true,
	sortable: true,
});

EditorChoices.add({
    choices: { label: '精選文章', type: Types.Relationship, ref: 'Post', many: false },
    startDate: { type: Types.Datetime, initial: true, required: true },
});

EditorChoices.relationship({ ref: 'Post', refPath: 'choices' });
EditorChoices.defaultColumns = 'choices';

transform.toJSON(EditorChoices);
EditorChoices.register();
