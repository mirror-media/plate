var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var Node = new keystone.List('Node', {
    track: true,
    defaultSort: '-nodeDate',
});

Node.add({
  name: { label: '標題', type: String, require: true, default: '活動標題', unique: true },
  nodeDate: { label: '事件時間', type: String, default: '2016/1/1' },
  subtitle: { label: '副標', type: String, require: false },
  state: { label: '狀態', type: Types.Select, options: 'draft, published, scheduled, archived', default: 'draft', index: true },
  activity: { label: '活動', type: Types.Relationship, ref: 'Activity', many: true },
  heroVideo: { label: 'Leading Video', type: Types.Relationship, ref: 'Video' },
  audio: { label: 'Audio', type: Types.Relationship, ref: 'Audio' },
  heroImage: { label: '首圖', type: Types.ImageRelationship, ref: 'Image' },
  heroCaption: { label: '首圖圖說', type: String, require: false },
  heroImageSize: { label: '首圖尺寸', type: Types.Select, options: 'extend, normal, small', default: 'normal', dependsOn: { heroImage: {'$regex': '.+/i'}}},
  brief: { label: '前言', type: Types.Html, wysiwyg: true, height: 150 },
  content: { label: '內文', type: Types.Html, wysiwyg: true, height: 400 },
  og_title: { label: 'FB分享標題', type: String, require: false},
  og_description: { label: 'FB分享說明', type: String, require: false},
  og_image: { label: 'FB分享縮圖', type: Types.ImageRelationship, ref: 'Image' },
  isFeatured: { label: '置頂', type: Boolean, index: true },
  createTime: { type: Types.Datetime, default: Date.now, utc: true },
});

transform.toJSON(Node);
Node.defaultColumns = 'name, state|20%, nodeDate|20%, isFeatured|20%';
Node.schema.pre('remove', function(next) {
    Node.model.findOneAndUpdate({ '_id': this._id}, { 'state': 'archived'}, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            next();
        }
    })
});
Node.schema.pre('save', function(next) {
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
Node.register();
