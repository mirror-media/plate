var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var EditorChoices = new keystone.List('EditorChoices', {
    track: true,
	sortable: true,
});

EditorChoices.add({
    choices: { label: '精選文章', type: Types.Relationship, ref: 'Post', many: false },
    state: { label: '狀態', type: Types.Select, options: 'draft, published, scheduled, archived, invisible', default: 'draft', index: true },
});

EditorChoices.relationship({ ref: 'Post', refPath: 'choices' });
EditorChoices.defaultColumns = 'choices, state';

transform.toJSON(EditorChoices);
EditorChoices.register();
