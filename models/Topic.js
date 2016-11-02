var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var Topic = new keystone.List('Topic', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Topic.add({
  name: { label: '專題名稱', type: String, required: true },
  brief: { label: '前言', type: Types.Html, wysiwyg: true, height: 150 },
  heroVideo: { label: 'Leading Video', type: Types.Relationship, ref: 'Video' },
  heroImage: { label: '首圖', type: Types.ImageRelationship, ref: 'Image' },
  heroImageSize: { label: '首圖尺寸', type: Types.Select, options: 'extend, normal, small', default: 'normal', dependsOn: { heroImage: {'$regex': '.+/i'}}},
  og_title: { label: 'FB分享標題', type: String, require: false},
  og_description: { label: 'FB分享說明', type: String, require: false},
  og_image: { label: 'FB分享縮圖', type: Types.ImageRelationship, ref: 'Image' },
  isFeatured: { label: '置頂', type: Boolean, index: true },
  style: { label: 'CSS', type: Types.Textarea },
  javascript: { label: 'javascript', type: Types.Textarea },
});

Topic.relationship({ ref: 'Post', refPath: 'topics' });

transform.toJSON(Topic);
Topic.register();
