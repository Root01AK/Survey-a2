import React, { useState } from "react";
import { IoArrowForward } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
  const [hover, setHover] = useState(false);
const navigate = useNavigate();
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome 👋</h1>
        <p style={styles.subtitle}>
          Ready to begin your survey experience?
        </p>

        <button
          style={{
            ...styles.button,
            backgroundColor: hover ? "#e0a800" : "#FFC107",
            boxShadow: hover
              ? "0 8px 20px rgba(255, 193, 7, 0.4)"
              : "0 4px 12px rgba(255, 193, 7, 0.2)",
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => navigate("/consent")}
        >
          <span style={styles.buttonContent}>
            Start Survey
            <IoArrowForward style={styles.icon} />
          </span>
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "60px 50px",
    borderRadius: "24px",
    width: "400px",
    textAlign: "center",
    boxShadow:
      "0 20px 50px rgba(0, 0, 0, 0.08), 0 5px 15px rgba(255, 193, 7, 0.1)",
    border: "1px solid #FFF8E1",
    transition: "0.3s ease",
  },
  title: {
    marginBottom: "15px",
    color: "#222",
    fontSize: "30px",
    fontWeight: "700",
  },
  subtitle: {
    marginBottom: "35px",
    color: "#666",
    fontSize: "16px",
  },
  button: {
    color: "#ffffff",
    padding: "14px 20px",
    borderRadius: "12px",
    border: "none",
    fontSize: "17px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    transition: "all 0.3s ease",
  },
  buttonContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  icon: {
    fontSize: "20px",
  },
};