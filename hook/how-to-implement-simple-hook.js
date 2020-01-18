const Hooks = {
    pre: function(methodName, hook) {
        const prototype = this.prototype;
        const method = prototype[methodName];
        if (!method) {
            throw new Error(`${methodName} method not exist!`);
        }
    
        if (typeof method !== 'function') {
            throw new TypeError(`${methodName} prop is not a function!`);
        }
        
        this._lazySetupHooks(prototype, methodName); 
        
        prototype.hooks.pre[methodName].push(hook);
        return this;
    },
    post: function(methodName, hook) {
        const prototype = this.prototype;

        const method = prototype[methodName];
        if (!method) {
            throw new Error(`${methodName} method not exist!`);
        }
    
        if (typeof method !== 'function') {
            throw new TypeError(`${methodName} prop is not a function!`);
        }
        
        this._lazySetupHooks(prototype, methodName); 
        
        prototype.hooks.post[methodName].push(hook);
        return this;
    },
    _lazySetupHooks: function(proto, methodName) {
        proto.__pres = proto.__pres || {};

        proto.hooks = proto.hooks || {};
        proto.hooks.pre = proto.hooks.pre || {}
        proto.hooks.pre[methodName] = proto.hooks.pre[methodName] || []
        proto.hooks.post = proto.hooks.post || {}
        proto.hooks.post[methodName] = proto.hooks.post[methodName] || []
    
    
        if (!proto.__pres[methodName]) {
            proto.__pres[methodName] = proto[methodName];
    
            proto[methodName] = function(...args) {
                const self = this;
                const preHooks = this.hooks.pre[methodName];
                const postHooks = this.hooks.post[methodName];
    
                const total = preHooks.length + postHooks.length;
    
                function dispatch(i, ...args) {
                    if (i < preHooks.length) {
                        const next = dispatch.bind(null, i+1);
                        const hook = preHooks[i];
                        hook(next, ...args);
                    } else if (i === preHooks.length) {
                        self.__pres[methodName].apply(self, args);
                        dispatch(i+1);
                    } else if (i <= total) {
                        const next = dispatch.bind(null, i+1);
                        const hook = postHooks[i-preHooks.length-1];
                        hook(next);
                    }
                }
                dispatch(0, ...args);
            }
        }
    }
}

function Document() {};

for (let k in Hooks) {
    Document[k] = Hooks[k];
}

Document.prototype.save = function(name) {
    console.log(`call save, name : ${name}`);
}


Document.pre('save', function(next, name) {
    console.log(`I am first pre hook, name : ${name}`);
    next('bob')
}).pre('save', function(next, name) {
    console.log(`I am second pre hook, name : ${name}`);
    next('chris')
}).post('save', function(next) {
    console.log(`I am first post hook`)
    next();
}).post('save', function(next) {
    console.log(`I am second post hook`)
    next();
});

const doc =  new Document();
doc.save('alice');


// hooks 基于代理模式
// 预处理，后处理。通过next来传递参数。通过next传递参数，第一个预处理传递给第二个预处理...传递到原方法

