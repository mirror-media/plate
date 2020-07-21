const get = require('lodash').get
const config = require('../config')
const gcsConfig = get(config, [ 'options', 'gcs config' ], {})
var keystone = require('arch-keystone');
var transform = require('model-transform');
var moment = require('moment');
var Types = keystone.Field.Types;

var CulturePost = new keystone.List('CulturePost', {
	autokey: { path: 'slug', from: 'name', unique: true, fixed: true },
    track: true,
    defaultSort: '-publishedDate',
});

CulturePost.add({
  name: { label: '網址名稱（英文）', type: String, required: true, unique: true },
  title: { label: '標題', type: String, require: true, default: 'untitled' },
  titleColor: { label: '標題顏色', type: String, require: true, default: '000000' },
  subtitle: { label: '副標', type: String, require: false },
  state: { label: '狀態', type: Types.Select, options: 'draft, published, archived, invisible', default: 'draft', index: true },
  publishedDate: { label: '發佈日期', type: Types.Datetime, index: true, utc: true, default: Date.now, dependsOn: { '$or': { state: [ 'published', 'scheduled' ] } }},
  writers: { label: '作者', type: Types.Relationship, ref: 'Contact', many: true },
  photographers: { label: '攝影', type: Types.Relationship, ref: 'Contact', many: true },
  camera_man: { label: '影音', type: Types.Relationship, ref: 'Contact', many: true },
  designers: { label: '設計', type: Types.Relationship, ref: 'Contact', many: true },
  engineers: { label: '工程', type: Types.Relationship, ref: 'Contact', many: true },
  extend_byline: { label: '作者（其他）', type: String, require: false },
  heroVideo: { label: 'Leading Video', type: Types.Relationship, ref: 'Video' },
  heroImage: { label: '首圖', type: Types.ImageRelationship, ref: 'Image' },
  mobileImage: { label: '手機首圖', type: Types.ImageRelationship, ref: 'Image' },
  heroCaption: { label: '首圖圖說', type: String, require: false },
  heroImageSize: { label: '首圖尺寸', type: Types.Select, options: 'extend, normal, small', default: 'normal', dependsOn: { heroImage: {'$regex': '.+/i'}}},
  brief: { label: '前言', type: Types.Html, wysiwyg: true, height: 150 },
  content: { label: '內文', type: Types.Html, wysiwyg: true, height: 400 },
  topics: { label: '專題', type: Types.Relationship, ref: 'Topic' },
  audio: { label: '語音素材', type: Types.Relationship, ref: 'Audio' },
  relateds: { label: '相關文章', type: Types.Relationship, ref: 'Post', many: true },
  og_title: { label: 'FB分享標題', type: String, require: false},
  og_description: { label: 'FB分享說明', type: String, require: false},
  og_image: { label: 'FB分享縮圖', type: Types.ImageRelationship, ref: 'Image' },
  isFeatured: { label: '置頂', type: Boolean, index: true },
  isAdvertised: { label: '廣告文案', type: Boolean, index: true },
  hiddenAdvertised: { label: 'google廣告違規', type: Boolean, default: false },
  isAdult: { label: '18禁', type: Boolean, index: true },
  createTime: { type: Types.Datetime, default: Date.now, utc: true },
});

CulturePost.relationship({ ref: 'CulturePost', refPath: 'relateds' });

CulturePost.schema.virtual('content.full').get(() => {
	return this.content.extended || this.content.brief;
});

transform.toJSON(CulturePost);
CulturePost.defaultColumns = 'title, name, state|20%, author|20%, publishedDate|20%';
CulturePost.schema.pre('remove', function(next) {
    CulturePost.model.findOneAndUpdate({ '_id': this._id}, { 'state': 'archived'}, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            ttsGenerator.delFileFromBucket(gcsConfig, this._id)
            .then(() => {
              console.log('Del post aud successfully.');
              next();
            })
            .catch(err => {
              console.error('Del post aud in fail.');
              console.error(err);
              next();
            })          
        }
    })
});
CulturePost.schema.pre('save', function(next) {
	if ((this.state == 'scheduled' && (moment(this.publishedDate) < moment()))  || (this.state == 'published' && (moment(this.publishedDate) > moment().add(10, 'm')))) {
		var err = new Error("You can not schedule a data before now.");
		next(err);
	}
	this.updatedBy = this._req_user.name
    if ((this.state == 'published' || this.state == 'scheduled') && ( this._req_user.role == 'author' || this._req_user.role == 'contributor')) {
      var err = new Error("You don't have the permission");
      next(err);
    }
	// check the heroImage
	if (this.heroImage == '' && this.heroVideo == '') {
		var err = new Error("You have to assign the heroImage");
		next(err);
	}

    // Topics part
    if (this.topics) {
      this.topics_ref = this.topics;
    }
    next();
});
const ttsGenerator = require('../lib/ttsGenerator');
CulturePost.schema.post('save', doc => {
  const postId = get(doc, '_id', Date.now().toString());
  console.log(`Post ${postId} saved!`);
})
CulturePost.editorController = true;
CulturePost.editorControllerTtl = 600000;
CulturePost.notifyBeforeLeave = true;
CulturePost.preview = 'https://www.mirrormedia.mg/story';
CulturePost.previewId = 'slug'
CulturePost.register();
