<template>
    <div class="pagination py-[50px]">
      <button @click="goToPage(1)" :disabled="currentPage === 1">First</button>
      <button @click="prevPage" :disabled="currentPage === 1">Prev</button>
  
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
  
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages">Last</button>
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
  
  button {
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    background: #f9f9f9;
    cursor: pointer;
  }
  
  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  </style>
  