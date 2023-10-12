import { YoutubeTranscript } from "youtube-transcript";
import express from "express";
import OpenAI from "openai";
import axios from "axios";
// // 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
import { HfInference } from "@huggingface/inference";
import counter from "../models/counter.js";

import { TextServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";

const router = express.Router();

// let cleanedText2;
// router.post("/summary", async (req, res) => {
//   try {
//     if (req.body.contentType === "points" && req.body.keyPoints) {
//       const transcript = await YoutubeTranscript.fetchTranscript(
//         req.body.vidURL
//       );
//       const joined = transcript.map((item) => item.text).join(" ");

//       const options = {
//         method: "POST",
//         url: "https://api.edenai.run/v2/text/summarise",
//         headers: {
//           authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiY2Q2YzhmOTAtNDcwMC00MzU5LWE1MTYtY2ExZDMyYjc5NGY5IiwidHlwZSI6ImFwaV90b2tlbiJ9.dE31lltMIxj6-uBubCaAXMHsYBKPQHzAOzpkZPpBMEg`,
//         },
//         data: {
//           show_original_response: false,
//           fallback_providers: "",
//           providers: "openai",
//           text: joined,
//           language: "en",
//         },
//       };
//       const axiosRes = await axios.request(options);

//       const summary = axiosRes.data.openai.result;

//       // Get the desired number of key points (sentences) from the request body
//       const desiredKeyPoints = req.body.keyPoints;

//       // Split the summary into sentences (assuming sentences are separated by periods)
//       const sentences = summary.split(". ");

//       // Check if the summary has more sentences than desired key points
//       if (sentences.length > desiredKeyPoints) {
//         // Take the first 'desiredKeyPoints' sentences as key points
//         const keyPoints = sentences.slice(0, desiredKeyPoints);

//         // Create an array of objects with key points
//         const keyPointObjects = keyPoints.map((point, index) => ({
//           keyPoint: point.replace(/:/g, ""),
//           index: index + 1, // Adding 1-based index
//         }));

//         res.status(200).json(keyPointObjects);
//       } else {
//         res.status(200).json([]);
//       }
//     } else if (req.body.contentType === "paragraph" && req.body.wordCounter) {
//       const transcript = await YoutubeTranscript.fetchTranscript(
//         req.body.vidURL
//       );
//       const joined = transcript.map((item) => item.text).join(" ");

//       const options = {
//         method: "POST",
//         url: "https://api.edenai.run/v2/text/summarise",
//         headers: {
//           authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiY2Q2YzhmOTAtNDcwMC00MzU5LWE1MTYtY2ExZDMyYjc5NGY5IiwidHlwZSI6ImFwaV90b2tlbiJ9.dE31lltMIxj6-uBubCaAXMHsYBKPQHzAOzpkZPpBMEg`,
//         },
//         data: {
//           show_original_response: false,
//           fallback_providers: "",
//           providers: "openai",
//           text: joined, // Remove the "i want summary in" part
//           language: "en",
//         },
//       };

//       const axiosRes = await axios.request(options);

//       const summary = axiosRes.data.openai.result;

//       // Get the desired word count from the request body
//       const desiredWordCount = req.body.wordCounter;

//       // Split the summary into words
//       const words = summary.split(" ");
//       // Check if the summary has more words than desired
//       if (words.length > desiredWordCount) {
//         // Trim the summary to the desired word count
//         const trimmedSummary = words?.slice(0, desiredWordCount).join(" ");
//         const cleanedText = trimmedSummary.replace(/:/g, "");
//         cleanedText2 = cleanedText.replace(/\n/g, " ");

//         res.status(200).json(joined);
//       } else {
//         res.status(200).json(joined);
//       }
//     } else {
//       return res.status(400).json({ message: "Invalid Request" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error", error });
//   }
// });

const hf = new HfInference("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");

router.post("/summary", async (req, res) => {
  try {
    const MODEL_NAME = "models/text-bison-001";
    const API_KEY = "AIzaSyDkqCUi9KqZK8yQCPT4Htxu4aGuZJSyLa0";

    const client = new TextServiceClient({
      authClient: new GoogleAuth().fromAPIKey(API_KEY),
    });

    // Check if the contentType is "paragraph" and wordCounter is provided
    if (
      req.body.contentType === "paragraph" &&
      req.body.wordCounter &&
      !req.body.keyPoints
    ) {
      const transcript = await YoutubeTranscript.fetchTranscript(
        req.body.vidURL
      );
      const joined = transcript.map((item) => item.text).join(" ");

      const promptString = joined;

      const stopSequences = [];

      const response = await client.generateText({
        // required, which model to use to generate the result
        model: MODEL_NAME,
        // optional, 0.0 always uses the highest-probability result
        temperature: 0.6,
        // optional, how many candidate results to generate
        candidateCount: 1,
        // optional, number of most probable tokens to consider for generation
        top_k: 40,
        // optional, for nucleus sampling decoding strategy
        top_p: 0.95,
        // optional, maximum number of output tokens to generate
        max_output_tokens: 1024,
        // optional, sequences at which to stop model generation
        stop_sequences: req.body.wordCounter,

        // optional, safety settings
        safety_settings: [
          { category: "HARM_CATEGORY_DEROGATORY", threshold: 1 },
          { category: "HARM_CATEGORY_TOXICITY", threshold: 1 },
          { category: "HARM_CATEGORY_VIOLENCE", threshold: 2 },
          { category: "HARM_CATEGORY_SEXUAL", threshold: 2 },
          { category: "HARM_CATEGORY_MEDICAL", threshold: 2 },
          { category: "HARM_CATEGORY_DANGEROUS", threshold: 2 },
        ],
        prompt: {
          text: ` ${promptString} Give Me The Summary Of This Content In Maximum ${req.body.wordCounter} Amount of words not in keypoints`,
        },
      });

      const outputArray = await response.map((item) => {
        // Check if 'item' is not null and has the expected structure
        if (
          item &&
          item.candidates &&
          item.candidates[0] &&
          item.candidates[0].output
        ) {
          return item.candidates[0].output;
        }
        // Return null for invalid or missing data
        return null;
      });

      // Filter out null values
      const filteredOutputArray = outputArray.filter((item) => item !== null);
      // Join the elements of filteredOutputArray into a single string with newline separators
      const responseString = filteredOutputArray.join("\n");

      // Counter Code
      const findCouters = await counter.find();
      const reversed = findCouters.reverse();
      const currentCount = reversed[0];
      if (findCouters.length !== 0) {
        const createCount = new counter({
          counter: currentCount.counter + 1,
        });
        await createCount.save();
      } else {
        const createCount = new counter({
          counter: 1,
        });
        await createCount.save();
      }

      // Now 'responseString' contains the entire response as a single string

      res.status(200).json(responseString);
    } else if (
      req.body.contentType === "points" &&
      req.body.keyPoints &&
      !req.body.wordCounter
    ) {
      const transcript = await YoutubeTranscript.fetchTranscript(
        req.body.vidURL
      );
      const joined = transcript.map((item) => item.text).join(" ");

      const promptString = joined;

      const stopSequences = [];

      const response = await client.generateText({
        // required, which model to use to generate the result
        model: MODEL_NAME,
        // optional, 0.0 always uses the highest-probability resultadadada
        temperature: 0.6,
        // optional, how many candidate results to generate
        candidateCount: 1,
        // optional, number of most probable tokens to consider for generation
        top_k: 40,
        // optional, for nucleus sampling decoding strategy
        top_p: 0.95,
        // optional, maximum number of output tokens to generate
        max_output_tokens: req.body.keyPoints,
        // optional, sequences at which to stop model generation
        stop_sequences: stopSequences,

        // optional, safety settings
        safety_settings: [
          { category: "HARM_CATEGORY_DEROGATORY", threshold: 1 },
          { category: "HARM_CATEGORY_TOXICITY", threshold: 1 },
          { category: "HARM_CATEGORY_VIOLENCE", threshold: 2 },
          { category: "HARM_CATEGORY_SEXUAL", threshold: 2 },
          { category: "HARM_CATEGORY_MEDICAL", threshold: 2 },
          { category: "HARM_CATEGORY_DANGEROUS", threshold: 2 },
        ],
        prompt: {
          text: `${promptString} Give Me The Summary Of This Content In Maximum ${req.body.keyPoints} Key Points With No Heading and with not in paragraph`,
        },
      });

      const outputArray = await response.map((item) => {
        // Check if 'item' is not null and has the expected structure
        if (
          item &&
          item.candidates &&
          item.candidates[0] &&
          item.candidates[0].output
        ) {
          return item.candidates[0].output;
        }
        // Return null for invalid or missing data
        return null;
      });

      // Filter out null values
      const filteredOutputArray = outputArray.filter((item) => item !== null);

      const responseString = filteredOutputArray.join("\n");

      // Split the input string into individual points
      const pointsArray = responseString
        .split(/\n\d+\.\s+|\s+-\s+/)
        .filter(Boolean);

      // Create an array of objects with index and point
      const pointsObjects = pointsArray.map((point, index) => ({
        index: index + 1, // Add 1 to make the index 1-based
        point: point.replace(/^\d+\.\s+/, "").trim(), // Remove leading index and whitespace
      }));
      // 'pointsObjects' now contains an array of objects with index and point
      // console.log(pointsObjects);

      // Counter Code
      const findCouters = await counter.find();
      const reversed = findCouters.reverse();
      const currentCount = reversed[0];
      if (findCouters.length !== 0) {
        const createCount = new counter({
          counter: currentCount.counter + 1,
        });
        await createCount.save();
      } else {
        const createCount = new counter({
          counter: 1,
        });
        await createCount.save();
      }

      res.status(200).json(pointsObjects);
    } else {
      res.status(400).json({ message: "Invalid Request" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-counter", async (req, res) => {
  try {
    const findCounter = await counter.find();
    const reversed = findCounter.reverse();
    const currentCount = reversed[0];

    if (findCounter.length !== 0) {
      return res.status(200).json(currentCount.counter);
    } else {
      res.status(200).json(0);
    }
    console.log(currentCount.counter);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;

// 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
