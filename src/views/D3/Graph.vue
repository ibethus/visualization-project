<template>
  <div id="app">
    <network :nodeList="nodes" :linkList="links" :linkDistance="l => l.value"></network>
  </div>
</template>

<script>
import Network from "vue-network-d3";

export default {
  name: "Graph",
  components: {
    Network
  },
  data() {
    return {
      nodes: [
      	{"id": "T1", "group": 1},
      	{"id": "T2", "group": 1},
        {"id": "T3", "group": 2},
        {"id": "T4", "group": 2},
        {"id": "T5", "group": 2},
        {"id": "T6", "group": 2},
        {"id": "T7", "group": 2},
        {"id": "T8", "group": 3},
      ],
      links: [
        {"source": "T1", "target": "T2", "value": 50},
        {"source": "T3", "target": "T4", "value": 50},
        {"source": "T1", "target": "T3", "value": 20},
        {"source": "T3", "target": "T5", "value": 20},
        {"source": "T5", "target": "T6", "value": 20},
        {"source": "T5", "target": "T2", "value": 20},
        {"source": "T1", "target": "T8", "value": 20},
        {"source": "T7", "target": "T6", "value": 100},
      ]
    };
  },
};
</script>

<style>
body {
  margin: 0;
}
</style>
