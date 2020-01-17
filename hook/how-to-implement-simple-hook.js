// 针对类进行hook
// 实现pre-hooks
// 支持链式调用，多hook
// 仅支持callback形式的hook
// 语法案例可参看example.js

// 原理：
// 1. 将原方法存储在另外一个地方
// 2. 将hooks存在在一个地方(pre-hooks和post-hooks)
// 3. 重新定义原方法。重新定义中，要先调用pre-hooks,再调用原方法，最后调用post-hooks

function Document() {};

Document.prototype.save = function() {
    console.log(`call save`);
}

Document.pre = function(methodName, hook) {
    const prototype = Document.prototype;
    // 1. 校验method是否存在于原型链上
    const method = prototype[methodName];
    if (!method) {
        throw new Error(`${methodName} method not exist!`);
    }

    if (typeof method !== 'function') {
        throw new TypeError(`${methodName} prop is not a function!`);
    }
    
    // 创造一个空间，存储hooks
    this.__lazySetupHooks(methodName); 
    
    // 
    prototype.hooks[methodName].push(hook);
    return this;
}

Document.__lazySetupHooks = function(proto, methodName) {
    // 1. 原方法存储在proto.__pres中
}

Document.pre('save', function(next) {
    console.log(`I am first hook`);
    next()
}).pre('save', function(next) {
    console.log(`I am second hook`);
    next()
});

const doc = new Document();
doc.save();