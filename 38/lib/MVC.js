/**
 * Created by dl_hi on 2017/9/7.
 */
$(function () {
    // 初始化MVC对象
    var MVC = MVC || {};
    // 初始化MVC数据模型层
    MVC.model = function () {
        // 内部数据对象
        var M = {};
        // 服务器端获取的数据， 通常通过Ajax获取并存储，后面的案例为简化实现，直接作为同步数据
        // 写在页面中， 减少服务器端异步请求操作
        M.data = {
            // 左侧侧边栏导航服务器端请求得到的相应数据
            slideBar: [
                {
                    text: '阳阳',
                    icon: 'left_meng.png',
                    title: '阳光小男孩',
                    content: '我的宝贝',
                    img: 'left_meng_img.png',
                    href: 'http://moe.hao123.com'
                },
                {
                    text: '阳阳2',
                    icon: 'left_manga.png',
                    title: '阳光小男孩',
                    content: '我的宝贝',
                    img: 'left_meng_img.png',
                    href: 'http://moe.hao123.com'
                },
            ]
        };
        // 配置数据，页面加载时即提供
        M.conf = {
            // 侧边导航动画配置数据
            slideBarCloseAnimate: false
        };
        // 返回数据模型层对象操作方法
        return {
            // 获取服务器数据
            getData: function (m) {
                // 根据数据字段获取数据
                return M.data[m];
            },
            // 获取配置数据
            getConf: function (c) {
                return M.conf[c];
            },
            setData: function (m, v) {
                M.data[m] = v;
                return this;
            },
            setConf: function (c, v) {
                M.conf[c] = v;
                return this;
            }
        };
    }();
    // 初始化MVC视图层
    MVC.view = function () {
        // 模型数据层对象操作方法引用
        var M = MVC.model;
        // 内容视图穿件方法对象
        var V = {
            // 创建侧边导航模块视图
            createSlideBar: function () {
                // 导航图标内容
                var html = '',
                // 视图渲染数据
                    data = M.getData('slideBar');
                // 屏蔽无效数据
                if(!data || !data.length){
                    return;
                }
                // 创建视图容器
                var dom = $.create('div', {
                    'class': 'slidebar',
                    'id' : 'slidebar'
                });
                // 视图容器模板
                var tpl = {
                  container: [
                      '<div class="slidebar-inner"><ul>{#content#}</ul></div>',
                      '<a hidefocus href="javascript:;" class="slidebar-close" title="收起"></a>'
                  ].join(''),
                    // 导航图标模块模板
                    item: [
                        '<li>',
                            '<a class="icon" href="{#href#}">',
                                '<img src="img/{#icon#}">',
                                '<span>{#text#}</span>',
                            '</a>',
                            '<div class="box">',
                                '<div>',
                                    '<a class="title" href="{#href#}">{#title#}</a>',
                                        '<a href="{#href#}">{#content#}</a>',
                                '</div>',
                                '<a class="image" href="{#href#}"><img src="img/{#img#}"></a>',
                            '</div>',
                        '</li>'
                    ].join('')
                };
                // 渲染全部导航图片模块
                for(var i=0, len = data.length; i< len;i++){
                    html += $.formateString(tpl.item, data[i]);
                }
                // 在页面中创建侧边导航视图
                    // 向侧边导航模块容器中插入侧边导航视图
                dom.html(
                    // 渲染导航视图（content为导航图片内容）
                    $.formateString(tpl.container, {content: html})
                )
                // 将侧边导航模块容器插入页面中
                    .appendTo('body');
            }
        };
        // 获取视图接口方法
        return function (v) {
          // 根据视图名称返回视图（由于获取的是一个方法，这里需要将该方法执行一遍以获取相应的视图
            return V[v]();
        };
    }();
    // 初始化MVC控制器层
    MVC.ctrl = function () {
        // 模型数据层对象操作方法引用
        var M = MVC.model;
        // 视图数据层对象操作方法引用
        var V = MVC.view;
        // 控制器创建方法对象
        var C = {
            // 侧边导航栏模块
            initSlideBar: function () {
                // 渲染导航栏模块视图
                V('createSlideBar');
                // 为每一个导航图标添加鼠标贯标滑过与鼠标光标离开交互事件
                $('li', 'slidebar')
                // 鼠标移入导航icon(图标)显示导航浮层
                    .on('mouseover', function (e) {
                        $(this).addClass('show');
                    })
                // 鼠标移出导航icon(图标)隐藏导航浮层
                    .on('mouseout', function (e) {
                        $(this).removeClass('show');
                    });
                // 箭头icon(图标)动画交互
                $('.slidebar-close', 'slidebar')
                // 点击箭头icon时
                    .on('click', function (e) {
                        // 如果正在执行动画
                        if(M.getConf('slideBarCloseAnimate')){
                            // 终止操作
                            return false;
                        }
                        // 设置侧边导航模块动画配置数据开关为打开状态
                        M.setConf('slideBarCloseAnimate', true);
                        // 获取当前元素（箭头icon）
                        var $this = $(this);
                        // 如果箭头icon是关闭状态（含有is-close类）
                        if($this.hasClass('is-close')){
                            // 为侧边导航模块添加显示动画
                            $('.slidebar-inner', 'slidebar')
                                .animate({
                                   // 动画时间
                                    duration: 800,
                                    // 动画类型，
                                    type: 'easeOutQuart',
                                    main: function (dom) {
                                        // 每一帧改变导航模块容器left值
                                        dom.css('left', -50+this.tween*50+'px');
                                    },
                                    // 动画结束时回调函数
                                    end: function () {
                                        // 设置箭头icon为打开状态（删除is-close)类
                                        $this.removeClass('is-close');
                                        // 设置侧边导航模块动画配置数据卡管为关闭状态（此时可继续进行模块显隐动画交互）
                                        M.setConf('slideBarCloseAnimate', false);
                                    }
                                });
                        }else{ //如果箭头icon是打开状态（不含is-close类）
                            // 为侧边导航模块添加显示动画
                            $('.slidebar-inner', 'slidebar')
                                .animate({
                                   // 动画时间
                                    duration: 800,
                                    // 动画类型
                                    type: 'easeOutQuart',
                                    // 动画主函数
                                    main: function (dom) {
                                        // 每一帧改变导航模块容器left值
                                        dom.css('left', this.tween * -50 + 'px');
                                    },
                                    // 动画结束时回调函数
                                    end: function () {
                                        // 设置箭头icon为打开状态（删除is-close)类
                                        $this.addClass('is-close');
                                        // 设置侧边导航模块动画配置数据开关为关闭状态（此时可继续进行模块显隐动画交互）
                                        M.setConf('slideBarCloseAnimate', false);
                                    }
                                });
                        }
                    })
            }
        };
        // 为侧边导航模块添加交互与动画特效
        C.initSlideBar();
    }();
});