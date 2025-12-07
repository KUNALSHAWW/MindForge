import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export interface RAGOptions {
  maxTokens?: number;
  temperature?: number;
  topP?: number;
}

export async function queryWithRAG(
  query: string,
  context: string,
  options: RAGOptions = {}
): Promise<string> {
  const systemPrompt = `You are an intelligent tutor assistant. Use the provided context to answer questions accurately and comprehensively.
  
Context:
${context}

Instructions:
- Answer based on the context provided
- If information is not in the context, say so clearly
- Explain concepts in a clear and engaging way
- Ask follow-up questions when appropriate`;

  try {
    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      prompt: `${systemPrompt}\n\nQuestion: ${query}\n\nAnswer:`,
      max_new_tokens: options.maxTokens || 512,
      temperature: options.temperature || 0.7,
      top_p: options.topP || 0.95,
    });

    return response.generated_text?.split("Answer:")[-1]?.trim() || "";
  } catch (error) {
    console.error("HuggingFace API Error:", error);
    throw new Error("Failed to generate response");
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: text,
    });

    // Handle different response formats from HuggingFace
    if (Array.isArray(response)) {
      // If response is already an array of numbers
      if (typeof response[0] === 'number') {
        return response as number[];
      }
      // If response is nested array (batch of embeddings)
      if (Array.isArray(response[0])) {
        return (response as number[][])[0];
      }
    }
    
    throw new Error("Unexpected embedding response format");
  } catch (error) {
    console.error("Embedding generation error:", error);
    throw new Error("Failed to generate embedding");
  }
}

export async function retrieveRelevantDocuments(
  query: string,
  documents: Array<{ content: string; embedding: number[] }>,
  topK: number = 3
): Promise<string[]> {
  try {
    const queryEmbedding = await generateEmbedding(query);

    // Calculate cosine similarity
    const similarities = documents.map((doc) => {
      const dotProduct = queryEmbedding.reduce(
        (sum, val, i) => sum + val * doc.embedding[i],
        0
      );
      const normA = Math.sqrt(
        queryEmbedding.reduce((sum, val) => sum + val * val, 0)
      );
      const normB = Math.sqrt(
        doc.embedding.reduce((sum, val) => sum + val * val, 0)
      );
      return dotProduct / (normA * normB);
    });

    // Get top K documents
    return similarities
      .map((sim, i) => ({ sim, content: documents[i].content }))
      .sort((a, b) => b.sim - a.sim)
      .slice(0, topK)
      .map((item) => item.content);
  } catch (error) {
    console.error("Document retrieval error:", error);
    throw new Error("Failed to retrieve documents");
  }
}

export async function generateQuestion(
  topic: string,
  difficulty: "easy" | "medium" | "hard" = "medium"
): Promise<string> {
  const difficultyLevels = {
    easy: "beginner-friendly",
    medium: "intermediate",
    hard: "advanced",
  };

  try {
    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      prompt: `Generate a ${difficultyLevels[difficulty]} question about "${topic}" for a student. Only provide the question, no explanation.`,
      max_new_tokens: 150,
      temperature: 0.8,
    });

    return (
      response.generated_text?.trim() || "What do you know about " + topic + "?"
    );
  } catch (error) {
    console.error("Question generation error:", error);
    return "What would you like to learn about " + topic + "?";
  }
}
