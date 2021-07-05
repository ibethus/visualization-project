<template>
  <div class="w-screen h-screen">
    <h1 class="font-extrabold text-4xl text-red-600 underline">
      Future D3 data renderer
    </h1>
    <p>
      Voir
      <a
        href="https://github.com/David-Desmaisons/Vue.D3.tree"
        target="_blank"
        rel="noopener noreferer"
        class="underline text-blue-500 font-semibold"
        >le repo</a
      >
      pour la customisation de l'arbre et des noeuds
    </p>
    <div class="container">
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
      >
      </tree>
    </div>
  </div>
</template>

<script>
import { tree } from "vued3tree";
import reorder from "@/mixins/reorder.mixin";

export default {
  components: {
    tree,
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
    };
  },
  mounted() {
    let zoom = Math.round(
      Math.log(this.definition.length) +
        Math.log10(this.definition.reverse()[0].length)
    );
    this.options.minZoom = zoom / 5;
    this.options.maxZoom = Math.pow(zoom, 2);
  },
  methods: {
    selectNode({ data }) {
      console.log(data);
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
  width: 100%;
  height: 100%;
  overflow: visible;
}
</style>
