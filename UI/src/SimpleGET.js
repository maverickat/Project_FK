var items = [];
var error = null;
var isLoad = false;

export function SimpleGET(url,callback){
    fetch(url)
    .then((response) => {
    if(response.status === 200){
        console.log("Normal Http Established")     
    }else{
        console.log("SOMETHING WENT WRONG")
        error = true;
    }
    return response.json();
    })
    .then((json) => {items = json;
                    isLoad = true},
        (error)=>{
            isLoad = false;
            error = false;
            })
    callback(items,error,isLoad);
}