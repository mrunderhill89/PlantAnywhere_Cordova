define(['jquery_mobile', 'backbone', 'bacon'],function($, Backbone, Bacon){
    var MainView = Backbone.View.extend({
        initialize: function(params){
            this.device_ready =  Bacon.fromEventTarget(document, 'deviceready');
            this.device_ready.onValue(this.render.bind(this));
            
        },
        render: function(){
        },
    });
    return MainView;
});