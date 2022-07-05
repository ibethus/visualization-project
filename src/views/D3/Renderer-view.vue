<template>
<div class="mx-auto h-screen flex flex-col">
  <ul class="flex px-5 py-1 shadow">
    <li class="mr-3">
      <a @click="open = true" class="inline-block border border-blue-500 rounded py-1 px-3 bg-blue-500 text-white hover:bg-blue-700">
        <p class="inline">
          Detach graph
        </p> 
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </li>
    <li class="mr-3">
      <a @click="slidover = !slidover" class="inline-block border border-green-500 rounded py-1 px-3 bg-green-500 text-white hover:bg-green-700">
        <p class="inline" v-if="!slidover">Show images</p>
        <p v-else class="inline">Hide images</p>
        <svg xmlns="http://www.w3.org/2000/svg" class="inline h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </a>
    </li>
    <li class="mr-3">
      <a @click="exportJSON" class="inline-block border border-white rounded hover:border-gray-200 text-blue-500 hover:bg-gray-200 py-1 px-3">
        <p class="inline">
          Export Json
        </p>
        <svg xmlns="http://www.w3.org/2000/svg" class="inline h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
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
        <div v-if="!open" class="h-full w-full flex rounded-md shadow relative">
          <div v-if="!iframeLoaded" class="h-full w-full absolute">
              <SpinnerComponent/>
          </div>
          <iframe id="graph" class="h-full w-full" :src="updatedUrl" @load="iframeLoad"></iframe>
        </div>        
       <detachable-graph-component v-model="open" v-bind:nodeLevel="selectedNodeLevel" v-bind:nodeClass="selectedNodeClass">
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
import SpinnerComponent from "@/components/Spinner-component"

export default {
  components: {
    tree,
    NodeContainer,
    Slideover,
    DetachableGraphComponent,
    SpinnerComponent
  },
  mixins: [reorder],
  data() {
    return {
      selectedNodeLevel: null,
      selectedNodeClass: null,
      updatedUrl: this.getActualUrl(),
      open: false,
      iframeLoaded: false,
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
    selectedNodeLevel(newLevel){
      if (newLevel){
        this.updateUrl();
      }
    },
    selectedNodeClass(newClass){
      if (newClass){
        this.updateUrl();
      }
    }
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
    iframeLoad(){
      this.iframeLoaded = true;
    },
    updateUrl(){
      let base = this.getActualUrl();
      console.log(`classe : ${this.selectedNodeClass}`)
      console.log(`level : ${this.selectedNodeLevel}`)
      if (this.selectedNodeClass){
        base = base.concat(`?nodeClass=${this.selectedNodeClass}`);
      }
      if (this.selectedNodeLevel){
        base = base.concat(`&level=${this.selectedNodeLevel}`);
      }
      this.updatedUrl = encodeURI(base);
      console.log(this.updatedUrl);
      document.getElementById("graph").contentWindow.location.reload();
      this.iframeLoaded = false;
      return base;
    },
    getActualUrl(){
      return `${window.location.origin}/graph`;
    },
    selectNode(node, target) {
      node.target = target;
      if (this.nodes.includes(node)) return;
      if (this.nodes.length === 1) {
        this.nodes[0].target.removeAttribute("fill");
        this.nodes[0].target.removeAttribute("style");
        this.nodes.shift();
      }
      this.nodes.push(node);
      target.setAttribute("fill", "#ffaf16");
      target.setAttribute(
        "style",
        "font-size: 1.5rem !important; font-weight: 900 !important"
      );
      this.selectedNodeLevel = (node.depth + 1).toString();
      this.selectedNodeClass = node.name;
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
li{
  cursor: pointer;
}
</style>
