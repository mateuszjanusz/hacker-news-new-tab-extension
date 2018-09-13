<template>
    <div id="app" class="w-100 h-100">
        <div v-for="row in rows" :key="row.id">
            <a :href="row.url" target="_blank">{{ row.title }}</a>
        </div>
    </div>
</template>

<script>
import { getTopItems } from './js/utils.js'
// import Loader from './components/Loader.vue'

export default {
    name: 'hackernews',
    data() {
        return {
            rows: []
        }
    },
    async mounted() {
        this.rows = await getTopItems()
        console.log(this.rows);
    },
    // methods: {
    // },
    // components: {
    //     Loader
    // },
}
</script>

