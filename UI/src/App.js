import React, { useState, useEffect } from 'react';
function MyComponent() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  var query = window.location.pathname;
  var base = "http://127.0.0.1:8080"
  useEffect(() => {
    fetch(base + query)
  .then((response) => {
    if(response.status === 200){
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
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <table>
        <tr>
          <th>Technician_Id</th>
          <th>Case_Id</th>
        </tr>
      {items.map(item => {
           return<tr>
             <td>{item.technician_id}</td>
             <td> {item.case_id}</td>
             </tr>;})}
      </table>
      </div>
    )
  }
}
 export default MyComponent;
