// 针对类进行hook
// 实现pre-hooks
// 支持链式调用，多hook
// 仅支持callback形式的hook
// 语法案例可参看example.js

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

    prototype.__pres = prototype.__pres || {};
    const __pres = prototype.__pres;

    // 将method存储在__pres中
    

    // 创造一个空间，存储hooks
    this.__lazyHooks(methodName);
    if (prototype.hooks[methodName].length == 0) {
        console.log(1)
        __pres[methodName] = method;
        prototype[methodName] = function(...args) {
    
            const hooks = this.__proto__.hooks[methodName];
            const self = this;
            const length = hooks.length;
    
            dispatch(0);
            
            function dispatch(i) {
                if (i == length) {
                    // 已经将hooks全部执行完毕，接下来执行method即可
                    self.__proto__.__pres[methodName](...args)
                } else {
                    // 调用下一个
                    const hook = hooks[i];
                    const next = dispatch.bind(null, i+1)
                    hook(next)
                }
            }
    
        }
    }    
    
    prototype.hooks[methodName].push(hook);

    return this;
}

Document.__lazyHooks = function(methodName) {
    this.prototype.hooks = this.prototype.hooks || {};
    this.prototype.hooks[methodName] = this.prototype.hooks[methodName] || []; 
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