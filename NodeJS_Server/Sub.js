function Sub(){
    var amqp = require('amqplib/callback_api');
 
    amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
        throw error1;
        }
        var exchange = 'SSE';
        channel.assertExchange(exchange, 'direct', {
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
                publishData(msg.fields.routingKey,msg.content.toString())
            }
        }, {
            noAck: true
        });
        });
    });
    });
 }