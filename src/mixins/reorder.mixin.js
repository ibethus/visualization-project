import Tree from "@/classes/Tree";
import * as definition from "@/assets/files/paysages.json";
import * as images from "@/assets/files/formattedPaysages.json";
// import * as definition from "@/assets/files/completedTree.json";
// import * as images from "@/assets/files/formatted_groundtruth.json";
// import * as definition from "@/assets/files/dummyTree.json";
// import * as definition from "@/assets/files/sampleTree.json";

export default {
  created() {
    this.definition = definition.default;
    this.data = images.default;
  },
  methods: {
    buildTree(treeDefinition) {
      const tree = new Tree("root");
      treeDefinition.shift();
      treeDefinition = treeDefinition.forEach((nodes, depth) => {
        nodes.map((node, index) => {
          if (depth === 0) {
            tree.createNode(node.name, index, depth, this.mapData(node));
          } else {
            let parents = tree.findAllNodesByDepth(depth - 1);
            let parent = parents.find(
              (parentNode) => node.parent == parentNode.index
            );
            if (parent.depth == depth - 1 && parent.index === node.parent) {
              parent.createNode(node.name, index, depth, this.mapData(node));
            }
          }
        });
      });
      return tree;
    },
    mapData(node) {
      return this.data.filter(item => item['pred subclass'] === node.name);
    },
    commute(targets, nodes) {
      if (nodes.length === 1) return this.tree;
      const origin = this.tree.findNodeByID(nodes[targets.from].id);
      const target = this.tree.findNodeByID(nodes[targets.to].id);


      let o_data = origin.data;
      const n_data = o_data.splice(targets.oldIndex, 1)[0];
      let t_data = target.data;
      t_data.splice(targets.newIndex, 0, n_data);
      target.data = t_data;
      return this.tree;
    }
  },
};
