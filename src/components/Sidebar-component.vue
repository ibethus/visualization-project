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
                    </div>
                    <div class="form-check flex items-center mt-3">
                        <input type="checkbox" value="" id="caption" @change="checkFields($event)">
                        <label class="form-check-label inline-block text-gray-800 text-xs ml-2" for="caption">
                            Caption
                        </label>
                    </div>
                    <div class="form-check flex items-center mt-3">
                        <input type="checkbox" value="" id="page_text" @change="checkFields($event)">
                        <label class="form-check-label inline-block text-gray-800 text-xs ml-2" for="page_text">
                            Page text
                        </label>
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
    width: 13rem;
}
</style>