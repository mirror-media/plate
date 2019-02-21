var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var Album = new keystone.List('Album', {
  autokey: { from: 'name', path: 'key', unique: true },
  track: true,
  sortable: true,
});

Album.add({
  name: { label: '標籤名稱', type: String, required: true, unique: true },
  title: { label: '標題', type: String, require: true, default: 'untitled' },
  state: { label: '狀態', type: Types.Select, options: 'draft, published, scheduled, archived, invisible', default: 'draft', index: true },
  sections: { label: '分區', type: Types.Relationship, ref: 'Section', many: true },
  categories: { label: '分類', type: Types.Relationship, ref: 'PostCategory', many: true },
  tags: { label: '標籤', type: Types.Relationship, ref: 'Tag', many: true },
  style: { type: Types.Select, options: 'feature, listing, tile, full', default: 'feature' },
  leading: { label: '標頭樣式', type: Types.Select, options: 'video, slideshow, image', index: true },
  writers: { label: '作者', type: Types.Relationship, ref: 'Contact', many: true },
  extend_byline: { label: '作者（其他）', type: String, require: false },
  photographers: { label: '攝影', type: Types.Relationship, ref: 'Contact', many: true },
  brief: { label: '前言', type: Types.Html, wysiwyg: true, height: 150 },
  content: { label: '內文', type: Types.Html, wysiwyg: true, height: 400 },

  heroImage: { label: '首圖', type: Types.ImageRelationship, ref: 'Image', },
  heroImageSize: { label: '首圖尺寸', type: Types.Select, options: 'extend, normal, small', default: 'normal', dependsOn: { heroImage: {'$regex': '.+/i'}}},

  og_title: { label: 'FB分享標題', type: String, require: false},
  og_description: { label: 'FB分享說明', type: String, require: false},
  og_image: { label: 'FB分享縮圖', type: Types.ImageRelationship, ref: 'Image' },
  isFeatured: { label: '置頂', type: Boolean, index: true },
  css: { label: 'CSS', type: Types.Textarea },
  javascript: { label: 'javascript', type: Types.Textarea },
  createTime: { type: Types.Datetime, default: Date.now, utc: true },
});

Album.relationship({ ref: 'Post', refPath: 'albums' });

transform.toJSON(Album);
Album.register();
