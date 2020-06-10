const Pub = require('./Pub') 
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

//Publisher
ch = Pub.PubCon();
//Subscriber
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
       var exchange = 'SSEmsg';
       channel.assertExchange(exchange, 'fanout', {
       durable: false
       });
       channel.assertQueue('', {
       exclusive: true
       }, function(error2, q) {
       if (error2) {
           throw error2;
       }
       channel.bindQueue(q.queue, exchange, '');
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
Sub()

//Establishing SSE
var c = 0;
function getSSE(req, res) {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  res.writeHead(200, headers);
  res.connection.setTimeout(0);
  const clientId = req.params.user_id + Date.now()+c;
  c+=1;
  const newClient = {
   id: clientId,
    res
  };
  var branch_id = req.params.branch_id;
  if( branch_id in clients){
   clients[branch_id].push(newClient)
  }
  else{
   clients[branch_id] = [newClient]
  }
  res.write(":Connection Established \n\n")
  req.on('close', () => {
      console.log("closed")
      var n = clients[branch_id].length;
        var updated_list = [];
      for(var i = 0;i<n;i++){
        if(clients[branch_id][i].id === clientId){
            clients[branch_id][i].res.end();
        }
        else{
            updated_list.push(clients[branch_id][i]);
        }
      }
      clients[branch_id] = updated_list;
 });
}

//Conection between Dropwizard And NodeJs
function getEvent(req,res){
   var msg = req.body
   var branch_id = req.params.branch_id
   Pub.PubMsg(ch,branch_id,JSON.stringify(msg))
   res.end("Success")
}

//Publishing Events
function publishData(branch_id,msg){
   if (branch_id in clients){
      var no_clients = clients[branch_id].length
      for(var i = 0;i<no_clients;i++){
         clients[branch_id][i].res.write("data:" +msg +"\n\n")
      }
   }

}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/dashboard/:user_id/:branch_id', getSSE);       //SSE
app.post('/dashboard/:branch_id',getEvent);              //Dropwizard

const hostname = '127.0.0.1';
const PORT = 3001;
let clients = {};
app.listen(PORT,hostname,() => {
    console.log('Server running at http://'+hostname+':'+PORT+'/');
  });