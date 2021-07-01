<template>
  <div>
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
        :data="tree"
        node-text="name"
        :duration="null"
        :type="options.type"
        :radius="options.radius"
        :zoomable="options.zoomable"
        :strokeWidth="options.strokeWidth"
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
        type: "tree",
        radius: 6,
        zoomable: false,
        strokeWidth: 2,
      },
      tree: {
        name: "father",
        children: [
          {
            name: "son1",
            children: [{ name: "grandson" }, { name: "grandson2" }],
          },
          {
            name: "son2",
            children: [{ name: "grandson3" }, { name: "grandson4" }],
          },
        ],
      },
    };
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
  height: 500px;
}
</style>
