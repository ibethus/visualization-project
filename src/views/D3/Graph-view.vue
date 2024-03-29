<template>
  <div class="mx-auto h-screen flex flex-col">
    <graph-image-modal :node="nodeForModal" :open="showModal" v-on:closeModal="closeGraphModal"/>
    <ul class="flex w-full px-3 py-1 shadow absolute z-20 shadow bg-gray-50 flex justify-around">
      <li class="mr-3 flex">
        <select @change="updateData($event)" id="levels"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-6">
          <option selected>Select a level</option>
          <option value="1">Level 1</option>
          <option value="2">Level 2</option>
          <option value="3">Level 3</option>
          <option value="4">Level 4</option>
          <option value="5">Level 5</option>
        </select>
      </li>
      <li class="mr-3">
        <div>
          <label class="text-sm" for="startDate">Starting date</label>
          <input v-model="startingMinDate" id="startDate" datepicker type="date"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 datepicker-input"
            placeholder="Select date">
        </div>
      </li>
      <li class="mr-3">
        <div>
          <label class="text-sm" for="endDate">Ending date</label>
          <input v-model="startingMaxDate" id="endDate" datepicker type="date"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 datepicker-input"
            placeholder="Select date">
        </div>
      </li>
    </ul>
    <SidebarComponent v-on:selected-rank="updateSelectedRank" v-on:selected-keyword="updateSelectedKeywords" 
    v-on:selected-fields="updateSelectedFields"/>
    <div id="range" class="absolute z-40">
      <label for="minmax-range" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Nodes distance</label>
      <input v-model="distanceCoefficient" id="minmax-range" type="range" min="1" max="10" step="0.05" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
    </div>
    <div id="caption" class="absolute z-40 m-2 mb-20" style="right: 0; bottom: 0; width: 10em">
      <div v-for="[group, color] in colors" :key="color">
        <p :style="{'background-color':color}" class="rounded m-1 mx-3 text-sm text-white">
          {{group}}
        </p>
      </div>
    </div>
    <network class="z-0" v-if="!nodesLoading && !linksLoading && !imagesLoading" :nodeList="nodes" :linkList="links" :linkDistance="l => l.value * distanceCoefficient"
      :nodeSize="7" :highlightNodes="highlightedNodes" :linkWidth="0.6" :searchResults="searchResultNodes" :distanceCoefficient="distanceCoefficient"
      v-on:clickNode="displayClickedNodeModal" v-on:calculatedColors="updateCaption"></network>
  </div>
</template>

<script>
import Network from "@/components/graph/Network-component";
import SidebarComponent from "@/components/Sidebar-component"
import GraphImageModal from "@/components/graph/Graph-image-modal"
import dataParser from "../../mixins/data-parser.mixin";
import keywordsParser from "../../mixins/keywords-parser.mixin"
import { LEVELS_ENUM, KEYWORDS_RANKS_ENUM, KEYWORDS_FIELDS_ENUM } from "@/helpers/constants";

export default {
  components: {
    Network,
    SidebarComponent,
    GraphImageModal
  },
  mixins: [dataParser, keywordsParser],
  data() {
    return {
      colors: [],
      distanceCoefficient: 1,
      showModal: false,
      nodeForModal: null,
      nodes: null,
      links: null,
      highlightedNodes: [],
      linksLoading: true,
      nodesLoading: true,
      LEVELS_ENUM,
      imageIdsFromParams: null,
      rankFilter: null,
      fieldFilter: null,
      keywordFilter: null,
      startDateFilter: null,
      endDateFilter: null,
      dateFilteredImages: [],
      searchResultNodes: [],
      startingMinDate: null,
      startingMaxDate: null,
      keywordsFilteredNodes: [],
    };
  },
  async created() {
    this.imagesData = await this.parseImagesDataJson();
    this.rawKeywordsData = await this.parseKeywordsJson();
    this.rawKeywordsRankingData = await this.parseKeywordsRankingJson();
    this.imagesDatesData = this.prepareImageWithDates();
    this.keywordsData = this.prepareKeywordsData();
    this.keywordsRankingData = this.prepareKeywordsRankingData();
    this.loadData(LEVELS_ENUM.One);
    this.setDates();
  },
  watch: {
    startingMinDate() {
      this.updateStartDate();
    },
    startingMaxDate() {
      this.updateEndDate();
    }
  },
  methods: {
    updateCaption(event){
      this.colors = event;
    },
    closeGraphModal(){
      this.showModal = false;
    },
    displayClickedNodeModal(event){
      this.nodeForModal = this.nodes.find(n => n.id == event.target.__data__.id);
      this.showModal = true;
    },
    setDates() {
      if (this.highlightedNodes.length !== 0) {
        this.imagesDatesData.filter(data => this.highlightedNodes.includes(data.id.toString()))
          .forEach(data => {
            if (!this.startingMinDate) {
              this.startingMinDate = data.dateMin;
            }
            else {
              if (this.startingMinDate > data.dateMin) {
                this.startingMinDate = data.dateMin;
              }
            }
            if (!this.startingMaxDate) {
              this.startingMaxDate = data.dateMax;
            }
            else {
              if (this.startingMaxDate < data.dateMax) {
                this.startingMaxDate = data.dateMax;
              }
            }
          });
      }
      else {
        this.imagesDatesData.forEach(data => {
          if (!this.startingMinDate) {
            this.startingMinDate = data.dateMin;
          }
          else {
            if (this.startingMinDate > data.dateMin) {
              this.startingMinDate = data.dateMin;
            }
          }
          if (!this.startingMaxDate) {
            this.startingMaxDate = data.dateMax;
          }
          else {
            if (this.startingMaxDate < data.dateMax) {
              this.startingMaxDate = data.dateMax;
            }
          }
        });
      }

      this.startingMinDate = new Date(this.startingMinDate).toISOString().slice(0, 10);
      this.startingMaxDate = new Date(this.startingMaxDate).toISOString().slice(0, 10);
    },
    updateStartDate() {
      this.startDateFilter = this.startingMinDate;
      if(this.startDateFilter) {
        if (this.endDateFilter) {
          this.dateFilteredImages = this.imagesDatesData.filter(image => image.dateMin >= Date.parse(this.startDateFilter) && image.dateMax <= Date.parse(this.endDateFilter))
            .map(image => { return { id: image.id.toString() } });
        }
        else {
          this.dateFilteredImages = this.imagesDatesData.filter(image => image.dateMin >= Date.parse(this.startDateFilter))
            .map(image => { return { id: image.id.toString() } });
        }
      }
      else {
        if (this.endDateFilter) {
          this.dateFilteredImages = this.imagesDatesData.filter(image => image.dateMax <= Date.parse(this.endDateFilter))
            .map(image => { return { id: image.id.toString() } });
        }
        else {
          this.dateFilteredImages = [];
        }
      }

      if (this.searchResultNodes.length !== 0) {
        if(this.dateFilteredImages.length !== 0) {
          this.searchResultNodes = this.searchResultNodes.filter(image => this.dateFilteredImages.some(data => data.id == image.id.toString()));
        }
        else {
          this.searchResultNodes = this.keywordsFilteredNodes;
        }
      }
      else {
        this.searchResultNodes = this.dateFilteredImages;   
      }
    },
    updateEndDate() {
      this.endDateFilter = this.startingMaxDate;
      if(this.endDateFilter) {
        if (this.startDateFilter) {
          this.dateFilteredImages = this.imagesDatesData.filter(image => image.dateMin >= Date.parse(this.startDateFilter) && image.dateMax <= Date.parse(this.endDateFilter))
            .map(image => { return { id: image.id.toString() } });
        }
        else {
          this.dateFilteredImages = this.imagesDatesData.filter(image => image.dateMax <= Date.parse(this.endDateFilter))
            .map(image => { return { id: image.id.toString() } });
        }
      }
      else {
        if (this.startDateFilter) {
          this.dateFilteredImages = this.imagesDatesData.filter(image => image.dateMin >= Date.parse(this.startDateFilter))
            .map(image => { return { id: image.id.toString() } });
        }
        else {
          this.dateFilteredImages = [];
        }
      }


      if (this.searchResultNodes.length !== 0) {
        if(this.dateFilteredImages.length !== 0) {
          this.searchResultNodes = this.searchResultNodes.filter(image => this.dateFilteredImages.some(data => data.id == image.id.toString()));
        }
        else {
          this.searchResultNodes = this.keywordsFilteredNodes;
        }
      }
      else {
        this.searchResultNodes = this.dateFilteredImages;
      }
    },
    updateSelectedRank(event) {
      switch (event) {
        case "1":
          this.rankFilter = KEYWORDS_RANKS_ENUM.One;
          this.searchResultNodes = this.dateFilteredImages;
          break;
        case "2":
          this.rankFilter = KEYWORDS_RANKS_ENUM.Two;
          this.searchResultNodes = this.dateFilteredImages;
          break;
        case "3":
          this.rankFilter = KEYWORDS_RANKS_ENUM.Three;
          this.searchResultNodes = this.dateFilteredImages;
          break;
        default:
          this.rankFilter = null;
          this.searchResultNodes = this.dateFilteredImages;
          break;
      }
    },
    updateSelectedFields(event) {
      if (event.size !== 0) {
        this.fieldFilter = Array.from(event).map(field => {
          switch (field) {
            case "tesseract":
              return KEYWORDS_FIELDS_ENUM.Tesseract;
            case "caption":
              return KEYWORDS_FIELDS_ENUM.Caption;
            case "page_text":
              return KEYWORDS_FIELDS_ENUM.PageText;
            default:
              return null;
          }
        });
      }
      else {
        this.fieldFilter = null;
      }
      if (this.keywordFilter) {
        this.keywordsFilteredNodes = this.getImagesByKeywords(this.keywordFilter, this.rankFilter, this.fieldFilter);
        if (this.dateFilteredImages.length !== 0) {
          this.searchResultNodes = this.keywordsFilteredNodes.filter(node => this.dateFilteredImages.some(data => data.id == node.id.toString()));
        }
        else {
          this.searchResultNodes = this.getImagesByKeywords(this.keywordFilter, this.rankFilter, this.fieldFilter);
        }
      }
    },
    updateSelectedKeywords(event) {
      this.keywordFilter = Array.from(event);
      this.keywordsFilteredNodes = this.getImagesByKeywords(this.keywordFilter, this.rankFilter, this.fieldFilter);
      if (this.dateFilteredImages.length !== 0) {
        if (this.keywordFilter.length !== 0) {
          this.searchResultNodes = this.keywordsFilteredNodes.filter(node => this.dateFilteredImages.some(data => data.id == node.id.toString()));
        }
        else {
          this.searchResultNodes = this.dateFilteredImages;
        }
      }
      else {
        this.searchResultNodes = this.getImagesByKeywords(this.keywordFilter, this.rankFilter, this.fieldFilter);
      }
    },
    updateData(event) {
      this.loadData(event.target.value);
    },
    loadData(level) {
      var levelFromParams = this.$route.query.level;
      var levelToMap = level;
      if (levelFromParams != null) {
        levelToMap = levelFromParams;
      }
      switch (levelToMap) {
        case "1":
          level = LEVELS_ENUM.One;
          break;
        case "2":
          level = LEVELS_ENUM.Two;
          break;
        case "3":
          level = LEVELS_ENUM.Three;
          break;
        case "4":
          level = LEVELS_ENUM.Four;
          break;
        case "5":
          level = LEVELS_ENUM.Five;
          break;
        default:
          level = LEVELS_ENUM.One
          break;
      }
      this.imageIdsFromParams = this.getClassImageIds(this.$route.query.nodeClass, level);
      if (this.imageIdsFromParams != null) {
        this.highlightedNodes = this.imageIdsFromParams;
      }
      else {
        this.highlightedNodes = [];
      }

      this.$router.push(this.$route.path);
      this.getLinks(level).then(response => {
        this.links = response;
        this.linksLoading = false;
      });
      this.getNodes(level).then(response => {
        this.nodes = response;
        this.nodesLoading = false;
      });
    },
  }
};
</script>

<style>
body {
  margin: 0;
}

.filters {
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
}

li {
  cursor: pointer;
}
#range {
  right: 1em;
  bottom: 1em;
}
</style>
