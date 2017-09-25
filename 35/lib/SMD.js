/**
 * Created by dl_hi on 2017/9/25.
 */
//     // 定义模块管理器单体对象
// var F = F || {};
// /***
//  * 定义模块方法(理论上，模块方法应放在闭包中实现，可以隐藏内部信息)
//  * @param str 模块路由
//  * @param fn 模块方法
//  */
// F.define = function(str, fn){
//     var parts = str.split('.'),
//         // old 当前模块的祖父模块， parent当前模块父模块
//         // 如果在闭包中， 为了屏蔽对模块直接访问，建议将模块添加给闭包内部私有变量
//         old = parent = this,
//         // i 模块层级， len模块层级长度
//         i = len = 0;
//     // 如果第一个模式是模块管理器单体对象，则移除
//     if(parts[0] === 'F'){
//         parts = parts.slice(1);
//     }
//     // 屏蔽define与module模块方法的重写
//     if(parts[0] === 'define' || parts[0] === 'undefined'){
//         return;
//     }
//     // 遍历路由模块并定义每层模块
//     for(len=parts.length;i<len;i++){
//         // 如果父模块中部存在当前模块
//         if(typeof parent[parts[i]] === 'undefined'){
//             // 声明当前模块
//             parent[parts[i]] = {};
//             // 缓存下一层的祖父模块
//             old = parent;
//             // 缓存下一层及父模块
//             parent = parent[parts[i]];
//         }
//     }
//     // 如果给定模块方法则定义该模块方法
//     if(fn){
//         // 此时i等于parts.length, 故减一
//         old[parts[--i]] = fn();
//     }
//     // 返回模块管理器单体对象
//     return this;
// };
//
// // 模块调用方法
// F.module = function () {
//     // 将参数转化为数组
//     var args= [].slice.call(arguments),
//         // 获取回调函数
//         fn = args.pop(),
//         // 获取依赖模块，如果args[0]是数组，则依赖模块为args[0]。否则依赖模块为arg
//         parts = args[0] && args[0] instanceof Array ? args[0] : args,
//         // 依赖模块列表
//         modules = [],
//         // 模块路由
//         modIDs = '',
//         // 依赖模块索引
//         i= 0,
//         // 依赖模块长度
//         ilen = parts.length,
//         // 父模块，模块路由层及索引， 模块路由层级长度
//         parent, j, jlen;
//         // 遍历依赖模块
//         while(i<ilen){
//             // 如果是模块路由
//             if(typeof parts[i] === 'string'){
//                 // 设置当前模块父对象（F）
//                 parent = this;
//                 // 解析模块路由， 并屏蔽掉模块父对象
//                 modIDs = parts[i].replace(/^F\./, '').split('.');
//                 // 遍历模块路由层级
//                 for(j=0, jlen = modIDs.length; j<jlen;j++){
//                     // 重置父模块
//                     parent = parent[modIDs[j]] || false;
//                 }
//                 // 将模块添加到依赖模块列表中
//                 modules.push(parent);
//             // 如果是模块对象
//             }else{
//                 // 直接加入依赖模块列表中
//                 modules.push(parts[i]);
//             }
//             // 取下一个依赖模块
//             i++;
//         }
//         // 执行回调执行函数
//         fn.apply(null, modules);
// };

~(function(F) {
    /***
     * 定义模块方法(理论上，模块方法应放在闭包中实现，可以隐藏内部信息)
     * @param str 模块路由
     * @param fn 模块方法
     */
    F.define = function(str, fn){
        var parts = str.split('.'),
            // old 当前模块的祖父模块， parent当前模块父模块
            // 如果在闭包中， 为了屏蔽对模块直接访问，建议将模块添加给闭包内部私有变量
            old = parent = this,
            // i 模块层级， len模块层级长度
            i = len = 0;
        // 如果第一个模式是模块管理器单体对象，则移除
        if(parts[0] === 'F'){
            parts = parts.slice(1);
        }
        // 屏蔽define与module模块方法的重写
        if(parts[0] === 'define' || parts[0] === 'undefined'){
            return;
        }
        // 遍历路由模块并定义每层模块
        for(len=parts.length;i<len;i++){
            // 如果父模块中部存在当前模块
            if(typeof parent[parts[i]] === 'undefined'){
                // 声明当前模块
                parent[parts[i]] = {};
                // 缓存下一层的祖父模块
                old = parent;
                // 缓存下一层及父模块
                parent = parent[parts[i]];
            }
        }
        // 如果给定模块方法则定义该模块方法
        if(fn){
            // 此时i等于parts.length, 故减一
            old[parts[--i]] = fn();
        }
        // 返回模块管理器单体对象
        return this;
    };

// 模块调用方法
    F.module = function () {
        // 将参数转化为数组
        var args= [].slice.call(arguments),
            // 获取回调函数
            fn = args.pop(),
            // 获取依赖模块，如果args[0]是数组，则依赖模块为args[0]。否则依赖模块为arg
            parts = args[0] && args[0] instanceof Array ? args[0] : args,
            // 依赖模块列表
            modules = [],
            // 模块路由
            modIDs = '',
            // 依赖模块索引
            i= 0,
            // 依赖模块长度
            ilen = parts.length,
            // 父模块，模块路由层及索引， 模块路由层级长度
            parent, j, jlen;
        // 遍历依赖模块
        while(i<ilen){
            // 如果是模块路由
            if(typeof parts[i] === 'string'){
                // 设置当前模块父对象（F）
                parent = this;
                // 解析模块路由， 并屏蔽掉模块父对象
                modIDs = parts[i].replace(/^F\./, '').split('.');
                // 遍历模块路由层级
                for(j=0, jlen = modIDs.length; j<jlen;j++){
                    // 重置父模块
                    parent = parent[modIDs[j]] || false;
                }
                // 将模块添加到依赖模块列表中
                modules.push(parent);
                // 如果是模块对象
            }else{
                // 直接加入依赖模块列表中
                modules.push(parts[i]);
            }
            // 取下一个依赖模块
            i++;
        }
        // 执行回调执行函数
        fn.apply(null, modules);
    };
})((function () {
    return window.F = {};
}()))