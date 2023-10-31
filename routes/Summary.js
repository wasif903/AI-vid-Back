import { YoutubeTranscript } from "youtube-transcript";
import express, { response } from "express";
import OpenAI from "openai";
import axios from "axios";
// // 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
import { HfInference } from "@huggingface/inference";
import counter from "../models/counter.js";

import { TextServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";

const router = express.Router();

const openai = new OpenAI({
  apiKey: "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",
});

router.post("/summary", async (req, res) => {
  try {
    const { contentType, wordCounter, keyPoints } = req.body;

    if (
      req.body.contentType === "paragraph" &&
      req.body.wordCounter &&
      !req.body.keyPoints
    ) {
      const transcript = await YoutubeTranscript.fetchTranscript(
        req.body.vidURL
      );
      const joined = transcript
        .map((item) => item.text)
        .join(" ")
        .slice(0, 500);

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Summarize This Content In ${wordCounter}, here is the content ${joined}`,
          },
        ],
        temperature: 0,
        max_tokens: 1024,
      });

      const data = response.choices[0].message.content;
      res.status(200).json(data);
    } else if (
      req.body.contentType === "points" &&
      !req.body.wordCounter &&
      req.body.keyPoints
    ) {
      const transcript = await YoutubeTranscript.fetchTranscript(
        req.body.vidURL
      );
      const joined = transcript
        .map((item) => item.text)
        .join(" ")
        .slice(0, 500);

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Summarize This Content Strictly In ${keyPoints} bullet points with numbering, here is the content ${joined}`,
          },
        ],
        temperature: 0,
        max_tokens: 1024,
      });

      const data = response.choices[0].message.content;

      const keyPointsArray = data.split("\n").map((point, index) => ({
        content: point,
      }));

      res.status(200).json(keyPointsArray);
    }
  } catch (error) {
    console.log(error);
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
