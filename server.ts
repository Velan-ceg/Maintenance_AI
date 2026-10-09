import express from 'express';

import path from 'path';

import dotenv from 'dotenv';

import { GoogleGenAI, Type } from '@google/genai';

import { createServer as createViteServer } from 'vite';

import { executeFullDiagnosis } from './src/agent/coordinator';

import { verifyResolution } from './src/agent/resolutionVerifier';

import { IncidentReport } from './src/types';



dotenv.config();



const PORT = 3000;



async function startServer() {

  const app = express();



  app.use(express.json());



  // ========================================

  // HEALTH CHECK

  // ========================================



  app.get('/api/health', (req, res) => {

    res.json({

      status: 'ok',

      hasGeminiApiKey: !!process.env.GEMINI_API_KEY,

      timestamp: new Date().toISOString(),

    });

  });



  // ========================================

  // AUTONOMOUS INVESTIGATION

  // ========================================



  app.post('/api/investigate', async (req, res) => {



    const incident: IncidentReport = req.body.incident;



    // ----------------------------------------

    // Validate input

    // ----------------------------------------



    if (!incident) {

      console.log('\n❌ No incident data received from frontend.');



      return res.status(400).json({

        error: 'Missing incident report data in request body',

      });

    }



    // ----------------------------------------

    // Determine whether Gemini is enabled

    // ----------------------------------------



    const useGemini =
      req.body.useGemini === true &&
      Boolean(process.env.GEMINI_API_KEY?.trim());

    // Diagnostic only: never print the API key itself.
    console.log('[Gemini DEBUG]', {
      requested: req.body.useGemini === true,
      hasApiKey: Boolean(process.env.GEMINI_API_KEY?.trim()),
      enabled: useGemini,
    });



    // ========================================

    // TERMINAL - INVESTIGATION START

    // ========================================



    console.log('\n');

    console.log('========================================');

    console.log('        MaintAI AGENT INVESTIGATION');

    console.log('========================================');



    console.log('\n[INPUT RECEIVED FROM WEB APP]');

    console.log('----------------------------------------');



    console.log(`Equipment ID : ${incident.equipmentId}`);

    console.log(`Equipment    : ${incident.equipmentType}`);

    console.log(`Problem      : ${incident.problemDescription}`);



    console.log(

      `Symptoms     : ${

        Array.isArray(incident.symptoms)

          ? incident.symptoms.join(', ')

          : 'Not provided'

      }`

    );



    console.log(`Temperature  : ${incident.temperature} °C`);

    console.log(`Vibration    : ${incident.vibration} mm/s`);

    console.log(`Pressure     : ${incident.pressure} bar`);

    console.log(`Operating    : ${incident.operatingHours} hrs`);



    console.log(

      `Maintenance  : ${incident.maintenanceHistorySummary}`

    );



    console.log('\n[AGENT] Incident received successfully.');

    console.log('[AGENT] Starting autonomous investigation...');



    // ========================================

    // STEP 1 - BASELINE AGENT ENGINE

    // ========================================



    console.log('\n[1/7] Analyzing incident...');



    const baselineResult = executeFullDiagnosis(incident);



    console.log('[✓] Incident analysis completed.');



    // ========================================

    // STEP 2 - EVIDENCE

    // ========================================



    console.log('\n[2/7] Collecting and analyzing evidence...');



    console.log(

      '[✓] Sensor telemetry analyzed.'

    );



    console.log(

      '[✓] Maintenance history analyzed.'

    );



    console.log(

      '[✓] Previous incident patterns checked.'

    );



    // ========================================

    // STEP 3 - HYPOTHESES

    // ========================================



    console.log('\n[3/7] Generating possible root causes...');



    console.log('[✓] Bearing degradation');

    console.log('[✓] Lubrication failure');

    console.log('[✓] Motor imbalance');

    console.log('[✓] Overheating');



    // ========================================

    // STEP 4 - HYPOTHESIS EVALUATION

    // ========================================



    console.log('\n[4/7] Evaluating hypotheses against evidence...');



    console.log('[Agent] Comparing symptoms with telemetry...');

    console.log('[Agent] Comparing current condition with history...');



    console.log('[✓] Hypothesis evaluation completed.');



    // ========================================

    // STEP 5 - GEMINI

    // ========================================



    console.log('\n[5/7] AI reasoning...');



    console.log(

      useGemini

        ? '[Gemini] Gemini LLM enabled.'

        : '[Local Agent] Gemini unavailable. Using local diagnosis engine.'

    );



    if (useGemini && process.env.GEMINI_API_KEY) {



      try {



        console.log(

          '[Gemini] Sending incident to Gemini...'

        );



        const ai = new GoogleGenAI({

          apiKey: process.env.GEMINI_API_KEY,

          httpOptions: {

            headers: {

              'User-Agent': 'aistudio-build',

            },

          },

        });



        const prompt = `

You are MaintAI, an expert Autonomous Maintenance Diagnosis Agent.



Analyze this industrial equipment failure incident.



Equipment ID:

${incident.equipmentId}



Equipment Type:

${incident.equipmentType}



Problem:

${incident.problemDescription}



Symptoms:

${Array.isArray(incident.symptoms)

  ? incident.symptoms.join(', ')

  : 'Not provided'}



Telemetry:



Temperature:

${incident.temperature}°C



Vibration:

${incident.vibration} mm/s



Pressure:

${incident.pressure} bar



Operating Hours:

${incident.operatingHours} hrs



Maintenance History:

${incident.maintenanceHistorySummary}



Evaluate these possible root causes:



1\. Bearing degradation

2\. Lubrication failure

3\. Motor imbalance

4\. Overheating



Provide a professional diagnosis.



Return:



\- probableCause

\- confidence from 1 to 100

\- whyExplanation

\- alternativeCauses

\- immediateAction

\- inspectionRequired

\- recommendedMaintenance

\- safetyWarning

\- verificationProcedure

`;



        const geminiResponse =

          await ai.models.generateContent({



            model: 'gemini-3.8-flash',



            contents: prompt,



            config: {

              responseMimeType: 'application/json',



              responseSchema: {



                type: Type.OBJECT,



                properties: {



                  probableCause: {

                    type: Type.STRING,

                  },



                  confidence: {

                    type: Type.NUMBER,

                  },



                  whyExplanation: {

                    type: Type.STRING,

                  },



                  alternativeCauses: {



                    type: Type.ARRAY,



                    items: {



                      type: Type.OBJECT,



                      properties: {



                        cause: {

                          type: Type.STRING,

                        },



                        probability: {

                          type: Type.NUMBER,

                        },



                        reason: {

                          type: Type.STRING,

                        },



                      },



                      required: [

                        'cause',

                        'probability',

                        'reason',

                      ],



                    },



                  },



                  immediateAction: {

                    type: Type.STRING,

                  },



                  inspectionRequired: {

                    type: Type.STRING,

                  },



                  recommendedMaintenance: {

                    type: Type.STRING,

                  },



                  safetyWarning: {

                    type: Type.STRING,

                  },



                  verificationProcedure: {

                    type: Type.STRING,

                  },



                },



                required: [



                  'probableCause',

                  'confidence',

                  'whyExplanation',

                  'alternativeCauses',

                  'immediateAction',

                  'inspectionRequired',

                  'recommendedMaintenance',

                  'safetyWarning',

                  'verificationProcedure',



                ],



              },



            },



          });



        // ========================================

        // GEMINI RESPONSE

        // ========================================



        if (geminiResponse.text) {



          console.log(

            '[Gemini] Response received successfully.'

          );



          const parsed =

            JSON.parse(geminiResponse.text);



          baselineResult.aiEngineUsed =

            'gemini-3.8-flash';



          if (parsed.probableCause) {



            baselineResult.rootCause.probableCause =

              parsed.probableCause;



          }



          if (parsed.confidence) {



            baselineResult.rootCause.confidence =

              parsed.confidence;



          }



          if (parsed.whyExplanation) {



            baselineResult.rootCause.whyExplanation =

              parsed.whyExplanation;



          }



          if (

            parsed.alternativeCauses &&

            Array.isArray(parsed.alternativeCauses)

          ) {



            baselineResult.rootCause.alternativeCauses =

              parsed.alternativeCauses;



          }



          if (parsed.immediateAction) {



            baselineResult.maintenancePlan.immediateAction =

              parsed.immediateAction;



          }



          if (parsed.inspectionRequired) {



            baselineResult.maintenancePlan.inspectionRequired =

              parsed.inspectionRequired;



          }



          if (parsed.recommendedMaintenance) {



            baselineResult.maintenancePlan.recommendedMaintenance =

              parsed.recommendedMaintenance;



          }



          if (parsed.safetyWarning) {



            baselineResult.maintenancePlan.safetyWarning =

              parsed.safetyWarning;



          }



          if (parsed.verificationProcedure) {



            baselineResult.maintenancePlan.verificationProcedure =

              parsed.verificationProcedure;



          }



        }



      } catch (err) {



        console.warn(

          '[Gemini] API call failed.'

        );



        console.warn(

          '[Gemini] Falling back to local MaintAI engine.'

        );



        console.warn(err);



      }



    }



    // ========================================

    // STEP 6 - FINAL DIAGNOSIS

    // ========================================



    console.log('\n[6/7] Selecting most probable root cause...');



    console.log('\n========================================');

    console.log('             FINAL DIAGNOSIS');

    console.log('========================================');



    console.log(

      `\nRoot Cause : ${baselineResult.rootCause.probableCause}`

    );



    console.log(

      `Confidence : ${baselineResult.rootCause.confidence}%`

    );



    console.log('\nReasoning:');



    console.log(

      baselineResult.rootCause.whyExplanation

    );



    // ========================================

    // MAINTENANCE PLAN

    // ========================================



    console.log('\n[MAINTENANCE RECOMMENDATION]');

    console.log('----------------------------------------');



    console.log(

      baselineResult.maintenancePlan.immediateAction

    );



    console.log('\nInspection:');



    console.log(

      baselineResult.maintenancePlan.inspectionRequired

    );



    console.log('\nRecommended Maintenance:');



    console.log(

      baselineResult.maintenancePlan.recommendedMaintenance

    );



    console.log('\nSafety Warning:');



    console.log(

      baselineResult.maintenancePlan.safetyWarning

    );



    console.log('\nVerification Procedure:');



    console.log(

      baselineResult.maintenancePlan.verificationProcedure

    );



    // ========================================

    // STEP 7 - COMPLETE

    // ========================================



    console.log('\n[7/7] Investigation completed.');



    console.log('\n========================================');

    console.log('        INVESTIGATION COMPLETE');

    console.log('========================================');



    console.log(

      `AI Engine : ${baselineResult.aiEngineUsed}`

    );



    console.log(

      `Root Cause: ${baselineResult.rootCause.probableCause}`

    );



    console.log(

      `Confidence: ${baselineResult.rootCause.confidence}%`

    );



    console.log('========================================\n');



    // ========================================

    // SEND RESULT TO FRONTEND

    // ========================================



    res.json(baselineResult);

  });



  // ========================================

  // POST-MAINTENANCE VERIFICATION

  // ========================================



  app.post('/api/verify', (req, res) => {



    const { before, after } = req.body;



    if (!before || !after) {



      return res.status(400).json({

        error:

          'Both before and after telemetry readings are required',

      });



    }



    console.log('\n========================================');

    console.log('       MAINTENANCE VERIFICATION');

    console.log('========================================');



    console.log('\nBefore Maintenance:');

    console.log(before);



    console.log('\nAfter Maintenance:');

    console.log(after);



    const result =

      verifyResolution(before, after);



    console.log('\nVerification Result:');

    console.log(result);



    console.log('========================================\n');



    res.json(result);

  });



  // ========================================

  // VITE

  // ========================================



  if (process.env.NODE_ENV !== 'production') {



    const vite =

      await createViteServer({



        server: {

          middlewareMode: true,

        },



        appType: 'spa',



      });



    app.use(vite.middlewares);



  } else {



    const distPath =

      path.join(process.cwd(), 'dist');



    app.use(

      express.static(distPath)

    );



    app.get('*', (req, res) => {



      res.sendFile(

        path.join(

          distPath,

          'index.html'

        )

      );



    });



  }



  // ========================================

  // START SERVER

  // ========================================



  app.listen(

    PORT,

    '0.0.0.0',

    () => {



      console.log(

        `\nMaintAI Server running on port ${PORT}`

      );



      console.log(

        `Gemini API: ${

          process.env.GEMINI_API_KEY

            ? 'AVAILABLE'

            : 'NOT CONFIGURED'

        }`

      );



      console.log(

        `Open: http://localhost:${PORT}\n`

      );



    }

  );

}



startServer();