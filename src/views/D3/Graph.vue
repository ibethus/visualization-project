<template>
  <div id="app">
    <network v-if="!nodesLoading && !linksLoading" :nodeList="nodes" :linkList="links" :linkDistance="l => l.value" :nodeSize="7"></network>
  </div>
</template>

<script>
import Network from "vue-network-d3";
import dataParser from "../../mixins/data-parser.mixin";

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
      linksLoading: true,
      nodesLoading: true,
    };
  },
  async created() {
    this.getFirstLevelLinks().then(response => {
      this.links = response;
      this.nodesLoading = false;
    });
    this.getFirstLevelNodes().then(response => {
      this.nodes = response;
      this.linksLoading = false;
    });    
  },
};
</script>

<style>
body {
  margin: 0;
}
</style>
