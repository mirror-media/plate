var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var Activity = new keystone.List('Activity', {
	autokey: { from: 'name', path: 'key', unique: true },
    track: true,
});

Activity.add({
  name: { label: "名稱", type: String, required: true, unique: true },
  state: { label: '狀態', type: Types.Select, options: 'draft, published, scheduled, archived', default: 'draft', index: true },
  heroImage: { label: '首圖', type: Types.ImageRelationship, ref: 'Image' },
  heroCaption: { label: '首圖圖說', type: String, require: false },
  brief: { label: '前言', type: Types.Html, wysiwyg: true, height: 150 },
  og_title: { label: 'FB分享標題', type: String, require: false},
  og_description: { label: 'FB分享說明', type: String, require: false},
  og_image: { label: 'FB分享縮圖', type: Types.ImageRelationship, ref: 'Image' },
});

Activity.relationship({ ref: 'Node', refPath: 'activity' });
Activity.defaultColumns = "title, name";

Activity.schema.pre('save', function(next) {
    if ( this._req_user.role != 'admin') {
        var err = new Error("You don't have the permission")
        next(err);
    } else {
        next()
    }
});

transform.toJSON(Activity);
Activity.register();
