var assert         = require('assert'),
    should         = require('should'),
    fs             = require('fs'),
    _              = require('underscore'),
    Presenter      = require('model-presenter'),
    Backbone       = require('backbone');
                     require('../lib/backbone-presenter');





describe('backbone-presenter', function() {

  describe( 'extending model-presenter', function() {

    beforeEach( function( done ){

      // describe the presenter using model-presenter
      PersonPresenter = Presenter.extend({

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

      PersonBackbonePresenter = Backbone.Presenter.extend( PersonPresenter );

      Persons = Backbone.Collection.extend({
        presenter: PersonBackbonePresenter,
        initialize: function() {
          this.presenter.bind( this );
        }
      })

      persons = new Persons([_.clone(person.attributes), _.clone(person.attributes), _.clone(person.attributes)]);

      done();

    });

    describe('should operate as normal', function() {

      beforeEach( function() {
        data = person.present();
      })

      it('should have expected properties', function() {
        data.salutation.should.equal('Mr');
        data.fullNameWithSalutation.should.equal('Mr. John Smith');
      })

    })

  })

  describe( 'extending Backbone.Presenter', function() {

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

      Persons = Backbone.Collection.extend({
        presenter: PersonPresenter,
        initialize: function() {
          this.presenter.bind( this );
        }
      })

      persons = new Persons([_.clone(person.attributes), _.clone(person.attributes), _.clone(person.attributes)]);

      done();

    });


    var baseTests = function() {
      it('should return an object', function() {
        data.should.be.type('object');
      })
    }

    describe('using a backbone model', function() {


      // presented using a strategy
      describe('present using a strategy', function() {


        // using a strategy that has a whitelist defined
        describe('with a whitelist strategy', function() {

          beforeEach( function() {
            data = person.present('whitelisted');
          })


          baseTests.call( this );

          it('should have only one property', function() {
            data.should.have.keys('firstName');
          })

        })


        // using a strategy that has a blacklist defined
        describe('with a blacklist strategy', function() {

          beforeEach( function() {
            data = person.present('blacklisted');
          })


          baseTests.call( this );

          it('should not have blacklisted property', function() {
            data.should.not.have.property('ssn');
          })

        })


        // using a strategy that has a combination of whitelist, blacklist and customAttributes
        describe('with a complex strategy', function() {

          beforeEach( function() {
            data = person.present('stationery');
          })


          baseTests.call( this );

          it('has the right properties', function() {
            data.should.have.keys( [ 'firstName', 'salutation', 'fullNameWithSalutation' ] );
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


      // if the customAttributes property is not defined on the presenter object
      describe('present without using a strategy', function() {

        beforeEach( function() {
          data = person.present();
        })


        baseTests.call( this );

        it('has the right properties', function() {
          var modelKeys = Object.keys( person.toJSON() );
          var presenterKeys = Object.keys( PersonPresenter.customAttributes );

          data.should.have.keys( modelKeys.concat( presenterKeys ) );
        })
      })


      // if the strategies property is not defined on the presenter object
      describe('without defined strategies', function() {

        beforeEach( function() {
          delete PersonPresenter.strategies;
          data = person.present();
        })


        baseTests.call( this );

        it('has the right properties', function() {
          var modelKeys = Object.keys( person.toJSON() );
          var presenterKeys = Object.keys( PersonPresenter.customAttributes );

          data.should.have.keys( modelKeys.concat( presenterKeys ) );
        })

      })


      // if the customAttributes property is not defined on the presenter object
      describe('without defined customAttributes', function() {

        beforeEach( function() {
          delete PersonPresenter.customAttributes;
          data = person.present();
        })


        baseTests.call( this );

        it('has the right properties', function() {
          var modelKeys = Object.keys( person.toJSON() );

          data.should.have.keys( modelKeys );
        })

      })

    })



    // if the customAttributes property is not defined on the presenter object
    describe('on a backbone collection', function() {

      beforeEach( function() {
        data = persons.present()
      })


      it('should return an object', function() {
        data.should.be.an.Array
      })

      it('should return a collection', function() {
        data.should.have.length(3)
      })

      it('has the right properties', function() {
        var modelKeys = Object.keys( person.attributes );
        var presenterKeys = Object.keys( PersonPresenter.customAttributes );

        data[0].should.have.keys( modelKeys.concat( presenterKeys ) );
        data[1].should.have.keys( modelKeys.concat( presenterKeys ) );
        data[2].should.have.keys( modelKeys.concat( presenterKeys ) );
      })

    })

  })

});