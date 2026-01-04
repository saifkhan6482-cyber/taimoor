
import { GoogleGenAI, Modality } from "@google/genai";
import { Emotion, CHARACTERS } from "../types";
import { decode, decodeAudioData, bufferToWav } from "../utils/audio";

const API_KEY = process.env.API_KEY || "";

export const generateSpeech = async (
  text: string,
  voiceId: string,
  emotion: Emotion,
  emotionIntensity: number,
  speed: number,
  pitch: string
): Promise<{ blob: Blob; url: string }> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const character = CHARACTERS.find(c => c.id === voiceId) || CHARACTERS[0];

  // Professional Voice Actor Instructions for Extreme Realism
  const actorPersona = `
PERFORMANCE PROFILE:
- Name: ${character.name} (${character.role})
- Traits: ${character.desc}
- Emotional Overlay: ${emotion}
- Emotional Intensity: ${(emotionIntensity * 100).toFixed(0)}% (0% is barely noticeable, 100% is extreme performance)
- Technical Spec: Speed ${speed}x, Pitch ${pitch}

ACTING INSTRUCTIONS (CRITICAL):
1. HUMAN NUANCES: Avoid robotic, perfectly rhythmic speech. Add subtle, natural pauses for impact.
2. BREATHING: Synthesize audio with natural-sounding breath intake at major punctuation marks.
3. PHRASING: Group words logically as a human speaker would. Emphasize keywords naturally.
4. PACING STABILITY: Maintain a rock-steady tempo. Do NOT speed up or "rush" to finish the last few sentences. The pace at the end must match the pace at the beginning.
5. NO REPETITION: Vary the inflection of sentences so the audio doesn't sound repetitive.
6. GENDER ACCURACY: Ensure the voice is strictly ${character.gender} and reflects the age profile of ${character.role}.

ACTOR DIRECTIVE:
Deliver the script below as a high-end studio recording for a professional production. 
Apply the "${emotion}" emotion with ${(emotionIntensity * 100).toFixed(0)}% intensity.
`.trim();

  const fullText = `
${actorPersona}

SCRIPT:
"${text}"
`.trim();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: fullText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: character.engine },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("The voice engine failed to render. Please try again.");
    }

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const rawBytes = decode(base64Audio);
    const audioBuffer = await decodeAudioData(rawBytes, audioCtx, 24000, 1);
    
    const wavBlob = bufferToWav(audioBuffer);
    const url = URL.createObjectURL(wavBlob);

    return { blob: wavBlob, url };
  } catch (error) {
    console.error("Studio Mastering Error:", error);
    throw error;
  }
};
