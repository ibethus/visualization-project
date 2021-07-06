<template>
  <div class="w-screen h-screen">
    <p>
      Voir
      <a
        href="https://github.com/David-Desmaisons/Vue.D3.tree"
        target="_blank"
        rel="noopener noreferer"
        class="underline text-blue-500 font-semibold"
      >
        le repo
      </a>
      pour la customisation de l'arbre et des noeuds
    </p>
    <button @click="clearNodes">Clear nodes</button>
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
      <!-- <section class="w-6/12 h-screen">
        <div class="w-full max-h-full h-full flex flex-col">
          <template v-if="nodes.length">
            <section
              v-for="(node, index) in nodes"
              :key="index"
              class="flex-1 p-4 m-h"
            >
              <NodeContainer :node="node" :card="index" />
            </section>
          </template>
          <div v-else>Click on a node to display its content</div>
        </div>
      </section> -->
    </div>
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
</template>

<script>
import { tree } from "vued3tree";
import NodeContainer from "@/components/utilities/NodeContainer";
import Slideover from "@/components/utilities/Slideover";
import reorder from "@/mixins/reorder.mixin";
import { EventBus } from "../../helpers/event-bus";

export default {
  components: {
    tree,
    NodeContainer,
    Slideover,
  },
  mixins: [reorder],
  data() {
    return {
      options: {
        type: "tree", // 'tree' or 'cluster'
        radius: 6,
        zoomable: true,
        strokeWidth: 2,
        layoutType: "vertical", // 'circular' 'vertical' or 'horizontal'
        leafTextMargin: 6,
        linkLayout: "bezier", // 'bezier' or 'orthogonal'
        marginX: 0,
        marginY: 0,
        maxZoom: 10,
        minZoom: 2,
        nodeText: "name",
        nodeTextDisplay: "all", // 'all' 'leaves' or 'extremities'
        nodeTextMargin: 6,
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
    this.$refs["tree"]?.redraw();
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
      target.setAttribute("fill", "#41B881");
      target.setAttribute("style", "font-size: 1rem; font-weight: 700");
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
      this.closeSlideover();
    },
    closeSlideover() {
      this.slidover = false;
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
