var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var Section = new keystone.List('Section', {
	autokey: { from: 'name', path: 'key', unique: true },
	sortable: true,
});

Section.add({
	name: { label: '名稱', type: String, required: true },
	image: { label: 'Logo', type: Types.ImageRelationship, ref: 'Image' },
    categories: { label: '分類', type: Types.Relationship, ref: 'PostCategory', many: true },
    style: { type: Types.Select, options: 'feature, listing, tile', default: 'feature' }
});

Section.relationship({ ref: 'Post', refPath: 'section' });

transform.toJSON(Section);
Section.register();
