import React, { useState } from "react";
import questions from "../data/questions.json";
import { IoArrowForward, IoArrowBack } from "react-icons/io5";
import Select from "react-select";

export default function MultiStepForm() {
  // Build sections directly from JSON sectionCode
 const surveySections = Array.from(
  new Map(
    questions.map((q) => [
      q.section, // group by section name
      { code: q.sectionCode, name: q.section },
    ])
  ).values()
);

 const sections = [
  { code: "CONSENT", name: "Consent" },
  ...surveySections,
];

  const [currentSectionIndex, setCurrentSectionIndex] =
    useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);
  const [answers, setAnswers] = useState({});
  const [formData, setFormData] = useState({
    date: "",
    clinic: "",
    interviewerId: "",
    participantId: "",
    consentGiven: false,
  });

  const currentSection = sections[currentSectionIndex];

  const surveyQuestions = questions
  .map((q, index) => ({ ...q, index }))
  .filter((q) => q.section === currentSection.name);


  const currentQuestion =
    surveyQuestions[currentQuestionIndex];

  const progressPercentage =
    ((currentSectionIndex + 1) / sections.length) * 100;

  const handleConsentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAnswerChange = (qIndex, option) => {
    setAnswers({
      ...answers,
      [qIndex]: option,
    });
  };

  const isConsentValid =
    formData.date &&
    formData.clinic &&
    formData.interviewerId &&
    formData.participantId &&
    formData.consentGiven;

  const handleNext = () => {
    if (currentSection.code === "CONSENT") {
      setCurrentSectionIndex(1);
      return;
    }

    if (
      currentQuestionIndex <
      surveyQuestions.length - 1
    ) {
      setCurrentQuestionIndex(
        currentQuestionIndex + 1
      );
    } else {
      setCurrentSectionIndex(
        currentSectionIndex + 1
      );
      setCurrentQuestionIndex(0);
    }
  };

  const handleBack = () => {
    if (currentSection.code === "CONSENT") return;

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(
        currentQuestionIndex - 1
      );
    } else {
      setCurrentSectionIndex(
        currentSectionIndex - 1
      );
      setCurrentQuestionIndex(0);
    }
  };
  console.log("All Sections:", sections);
console.log("Current Section:", currentSection);
console.log(
  "Filtered Questions:",
  questions.filter(q => q.sectionCode === currentSection.code)
);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Title */}
        <h2 style={styles.title}>
          SECTION {currentSection.code}:{" "}
          {currentSection.name}
        </h2>

        {/* Progress */}
        <div style={styles.progressWrapper}>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progressPercentage}%`,
              }}
            />
          </div>
        </div>

        {/* ================= CONSENT ================= */}
        {currentSection.code === "CONSENT" && (
          <>
            <div style={styles.questionBlock}>
              <p style={styles.questionTitle}>
                Interview Details
              </p>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleConsentChange}
                style={styles.input}
              />

              <input
                type="text"
                name="clinic"
                placeholder="Clinic Location"
                value={formData.clinic}
                onChange={handleConsentChange}
                style={styles.input}
              />

              <input
                type="text"
                name="interviewerId"
                placeholder="Interviewer ID"
                value={formData.interviewerId}
                onChange={handleConsentChange}
                style={styles.input}
              />

              <input
                type="text"
                name="participantId"
                placeholder="Participant ID"
                value={formData.participantId}
                onChange={handleConsentChange}
                style={styles.input}
              />
            </div>

            <div style={styles.questionBlock}>
              <p style={styles.questionTitle}>
                Informed Consent
              </p>

              <div style={styles.optionCard}>
                <input
                  type="checkbox"
                  name="consentGiven"
                  checked={formData.consentGiven}
                  onChange={handleConsentChange}
                  style={styles.checkbox}
                />
                <label>
                  Yes, I agree to participate
                </label>
              </div>
            </div>
          </>
        )}

        {/* ================= QUESTIONS ================= */}
        {currentSection.code !== "CONSENT" &&
          currentQuestion && (
            <div style={styles.questionBlock}>
             

              <h4 style={styles.questionTitle}>
                {currentQuestion.question}
              </h4>

              {currentQuestion.options.length >
              6 ? (
                <Select
                  options={currentQuestion.options.map(
                    (opt) => ({
                      value: opt,
                      label: opt,
                    })
                  )}
                  value={
                    answers[currentQuestion.index]
                      ? {
                          value:
                            answers[
                              currentQuestion.index
                            ],
                          label:
                            answers[
                              currentQuestion.index
                            ],
                        }
                      : null
                  }
                  onChange={(selected) =>
                    handleAnswerChange(
                      currentQuestion.index,
                      selected.value
                    )
                  }
                  isSearchable
                />
              ) : (
                currentQuestion.options.map(
                  (option, oIndex) => {
                    const isSelected =
                      answers[
                        currentQuestion.index
                      ] === option;

                    return (
                      <div
                        key={oIndex}
                        style={{
                          ...styles.optionCard,
                          backgroundColor:
                            isSelected
                              ? "#FFF8E1"
                              : "#ffffff",
                          border: isSelected
                            ? "1px solid #FFC107"
                            : "1px solid #f0f0f0",
                        }}
                        onClick={() =>
                          handleAnswerChange(
                            currentQuestion.index,
                            option
                          )
                        }
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          style={styles.checkbox}
                        />
                        <span>{option}</span>
                      </div>
                    );
                  }
                )
              )}
            </div>
          )}

        {/* Buttons */}
        <div style={styles.buttonContainer}>
          {currentSectionIndex > 0 && (
            <button
              style={{
                ...styles.button,
                backgroundColor: "#ccc",
                color: "#333",
              }}
              onClick={handleBack}
            >
              <IoArrowBack />
              Back
            </button>
          )}

          {currentSectionIndex <
          sections.length - 1 ? (
            <button
              style={{
                ...styles.button,
                backgroundColor:
                  currentSection.code ===
                    "CONSENT" &&
                  !isConsentValid
                    ? "#e0e0e0"
                    : "#FFC107",
                cursor:
                  currentSection.code ===
                    "CONSENT" &&
                  !isConsentValid
                    ? "not-allowed"
                    : "pointer",
              }}
              disabled={
                currentSection.code ===
                  "CONSENT" &&
                !isConsentValid
              }
              onClick={handleNext}
            >
              Next
              <IoArrowForward />
            </button>
          ) : (
            <button style={styles.button}>
              Submit
              <IoArrowForward />
            </button>
          )}
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
    width: "800px",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
    border: "1px solid #FFF3CD",
  },

  /* ===== Progress ===== */

  progressWrapper: {
    marginBottom: "25px",
  },

  progressBar: {
    height: "8px",
    backgroundColor: "#eee",
    borderRadius: "10px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#FFC107",
    transition: "0.3s ease",
  },

  /* ===== Titles ===== */

  description: {
    fontSize: "14px",
    color: "#6b5858",
    marginBottom: "20px",
  },

  /* ===== Question Block ===== */

  questionBlock: {
    marginBottom: "30px",
  },

  questionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#444",
  },

  rules: {
    marginLeft: "18px",
    color: "#8d7e7e",
    marginBottom: "8px",
  },

  strictrules: {
    fontSize: "12px",
    width: "60%",
    marginLeft: "18px",
    color: "#e85f5f",
  },

  /* ===== Inputs ===== */

  input: {
    width: "100%",
    padding: "12px 14px",
    marginBottom: "14px",
    borderRadius: "10px",
    border: "1px solid #e5e5e5",
    fontSize: "14px",
    outline: "none",
  },

  /* ===== Options ===== */

  optionCard: {
    display: "flex",
    alignItems: "center",
    padding: "12px 14px",
    borderRadius: "10px",
    marginBottom: "10px",
    cursor: "pointer",
    transition: "0.2s ease",
    border: "1px solid #f0f0f0",
  },

  checkbox: {
    marginRight: "12px",
    width: "18px",
    height: "18px",
    accentColor: "#E6B800",
  },

  /* ===== Buttons ===== */

  buttonContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "25px",
  },

  button: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#FFC107",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "16px",
    transition: "0.2s ease",
  },
  sectionLabel: {
  fontSize: "16px",
  color: "#6b5858",
  marginTop: "14px",
  marginBottom: "6px",
},

stepCount: {
  color: "#8d7e7e",
  fontWeight: "500",
},

title: {
  fontSize: "32px",   
  fontWeight: "700",
  marginBottom: "25px",
  color: "#2c2c2c",
},
};