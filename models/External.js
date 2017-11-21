var keystone = require('arch-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var External = new keystone.List('External', {
	autokey: { path: 'slug', from: 'name', unique: true, fixed: true },
    track: true,
    defaultSort: '-publishedDate',
});

External.add({
  name: { label: '網址名稱（英文）', type: String, required: true, unique: true },
  partner: { type: Types.Relationship, ref: 'Partner', initial: true, index: true },
  title: { label: '標題', type: String, require: true, default: 'untitled' },
  subtitle: { label: '副標', type: String, require: false },
  state: { label: '狀態', type: Types.Select, options: 'draft, published, scheduled, archived, invisible', default: 'draft', index: true },
  publishedDate: { label: '發佈日期', type: Types.Datetime, index: true, utc: true, default: Date.now, dependsOn: { '$or': { state: [ 'published', 'scheduled' ] } }},
  extend_byline: { label: '作者', type: String, require: false },
  thumb: { label: '小圖網址', type: String, require: false },
  brief: { label: '前言', type: Types.Textarea, height: 150 },
  content: { label: '內文', type: Types.Textarea, height: 400 },
  createTime: { type: Types.Datetime, default: Date.now, utc: true },
});

External.schema.virtual('content.full').get(() => {
	return this.content.extended || this.content.brief;
});

transform.toJSON(External);
External.defaultColumns = 'title, name, state|20%, author|20%, publishedDate|20%';
External.schema.pre('remove', function(next) {
    External.model.findOneAndUpdate({ '_id': this._id}, { 'state': 'archived'}, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            next();
        }
    })
});
External.schema.pre('save', function(next) {
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
// External.editorController = true;
// External.editorControllerTtl = 600000;
// External.notifyBeforeLeave = true;
// External.preview = 'https://www.mirrormedia.mg/story';
// External.previewId = 'slug'
External.register();
