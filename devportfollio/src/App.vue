<template>
  <div class="app-container min-h-screen bg-gray-900 text-white">
    <header class="header py-4 border-b border-gray-800">
      <div class="container mx-auto px-4 flex justify-between items-center">
        <div class="logo">
          <img src="/checkmatemain.png" alt="CheckMate.AI Logo" class="h-10 mr-2" />
        </div>
        <nav class="hidden md:block">
          <ul class="flex space-x-6">
            <li><a href="#features" class="hover:text-blue-400 transition">Features</a></li>
            <li><a href="#how-it-works" class="hover:text-blue-400 transition">How It Works</a></li>
            <li><a href="#generators" class="hover:text-blue-400 transition">Generators</a></li>
            <li><a href="#contact" class="hover:text-blue-400 transition">Contact</a></li>
          </ul>
        </nav>
        <div class="auth-buttons">
          <button v-if="!isLoggedIn" @click="login" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
            Login
          </button>
          <button v-else @click="logout" class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <!-- Hero Section -->
      <section v-if="!isLoggedIn" class="hero py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div class="container mx-auto px-4 text-center">
          <img src="/checkmatemain.png" alt="CheckMate.AI Logo" class="mx-auto mb-6 h-20" />
          <h2 class="text-4xl md:text-5xl font-bold mb-6 gradient-text">Create Your Developer Profile</h2>
          <p class="text-xl mb-8 max-w-2xl mx-auto">
            Generate professional QR codes and CVs for your portfolio, powered by AI.
          </p>
          <button @click="login" class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300">
            Get Started
          </button>
        </div>
      </section>

      <!-- Generator Section -->
      <section id="generators" class="py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold mb-12 text-center gradient-text">
            {{ isLoggedIn ? 'Your Developer Profile Tools' : 'Login to Access Tools' }}
          </h2>
          
          <div v-if="isLoggedIn" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <QRCodeGenerator />
            <CVGenerator />
          </div>
          <div v-else class="text-center p-8 bg-gray-800 rounded-lg">
            <p class="mb-4">Please login to access the generator tools.</p>
            <button @click="login" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
              Login
            </button>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="py-16 bg-gray-800">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold mb-12 text-center gradient-text">Features</h2>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="feature-card bg-gray-900 p-6 rounded-lg">
              <div class="icon mb-4 text-blue-400 text-3xl">
                <i class="fas fa-qrcode"></i>
              </div>
              <h3 class="text-xl font-bold mb-3">QR Code Generator</h3>
              <p>Create custom QR codes for your portfolio, linking to all your professional profiles.</p>
            </div>
            <div class="feature-card bg-gray-900 p-6 rounded-lg">
              <div class="icon mb-4 text-purple-400 text-3xl">
                <i class="fas fa-file-alt"></i>
              </div>
              <h3 class="text-xl font-bold mb-3">CV Builder</h3>
              <p>Generate professional CVs and resumes with multiple templates to showcase your skills.</p>
            </div>
            <div class="feature-card bg-gray-900 p-6 rounded-lg">
              <div class="icon mb-4 text-green-400 text-3xl">
                <i class="fas fa-magic"></i>
              </div>
              <h3 class="text-xl font-bold mb-3">AI Enhancement</h3>
              <p>Use AI to optimize your profile content and improve your chances of getting noticed.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section id="how-it-works" class="py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold mb-12 text-center gradient-text">How It Works</h2>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="step-card text-center">
              <div class="step-number bg-blue-600 text-white h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 class="text-xl font-bold mb-3">Create Account</h3>
              <p>Sign up and create your developer profile with your information and skills.</p>
            </div>
            <div class="step-card text-center">
              <div class="step-number bg-purple-600 text-white h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 class="text-xl font-bold mb-3">Generate Assets</h3>
              <p>Create QR codes and CVs that showcase your professional portfolio.</p>
            </div>
            <div class="step-card text-center">
              <div class="step-number bg-green-600 text-white h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 class="text-xl font-bold mb-3">Share & Apply</h3>
              <p>Download your assets and use them in job applications and networking.</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer id="contact" class="footer py-8 bg-gray-800 border-t border-gray-700">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-3 gap-8">
          <div>
            <div class="flex items-center mb-4">
              <img src="/checkmatemain.png" alt="CheckMate.AI Logo" class="h-8 mr-2" />
            </div>
            <p>AI-powered developer profile generator helping you stand out in your job search.</p>
          </div>
          <div>
            <h3 class="text-xl font-bold mb-4">Links</h3>
            <ul class="space-y-2">
              <li><a href="#features" class="hover:text-blue-400 transition">Features</a></li>
              <li><a href="#how-it-works" class="hover:text-blue-400 transition">How It Works</a></li>
              <li><a href="#generators" class="hover:text-blue-400 transition">Generators</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-xl font-bold mb-4">Contact</h3>
            <p>Email: info@checkmate.ai</p>
            <p>Twitter: @checkmateai</p>
            <p>GitHub: github.com/checkmateai</p>
          </div>
        </div>
        <div class="mt-8 pt-4 border-t border-gray-700 text-center">
          <p>&copy; 2023 CheckMate.AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import QRCodeGenerator from './components/QRCodeGenerator.vue';
import CVGenerator from './components/CVGenerator.vue';

// Auth state
const isLoggedIn = ref(false);

// Auth methods
function login() {
  isLoggedIn.value = true;
}

function logout() {
  isLoggedIn.value = false;
}
</script>

<style>
/* Global styles */
body {
  font-family: 'Inter', sans-serif;
  background-color: #121212;
  color: #f8f9fa;
}

.gradient-text {
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Transitions */
.transition {
  transition: all 0.3s ease;
}

/* Card styles */
.card {
  background-color: #1f2937;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style> 