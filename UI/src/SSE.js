var items = [];
var error = null;
var isLoad = false;

export function SSE(url,callback){
    let source = new EventSource(url);
    source.onopen = (e)=>{
        isLoad = true;
        console.log("SSE Connection Established")
        callback(items,error,isLoad);
        }
      source.onmessage = (e) =>{
        console.log("Message recieved");
        items=JSON.parse(e.data).Date;
        callback(items,error,isLoad);
        }
      source.onerror = (e)=>{
        console.log("SOMETHING WENT WRONG");
        if(source.readyState === 2){
          error = true;
          source.close();
        }
        if(source.readyState === 0){
          isLoad =false;
        }
        callback(items,error,isLoad);
      }
}