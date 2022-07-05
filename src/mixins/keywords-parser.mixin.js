import { KEYWORDS_FIELDS_ENUM, KEYWORDS_RANKS_ENUM } from "@/helpers/constants";

export default {
    data() {
      return {
        keywordsLoading : true,
        keywordsRankingLoading : true,
        rawKeywordsData : null,
        rawKeywordsRankingData : null,
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
        getImagesByKeywords(keywords, rank, fields) {
            if(fields && fields.length < 3) {
                switch(rank) {
                    case KEYWORDS_RANKS_ENUM.One :
                        return this.keywordsData.filter(data => {
                            return keywords.some(keyword => {
                                if(fields.includes(KEYWORDS_FIELDS_ENUM.Caption) && fields.includes(KEYWORDS_FIELDS_ENUM.Tesseract)) {
                                    return data.rank1.caption.includes(keyword) || data.rank1.tesseract.includes(keyword)
                                }
                                if(fields.includes(KEYWORDS_FIELDS_ENUM.Caption) && fields.includes(KEYWORDS_FIELDS_ENUM.PageText)) {
                                    return data.rank1.caption.includes(keyword) || data.rank1.pageText.includes(keyword)
                                }
                                if(fields.includes(KEYWORDS_FIELDS_ENUM.Tesseract) && fields.includes(KEYWORDS_FIELDS_ENUM.PageText)) {
                                    return data.rank1.tesseract.includes(keyword) || data.rank1.pageText.includes(keyword)
                                }
                                if(fields.includes(KEYWORDS_FIELDS_ENUM.Caption)) {
                                    return data.rank1.caption.includes(keyword)
                                }
                                if(fields.includes(KEYWORDS_FIELDS_ENUM.Tesseract)) {
                                    return data.rank1.tesseract.includes(keyword)
                                }
                                if(fields.includes(KEYWORDS_FIELDS_ENUM.PageText)) {
                                    return data.rank1.pageText.includes(keyword)
                                }
                            });
                        }).map(data => {
                            return {
                                id : data.id,
                                caption : keywords.some(keyword => data.rank1.caption.includes(keyword)),
                                tesseract : keywords.some(keyword => data.rank1.tesseract.includes(keyword)),
                                pageText : keywords.some(keyword => data.rank1.pageText.includes(keyword))
                            }
                        });
                    case KEYWORDS_RANKS_ENUM.Two :
                        return this.keywordsData.filter(data => {
                            return keywords.some(keyword => {
                                if(fields.includes(KEYWORDS_FIELDS_ENUM.Caption) && fields.includes(KEYWORDS_FIELDS_ENUM.Tesseract)) {
                                    return data.rank2.caption.includes(keyword) || data.rank2.tesseract.includes(keyword)
                                }
                                if(fields.includes(KEYWORDS_FIELDS_ENUM.Caption) && fields.includes(KEYWORDS_FIELDS_ENUM.PageText)) {
                                    return data.rank2.caption.includes(keyword) || data.rank2.pageText.includes(keyword)
                                }
                                if(fields.includes(KEYWORDS_FIELDS_ENUM.Tesseract) && fields.includes(KEYWORDS_FIELDS_ENUM.PageText)) {
                                    return data.rank2.tesseract.includes(keyword) || data.rank2.pageText.includes(keyword)
                                }
                                if(fields.includes(KEYWORDS_FIELDS_ENUM.Caption)) {
                                    return data.rank2.caption.includes(keyword)
                                }
                                if(fields.includes(KEYWORDS_FIELDS_ENUM.Tesseract)) {
                                    return data.rank2.tesseract.includes(keyword)
                                }
                                if(fields.includes(KEYWORDS_FIELDS_ENUM.PageText)) {
                                    return data.rank2.pageText.includes(keyword)
                                }
                            });
                        });

                    case KEYWORDS_RANKS_ENUM.Three :
                        return this.keywordsData.filter(data => {
                            return keywords.some(keyword => {
                                if(fields.includes(KEYWORDS_FIELDS_ENUM.Caption) && fields.includes(KEYWORDS_FIELDS_ENUM.Tesseract)) {
                                    return data.rank3.caption.includes(keyword) || data.rank3.tesseract.includes(keyword)
                                }
                                if(fields.includes(KEYWORDS_FIELDS_ENUM.Caption) && fields.includes(KEYWORDS_FIELDS_ENUM.PageText)) {
                                    return data.rank3.caption.includes(keyword) || data.rank3.pageText.includes(keyword)
                                }
                                if(fields.includes(KEYWORDS_FIELDS_ENUM.Tesseract) && fields.includes(KEYWORDS_FIELDS_ENUM.PageText)) {
                                    return data.rank3.tesseract.includes(keyword) || data.rank3.pageText.includes(keyword)
                                }
                                if(fields.includes(KEYWORDS_FIELDS_ENUM.Caption)) {
                                    return data.rank3.caption.includes(keyword)
                                }
                                if(fields.includes(KEYWORDS_FIELDS_ENUM.Tesseract)) {
                                    return data.rank3.tesseract.includes(keyword)
                                }
                                if(fields.includes(KEYWORDS_FIELDS_ENUM.PageText)) {
                                    return data.rank3.pageText.includes(keyword)
                                }
                            });
                        });

                    default :
                        return this.keywordsData;
                }
            }
            else {
                switch(rank) {
                    case KEYWORDS_RANKS_ENUM.One :
                        return this.keywordsData.filter(data => {
                            return keywords.some(keyword => {
                                return data.rank1.caption.includes(keyword)
                                    || data.rank1.tesseract.includes(keyword)
                                    || data.rank1.pageText.includes(keyword)
                            });
                        });
                    case KEYWORDS_RANKS_ENUM.Two :
                        return this.keywordsData.filter(data => {
                            return keywords.some(keyword => {
                                return data.rank2.caption.includes(keyword)
                                    || data.rank2.tesseract.includes(keyword)
                                    || data.rank2.pageText.includes(keyword)
                            });
                        });
                    case KEYWORDS_RANKS_ENUM.Three :
                        return this.keywordsData.filter(data => {
                            return keywords.some(keyword => {
                                return data.rank3.caption.includes(keyword)
                                    || data.rank3.tesseract.includes(keyword)
                                    || data.rank3.pageText.includes(keyword)
                            });
                        });
                    default :
                        return this.keywordsData;
                }
            }
        },
        getImageKeywordsByField(image, field) {
            if(field) {
                switch(field) {
                    case KEYWORDS_FIELDS_ENUM.Tesseract :
                        return this.keywordsData.filter(data => data.id == image).map(data => {
                            return {
                                id : data.id,
                                rank1 : data.rank1.tesseract,
                                rank2 : data.rank2.tesseract,
                                rank3 : data.rank3.tesseract,
                            }
                        })
                    case KEYWORDS_FIELDS_ENUM.Caption :
                        return this.keywordsData.filter(data => data.id == image).map(data => {
                            return {
                                id : data.id,
                                rank1 : data.rank1.caption,
                                rank2 : data.rank2.caption,
                                rank3 : data.rank3.caption,
                            }
                        })
                    case KEYWORDS_FIELDS_ENUM.PageText :
                        return this.keywordsData.filter(data => data.id == image).map(data => {
                            return {
                                id : data.id,
                                rank1 : data.rank1.pageText,
                                rank2 : data.rank2.pageText,
                                rank3 : data.rank3.pageText,
                            }
                        })
                    default :
                        return this.keywordsData.filter(data => data.id == image); 
                }
            }
            else {
                return this.keywordsData.filter(data => data.id == image); 
            }
        },
        prepareKeywordsData() {
            return this.rawKeywordsData.map(data => {
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
            return this.rawKeywordsRankingData.map(data => {

                if(previousRankOne == data["Rank 1"]) {
                    isDuplicate = true;
                }
                else {
                    isDuplicate = false;
                }
                previousRankOne = data["Rank 1"];
                
                if(!isDuplicate) {
                    var filteredData = this.rawKeywordsRankingData.filter(d => d["Rank 1"] == data["Rank 1"]);
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