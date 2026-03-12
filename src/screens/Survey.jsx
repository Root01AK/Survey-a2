import React, { useState, useEffect } from "react";
import questions from "../data/questions.json";
import { IoArrowForward, IoArrowBack } from "react-icons/io5";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
export default function MultiStepForm() {
  /* ================= BUILD SECTIONS ================= */
  const navigate = useNavigate();
  const surveySections = Array.from(
    new Map(
      questions.map((q) => [
        q.sectionCode,
        { code: q.sectionCode, name: q.section },
      ]),
    ).values(),
  );

  const sections = [{ code: "CONSENT", name: "Consent" }, ...surveySections];
  const [modal, setModal] = useState({
    open: false,
    message: "",
    exitSurvey: false,
  });

  
  /* ================= STATE ================= */

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const today = new Date().toISOString().split("T")[0];
  const [showOtp, setShowOtp] = useState(false);
  const [showSectionIntro, setShowSectionIntro] = useState(true);

  const [formData, setFormData] = useState({
    date: today,
    clinic: "",
    interviewerId: "",
    mobile: "",
    otp: "",
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

  /* NEW: detect current subsection */

  const currentSubSection = surveyQuestions[currentQuestionIndex]?.section;

  const currentQuestion = surveyQuestions[currentQuestionIndex] || null;

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
    if (currentQuestionIndex === 0 && currentSection.code === "A") {
      if (option === "Less than 18") {
        setModal({
          open: true,
          message:
            "Thank you for your interest in participating in this survey. Unfortunately, this study is only for individuals aged 18 and above. We hope to meet you again once you turn 18.",
          exitSurvey: true,
        });
        return;
      }

      if (option === "Prefer not to say") {
        setModal({
          open: true,
          message:
            "Survey Information: This survey collects migration history data for research purposes. Participation is voluntary and responses remain confidential.",
          exitSurvey: false,
        });
      }
    }

    const newAnswers = {
      ...answers,
      [qIndex]: option,
    };

    /* -------- AUTO FILL Q6 -------- */

    const q4 = questions.find((q) => q.question.startsWith("4."));
    const q5 = questions.find((q) => q.question.startsWith("5."));
    const q6 = questions.find((q) => q.question.startsWith("6."));

    if (
      q4 &&
      q5 &&
      q6 &&
      newAnswers[q4.index] !== undefined &&
      newAnswers[q5.index] !== undefined &&
      newAnswers[q4.index] === newAnswers[q5.index]
    ) {
      newAnswers[q6.index] =
        "Yes, I live where I was born (Skip to question 8)";
    }

    setAnswers(newAnswers);
  };
  const isLastQuestion = currentQuestionIndex === surveyQuestions.length - 1;

  const isLastSection = currentSectionIndex === sections.length - 1;

  const isConsentValid =
    formData.date &&
    formData.clinic &&
    formData.interviewerId &&
    formData.mobile &&
    formData.consentGiven;

  /* ================= NEXT ================= */

  const handleNext = () => {
    if (showSectionIntro && currentSection.code !== "CONSENT") {
  setShowSectionIntro(false);
  return;
}
    if (currentSection.code === "CONSENT") {
      setCurrentSectionIndex(1);
      return;
    }
    const q93Index = surveyQuestions.findIndex((q) =>
      q.question.startsWith("93."),
    );

    const q4 = surveyQuestions.find((q) => q.question.startsWith("4."));
    const q5 = surveyQuestions.find((q) => q.question.startsWith("5."));
    const q8Index = surveyQuestions.findIndex((q) =>
      q.question.startsWith("8."),
    );

    const q4Answer = answers[q4?.index];
    const q5Answer = answers[q5?.index];

    /* RULE 1: If Q4 = Q5 skip to Q8 */

    if (
      currentQuestion.question.startsWith("5.") &&
      q4Answer &&
      q5Answer &&
      q4Answer === q5Answer
    ) {
      setCurrentQuestionIndex(q8Index);
      return;
    }

    /* RULE 2: If Q6 = Yes OR Prefer not to say → skip to Q8 */

    if (
      currentQuestion.question.startsWith("6.") &&
      (answers[currentQuestion.index]?.includes("Yes") ||
        answers[currentQuestion.index]?.includes("Prefer not to say"))
    ) {
      setCurrentQuestionIndex(q8Index);
      return;
    }
    /* RULE 3: If Q14 = No skip to Section C */

    if (
      currentQuestion.question.startsWith("14.") &&
      answers[currentQuestion.index] === "No"
    ) {
      const sectionCIndex = sections.findIndex((s) => s.code === "C");

      if (sectionCIndex !== -1) {
        setCurrentSectionIndex(sectionCIndex);
        setCurrentQuestionIndex(0);
        return;
      }
    }
    /* RULE 4: If Q21 = No, never → skip next 2 questions */

    if (
      currentQuestion?.question?.startsWith("21.") &&
      answers[currentQuestion.index] === "No, never"
    ) {
      const nextIndex = currentQuestionIndex + 3;

      if (nextIndex < surveyQuestions.length) {
        setCurrentQuestionIndex(nextIndex);
      } else if (currentSectionIndex < sections.length - 1) {
        setCurrentSectionIndex((prev) => prev + 1);
        setCurrentQuestionIndex(0);
      }

      return;
    }
    /* RULE 5: If ALL Q23–Q27 = 'No' or 'Prefer not to say', skip Q28 */

    const q23 = surveyQuestions.find((q) => q.question.startsWith("23."));
    const q24 = surveyQuestions.find((q) => q.question.startsWith("24."));
    const q25 = surveyQuestions.find((q) => q.question.startsWith("25."));
    const q26 = surveyQuestions.find((q) => q.question.startsWith("26."));
    const q27 = surveyQuestions.find((q) => q.question.startsWith("27."));
    const q29Index = surveyQuestions.findIndex((q) =>
      q.question.startsWith("29."),
    );

    const values = [
      answers[q23?.index],
      answers[q24?.index],
      answers[q25?.index],
      answers[q26?.index],
      answers[q27?.index],
    ];

    const allNo = values.every((v) => v === "No" || v === "Prefer not to say");

    if (
      currentQuestion?.question?.startsWith("27.") &&
      allNo &&
      q29Index !== -1
    ) {
      setCurrentQuestionIndex(q29Index);
      return;
    }
    /* RULE 6: If ALL Q29–Q38 = 'No' or 'Prefer not to say', skip Q39 */

    const q29 = surveyQuestions.find((q) => q.question.startsWith("29."));
    const q30 = surveyQuestions.find((q) => q.question.startsWith("30."));
    const q31 = surveyQuestions.find((q) => q.question.startsWith("31."));
    const q32 = surveyQuestions.find((q) => q.question.startsWith("32."));
    const q33 = surveyQuestions.find((q) => q.question.startsWith("33."));
    const q34 = surveyQuestions.find((q) => q.question.startsWith("34."));
    const q35 = surveyQuestions.find((q) => q.question.startsWith("35."));
    const q36 = surveyQuestions.find((q) => q.question.startsWith("36."));
    const q37 = surveyQuestions.find((q) => q.question.startsWith("37."));
    const q38 = surveyQuestions.find((q) => q.question.startsWith("38."));

    const q40Index = surveyQuestions.findIndex((q) =>
      q.question.startsWith("40."),
    );

    const values29to38 = [
      answers[q29?.index],
      answers[q30?.index],
      answers[q31?.index],
      answers[q32?.index],
      answers[q33?.index],
      answers[q34?.index],
      answers[q35?.index],
      answers[q36?.index],
      answers[q37?.index],
      answers[q38?.index],
    ];

    const allNo29to38 = values29to38.every(
      (v) => v === "No" || v === "Prefer not to say",
    );

    if (
      currentQuestion?.question?.startsWith("38.") &&
      allNo29to38 &&
      q40Index !== -1
    ) {
      setCurrentQuestionIndex(q40Index);
      return;
    }
    /* RULE 7: If ALL Q42–Q48 = 'No' or 'Prefer not to say', skip Q49 */

    const q42 = surveyQuestions.find((q) => q.question.startsWith("42."));
    const q43 = surveyQuestions.find((q) => q.question.startsWith("43."));
    const q44 = surveyQuestions.find((q) => q.question.startsWith("44."));
    const q45 = surveyQuestions.find((q) => q.question.startsWith("45."));
    const q46 = surveyQuestions.find((q) => q.question.startsWith("46."));
    const q47 = surveyQuestions.find((q) => q.question.startsWith("47."));
    const q48 = surveyQuestions.find((q) => q.question.startsWith("48."));

    const q50Index = surveyQuestions.findIndex((q) =>
      q.question.startsWith("50."),
    );

    const values42to48 = [
      answers[q42?.index],
      answers[q43?.index],
      answers[q44?.index],
      answers[q45?.index],
      answers[q46?.index],
      answers[q47?.index],
      answers[q48?.index],
    ];

    const allNo42to48 = values42to48.every(
      (v) => v === "No" || v === "Prefer not to say",
    );

    if (
      currentQuestion?.question?.startsWith("48.") &&
      allNo42to48 &&
      q50Index !== -1
    ) {
      setCurrentQuestionIndex(q50Index);
      return;
    }
    /* RULE 8: If ALL Q50–Q54 = 'No' or 'Prefer not to say', skip Q55 */

    const q50 = surveyQuestions.find((q) => q.question.startsWith("50."));
    const q51 = surveyQuestions.find((q) => q.question.startsWith("51."));
    const q52 = surveyQuestions.find((q) => q.question.startsWith("52."));
    const q53 = surveyQuestions.find((q) => q.question.startsWith("53."));
    const q54 = surveyQuestions.find((q) => q.question.startsWith("54."));

    const q56Index = surveyQuestions.findIndex((q) =>
      q.question.startsWith("56."),
    );

    const values50to54 = [
      answers[q50?.index],
      answers[q51?.index],
      answers[q52?.index],
      answers[q53?.index],
      answers[q54?.index],
    ];

    const allNo50to54 = values50to54.every(
      (v) => v === "No" || v === "Prefer not to say",
    );

    if (
      currentQuestion?.question?.startsWith("54.") &&
      allNo50to54 &&
      q56Index !== -1
    ) {
      setCurrentQuestionIndex(q56Index);
      return;
    }
    /* RULE 9: If Q57 = No → skip to Q60 */

    const q60Index = surveyQuestions.findIndex((q) =>
      q.question.startsWith("60."),
    );

    if (
      currentQuestion?.question?.startsWith("57.") &&
      answers[currentQuestion.index]?.trim() === "No" &&
      q60Index !== -1
    ) {
      setCurrentQuestionIndex(q60Index);
      return;
    }
    /* RULE 11: If Q88 = 'None' → skip to Q93 */

    if (
      currentQuestion?.question?.startsWith("88.") &&
      answers[currentQuestion.index]?.includes("None") &&
      q93Index !== -1
    ) {
      setCurrentQuestionIndex(q93Index);
      return;
    }
    /* RULE 12: If Q90 = 'No, never' → skip to Q91 */

    const q91Index = surveyQuestions.findIndex((q) =>
      q.question.startsWith("91."),
    );

    if (
      currentQuestion?.question?.startsWith("90.") &&
      answers[currentQuestion.index]?.includes("No, never") &&
      q91Index !== -1
    ) {
      setCurrentQuestionIndex(q91Index);
      return;
    }
    /* RULE 14: If Q91 = 'No, never' → skip to Q93 */

    if (
      currentQuestion?.question?.startsWith("91.") &&
      answers[currentQuestion.index]?.includes("No, never") &&
      q93Index !== -1
    ) {
      setCurrentQuestionIndex(q93Index);
      return;
    }
    /* RULE: If Q93 = 'No' → skip to Section E */

    const sectionEIndex = sections.findIndex((s) => s.code === "E");

    if (
      currentQuestion?.question?.startsWith("93.") &&
      answers[currentQuestion.index]?.includes("No") &&
      sectionEIndex !== -1
    ) {
      setCurrentSectionIndex(sectionEIndex);
      setCurrentQuestionIndex(0);
      return;
    }
    /* RULE: If Q101 = 'No' → skip to Q103 */

    const q103Index = surveyQuestions.findIndex((q) =>
      q.question.startsWith("103."),
    );

    if (
      currentQuestion?.question?.startsWith("101.") &&
      answers[currentQuestion.index]?.includes("No") &&
      q103Index !== -1
    ) {
      setCurrentQuestionIndex(q103Index);
      return;
    }
    /* RULE: If Q103 = 'No' → skip to Q105 */

    const q105Index = surveyQuestions.findIndex((q) =>
      q.question.startsWith("105."),
    );

    if (
      currentQuestion?.question?.startsWith("103.") &&
      answers[currentQuestion.index]?.includes("No") &&
      q105Index !== -1
    ) {
      setCurrentQuestionIndex(q105Index);
      return;
    }
    /* RULE: If Q106 = 'Not applicable' OR 'No, not interested' → skip to Section G */

    const sectionGIndex = sections.findIndex((s) => s.code === "G");

    if (
      currentQuestion?.question?.startsWith("106.") &&
      (answers[currentQuestion.index]?.includes("Not applicable") ||
        answers[currentQuestion.index]?.includes("No, not interested")) &&
      sectionGIndex !== -1
    ) {
      setCurrentSectionIndex(sectionGIndex);
      setCurrentQuestionIndex(0);
      return;
    }
    /* RULE: If Q107 = 'No, none know' → skip to Q108 */

    const q108Index = surveyQuestions.findIndex((q) =>
      q.question.startsWith("108."),
    );

    if (
      currentQuestion?.question?.startsWith("107.") &&
      answers[currentQuestion.index]?.includes("No, none know") &&
      q108Index !== -1
    ) {
      setCurrentQuestionIndex(q108Index);
      return;
    }
    /* RULE: If Q108 = 'None' → skip to Q110 */

    const q110Index = surveyQuestions.findIndex((q) =>
      q.question.startsWith("110."),
    );

    if (
      currentQuestion?.question?.startsWith("108.") &&
      answers[currentQuestion.index]?.includes("None") &&
      q110Index !== -1
    ) {
      setCurrentQuestionIndex(q110Index);
      return;
    }
    /* RULE: If Q114 = 'No' → skip to Q115 */

    const q115Index = surveyQuestions.findIndex((q) =>
      q.question.startsWith("115."),
    );

    if (
      currentQuestion?.question?.startsWith("114.") &&
      answers[currentQuestion.index]?.includes("No") &&
      q115Index !== -1
    ) {
      setCurrentQuestionIndex(q115Index);
      return;
    }
    /* RULE: If Q115 = 'No' → skip to Q116 */

    const q116Index = surveyQuestions.findIndex((q) =>
      q.question.startsWith("116."),
    );

    if (
      currentQuestion?.question?.startsWith("115.") &&
      answers[currentQuestion.index]?.includes("No") &&
      q116Index !== -1
    ) {
      setCurrentQuestionIndex(q116Index);
      return;
    }
    /* RULE: If Q116 = 'No' → skip to Q117 */

    const q117Index = surveyQuestions.findIndex((q) =>
      q.question.startsWith("117."),
    );

    if (
      currentQuestion?.question?.startsWith("116.") &&
      answers[currentQuestion.index]?.includes("No") &&
      q117Index !== -1
    ) {
      setCurrentQuestionIndex(q117Index);
      return;
    }
    /* RULE: If Q122 = 'No, not interested' → skip to Closing Questions section */

    const closingSectionIndex = sections.findIndex(
      (s) => s.name === "Closing Questions",
    );

    if (
      currentQuestion?.question?.startsWith("122.") &&
      answers[currentQuestion.index]?.includes("No, not interested") &&
      closingSectionIndex !== -1
    ) {
      setCurrentSectionIndex(closingSectionIndex);
      setCurrentQuestionIndex(0);
      return;
    }
    /* RULE: If Q55 = Yes → At least one of Q60–Q69 must be Yes */

    const q55 = surveyQuestions.find((q) => q.question.startsWith("55."));

    const q60 = surveyQuestions.find((q) => q.question.startsWith("60."));
    const q61 = surveyQuestions.find((q) => q.question.startsWith("61."));
    const q62 = surveyQuestions.find((q) => q.question.startsWith("62."));
    const q63 = surveyQuestions.find((q) => q.question.startsWith("63."));
    const q64 = surveyQuestions.find((q) => q.question.startsWith("64."));
    const q65 = surveyQuestions.find((q) => q.question.startsWith("65."));
    const q66 = surveyQuestions.find((q) => q.question.startsWith("66."));
    const q67 = surveyQuestions.find((q) => q.question.startsWith("67."));
    const q68 = surveyQuestions.find((q) => q.question.startsWith("68."));
    const q69 = surveyQuestions.find((q) => q.question.startsWith("69."));

    const responses60to69 = [
      answers[q60?.index],
      answers[q61?.index],
      answers[q62?.index],
      answers[q63?.index],
      answers[q64?.index],
      answers[q65?.index],
      answers[q66?.index],
      answers[q67?.index],
      answers[q68?.index],
      answers[q69?.index],
    ];

    const hasYes = responses60to69.some((v) => v === "Yes");

    if (
      q55 &&
      answers[q55.index] === "Yes" &&
      !hasYes &&
      currentQuestion?.question?.startsWith("69.")
    ) {
      setModal({
        open: true,
        message:
          "Since Q55 = Yes, at least one question from Q60 to Q69 must have a 'Yes' response.",
        exitSurvey: false,
      });
      return;
    }

    /* NORMAL FLOW */

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

  const handleCheckboxChange = (qIndex, option) => {
    const prev = answers[qIndex] || [];

    const exclusiveOptions = ["I don't have anal sex", "Prefer not to say"];

    let updated;

    // If an exclusive option is selected
    if (exclusiveOptions.includes(option)) {
      updated = [option];
    } else {
      // Remove exclusive options first
      const filtered = prev.filter((v) => !exclusiveOptions.includes(v));

      if (filtered.includes(option)) {
        // Uncheck if already selected
        updated = filtered.filter((v) => v !== option);
      } else {
        // Add new option
        updated = [...filtered, option];
      }
    }

    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [qIndex]: updated,
    }));
  };
  
useEffect(() => {
  setShowSectionIntro(true);
}, [currentSectionIndex]);
  /* ================= UI ================= */

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.card,
          width: currentSection.code === "CONSENT" ? "400px" : "800px",
        }}
      >
        {!showSectionIntro && (
  <h2>
    SECTION {currentSection.code}: {currentSubSection}
  </h2>
)}

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
              <label style={styles.label}>Date</label>
              <input
                type="text"
                name="date"
                value={new Date().toLocaleDateString("en-GB")}
                readOnly
                style={styles.input}
              />
              <label style={styles.label}>Clinic Location</label>
              <input
                type="text"
                name="clinic"
                placeholder="Clinic Location"
                value={formData.clinic}
                onChange={handleConsentChange}
                style={styles.input}
              />
              <label style={styles.label}>Interviewer ID</label>
              <input
                type="text"
                name="interviewerId"
                placeholder="Interviewer ID"
                value={formData.interviewerId}
                onChange={handleConsentChange}
                style={styles.input}
              />
              <label style={styles.label}>Participant Mobile Number</label>

              <div style={styles.mobileContainer}>
                <div style={styles.mobileInputWrapper}>
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleConsentChange}
                    style={styles.countryPicker}
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                  </select>

                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Mobile Number"
                    value={formData.mobile}
                    onChange={handleConsentChange}
                    style={styles.mobileInput}
                  />
                </div>

                {!showOtp && (
                  <button
                    style={styles.otpButton}
                    onClick={() => setShowOtp(true)}
                  >
                    Get OTP
                  </button>
                )}
              </div>
              {showOtp && (
                <>
                  <label style={styles.otplabel}>Enter OTP</label>

                  <div style={styles.otpRow}>
                    <input
                      type="text"
                      name="otp"
                      placeholder="Enter OTP"
                      value={formData.otp}
                      onChange={handleConsentChange}
                      style={styles.otpInput}
                    />

                    <button style={styles.verifyButton}>Verify</button>
                  </div>
                </>
              )}
            </div>

            <div style={styles.optionCard}>
              <input
                id="consent"
                type="checkbox"
                name="consentGiven"
                checked={formData.consentGiven}
                onChange={handleConsentChange}
                style={styles.checkbox}
              />

              <label htmlFor="consent">Yes, I agree to participate</label>
            </div>
          </>
        )}

        {/* ================= QUESTIONS ================= */}

  
{/* ===== SECTION INTRO PAGE ===== */}

{currentSection.code !== "CONSENT" && showSectionIntro && (
  <div style={{ marginBottom: "30px" }}>
    <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#2f5597" }}>
      {currentSubSection}
    </h2>

   {currentQuestion?.description && (
      <p style={{ marginTop: "10px", color: "#555", lineHeight: "1.6" }}>
        {currentQuestion.description}
      </p>
    )}

    {currentQuestion?.note && (
      <p style={{ marginTop: "10px", fontStyle: "italic" }}>
        {currentQuestion.note}
      </p>
    )}
  </div>
)}

{/* ===== QUESTIONS ===== */}

{currentSection.code !== "CONSENT" && !showSectionIntro && currentQuestion && (
  <div style={styles.questionBlock}>
            {currentQuestion.note && (
              <p style={styles.note}>{currentQuestion.note}</p>
            )}
            {currentQuestion.rules && (
              <p style={styles.rules}>{currentQuestion.rules}</p>
            )}

            <h4 style={styles.questionTitle}>{currentQuestion.question}</h4>
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
                  handleAnswerChange(currentQuestion.index, e.target.value)
                }
                style={styles.input}
              />
            )}

            {/* ===== DROPDOWN ===== */}

            {currentQuestion.options && currentQuestion.options.length > 6 && (
              <Select
                options={currentQuestion.options.map((opt) => ({
                  value: opt.text,
                  label: (
                    <div style={styles.dropdownRow}>
                      <span>{opt.text}</span>
                      <span style={styles.optionCode}>{opt.code}</span>
                    </div>
                  ),
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
                  handleAnswerChange(currentQuestion.index, selected.value)
                }
                isSearchable
              />
            )}

            {/* ===== SMALL OPTIONS ===== */}

            {currentQuestion.options &&
              currentQuestion.options.length <= 6 &&
              currentQuestion.options.map((option, oIndex) => {
                const selected = Array.isArray(answers[currentQuestion.index])
                  ? answers[currentQuestion.index]
                  : [];

                const isCheckbox = currentQuestion.type === "checkbox";

                const isSelected = isCheckbox
                  ? selected.includes(option)
                  : answers[currentQuestion.index] === option.text;

                const exclusiveOptions = [
                  "I don't have anal sex",
                  "Prefer not to say",
                ];

                const selectedExclusive = selected.find((v) =>
                  exclusiveOptions.includes(v),
                );

                let disabled = false;

                if (isCheckbox) {
                  // If exclusive option selected → disable everything else
                  if (selectedExclusive) {
                    disabled = option !== selectedExclusive;
                  }

                  // If normal option selected → disable exclusive options
                  if (
                    !selectedExclusive &&
                    selected.length > 0 &&
                    exclusiveOptions.includes(option)
                  ) {
                    disabled = true;
                  }
                }

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
                    onClick={() =>
                      isCheckbox
                        ? handleCheckboxChange(currentQuestion.index, option)
                        : handleAnswerChange(currentQuestion.index, option.text)
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <input
                        type={isCheckbox ? "checkbox" : "radio"}
                        checked={isSelected}
                        disabled={disabled}
                        readOnly
                        style={styles.checkbox}
                      />

                      <span style={{ flex: 1 }}>{option.text}</span>

                      <span style={styles.optionCode}>{option.code}</span>
                    </div>
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
              style={{
                ...styles.button,
                backgroundColor: "#ccc",
                color: "#333",
              }}
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
              disabled={currentSection.code === "CONSENT" && !isConsentValid}
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

      {/* Model */}

      {modal.open && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3 style={styles.modalTitle}>Survey Notice</h3>

            <p style={styles.modalText}>{modal.message}</p>

            <button
              style={styles.modalButton}
              onClick={() => {
                if (modal.exitSurvey) {
                  navigate("/dashboard");
                } else {
                  setModal({
                    open: false,
                    message: "",
                    exitSurvey: false,
                  }); // just close popup
                }
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    minHeight: "100vh",
    background: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
  },

  card: {
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
  },

  title: {
    fontSize: "30px",
    fontWeight: "700",
    marginBottom: "25px",
  },

  progressWrapper: { marginBottom: "20px" },

  progressBar: {
    height: "8px",
    background: "#eee",
    borderRadius: "10px",
  },

  progressFill: {
    height: "100%",
    background: "#FFC107",
  },

  questionBlock: { marginBottom: "30px" },

  questionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "12px",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #e5e5e5",
    marginBottom: "14px",
  },

  optionCard: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "10px",
    cursor: "pointer",
    border: "1px solid #f0f0f0",
  },

  checkbox: {
    marginRight: "10px",
    transform: "scale(1.5)",
    cursor: "pointer",
  },

  buttonContainer: {
    display: "flex",
    gap: "10px",
  },

  button: {
    flex: 1,
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "#FFC107",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },

  info: {
    fontSize: "14px",
    color: "#e53935",
    marginBottom: "8px",
    fontWeight: "600",
  },

  note: {
    fontSize: "14px",
    color: "#d32f2f",
    marginBottom: "10px",
    fontStyle: "italic",
  },
  rules: {
    fontWeight: "bold",
  },
  mobileContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  mobileInputWrapper: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #e5e5e5",
    borderRadius: "12px",
    padding: "0 12px",
    height: "48px",
    flex: 1,
    background: "#fff",
  },

  countryPicker: {
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "14px",
    fontWeight: "500",
    marginRight: "8px",
    cursor: "pointer",
  },

  mobileInput: {
    border: "none",
    outline: "none",
    flex: 1,
    fontSize: "15px",
  },
  otpRow: {
    display: "flex",
    gap: "10px",
    marginTop: "12px",
  },

  otpInput: {
    flex: 1,
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #ddd",
  },

  otpButton: {
    background: "#FFC107",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    color: "white",
  },

  verifyButton: {
    background: "#28a745",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "6px",
    display: "block",
    color: "#333",
  },
  otplabel: {
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "6px",
    display: "block",
    color: "#333",
    marginTop: "10px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  modalBox: {
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    width: "420px",
    textAlign: "center",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
  },

  modalTitle: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "10px",
  },

  modalText: {
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#555",
    marginBottom: "20px",
  },

  modalButton: {
    background: "#FFC107",
    border: "none",
    padding: "12px 25px",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
  },
  optionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginLeft: "10px",
  },
  optionCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px",
  },
  optionCode: {
    color: "#777",
    fontWeight: "600",
  },
  dropdownRow: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
};
