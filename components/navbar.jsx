import React, { useEffect, useState } from "react";

export default function Navbar() {

const [time,setTime] = useState(new Date());
const userName = "Santhosh"; // change based on logged user
const firstLetter = userName.charAt(0).toUpperCase();

useEffect(()=>{

const timer = setInterval(()=>{
setTime(new Date());
},1000);

return ()=>clearInterval(timer);

},[]);

return (

<div style={styles.navbar}>

<div style={styles.logo}>
SurveyApp
</div>

<div style={styles.rightSection}>

<div style={styles.dateTime}>
{time.toLocaleDateString()} | {time.toLocaleTimeString()}
</div>

<div style={styles.profile}>
{firstLetter}
</div>

</div>

</div>

);
}

const styles = {

navbar:{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
padding:"18px 40px",
background:"#fff",
boxShadow:"0 4px 20px rgba(0,0,0,0.06)",
position:"fixed",
top:0,
left:0,
width:"100%",
zIndex:1000,
boxSizing:"border-box"
},

logo:{
fontSize:"20px",
fontWeight:"700",
color:"#FFC107"
},

rightSection:{
display:"flex",
alignItems:"center"
},

dateTime:{
fontSize:"14px",
color:"#666"
},

profile:{
width:"40px",
height:"40px",
borderRadius:"50%",
background:"#FFC107",
color:"#fff",
display:"flex",
alignItems:"center",
justifyContent:"center",
fontWeight:"600",
cursor:"pointer",
marginLeft:"15px"
}

};