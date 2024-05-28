
  
  <script setup>
  import { ref, watch, computed } from 'vue';
  
  const props = defineProps({
    items: {
      type: Array,
      required: true
    }
  });
  
  const emits = defineEmits(['updateFilteredData']);
  
  const searchInput = ref('');
  
  const filteredItems = computed(() => {
    if (searchInput.value.trim() === '') {
      return props.items;
    }
    return props.items.filter(item =>
      item.name.toLowerCase().includes(searchInput.value.trim().toLowerCase())
    );
  });
  
  const onSearchInput = () => {
    emits('updateFilteredData', filteredItems.value);
  };
  
  watch(filteredItems, (newItems) => {
    emits('updateFilteredData', newItems);
  });
  </script>

  
<template>
    <div>
      <input
        v-model="searchInput"
        @input="onSearchInput"
        class="border w-full h-[40px] border-black pl-2"
        placeholder="Search for Repo"
        type="text"
      />
    </div>
  </template>
  