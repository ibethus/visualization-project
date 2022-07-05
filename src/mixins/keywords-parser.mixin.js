import { KEYWORDS_FIELDS_ENUM } from "@/helpers/constants";

export default {
    data() {
      return {
        keywordsLoading : true,
        keywordsRankingLoading : true,
        keywordsData : null,
        keywordsRankingData : null,
        tmp : null,
      };
    },
    methods: {
        async parseKeywordsJson(){
            // eslint-disable-next-line no-undef
            return fetch(`${process.env.VUE_APP_PATH_FILES}short_keywords_for_app.json`)
            .then(response => response.json())
            .then(this.keywordsLoading = false)
        },
        async parseKeywordsRankingJson(){
            // eslint-disable-next-line no-undef
            return fetch(`${process.env.VUE_APP_PATH_FILES}keyword_ranking_for_app.json`)
            .then(response => response.json())
            .then(this.keywordsRankingLoading = false)
        },
        /*getImagesByKeyword(image, keyword, rank, field) {
            
        },*/
        getImageKeywordsByField(image, field) {
            if(field) {
                switch(field) {
                    case KEYWORDS_FIELDS_ENUM.Tesseract :

                    break;
                    case KEYWORDS_FIELDS_ENUM.Caption :

                    break;
                    case KEYWORDS_FIELDS_ENUM.PageText :

                    break;

                    default :

                    break;
                }
            }
            else {
                //var imageKeywords = this.keywordsData.filter(data => data.id == image);
            }
        },
        prepareKeywordsData() {
            return this.keywordsData.map(data => {
                return {
                    id : data.id,
                    rank1 : {
                        tesseract : data.tesseract_keyword_rank1.split(',').map(word => word.trim()),
                        caption : data.caption_keyword_rank1.split(',').map(word => word.trim()),
                        pageText : data.page_text_keyword_rank1.split(',').map(word => word.trim()),
                    },
                    rank2 : {
                        tesseract : data.tesseract_keyword_rank2.split(',').map(word => word.trim()),
                        caption : data.caption_keyword_rank2.split(',').map(word => word.trim()),
                        pageText : data.page_text_keyword_rank2.split(',').map(word => word.trim()),
                    },
                    rank3 : {
                        tesseract : data.tesseract_keyword_rank3.split(',').map(word => word.trim()),
                        caption : data.caption_keyword_rank3.split(',').map(word => word.trim()),
                        pageText : data.page_text_keyword_rank3.split(',').map(word => word.trim()),
                    },
                }
            });
        },
        prepareKeywordsRankingData() {
            var isDuplicate = null;
            var previousRankOne = null;
            return this.keywordsRankingData.map(data => {

                if(previousRankOne == data["Rank 1"]) {
                    isDuplicate = true;
                }
                else {
                    isDuplicate = false;
                }
                previousRankOne = data["Rank 1"];
                
                if(!isDuplicate) {
                    var filteredData = this.keywordsRankingData.filter(d => d["Rank 1"] == data["Rank 1"]);
                    var secondRankingKeywords = filteredData.map(d => {
                        return {
                            name : d["Rank 2"],
                            rank3 : d["Rank 3"].split(' '),
                        }
                    });
                    return {
                        name : data["Rank 1"],
                        rank2 : secondRankingKeywords,
                    }
                }
            }).filter(element => element !== undefined);
        }
    }
}