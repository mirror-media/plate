var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var Partner = new keystone.List('Partner', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Partner.add({
	name: { label: '名稱', type: String, required: true, index: true },
	display: { label: '中文名稱', type: String, required: true, index: true, default: '單位' },
	website: { tybel: '網址', type: Types.Url, index: true },
	public: { label: '公開', type: Boolean, index: true },
});

transform.toJSON(Partner);
Partner.defaultColumns = 'name, website';
Partner.register();
