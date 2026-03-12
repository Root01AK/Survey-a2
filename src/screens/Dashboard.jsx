import React from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

import { FaClipboardList, FaChartLine, FaCheckCircle } from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>

        {/* Welcome */}
        <div style={styles.welcome}>
          <h2>Welcome Back 👋</h2>
          <p>Explore surveys and track your participation.</p>
        </div>

        {/* Stats */}
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <FaClipboardList size={28} color="#FFC107" />
            <h3>12</h3>
            <p>Available Surveys</p>
          </div>

          <div style={styles.statCard}>
            <FaCheckCircle size={28} color="#4CAF50" />
            <h3>5</h3>
            <p>Completed</p>
          </div>

          <div style={styles.statCard}>
            <MdPendingActions size={28} color="#FF9800" />
            <h3>7</h3>
            <p>Pending</p>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 style={{ marginTop: "40px" }}>Quick Actions</h2>

        <div style={styles.cards}>

          {/* Survey Card */}
          <div
            style={styles.card}
            onClick={() => navigate("/surveyintro")}
          >
            <FaClipboardList size={40} color="#FFC107" />

            <h3>Surveys</h3>

            <p>
              Participate in surveys and share your valuable feedback.
            </p>

            <button style={styles.button}>Start Survey</button>
          </div>

          {/* Reports Card */}
          <div style={styles.card}>
            <HiOutlineDocumentReport size={40} color="#3B82F6" />

            <h3>Reports</h3>

            <p>
              View analytics and survey participation reports.
            </p>

            <button style={styles.disabledBtn}>Coming Soon</button>
          </div>

        </div>

       <div style={styles.activity}>
  <h3 style={styles.activityTitle}>Recent Activity</h3>

  <div style={styles.activityItem}>
    <FaCheckCircle style={styles.activityIconGreen} />
    <div>
      <p style={styles.activityText}>
        Completed Customer Satisfaction Survey
      </p>
      <span style={styles.activityTime}>2 hours ago</span>
    </div>
  </div>

  <div style={styles.activityItem}>
    <FaClipboardList style={styles.activityIconYellow} />
    <div>
      <p style={styles.activityText}>
        Joined Product Feedback Survey
      </p>
      <span style={styles.activityTime}>Yesterday</span>
    </div>
  </div>

  <div style={styles.activityItem}>
    <FaChartLine style={styles.activityIconBlue} />
    <div>
      <p style={styles.activityText}>
        Logged in successfully
      </p>
      <span style={styles.activityTime}>2 days ago</span>
    </div>
  </div>

</div>
      </div>

      <Footer />
    </div>
  );
}

const styles = {

  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(135deg,#ffffff,#FFF8E1)",
    fontFamily: "Poppins",
  },

  container: {
    padding: "40px",
    flex: 1,
    maxWidth: "1200px",
    margin: "auto",
  },

  welcome: {
    marginBottom: "30px",
  },

  stats: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
  },

  statCard: {
    flex: "1",
    background: "#fff",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    textAlign: "center",
    transition: "0.3s",
  },

  cards: {
    display: "flex",
    gap: "30px",
    marginTop: "20px",
    flexWrap: "wrap",
  },

  card: {
    width: "320px",
    padding: "30px",
    borderRadius: "18px",
    background: "#fff",
    boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
    cursor: "pointer",
    textAlign: "center",
    transition: "0.3s",
  },

  button: {
    marginTop: "18px",
    padding: "10px 20px",
    border: "none",
    background: "linear-gradient(135deg,#FFC107,#FFA000)",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
  },

  disabledBtn: {
    marginTop: "18px",
    padding: "10px 20px",
    border: "none",
    background: "#e5e7eb",
    borderRadius: "8px",
    color: "#555",
  },

 activity: {
  marginTop: "40px",
  background: "#fff",
  padding: "30px",
  borderRadius: "18px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
},

activityTitle: {
  marginBottom: "20px",
  fontWeight: "600",
},

activityItem: {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  padding: "12px 0",
  borderBottom: "1px solid #f1f1f1",
},

activityIconGreen: {
  fontSize: "22px",
  color: "#4CAF50",
},

activityIconYellow: {
  fontSize: "22px",
  color: "#FFC107",
},

activityIconBlue: {
  fontSize: "22px",
  color: "#3B82F6",
},

activityText: {
  margin: 0,
  fontWeight: "500",
},

activityTime: {
  fontSize: "12px",
  color: "#888",
},

};