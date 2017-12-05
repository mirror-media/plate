var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var Event = new keystone.List('Event', {
	autokey: { from: 'name', path: 'key', unique: true },
	track: true,
	defaultSort: '-startDate',
});

Event.add({
  name: { type: String, initial: true, required: true, index: true },
  state: { label: '狀態', type: Types.Select, options: 'draft, published', default: 'draft', index: true },
  sections: { label: '分區', type: Types.Relationship, ref: 'Section', many: true },
  eventType: { type: Types.Select, options: [ 'embedded', 'video', 'image', 'logo', 'mod' ], index: true },
  startDate: { type: Types.Datetime, initial: true, required: true },
  endDate: { type: Types.Datetime, initial: true },
  video: { label: 'Video', type: Types.Relationship, ref: 'Video', dependsOn: { 'eventType': 'video' } },
  embed: { label: 'Embedded code', type: String, dependsOn: { '$or': [ { 'eventType': 'embedded' }, { 'eventType': 'mod' } ] } },
  image: { label: 'Image', type: Types.ImageRelationship, ref: 'Image', dependsOn: { '$or': [ { 'eventType': 'image' }, { 'eventType': 'logo'} ] } },
  link: { label: '連結', type: String, dependsOn: { 'eventType': 'logo' } },
  isFeatured: { label: '置頂', type: Boolean, index: true },
});

transform.toJSON(Event);
Event.defaultColumns = 'name, eventType|15%, eventState|15%, startDate|15%';
Event.register();
