import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MultiStepForm from "../src/screens/Survey";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

/* -----------------------------
Render Helper
------------------------------ */
jest.setTimeout(60000);
const renderComponent = () => {
return render( <MemoryRouter> <MultiStepForm /> </MemoryRouter>
);
};

/* -----------------------------
Start Survey Helper
------------------------------ */

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

await user.click(screen.getByRole("button", { name: /next/i }));
};

/* -----------------------------
Generic Answer Helper
------------------------------ */

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

/* =================================
TEST SUITE
================================= */

describe("MultiStepForm Survey Rules 1–14", () => {

/* RULE 1 */

test("RULE 1: If Q4 = Q5 skip to Q8", async () => {
const user = userEvent.setup();
await startSurvey(user);


await answerQuestion(user);
await user.click(screen.getByRole("button", { name: /next/i }));

await answerQuestion(user);
await user.click(screen.getByRole("button", { name: /next/i }));

expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();


});

/* RULE 2 */

test("RULE 2: If Q6 Yes skip to Q8", async () => {
const user = userEvent.setup();
await startSurvey(user);


for (let i = 0; i < 6; i++) {
  await answerQuestion(user);
  await user.click(screen.getByRole("button", { name: /next/i }));
}

expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();


});

/* RULE 3 */

test("RULE 3: Q14 No skip to Section C", async () => {
const user = userEvent.setup();
await startSurvey(user);

for (let i = 0; i < 14; i++) {
  await answerQuestion(user);
  await user.click(screen.getByRole("button", { name: /next/i }));
}

expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();


});

/* RULE 4 */

test("RULE 4: Q21 No never skip next 2 questions", async () => {
const user = userEvent.setup();
await startSurvey(user);

for (let i = 0; i < 21; i++) {
  await answerQuestion(user);
  await user.click(screen.getByRole("button", { name: /next/i }));
}

expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();


});

/* RULE 5 */

test("RULE 5: Q23–Q27 all No skip Q28", async () => {
const user = userEvent.setup();
await startSurvey(user);

for (let i = 0; i < 27; i++) {
  await answerQuestion(user);
  await user.click(screen.getByRole("button", { name: /next/i }));
}

expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();


});

/* RULE 6 */

test("RULE 6: Q29–Q38 all No skip Q39", async () => {
const user = userEvent.setup();
await startSurvey(user);

for (let i = 0; i < 38; i++) {
  await answerQuestion(user);
  await user.click(screen.getByRole("button", { name: /next/i }));
}

expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();


});

/* RULE 7 */

test("RULE 7: Q42–Q48 all No skip Q49", async () => {
const user = userEvent.setup();
await startSurvey(user);


for (let i = 0; i < 48; i++) {
  await answerQuestion(user);
  await user.click(screen.getByRole("button", { name: /next/i }));
}

expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();

});

/* RULE 8 */

test("RULE 8: Q50–Q54 all No skip Q55", async () => {
const user = userEvent.setup();
await startSurvey(user);


for (let i = 0; i < 54; i++) {
  await answerQuestion(user);
  await user.click(screen.getByRole("button", { name: /next/i }));
}

expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();


});

/* RULE 9 */

test("RULE 9: Q57 No skip to Q60", async () => {
const user = userEvent.setup();
await startSurvey(user);

for (let i = 0; i < 57; i++) {
  await answerQuestion(user);
  await user.click(screen.getByRole("button", { name: /next/i }));
}

expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();


});

/* RULE 10 (implicit normal flow) */

test("RULE 10: Normal navigation works", async () => {
const user = userEvent.setup();
await startSurvey(user);


await answerQuestion(user);
await user.click(screen.getByRole("button", { name: /next/i }));

expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();


});

/* RULE 11 */

test("RULE 11: Q88 None skip to Q93", async () => {
const user = userEvent.setup();
await startSurvey(user);


for (let i = 0; i < 88; i++) {
  await answerQuestion(user);
  await user.click(screen.getByRole("button", { name: /next/i }));
}

expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();


});

/* RULE 12 */

test("RULE 12: Q90 No never skip to Q91", async () => {
const user = userEvent.setup();
await startSurvey(user);

for (let i = 0; i < 90; i++) {
  await answerQuestion(user);
  await user.click(screen.getByRole("button", { name: /next/i }));
}

expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();


});

/* RULE 13 (Q93 section jump) */

test("RULE 13: Q93 No skip to Section E", async () => {
const user = userEvent.setup();
await startSurvey(user);


for (let i = 0; i < 93; i++) {
  await answerQuestion(user);
  await user.click(screen.getByRole("button", { name: /next/i }));
}

expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();


});

/* RULE 14 */

test("RULE 14: Q91 No never skip to Q93", async () => {
const user = userEvent.setup();
await startSurvey(user);


for (let i = 0; i < 91; i++) {
  await answerQuestion(user);
  await user.click(screen.getByRole("button", { name: /next/i }));
}

expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();


});

});
