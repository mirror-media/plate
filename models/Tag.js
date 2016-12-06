var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var Tag = new keystone.List('Tag', {
	autokey: { from: 'name', path: 'key', unique: true },
    reack: true,
});

Tag.add({
  name: { label: '標籤名稱', type: String, required: true, unique: true },
  brief: { label: '前言', type: Types.Html, wysiwyg: true, height: 150 },
  style: { type: Types.Select, options: 'feature, listing, tile', default: 'feature' },
  leading: { label: '標頭樣式', type: Types.Select, options: 'video, slideshow, image', index: true },
  heroVideo: { label: 'Leading Video', type: Types.Relationship, ref: 'Video', dependsOn: { leading: 'video' } },
  heroImage: { label: '首圖', type: Types.ImageRelationship, ref: 'Image', dependsOn: { leading: 'image' } },
  heroImageSize: { label: '首圖尺寸', type: Types.Select, options: 'extend, normal, small', default: 'normal', dependsOn: { heroImage: {'$regex': '.+/i'}}},
  og_title: { label: 'FB分享標題', type: String, require: false},
  og_description: { label: 'FB分享說明', type: String, require: false},
  og_image: { label: 'FB分享縮圖', type: Types.ImageRelationship, ref: 'Image' },
  isFeatured: { label: '置頂', type: Boolean, index: true },
  css: { label: 'CSS', type: Types.Textarea },
  javascript: { label: 'javascript', type: Types.Textarea },
});

Tag.relationship({ ref: 'Post', refPath: 'tags' });

transform.toJSON(Tag);
Tag.register();
