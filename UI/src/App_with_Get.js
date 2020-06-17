import {useState,useEffect} from 'react';
import {Render_Browser} from './Render_Browser' ;
import {SSE} from './SSE';
import {SimpleGET} from './SimpleGET';

function Connection(){
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [isLoad, setIsLoad] = useState(0);
    useEffect(()=>{
        var base_url = "http://127.0.0.1:";
        var query = window.location.pathname;

        //Starting SSE Connection
        SSE(base_url+"3001"+query,function(items,error,isLoad){
            setItems(items);
            setError(error);
            setIsLoad(isLoad);
        });

        //Simple GET Request
        SimpleGET(base_url+"8081"+query,function(items,error,isLoad){
            setItems(items);
            setError(error);
            setIsLoad(isLoad);
        });

    },[]);
     return Render_Browser(items,error,isLoad);   
}

export default Connection;