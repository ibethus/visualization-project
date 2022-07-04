<template>
  <div>
    <div class="filters">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click="loadData(LEVELS_ENUM.One)"> Level 1 </button>
      &nbsp;
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click="loadData(LEVELS_ENUM.Two)"> Level 2 </button>
      &nbsp;
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click="loadData(LEVELS_ENUM.Three)"> Level 3 </button>
      &nbsp;
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click="loadData(LEVELS_ENUM.Four)"> Level 4 </button>
      &nbsp;
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click="loadData(LEVELS_ENUM.Five)"> Level 5 </button>
    </div>
    <network v-if="!nodesLoading && !linksLoading && !imagesLoading" :nodeList="nodes" :linkList="links" :linkDistance="l => l.value"
      :nodeSize="7" :highlightNodes="highlightedNodes" :linkWidth="0.6"></network>

  </div>
</template>

<script>
import Network from "vue-network-d3";
import dataParser from "../../mixins/data-parser.mixin";
import { LEVELS_ENUM } from "@/helpers/constants";

export default {
  components: {
    Network
  },
  mixins: [dataParser],
  props: {
    level: String,
    nodeClass: String
  },
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
      this.imagesData = await this.parseJson();
      this.loadData(LEVELS_ENUM.One)    
      console.log(`Niveau récupéré : ${this.level}`)
      console.log(`Classe récupérée : ${this.nodeClass}`)
      console.log(`Image data : ${this.imagesData}`)
  },
  methods: {
    loadData(level) {
      if (this.level) {
        switch (this.level) {
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
      }
      var imageIdsFromParams = this.getClassImageIds(this.nodeClass, level);
      if (imageIdsFromParams != null) {
        this.highlightedNodes = imageIdsFromParams;
      }
      else {
        this.highlightedNodes = [];
      }

      this.getLinks(level).then(response => {
        this.links = response;
        console.log(response)
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
    margin-right: auto;
    margin-left: auto;
    left: 0;
    right: 0;
}
</style>
