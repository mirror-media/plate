var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var Topic = new keystone.List('Topic', {
	autokey: { from: 'name', path: 'key', unique: true },
    track: true,
	sortable: true,
});

Topic.add({
  name: { label: '專題名稱', type: String, required: true },
  subtitle: { label: '副標', type: String, require: false },
  state: { label: '狀態', type: Types.Select, options: 'draft, published', default: 'draft', index: true },
  brief: { label: '前言', type: Types.Html, wysiwyg: true, height: 150 },
  heroImage: { label: '專題主圖', type: Types.ImageRelationship, ref: 'Image' },
  leading: { label: '標頭樣式', type: Types.Select, options: 'video, slideshow, image', index: true },
  sections: { label: '分區', type: Types.Relationship, ref: 'Section', many: true },
  heroVideo: { label: 'Leading Video', type: Types.Relationship, ref: 'Video', dependsOn: { leading: 'video' } },
  heroImage: { label: '首圖', type: Types.ImageRelationship, ref: 'Image', dependsOn: { leading: 'image' } },
  heroImageSize: { label: '首圖尺寸', type: Types.Select, options: 'extend, normal, small', default: 'normal', dependsOn: { heroImage: {'$regex': '.+/i'}}},
  og_title: { label: 'FB分享標題', type: String, require: false},
  og_description: { label: 'FB分享說明', type: String, require: false},
  og_image: { label: 'FB分享縮圖', type: Types.ImageRelationship, ref: 'Image' },
  isFeatured: { label: '置頂', type: Boolean, index: true },
  title_style: { label: '專題樣式', type: Types.Select, options: 'feature', default: 'feature', index: true },
  type: { label: '型態', type: Types.Select, options: 'list, timeline, group, portrait wall', default: 'list', index: true },
  source: { label: '資料來源', type: Types.Select, options: 'posts, activities', dependsOn: { type: 'timeline' } },
  sort: { label: '時間軸排序', type: Types.Select, options: 'asc, desc', dependsOn: { type: 'timeline' } },
  style: { label: 'CSS', type: Types.Textarea },
  tags: { label: '標籤', type: Types.Relationship, ref: 'Tag', many: true },
  javascript: { label: 'javascript', type: Types.Textarea },
  dfp: { label: 'DFP code', type: String, require: false},
  mobile_dfp: { label: 'Mobile DFP code', type: String, require: false},
});

Topic.relationship({ ref: 'Post', refPath: 'topics' });

transform.toJSON(Topic);
Topic.register();
