var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var Section = new keystone.List('Section', {
	autokey: { from: 'name', path: 'key', unique: true },
	sortable: true,
});

Section.add({
	name: { type: String, required: true },
	image: { type: Types.ImageRelationship, ref: 'Image' },
    style: { type: Types.Select, options: 'feature, listing, tile', default: 'feature' }
});

Section.relationship({ ref: 'Post', refPath: 'section' });

transform.toJSON(Section);
Section.register();
