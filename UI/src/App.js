import {useState,useEffect} from 'react';
import {Render_Browser} from './Render_Browser' ;
import {SSE} from './SSE';
function Connection(){
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [isLoad, setIsLoad] = useState(0);
    
    useEffect(()=>{
        var base_url = "http://127.0.0.1:3001";
        var query = window.location.pathname;

        //Starting SSE Connection
        SSE(base_url+query,function(items,error,isLoad){
            setItems(items);
            setError(error);
            setIsLoad(isLoad);
        });
    },[]);

     return Render_Browser(items,error,isLoad);   
}

export default Connection;