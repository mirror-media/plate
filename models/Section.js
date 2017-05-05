var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var Section = new keystone.List('Section', {
	autokey: { from: 'name', path: 'key', unique: true },
    track: true,
	sortable: true,
});

Section.add({
  name: { label: '名稱', type: String, required: true },
  title: { label: '中文名稱', type: String, required: true, default: '頻道' },
  image: { label: 'Logo', type: Types.ImageRelationship, ref: 'Image' },
  description: { label: '簡介', type: String },
  categories: { label: '分類', type: Types.Relationship, ref: 'PostCategory', many: true },
  extend_cats: { label: '其他分類', type: Types.Relationship, ref: 'PostCategory', many: true },
  heroImage: { label: '首圖', type: Types.ImageRelationship, ref: 'Image' },
  isFeatured: { label: '置頂', type: Boolean, index: true },
  style: { type: Types.Select, options: 'feature, listing, tile, full, video', default: 'feature' },
  og_title: { label: 'FB分享標題', type: String, require: false },
  og_description: { label: 'FB分享說明', type: String, require: false },
  og_image: { label: 'FB分享縮圖', type: Types.ImageRelationship, ref: 'Image' },
  timeline: { label: 'Twitter 帳號', type: String },
  topics: { label: '專題', type: Types.Relationship, ref: 'Topic', many: true },
  css: { label: 'CSS', type: Types.Textarea },
  javascript: { label: 'javascript', type: Types.Textarea },
});

Section.defaultColumns = 'title, name, style';

Section.schema.pre('save', function(next) {
    if ( this._req_user.role != 'admin') {
        var err = new Error("You don't have the permission")
        next(err);
    } else {
        next()
    }
});

transform.toJSON(Section);
Section.register();
