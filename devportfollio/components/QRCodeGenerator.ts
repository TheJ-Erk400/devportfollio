import { defineComponent, ref, onMounted } from 'vue';
import QRCode from 'qrcode-generator';

interface Props {
  data: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
}

export default defineComponent({
  name: 'QRCodeGenerator',
  props: {
    data: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 5
    },
    level: {
      type: String as () => 'L' | 'M' | 'Q' | 'H',
      default: 'M'
    }
  },
  setup(props) {
    const qrCodeRef = ref<HTMLElement | null>(null);

    const generateQRCode = () => {
      try {
        const qr = QRCode(0, props.level);
        qr.addData(props.data);
        qr.make();
        if (qrCodeRef.value) {
          qrCodeRef.value.innerHTML = qr.createImgTag(props.size, 10);
        }
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    const downloadQRCode = () => {
      const qrCodeImg = qrCodeRef.value?.querySelector('img');
      if (qrCodeImg) {
        const link = document.createElement('a');
        link.href = qrCodeImg.src;
        link.download = 'qr-code.png';
        link.click();
      }
    };

    onMounted(() => {
      generateQRCode();
    });

    return {
      qrCodeRef,
      downloadQRCode
    };
  },
  template: `
    <div class="qr-code-container">
      <div ref="qrCodeRef" class="qr-code"></div>
      <button 
        @click="downloadQRCode" 
        class="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Download QR Code
      </button>
    </div>
  `
}); 