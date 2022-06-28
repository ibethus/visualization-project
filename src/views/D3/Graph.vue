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
      	{"id": "Myriel", "group": 1},
      	{"id": "Napoleon", "group": 1},
        {"id": "Labarre", "group": 2},
        {"id": "Valjean", "group": 2}
      ],
      links: [
        {"source": "Napoleon", "target": "Myriel", "value": 50},
        {"source": "Valjean", "target": "Labarre", "value": 50},
        {"source": "Napoleon", "target": "Valjean", "value": 50},
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
