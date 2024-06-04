<script setup>
import { RouterLink, RouterView } from 'vue-router'


</script>

<template>
  <header>

    <div>
      <nav class="flex items-center px-[20px] bg-[#33475b] mb-[20px] py-[10px] justify-between">
        <RouterLink to="/" class="font-bold text-lg hover:text-[17px] hover:text-[#48e6a5] text-[#3fb27f]">Home</RouterLink>
        <RouterLink to="/src/Component/ErrorPage.vue"> <p class="font-bold text-lg hover:text-[17px] hover:text-[#48e6a5] text-[#3fb27f]">TestErrorPage</p> </RouterLink>
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