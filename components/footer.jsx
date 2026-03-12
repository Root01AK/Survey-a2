import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        
        {/* Brand */}
        <div style={styles.brand}>
          <h3 style={styles.logo}>Survey Platform</h3>
          <p style={styles.tagline}>
            Collect insights and improve decisions through smart surveys.
          </p>
        </div>

        {/* Links */}
        <div style={styles.links}>
          <a href="#" style={styles.link}>Home</a>
          <a href="#" style={styles.link}>Surveys</a>
          <a href="#" style={styles.link}>Privacy</a>
          <a href="#" style={styles.link}>Support</a>
        </div>

        {/* Social */}
        <div style={styles.social}>
          <FaGithub style={styles.icon} />
          <FaLinkedin style={styles.icon} />
          <FaTwitter style={styles.icon} />
        </div>

      </div>

      <div style={styles.bottom}>
        © {new Date().getFullYear()} Survey Platform • All rights reserved
      </div>
    </footer>
  );
}

const styles = {

footer:{
background:"#ffffff",
borderTop:"1px solid #eee",
marginTop:"auto",
paddingTop:"35px",
fontFamily:"Poppins"
},

container:{
maxWidth:"1200px",
margin:"auto",
display:"flex",
justifyContent:"space-between",
alignItems:"center",
flexWrap:"wrap",
padding:"0 30px 25px 30px"
},

brand:{
maxWidth:"320px"
},

logo:{
margin:0,
color:"#111",
fontWeight:"600"
},

tagline:{
fontSize:"14px",
color:"#777",
marginTop:"6px"
},

links:{
display:"flex",
gap:"22px"
},

link:{
textDecoration:"none",
color:"#555",
fontSize:"14px",
fontWeight:"500"
},

social:{
display:"flex",
gap:"16px"
},

icon:{
fontSize:"20px",
color:"#666",
cursor:"pointer",
transition:"0.3s"
},

bottom:{
textAlign:"center",
borderTop:"1px solid #f1f1f1",
padding:"15px",
fontSize:"13px",
color:"#888"
}

};