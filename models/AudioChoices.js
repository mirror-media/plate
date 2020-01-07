var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var AudioChoices = new keystone.List('AudioChoices', {
    track: true,
	sortable: true,
});

AudioChoices.add({
    choices: { label: '精選語音', type: Types.Relationship, ref: 'Post', many: false },
});

AudioChoices.relationship({ ref: 'Post', refPath: 'choices' });
AudioChoices.defaultColumns = 'choices';

transform.toJSON(AudioChoices);
AudioChoices.register();
