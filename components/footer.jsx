import React from "react";

export default function Footer(){

return(

<div style={styles.footer}>

<p>
© {new Date().getFullYear()} Survey Platform
</p>

</div>

);
}

const styles = {

footer:{
marginTop:"auto",
padding:"18px",
textAlign:"center",
background:"#fff",
borderTop:"2px solid #FFC107",
color:"#666"
}

};