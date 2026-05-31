'use server';

import {
  BedrockRuntimeClient,
  ConverseCommand,
} from '@aws-sdk/client-bedrock-runtime';

// Initialize Bedrock Client using environment variables
const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function sendChatMessage(
  chatHistory: { role: 'user' | 'assistant'; text: string }[],
) {
  try {
    // Format message history explicitly matching AWS Converse API specs
    const formattedMessages = chatHistory.map(msg => ({
      role: msg.role,
      content: [{ text: msg.text }],
    }));

    // Example using Anthropic Claude 3.5 Sonnet. Change ID as needed.
    const modelId = 'anthropic.claude-3-5-sonnet-20240620-v1:0';

    const command = new ConverseCommand({
      modelId: modelId,
      messages: formattedMessages,
      inferenceConfig: {
        maxTokens: 1000,
        temperature: 0.7,
      },
    });

    const response = await client.send(command);

    // Extract the text content blocks returned from Bedrock
    const responseText =
      response.output?.message?.content?.[0]?.text || 'No response text found.';

    return { success: true, text: responseText };
  } catch (error: any) {
    console.error('AWS Bedrock Error:', error);
    return { success: false, text: error.message || 'An error occurred.' };
  }
}
