// const hooks = require('hooks');

// const Document = function() { }

// Document.prototype.save = function(name) {
//     console.log(`save, name is ${name}`);
//     return 'tony';
// }

// for (let k in hooks) {
//     Document[k] = hooks[k];
// }

// Document.hook('save', Document.prototype.save);

// Document.pre('save', function validate(next, name) {
//     console.log(`first pre-save, name is ${name}`);
//     next('tom')
// }).pre('save', function(next, name) {
//     console.log(`second pre-save, name is ${name}`);
//     next('baby')
// }).post('save', function(next, name) {
//     console.log(`first post-save, name is ${name}`);
//     next('bosh');
// }).post('save', function(next, name) {
//     console.log(`second post-save, name is ${name}`);
//     next();
// });

// const doc = new Document()
// doc.save('alice')


const hooks = require('hooks');

function Document() {

}

Document.prototype.save = function() {
    console.log(`call save`)
}

for (let k in hooks) {
    Document[k] = hooks[k]
}

Document.pre('save', true, function preOne(next, doneOne, callback) {
    console.log(`remote-service-one call ${Date.now()}`)
    remoteServiceOne(function() {
        console.log(`remote-service-one done! ${Date.now()}`);
        doneOne()
    });
    next();
}).pre('save', true, function preTwo(next, doneTwo, callback) {
    console.log(`remote-service-two call ${Date.now()}`);
    remoteServiceTwo(function() {
        console.log(`remote-service-two done! ${Date.now()}`)
        doneTwo()
    })
    next()
});


function remoteServiceOne(callback) {
    setTimeout(function() {
        callback()
    }, 2 * 1000)
}

function remoteServiceTwo(callback) {
    setTimeout(function() {
        callback()
    }, 1 * 1000)
}

var doc = new Document();
doc.save()
