<script setup>
import { RouterLink, RouterView } from 'vue-router'
//#3fb27f, #48e6a5, #33475b

</script>

<template>
  <header>

    <div>

      <nav class="flex items-center px-[20px] bg-[#33475b] mb-[20px] py-[10px] justify-between">
        <RouterLink to="/" class="font-bold text-lg hover:text-xl hover:text-[#48e6a5] text-[#3fb27f]">Home</RouterLink>
        <!-- <RouterLink to="/SingleRepo/:id">About</RouterLink> -->
      </nav>

      <Suspense>
       <template #fallback>
          <p>LOADING...</p>
       </template>
      </Suspense>
    </div>
  </header>

  <RouterView />
</template>