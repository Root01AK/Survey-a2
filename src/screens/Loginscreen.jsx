import React, { useState } from "react";
import { IoArrowForward } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const countryCodes = [
  "+1",
  "+7",
  "+20",
  "+27",
  "+30",
  "+31",
  "+32",
  "+33",
  "+34",
  "+36",
  "+39",
  "+40",
  "+41",
  "+43",
  "+44",
  "+45",
  "+46",
  "+47",
  "+48",
  "+49",
  "+51",
  "+52",
  "+53",
  "+54",
  "+55",
  "+56",
  "+57",
  "+58",
  "+60",
  "+61",
  "+62",
  "+63",
  "+64",
  "+65",
  "+66",
  "+81",
  "+82",
  "+84",
  "+86",
  "+90",
  "+91",
  "+92",
  "+93",
  "+94",
  "+95",
  "+98",
  "+211",
  "+212",
  "+213",
  "+216",
  "+218",
  "+220",
  "+221",
  "+222",
  "+223",
  "+224",
  "+225",
  "+226",
  "+227",
  "+228",
  "+229",
  "+230",
  "+231",
  "+232",
  "+233",
  "+234",
  "+235",
];

export default function PhoneLogin() {
  const navigate = useNavigate();

  const [country, setCountry] = useState("+91");
  const [phone, setPhone] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleLogin = () => {
    if (phone.length < 6) {
      alert("Enter valid phone number");
      return;
    }

    setShowOtp(true);
  };

  const verifyOtp = () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      alert("Enter valid OTP");
      return;
    }

    // OTP verified
    navigate("/dashboard");
  };

  return (
    <div style={styles.container}>
      {/* LOGIN SCREEN */}

      {!showOtp && (
        <div style={styles.card}>
          <h1 style={styles.title}>Login</h1>
          <p style={styles.subtitle}>Enter your phone number</p>

          <div style={styles.phoneWrapper}>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={styles.countryCode}
            >
              {countryCodes.map((code) => (
                <option key={code}>{code}</option>
              ))}
            </select>

            <input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              style={styles.phoneInput}
            />
          </div>

          <button style={styles.button} onClick={handleLogin}>
            <span style={styles.buttonContent}>
              Login
              <IoArrowForward />
            </span>
          </button>
        </div>
      )}

      {/* OTP FULL SCREEN */}

      {showOtp && (
        <div style={styles.otpScreen}>
          <div style={styles.otpCard}>
            <h2 style={{ marginBottom: "10px" }}>Enter OTP</h2>

            <p style={{ color: "#777", marginBottom: "25px" }}>
              OTP sent to {country} {phone}
            </p>

            <div style={styles.otpBoxes}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  style={styles.otpBox}
                />
              ))}
            </div>

            <button style={styles.button} onClick={verifyOtp}>
              Verify OTP
            </button>

            <p
              style={{ marginTop: "15px", cursor: "pointer", color: "#FFC107" }}
              onClick={() => setShowOtp(false)}
            >
              Change Number
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#ffffff,#FFF8E1)",
    fontFamily: "Poppins",
  },

  card: {
    width: "400px",
    padding: "50px",
    borderRadius: "22px",
    background: "#fff",
    textAlign: "center",
    boxShadow: "0 25px 60px rgba(0,0,0,0.08)",
  },

  title: {
    fontSize: "30px",
    marginBottom: "10px",
  },

  subtitle: {
    marginBottom: "30px",
    color: "#777",
  },

  phoneWrapper: {
    display: "flex",
    border: "2px solid #eee",
    borderRadius: "12px",
    overflow: "hidden",
    marginBottom: "25px",
  },

  countryCode: {
    border: "none",
    padding: "14px",
    fontSize: "15px",
    background: "#fafafa",
    outline: "none",
    borderRight: "1px solid #eee",
    cursor: "pointer",
  },

  phoneInput: {
    flex: 1,
    border: "none",
    padding: "14px",
    fontSize: "16px",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "14px",
    background: "#FFC107",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    color: "#fff",
  },

  buttonContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
  },

  /* OTP SCREEN */

  otpScreen: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg,#ffffff,#FFF8E1)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  otpCard: {
    width: "380px",
    padding: "40px",
    borderRadius: "20px",
    background: "#fff",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
  },

  otpBoxes: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "25px",
  },

  otpBox: {
    width: "50px",
    height: "55px",
    fontSize: "22px",
    textAlign: "center",
    border: "2px solid #eee",
    borderRadius: "10px",
    outline: "none",
  },
};
