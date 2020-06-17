import React, { useState,useEffect} from 'react';

function MyComponent(){
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [isLoad, setIsLoad] = useState(0);
    const [initialDate,setDate] = useState(new Date());
    useEffect(()=>{
    var query = window.location.pathname;
    var base = "http://127.0.0.1:";
    let source = new EventSource(base+"3001"+query);
    source.onopen = (e)=>{
      setIsLoad(1);
      console.log("SSE Connection Established")
      }
    source.onmessage = (e) =>{
      console.log("Message recieved");
      setItems(JSON.parse(e.data).Date);
      setDate((new Date()).getTime());
      }
    source.onerror = (e)=>{
      console.log("SOMETHING WENT WRONG");
      if(source.readyState === 2){
        setError(true);
        source.close();
      }
      if(source.readyState === 0){
        setIsLoad(0);
      }
      }
    },[])
      if(error){
        return <div>Refresh The Page</div>
      }
      else if(isLoad===0){
        return <div>Retrying</div>
      }
      else{
      return(
      <div>{(initialDate-items)}</div>
      )
    }
  }
    export default MyComponent;