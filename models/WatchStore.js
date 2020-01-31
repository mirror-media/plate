var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var WatchStore = new keystone.List('WatchStore', {
	autokey: { from: 'name', path: 'key', unique: true, index: true },
});
var WatchStore = new keystone.List('WatchStore', {
    track: true,
	sortable: true,
});


WatchStore.add({
	name: { label: '店名', type: String, required: true, index: true, default: '請輸入店名' },
	address: { label: '地址', type: String },
	phone: { label: '電話', type: String },
	map: { label: 'google map url', type: Types.Url },
});

transform.toJSON(WatchStore);
WatchStore.defaultColumns = 'name, address, phone, map';
WatchStore.register();
