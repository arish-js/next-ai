'use client';

import { useState } from 'react';
import { sendChatMessage } from './actions/bedrock';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Loader } from '@/components/ai-elements/loader';
import {
  PromptInput,
  PromptInputBody,
  PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: PromptInputMessage) => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', text: input };
    const updatedHistory = [...messages, userMessage];

    setMessages(updatedHistory);
    setInput('');
    setLoading(true);

    // Call the server-side action directly
    const result = await sendChatMessage(updatedHistory);

    if (result.success) {
      setMessages([
        ...updatedHistory,
        { role: 'assistant', text: result.text },
      ]);
    } else {
      setMessages([
        ...updatedHistory,
        { role: 'assistant', text: `Error: ${result.text}` },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className='max-w-4xl mx-auto p-6 relative size-full h-[calc(100vh-4rem)]'>
      <div className='flex flex-col h-full'>
        <Conversation className='h-full'>
          <ConversationContent>
            {messages.length === 0 && (
              <p className='text-gray-400 text-center mt-10'>
                Ask anything to TFS Assist...
              </p>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Input Bar */}
        <PromptInput
          onSubmit={handleSend}
          className='mt-4'
        >
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={e => setInput(e.target.value)}
            />
          </PromptInputBody>
          <PromptInputToolbar>
            <PromptInputTools>
              {/* Model selector, web search, etc. */}
            </PromptInputTools>
            <PromptInputSubmit disabled={loading} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
}
