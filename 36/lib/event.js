/**
 * Created by dl_hi on 2017/8/28.
 */
F.module('lib/event', ['lib/dom'], function(dom){
   var events = {
       on : function (id, type, fn) {
           dom.g(id)['on'+type] = fn;
       }
   };
   return events;
});