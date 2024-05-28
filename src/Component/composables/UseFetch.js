import { ref, onMounted } from 'vue';

export function useFetch(url) {
  const apiToken = import.meta.env.VITE_APP_GITHUB_TOKEN;
    const apiUrl = "https://api.github.com/users/JoshuaOzibo/repos";
    const dataFetch = ref([]);
    const error = ref(null);


    const fetchData = async () => {
        try {
            const response = await fetch(apiUrl, {
                headers: {
                    "Accept": "application/vnd.github+json",
                    "Authorization": `Bearer ${apiToken}`,
                    "X-GitHub-Api-Version": "2022-11-28"
                }
            });
            if (!response.ok) throw new Error('Failed to fetch data');
            dataFetch.value = await response.json();
        } catch (err) {
            error.value = err.message;
        }
    };

    onMounted(() => {
        fetchData();
    });

    return { dataFetch, error, apiToken };
}
