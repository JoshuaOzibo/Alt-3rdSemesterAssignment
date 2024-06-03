<template>
    <div class="pagination py-[50px]">
      <button class="border px-[17px] border-[#3fb27f] mt-[9px] text-[#3fb27f] hover:bg-[#48e6a5] hover:text-[#33475b] bg-[#33475b] transition-all font-bold mb-[10px] p-[10px] rounded-md" @click="goToPage(1)" :disabled="currentPage === 1">First</button>
      <button class="border px-[17px] border-[#3fb27f] mt-[9px] text-[#3fb27f] hover:bg-[#48e6a5] hover:text-[#33475b] bg-[#33475b] transition-all font-bold mb-[10px] p-[10px] rounded-md" @click="prevPage" :disabled="currentPage === 1">Prev</button>
  
      <span class="text-[#33475b]">Page {{ currentPage }} of {{ totalPages }}</span>
  
      <button class="border px-[15px] border-[#3fb27f] mt-[9px] text-[#3fb27f] hover:bg-[#48e6a5] hover:text-[#33475b] bg-[#33475b] transition-all font-bold mb-[10px] p-[10px] rounded-md" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      <button  class="border px-[17px] border-[#3fb27f] mt-[9px] text-[#3fb27f] hover:bg-[#48e6a5] hover:text-[#33475b] bg-[#33475b] transition-all font-bold mb-[10px] p-[10px] rounded-md" @click="goToPage(totalPages)" :disabled="currentPage === totalPages">Last</button>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue';
  
  const props = defineProps({
    items: {
      type: Array,
      required: true
    },
    itemsPerPage: {
      type: Number,
      default: 5
    }
  });

console.log(props.items)
console.log(props.itemsPerPage)
  
  const emits = defineEmits(['pageChanged']);
  
  const currentPage = ref(1);
  const totalPages = computed(() => Math.ceil(props.items.length / props.itemsPerPage));

  console.log(totalPages)
  
  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * props.itemsPerPage;
    const end = start + props.itemsPerPage;
    return props.items.slice(start, end);
  });
  
  const goToPage = (page) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    emits('pageChanged', paginatedItems.value);
  };
  
  const prevPage = () => {
    if (currentPage.value > 1) {
      goToPage(currentPage.value - 1);
    }
  };
  
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      goToPage(currentPage.value + 1);
    }
  };
  
  watch(() => props.items, () => {
    if (currentPage.value > totalPages.value) {
      goToPage(totalPages.value);
    }
  })
  </script>
  
  <style scoped>
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }
  
  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  </style>
  