<script setup>
import { ref, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import UpdateRepo from '../Component/UpdateRepo.vue';
import Spinner from '@/Component/Spinner.vue';
import { useStore } from 'vuex';


const router = useRouter();
const store = useStore();
const isLoading = ref(true);
const apiToken = import.meta.env.VITE_APP_GITHUB_TOKEN;

const emits = defineEmits(['repoDeleted']);

// Define props
const props = defineProps({
  id: {
    type: String,
    required: true
  }
});



// State to hold repository data
const repository = ref(null);

const mountData = async() => {
  try {
    const response = await fetch(`https://api.github.com/repos/JoshuaOzibo/${props.id}`, {
    headers: {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${apiToken}`,
    "X-GitHub-Api-Version": "2022-11-28"
    }
  });
    repository.value = await response.json();
  } catch (error) {
    console.error('Error fetching repository:', error);
  }finally{
    isLoading.value = false;
  }
}

mountData()

// Function to get the year from a date string
const getYearFromDate = (dateString) => {
  const date = new Date(dateString);
  return date.getFullYear();
};



//event to delete repo
const handleDeleteEvent = async () => {
  const repositoryId = props.id;
  await store.dispatch('deleteRepository', repositoryId);
  

  router.push('/');
};
</script>

<template>
      <div class="loader" v-if="isLoading">
      <p><Spinner /></p>
    </div>
  <div class=" flex justify-center"else>
    <ul
      v-if="repository"
      class="grid grid-cols-1 md:w-[70%] mx-[20px] m-auto gap-4"
    >
      <li class="border-2 flex-wrap border-[#3fb27f] hover:shadow-md transition-all  mt-[70px] hover:shadow-[#48e6a5] bg-[#33475b] rounded-md p-4">
        <div class=" mb-[20px] flex justify-center m-auto">
      <img class="w-[100px] mt-[-70px] h-[100px] rounded-full":src="repository.owner.avatar_url" alt="">
    </div>
    <h2 class="text-[#3fb27f] text-center uppercase font-bold">{{ repository.name }}</h2>
    <div class="flex justify-between mt-[50px]">
      <p class="text-[#3fb27f]">{{ repository.language }}</p>
      <p class="text-[#3fb27f]">created at: {{ getYearFromDate(repository.created_at) }}</p>
    </div>

    <p class="text-[#3fb27f] mt-[20px]">Repo Url: <a class="cursor-pointer" :href="repository.html_url" target="_blank" rel="noopener noreferrer">{{ repository.html_url }}</a>
</p>
    <p class="text-[#3fb27f] mt-[20px]">visibility type: {{ repository.visibility}}</p>

        <div class="w-full flex justify-between mt-[20px]">
          <UpdateRepo :repo="repository" />
          <button
            @click="handleDeleteEvent"
            class="py-[10px] border border-[#3fb27f] text-[#3fb27f] bg-[#33475b] hover:bg-[#48e6a5] hover:text-[#33475b] transition-all rounded-md cursor-pointer px-[25px]"
          >
            Delete
          </button>
        </div>
      </li>
     
    </ul>
    
  </div>
  
</template>


<style scoped>
  .loader{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    z-index: 10;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.65);
}

  .loader p{
    position: fixed;
    top: 50vh;
    left: 45%;
    z-index: 20;
}
</style>

