const hooks = require('hooks');

const Document = function() { }

Document.prototype.save = function() {
    console.log('save')
}

for (let k in hooks) {
    Document[k] = hooks[k];
}


// Document.hook('save', Document.prototype.save);

Document.pre('save', function validate(next) {
    console.log('pre-save');
    next()
});

Document.post('save', function(next) {
    console.log('post-save')
    next()
});

const doc = new Document()
doc.save()
