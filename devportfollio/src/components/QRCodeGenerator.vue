<template>
  <div class="qr-generator card p-4 md:p-8">
    <h2 class="text-2xl md:text-3xl font-bold mb-4 md:mb-6 gradient-text text-center">QR Code Generator</h2>
    
    <div class="form-group mb-6">
      <label class="block mb-2">Your Profile URL</label>
      <input 
        v-model="qrData" 
        type="text" 
        class="w-full p-2 rounded bg-gray-800 border border-gray-700" 
        placeholder="https://github.com/TheJ-Erk400/devportfolio"
      />
    </div>
    
    <div class="form-group mb-6">
      <label class="block mb-2">QR Code Size</label>
      <div class="flex items-center">
        <input 
          v-model="qrSize" 
          type="range" 
          min="100" 
          max="300" 
          step="10" 
          class="w-full mr-4"
        />
        <span>{{ qrSize }}px</span>
      </div>
    </div>
    
    <div class="form-group mb-6">
      <label class="block mb-2">Color</label>
      <div class="grid grid-cols-6 gap-2">
        <div 
          v-for="color in colorOptions" 
          :key="color.value" 
          class="color-option w-10 h-10 rounded-full cursor-pointer" 
          :style="{ backgroundColor: color.value }"
          :class="{ 'ring-2 ring-white': qrColor === color.value }"
          @click="qrColor = color.value"
        ></div>
      </div>
    </div>
    
    <div class="form-group mb-6">
      <div class="flex items-center">
        <input 
          v-model="includeLogo" 
          type="checkbox" 
          id="include-logo" 
          class="mr-2"
        />
        <label for="include-logo">Include CheckMate Logo</label>
      </div>
    </div>
    
    <div class="qr-code-container mb-6 flex justify-center items-center">
      <div v-if="!qrCodeGenerated" class="qr-placeholder h-64 w-64 border-2 border-dashed border-gray-600 rounded flex justify-center items-center text-gray-400">
        Fill in details above to generate QR code
      </div>
      <div v-else class="qr-code-wrapper" :style="{ width: `${qrSize}px`, height: `${qrSize}px` }">
        <canvas ref="qrCanvas" class="qr-canvas"></canvas>
      </div>
    </div>
    
    <div class="actions flex flex-col md:flex-row gap-4 justify-center">
      <button 
        @click="generateQRCode" 
        class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
      >
        <i class="fas fa-sync-alt mr-2"></i> Generate QR Code
      </button>
      <button 
        @click="downloadQRCode" 
        :disabled="!qrCodeGenerated" 
        class="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i class="fas fa-download mr-2"></i> Download QR Code
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import qrcode from 'qrcode-generator';

// QR Code properties
const qrData = ref('https://github.com/TheJ-Erk400/devportfolio');
const qrSize = ref(200);
const qrColor = ref('#3b82f6');
const qrCodeGenerated = ref(false);
const qrCanvas = ref<HTMLCanvasElement | null>(null);
const includeLogo = ref(true);
const logoImage = new Image();
logoImage.src = '/checkmatemain.png';

// Color options
const colorOptions = [
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Purple', value: '#8b5cf6' },
  { label: 'Green', value: '#10b981' },
  { label: 'Red', value: '#ef4444' },
  { label: 'Orange', value: '#f59e0b' },
  { label: 'Pink', value: '#ec4899' },
];

// Generate QR code function
function generateQRCode() {
  if (!qrData.value.trim()) {
    alert('Please enter a URL for your QR code');
    return;
  }
  
  try {
    const typeNumber = 4;
    const errorCorrectionLevel = 'L';
    const qr = qrcode(typeNumber, errorCorrectionLevel);
    qr.addData(qrData.value);
    qr.make();
    
    if (qrCanvas.value) {
      const ctx = qrCanvas.value.getContext('2d');
      if (ctx) {
        const cellSize = qrSize.value / qr.getModuleCount();
        
        // Clear canvas
        ctx.clearRect(0, 0, qrCanvas.value.width, qrCanvas.value.height);
        
        // Set canvas size
        qrCanvas.value.width = qrSize.value;
        qrCanvas.value.height = qrSize.value;
        
        // Draw QR code
        for (let row = 0; row < qr.getModuleCount(); row++) {
          for (let col = 0; col < qr.getModuleCount(); col++) {
            ctx.fillStyle = qr.isDark(row, col) ? qrColor.value : '#ffffff';
            const x = col * cellSize;
            const y = row * cellSize;
            ctx.fillRect(x, y, cellSize, cellSize);
          }
        }
        
        // Add logo in the center if selected
        if (includeLogo.value) {
          logoImage.onload = () => {
            const logoSize = qrSize.value * 0.2; // Logo is 20% of QR code size
            const logoX = (qrSize.value - logoSize) / 2;
            const logoY = (qrSize.value - logoSize) / 2;
            
            // Draw white background for logo
            ctx.fillStyle = 'white';
            ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
            
            // Draw logo
            ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
          };
          
          // If image is already loaded, draw it immediately
          if (logoImage.complete) {
            const logoSize = qrSize.value * 0.2;
            const logoX = (qrSize.value - logoSize) / 2;
            const logoY = (qrSize.value - logoSize) / 2;
            
            // Draw white background for logo
            ctx.fillStyle = 'white';
            ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
            
            // Draw logo
            ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
          }
        }
        
        qrCodeGenerated.value = true;
      }
    }
  } catch (error) {
    console.error('Error generating QR code:', error);
    alert('Error generating QR code. Please try again.');
  }
}

// Download QR code function
function downloadQRCode() {
  if (!qrCodeGenerated.value || !qrCanvas.value) return;
  
  try {
    const link = document.createElement('a');
    link.download = 'checkmate-qrcode.png';
    link.href = qrCanvas.value.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error downloading QR code:', error);
    alert('Error downloading QR code. Please try again.');
  }
}

// Watch for changes to regenerate QR code
watch([qrColor, qrSize, includeLogo], () => {
  if (qrCodeGenerated.value) {
    generateQRCode();
  }
});

// Initialize canvas on mount
onMounted(() => {
  // Generate a sample QR code on mount
  if (qrData.value.trim()) {
    generateQRCode();
  }
});
</script>

<style scoped>
.color-option {
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.color-option:hover {
  transform: scale(1.1);
}

.qr-canvas {
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style> 