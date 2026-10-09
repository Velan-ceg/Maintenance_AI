

import { createInterface } from "node:readline/promises";

import { stdin as input, stdout as output } from "node:process";

import dotenv from "dotenv";

import {
  getStepDetails,
  INITIAL_INVESTIGATION_STEPS,
} from "./src/agent/coordinator";

import { verifyResolution } from "./src/agent/resolutionVerifier";

import type {

  IncidentReport,

  FullDiagnosisResult,

  VerificationResult,

} from "./src/types";

dotenv.config();

const rl = createInterface({

  input,

  output,

});

/*

 * ============================================================

 * MAINTAI STAFF TERMINAL

 * ============================================================

 *

 * This is a terminal interface for the existing MaintAI system.

 *

 * The React application is NOT replaced.

 * The CLI uses the existing diagnosis engine.

 *

 * This is an educational simulation.

 * It does not control physical machinery.

 *

 * ============================================================

 */

function sleep(ms: number): Promise<void> {

  return new Promise(function (resolve) {

    setTimeout(resolve, ms);

  });

}

function separator(): void {

  console.log(

    "============================================================"

  );

}

function smallSeparator(): void {

  console.log(

    "------------------------------------------------------------"

  );

}

function section(title: string): void {

  console.log("");

  separator();

  console.log("  " + title);

  separator();

}

function printBanner(): void {

  console.clear();

  console.log("");

  separator();

  console.log("                 MAINTAI STAFF TERMINAL");

  console.log("          Autonomous Maintenance Diagnosis Agent");

  separator();

  console.log("");

  console.log("  Educational / Simulation Environment");

  console.log("  No physical machine control is performed.");

  console.log("");

}

async function ask(question: string): Promise<string> {

  while (true) {

    const answer = (

      await rl.question(question)

    ).trim();

    if (answer.length > 0) {

      return answer;

    }

    console.log("Please enter a value.");

  }

}

async function askNumber(

  question: string,

  defaultValue?: number

): Promise<number> {

  while (true) {

    let prompt = question;

    if (defaultValue !== undefined) {

      prompt = question + " [" + defaultValue + "]";

    }

    const answer = (

      await rl.question(prompt + ": ")

    ).trim();

    if (

      answer === "" &&

      defaultValue !== undefined

    ) {

      return defaultValue;

    }

    const value = Number(answer);

    if (!Number.isNaN(value)) {

      return value;

    }

    console.log("Please enter a valid number.");

  }

}

async function askSymptoms(): Promise<string[]> {

  console.log("");

  console.log("Enter symptoms one by one.");

  console.log("Type 'done' when finished.");

  console.log("");

  const symptoms: string[] = [];

  while (true) {

    const answer = (

      await rl.question(

        "Symptom " + (symptoms.length + 1) + ": "

      )

    ).trim();

    if (answer.toLowerCase() === "done") {

      break;

    }

    if (answer.length > 0) {

      symptoms.push(answer);

    }

  }

  if (symptoms.length === 0) {

    symptoms.push("No symptoms specified");

  }

  return symptoms;

}

async function createIncident(): Promise<IncidentReport> {

  section("NEW INCIDENT");

  console.log(

    "Enter the incident information below."

  );

  const equipmentId = await ask(

    "Equipment ID: "

  );

  const equipmentType = await ask(

    "Equipment type: "

  );

  const problemDescription = await ask(

    "Problem description: "

  );

  const symptoms = await askSymptoms();

  console.log("");

  console.log("Telemetry information");

  smallSeparator();

  const temperature = await askNumber(

    "Temperature (°C)",

    82

  );

  const vibration = await askNumber(

    "Vibration (mm/s)",

    8.4

  );

  const pressure = await askNumber(

    "Pressure (bar)",

    5.1

  );

  const operatingHours = await askNumber(

    "Operating hours",

    8240

  );

  const maintenanceHistorySummary =

    await ask(

      "Maintenance history summary: "

    );

  return {

    equipmentId: equipmentId,

    equipmentType: equipmentType,

    problemDescription: problemDescription,

    symptoms: symptoms,

    temperature: temperature,

    vibration: vibration,

    pressure: pressure,

    operatingHours: operatingHours,

    maintenanceHistorySummary:

      maintenanceHistorySummary,

    reportedAt: new Date().toISOString(),

  };

}

function createDemoIncident(): IncidentReport {

  return {

    equipmentId: "CNC-04",

    equipmentType:

      "CNC Machining Center",

    problemDescription:

      "Machine must be stopped due to excessive spindle vibration and elevated temperature.",

    symptoms: [

      "Excessive spindle vibration",

      "Elevated spindle temperature",

      "Abnormal spindle noise",

    ],

    temperature: 82,

    vibration: 8.4,

    pressure: 5.1,

    operatingHours: 8240,

    maintenanceHistorySummary:

      "Spindle bearing was last replaced 14 months ago. Previous incident involved bearing degradation.",

    reportedAt: new Date().toISOString(),

  };

}

function printIncident(

  incident: IncidentReport

): void {

  section("INCIDENT SUMMARY");

  console.log(

    "Equipment ID       : " +

      incident.equipmentId

  );

  console.log(

    "Equipment Type     : " +

      incident.equipmentType

  );

  console.log(

    "Problem            : " +

      incident.problemDescription

  );

  console.log(

    "Temperature        : " +

      incident.temperature +

      " °C"

  );

  console.log(

    "Vibration          : " +

      incident.vibration +

      " mm/s"

  );

  console.log(

    "Pressure           : " +

      incident.pressure +

      " bar"

  );

  console.log(

    "Operating Hours    : " +

      incident.operatingHours

  );

  console.log("");

  console.log("Symptoms:");

  for (

    const symptom of incident.symptoms

  ) {

    console.log("  • " + symptom);

  }

  console.log("");

  console.log("Maintenance History:");

  console.log(

    "  " +

      incident.maintenanceHistorySummary

  );

}

async function runInvestigation(

  incident: IncidentReport

): Promise<FullDiagnosisResult> {

  section("AUTONOMOUS INVESTIGATION");

  console.log(

    "MaintAI is starting the investigation."

  );

  console.log(

    "Using the existing MaintAI diagnosis engine."

  );

  console.log("");

  for (

    const step of INITIAL_INVESTIGATION_STEPS

  ) {

    console.log("");

    smallSeparator();

    console.log(

      "[STEP " +

        step.stepNumber +

        "/9] " +

        step.title

    );

    console.log("");

    try {

      const details = getStepDetails(

        step.stepNumber,

        incident

      );

      console.log("Agent Log:");

      console.log(

        "  " + details.log

      );

      if (

        details.details &&

        details.details.length > 0

      ) {

        console.log("");

        console.log("Details:");

        for (

          const detail of details.details

        ) {

          console.log(

            "  • " + detail

          );

        }

      }

    } catch (error) {

      console.log(

        "Unable to display investigation details."

      );

    }

    console.log("");

    console.log("Status: PROCESSING...");

    await sleep(700);

    console.log("Status: COMPLETED");

  }

  console.log("");

  separator();

  console.log(

    "Executing MaintAI diagnosis pipeline..."

  );

  console.log("");

  console.log("Sending incident to the Gemini-enabled MaintAI backend...");

  const response = await fetch(
    "http://localhost:3000/api/investigate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        useGemini: true,
        incident,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `MaintAI API failed (${response.status}): ${errorText}`
    );
  }

  const result =
    (await response.json()) as FullDiagnosisResult;

  console.log("Diagnosis pipeline completed successfully.");
  console.log("AI Engine:", result.aiEngineUsed ?? "Not reported");

  return result;

}

function printEvidence(

  result: FullDiagnosisResult

): void {

  section("EVIDENCE EVALUATION");

  if (

    !result.evidence ||

    result.evidence.length === 0

  ) {

    console.log("No evidence returned.");

    return;

  }

  for (

    const evidence of result.evidence

  ) {

    console.log("");

    console.log(

      "[" +

        evidence.significance.toUpperCase() +

        "] " +

        evidence.title

    );

    console.log(

      "Category    : " +

        evidence.category

    );

    console.log(

      "Status      : " +

        (evidence.isAbnormal

          ? "ABNORMAL"

          : "NORMAL")

    );

    console.log(

      "Description : " +

        evidence.description

    );

    if (

      evidence.value !== undefined

    ) {

      console.log(

        "Value       : " +

          evidence.value

      );

    }

    if (evidence.normalRange) {

      console.log(

        "Normal Range: " +

          evidence.normalRange

      );

    }

  }

}

function printHypotheses(

  result: FullDiagnosisResult

): void {

  section("ROOT-CAUSE HYPOTHESES");

  const hypotheses =

    [...result.hypotheses].sort(

      function (a, b) {

        return (

          b.probability -

          a.probability

        );

      }

    );

  hypotheses.forEach(

    function (hypothesis, index) {

      console.log("");

      console.log(

        String(index + 1) +

          ". " +

          hypothesis.cause

      );

      console.log(

        "   Probability : " +

          hypothesis.probability +

          "%"

      );

      console.log(

        "   Severity    : " +

          hypothesis.severity

      );

      console.log(

        "   Rationale   : " +

          hypothesis.rationale

      );

    }

  );

}

function printDiagnosis(

  result: FullDiagnosisResult

): void {

  section("DIAGNOSIS");

  console.log(

    "Probable Cause : " +

      result.rootCause.probableCause

  );

  console.log(

    "Confidence     : " +

      result.rootCause.confidence +

      "%"

  );

  console.log("");

  console.log("Why:");

  console.log(

    result.rootCause.whyExplanation

  );

  console.log("");

  console.log("Alternative Causes:");

  for (

    const alternative of

    result.rootCause.alternativeCauses

  ) {

    console.log(

      "  • " +

        alternative.cause +

        " — " +

        alternative.probability +

        "%"

    );

    console.log(

      "    " +

        alternative.reason

    );

  }

  console.log("");

  console.log(

    "Diagnosis Engine: " +

      result.aiEngineUsed

  );

}

function printMaintenancePlan(

  result: FullDiagnosisResult

): void {

  section("MAINTENANCE ACTION PLAN");

  console.log("IMMEDIATE ACTION");

  smallSeparator();

  console.log(

    result.maintenancePlan.immediateAction

  );

  console.log("");

  console.log("INSPECTION REQUIRED");

  smallSeparator();

  console.log(

    result.maintenancePlan.inspectionRequired

  );

  console.log("");

  console.log("RECOMMENDED MAINTENANCE");

  smallSeparator();

  console.log(

    result.maintenancePlan.recommendedMaintenance

  );

  console.log("");

  console.log("TOOLS / PARTS");

  for (

    const item of

    result.maintenancePlan

      .requiredToolsParts

  ) {

    console.log("  • " + item);

  }

  console.log("");

  console.log("SAFETY WARNING");

  smallSeparator();

  console.log(

    result.maintenancePlan.safetyWarning

  );

  console.log("");

  console.log("VERIFICATION PROCEDURE");

  smallSeparator();

  console.log(

    result.maintenancePlan.verificationProcedure

  );

  console.log("");

  console.log("DISCLAIMER");

  smallSeparator();

  console.log(

    result.maintenancePlan.educationalDisclaimer

  );

}

async function runVerification(

  incident: IncidentReport

): Promise<VerificationResult> {

  section("POST-MAINTENANCE VERIFICATION");

  console.log(

    "This is a SIMULATED verification."

  );

  console.log(

    "No physical machine is being controlled."

  );

  console.log("");

  console.log("BEFORE MAINTENANCE");

  smallSeparator();

  const beforeTemperature =

    await askNumber(

      "Temperature (°C)",

      incident.temperature

    );

  const beforeVibration =

    await askNumber(

      "Vibration (mm/s)",

      incident.vibration

    );

  const beforePressure =

    await askNumber(

      "Pressure (bar)",

      incident.pressure

    );

  console.log("");

  console.log("AFTER MAINTENANCE");

  smallSeparator();

  const afterTemperature =

    await askNumber(

      "Temperature (°C)",

      61

    );

  const afterVibration =

    await askNumber(

      "Vibration (mm/s)",

      3.1

    );

  const afterPressure =

    await askNumber(

      "Pressure (bar)",

      5.1

    );

  return verifyResolution(

    {

      temperature:

        beforeTemperature,

      vibration:

        beforeVibration,

      pressure:

        beforePressure,

    },

    {

      temperature:

        afterTemperature,

      vibration:

        afterVibration,

      pressure:

        afterPressure,

    }

  );

}

function printVerification(

  result: VerificationResult

): void {

  section("VERIFICATION RESULT");

  console.log(

    "STATUS: " +

      result.status

  );

  console.log("");

  console.log("BEFORE READINGS");

  smallSeparator();

  console.log(

    "Temperature : " +

      result.beforeReadings.temperature +

      " °C"

  );

  console.log(

    "Vibration   : " +

      result.beforeReadings.vibration +

      " mm/s"

  );

  console.log(

    "Pressure    : " +

      result.beforeReadings.pressure +

      " bar"

  );

  console.log("");

  console.log("AFTER READINGS");

  smallSeparator();

  console.log(

    "Temperature : " +

      result.afterReadings.temperature +

      " °C"

  );

  console.log(

    "Vibration   : " +

      result.afterReadings.vibration +

      " mm/s"

  );

  console.log(

    "Pressure    : " +

      result.afterReadings.pressure +

      " bar"

  );

  console.log("");

  console.log("Reason:");

  console.log(

    result.reason

  );

  console.log("");

  console.log(

    "Verified At: " +

      result.verifiedAt

  );

}

async function investigateIncident(

  incident: IncidentReport

): Promise<void> {

  printIncident(incident);

  console.log("");

  const confirmation = (

    await rl.question(

      "Start autonomous investigation? (y/n): "

    )

  )

    .trim()

    .toLowerCase();

  if (

    confirmation !== "y" &&

    confirmation !== "yes"

  ) {

    console.log("");

    console.log(

      "Investigation cancelled."

    );

    return;

  }

  const result =

    await runInvestigation(

      incident

    );

  printEvidence(result);

  printHypotheses(result);

  printDiagnosis(result);

  printMaintenancePlan(result);

  console.log("");

  const verify = (

    await rl.question(

      "Run simulated post-maintenance verification? (y/n): "

    )

  )

    .trim()

    .toLowerCase();

  if (

    verify === "y" ||

    verify === "yes"

  ) {

    const verification =

      await runVerification(

        incident

      );

    printVerification(

      verification

    );

  }

  console.log("");

  separator();

  console.log(

    "Investigation workflow completed."

  );

  separator();

}

async function main(): Promise<void> {

  printBanner();

  const args =

    process.argv.slice(2);

  if (

    args.includes("--demo")

  ) {

    const demoIncident =

      createDemoIncident();

    await investigateIncident(

      demoIncident

    );

    rl.close();

    return;

  }

  let running = true;

  while (running) {

    section("STAFF MENU");

    console.log("1. New Incident");

    console.log("2. Run CNC-04 Demo");

    console.log("3. Exit");

    console.log("");

    const choice = (

      await rl.question(

        "Select an option: "

      )

    ).trim();

    switch (choice) {

      case "1": {

        const incident =

          await createIncident();

        await investigateIncident(

          incident

        );

        break;

      }

      case "2": {

        const demoIncident =

          createDemoIncident();

        await investigateIncident(

          demoIncident

        );

        break;

      }

      case "3": {

        running = false;

        break;

      }

      default: {

        console.log("");

        console.log(

          "Invalid option. Please choose 1, 2, or 3."

        );

        break;

      }

    }

  }

  console.log("");

  console.log(

    "MaintAI Staff Terminal closed."

  );

  rl.close();

}

main().catch(

  function (error) {

    console.error("");

    console.error(

      "MaintAI CLI encountered an error:"

    );

    console.error(error);

    rl.close();

    process.exit(1);

  }

);
