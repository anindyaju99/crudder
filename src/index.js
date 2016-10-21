module.exports = {
  Model: require('./model'),
  Models: {
    Mongo: require('./models/mongo_model')
  },
  create: function(model) {
    var Crudder = require('./crudder');
    var crudder = new Crudder(null, model);
    return crudder;
  }
};
