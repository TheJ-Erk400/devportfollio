<template>
  <div class="cv-generator card p-4 md:p-8">
    <h2 class="text-2xl md:text-3xl font-bold mb-4 md:mb-6 gradient-text text-center">Resume Builder</h2>
    
    <div v-if="!isGenerating" class="user-form">
      <!-- Personal Information -->
      <div class="mb-6">
        <h3 class="text-xl font-bold mb-3 text-blue-400">Personal Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2">Full Name</label>
            <input v-model="profile.personalInfo.name" type="text" class="w-full p-2 rounded bg-gray-800 border border-gray-700">
          </div>
          <div>
            <label class="block mb-2">Title</label>
            <input v-model="profile.personalInfo.title" type="text" class="w-full p-2 rounded bg-gray-800 border border-gray-700">
          </div>
          <div>
            <label class="block mb-2">Email</label>
            <input v-model="profile.personalInfo.email" type="email" class="w-full p-2 rounded bg-gray-800 border border-gray-700">
          </div>
          <div>
            <label class="block mb-2">Phone</label>
            <input v-model="profile.personalInfo.phone" type="tel" class="w-full p-2 rounded bg-gray-800 border border-gray-700">
          </div>
          <div class="md:col-span-2">
            <label class="block mb-2">Summary</label>
            <textarea v-model="profile.personalInfo.summary" rows="3" class="w-full p-2 rounded bg-gray-800 border border-gray-700"></textarea>
          </div>
        </div>
      </div>
      
      <!-- Skills -->
      <div class="mb-6">
        <h3 class="text-xl font-bold mb-3 text-blue-400">Skills</h3>
        <div class="flex flex-wrap gap-2 mb-3">
          <div v-for="(skill, index) in profile.skills" :key="index" class="skill-tag bg-blue-900 py-1 px-3 rounded-full flex items-center">
            <span>{{ skill }}</span>
            <button @click="removeSkill(index)" class="ml-2 text-red-400 hover:text-red-300">×</button>
          </div>
        </div>
        <div class="flex">
          <input v-model="newSkill" type="text" class="flex-grow p-2 rounded-l bg-gray-800 border border-gray-700" placeholder="Add a skill">
          <button @click="addSkill" class="bg-blue-600 hover:bg-blue-700 px-4 rounded-r text-white">Add</button>
        </div>
      </div>
      
      <!-- Experience -->
      <div class="mb-6">
        <h3 class="text-xl font-bold mb-3 text-blue-400">Experience</h3>
        <div v-for="(exp, index) in profile.experience" :key="index" class="mb-4 p-3 border border-gray-700 rounded">
          <div class="flex justify-between mb-2">
            <h4 class="font-bold">{{ exp.position }} at {{ exp.company }}</h4>
            <button @click="removeExperience(index)" class="text-red-400 hover:text-red-300">Remove</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <div>
              <label class="block mb-1">Company</label>
              <input v-model="exp.company" type="text" class="w-full p-2 rounded bg-gray-800 border border-gray-700">
            </div>
            <div>
              <label class="block mb-1">Position</label>
              <input v-model="exp.position" type="text" class="w-full p-2 rounded bg-gray-800 border border-gray-700">
            </div>
            <div>
              <label class="block mb-1">Start Date</label>
              <input v-model="exp.startDate" type="text" class="w-full p-2 rounded bg-gray-800 border border-gray-700">
            </div>
            <div>
              <label class="block mb-1">End Date</label>
              <input v-model="exp.endDate" type="text" class="w-full p-2 rounded bg-gray-800 border border-gray-700">
            </div>
          </div>
          <div>
            <label class="block mb-1">Description</label>
            <textarea v-model="exp.description" rows="3" class="w-full p-2 rounded bg-gray-800 border border-gray-700"></textarea>
          </div>
        </div>
        <button @click="addExperience" class="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">Add Experience</button>
      </div>
      
      <!-- Education -->
      <div class="mb-6">
        <h3 class="text-xl font-bold mb-3 text-blue-400">Education</h3>
        <div v-for="(edu, index) in profile.education" :key="index" class="mb-4 p-3 border border-gray-700 rounded">
          <div class="flex justify-between mb-2">
            <h4 class="font-bold">{{ edu.degree }} at {{ edu.institution }}</h4>
            <button @click="removeEducation(index)" class="text-red-400 hover:text-red-300">Remove</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <div>
              <label class="block mb-1">Institution</label>
              <input v-model="edu.institution" type="text" class="w-full p-2 rounded bg-gray-800 border border-gray-700">
            </div>
            <div>
              <label class="block mb-1">Degree</label>
              <input v-model="edu.degree" type="text" class="w-full p-2 rounded bg-gray-800 border border-gray-700">
            </div>
            <div>
              <label class="block mb-1">Start Date</label>
              <input v-model="edu.startDate" type="text" class="w-full p-2 rounded bg-gray-800 border border-gray-700">
            </div>
            <div>
              <label class="block mb-1">End Date</label>
              <input v-model="edu.endDate" type="text" class="w-full p-2 rounded bg-gray-800 border border-gray-700">
            </div>
          </div>
        </div>
        <button @click="addEducation" class="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">Add Education</button>
      </div>
      
      <!-- Projects -->
      <div class="mb-6">
        <h3 class="text-xl font-bold mb-3 text-blue-400">Projects</h3>
        <div v-for="(project, index) in profile.projects" :key="index" class="mb-4 p-3 border border-gray-700 rounded">
          <div class="flex justify-between mb-2">
            <h4 class="font-bold">{{ project.name }}</h4>
            <button @click="removeProject(index)" class="text-red-400 hover:text-red-300">Remove</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <div>
              <label class="block mb-1">Project Name</label>
              <input v-model="project.name" type="text" class="w-full p-2 rounded bg-gray-800 border border-gray-700">
            </div>
            <div>
              <label class="block mb-1">URL</label>
              <input v-model="project.url" type="text" class="w-full p-2 rounded bg-gray-800 border border-gray-700">
            </div>
          </div>
          <div>
            <label class="block mb-1">Description</label>
            <textarea v-model="project.description" rows="3" class="w-full p-2 rounded bg-gray-800 border border-gray-700"></textarea>
          </div>
        </div>
        <button @click="addProject" class="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">Add Project</button>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex gap-4 justify-center mt-8">
        <button @click="generateCV('modern')" class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300">
          <i class="fas fa-file-pdf mr-2"></i> Generate Modern CV
        </button>
        <button @click="generateCV('classic')" class="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300">
          <i class="fas fa-file-alt mr-2"></i> Generate Classic CV
        </button>
      </div>
      
      <div class="mt-8">
        <button @click="analyzeWithAI" class="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg text-lg transition duration-300">
          <i class="fas fa-magic mr-2"></i> Analyze & Enhance with AI
        </button>
      </div>
    </div>
    
    <div v-else class="generating-cv text-center p-8">
      <div class="mb-4">
        <i class="fas fa-spinner fa-spin text-4xl text-blue-400"></i>
      </div>
      <h3 class="text-2xl font-bold mb-2">Generating Your Resume</h3>
      <p class="mb-6">Please wait while we create your professional resume...</p>
      <div class="w-full bg-gray-700 rounded-full h-2.5 mb-4">
        <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: `${progressPercent}%` }"></div>
      </div>
    </div>
    
    <div ref="resumePreview" class="resume-preview hidden"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';
import { marked } from 'marked';

// Initialize pdfMake
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// State
const isGenerating = ref(false);
const progressPercent = ref(0);
const resumePreview = ref<HTMLElement | null>(null);
const newSkill = ref('');
const logoUrl = '/checkmatemain.png';

// Profile data
const profile = reactive({
  personalInfo: {
    name: '',
    title: '',
    email: '',
    phone: '',
    summary: ''
  },
  skills: [] as string[],
  experience: [] as {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[],
  education: [] as {
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
  }[],
  projects: [] as {
    name: string;
    url: string;
    description: string;
  }[]
});

// Methods
function addSkill() {
  if (newSkill.value.trim()) {
    profile.skills.push(newSkill.value.trim());
    newSkill.value = '';
  }
}

function removeSkill(index: number) {
  profile.skills.splice(index, 1);
}

function addExperience() {
  profile.experience.push({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: ''
  });
}

function removeExperience(index: number) {
  profile.experience.splice(index, 1);
}

function addEducation() {
  profile.education.push({
    institution: '',
    degree: '',
    startDate: '',
    endDate: ''
  });
}

function removeEducation(index: number) {
  profile.education.splice(index, 1);
}

function addProject() {
  profile.projects.push({
    name: '',
    url: '',
    description: ''
  });
}

function removeProject(index: number) {
  profile.projects.splice(index, 1);
}

async function generateCV(template: 'modern' | 'classic') {
  if (!validateForm()) return;
  
  isGenerating.value = true;
  progressPercent.value = 10;
  
  try {
    // Prepare data for PDF
    await new Promise(resolve => setTimeout(resolve, 500));
    progressPercent.value = 30;
    
    // Choose template based on selection
    if (template === 'modern') {
      await generateModernTemplate();
    } else {
      await generateClassicTemplate();
    }
    
    progressPercent.value = 100;
    
    // Reset after generation
    setTimeout(() => {
      isGenerating.value = false;
      progressPercent.value = 0;
    }, 1000);
  } catch (error) {
    console.error('Error generating CV:', error);
    alert('Error generating CV. Please try again.');
    isGenerating.value = false;
  }
}

async function generateModernTemplate() {
  // Get logo image as base64
  const logoImg = await getBase64Image(logoUrl);
  
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      image: logoImg,
      width: 60,
      alignment: 'right',
      margin: [0, 20, 40, 0]
    },
    content: [
      {
        text: profile.personalInfo.name,
        fontSize: 24,
        bold: true,
        color: '#3b82f6',
        margin: [0, 0, 0, 5]
      },
      {
        text: profile.personalInfo.title,
        fontSize: 14,
        italic: true,
        color: '#4b5563',
        margin: [0, 0, 0, 20]
      },
      {
        columns: [
          {
            width: 'auto',
            text: profile.personalInfo.email,
            margin: [0, 0, 20, 0]
          },
          {
            width: 'auto',
            text: profile.personalInfo.phone
          }
        ],
        margin: [0, 0, 0, 15]
      },
      {
        text: 'Profile',
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 10],
        color: '#3b82f6'
      },
      {
        text: profile.personalInfo.summary,
        margin: [0, 0, 0, 15]
      },
      {
        text: 'Skills',
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 10],
        color: '#3b82f6'
      },
      {
        ul: profile.skills.map(skill => skill),
        margin: [0, 0, 0, 15]
      },
      {
        text: 'Experience',
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 10],
        color: '#3b82f6'
      },
      ...profile.experience.map(exp => [
        {
          text: `${exp.position} at ${exp.company}`,
          bold: true,
          margin: [0, 5, 0, 0]
        },
        {
          text: `${exp.startDate} - ${exp.endDate}`,
          italic: true,
          color: '#4b5563',
          margin: [0, 0, 0, 5]
        },
        {
          text: exp.description,
          margin: [0, 0, 0, 10]
        }
      ]).flat(),
      {
        text: 'Education',
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 10],
        color: '#3b82f6'
      },
      ...profile.education.map(edu => [
        {
          text: `${edu.degree}, ${edu.institution}`,
          bold: true,
          margin: [0, 5, 0, 0]
        },
        {
          text: `${edu.startDate} - ${edu.endDate}`,
          italic: true,
          color: '#4b5563',
          margin: [0, 0, 0, 10]
        }
      ]).flat(),
      {
        text: 'Projects',
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 10],
        color: '#3b82f6'
      },
      ...profile.projects.map(proj => [
        {
          text: proj.name,
          bold: true,
          margin: [0, 5, 0, 0]
        },
        {
          text: proj.url,
          color: '#3b82f6',
          link: proj.url.startsWith('http') ? proj.url : `https://${proj.url}`,
          margin: [0, 0, 0, 5]
        },
        {
          text: proj.description,
          margin: [0, 0, 0, 10]
        }
      ]).flat()
    ],
    footer: {
      columns: [
        { 
          text: 'Generated with CheckMate.AI',
          alignment: 'center',
          color: '#6B7280',
          fontSize: 8
        }
      ],
      margin: [40, 0]
    },
    defaultStyle: {
      font: 'Roboto'
    }
  };
  
  const pdfDoc = pdfMake.createPdf(docDefinition);
  pdfDoc.download(`${profile.personalInfo.name.replace(/\s+/g, '_')}_Resume_Modern.pdf`);
}

async function generateClassicTemplate() {
  // Get logo image as base64
  const logoImg = await getBase64Image(logoUrl);
  
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      columns: [
        {
          image: logoImg,
          width: 40,
          alignment: 'left'
        },
        {
          text: 'Professional Resume',
          alignment: 'right',
          margin: [0, 10, 40, 0],
          fontSize: 10,
          color: '#6B7280'
        }
      ],
      margin: [40, 20, 40, 20]
    },
    content: [
      {
        text: profile.personalInfo.name.toUpperCase(),
        alignment: 'center',
        fontSize: 20,
        bold: true,
        margin: [0, 0, 0, 5]
      },
      {
        text: profile.personalInfo.title,
        alignment: 'center',
        fontSize: 12,
        margin: [0, 0, 0, 15]
      },
      {
        columns: [
          {
            width: '*',
            text: profile.personalInfo.email,
            alignment: 'center'
          },
          {
            width: '*',
            text: profile.personalInfo.phone,
            alignment: 'center'
          }
        ],
        margin: [0, 0, 0, 20]
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, color: '#D1D5DB' }],
        margin: [0, 0, 0, 10]
      },
      {
        text: 'SUMMARY',
        fontSize: 12,
        bold: true,
        margin: [0, 10, 0, 10]
      },
      {
        text: profile.personalInfo.summary,
        margin: [0, 0, 0, 15]
      },
      {
        text: 'SKILLS',
        fontSize: 12,
        bold: true,
        margin: [0, 10, 0, 10]
      },
      {
        text: profile.skills.join(', '),
        margin: [0, 0, 0, 15]
      },
      {
        text: 'PROFESSIONAL EXPERIENCE',
        fontSize: 12,
        bold: true,
        margin: [0, 10, 0, 10]
      },
      ...profile.experience.map(exp => [
        {
          columns: [
            {
              width: '*',
              text: `${exp.position}, ${exp.company}`,
              bold: true
            },
            {
              width: 'auto',
              text: `${exp.startDate} - ${exp.endDate}`,
              alignment: 'right',
              italics: true
            }
          ],
          margin: [0, 5, 0, 5]
        },
        {
          text: exp.description,
          margin: [0, 0, 0, 10]
        }
      ]).flat(),
      {
        text: 'EDUCATION',
        fontSize: 12,
        bold: true,
        margin: [0, 10, 0, 10]
      },
      ...profile.education.map(edu => [
        {
          columns: [
            {
              width: '*',
              text: `${edu.degree}, ${edu.institution}`,
              bold: true
            },
            {
              width: 'auto',
              text: `${edu.startDate} - ${edu.endDate}`,
              alignment: 'right',
              italics: true
            }
          ],
          margin: [0, 5, 0, 10]
        }
      ]).flat(),
      {
        text: 'PROJECTS',
        fontSize: 12,
        bold: true,
        margin: [0, 10, 0, 10]
      },
      ...profile.projects.map(proj => [
        {
          text: proj.name,
          bold: true,
          margin: [0, 5, 0, 0]
        },
        {
          text: proj.url,
          color: '#3b82f6',
          link: proj.url.startsWith('http') ? proj.url : `https://${proj.url}`,
          margin: [0, 0, 0, 5]
        },
        {
          text: proj.description,
          margin: [0, 0, 0, 10]
        }
      ]).flat()
    ],
    footer: {
      columns: [
        { 
          text: 'Generated with CheckMate.AI',
          alignment: 'center',
          color: '#6B7280',
          fontSize: 8
        }
      ],
      margin: [40, 0]
    }
  };
  
  const pdfDoc = pdfMake.createPdf(docDefinition);
  pdfDoc.download(`${profile.personalInfo.name.replace(/\s+/g, '_')}_Resume_Classic.pdf`);
}

// Add a helper function to convert the logo image to base64
async function getBase64Image(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      } else {
        reject(new Error('Could not get canvas context'));
      }
    };
    img.onerror = function() {
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

function analyzeWithAI() {
  // This would connect to an AI service for resume enhancement
  alert('AI analysis will suggest improvements to your resume content. This feature will be available in the full version.');
}
</script>

<style scoped>
.skill-tag {
  transition: all 0.3s ease;
}

.skill-tag:hover {
  background-color: rgba(59, 130, 246, 0.7);
}

.resume-preview {
  position: absolute;
  left: -9999px;
  top: -9999px;
}
</style> 