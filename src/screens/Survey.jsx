import React, { useState } from "react";
import questions from "../data/questions.json";
import { IoArrowForward, IoArrowBack } from "react-icons/io5";
import Select from "react-select";

export default function MultiStepForm() {

  /* ================= BUILD SECTIONS ================= */

  const surveySections = Array.from(
    new Map(
      questions.map((q) => [
        q.sectionCode,
        { code: q.sectionCode, name: q.section }
      ])
    ).values()
  );

  const sections = [
    { code: "CONSENT", name: "Consent" },
    ...surveySections,
  ];

  /* ================= STATE ================= */

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const [formData, setFormData] = useState({
    date: "",
    clinic: "",
    interviewerId: "",
    participantId: "",
    consentGiven: false,
  });

  const currentSection = sections[currentSectionIndex];

  /* ================= SORT QUESTIONS ================= */

  const surveyQuestions = questions
    .map((q, index) => ({ ...q, index }))
    .filter((q) => q.sectionCode === currentSection.code)
    .sort((a, b) => {
      const getNum = (q) => {
        const match = q.question?.trim().match(/^(\d+)([a-z]?)/i);
        if (!match) return 0;

        const number = parseInt(match[1]);
        const letter = match[2] ? match[2].charCodeAt(0) : 0;

        return number * 100 + letter;
      };

      return getNum(a) - getNum(b);
    });

  const currentQuestion =
    surveyQuestions[currentQuestionIndex] || null;

  const progressPercentage =
    ((currentSectionIndex + 1) / sections.length) * 100;

  /* ================= HANDLERS ================= */

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

  const isLastQuestion =
    currentQuestionIndex === surveyQuestions.length - 1;

  const isLastSection =
    currentSectionIndex === sections.length - 1;

  const isConsentValid =
    formData.date &&
    formData.clinic &&
    formData.interviewerId &&
    formData.participantId &&
    formData.consentGiven;

  /* ================= NEXT ================= */

  const handleNext = () => {

    if (currentSection.code === "CONSENT") {
      setCurrentSectionIndex(1);
      return;
    }

    if (currentQuestionIndex < surveyQuestions.length - 1) {

      setCurrentQuestionIndex((prev) => prev + 1);

    } else if (currentSectionIndex < sections.length - 1) {

      setCurrentSectionIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);

    }
  };

  /* ================= BACK ================= */

  const handleBack = () => {

    if (currentSection.code === "CONSENT") return;

    if (currentQuestionIndex > 0) {

      setCurrentQuestionIndex((prev) => prev - 1);

    } else if (currentSectionIndex > 0) {

      setCurrentSectionIndex((prev) => prev - 1);
      setCurrentQuestionIndex(0);

    }
  };

  /* ================= UI ================= */

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.title}>
          SECTION {currentSection.code}: {currentSection.name}
        </h2>

        {/* ===== Progress ===== */}

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

            <div style={styles.optionCard}>
              <input
                type="checkbox"
                name="consentGiven"
                checked={formData.consentGiven}
                onChange={handleConsentChange}
                style={styles.checkbox}
              />
              <label>Yes, I agree to participate</label>
            </div>
          </>
        )}

        {/* ================= QUESTIONS ================= */}

        {currentSection.code !== "CONSENT" && currentQuestion && (

          <div style={styles.questionBlock}>

           
            {currentQuestion.note && (
              <p style={styles.note}>{currentQuestion.note}</p>
            )}
            {currentQuestion.rules && (
              <p style={styles.rules}>{currentQuestion.rules}</p>
            )}


            <h4 style={styles.questionTitle}>
              {currentQuestion.question}
            </h4>
            {currentQuestion.instruct && (
              <p style={styles.instruct}>{currentQuestion.instruct}</p>
            )}
 {currentQuestion.info && (
              <p style={styles.info}>{currentQuestion.info}</p>
            )}
            {/* ===== TEXT INPUT ===== */}

            {!currentQuestion.options && (

              <input
                type="text"
                placeholder="Type your answer"
                value={answers[currentQuestion.index] || ""}
                onChange={(e) =>
                  handleAnswerChange(
                    currentQuestion.index,
                    e.target.value
                  )
                }
                style={styles.input}
              />

            )}

            {/* ===== DROPDOWN ===== */}

            {currentQuestion.options &&
              currentQuestion.options.length > 6 && (

                <Select
                  options={currentQuestion.options.map((opt) => ({
                    value: opt,
                    label: opt,
                  }))}

                  value={
                    answers[currentQuestion.index]
                      ? {
                          value: answers[currentQuestion.index],
                          label: answers[currentQuestion.index],
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
              )}

            {/* ===== SMALL OPTIONS ===== */}

            {currentQuestion.options &&
              currentQuestion.options.length <= 6 &&
              currentQuestion.options.map((option, oIndex) => {

                const isSelected =
                  answers[currentQuestion.index] === option;

                return (
                  <div
                    key={oIndex}
                    style={{
                      ...styles.optionCard,
                      backgroundColor: isSelected
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
                      type="radio"
                      checked={isSelected}
                      readOnly
                      style={styles.checkbox}
                    />

                    <span>{option}</span>

                  </div>
                  
                );
              })}
          </div>
          
        )}
{currentQuestion?.optionrule && (
  <p style={styles.info}>{currentQuestion.optionrule}</p>
)}
        {/* ================= BUTTONS ================= */}

        <div style={styles.buttonContainer}>

          {currentSectionIndex > 0 && (

            <button
              style={{ ...styles.button, backgroundColor: "#ccc", color: "#333" }}
              onClick={handleBack}
            >
              <IoArrowBack /> Back
            </button>

          )}

          {!isLastSection || !isLastQuestion ? (

            <button
              style={{
                ...styles.button,
                backgroundColor:
                  currentSection.code === "CONSENT" && !isConsentValid
                    ? "#e0e0e0"
                    : "#FFC107",
              }}

              disabled={
                currentSection.code === "CONSENT" && !isConsentValid
              }

              onClick={handleNext}
            >
              Next <IoArrowForward />
            </button>

          ) : (

            <button style={styles.button}>
              Submit <IoArrowForward />
            </button>

          )}

        </div>

      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {

container:{
minHeight:"100vh",
background:"#fff",
display:"flex",
justifyContent:"center",
alignItems:"center",
padding:"40px"
},

card:{
width:"800px",
padding:"40px",
borderRadius:"20px",
boxShadow:"0 15px 40px rgba(0,0,0,0.08)"
},

title:{
fontSize:"30px",
fontWeight:"700",
marginBottom:"25px"
},

progressWrapper:{marginBottom:"20px"},

progressBar:{
height:"8px",
background:"#eee",
borderRadius:"10px"
},

progressFill:{
height:"100%",
background:"#FFC107"
},

questionBlock:{marginBottom:"30px"},

questionTitle:{
fontSize:"16px",
fontWeight:"600",
marginBottom:"12px"
},

input:{
width:"100%",
padding:"12px",
borderRadius:"10px",
border:"1px solid #e5e5e5",
marginBottom:"14px"
},

optionCard:{
display:"flex",
alignItems:"center",
padding:"12px",
borderRadius:"10px",
marginBottom:"10px",
cursor:"pointer",
border:"1px solid #f0f0f0"
},

checkbox:{
marginRight:"10px"
},

buttonContainer:{
display:"flex",
gap:"10px"
},

button:{
flex:1,
padding:"14px",
borderRadius:"12px",
border:"none",
background:"#FFC107",
color:"#fff",
fontWeight:"600",
cursor:"pointer"
},

info:{
fontSize:"14px",
color:"#e53935",
marginBottom:"8px",
fontWeight:"600"
},

note:{
fontSize:"14px",
color:"#d32f2f",
marginBottom:"10px",
fontStyle:"italic"
},
rules:{
  fontWeight:"bold"
}


};