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
    tree
  },
  mixins: [reorder],
  data() {
    return {
      options: {
        type: "tree", // 'tree' or 'cluster'
        radius: 6,
        zoomable: true,
        strokeWidth: 2,
        layoutType: "horizontal", // 'circular' 'vertical' or 'horizontal'
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
      tree: {
  name: 'root',
  children: [
    {
      name: 'Cross section',
      children: [
        {
          name: 'Well section',
          children: [
            {
              name: 'Well section',
              children: [
                {
                  name: 'Well section',
                  children: [ { name: '', children: [] } ]
                }
              ]
            }
          ]
        },
        {
          name: 'Geology',
          children: [
            {
              name: 'Geology',
              children: [
                {
                  name: 'Geology',
                  children: [ { name: '', children: [] } ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'Maps',
      children: [
        {
          name: 'One time',
          children: [
            {
              name: 'Maps concentration',
              children: [
                {
                  name: 'Maps concentration',
                  children: [ { name: '', children: [] } ]
                }
              ]
            },
            {
              name: 'Piezometry',
              children: [
                {
                  name: 'Piezometry',
                  children: [ { name: '', children: [] } ]
                }
              ]
            }
          ]
        },
        {
          name: 'Permanent',
          children: [
            {
              name: 'Geology',
              children: [
                {
                  name: 'Geology',
                  children: [ { name: '', children: [] } ]
                }
              ]
            },
            {
              name: 'Installation',
              children: [
                {
                  name: 'Installation',
                  children: [ { name: '', children: [] } ]
                }
              ]
            },
            {
              name: 'Wells',
              children: [
                {
                  name: 'Wells',
                  children: [ { name: '', children: [] } ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'Graphs and Tables',
      children: [
        {
          name: 'Results',
          children: [
            {
              name: 'Mass balance',
              children: [
                {
                  name: 'Mass balance',
                  children: [ { name: '', children: [] } ]
                }
              ]
            },
            {
              name: 'Temporal',
              children: [
                {
                  name: 'Concentration',
                  children: [
                    { name: '', children: [] },
                    { name: '', children: [] },
                    { name: '', children: [] }
                  ]
                },
                {
                  name: 'Injected volume',
                  children: [ { name: '', children: [] } ]
                }
              ]
            }
          ]
        },
        {
          name: 'Description',
          children: [
            {
              name: 'Technical description',
              children: [
                {
                  name: 'Technical description',
                  children: [ { name: '', children: [] } ]
                }
              ]
            },
            {
              name: 'Technical results',
              children: [
                {
                  name: 'Technical results',
                  children: [ { name: '', children: [] } ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'Photos',
      children: [
        {
          name: 'Photos',
          children: [
            {
              name: 'Photos',
              children: [
                {
                  name: 'Photos',
                  children: [ { name: '', children: [] } ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
},
    };
  },
  methods: {
    selectNode({data}) {
      console.log(data);
    }
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
