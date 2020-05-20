import React, { useState, useEffect } from 'react';
function MyComponent() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [initialDate,setDate] = useState(new Date());
  var query = window.location.pathname;
  var base = "http://127.0.0.1:8080"
  useEffect(() => {
    fetch(base + query)
  .then((response) => {
    if(response.status === 200){
        setDate(new Date());
        console.log("SUCCESSS")     
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
  }, [])
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } 
  else {
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
