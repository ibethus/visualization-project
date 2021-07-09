/* eslint-disable no-useless-escape */
import Tree from "@/classes/Tree";
import { BLACKLISTED_WORDS, TAGS_COLORS } from "@/helpers/constants";
// import * as definition from "@/assets/files/paysages.json";
// import * as images from "@/assets/files/formattedPaysages.json";
import * as definition from "@/assets/files/completedTree.json";
import * as images from "@/assets/files/formatted_groundtruth.json";
// import * as definition from "@/assets/files/dummyTree.json";
// import * as definition from "@/assets/files/sampleTree.json";

let id = 1;
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
            if (item.caption?.toLowerCase().includes(tag)) {
              item.tags.push({
                name: tag,
                occurrence: tags[tag],
                color: this.mapTagColor(tags[tag]),
              });
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
      o_data.splice(targets.oldIndex, 1)[0];
      // console.log(n_data);
      let t_data = target.data;
      console.log("--------------------------------");
      console.log(o_data);
      console.log(t_data);
      console.log("--------------------------------");
      t_data.splice(targets.newIndex, 0, JSON.parse(targets.value));
      console.log("--------------------------------");
      console.log(o_data);
      console.log(t_data);
      console.log("--------------------------------");
      target.data = t_data;
      return this.tree;
    },
    generateTags() {
      return this.data
        .flatMap((entry) =>
          entry.caption
            ?.toLowerCase()
            .replaceAll(
              /[\(|\;|\)|\:|\.|\=|\+|\,|\?|\!|\^|\$|\'|\"|\*|\-|\d+|]/g,
              ""
            )
            .split(" ")
        )
        .filter(
          (word) =>
            !BLACKLISTED_WORDS.includes(word) &&
            word?.length >= 3 &&
            isNaN(+word)
        )
        .reduce((obj, e) => {
          obj[e] = (obj[e] || 0) + 1;
          if (obj[e] === this.data.length) {
            delete obj[e];
          }
          return obj;
        }, {});
    },
    mapTagColor(value) {
      let color = TAGS_COLORS[0];
      for (let i = 0; i < TAGS_COLORS.length; i++) {
        //console.log(i);
        if (value > Math.exp(i)) {
          color = TAGS_COLORS[i];
        }
      }
      return color;
    },
    exportJSON() {
      const toExport = [];
      let tmp_tree = this.tree;
      tmp_tree.traverse((node) => {
        let tmp = node.data;
        tmp.map((data) => (data.node_name = node.name));
        toExport.push(...tmp);
      });
      toExport.map((e) => {
        e.correction = e.node_name === e["pred subclass"] ? "" : e.node_name;
        //delete e.node_name
        // delete e.tags
        return e;
        // return JSON.stringify(e);
      });
      const corrections = toExport.filter((e) => e.correction != "").length;
      this.download(
        `corrected-data-V${id++}-C${corrections}.json`,
        JSON.stringify(toExport)
      );
    },
    download(filename, text) {
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
      );
      element.setAttribute("download", filename);

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
  },
};
