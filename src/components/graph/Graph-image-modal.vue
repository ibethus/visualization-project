<template>  
<div v-if="open && node" id="graphModal" style="overflow-y: scroll; max-height: 80%" class="absolute z-40 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
    <div class="fixed m-3">
        <button @click="closeModal" class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
            X
        </button>
    </div>
    <p class="pt-20">
        <img class="rounded-t-lg" :src="`${getImageUrl()}`" alt="">
    </p>
    <div class="p-5">
        <a href="#">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {{node.caption ? node.caption : ""}}
            </h5>
        </a>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {{node.timeline}}
        </p>
        <div v-if="node.pdf">
            <a :href="`${getPdfUrl()}`"  target="_blank" class="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Open pdf
                <svg class="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </a>
        </div>
        <div v-else>
            <a href="#" class="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 opacity-50 cursor-not-allowed">
                No pdf
                <svg class="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </a>
        </div>
    </div>
</div>
</template>
<script>
export default {
    props: {
        node: Object,
        open: {
            type: Boolean,
            default: false
        },
    },
    mounted(){
        console.log(this.node)
    },
    methods: {
        closeModal(){
            this.$emit("closeModal");
        },
        getImageUrl(){
            // eslint-disable-next-line no-undef
            return `${this.node.image_path}`;
        },
        getPdfUrl(){
            if (this.node.pdf) {
                if (this.node.page) {
                    // eslint-disable-next-line no-undef
                    return `${process.env.VUE_APP_PATH_PDF}${this.node.pdf}#page=${this.node.page + 1}`;
                } else {
                    // eslint-disable-next-line no-undef
                    return `${process.env.VUE_APP_PATH_PDF}${this.node.pdf}`;
                }
            }
        }
    }
}
</script>
<style>
#graphModal {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    height: 80%;
    margin: auto;
}
</style>