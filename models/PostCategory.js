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
  title: { label: "中文名稱", type: String, required: true, default: "分類" },
  isFeatured: { label: '置頂', type: Boolean, index: true },
  style: { type: Types.Select, options: 'feature, listing, tile', default: 'feature' },
  heroImage: { label: '首圖', type: Types.ImageRelationship, ref: 'Image' },
  og_title: { label: 'FB分享標題', type: String, require: false},
  og_description: { label: 'FB分享說明', type: String, require: false},
  og_image: { label: 'FB分享縮圖', type: Types.ImageRelationship, ref: 'Image' },
  css: { label: 'CSS', type: Types.Textarea },
  javascript: { label: 'javascript', type: Types.Textarea },
  isCampaign: { label: '活動分類', type: Boolean, index: true },
  isAudioSiteItem: { label: '語音網站', type: Boolean, index: true },
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
