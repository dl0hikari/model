/**
 * Created by dl_hi on 2017/8/31.
 */
F.module('lib/template', function () {
    /***
     * 模板引擎 处理数据与编译模板入口     *
     * @param str 模板容器id或者模板字符串
     * @param data 渲染数据
     */
    var _TplEngine = function(str, data){
            //如果是数组
            if(data instanceof Array){
                var html;
                for(var i=0, len=data.length; i<len; i++){
                    // 缓存模板渲染结果，也可写成 html += arguments.callee(str, data[i])
                    html += _getTpl(str)(data[i]);
                }
                return html;
            }else{
                return _getTpl(str)(data);
            }
        },
        /***
         * 获取模板 如果str是一个id,并且可获得该id对应的元素，那么我们获取元素的内容或值（针对于表单元素）
         *          否则将str看作模板字符串直接处理
         * @param str 模板容器id, 或者模板字符串
         */
        _getTpl = function (str){
            //获取元素
            var ele = document.getElementById(str);
            if(ele){
                var html = /^(textarea|input)$/i.test(ele.nodeName) ? ele.value : ele.innerHTML;
                return _compileTpl(html);
            }else{
                //编译模板
                return _compileTpl(str);
            }

        },
        /***
         *  处理模板  首先要明确哪些内容是要被替换的，确定替换内容的左右分割符。接下来要对模板字符串进行处理
         *           将模板字符串分割并传入编译环境中的template_array数组中
         *           例如： 模板： <a>{%=test%}</a>
         *           处理后的形式为 template_array.push('<a>', typeof(test)==='undefined' ? '' : test, '</a>');
         * @param str
         */
        _dealTpl = function (str){
            var _left = '{%', // 左分隔符
                _right = '%}'; // 右分隔符
            // return String(str) // 容错处理
            // // 转义标签内的< 如： <div>{%if(a&lt;b)%}</div> -> <div>{%if(a<b)%}</div>
            //     .replace(/&lt;/g, '<')
            // // 转义标签内的>
            //     .replace(/&gt;/g, '>')
            // // 过滤掉回车符，制表符，回车符
            //     .replace(/[\r\t\n]/g, '')
            // // 替换内容
            //     .replace(new RegExp(_left+'=(.*?)'+_right, 'g'), "',typeof($1) === 'undefined'?'':$1,'")
            // // 替换左分隔符
            //     .replace(new RegExp(_left, 'g'), "');")
            // // 替换右分隔符
            //     .replace(new RegExp(_right, 'g'), "template_array.push('");
            var str =String(str).replace(/&lt;/g, '<')
                // 转义标签内的>
            str = str.replace(/&gt;/g, '>')
                // 过滤掉回车符，制表符，回车符
            str = str.replace(/[\r\t\n]/g, '')
                // 替换内容
            str = str.replace(new RegExp(_left+'=(.*?)'+_right, 'g'), "',typeof($1) === 'undefined'?'':$1,'")
                // 替换左分隔符
            str = str.replace(new RegExp(_left, 'g'), "');")
                // 替换右分隔符
            str = str.replace(new RegExp(_right, 'g'), "template_array.push('");
            return str;
        },
        /**
         * 编译执行
         * @param str 模板数据
         **/
        // _compileTpl = function (str){
        //     var fnBody = "// 声明template_array模板容器组 \
        //     var template_array = [];\n \
        //     var fn = (function(data){\n \
        //         // 渲染数据变量的执行函数体 \
        //         var template_array = '';\n \
        //         // 遍历渲染数据 \
        //         for(key in data){ \
        //             template_key+=('var '+key+'=data[\"'+key+'\"];');\n \
        //         }\n \
        //         // 执行渲染数据变量函数 \
        //         eval(template_key);\n \
        //         // 为模板容器添加成员（注意， 此时渲染数据将替换容器中的变量）\
        //         template_array.push('"+_dealTpl(str)+"');\n \
        //         // 释放渲染数据变量函数 \
        //         template_key = null;\n \
        //     })(templateData);\n \
        //     fn = null;\n \
        //     return template_array.join('');";
        //     return new Function("templateData", fnBody);
        // };
    _compileTpl = function (str){
        var fnBody = "var template_array = [];\n \
            var fn = (function(data){\n \
                var template_key = '';\n \
                for(key in data){ \
                    template_key+=('var '+key+'=data[\"'+key+'\"];');\n \
                }\n \
                eval(template_key);\n \
                template_array.push('"+_dealTpl(str)+"');\n \
                template_key = null;\n \
            })(templateData);\n \
            fn = null;\n \
            return template_array.join('');";
        return new Function("templateData", fnBody);
    };
        return _TplEngine;
});