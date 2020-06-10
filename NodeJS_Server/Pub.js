function PubCon(){
    ch = null;
    var amqp = require('amqplib/callback_api');
    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
            throw error1;
            }
            var exchange = 'SSEmsg';

            channel.assertExchange(exchange, 'fanout', {
            durable: false
            });
            ch = channel;
        });
    });
return ch;
}

function PubMsg(ch,branch_id,msg){
    ch.publish("SSEmsg",branch_id,Buffer.from(msg));
}

module.exports = {PubCon,PubMsg};

