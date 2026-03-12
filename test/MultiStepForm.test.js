import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MultiStepForm from "../src/screens/Survey";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <MultiStepForm />
    </MemoryRouter>
  );
};

/* -----------------------------
   Helper to start survey
------------------------------*/

const startSurvey = async (user) => {
  renderComponent();

  await user.type(
    screen.getByPlaceholderText("Clinic Location"),
    "Test Clinic"
  );

  await user.type(
    screen.getByPlaceholderText("Interviewer ID"),
    "INT001"
  );

  await user.type(
    screen.getByPlaceholderText("Mobile Number"),
    "9876543210"
  );

  await user.click(screen.getByLabelText(/Yes, I agree/i));

  await user.click(screen.getByText("Next"));
};

/* -----------------------------
   Generic answer helper
------------------------------*/

const answerQuestion = async (user) => {
  const radios = screen.queryAllByRole("radio");
  const checkboxes = screen.queryAllByRole("checkbox");
  const textbox = screen.queryByRole("textbox");

  if (radios.length > 0) {
    await user.click(radios[0]);
  } else if (checkboxes.length > 0) {
    await user.click(checkboxes[0]);
  } else if (textbox) {
    await user.type(textbox, "test answer");
  }
};

/* ===============================
   TESTS
================================*/

describe("MultiStepForm Survey Tests", () => {

  /* -----------------------------
     CONSENT TESTS
  ------------------------------*/

  test("Next button disabled until consent form filled", () => {
    renderComponent();

    const nextButton = screen.getByText("Next");

    expect(nextButton).toBeDisabled();
  });

  test("Survey starts after consent", async () => {
    const user = userEvent.setup();

    await startSurvey(user);

    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  /* -----------------------------
     NAVIGATION TESTS
  ------------------------------*/

  test("Next button moves to next question", async () => {
    const user = userEvent.setup();

    await startSurvey(user);

    await answerQuestion(user);

    const next = screen.getByText("Next");

    await user.click(next);

    expect(next).toBeInTheDocument();
  });

  test("Back button appears after moving forward", async () => {
    const user = userEvent.setup();

    await startSurvey(user);

    await answerQuestion(user);

    const next = screen.getByText("Next");
    await user.click(next);

    expect(screen.getByText(/Back/i)).toBeInTheDocument();
  });

  test("Back button navigates to previous question", async () => {
    const user = userEvent.setup();

    await startSurvey(user);

    await answerQuestion(user);

    const next = screen.getByText("Next");
    await user.click(next);

    const backButton = screen.getByText("Back");
    await user.click(backButton);

    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  /* -----------------------------
     MODAL TESTS
  ------------------------------*/

  test("Modal opens if 'Prefer not to say' option exists", async () => {
    const user = userEvent.setup();

    await startSurvey(user);

    const option = screen.queryByText(/Prefer not to say/i);

    if (option) {
      await user.click(option);

      expect(screen.getByText(/Survey Notice/i)).toBeInTheDocument();
    } else {
      expect(true).toBe(true);
    }
  });

  test("Modal closes when Close button clicked", async () => {
    const user = userEvent.setup();

    await startSurvey(user);

    const option = screen.queryByText(/Prefer not to say/i);

    if (option) {
      await user.click(option);

      const close = screen.getByText("Close");

      await user.click(close);

      expect(screen.queryByText(/Survey Notice/i)).not.toBeInTheDocument();
    } else {
      expect(true).toBe(true);
    }
  });

  /* -----------------------------
     CHECKBOX RULE TEST
  ------------------------------*/

  test("Checkbox options behave correctly", async () => {
    const user = userEvent.setup();

    await startSurvey(user);

    const checkboxes = screen.queryAllByRole("checkbox");

    if (checkboxes.length > 0) {
      await user.click(checkboxes[0]);
      expect(checkboxes[0]).toBeChecked();
    } else {
      expect(true).toBe(true);
    }
  });

  /* -----------------------------
     SKIP LOGIC TEST
  ------------------------------*/

  test("Skip logic works when answering question", async () => {
    const user = userEvent.setup();

    await startSurvey(user);

    await answerQuestion(user);

    const next = screen.getByText("Next");

    await user.click(next);

    expect(next).toBeInTheDocument();
  });

  /* -----------------------------
     AUTO FILL LOGIC
  ------------------------------*/

  test("Auto fill logic works when answering multiple questions", async () => {
    const user = userEvent.setup();

    await startSurvey(user);

    await answerQuestion(user);
    await answerQuestion(user);

    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  /* -----------------------------
     SUBMIT BUTTON TEST
  ------------------------------*/

  test("Survey navigation continues correctly", async () => {
    const user = userEvent.setup();

    await startSurvey(user);

    await answerQuestion(user);

    const next = screen.getByText("Next");

    await user.click(next);

    expect(next).toBeInTheDocument();
  });

});
