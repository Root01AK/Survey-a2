import React, { useState } from "react";
import questions from "../data/questions.json";
import { IoArrowForward, IoArrowBack } from "react-icons/io5";
import { colorFill } from "ionicons/icons";

export default function Survey() {
  const [answers, setAnswers] = useState({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  // Unique sections
  const sections = [...new Set(questions.map((q) => q.section))];
  const currentSection = sections[currentSectionIndex];

  const handleChange = (qIndex, option) => {
    setAnswers({
      ...answers,
      [qIndex]: option,
    });
  };

  const currentQuestions = questions
    .map((q, index) => ({ ...q, index }))
    .filter((q) => q.section === currentSection);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{currentSection}</h2>
       <p style={styles.description}>
  {questions.find((q) => q.section === currentSection)?.description || ""}
</p>

        {currentQuestions.map((q) => (
          <div key={q.index} style={styles.questionBlock}>
            <h4 style={styles.questionTitle}>{q.question}</h4>
            {q.rules && <p style={styles.rules}>{q.rules}</p>}

            {q.options.map((option, oIndex) => {
              const isSelected = answers[q.index] === option;

              return (
                <div
                  key={oIndex}
                  style={{
                    ...styles.optionCard,
                    backgroundColor: isSelected ? "#FFF8E1" : "#ffffff",
                    border: isSelected
                      ? "1px solid #FFC107"
                      : "1px solid #f0f0f0",
                  }}
                  onClick={() => handleChange(q.index, option)}
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
            })}
             <p style={styles.strictrules}>{q.strictrules}</p>
          </div>
        ))}

        <div style={styles.buttonContainer}>
          {currentSectionIndex > 0 && (
            <button
              style={{ ...styles.button, backgroundColor: "#ccc", color: "#333" }}
              onClick={() =>
                setCurrentSectionIndex(currentSectionIndex - 1)
              }
            >
              <IoArrowBack />
              Back
            </button>
          )}

          {currentSectionIndex < sections.length - 1 ? (
            <button
              style={styles.button}
              onClick={() =>
                setCurrentSectionIndex(currentSectionIndex + 1)
              }
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
  title: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#333",
  },
  questionBlock: {
    marginBottom: "30px",
  },
  questionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#444",
  },
  optionCard: {
    display: "flex",
    alignItems: "center",
    padding: "12px 14px",
    borderRadius: "10px",
    marginBottom: "10px",
    cursor: "pointer",
    transition: "0.2s ease",
  },
  checkbox: {
    marginRight: "12px",
    width: "18px",
    height: "18px",
    accentColor: "#E6B800",
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
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
  },
  rules:{
    marginLeft: "18px",
    color: "#8d7e7e",
    
  },
  strictrules:{
    fontSize: "12px",
    width: "60%",
    marginLeft: "18px", 
    color: "#e85f5f",
  },
  description:{
    fontSize: "14px",
    color:"#6b5858",
  }
};