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
    <div class="h-screen w-screen flex">
      <div v-if="tree" class="w-full h-full pt-10">
        <tree
          class="tree"
          :data="tree.json()"
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
          @clickedText="selectNode($event)"
        ></tree>
      </div>
      <section
        class="
          w-6/12
          h-screen
          shadow-inner
          border border-t-4 border-r-0 border-b-0 border-l-4 border-black
        "
      >
        <div class="w-full max-h-full h-full flex flex-col bg-gray-400">
          <template v-if="nodes.length">
            <section
              v-for="(node, index) in nodes"
              :key="index"
              class="flex-1 p-4 m-h"
            >
              <NodeContainer :node="node" />
            </section>
          </template>
          <div v-else>Click on a node to display its content</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { tree } from "vued3tree";
import NodeContainer from "@/components/utilities/NodeContainer";
import reorder from "@/mixins/reorder.mixin";

export default {
  components: {
    tree,
    NodeContainer,
  },
  mixins: [reorder],
  data() {
    return {
      options: {
        type: "tree", // 'tree' or 'cluster'
        radius: 6,
        zoomable: false,
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
      nodes: [],
      definition: [],
      tree: null,
      treeJSON: {},
    };
  },
  mounted() {
    this.tree = this.buildTree(this.definition);
    this.treeJSON = this.tree.json();
    let zoom = Math.round(
      Math.log(this.definition.length) +
        Math.log10(this.definition.reverse()[0].length)
    );
    this.options.minZoom = zoom / 5;
    this.options.maxZoom = Math.pow(zoom, 2);
  },
  methods: {
    selectNode({ data }) {
      this.displayNode(data);
    },
    displayNode(node) {
      if (this.nodes.includes(node)) return;
      if (this.nodes.length === 2) {
        this.nodes.shift();
      }
      this.nodes.push(node);
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
