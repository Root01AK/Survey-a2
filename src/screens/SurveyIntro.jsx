import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowForward } from "react-icons/io5";

export default function SurveyIntro() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      
      {/* Content Area */}
      <div style={styles.cardWrapper}>
        <div style={styles.card}>
          <h1 style={styles.title}>
            Sexual Minorities Health and Wellbeing Survey
          </h1>

          <h3 style={styles.subtitle}>
            YR Gaitonde Centre for AIDS Research and Education (YRGCARE)
          </h3>

          <p style={styles.programme}>Sabrang Programme</p>

          <div style={styles.content}>
            <p>
             Thank you for taking the time to participate in this important study. We know that sharing personal experiences can be difficult, and we truly appreciate your willingness to help us understand the challenges faced by LGBTQIA+ communities in India.
            </p>

            <p>
             This survey asks about your life experiences, including some sensitive topics like discrimination, violence, health, and substance use. The information you share will help us design better support services and advocate for policies that protect and empower our community.
            </p>

            <h4 style={styles.rememberTitle}>Please remember:</h4>

            <ul style={styles.list}>
              <li>Your participation is completely voluntary.</li>
              <li>All your responses will remain strictly confidential.</li>
              <li>You may skip any question you are not comfortable answering.</li>
              <li>You may stop the survey at any time.</li>
            </ul>
            <p>The interview typically takes 45-60 minutes. If at any point you feel distressed, please let the interviewer know. We have counseling support available if you need it.</p>

            <p style={styles.highlight}>
             Your voice matters, and your story can make a real difference in improving the lives of many others in our community.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div style={styles.buttonContainer}>
        <button
          style={styles.button}
          onClick={() => navigate("/consent")}
        >
          Start Survey
          <IoArrowForward />
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    fontFamily: "Arial, sans-serif",
  },

  cardWrapper: {
    display: "flex",
    justifyContent: "center",
    padding: "50px 20px",
  },

  card: {
    backgroundColor: "#ffffff",
    width: "800px",
    padding: "50px",
    borderRadius: "20px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
    borderTop: "6px solid #FFC107",
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "12px",
    color: "#E6B800",
    textAlign: "center",
  },

  subtitle: {
    fontSize: "16px",
    color: "#444",
    textAlign: "center",
    marginBottom: "6px",
  },

  programme: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#777",
    marginBottom: "25px",
  },

  content: {
    fontSize: "15px",
    color: "#555",
    lineHeight: "1.7",
  },

  rememberTitle: {
    marginTop: "20px",
    marginBottom: "10px",
    color: "#333",
  },

  list: {
    paddingLeft: "20px",
    marginBottom: "15px",
  },

  highlight: {
    fontWeight: "600",
    marginTop: "15px",
    color: "#444",
  },

  buttonContainer: {
    padding: "20px",
    backgroundColor: "#ffffff",
    borderTop: "1px solid #f5f5f5",
  },

  button: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "16px",
    borderRadius: "14px",
    border: "none",
    backgroundColor: "#FFC107",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "16px",
  },
};