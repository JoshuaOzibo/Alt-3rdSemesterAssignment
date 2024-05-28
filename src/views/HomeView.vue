<script setup>
import {useFetch} from '../Component/composables/UseFetch.js';
import Pagination from '../Component/Pagination.vue';
import SearchRepo from '../Component/Search.vue';
import {ref, onMounted, computed, watch} from 'vue';
import CreateRepoModal from '../Component/CreateRepoModal.vue';
import { useRouter } from 'vue-router';

const {dataFetch} = useFetch();
const router = useRouter();

// Initialize reactive variables
const data = ref([]);
const pagedItems = ref([]);
const itemsPerPage = ref(4);

console.log(pagedItems)

const updatePagedItems = (items) => {
  pagedItems.value = items;
}

//Search and Filter Section
const selectedYear = ref('All');
const searchInput = ref('');

// Fetch data and initialize pagination
onMounted(() => {
  data.value = dataFetch.value;
  updatePagedItems(dataFetch.value.slice(0, itemsPerPage.value));
});


// Computed property to filter data based on selected year
const filteredData = computed(() => {
  let filtered = dataFetch.value;

  if (selectedYear.value !== 'All') {
    filtered = filtered.filter(item => getYearFromDate(item.created_at) === parseInt(selectedYear.value));
  }

  
  if (searchInput.value.trim() !== '') {
    filtered = filtered.filter(item => item.name.toLowerCase().includes(searchInput.value.trim().toLowerCase()));
  }


  // Watch filteredData to update pagedItems when filteredData changes
watch(filteredData, (newData) => {
  updatePagedItems(newData.slice(0, itemsPerPage.value));
});
  return filtered;
});



// Function to get the year from a date string
const getYearFromDate = (dateString) => {
  const date = new Date(dateString);
  return date.getFullYear();
};

const handleSingleItem = (item) => {
  router.push({name: 'SingleRepo', params: { id: item.name }, state: {item}})
}


</script>


<template>
  <nav class='fixed w-full px-5'>
    <div class="flex items-center justify-between">
      <CreateRepoModal />
      <input v-model.trim="searchInput" class="border w-[40%] h-[40px] border-black pl-2" placeholder="Search for Repo" type="text">
      <select v-model="selectedYear" class="w-[30%] cursor-pointer border-black h-[40px] border">
        <option value="All">All</option>
        <option value="2022">2022</option>
        <option value="2023">2023</option>
        <option value="2024">2024</option>
      </select>
    </div>
  </nav>
  <div class="px-5">
    <div class="mt-[100px]">
      <h2 v-if="pagedItems.length === 0">Loading...</h2>
      <ul v-else class="grid grid-cols-1 my-[20px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  <li @click="handleSingleItem(item)" v-for="(item, index) in pagedItems" :key="index" class="border-2 bg-slate-200 rounded-md p-4">
    <h2 class="text-black text-center">{{ item.name }}</h2>
    <div class="flex justify-between mt-[20px]">
      <p>{{ item.language }}</p>
      <p>created at: {{ getYearFromDate(item.created_at) }}</p>
    </div>
  </li>
</ul>

    </div>
  </div>


 <div v-if="filteredData.length !== 0">
  <Pagination :items="filteredData" :itemsPerPage="itemsPerPage" @pageChanged="updatePagedItems" />
 </div>
</template>

