var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var PostCategory = new keystone.List('PostCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
    track: true,
	sortable: true,
});

PostCategory.add({
  name: { label: "名稱", type: String, required: true },
  title: { label: "中文名稱", type: String, required: true, default: "分類" }
  isFeatured: { label: '置頂', type: Boolean, index: true },
});

PostCategory.relationship({ ref: 'Post', refPath: 'categories' });
PostCategory.defaultColumns = "title, name";

PostCategory.schema.pre('save', function(next) {
    if ( this._req_user.role != 'admin') {
        var err = new Error("You don't have the permission")
        next(err);
    } else {
        next()
    }
});

transform.toJSON(PostCategory);
PostCategory.register();
