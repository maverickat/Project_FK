var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "atif",
    password: "atif",
    database: "Project_FK"
});

function dbConnect(){
    con.connect(function(err){
        if(err) throw err;
        console.log("Connected");
    })
}

function dbInsert(user_id,services,newCon){
    sqlQuery = "DELETE FROM user_allocation WHERE user_id=\"" +user_id+"\"";
        con.query(sqlQuery,function(err,result){
            if(err) throw err;
            sqlQuery = "Insert into user_allocation Values";
            sqlQuery += "(\""+user_id+"\",\""+services[0]+"\")";
            for(var i = 1;i<services.length;i++){
                sqlQuery += ",(\""+user_id+"\",\""+services[i]+"\")";
            }
            con.query(sqlQuery,function(err,result){
                if(err) throw err;
            })
        })
    if(newCon){
        sqlQuery = "Insert into user_count Values" +"(\""+user_id+"\",1) "+"ON DUPLICATE KEY UPDATE count = count+1";
        con.query(sqlQuery,function(err,result){
            if(err) throw err;
        })
    }
}

function dbDelete(user_id){
    sqlQuery = "SELECT count FROM user_count WHERE user_id = \"" +user_id+"\"";
    con.query(sqlQuery,function(err,result){
        if(err) throw err;
        if(result[0].count===1){
            sqlQuery = "DELETE FROM user_allocation WHERE user_id=\"" +user_id+"\"";
            con.query(sqlQuery,function(err,result){
            if(err) throw err;
            })
            sqlQuery = "DELETE FROM user_count WHERE user_id=\"" +user_id+"\"";
            con.query(sqlQuery,function(err,result){
            if(err) throw err;
            })
        }
        else{
            sqlQuery = "UPDATE user_count SET count=count-1 WHERE user_id=\"" +user_id+"\"";
            con.query(sqlQuery,function(err,result){
                if(err) throw err;
                })
        }
        })
}

function dbGetUser(service,callback){
    sqlQuery = "SELECT user_id FROM user_allocation WHERE service=\"" +service+"\"";
    con.query(sqlQuery,function(err,result){
        if(err) throw err;
        return callback(result);
    })
}


module.exports = {dbConnect,dbInsert,dbDelete,dbGetUser};