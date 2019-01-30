const get = require('lodash').get
const config = require('../config')
var keystone = require('arch-keystone');
var transform = require('model-transform');
var moment = require('moment');
var Types = keystone.Field.Types;

var Post = new keystone.List('Post', {
	autokey: { path: 'slug', from: 'name', unique: true, fixed: true },
    track: true,
    defaultSort: '-publishedDate',
});

Post.add({
  name: { label: '網址名稱（英文）', type: String, required: true, unique: true },
  title: { label: '標題', type: String, require: true, default: 'untitled' },
  subtitle: { label: '副標', type: String, require: false },
  state: { label: '狀態', type: Types.Select, options: 'draft, published, scheduled, archived, invisible', default: 'draft', index: true },
  publishedDate: { label: '發佈日期', type: Types.Datetime, index: true, utc: true, default: Date.now, dependsOn: { '$or': { state: [ 'published', 'scheduled' ] } }},
  sections: { label: '分區', type: Types.Relationship, ref: 'Section', many: true },
  categories: { label: '分類', type: Types.Relationship, ref: 'PostCategory', many: true },
  writers: { label: '作者', type: Types.Relationship, ref: 'Contact', many: true },
  photographers: { label: '攝影', type: Types.Relationship, ref: 'Contact', many: true },
  camera_man: { label: '影音', type: Types.Relationship, ref: 'Contact', many: true },
  designers: { label: '設計', type: Types.Relationship, ref: 'Contact', many: true },
  engineers: { label: '工程', type: Types.Relationship, ref: 'Contact', many: true },
  extend_byline: { label: '作者（其他）', type: String, require: false },
  heroVideo: { label: 'Leading Video', type: Types.Relationship, ref: 'Video' },
  heroImage: { label: '首圖', type: Types.ImageRelationship, ref: 'Image' },
  heroCaption: { label: '首圖圖說', type: String, require: false },
  heroImageSize: { label: '首圖尺寸', type: Types.Select, options: 'extend, normal, small', default: 'normal', dependsOn: { heroImage: {'$regex': '.+/i'}}},
  style: { label: '文章樣式', type: Types.Select, options: 'article, wide, projects, photography, script, campaign, readr', default: 'article', index: true },
  brief: { label: '前言', type: Types.Html, wysiwyg: true, height: 150 },
  content: { label: '內文', type: Types.Html, wysiwyg: true, height: 400 },
  topics: { label: '專題', type: Types.Relationship, ref: 'Topic' },
  topics_ref: { type: Types.Relationship, ref: 'Topic', hidden: true },
  tags: { label: '標籤', type: Types.Relationship, ref: 'Tag', many: true },
  albums: { label: '專輯', type: Types.Relationship, ref: 'Album', many: true },
  relateds: { label: '相關文章', type: Types.Relationship, ref: 'Post', many: true },
  og_title: { label: 'FB分享標題', type: String, require: false},
  og_description: { label: 'FB分享說明', type: String, require: false},
  og_image: { label: 'FB分享縮圖', type: Types.ImageRelationship, ref: 'Image' },
  isFeatured: { label: '置頂', type: Boolean, index: true },
  isAdvertised: { label: '廣告文案', type: Boolean, index: true },
  hiddenAdvertised: { label: 'google廣告違規', type: Boolean, default: false },
  isCampaign: { label: '活動', type: Boolean, index: true },
  isAdult: { label: '18禁', type: Boolean, index: true },
  lockJS: { label: '鎖定右鍵', type: Boolean, index: true },
  isAudioSiteItem: { label: '語音網站', type: Boolean, index: true },
  device: { label: '裝置', type: Types.Select, options: 'all, web, app', default: 'all', index: true },
  adTrace: { label: '追蹤代碼', type: Types.Textarea },
  createTime: { type: Types.Datetime, default: Date.now, utc: true },
});

Post.relationship({ ref: 'Post', refPath: 'relateds' });

Post.schema.virtual('content.full').get(() => {
	return this.content.extended || this.content.brief;
});

transform.toJSON(Post);
Post.defaultColumns = 'title, name, state|20%, author|20%, categories|20%, publishedDate|20%';
Post.schema.pre('remove', function(next) {
    Post.model.findOneAndUpdate({ '_id': this._id}, { 'state': 'archived'}, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            next();
        }
    })
});
Post.schema.pre('save', function(next) {
	if ((this.state == 'scheduled' && (moment(this.publishedDate) < moment()))  || (this.state == 'published' && (moment(this.publishedDate) > moment().add(10, 'm')))) {
		var err = new Error("You can not schedule a data before now.");
		next(err);
	}
	this.updatedBy = this._req_user.name
    if ((this.state == 'published' || this.state == 'scheduled') && ( this._req_user.role == 'author' || this._req_user.role == 'contributor')) {
        var err = new Error("You don't have the permission")
        next(err);
    }
    // Topics part
    if (this.topics) {
        this.topics_ref = this.topics
    }
    next();
});

/**
 * For TTS use
 */
const ttsGenerator = require('../lib/ttsGenerator')
Post.schema.post('save', doc => {
  console.log('Post saved!')
  
  /**
   * Make it process after 1 seconds in async way.
   */
  setTimeout(() => {
    /**
     * Go gen tts file.
     */
    const gcsConfig = get(config, [ 'options', 'gcs config' ], {})
    const isAd = get(doc, 'isAdvertised', false)
    const postId = get(doc, '_id', Date.now().toString())
    const state = get(doc, 'state', 'draft')

    if ((state === 'scheduled' || state === 'published') && !isAd) {
      const content = get(doc, 'content.html', '')
      const subscriptionKey = '80b4476d093340c689331bc930b99fee';

      ttsGenerator.uploadFileToBucket(gcsConfig, postId, subscriptionKey, content)
      .then(() => {
        console.log('Post aud is uploaded. \nPost id:', postId)
        return 
      })
      .catch(err => {
        console.error('Gen aud file in fail.')
        console.error(err)
      })
    } else {
      ttsGenerator.delFileFromBucket(gcsConfig, postId)
      .then(() => {
        console.log('Del post aud successfully.')
      })
      .catch(err => {
        console.error('Del post aud in fail.')
        console.error(err)        
      })
    }
  }, 1000)
  
})
Post.editorController = true;
Post.editorControllerTtl = 600000;
Post.notifyBeforeLeave = true;
Post.preview = 'https://www.mirrormedia.mg/story';
Post.previewId = 'slug'
Post.register();
