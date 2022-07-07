<template>
  <div id="network" :style="{width: svgSize.width +'px', height: svgSize.height+'px'}">
    <div
      class="linkText"
      :style="linkTextPosition"
      v-show="linkTextVisible"
      v-text="linkTextContent"
    ></div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      :width="svgSize.width"
      :height="svgSize.height"
      :style="{'background-color': theme.bgcolor}"
      @click="clickEle"
      @mouseover.prevent="svgMouseover"
      @mouseout="svgMouseout"
    >
      <g id="container">
        <!-- links and link-text -->
        <g>
          <g v-for="link in links" :key="link.index">
            <line
              :class="`${link[linkTypeKey]} ${link.selected} link element`"
              :stroke="theme.linkStroke"
              :stroke-width="linkWidth"
            ></line>
            <text
              v-if="showLinkText"
              dx="0"
              dy="0"
              class="link-text"
              :fill="theme.textFill"
              :font-size="linkTextFrontSize"
            >{{link[linkTextKey]}}</text>
          </g>
        </g>

        <!-- node and node-text -->
        
        <g id="node-group">
          <g v-for="node in nodes" :key="node.index" class="image_holder">
            <circle
              :nodeId="node.id"
              :fill="nodeColor(node[nodeTypeKey])"
              :stroke-width="highlightNodes.indexOf(node.id) == -1? 3:3"
              :stroke="highlightNodes.indexOf(node.id) == -1? theme.nodeStroke: 'red' "
              :class="`${node[nodeTypeKey]} ${node.showText?'selected' : ''} node element 
              ${isNodeInSearchResult(node.id) ? '':'no_result'}`"
              :r="nodeSize"
            ></circle>
            <image
              v-show="node.showText"
              :xlink:href="node.image_path"
              x="-15"
              y="-15"
              width="32"
              height="32"
              class="image"
              style="pointer-events: none;"
            />
            <image
              v-show="isIncludedInSearchResult(node.id) && getTesseractResultFromNodeId(node.id)"
              xlink:href="/assets/image.png"
              x="15"
              y="-20"
              width="15"
              height="15"
              class="tesseract"
              style="pointer-events: none;"
            />
            <image
              v-show="isIncludedInSearchResult(node.id) && getCaptionResultFromNodeId(node.id)"
              xlink:href="/assets/caption.png"
              x="15"
              y="0"
              width="15"
              height="15"
              class="caption"
              style="pointer-events: none;"
            />
            <image
              v-show="isIncludedInSearchResult(node.id) && getPageTextResultFromNodeId(node.id)"
              xlink:href="/assets/book.png"
              x="15"
              y="20"
              width="15"
              height="15"
              class="page_text"
              style="pointer-events: none;"
            />
          </g>
        </g>
      </g>
    </svg>
  </div>
  <!-- </div> -->
</template>

<script>
import * as d3 from "d3";
DOMTokenList.prototype.indexOf = Array.prototype.indexOf;

export default {
  props: {
    nodeList: Array,
    linkList: Array,
    // node
    nodeSize: {
      type: Number,
      default: 14
    },
    nodeTextKey: {
      type: String,
      default: "id"
    },
    nodeTypeKey: {
      type: String,
      default: "group"
    },
    nodeTextFontSize: {
      type: Number,
      default: 14
    },
    // link
    linkWidth: {
      type: Number,
      default: 2
    },
    showLinkText: {
      type: Boolean,
      default: false
    },
    linkTextKey: {
      type: String,
      default: "value"
    },
    linkTypeKey: {
      type: String,
      default: "type"
    },
    linkTextFrontSize: {
      type: Number,
      default: 10
    },
    linkDistance: {
      type: Number,
      default: 50
    },
    // svg
    svgSize: {
      type: Object,
      default: () => {
        return {
          width: window.innerWidth,
          height: window.innerHeight
        };
      }
    },
    svgTheme: {
      type: String,
      default: "light" // dark or light
    },
    bodyStrength: {
      type: Number,
      default: -150
    },
    // others
    highlightNodes: {
      type: Array,
      default: () => {
        return [];
      }
    },
    /**
     * Used to determinate which nodes are of type searchResult. The elements in this array must be of type :
     * {
     * id: nodeId,
     * tesseract: boolean, => true if the result is found in tesseract
     * caption: boolean,
     * pageText: boolean
     * }
     * 
     */
    searchResults: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      selection: {
        links: [],
        nodes: []
      },
      pinned: [], 
      force: null,
      zoom: d3.zoom(),
      nodeColor: d3.scaleOrdinal(d3.schemeCategory10),
      linkTextVisible: false,
      linkTextPosition: {
        top: 0,
        left: 0
      },
      linkTextContent: ""
    };
  },
  computed: {
    nodes() {
      let nodes = this.nodeList.slice();
      let nodeIds = [];
      nodes = nodes.filter(node => {
        if (nodeIds.indexOf(node.id) === -1) {
          nodeIds.push(node.id);
          return true;
        } else {
          return false;
        }
      });
      return nodes;
    },
    links() {
      return this.linkList;
    },
    theme() {
      if (this.svgTheme === "light") {
        return {
          bgcolor: "white",
          nodeStroke: "white",
          linkStroke: "lightgray",
          textFill: "black"
        };
      } else {
        // dark
        return {
          bgcolor: "black",
          nodeStroke: "white",
          linkStroke: "rgba(200,200,200)",
          textFill: "white"
        };
      }
    }
  },
  watch: {
    bodyStrength: function() {
      this.initData();
      // this.$nextTick(function() {
      //   this.computeNodePositions();
      // });
    },
    linkDistance: function() {
      this.initData();
      this.$nextTick(function() {
        this.computeNodePositions();
      });
    },
    nodes: function() {
      this.initData();
      // this.$nextTick(function() {
      //   this.computeNodePositions();
      // });
    },
  },
  created() {
    this.initData();
  },
  mounted() {
    this.computeNodePositions();
  },
  methods: {
    isNodeInSearchResult(nodeId){
      return this.isIncludedInSearchResult(nodeId) || !this.searchResults
    },
    isIncludedInSearchResult(nodeId){
      return this.searchResults && this.searchResults.length > 0 && this.searchResults.some(r => r.id == nodeId);
    },
    getTesseractResultFromNodeId(nodeId){
      if (this.searchResults){
        return this.searchResults.filter(r => r.id == nodeId)[0].tesseract;
      }
      return false;
    },
    getCaptionResultFromNodeId(nodeId){
      if (this.searchResults){
        return this.searchResults.filter(r => r.id == nodeId)[0].caption;
      }
      return false;
    },
    getPageTextResultFromNodeId(nodeId){
      if (this.searchResults){
        return this.searchResults.filter(r => r.id == nodeId)[0].pageText;
      }
      return false;
    },
    initData() {
      this.force = d3
        .forceSimulation(this.nodes)
        .force(
          "link",
          d3
            .forceLink(this.links)
            .id(d => d.id)
            .distance(this.linkDistance)
        )
        .force("charge", d3.forceManyBody().strength(this.bodyStrength)) //The strength of the attraction or repulsion
        .force(
          "center",
          d3.forceCenter(this.svgSize.width / 2, this.svgSize.height / 2)
        );

    },
    computeNodePositions() {
      for (var i = 0, n = Math.ceil(Math.log(this.force.alphaMin()) / Math.log(1 - this.force.alphaDecay())); i < n; ++i) {
        this.force.tick();
      }
      this.force.on("tick", () => {
        d3.selectAll(".link")
          .data(this.links)
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);
        d3.selectAll(".node")
          .data(this.nodes)
          .attr("transform", d => `translate(${d.x},${d.y})`)
        d3.selectAll(".image")
          .data(this.nodes)
          .attr("transform", d => `translate(${d.x},${d.y})`)
        d3.selectAll(".tesseract")
          .data(this.nodes)
          .attr("transform", d => `translate(${d.x},${d.y})`)
        d3.selectAll(".caption")
          .data(this.nodes)
          .attr("transform", d => `translate(${d.x},${d.y})`)
        d3.selectAll(".page_text")
          .data(this.nodes)
          .attr("transform", d => `translate(${d.x},${d.y})`)
        d3.selectAll(".node-text")
          .data(this.nodes)
          .attr("x", d => d.x)
          .attr("y", d => d.y);
        d3.selectAll(".link-text")
          .data(this.links)
          .attr("x", d => (d.source.x + d.target.x) / 2)
          .attr("y", d => (d.source.y + d.target.y) / 2);
      });

      this.zoom.scaleExtent([0.1, 4]).on("zoom", this.zoomed);

      d3.select("svg")
        .call(this.zoom)
        .on("dblclick.zoom", null);
    },
    clickLink(e) {
      this.$emit("clickLink", e, e.target.__data__);
    },
    clickNode(e) {
      // if (this.pinned.length === 0) {
      //   this.pinnedState(e);
      // } else {
      //   d3.selectAll(".element").style("opacity", 0.2);
      //   this.pinned = [];
      // }
      this.$emit("clickNode", e, e.target.__data__);
    },
    clickEle(e) {
      if (e.target.tagName === "circle") {
        this.clickNode(e);
      } else if (e.target.tagName === "line") {
        this.clickLink(e);
      }
    },
    svgMouseover(e) {
      if (e.target.nodeName === "circle") {
        if (this.pinned.length === 0) {
          this.selectedState(e);
        }
        this.$forceUpdate();
        this.$emit("hoverNode", e, e.target.__data__);
      } else if (e.target.nodeName === "line") {
        this.linkTextPosition = {
          left: e.clientX + "px",
          top: e.clientY - 50 + "px"
        };
        this.linkTextContent = e.target.__data__[this.linkTextKey];
        this.linkTextVisible = true;
        this.$emit("hoverLink", e, e.target.__data__);
      }
    },
    svgMouseout(e) {
      this.linkTextVisible = false;
      if (e.target.nodeName === "circle") {
        if (this.pinned.length === 0) {
          this.noSelectedState(e);
        }
        this.$forceUpdate();
      }
    },
    selectedState(e) {
      e.target.__data__.showText = true;
      e.target.classList.add("selected");
      this.selection.nodes.push(e.target.__data__);
      this.lightNeibor(e.target.__data__);
      d3.selectAll(".element").style("opacity", 0.2);
    },
    noSelectedState(e) {
      e.target.__data__.showText = false;
      this.darkenNerbor();
      d3.selectAll(".element").style("opacity", 1);
    },
    pinnedState(e) {
      this.pinned.push(e.target.__data__.index);
      d3.selectAll(".element").style("opacity", 0.05);
    },
    lightNeibor(node) {
      this.links.forEach(link => {
        if (link.source.index === node.index) {
          link.selected = "selected";
          this.selection.links.push(link);
          this.selection.nodes.push(link.target);
          this.lightNode(link.target);
        }
        if (link.target.index === node.index) {
          link.selected = "selected";
          this.selection.links.push(link);
          this.selection.nodes.push(link.source);
          this.lightNode(link.source);
        }
      });
    },
    lightNode(selectedNode) {
      this.nodes.forEach(node => {
        if (node.index === selectedNode.index) {
          node.showText = true;
        }
      });
    },
    darkenNerbor() {
      this.links.forEach(link => {
        this.selection.links.forEach(selectedLink => {
          if (selectedLink.id === link.id) {
            link.selected = "";
          }
        });
      });
      this.nodes.forEach(node => {
        this.selection.nodes.forEach(selectednode => {
          if (selectednode.id === node.id) {
            node.showText = false;
          }
        });
      });
      this.selection.nodes = [];
      this.selection.links = [];
    },
    zoomed() {
      d3.select("#container").attr(
        "transform",
        "translate(" +
          d3.event.transform.x +
          "," +
          d3.event.transform.y +
          ") scale(" +
          d3.event.transform.k +
          ")"
      );
    },
  }
};
</script>

<style scoped>
.element {
  transition: opacity 0.5s ease;
}
.selected {
  opacity: 1 !important;
}
.node,
.link {
  cursor: pointer;
}
.linkText {
  position: absolute;
  z-index: 10;
  background-color: rgba(75, 75, 75, 0.596);
  border-radius: 10px;
  color: white;
  padding: 10px;
}
.no_result {
  opacity: 0.2 !important;
}
</style>

