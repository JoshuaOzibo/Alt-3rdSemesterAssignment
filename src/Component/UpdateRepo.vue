<script setup>
import { ref } from 'vue';
import { useFetch } from '../Component/composables/UseFetch.js';

const props = defineProps({
    repo: {
        type: String,
        required: true
    }
})

console.log(props.repo)

const { apiToken } = useFetch();

const open = ref(false);

const repoName = ref(`${props.repo.name}`);
const repoDesc = ref(`${props.repo.description}`);

const handleSubmitData = async (e) => {
  const repoData = {
    name: repoName.value,
    description: repoDesc.value,
    private: false, // or true if you want to create a private repository
  };

  if (repoData.name && repoData.description) {
    try {
      const response = await fetch(`https://api.github.com/repos/JoshuaOzibo/${props.repo.name}`, {
        method: 'PATCH',
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
      console.log('Repository updated:', result);
      open.value = false; // Close the modal on success
    } catch (error) {
      console.error('Error updating repository:', error);
    }
    open.value = false;
  } else {
    open.value = true;
  }
};
</script>

<template>
  <div>
    <button class="py-[10px] border border-white rounded-md cursor-pointer px-[25px]" @click="(() => open = !open)">
      Update
    </button>

    <div class="Overlay" @click="(() => open = !open)" v-if="open">
        <div v-if="open" class="Backdrop p-[10px] rounded-md bg-green-700">
      <form @submit.prevent="handleSubmitData">
        <div>
          <label for="name">Name Of Repo</label><br />
          <input v-model="repoName" class="w-full h-[40px] border-black mt-[10px] rounded-md border pl-2 outline-none" type="text" />
        </div>
        <div class="mt-[10px]">
          <label for="discription">Discription Of Repo</label><br />
          <input v-model="repoDesc" class="w-full h-[40px] border-black mt-[10px] rounded-md border pl-2 outline-none" type="text" />
        </div>
        <button
          class="mt-[10px] bg-blue-400 mb-[5px] border px-[20px] py-[8px] rounded-md"
          type="submit"
        >
          Update Repo
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
  
