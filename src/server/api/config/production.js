export default {
  mongo: {
    uri: 'mongodb://localhost/michalsBlogProd'
  },

  seedDB: true,

  port: process.env.PORT || 80
};
