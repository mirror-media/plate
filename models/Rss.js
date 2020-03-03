var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var Rss = new keystone.List('Rss', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Rss.add({
	name: { label: '名稱', type: String, required: true, index: true },
	source: { label: '資料', type: String, default: '/posts?sort=publishedDate', index: true },
	type: { label: '欄位', type: Types.Select, options: 'Yahoo, Line', default: 'Yahoo', index: true },
	config: { label: '設定', type: String },
});


transform.toJSON(Rss);
Rss.defaultColumns = 'name, source, type';
Rss.register();
