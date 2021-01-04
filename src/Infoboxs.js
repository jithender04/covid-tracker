import React from 'react'
import "./infobox.css"
import { Card,CardContent,Typography } from "@material-ui/core";
function Infoboxs({title,active,cases,total,...props}) {
    return (
       <Card  onClick={props.onClick}  className={`infobox ${active && "infoBox--selected"}`}>
           <CardContent>
               <Typography className="infobox__title" color="textSecondary">{title}</Typography>
                <h2 class="infobox__cases">{cases}</h2>
                <Typography className="infobox__total" color="textSecondary">{total} total </Typography>
           </CardContent>
       </Card>
    )
}

export default Infoboxs
