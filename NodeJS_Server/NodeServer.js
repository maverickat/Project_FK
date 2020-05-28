const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

//Establishing SSE
function getSSE(req, res) {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  res.writeHead(200, headers);
  res.connection.setTimeout(0);
  const clientId = Date.now();
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
   clients[branch_id] = clients[branch_id].filter(c => c.id !== clientId);
 });
}

//Conection between Dropwizard And NodeJs
function getEvent(req,res){
   var msg = req.body
   var branch_id = req.params.branch_id
   publishData(branch_id,msg)
   res.end("Success")
}

//Publishing Events
function publishData(branch_id,msg){
   if (branch_id in clients){
      var no_clients = clients[branch_id].length
      for(var i = 0;i<no_clients;i++){
         clients[branch_id][i].res.write("data:" +JSON.stringify(msg) +"\n\n")
      }
   }

}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/dashboard/:branch_id', getSSE);                //SSE
app.post('/dashboard/:branch_id',getEvent);              //Dropwizard

const hostname = '127.0.0.1';
const PORT = 3001;
let clients = {};
app.listen(PORT,hostname,() => {
    console.log('Server running at http://'+hostname+':'+PORT+'/');
  });