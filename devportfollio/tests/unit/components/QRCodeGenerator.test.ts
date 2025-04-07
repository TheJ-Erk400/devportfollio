import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import QRCodeGenerator from '@/components/QRCodeGenerator';

// Mock qrcode-generator
vi.mock('qrcode-generator', () => {
  return {
    default: function() {
      return {
        addData: vi.fn(),
        make: vi.fn(),
        getModuleCount: () => 25,
        isDark: (row: number, col: number) => (row + col) % 2 === 0 // Simple pattern for testing
      };
    }
  };
});

// Mock window.alert
vi.spyOn(window, 'alert').mockImplementation(() => {});

describe('QRCodeGenerator', () => {
  let wrapper: any;
  let mockCanvas: HTMLCanvasElement;
  let mockContext: any;

  beforeEach(() => {
    // Create a mock canvas and context
    mockCanvas = document.createElement('canvas');
    mockContext = {
      clearRect: vi.fn(),
      fillStyle: '',
      fillRect: vi.fn(),
    };
    vi.spyOn(mockCanvas, 'getContext').mockReturnValue(mockContext);
    
    // Set up document.createElement mock to return our mock canvas
    const originalCreateElement = document.createElement;
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'canvas') return mockCanvas;
      if (tagName === 'a') {
        const link = document.createElement('a');
        link.click = vi.fn();
        return link;
      }
      return originalCreateElement.call(document, tagName);
    });
    
    // Mount the component
    wrapper = mount(QRCodeGenerator);
    
    // Set the qrCanvas ref to our mock canvas
    wrapper.vm.qrCanvas = mockCanvas;
  });

  it('renders QR code with correct data', async () => {
    const wrapper = mount(QRCodeGenerator, {
      props: {
        data: 'https://example.com',
        size: 5,
        level: 'M'
      }
    });

    // Wait for the QR code to be generated
    await wrapper.vm.$nextTick();

    // Check if the QR code image is rendered
    const qrCodeImg = wrapper.find('.qr-code img');
    expect(qrCodeImg.exists()).toBe(true);
  });

  it('handles QR code generation errors gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const wrapper = mount(QRCodeGenerator, {
      props: {
        data: 'invalid-data',
        size: 5,
        level: 'M'
      }
    });

    await wrapper.vm.$nextTick();
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('downloads QR code when download button is clicked', async () => {
    // Set up the component with a generated QR code
    await wrapper.setData({ qrCodeGenerated: true });
    
    // Mock toDataURL
    mockCanvas.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,fakedata');
    
    // Click the download button
    const downloadButton = wrapper.find('button:nth-of-type(2)');
    await downloadButton.trigger('click');
    
    // Check if download link was created and clicked
    expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
    const mockLink = document.createElement('a');
    expect(mockLink.download).toBe('checkmate-qrcode.png');
    expect(mockLink.href).toBe('data:image/png;base64,fakedata');
    expect(mockLink.click).toHaveBeenCalled();
  });

  it('updates QR code when data prop changes', async () => {
    const wrapper = mount(QRCodeGenerator, {
      props: {
        data: 'https://example.com',
        size: 5,
        level: 'M'
      }
    });

    await wrapper.vm.$nextTick();
    const initialSrc = wrapper.find('.qr-code img').attributes('src');

    await wrapper.setProps({ data: 'https://new-example.com' });
    await wrapper.vm.$nextTick();
    const newSrc = wrapper.find('.qr-code img').attributes('src');

    expect(newSrc).not.toBe(initialSrc);
  });

  it('renders the component correctly', () => {
    expect(wrapper.find('.qr-generator').exists()).toBe(true);
    expect(wrapper.find('h2').text()).toBe('QR Code Generator');
  });

  it('initializes with default values', () => {
    expect(wrapper.vm.qrData).toBe('https://github.com/');
    expect(wrapper.vm.qrSize).toBe(200);
    expect(wrapper.vm.qrColor).toBe('#3b82f6'); // Default blue color
    expect(wrapper.vm.qrCodeGenerated).toBe(false);
  });

  it('displays color options', () => {
    const colorOptions = wrapper.findAll('.color-option');
    expect(colorOptions.length).toBe(6); // 6 color options
  });

  it('selects a different color when clicked', async () => {
    const purpleOption = wrapper.findAll('.color-option')[1]; // Purple option
    await purpleOption.trigger('click');
    expect(wrapper.vm.qrColor).toBe('#8b5cf6'); // Purple color
  });

  it('changes QR size when slider is adjusted', async () => {
    const slider = wrapper.find('input[type="range"]');
    await slider.setValue(250);
    expect(wrapper.vm.qrSize).toBe(250);
  });

  it('generates a QR code when button is clicked', async () => {
    // Set up the data
    await wrapper.setData({ qrData: 'https://test.com' });
    
    // Click the generate button
    const generateButton = wrapper.find('button:first-of-type');
    await generateButton.trigger('click');
    
    // Check if the canvas was set up
    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    expect(mockContext.clearRect).toHaveBeenCalled();
    expect(mockContext.fillRect).toHaveBeenCalled();
    expect(wrapper.vm.qrCodeGenerated).toBe(true);
  });

  it('shows alert when attempting to generate with empty URL', async () => {
    // Set empty data
    await wrapper.setData({ qrData: '' });
    
    // Click the generate button
    const generateButton = wrapper.find('button:first-of-type');
    await generateButton.trigger('click');
    
    // Check if alert was called
    expect(window.alert).toHaveBeenCalledWith('Please enter a URL for your QR code');
    expect(wrapper.vm.qrCodeGenerated).toBe(false);
  });

  it('disables the download button when no QR code is generated', () => {
    wrapper.vm.qrCodeGenerated = false;
    const downloadButton = wrapper.find('button:nth-of-type(2)');
    expect(downloadButton.attributes('disabled')).toBe('');
  });

  it('enables the download button when QR code is generated', async () => {
    await wrapper.setData({ qrCodeGenerated: true });
    const downloadButton = wrapper.find('button:nth-of-type(2)');
    expect(downloadButton.attributes('disabled')).toBeUndefined();
  });

  it('updates the QR code when size changes after initial generation', async () => {
    // Generate a QR code first
    await wrapper.setData({ qrData: 'https://test.com' });
    const generateButton = wrapper.find('button:first-of-type');
    await generateButton.trigger('click');
    
    // Clear the mock to check if it's called again
    mockContext.clearRect.mockClear();
    mockContext.fillRect.mockClear();
    
    // Change the size
    await wrapper.setData({ qrSize: 250 });
    
    // Check if the QR code was regenerated
    expect(mockContext.clearRect).toHaveBeenCalled();
    expect(mockContext.fillRect).toHaveBeenCalled();
  });

  it('updates the QR code when color changes after initial generation', async () => {
    // Generate a QR code first
    await wrapper.setData({ qrData: 'https://test.com' });
    const generateButton = wrapper.find('button:first-of-type');
    await generateButton.trigger('click');
    
    // Clear the mock to check if it's called again
    mockContext.clearRect.mockClear();
    mockContext.fillRect.mockClear();
    
    // Change the color
    await wrapper.setData({ qrColor: '#ef4444' });
    
    // Check if the QR code was regenerated
    expect(mockContext.clearRect).toHaveBeenCalled();
    expect(mockContext.fillRect).toHaveBeenCalled();
  });
}); 