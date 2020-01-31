var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var Watch = new keystone.List('Watch', {
    track: true,
	sortable: true,
});

var price = 'NTD30000以下, NTD30000~NTD70000, NTD70000~NTD150000, NTD150000~NTD300000, NTD300000~NTD500000, NTD500000~NTD1500000, NTD3000000以上';
Watch.add({
  brand: { label: '品牌', type: Types.Relationship, ref: 'WatchBrand' },
  name: { label: '品名', type: String },
  type: { label: '型號', type: String },
  series: { label: '系列', type: String },
  watchImage: { label: '圖片', type: Types.ImageRelationship, ref: 'Image' },
  price: { label: '價格', type: String },
  ga: { label: '發表年份', type: Number},
  limit: { label: '限量支數', type: Number, index: true},
  sex: { label: '性別', type: Types.Select, options: '男錶款, 女錶款, 中性錶款', default: '中性錶款'},
  luminous: { label: '夜光', type: Types.Select, options: '有, 無', default: '有'},
  movement: { label: '機芯', type: Types.Select, options: '自動上鏈, 手動上鏈, 石英, 光動能, 人動電能, GPS, 電波, 智能錶' },
  power: { label: '動力', type: String },
  watchfunction: { label: '功能', type: Types.Relationship, ref: 'WatchFunction', many: true },
  material: { label: '材質', type: Types.Select, options: '不鏽鋼, 半金, 銅, 黃金, 玫瑰金, 白金, 鉑金, 鉑金, 鈦金屬, 特殊合金, 複合材質' },
  waterproof: { label: '防水', type: Types.Select, options: '無, 30米, 50米, 100米, 200米, 300米, 600米, 1000米, 2000米, 2000米, 4000米' },
  popular: { label: '熱門錶款', type: Boolean, index: true },
  treasury: { label: '庫藏區', type: Boolean, index: true },
  content: { label: '內文', type: Types.Html, wysiwyg: true, height: 400 },
  relateds: { label: '相關文章', type: Types.Relationship, ref: 'Post', many: true },
  stores: { label: '錶店', type: Types.Relationship, ref: 'WatchStore', many: true },
  createTime: { type: Types.Datetime, default: Date.now, utc: true },
});

transform.toJSON(Watch);
Watch.defaultColumns = 'name, brand|20%, series|20%, type|20%, movement|20%';

Watch.register();
