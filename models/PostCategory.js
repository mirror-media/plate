var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var PostCategory = new keystone.List('PostCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
	sortable: true,
});

PostCategory.add({
	name: { label: "名稱", type: String, required: true },
    type: { label: "類型", type: Types.Select, options: 'articles, link', default: 'articles' },
    link: { label: "連結", type: String, dependsOn: { type: "link" } },

});

PostCategory.relationship({ ref: 'Post', refPath: 'categories' });

transform.toJSON(PostCategory);
PostCategory.register();
