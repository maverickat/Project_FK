import React from 'react'
export function Render_Browser(items,error,isLoad){
    if(error){
        return <div>Refresh The Page</div>
      }
      else if(isLoad===false){
        return <div>Retrying</div>
      }
      else{
      return(
      <div>{((new Date()).getTime() -items)}</div>
      )
    }
}