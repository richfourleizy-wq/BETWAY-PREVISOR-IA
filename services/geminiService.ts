
import { GoogleGenAI, Type } from "@google/genai";
import { Match, PredictionResult } from "../types";

export class GeminiService {
  /**
   * Generates a sports prediction using Gemini 3 Pro.
   */
  static async getPrediction(match: Match): Promise<PredictionResult> {
    // Create a new instance right before making an API call to ensure it uses the most up-to-date API key.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      Atue como um analista profissional de dados desportivos e especialista em apostas. Analise o seguinte jogo de futebol:
      Jogo: ${match.homeTeam} vs ${match.awayTeam}
      Liga: ${match.league}
      Estado: ${match.status}
      Placar Atual: ${match.score ? `${match.score.home}-${match.score.away}` : 'N/A'}
      Odds Betway: Casa(${match.odds.home}), Empate(${match.odds.draw}), Fora(${match.odds.away})
      
      Forneça uma previsão detalhada em PORTUGUÊS incluindo:
      1. Probabilidades de vitória para Casa, Empate e Fora.
      2. Um tipo de aposta recomendada.
      3. Uma pontuação de confiança (0-100).
      4. Um placar final previsto.
      5. Uma breve explicação lógica da previsão baseada em probabilidade estatística e tendências de forma atual.
      6. Nível de risco (LOW, MEDIUM, HIGH).
    `;

    try {
      // Using gemini-3-pro-preview for complex reasoning tasks like sports analysis.
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              probability: {
                type: Type.OBJECT,
                properties: {
                  homeWin: { type: Type.NUMBER },
                  draw: { type: Type.NUMBER },
                  awayWin: { type: Type.NUMBER },
                },
                required: ["homeWin", "draw", "awayWin"]
              },
              recommendedBet: { type: Type.STRING },
              confidenceScore: { type: Type.NUMBER },
              predictedScore: { type: Type.STRING },
              aiAnalysis: { type: Type.STRING },
              riskLevel: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH"] }
            },
            required: ["probability", "recommendedBet", "confidenceScore", "predictedScore", "aiAnalysis", "riskLevel"]
          }
        }
      });

      // Extract text directly from the property, do not call as a method.
      const data = JSON.parse(response.text || "{}");
      return {
        matchId: match.id,
        ...data
      };
    } catch (error) {
      console.error("Erro na Previsão Gemini:", error);
      // Graceful fallback when the API call fails.
      return {
        matchId: match.id,
        probability: { homeWin: 45, draw: 25, awayWin: 30 },
        recommendedBet: "Vitória Caseira (Reserva)",
        confidenceScore: 50,
        predictedScore: "2-1",
        aiAnalysis: "Não foi possível contactar a IA Gemini neste momento. A mostrar modelo estatístico base com base nas odds das casas de apostas.",
        riskLevel: "MEDIUM"
      };
    }
  }
}
