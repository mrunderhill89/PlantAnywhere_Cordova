define(['backbone', 'bacon'],function(Backbone, Bacon){
    var StreamingView = Backbone.View.extend({
        initialize: function(params){
            this._streams = {
                render: new Bacon.Bus()
            };
            this._streams.render.onValue(this.render.bind(this));
        }
    });
    return MainView;
});