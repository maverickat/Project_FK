
import React, { useState,useEffect} from 'react';

function MyComponent(){
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [initialDate,setDate] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(true);
  useEffect(()=>{
  var query = window.location.pathname;
  var qpa = query.split("/");
  var base = "http://127.0.0.1:8080";
  fetch(base + "/allocation/"+qpa[2])
  .then((response) => {
  if(response.status === 200){
      setDate(new Date());
      console.log("Normal Http Established")     
  }else{
      console.log("SOMETHING WENT WRONG")
      setError(true)
  }
  return response.json();
})
.then((json) => {setItems(json);
                setIsLoaded(true)},
      (error)=>{
        setIsLoaded(false);
        setError(error);
        })
  let source = new EventSource(base+query);
  source.onopen = (e)=>{
    console.log("Connection Established")
    }
  source.onmessage = (e) =>{
    console.log("Message recieved");
    setItems(JSON.parse(e.data));
    setDate(new Date());
    }
  source.onerror = (e)=>{
    console.log("SOMETHING WENT WRONG\nClosing Connecction");
    setError(true);
    source.close();
    }
  },[])
    if(error){
      return <div>
        <h1 style={{ display: "flex" ,justifyContent: "center", alignItems: "center" }}>Error:{error.message}</h1>
        <div style={{ display: "flex" ,justifyContent: "center", alignItems: "center" }}>
          Refresh The Page
        </div>
        </div>
    }
    else if (!isLoaded) {
      return <div>Loading...</div>;
    }
    else{
    return(
      <div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <table>
        <thead>
          <tr><th>Technician_Id</th>
          <th>Case_Id</th></tr>
        </thead>
        <tbody>
      {items.map(item=> {
           return<tr key={item.case_id}>
             <td>{item.technician_id}</td>
             <td>{item.case_id}</td>
             </tr>})}
          </tbody>
      </table>
      </div>
   <p style={{ display: "flex", justifyContent: "center"}}>Last Updated: {String(initialDate)}</p>
   </div>
    )
  }
}
  export default MyComponent;