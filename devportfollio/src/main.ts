import { createApp, ref, onMounted } from 'vue';
import QRCodeGenerator from './components/QRCodeGenerator';

const app = createApp({
  components: {
    QRCodeGenerator
  },
  setup() {
    const typedText = ref('');
    const isAuthenticated = ref(false);
    const user = ref(null);
    const profileUrl = ref('https://ai-profile.io/badge/johndoe');

    const typeText = async (text: string, delay = 50) => {
      for (let i = 0; i < text.length; i++) {
        typedText.value += text[i];
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    };

    onMounted(() => {
      typeText('Create your interactive developer profile with AI');
    });

    const login = async (provider: 'email' | 'google' | 'github') => {
      try {
        // In a real application, you would use Auth0 SDK to handle authentication
        isAuthenticated.value = true;
        user.value = { name: 'John Doe' };
      } catch (error) {
        console.error('Login failed:', error);
      }
    };

    const logout = () => {
      isAuthenticated.value = false;
      user.value = null;
    };

    return {
      typedText,
      isAuthenticated,
      user,
      profileUrl,
      login,
      logout
    };
  }
});

app.mount('#app'); 