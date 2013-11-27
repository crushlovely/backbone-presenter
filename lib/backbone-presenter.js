var _ = require('underscore');
var Backbone = require('backbone');
var Presenter = require('model-presenter');




Backbone.Presenter = Presenter.extend({


  serializer: function( model ) {
    return model.toJSON();
  }


})

Backbone.Presenter.extend = function( obj ) {
  return _( this ).extend( obj );
}

Backbone.Presenter.bind = function( model ) {
  var self = this;

  model.present = function( strategy ) {
    // if presenting a backbone collection, present the models of that collection
    model = ( model instanceof Backbone.Collection ) ? model.models : model;
    return self.present( model, strategy )
  }
}

module.exports = Backbone;
