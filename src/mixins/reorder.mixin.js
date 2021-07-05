import Tree from "@/classes/Tree";
import * as definition from "@/assets/files/animal.json";
// import * as definition from "@/assets/files/dummyTree.json";
// import * as definition from "@/assets/files/sampleTree.json";

export default {
  created() {
    console.log(definition);
    this.definition = definition.default;
    this.tree = this.buildTree(this.definition);
  },
  data() {
    return {
      definition: [],
      tree: null,
    };
  },
  methods: {
    buildTree(treeDefinition) {
      const tree = new Tree("root");
      treeDefinition.shift();
      treeDefinition = treeDefinition.forEach((nodes, depth) => {
        nodes.map((node, index) => {
          if (depth === 0) {
            tree.createNode(node.name, index, depth);
          } else {
            let parents = tree.findAllNodesByDepth(depth - 1);
            let parent = parents.find(
              (parentNode) => node.parent == parentNode.index
            );
            if (parent.depth == depth - 1 && parent.index === node.parent) {
              parent.createNode(node.name, index, depth);
            }
          }
        });
      });
      return tree;
    },
  },
};
