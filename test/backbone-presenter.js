var assert         = require('assert'),
    should         = require('should'),
    fs             = require('fs'),
    Backbone       = require('backbone');
                     require('../lib/backbone-presenter');




describe('backbone-presenter', function() {

  beforeEach( function( done ){

    // describe the presenter
    PersonPresenter = Backbone.Presenter.extend({

      customAttributes: {

        salutation: function() {
          var salutationMap = {male: 'Mr', female: {married: 'Mrs', notMarried: 'Ms'}}
          var genderMap = salutationMap[ this.attributes.gender ]
          var marriedStatus = ( this.attributes.married ) ? 'married' : 'notMarried'
          var salutation = ( typeof genderMap === 'string' ) ? genderMap : genderMap[ marriedStatus ]
          return salutation
        }

      , fullName: function() {
          return [this.attributes.firstName, this.attributes.lastName].join(' ');
        }

      , fullNameWithSalutation: function() {
          return [this.customAttribute('salutation') + '.', this.customAttribute('fullName')].join(' ')
        }

      }

    , strategies: {

        stationery: {
          whitelist: ['firstName']
        , customAttributes: ['salutation', 'fullNameWithSalutation']
        }

      , whitelisted: {
          whitelist: ['firstName']
        }

      , blacklisted: {
          blacklist: ['ssn']
        }
      }
    })

    // describe the new model
    Person = Backbone.Model.extend({
      presenter: PersonPresenter
    , initialize: function() {
        this.presenter.bind( this );
      }
    })

    person = new Person({
      firstName: 'John'
    , lastName: 'Smith'
    , gender: 'male'
    , married: true
    , ssn: '111-11-1111'
    });

    done();

  });


  describe('using a strategy', function() {


    describe('whitelist', function() {

      beforeEach( function() {
        data = person.present('whitelisted');
      })


      it('should have only one property', function() {
        data.should.have.keys('firstName');
      })

    })


    describe('blacklist', function() {

      beforeEach( function() {
        data = person.present('blacklisted');
      })


      it('should not have blacklisted property', function() {
        data.should.not.have.property('ssn');
      })

    })


    describe('complex', function() {

      beforeEach( function() {
        data = person.present('stationery');
      })


      it('has the right properties', function() {
        data.should.have.keys( [ 'firstName', 'salutation', 'fullNameWithSalutation' ] )
      })

      it('should not have omitted properties', function() {
        data.should.not.have.property('ssn')
      })

      it('should have a value for the custom attributes', function() {
        data.salutation.should.equal('Mr');
        data.fullNameWithSalutation.should.equal('Mr. John Smith');
      })

    })

  })



  describe('without a strategy', function() {

    beforeEach( function() {
      data = person.present();
    })


    it('has the right properties', function() {
      var modelKeys = Object.keys( person.toJSON() );
      var presenterKeys = Object.keys( PersonPresenter.customAttributes );

      data.should.have.keys( modelKeys.concat( presenterKeys ) );
    })
  })

});