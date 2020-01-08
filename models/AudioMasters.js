var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var AudioMasters = new keystone.List('AudioMasters', {
    track: true,
	sortable: true,
});

AudioMasters.add({
    masters: { label: '名家', type: Types.Relationship, ref: 'Contact', many: false },
});

AudioMasters.relationship({ ref: 'Contact', refPath: 'masters' });
AudioMasters.defaultColumns = 'masters';

transform.toJSON(AudioMasters);
AudioMasters.register();
