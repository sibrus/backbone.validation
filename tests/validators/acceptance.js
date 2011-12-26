buster.testCase("acceptance validator", {
    setUp: function() {
        var that = this;
        var Model = Backbone.Model.extend({
            validation: {
                agree: {
                    acceptance: true
                }
            }
        });
        
        this.model = new Model();
        this.view = new Backbone.View({
            model: this.model
        });

        Backbone.Validation.bind(this.view, {
            valid: this.spy(),
            invalid: this.spy()
        });
    },
    
    "non-boolean is invalid": function(){
        refute(this.model.set({
            agree: 'non-boolean'
        }));
    },
    
    "false boolean is invalid": function() {
        refute(this.model.set({
            agree: false
        }));
    },

    "true boolean is valid": function() {
        assert(this.model.set({
            agree: true
        }));
    }
});