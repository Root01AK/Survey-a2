import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        {/* Welcome Section */}

        <div style={styles.welcome}>
          <h2>Welcome Back 👋</h2>
          <p>Explore surveys and track your participation.</p>
        </div>

        {/* Stats Section */}

        <div style={styles.stats}>
          <div style={styles.statCard}>
            <h3>12</h3>
            <p>Available Surveys</p>
          </div>

          <div style={styles.statCard}>
            <h3>5</h3>
            <p>Completed</p>
          </div>

          <div style={styles.statCard}>
            <h3>7</h3>
            <p>Pending</p>
          </div>
        </div>

        {/* Main Actions */}

        <h2 style={{ marginTop: "40px" }}>Quick Actions</h2>

        <div style={styles.cards}>
          {/* Survey Card */}

          <div style={styles.card} onClick={() => navigate("/surveyintro")}>
            <h3>📋 Surveys</h3>

            <p>Participate in surveys and share your valuable feedback.</p>

            <button style={styles.button}>Start Survey</button>
          </div>

          {/* Future Card */}

          <div style={styles.card}>
            <h3>📊 Reports</h3>

            <p>View analytics and survey participation reports.</p>

            <button style={styles.disabledBtn}>Coming Soon</button>
          </div>
        </div>

        {/* Activity */}

        <div style={styles.activity}>
          <h3>Recent Activity</h3>

          <ul>
            <li>Completed Customer Satisfaction Survey</li>
            <li>Joined Product Feedback Survey</li>
            <li>Logged in successfully</li>
          </ul>
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
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  cards: {
    display: "flex",
    gap: "30px",
    marginTop: "20px",
  },

  card: {
    width: "300px",
    padding: "30px",
    borderRadius: "18px",
    background: "#fff",
    boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
    cursor: "pointer",
    transition: "0.3s",
  },

  button: {
    marginTop: "15px",
    padding: "10px 18px",
    border: "none",
    background: "#FFC107",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
  },

  disabledBtn: {
    marginTop: "15px",
    padding: "10px 18px",
    border: "none",
    background: "#ddd",
    borderRadius: "8px",
  },

  activity: {
    marginTop: "40px",
    background: "#fff",
    padding: "25px",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
};
