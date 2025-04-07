import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import CVGenerator from '../../../src/components/CVGenerator.vue';

// Mock the PDF generation libraries
vi.mock('jspdf', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      internal: {
        pageSize: {
          getWidth: () => 210,
        },
      },
      getImageProperties: () => ({ height: 297, width: 210 }),
      addImage: vi.fn(),
      save: vi.fn(),
    })),
  };
});

vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: () => 'data:image/png;base64,mockImageData',
  }),
}));

vi.mock('pdfmake/build/pdfmake', () => ({
  default: {
    vfs: {},
    createPdf: vi.fn().mockReturnValue({
      download: vi.fn(),
    }),
  },
}));

vi.mock('pdfmake/build/vfs_fonts', () => ({
  default: {
    pdfMake: {
      vfs: {},
    },
  },
}));

vi.mock('html-to-pdfmake', () => ({
  default: vi.fn().mockReturnValue({}),
}));

vi.mock('marked', () => ({
  marked: {
    parse: vi.fn().mockReturnValue(''),
  },
}));

describe('CVGenerator.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(CVGenerator);
    
    // Mock the resumePreview ref
    Object.defineProperty(wrapper.vm, 'resumePreview', {
      value: {
        innerHTML: '<div>Mock Resume</div>',
      },
    });
  });

  it('renders the component correctly', () => {
    expect(wrapper.find('.cv-generator').exists()).toBe(true);
    expect(wrapper.find('h2').text()).toContain('Resume Builder');
  });

  it('initializes with empty profile data', () => {
    const profile = wrapper.vm.profile;
    expect(profile.personalInfo.name).toBe('');
    expect(profile.personalInfo.title).toBe('');
    expect(profile.skills).toEqual([]);
    expect(profile.experience).toEqual([]);
    expect(profile.education).toEqual([]);
    expect(profile.projects).toEqual([]);
  });

  it('adds and removes skills', async () => {
    // Add a skill
    wrapper.vm.newSkill = 'JavaScript';
    await wrapper.vm.addSkill();
    expect(wrapper.vm.profile.skills).toContain('JavaScript');

    // Add a second skill
    wrapper.vm.newSkill = 'TypeScript';
    await wrapper.vm.addSkill();
    expect(wrapper.vm.profile.skills).toContain('TypeScript');

    // Remove a skill
    await wrapper.vm.removeSkill(0);
    expect(wrapper.vm.profile.skills).not.toContain('JavaScript');
    expect(wrapper.vm.profile.skills).toContain('TypeScript');
  });

  it('adds and removes experience entries', async () => {
    // Add experience
    await wrapper.vm.addExperience();
    expect(wrapper.vm.profile.experience.length).toBe(1);

    // Update the experience details
    wrapper.vm.profile.experience[0].company = 'Tech Corp';
    wrapper.vm.profile.experience[0].position = 'Developer';
    expect(wrapper.vm.profile.experience[0].company).toBe('Tech Corp');

    // Remove experience
    await wrapper.vm.removeExperience(0);
    expect(wrapper.vm.profile.experience.length).toBe(0);
  });

  it('adds and removes education entries', async () => {
    // Add education
    await wrapper.vm.addEducation();
    expect(wrapper.vm.profile.education.length).toBe(1);

    // Update the education details
    wrapper.vm.profile.education[0].institution = 'University';
    wrapper.vm.profile.education[0].degree = 'Computer Science';
    expect(wrapper.vm.profile.education[0].institution).toBe('University');

    // Remove education
    await wrapper.vm.removeEducation(0);
    expect(wrapper.vm.profile.education.length).toBe(0);
  });

  it('adds and removes project entries', async () => {
    // Add project
    await wrapper.vm.addProject();
    expect(wrapper.vm.profile.projects.length).toBe(1);

    // Update the project details
    wrapper.vm.profile.projects[0].name = 'Portfolio Project';
    wrapper.vm.profile.projects[0].url = 'https://example.com';
    expect(wrapper.vm.profile.projects[0].name).toBe('Portfolio Project');

    // Remove project
    await wrapper.vm.removeProject(0);
    expect(wrapper.vm.profile.projects.length).toBe(0);
  });

  it('generates a modern CV', async () => {
    // Fill in some data
    wrapper.vm.profile.personalInfo.name = 'John Doe';
    wrapper.vm.profile.personalInfo.title = 'Developer';
    
    // Spy on the methods
    const generateModernHTMLSpy = vi.spyOn(wrapper.vm, 'generateModernHTML');
    const generateModernPDFSpy = vi.spyOn(wrapper.vm, 'generateModernPDF');

    // Generate the CV
    await wrapper.vm.generateCV('modern');

    // Check if the methods were called
    expect(generateModernHTMLSpy).toHaveBeenCalled();
    expect(generateModernPDFSpy).toHaveBeenCalled();
    
    // Check if the isGenerating state was updated correctly
    expect(wrapper.vm.isGenerating).toBe(false);
  });

  it('generates a classic CV', async () => {
    // Fill in some data
    wrapper.vm.profile.personalInfo.name = 'Jane Smith';
    wrapper.vm.profile.personalInfo.title = 'Designer';
    
    // Spy on the methods
    const generateClassicHTMLSpy = vi.spyOn(wrapper.vm, 'generateClassicHTML');
    const generateClassicPDFSpy = vi.spyOn(wrapper.vm, 'generateClassicPDF');

    // Generate the CV
    await wrapper.vm.generateCV('classic');

    // Check if the methods were called
    expect(generateClassicHTMLSpy).toHaveBeenCalled();
    expect(generateClassicPDFSpy).toHaveBeenCalled();
    
    // Check if the isGenerating state was updated correctly
    expect(wrapper.vm.isGenerating).toBe(false);
  });

  it('handles the AI analysis feature', async () => {
    // Spy on window.alert
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    // Trigger AI analysis
    await wrapper.vm.analyzeWithAI();
    
    // Check if alert was called with the expected message
    expect(alertSpy).toHaveBeenCalledWith(
      expect.stringContaining('AI analysis will suggest improvements')
    );
  });
}); 