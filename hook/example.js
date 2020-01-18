const hooks = require('hooks');

const Document = function() { }

Document.prototype.save = function(name) {
    console.log(`save, name is ${name}`);
    return 'tony';
}

for (let k in hooks) {
    Document[k] = hooks[k];
}

Document.hook('save', Document.prototype.save);

Document.pre('save', function validate(next, name) {
    console.log(`first pre-save, name is ${name}`);
    next('tom')
}).pre('save', function(next, name) {
    console.log(`second pre-save, name is ${name}`);
    next('baby')
}).post('save', function(next, name) {
    console.log(`first post-save, name is ${name}`);
    next('bosh');
}).post('save', function(next, name) {
    console.log(`second post-save, name is ${name}`);
    next();
});

const doc = new Document()
doc.save('alice')