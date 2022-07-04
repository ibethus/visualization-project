<template>
<div class="mx-auto h-screen flex flex-col">
  <ul class="flex px-5 py-1 shadow">
    <li class="mr-3">
      <a @click="open = true" class="inline-block border border-blue-500 rounded py-1 px-3 bg-blue-500 text-white">
        <p class="inline">
          Detach graph
        </p> 
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </li>
    <li class="mr-3">
      <a @click="exportJSON" class="inline-block border border-white rounded hover:border-gray-200 text-blue-500 hover:bg-gray-200 py-1 px-3">
        <p>
          Export Json
        </p>
        </a>
    </li>
  </ul>
<div class="grid grid-cols-2 gap-5 flex h-full m-5">
        <div v-if="!loading" class="h-full w-full rounded-md	shadow">
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
        <div v-if="!open">
          <iframe class="h-full w-full flex rounded-md shadow" :src="`${getActualUrl()}/graph`"></iframe>
        </div>        
       <detachable-graph-component v-model="open">
            <iframe class="h-screen w-screen flex" :src="`${getActualUrl()}/graph`"></iframe>
       </detachable-graph-component>
    <Slideover :is-open="slidover" @close-slideover="closeSlideover">
      <section
        v-for="(node, index) in nodes"
        :key="index"
        class="flex-1 p-4 m-h"
      >
        <NodeContainer :node="node" :card="index" />
      </section>
    </Slideover>
  </div>
</div>
</template>

<script>
import { tree } from "vued3tree";
import NodeContainer from "@/components/utilities/NodeContainer-component";
import Slideover from "@/components/utilities/Slideover-component";
import DetachableGraphComponent from "@/components/utilities/Detachable-graph-component";
import reorder from "@/mixins/reorder.mixin";
import { EventBus } from "../../helpers/event-bus";
import "../../../src/assets/css/node-color.css";

export default {
  components: {
    tree,
    NodeContainer,
    Slideover,
    DetachableGraphComponent,
  },
  mixins: [reorder],
  data() {
    return {
      open: false,
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
  async mounted() {
    this.definition = await this.parseDefinition();
    this.data = await this.parseImages();
    this.tree = this.buildTree(this.definition);
    this.treeJSON = this.tree.json();
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
      this.treeJSON = this.tree.json();
      this.$refs["tree"].redraw();

      this.loading = false;
    });
  },
  methods: {
    getActualUrl(){
      return window.location.origin;
    },
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
      console.log(routeData);
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
