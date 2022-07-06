<template>
  <div class="mx-auto h-screen flex flex-col">
    <ul class="flex w-full px-3 py-1 shadow absolute z-20 shadow bg-gray-50 flex justify-around">
      <li class="mr-3 flex">
        <select @change="updateData($event)" id="levels" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-6">
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
          <input id="startDate" datepicker type="date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 datepicker-input" placeholder="Select date">
        </div>
      </li>
      <li class="mr-3">
        <div>
          <label class="text-sm" for="endDate">End date</label>
          <input id="endDate" datepicker type="date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 datepicker-input" placeholder="Select date">
        </div>
      </li>
    </ul>
    <SidebarComponent v-on:selected-rank="updateSelectedRank" v-on:selected-keyword="updateSelectedKeywords" 
    v-on:selected-fields="updateSelectedFields"/>
    <network class="z-0" v-if="!nodesLoading && !linksLoading && !imagesLoading" :nodeList="nodes" :linkList="links" :linkDistance="l => l.value"
      :nodeSize="7" :highlightNodes="highlightedNodes" :linkWidth="0.6"></network>
  </div>
</template>

<script>
import Network from "vue-network-d3";
import SidebarComponent from "@/components/Sidebar-component"
import dataParser from "../../mixins/data-parser.mixin";
import keywordsParser from "../../mixins/keywords-parser.mixin"
import { LEVELS_ENUM, /*KEYWORDS_RANKS_ENUM, KEYWORDS_FIELDS_ENUM*/ } from "@/helpers/constants";

export default {
  components: {
    Network,
    SidebarComponent
  },
  mixins: [dataParser, keywordsParser],
  data() {
    return {
      nodes: null,
      links: null,
      highlightedNodes: [],
      linksLoading: true,
      nodesLoading: true,
      LEVELS_ENUM,
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
      //console.log(this.getImagesByKeywords(["milieux"], KEYWORDS_RANKS_ENUM.One, [KEYWORDS_FIELDS_ENUM.Caption, KEYWORDS_FIELDS_ENUM.Tesseract]));
  },
  methods: {
    updateSelectedRank(event){
      console.log(event);
    },
    updateSelectedFields(event){
      console.log(event);
    },
    updateSelectedKeywords(event){
      console.log(event);
    },
    updateData(event){
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
      var imageIdsFromParams = this.getClassImageIds(this.$route.query.nodeClass, level);
      if (imageIdsFromParams != null) {
        this.highlightedNodes = imageIdsFromParams;
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
        console.log(response);
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
</style>
