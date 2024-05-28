<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {useFetch} from '../Component/composables/UseFetch.js';
import UpdateRepo from '../Component/UpdateRepo.vue';

const {apiToken} = useFetch();
const router = useRouter();

const newToken = useFetch();

console.log(apiToken)
// Define props
const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

console.log(props.id)



// State to hold repository data
const repository = ref(null);

console.log(repository.value)

const fetchRepository = async (id) => {
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
  }
};


onMounted(() => {
  fetchRepository(props.id);
});



//event to delete repo


const handleDeleteEvent = async() => {
  const url = `https://api.github.com/repos/JoshuaOzibo/${props.id}`;
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${newToken.apiToken}`,
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete repository');
    }
    console.log('Repository deleted successfully');
    router.push('/');
  } catch (error) {
    console.error('Error deleting repository:', error);
  }
};
</script>

<template>
  <div class="">
    <ul
      v-if="repository"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <li class="border-2 bg-slate-200 rounded-md p-4">
        <h2 class="text-black text-center">{{ repository.name }}</h2>
        <div class="flex justify-between mt-2">
          <p>{{ repository.language }}</p>
          <p>{{ repository.created_at }}</p>
        </div>

        <div class="w-full flex justify-between mt-[20px]">
          <UpdateRepo :repo="repository" />
          <button
            @click="handleDeleteEvent"
            class="py-[10px] border border-white rounded-md cursor-pointer px-[25px]"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>

    <h2 v-else>Loading...</h2>
  </div>
</template>

