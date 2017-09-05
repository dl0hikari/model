/**
 * Created by dl_hi on 2017/8/28.
 */
~(function(F){
    var moduleCache = {},
    getUrl = function (moduleName) {
        return String(moduleName).replace(/\.js$/g, '') + '.js';
    },
    loadScript = function (src) {
        var _script = document.createElement('script');
        _script.type = "text/javascript";
        _script.src = src;
        _script.async = true;
        document.getElementsByTagName('head')[0].appendChild(_script);
    },
    loadModule = function (moduleName, callback) {
        var _module;
        if(moduleCache[moduleName]){
            _module = moduleCache[moduleName];
            if(_module[status] === "loaded"){
                setTimeout(callback(_module.export), 0);
            }else{
                _module.onload.push(callback);
            }
        }else{
            moduleCache[moduleName] = {
                moduleName : moduleName,
                status: "loading",
                export: null,
                onload:[callback]
            };
            loadScript(getUrl(moduleName));
        }
    },
    setModule = function(url, params, callback) {
        var _module, fn;
        if(moduleCache[url]){
            _module = moduleCache[url];
            _module.status = "loaded";
            _module.export = callback ? callback.apply(_module, params) : null;
            while(fn = _module.onload.shift()){
                fn(_module.export);
            }
        }else{
            callback && callback.apply(null, params);
        }
    };
    F.module = function (url, modDeps, modCallback) {
        var args = [].slice.call(arguments),
            callback = args.pop(),
            deps = (args.length && args[args.length-1] instanceof Array) ? args.pop() : [],
            url = args.length ? args.pop() : null,
            depsCount = 0,
            params = [],
            i=0,
            len;
        if(len=deps.length){
            while(i<len){
                depsCount++;
                (function(i){
                    loadModule(deps[i], function(mod) {
                        params[i] = mod;
                        depsCount--;
                        if(depsCount === 0){
                            setModule(url, params, callback);
                        }
                    });
                })(i);
                i++;
            }
        }else{
            setModule(url, [], callback);
        }
    }
})((function(){
    return window.F = {};
})());