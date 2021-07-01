<template>
  <div>
    <h1>Future D3 data renderer</h1>
    <div style="max-height: 600px; overflow: hidden">
      <tree
        style="max-height: 600px; overflow: hidden"
        :data="tree"
        node-text="name"
        :duration="0"
      >
      </tree>
    </div>
  </div>
</template>

<script>
import { tree } from "vued3tree";

export default {
  components: {
    tree,
  },
  data() {
    return {
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
