import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ConsentForm() {
  const navigate = useNavigate();

  const [isHovering, setIsHovering] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    clinic: "",
    interviewerId: "",
    participantId: "",
    consentGiven: false,
  });

  const isFormValid =
    formData.date &&
    formData.clinic &&
    formData.interviewerId &&
    formData.participantId &&
    formData.consentGiven;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>
          SECTION A: Consent and Background Information
        </h2>

        <h3 style={styles.subHeading}>Interview Details</h3>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="clinic"
          placeholder="Sabrang Clinic Location"
          value={formData.clinic}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="interviewerId"
          placeholder="Interviewer ID"
          value={formData.interviewerId}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="participantId"
          placeholder="Participant ID"
          value={formData.participantId}
          onChange={handleChange}
          style={styles.input}
        />

        <h3 style={styles.subHeading}>Informed Consent</h3>

        <ul style={styles.list}>
          <li>The purpose of this study and what questions will be asked</li>
          <li>Participation is voluntary and can withdraw anytime</li>
          <li>Information kept confidential for research only</li>
          <li>Can refuse to answer any question</li>
          <li>Access to support services if needed</li>
        </ul>

        <div style={styles.checkboxContainer}>
          <input
            type="checkbox"
            name="consentGiven"
            checked={formData.consentGiven}
            onChange={handleChange}
          />
          <label style={{ marginLeft: "8px" }}>
            Yes, I agree to participate
          </label>
        </div>

        <div style={styles.buttonContainer}>
          {/* Disagree Button with Red Hover */}
          <button
            style={{
              ...styles.disagreeButton,
              backgroundColor: isHovering ? "#ff4d4f" : "#ffffff",
              color: isHovering ? "#ffffff" : "#333",
              border: isHovering ? "1px solid #ff4d4f" : "1px solid #ccc",
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => navigate("/home")}
          >
            Disagree
          </button>

          <button
            style={{
              ...styles.continueButton,
              backgroundColor: isFormValid ? "#FFC107" : "#e0e0e0",
              cursor: isFormValid ? "pointer" : "not-allowed",
            }}
            disabled={!isFormValid}
            onClick={() => navigate("/about")}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif",
  },

  card: {
    backgroundColor: "#ffffff",
    width: "600px",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.06)",
    border: "1px solid #f3f3f3",
  },

  sectionTitle: {
    marginBottom: "20px",
    fontSize: "20px",
    fontWeight: "700",
    color: "#333",
  },

  subHeading: {
    marginTop: "20px",
    marginBottom: "10px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#444",
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    marginBottom: "14px",
    borderRadius: "12px",
    border: "1px solid #e5e5e5",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
  },

  list: {
    fontSize: "14px",
    color: "#555",
    paddingLeft: "20px",
    marginBottom: "15px",
    lineHeight: "1.6",
  },

  checkboxContainer: {
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },

  disagreeButton: {
    flex: 1,
    padding: "12px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },

  continueButton: {
    flex: 1,
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    fontWeight: "600",
    color: "#fff",
    transition: "0.3s ease",
  },
};