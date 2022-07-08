<template>  
<div v-if="open && node" id="graphModal" style="overflow-y: scroll; max-height: 80%; z-index: 100" class="p-5 w-3/4 absolute bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
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
            <h5 class="mb-3 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                {{node.caption ? node.caption : ""}}
            </h5>
        </a>
        <div v-if="!editDate" class="my-4">
            <p class="inline mb-3 text-base text-gray-700 dark:text-gray-400">
              {{node.timeline}}
            </p>
            <button @click="editDate = true" class="inline bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white ml-2 py-1 px-2 border border-blue-500 hover:border-transparent rounded">
              Edit date
            </button>
        </div>
        <div v-else class="my-3 p-3 rounded shadow">
            <input v-model="newStartDate" class="m-2" type="date"/>
            <input v-model="newEndDate" class="m-2" type="date"/>
            <button @click="editDate = false" class="hover:bg-red-500 text-red-700 hover:text-white ml-2 py-1 px-2 border border-blue-500 hover:border-transparent rounded">
              Cancel
            </button>
            <button @click="editDate = true" class="hover:bg-green-500 text-green-700 hover:text-white ml-2 py-1 px-2 border border-blue-500 hover:border-transparent rounded">
              Save
            </button>
        </div>    
        <div v-if="node.pdf">
            <a :href="`${getPdfUrl()}`" target="_blank" class="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
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
    data(){
        return {
            editDate: false,
            newStartDate: null,
            newEndDate: null
        }
    },
    methods: {
        closeModal(){
            this.editDate = false;
            this.newStartDate = null;
            this.newEndDate = null;
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
    },
    watch: {
        node(){
            var dates = this.node.timeline.split("/");
            this.newStartDate = dates[0];
            if(dates[1]){
                this.newEndDate = dates[1];
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