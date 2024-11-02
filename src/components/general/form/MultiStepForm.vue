<!-- components/MultiStepForm.vue -->
<template>
  <div class="w-full max-w-lg mx-auto p-8 bg-white shadow-md rounded-lg">
    <h2 class="text-2xl font-bold mb-4">Multi-Step Form</h2>

    <div class="steps mb-4">
      <span
        v-for="(step, index) in steps"
        :key="index"
        class="step"
        :class="{ 'step-primary': currentStep === index }"
      >
        Step {{ index + 1 }}
      </span>
    </div>

    <form @submit.prevent="handleSubmit">
      <!-- Step 1: Name -->
      <div v-if="currentStep === 0" class="step-container">
        <label class="block mb-2">Name</label>
        <input
          v-model="formData.name"
          type="text"
          class="input input-bordered w-full mb-2"
          required
        />
      </div>

      <!-- Step 2: Email -->
      <div v-if="currentStep === 1" class="step-container">
        <label class="block mb-2">Email</label>
        <input
          v-model="formData.email"
          type="email"
          class="input input-bordered w-full mb-2"
          required
        />
      </div>

      <!-- Step 3: Age -->
      <div v-if="currentStep === 2" class="step-container">
        <label class="block mb-2">Age</label>
        <input
          v-model="formData.age"
          type="number"
          class="input input-bordered w-full mb-2"
          required
        />
      </div>

      <!-- Step 4: Country -->
      <div v-if="currentStep === 3" class="step-container">
        <label class="block mb-2">Country</label>
        <input
          v-model="formData.country"
          type="text"
          class="input input-bordered w-full mb-2"
          required
        />
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between mt-4">
        <button
          v-if="currentStep > 0"
          type="button"
          @click="prevStep"
          class="btn btn-secondary"
        >
          Previous
        </button>
        <button
          v-if="currentStep < steps.length - 1"
          type="button"
          @click="nextStep"
          class="btn btn-primary"
        >
          Next
        </button>
        <button
          v-if="currentStep === steps.length - 1"
          type="submit"
          class="btn btn-success"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Steps configuration and current step
const steps = ['Name', 'Email', 'Age', 'Country'];
const currentStep = ref(0);

// Form data state
const formData = ref({
  name: '',
  email: '',
  age: '',
  country: '',
});

// Function to validate only fields in the current step
const validateCurrentStep = (): boolean => {
  const stepContainer = document.querySelector('.step-container');
  if (!stepContainer) return false;

  // Check validity of each input in the current step container
  const inputs = stepContainer.querySelectorAll('input[required]');
  for (const input of inputs) {
    if (!(input as HTMLInputElement).checkValidity()) {
      (input as HTMLInputElement).reportValidity();
      return false;
    }
  }
  return true;
};

// Navigation methods
const nextStep = () => {
  if (validateCurrentStep()) {
    currentStep.value++;
  }
};

const prevStep = () => {
  currentStep.value--;
};

// Submit form handler
const handleSubmit = () => {
  if (validateCurrentStep()) {
    console.log('Form submitted:', formData.value);
    alert('Form submitted successfully!');
    resetForm();
  }
};

// Reset form data and step
const resetForm = () => {
  formData.value = { name: '', email: '', age: '', country: '' };
  currentStep.value = 0;
};
</script>

<style scoped>
.steps {
  display: flex;
  justify-content: space-between;
}
.step {
  padding: 0.5rem;
  background-color: #e5e7eb;
  color: #1f2937;
  border-radius: 50%;
  text-align: center;
  width: 2.5rem;
  height: 2.5rem;
}
.step-primary {
  background-color: #3b82f6;
  color: white;
}
</style>
