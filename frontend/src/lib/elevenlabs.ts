import axios from 'axios';

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/convai/agents/create';

export const elevenLabsAPI = {
  async createAgent(query: string) {
    try {
      console.log("Creating agent for query:", query);
      
      const response = await axios.post(
        ELEVENLABS_API_URL,
        {
          "conversation_config": {
            "agent": {
              "prompt": {
                "prompt": query,
              },
              "first_message": `Hello! I'm your AI tutor for ${query}. I'm here to help you understand the concepts better. What would you like to learn about?`,
              "language": "en"
            }
          }
        },
        {
          headers: {
            'xi-api-key': ELEVENLABS_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.agent_id) {
        return response.data.agent_id;
      }
      throw new Error('No agent ID received in response');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('ElevenLabs API Error:', error.response?.data);
        throw new Error(error.response?.data?.detail || 'Failed to create ElevenLabs agent');
      }
      throw error;
    }
  }
}; 