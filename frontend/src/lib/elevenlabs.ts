import axios from 'axios';

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/conversational-ai';

export const elevenLabsAPI = {
  async createAgent(courseTitle: string, courseContent: any) {
    try {
      const response = await axios.post(
        `${ELEVENLABS_API_URL}/create-agent`,
        {
          name: `Course Assistant: ${courseTitle}`,
          description: `AI tutor specialized in teaching ${courseTitle}`,
          image_url: null,
          initial_message: `Welcome! I'm your AI tutor for ${courseTitle}. How can I help you understand the course material better?`,
          knowledge_base: {
            type: "text",
            content: JSON.stringify(courseContent)
          },
          voice_settings: {
            voice_id: "21m00Tcm4TlvDq8ikWAM",
            model_id: "eleven_turbo_v2",
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          },
          response_format: {
            type: "markdown",
            max_length: 800
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
  },

  getAgentWidget(agentId: string) {
    return `<elevenlabs-convai agent-id="${agentId}"></elevenlabs-convai><script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>`;
  }
}; 