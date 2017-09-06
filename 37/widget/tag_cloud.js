/**
 * Created by dl_hi on 2017/9/5.
 */
F.module('widget/tag_cloud', ['lib/template', 'lib/dom'], function (template, dom) {
   var str = template('demo_script', data);
   dom.html('test', str);
});