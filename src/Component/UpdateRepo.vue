<script setup>
import { ref } from 'vue';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const props = defineProps({
    repo: {
        type: String,
        required: true
    }
})

console.log(props.repo)

const apiToken = import.meta.env.VITE_APP_GITHUB_TOKEN;

const open = ref(false);

const repoName = ref(`${props.repo.name}`);
const repoDesc = ref(`${props.repo.description}`);

const handleSubmitData = async (e) => {
  const repoData = {
    name: repoName.value,
    description: repoDesc.value,
    private: false,
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
      // console.log('Repository updated:', result);

      // Update the local state with the new repository data
      Object.assign(props.repo, result);

      // Close the modal 
      open.value = false;
      toast("Repository Updated Successfully..", {
        "theme": "auto",
        "type": "success",
        "autoClose": 1000,
        "dangerouslyHTMLString": true
      })
      
    } catch (error) {
      // console.error('Error updating repository:', error);
      toast("Error updating repository", {
        "theme": "auto",
        "type": "error",
        "autoClose": 1000,
        "dangerouslyHTMLString": true
      })
    }
  } else {
    open.value = true;
  }
};

</script>

<template>
  <div>
    <button class="py-[10px] border border-[#3fb27f] text-[#3fb27f] bg-[#33475b] hover:bg-[#48e6a5] hover:text-[#33475b] transition-all rounded-md cursor-pointer px-[25px]" @click="(() => open = !open)">
      Update
    </button>

    <div class="Overlay" v-if="open">
        <div v-if="open" class="Backdrop p-[10px] rounded-md">
          <div class="w-full flex justify-end">
            <button @click="(() => open = !open)" class="text-xl px-[15px] py-[5px] hover:bg-[#48e6a5] text-[#3fb27f] rounded-md border-2 border-[#3fb27f] hover:border-[#33475b] hover:text-[#33475b] transition-all font-extrabold">X</button>
          </div>
      <form @submit.prevent="handleSubmitData">
        <div>
          <label class="text-[#3fb27f] font-bold" for="name">Name Of Repo:</label><br />
          <input v-model="repoName" class="w-full h-[40px] border-black mt-[10px] rounded-md border pl-2 outline-none" type="text" />
        </div>
        <div class="mt-[10px]">
          <label class="text-[#3fb27f] font-bold" for="discription">Discription Of Repo:</label><br />
          <input v-model="repoDesc" class="w-full h-[40px] border-black mt-[10px] rounded-md border pl-2 outline-none" type="text" />
        </div>
        <button
        class="mt-[20px] border border-[#3fb27f] text-[#3fb27f] bg-[#33475b] hover:bg-[#48e6a5] hover:text-[#33475b] transition-all mb-[5px] px-[20px] py-[8px] rounded-md"
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
    background: #33475b;
    border-radius: 14px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    z-index: 20;
}
  </style>
  
