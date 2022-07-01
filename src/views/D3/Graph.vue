<template>
  <div id="app">
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
    <network v-if="!nodesLoading && !linksLoading" :nodeList="nodes" :linkList="links" :linkDistance="l => l.value"
      :nodeSize="7" :highlightNodes="highlightedNodes" :linkWidth="0.6"></network>

  </div>
</template>

<script>
import Network from "vue-network-d3";
import dataParser from "../../mixins/data-parser.mixin";
import { LEVELS_ENUM } from "@/helpers/constants";

export default {
  name: "Graph",
  components: {
    Network
  },
  mixins: [dataParser],
  data() {
    return {
      nodes: null,
      /*[
        {"id": "T1", "group": 1},
        {"id": "T2", "group": 1},
        {"id": "T3", "group": 2},
        {"id": "T4", "group": 2},
        {"id": "T5", "group": 2},
        {"id": "T6", "group": 2},
        {"id": "T7", "group": 2},
        {"id": "T8", "group": 3},
      ],*/
      links: null,
      /*[
        {"source": "T1", "target": "T2", "value": 50},
        {"source": "T3", "target": "T4", "value": 50},
        {"source": "T1", "target": "T3", "value": 20},
        {"source": "T3", "target": "T5", "value": 20},
        {"source": "T5", "target": "T6", "value": 20},
        {"source": "T5", "target": "T2", "value": 20},
        {"source": "T1", "target": "T8", "value": 20},
        {"source": "T7", "target": "T6", "value": 100},
      ]*/
      highlightedNodes: [],
      linksLoading: true,
      nodesLoading: true,
      LEVELS_ENUM,
    };
  },
  async created() {
    this.loadData(LEVELS_ENUM.One)
  },
  methods: {
    loadData(level) {
      var levelFromParams = this.$route.query.level;
      if (levelFromParams != null) {
        switch (levelFromParams) {
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
      var imageIdsFromParams = this.getClassImageIds(this.$route.query.nodeClass, level);
      if (imageIdsFromParams != null) {
        this.highlightedNodes = imageIdsFromParams;
      }
      else {
        this.highlightedNodes = [];
      }

      this.$router.push(this.$route.path)
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
  margin-top: 1em;
}
</style>
