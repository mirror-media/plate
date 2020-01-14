var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var VoiceConfigs = new keystone.List('VoiceConfigs', {
    track: true,
});

VoiceConfigs.add({
  key: { label: '設定', type: Types.Select, options: 'appversion, masters_amount, masters_list_number', default: 'appversion' },
  group: { label: '群組', type: Types.Select, options: 'A, B, C', default: 'A' },
  value: { label: '設定值', type: String }
});

VoiceConfigs.defaultColumns = 'key, group, value';

transform.toJSON(VoiceConfigs);
VoiceConfigs.register();
