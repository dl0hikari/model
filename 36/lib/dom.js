/**
 * Created by dl_hi on 2017/8/28.
 */
F.module('lib/dom', function () {
   return {
        g: function (id) {
            return document.getElementById(id);
        },
       html: function (id, html) {
           if(html){
               this.g(id).innerHTML = html;
           }else{
               return this.g(id).innerHTML;
           }
       }
   };
});