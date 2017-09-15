var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var WatchFunction = new keystone.List('WatchFunction', {
	autokey: { from: 'name', path: 'key', unique: true },
});

WatchFunction.add({
	name: { type: String, required: true, index: true },
});

transform.toJSON(WatchFunction);
WatchFunction.defaultColumns = 'name, website, github, twitter';
WatchFunction.register();
