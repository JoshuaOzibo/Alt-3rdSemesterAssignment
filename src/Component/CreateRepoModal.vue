<script setup>
import { ref, defineEmits } from 'vue'
import { useStore } from 'vuex'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const store = useStore()
const apiToken = import.meta.env.VITE_APP_GITHUB_TOKEN
const open = ref(false)
const repoName = ref('')
const repoDesc = ref('')

const emits = defineEmits(['repoCreated'])

const handleSubmitData = async (e) => {
  const repoData = {
    name: repoName.value,
    description: repoDesc.value,
    private: false,
  }

  if (repoData.name && repoData.description) {
    await store.dispatch('createRepository', repoData)
    open.value = false
    toast('Successfully Created a Repo', {
      "theme": "auto",
      "type": "success",
      "autoClose": 1000,
      dangerouslyHTMLString: true
    })
  } else {
    open.value = true
    toast('Error Creating Repo', {
      "theme": "auto",
      "type": "error",
      "autoClose": 1000,
      dangerouslyHTMLString: true
    })
  }

  repoName.value = ''
  repoDesc.value = ''
}
</script>

<template>
  <div>
    <button
      class=" md:w-[150px] w-full border border-[#3fb27f] mt-[9px] text-[#3fb27f] bg-[#33475b] hover:bg-[#48e6a5] hover:text-[#33475b] transition-all font-bold mb-[15px] p-[10px] rounded-md"
      @click="() => (open = !open)"
    >
      Add New Repo
    </button>

    <div class="Overlay" v-if="open">
      <div v-if="open" class="Backdrop p-[10px] border border-[#3fb27f] rounded-md">
        <div class="w-full flex justify-end">
          <button
            @click="() => (open = !open)"
            class="text-xl px-[15px] border-[#3fb27f] py-[5px] rounded-md border-2 text-[#3fb27f] hover:text-[#33475b] hover:border-[#33475b] hover:bg-[#3fb27f] transition-all font-extrabold"
          >
            X
          </button>
        </div>
        <form @submit.prevent="handleSubmitData">
          <div>
            <label class="text-[#3fb27f] font-bold" for="name">Name Of Repo:</label><br />
            <input
              v-model="repoName"
              placeholder="Repository Name..."
              class="w-full h-[40px] border-black mt-[10px] rounded-md border pl-2 outline-none"
              type="text"
            />
          </div>
          <div class="mt-[10px]">
            <label class="text-[#3fb27f] font-bold" for="discription">Discription Of Repo:</label
            ><br />
            <input
              v-model="repoDesc"
              placeholder="Repository Description..."
              class="w-full h-[40px] border-black mt-[10px] rounded-md border pl-2 outline-none"
              type="text"
            />
          </div>
          <button
            class="mt-[20px] border border-[#3fb27f] text-[#3fb27f] bg-[#33475b] hover:bg-[#48e6a5] hover:text-[#33475b] transition-all mb-[5px] px-[20px] py-[8px] rounded-md"
            type="submit"
          >
            Create Repo
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.Overlay {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  z-index: 10;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.65);
}

.Backdrop {
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
