var exchange;
var ch;
function PubCon(exchng){
    exchange = exchng;
    var amqp = require('amqplib/callback_api');
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
            ch = channel;
        });
    });
return ch;
}

function PubMsg(user_id,msg){
    ch.publish(exchange,user_id,Buffer.from(msg));
}

module.exports = {PubCon,PubMsg};

