/**
 * Created by dl_hi on 2017/9/14.
 */
// ~屏蔽压缩报错
~(function () {
    // 在闭包中获取全局变量
    var window = this || (0, eval)('this');
    // 获取页面字体大小， 作为创建页面UI尺寸参照物
    var FONTSIZE = function () {
        // 获取页面body 元素字体大小并转化成整数
        return parseInt(document.body.currentStyle ? document.body.currentStyle['fontSize']
            : getComputedStyle(document.body, false)['fontSize']);
    }();
    // 视图模型
    var VM = function(){
        // 组件创建策略对象
        var Method = {

            /***
             * @name  进度条组件创建方法
             * @param dom   进度条容器
             * @param data  进度条数据模型
             */
            progressbar : function(dom, data) {
                // 进度条进度完成容器
                var progress = document.createElement('div'),
                    // 数据模型数据，结构：{position: 50}
                    param = data.data;
                // 设置进度完成容器尺寸
                progress.style.width = (param.position || 100) + '%';
                // 为进度条组件添加UI样式
                dom.className += ' ui-progressbar';
                // 进度完成容器元素插入进度条容器中
                dom.appendChild(progress);
            },
            /***
             * @name 滑动条组件创建方法
             * @param dom 滑动条容器
             * @param data 滑动条数据模型
             */
            slider: function (dom, data) {
                // 滑动条拨片
                var bar = document.createElement('span'),
                    // 滑动条进度条容器
                    progress = document.createElement('div'),
                    // 滑动条容量提示信息
                    totleText = null,
                    // 滑动条拨片提示信息
                    progressText = null,
                    // 数据模型数据， 结构： {position: 60, totle: 200}
                    param = data.data,
                    // 容器元素宽度
                    width = dom.clientWidth,
                    // 容器元素横坐标
                    left = dom.offsetLeft,
                    // 拨片位置（以模型数据中position数据计算）
                    realWidth = (param.position || 100) * width / 100;
                // 清空滑动条容器， 为穿件滑动条做准备
                dom.innerHTML = '';
                // 如果模型数据中提供容器总量信息（param.totle), 则创建滚动条提示文案
                if(param.totle){
                    // 容器总量提示文案
                    text = document.createElement('b');
                    // 拨片位置提示文案
                    progressText = document.createElement('em');
                    // 设置容器总量提示文案
                    text.innerHTML = param.totle;
                    // 将容器总量提示文案元素添加到滑动条组件中
                    dom.appendChild(text);
                    // 将拨片位置提示文案元素添加到滑动条组件中
                    dom.appendChild(progressText);
                }
                // 设置滑动条
                setStyle(realWidth);
                // 为滑动条组件添加UI样式
                dom.className += ' ui-slider';
                // 将进度容器添加到滑动条组件中
                dom.appendChild(progress);
                // 将拨片添加到滑动条组件中
                dom.appendChild(bar);
                // 设置滑动条
                function setStyle(w){
                    // 设置进度容器宽度
                    progress.style.width = w + 'px';
                    // 设置拨片横坐标
                    bar.style.left = w - FONTSIZE/2 + 'px';
                    // 如果有拨片提示文案
                    if(progressText){
                        // 设置拨片提示文案横坐标
                        progressText.style.left = w - FONTSIZE/2*2.4 + 'px';
                        // 设置拨片提示文案内容
                        progressText.innerHTML = parseFloat(w/width*100).toFixed(2)+'%';
                    }
                }
                // 创建组件逻辑
                // 按下鼠标拨片
                bar.onmousedown = function () {
                    // 移动拨片（鼠标光标在页面中滑动，时间绑定给document是为了优化交互体验，使鼠标光标可以在页面中自由滑动）
                    document.onmousemove = function (event) {
                        // 获取事件源
                        var e = event || window.event;
                        // 鼠标光标相对于滑动条容器位置原点移动的横坐标
                        var w = e.clientX - left;
                        // 设置滑动条
                        setStyle(w < width ? ( w>0 ? w : 0) : width);
                    }
                    // 阻止页面滑动选取事件
                    document.onselectstart = function () {
                        return false;
                    }
                };
                // 停止滑动交互（鼠标按钮松开）
                document.onmouseup = function () {
                    // 取消文档鼠标光标移动事件
                    document.onmousemove =  null;
                    // 取消文档滑动选取事件
                    document.onselectstart = null;
                }
            }
        };
        /***
         * @name  获取视图层组件渲染数据的映射信息
         * @param  dom  组件元素
         */
        function getBindData(dom) {
            // 获取组件自定义属性data-bind值
            var data = dom.getAttribute('data-bind');
            // 将自定义属性data-bind值转化为对象
            return !!data && (new Function("return ({"+data+"})"))();
        }
        // 组件实例化方法
        return function () {
            // 获取页面中所有元素
            var doms = document.body.getElementsByTagName('*'),
                // 元素自定义数据句柄
                ctx = null;
            // ui 处理是会向页面中插入元素， 此时doms.length会改变，此时动态获取dom.length
            for(var i = 0;i<doms.length; i++){
                // 获取元素自定义数据
                ctx = getBindData(doms[i]);
                // 如果元素是UI组件， 则根据自定义属性中组件类型，渲染该组件
                ctx.type && Method[ctx.type] && Method[ctx.type](doms[i], ctx);
            }

        }
    }();
    // 将视图模型对象绑定在window上， 供外部获取
    window.VM = VM;
})();