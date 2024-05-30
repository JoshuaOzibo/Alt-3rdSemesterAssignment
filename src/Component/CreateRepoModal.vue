<script setup>
import { ref } from 'vue';
import {useFetch} from './composables/UseFetch.js';


const { apiToken } = useFetch();

const open = ref(false);
const repoName = ref('');
const repoDesc = ref('');

const handleSubmitData = async (e) => {
  const repoData = {
    name: repoName.value,
    description: repoDesc.value,
    private: false, // or true if you want to create a private repository
  };

  if (repoData.name && repoData.description) {
    try {
      const response = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          "Accept": "application/vnd.github+json",
          "Authorization": `Bearer ${apiToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(repoData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Repository created:', result);
      open.value = false; // Close the modal on success
    } catch (error) {
      console.error('Error creating repository:', error);
    }
    open.value = false;
  } else {
    open.value = true;
  }

  repoName.value = '';
  repoDesc.value = '';
};
</script>

<template>
    <div>
      <button class="border-2 mb-[10px] border-black p-[10px] rounded-md" @click="(() => open = !open)">
        Add New Repo
      </button>
  
      <div class="Overlay" v-if="open">
        <div v-if="open" class="Backdrop p-[10px] rounded-md">
          <div class="w-full flex justify-end">
            <button @click="(() => open = !open)" class="text-xl px-[15px] py-[5px] rounded-md border-2 border-black">X</button>
          </div>
        <form @submit.prevent="handleSubmitData">
          <div>
            <label for="name">Name Of Repo</label><br />
            <input v-model="repoName" class="w-full h-[40px] border-black mt-[10px] rounded-md border pl-2 outline-none" type="text" />
          </div>
          <div class="mt-[10px]">
            <label for="discription">Discription Of Repo</label><br />
            <input v-model="repoName" class="w-full h-[40px] border-black mt-[10px] rounded-md border pl-2 outline-none" type="text" />
          </div>
          <button
            class="mt-[20px] bg-green-400 mb-[5px] border px-[20px] py-[8px] rounded-md"
            type="submit"
          >
            Create Repo
          </button>
        </form>

      </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .Overlay{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    z-index: 10;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.65);
}

  .Backdrop{
    max-width: 150%;
    position: fixed;
    top: 10vh;
    left: 15%;
    width: 70%;
    padding-top: -50px;
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    z-index: 20;
}
  </style>
  