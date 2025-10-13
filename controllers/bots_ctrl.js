
var Bot = require('../models/bot')
var Message = require('../models/message.js')
var CallLog = require('../models/call_log.js')
var Command = require('../models/command.js')
var Contact = require('../models/contact.js')
var Permission = require('../models/permission')

module.exports = function(io) {
  return {
    index: function(req, res, next) {
      Bot.findAll()
        .then(function(db_bots) {
          res.json(db_bots)
        })
        .catch(function(err) {
          res.status(500).send(err)
        })
    },
    updateStatus: function(req, res, next) {
      var uid = req.params.uid
      var attributes = req.body
      attributes.status = true
      attributes.updated = new Date()
      Bot.findOne({
        where: {
          uid: uid
        }
      })
        .then(function(dbBot) {
          if (dbBot) {
            dbBot.update(attributes)
              .then(function(dbBot) {
                io.to('/admin').emit('bot:updated', dbBot)
                res.status(200).send()
              })
              .catch(function(err) {
                res.status(500).send(err)
              })
          } else {
            attributes.uid = uid
            Bot.create(attributes)
              .then(function(dbBot) {
                io.to('/admin').emit('bot:created', dbBot)
                res.status(201).send()
              })
              .catch(function(err) {
                res.status(500).send(err)
              })
          }
        })
        .catch(function(err) {
          res.status(500).send(err)
        })

    },
    show: function(req, res, next) {
      var id = req.params.id;
      Bot.findById(id)
        .then(function(bot) {
          res.json(bot);
        })
        .catch(function(err) {
          res.status(500).send(err)
        })
    },
    delete: async function (req, res) {
      try {
        const botId = parseInt(req.params.id);
        const dbBot = await Bot.findOne({ where: { id: botId } });

        if (!dbBot) {
          return res.status(404).send({ error: `Bot with id: ${botId} not found` });
        }

        const uid = dbBot.uid;

        // As operações de exclusão podem ser executadas em paralelo
        await Promise.all([
          dbBot.destroy(),
          Message.destroy({ where: { uid: uid } }),
          CallLog.destroy({ where: { uid: uid } }),
          Command.destroy({ where: { uid: uid } }),
          Contact.destroy({ where: { uid: uid } }),
          Permission.destroy({ where: { uid: uid } })
        ]);

        res.status(200).send();
      } catch (err) {
        // Adicionando log do erro para facilitar a depuração
        console.error('Error deleting bot:', err);
        res.status(500).send({ error: 'An internal server error occurred.' });
      }
    }

  }
}
