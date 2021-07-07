import Tree from "@/classes/Tree";
import { BLACKLISTED_WORDS } from "@/helpers/constants";
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
      const tags = this.generateTags();
      return this.data
        .filter((item) => item["pred subclass"] === node.name)
        .map((item) => {
          item.tags = [];
          Object.keys(tags).forEach((tag) => {
            if (item.caption.toLowerCase().includes(tag)) {
              item.tags.push({ name: tag, occurrence: tags[tag] });
            }
          });
          return item;
        });
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
    },
    generateTags() {
      return this.data
        .flatMap((entry) => entry.caption.toLowerCase().split(" "))
        .filter((word) => !BLACKLISTED_WORDS.includes(word))
        .reduce((obj, e) => {
          obj[e] = (obj[e] || 0) + 1;
          if (obj[e] === this.data.length) {
            delete obj[e];
          }
          return obj;
        }, {});
    },
  },
};
