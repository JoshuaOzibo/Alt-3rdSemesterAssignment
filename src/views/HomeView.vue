<script setup>
import { useStore } from 'vuex'
import Pagination from '../Component/Pagination.vue'
import { ref, onMounted, computed, watch } from 'vue'
import CreateRepoModal from '../Component/CreateRepoModal.vue'
import { useRouter } from 'vue-router'
import Spinner from '../Component/Spinner.vue'

const router = useRouter()
const store = useStore()

// Initialize reactive variables
const data = ref([])
let pagedItems = ref([])
const itemsPerPage = ref(4)
const isLoading = ref(true)
const NetworkError = ref('')

const updatePagedItems = (items) => {
  pagedItems.value = items
}

// Search and Filter Section
const selectedYear = ref('All')
const searchInput = ref('')

// Fetch data and initialize pagination
onMounted(async () => {
  try {
    await store.dispatch('fetchRepositories')
    data.value = store.getters.getRepositories
    isLoading.value = false
  } catch (error) {
    NetworkError.value = 'Failed to fetch data. Please check your network connection.'
  }
})

// Watch for changes in the Vuex store's repository data
watch(
  () => store.getters.getRepositories,
  (newRepositories) => {
    data.value = newRepositories
    updatePagedItems(filteredData.value.slice(0, itemsPerPage.value))
  }
)

// Computed property to filter data based on selected year and search input
const filteredData = computed(() => {
  let filtered = data.value

  if (selectedYear.value !== 'All') {
    filtered = filtered.filter(
      (item) => getYearFromDate(item.created_at) === parseInt(selectedYear.value)
    )
  }

  if (searchInput.value.trim() !== '') {
    filtered = filtered.filter((item) =>
      item.name.toLowerCase().includes(searchInput.value.trim().toLowerCase())
    )
  }

  return filtered
})

// Watch filteredData to update pagedItems when filteredData changes
watch(
  () => filteredData.value,
  (newFilteredData) => {
    updatePagedItems(newFilteredData.slice(0, itemsPerPage.value))
  }
)

// Function to get the year from a date string
const getYearFromDate = (dateString) => {
  const date = new Date(dateString)
  return date.getFullYear()
}

const handleSingleItem = (item) => {
  router.push({ name: 'SingleRepo', params: { id: item.name }, state: { item } })
}
</script>

<template>
  <nav class="">
    <div class="flex items-center justify-between mx-[20px]">
      <CreateRepoModal @repoCreated="store.dispatch('fetchRepositories')" />
      <input
        v-model.trim="searchInput"
        class="border border-[#3fb27f] outline-none w-[40%] rounded-md h-[40px] pl-2"
        placeholder="Search for Repo"
        type="text"
      />
      <select
        v-model="selectedYear"
        class="w-[30%] border-[#3fb27f] outline-none text-[#3fb27f] rounded-md px-[5px] cursor-pointer h-[40px] border"
      >
        <option value="All">All</option>
        <option value="2022">2022</option>
        <option value="2023">2023</option>
        <option value="2024">2024</option>
      </select>
    </div>
  </nav>

  <div class="px-5">
    <div class="mt-[10px]">
      <div class="loader" v-if="isLoading">
        <p><Spinner /></p>
      </div>
      <div v-if="NetworkError">
        <h2 class="text-[#33475b] text-2xl text-center">{{ NetworkError }}</h2>
      </div>
      <ul v-else class="grid grid-cols-1 my-[20px] sm:grid-cols-2 md:grid-cols-2 gap-4">
        <li
          class="border-2 border-[#3fb27f] cursor-pointer hover:shadow-md transition-all mt-[70px] hover:shadow-[#48e6a5] bg-[#33475b] rounded-md p-4"
          @click="handleSingleItem(item)"
          v-for="(item, index) in pagedItems"
          :key="index"
        >
          <div class="mb-[20px] flex justify-center m-auto">
            <img
              class="w-[100px] mt-[-70px] h-[100px] rounded-full"
              :src="item.owner.avatar_url"
              alt=""
            />
          </div>
          <h2 class="text-black text-center">{{ item.name }}</h2>
          <div class="flex justify-between mt-[50px]">
            <p class="text-black">{{ item.language }}</p>
            <p class="text-black">created at: {{ getYearFromDate(item.created_at) }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div v-if="filteredData.length !== 0">
    <Pagination
      :items="filteredData"
      :itemsPerPage="itemsPerPage"
      @pageChanged="updatePagedItems"
    />
  </div>

  <h1
    class="text-center pt-[50px] text-[#33475b] font-bold text-2xl"
    v-if="filteredData.length === 0"
  >
    No Repository Found
  </h1>
</template>

<style scoped>
.loader {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  z-index: 10;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.65);
}

.loader p {
  position: fixed;
  top: 50vh;
  left: 45%;
  z-index: 20;
}
</style>
