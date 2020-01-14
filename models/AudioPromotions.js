var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var AudioPromotions = new keystone.List('AudioPromotions', {
    track: true,
	sortable: true,
});

AudioPromotions.add({
  heroImage: { label: '首圖', type: Types.ImageRelationship, ref: 'Image', },
  href: { label: '目標網頁', type: Types.Url, index: false },
});

AudioPromotions.defaultColumns = 'heroImage, href';

transform.toJSON(AudioPromotions);
AudioPromotions.register();
