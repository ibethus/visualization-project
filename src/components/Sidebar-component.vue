<template>
<ul id="sidebar" class="flex-row h-full px-3 py-1 shadow z-10 bg-gray-50 absolute pt-20">
    <li class="mr-3 flex-row mt-2 p-1 rounded shadow">
        <label for="ranks" class="text-sm">Rank</label>
        <select @change="updateData($event)" id="ranks" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>Select a rank</option>
            <option value="1">Rank 1</option>
            <option value="2">Rank 2</option>
            <option value="3">Rank 3</option>
        </select>
    </li>
    <li class="mr-3 mt-2 p-1 rounded shadow">
        <label class="text-sm" for="keywords">Keywords</label>
        <p class="text-xs text-gray-500 italic" v-if="!keywordForFilter">Select a rank to see associated keywords</p>
        <div id="keywords" style="overflow-y: scroll; max-height: 8em">
            <div class="flex justify-center">
                <div>
                    <div class="form-check flex content-center" v-for="keyword in keywordForFilter" :key="keyword">
                        <input type="checkbox" value="" :id="keyword" @change="check($event)">
                        <label class="form-check-label inline-block text-gray-800 text-xs ml-2" :for="keyword">
                            {{keyword}}
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </li>
    <li class="mr-3 mt-2 p-1 rounded shadow">
        <label class="text-sm" for="fields">Fields</label>
        <div id="fields">
            <div class="flex justify-center">
                <div>
                    <div class="form-check flex items-center mt-3">
                        <input type="checkbox" value="" id="tesseract" @change="checkFields($event)">
                        <label class="form-check-label inline-block text-gray-800 text-xs ml-2" for="tesseract">
                            Tesseract
                        </label>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>                        
                    </div>
                    <div class="form-check flex items-center mt-3">
                        <input type="checkbox" value="" id="caption" @change="checkFields($event)">
                        <label class="form-check-label inline-block text-gray-800 text-xs ml-2" for="caption">
                            Caption
                        </label>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </div>                        
                    </div>
                    <div class="form-check flex items-center mt-3">
                        <input type="checkbox" value="" id="page_text" @change="checkFields($event)">
                        <label class="form-check-label inline-block text-gray-800 text-xs ml-2" for="page_text">
                            Page text
                        </label>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>                        
                    </div>
                </div>
            </div>
        </div>
    </li>
</ul>
</template>
<script>
export default {
    data(){
        return {
            keywordsJson: null,
            keywordForFilter: null,
            selectedKeywords: new Set(),
            selectedFields: new Set()
        }
    },
    async mounted(){
       this.keywordsJson = await this.parseKeywordsJson();
    },
    methods: {
        check(event){
            if (event.target.checked){
                this.selectedKeywords.add(event.target.id);
            } else {
                this.selectedKeywords.delete(event.target.id)
            }
            this.$emit("selected-keyword", this.selectedKeywords);
        },
        checkFields(event){
            if (event.target.checked){
                this.selectedFields.add(event.target.id);
            } else {
                this.selectedFields.delete(event.target.id)
            }
            this.$emit("selected-fields", this.selectedFields);
        },
        updateData(event){
            this.loadKeywordsFromRank(event.target.value);
        },
         async parseKeywordsJson(){
            // eslint-disable-next-line no-undef
            return fetch(`${process.env.VUE_APP_PATH_FILES}keyword_ranking_for_app.json`)
            .then(response => response.json())
            .then(this.imagesLoading = false)
        },
        loadKeywordsFromRank(rank){
            let keywordFromRank = new Set();
            if (rank == 1){
                this.keywordsJson.forEach(element => {
                    keywordFromRank.add(element["Rank 1"]);
                });
            } else if (rank == 2){
                this.keywordsJson.forEach(element => {
                    keywordFromRank.add(element["Rank 2"]);
                });
            } else if (rank == 3){
                this.keywordsJson.forEach(element => {
                    element["Rank 3"].split(" ").forEach(k => {
                        keywordFromRank.add(k);
                    })
                });
            }
            this.selectedKeywords.clear();
            this.keywordForFilter = keywordFromRank;
            this.$emit("selected-rank", rank);
        }
    }
}
</script>
<style>
.form-check {
    text-align: left;
}
#sidebar {
    max-width: 13rem;
}
</style>