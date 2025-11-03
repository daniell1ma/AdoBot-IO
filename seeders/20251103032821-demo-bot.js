'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Bots', [{
      uid: 'bot-de-exemplo-123',
      device: 'Exemplo de Dispositivo',
      sdk: 29,
      phone: '+5511912345678',
      provider: 'ExemploNet'
    }], {});    
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Bots', {
      uid: 'bot-de-exemplo-123'
    }, {});
  }
};

