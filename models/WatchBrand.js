var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var WatchBrand = new keystone.List('WatchBrand', {
	autokey: { from: 'name', path: 'key', unique: true },
});

WatchBrand.add({
	name: { type: String, required: true, index: true },
});

transform.toJSON(WatchBrand);
WatchBrand.defaultColumns = 'name, website, github, twitter';
WatchBrand.register();
