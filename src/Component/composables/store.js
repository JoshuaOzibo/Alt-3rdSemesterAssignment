
import { createStore } from 'vuex';
import { ref } from 'vue';

export default createStore({
  state: {
    repositories: [],
  },

  mutations: {
    setRepositories(state, repositories) {
      state.repositories = repositories;
      console.log(repositories)
    },
    deleteRepository(state, repositoryId) {
      console.log(state.repositories)
      state.repositories.filter(repo => repo.name !== repositoryId);
    },
    addRepository(state, repository) {
      state.repositories.push(repository);
    },
  },
  actions: {
    async fetchRepositories({ commit }) {
      const apiToken = import.meta.env.VITE_APP_GITHUB_TOKEN;
      const apiUrl = "https://api.github.com/users/JoshuaOzibo/repos";
      const error = ref(null);
      try {
        const response = await fetch(apiUrl, {
          headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `Bearer ${apiToken}`,
            "X-GitHub-Api-Version": "2022-11-28"
          }
        });
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        commit('setRepositories', data);
      } catch (err) {
        error.value = err.message;
      }
    },
    async deleteRepository({ commit }, repositoryId) {

      const apiToken = import.meta.env.VITE_APP_GITHUB_TOKEN;
      const url = `https://api.github.com/repos/JoshuaOzibo/${repositoryId}`;
      
      try {
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `Bearer ${apiToken}`,
            "X-GitHub-Api-Version": "2022-11-28"
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to delete repository: ${response.status} ${response.statusText}`);
        }
        console.log('Repository deleted successfully');
        commit('deleteRepository', repositoryId);
    
      } catch (error) {
        console.error('Error deleting repository:', error);
      }
    },
    async createRepository({ commit }, newRepo){
      const apiToken = import.meta.env.VITE_APP_GITHUB_TOKEN;
      try {
        const response = await fetch('https://api.github.com/user/repos', {
          method: 'POST',
          headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `Bearer ${apiToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newRepo),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const createdRepo = await response.json();
        commit('addRepository', createdRepo);
        console.log('success creating repo:',createdRepo);
      } catch (error) {
        console.error('Error creating repository:', error);
      }
    }
  },
  getters: {
    getRepositories: state => state.repositories,
  },
});
