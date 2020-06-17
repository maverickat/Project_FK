var chsub;
var qsub;
var exchange
function SubCon(exchng,callback){
    var amqp = require('amqplib/callback_api');
    exchange = exchng;
    amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
        throw error1;
        }
        channel.assertExchange(exchng, 'direct', {
        durable: false
        });
        channel.assertQueue('', {
        exclusive: true
        }, function(error2, q) {
        if (error2) {
            throw error2;
        }
        chsub = channel
        qsub = q
        channel.consume(q.queue, function(msg) {
            if(msg.content) {
                callback(msg.fields.routingKey,msg.content.toString())
            }
        }, {
            noAck: true
        });
        });
    });
    });
 }

 function SubBind(topic){
    chsub.bindQueue(qsub.queue,exchange,topic);
  }
function SubUnbind(topic){
  chsub.unbindQueue(qsub.queue,exchange,topic);
}

 module.exports = {SubCon,SubBind,SubUnbind};