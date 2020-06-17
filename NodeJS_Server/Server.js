const Pub = require('./Pub') 
const Sub = require('./Sub')
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//RabbbitMq Connection for Publish
Pub.PubCon("SSE");
Sub.SubCon("SSE",function(user_id,msg){
    console.log("Recieved:",user_id)
    publishData(user_id,msg)
});

//For Establishing SSE
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
    var user_id = req.params.user_id;
    //For storing the connection
    if( user_id in clients){
        if(clients[user_id].length===0)
        Sub.SubBind(user_id)
        clients[user_id].push(newClient)
       }
       else{
        clients[user_id] = [newClient]
        Sub.SubBind(user_id)
       }
    console.log("SSE opened ",user_id)
    res.write(":Connection Established \n\n")
    req.on('close', () => {
        //For deleting the connection
        var n = clients[user_id].length;
        var updated_list = [];
        for(var i = 0;i<n;i++){
            if(clients[user_id][i].id === clientId){
                // clients[user_id][i].res.end();
            }
            else{
                updated_list.push(clients[user_id][i]);
            }
        }
        clients[user_id] = updated_list;
        if(clients[user_id].length===0){
            Sub.SubUnbind(user_id)
        }
        console.log("close: ",user_id)
   });
  }

//Conection between Dropwizard And NodeJs
function getEvent(req,res){
    var msg = req.body
    var user_id = req.params.user_id
    console.log("Recievded Dropwizard",user_id)
    Pub.PubMsg(user_id,JSON.stringify(msg))
    res.end("Success")
    var d = (new Date).getTime();
    console.log("dropwizard to NodeJS:", d-msg.Date)
 }

//Publishing Events
function publishData(user_id,msg){
    if (user_id in clients){
        var no_clients = clients[user_id].length
        for(var i = 0;i<no_clients;i++){
            clients[user_id][i].res.write("data:" +msg +"\n\n")
            var d = (new Date).getTime();
            message = JSON.parse(msg)
            console.log("send dATA:",user_id)
            console.log("dropwizard to browser:",d-message.Date)
        }
    }
 }

//Configuration Part For Server
app.get('/dashboard/:user_id/', getSSE);       //SSE
app.post('/dashboard/:user_id',getEvent);              //Dropwizard

const hostname = '127.0.0.1';
const PORT = 3001;
let clients = {};
app.listen(PORT,hostname,() => {
    console.log('Server running at http://'+hostname+':'+PORT+'/');
  });


