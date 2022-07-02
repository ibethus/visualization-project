<template>
<div>
  <div class="w-screen h-screen">
    <button
      class="
        absolute
        bottom-4
        left-10
        z-50
        inline-flex
        items-center
        px-2.5
        py-1.5
        border border-transparent
        text-md
        font-medium
        rounded
        text-white
        bg-gray-700
        hover:bg-gray-900
      "
      @click="exportJSON"
    >
      export to JSON
    </button>
    <router-link to="/graph" target="_blank">
    <button
      class="
        absolute
        bottom-4
        left-15
        z-50
        inline-flex
        items-center
        px-2.5
        py-1.5
        border border-transparent
        text-md
        font-medium
        rounded
        text-white
        bg-gray-700
        hover:bg-gray-900
      "
    >
      view graph
    </button>
    </router-link>
    <div class="h-screen w-screen flex">
      <div v-if="!loading" class="w-full h-full pt-10">
          <tree
            class="tree"
            ref="tree"
            :data="treeJSON"
            :identifier="getId"
            :node-text="options.nodeText"
            :duration="options.duration"
            :type="options.type"
            :radius="options.radius"
            :zoomable="options.zoomable"
            :strokeWidth="options.strokeWidth"
            :layoutType="options.layoutType"
            :linkLayout="options.linkLayout"
            :leafTextMargin="options.leafTextMargin"
            :marginX="options.marginX"
            :marginY="options.marginY"
            :maxZoom="options.maxZoom"
            :minZoom="options.minZoom"
            :nodeTextDisplay="options.nodeTextDisplay"
            :nodeTextMargin="options.nodeTextMargin"
            @clickedText="onClick"
            @expand="onExpand"
            @retract="onRetract"
            @clickedNode="onClickNode"
          ></tree>
      </div>
    </div>    
    <div class="w-full h-full bg-gray-200 rounded-md">
    <Graph/>
    </div>
  </div>      
  <div class="w-1/3 bg-gray-500 rounded-md">
      <Slideover :is-open="true" @close-slideover="closeSlideover">
        <section
          v-for="(node, index) in nodes"
          :key="index"
          class="flex-1 p-4 m-h">
          <NodeContainer :node="node" :card="index"/>
        </section>
    </Slideover>
  </div>
</div>
</template>

<script>
import { tree } from "vued3tree";
import NodeContainer from "@/components/utilities/NodeContainer-component";
import Slideover from "@/components/utilities/Slideover-component";
import reorder from "@/mixins/reorder.mixin";
import { EventBus } from "../../helpers/event-bus";
import "../../../src/assets/css/node-color.css";
import Graph from './Graph-view.vue';


export default {
  components: {
    tree,
    NodeContainer,
    Slideover,
    Graph,
  },
  mixins: [reorder],
  data() {
    return {
      options: {
        type: "tree", // 'tree' or 'cluster'
        radius: 10,
        zoomable: true,
        strokeWidth: 3,
        layoutType: "vertical", // 'circular' 'vertical' or 'horizontal'
        leafTextMargin: 6,
        linkLayout: "bezier", // 'bezier' or 'orthogonal'
        marginX: 15,
        marginY: 4,
        maxZoom: 10,
        minZoom: 2,
        nodeText: "name",
        nodeTextDisplay: "all", // 'all' 'leaves' or 'extremities'
        nodeTextMargin: 10,
        selected: null,
        duration: 750,
      },
      slidover: false,
      loading: true,
      nodes: [],
      events: [],
      definition: [],
      tree: null,
      treeJSON: {},
    };
  },
  watch: {
    "events.length"(newVal) {
      const event = this.events[newVal - 1];
      if (event.eventName === "clickedText") {
        this.selectNode(event.data, event.target);
      }
    },
  },
  mounted() {
    this.tree = this.buildTree(this.definition);
    this.treeJSON = this.tree.json();
    // this.$refs["tree"]?.redraw();
    // this.$refs["tree"]?.applyZoom(5)
    let zoom = Math.round(
      Math.log(this.definition.length) +
        Math.log10(this.definition.reverse()[0].length)
    );
    this.options.minZoom = zoom / 5;
    this.options.maxZoom = Math.pow(zoom, 2);
    this.loading = false;
  },
  created() {
    EventBus.$on("end-drag", (payload) => {
      this.loading = true;
      if (payload.card === 0) {
        payload.to = 1;
      } else {
        payload.to = 0;
      }
      payload.from = payload.card;
      delete payload.card;
      this.tree = this.commute(payload, this.nodes);
      // this.clearTree();
      // this.tree = n_tree;
      this.treeJSON = this.tree.json();
      this.$refs["tree"].redraw();

      this.loading = false;
    });
  },
  methods: {
    selectNode(node, target) {

      node.target = target;
      if (this.nodes.includes(node)) return;
      if (this.nodes.length === 2) {
        this.nodes[0].target.removeAttribute("fill");
        this.nodes[0].target.removeAttribute("style");
        this.nodes.shift();
      }
      this.nodes.push(node);
      if (this.nodes.length && !this.slidover) {
        this.slidover = true;
      }
      target.setAttribute("fill", "#ffaf16");
      target.setAttribute(
        "style",
        "font-size: 1.5rem !important; font-weight: 900 !important"
      );

      let routeData = this.$router.resolve({name: 'Graph', query: {nodeClass: node.name, level: node.depth + 1}});
      window.open(routeData.href, '_blank');
    },
    getId(node) {
      return node.id;
    },
    onClick(evt) {
      this.onEvent("clickedText", evt);
    },
    onClickNode(evt) {
      this.onEvent("clickedNode", evt);
    },
    onExpand(evt) {
      this.onEvent("onExpand", evt);
    },
    onRetract(evt) {
      this.onEvent("onRetract", evt);
    },
    onEvent(eventName, { data, target }) {
      this.events.push({ eventName, data, target });
    },
    clearNodes() {
      this.nodes.forEach((node) => {
        node.target.removeAttribute("fill");
        node.target.removeAttribute("style");
      });
      this.nodes = [];
    },
    closeSlideover() {
      this.slidover = false;
      this.clearNodes();
    },
    toJSON() {
      // this.$refs["tree"]?.clean();
      this.exportJSON();
      this.$nextTick(() => {
        this.tree = this.buildTree(this.definition);
        this.treeJSON = this.tree.json();
        // this.$refs["tree"]?.redraw();
        document.location.reload();
      });
    },
  },
};
</script>

<style>
.tree {
  width: 100%;
  height: 100%;
}
.container {
  height: 100%;
  overflow: visible;
}
</style>
