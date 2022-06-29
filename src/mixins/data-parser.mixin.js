import * as axios from "axios";
import * as papa from "papaparse";

export default {
  data() {
    return {
      firstLevelDistanceIndexesById: Map,
    };
  },
  async created() {
    this.firstLevelDistanceIndexesById =
      await this.getFirstLevelDistanceIndexesById();
  },
  methods: {
    async getFirstLevelNodes() {
      //var firstRow = [];
      var indexIds = await this.getFirstLevelDistanceIndexesById();
        return indexIds.map((indexId) => {
          return {
            id: indexId.id,
            group: 1, //TODO : insérer la classe
          };
        });
    },
    async getFirstLevelDistanceIndexesById() {
      return axios.get("/data/" + "neighbor_first.csv").then((response) => {
        var formattedCSV = papa.parse(response.data).data;
        formattedCSV.shift();
        formattedCSV.pop();
        return formattedCSV.map((row) => {
          var id = row[0];
          row.shift();
          row.shift();
          return {
            id: id,
            indexes: row,
          };
        });
      });
    },
    async getFirstLevelLinks() {
      var matchingNodesIndex = await this.getFirstLevelDistanceIndexesById();
      var firstRowIds = [];
      return axios.get("/data/" + "distance_first.csv").then((response) => {
        var distanceMatrix = papa.parse(response.data).data;
        firstRowIds = distanceMatrix[0];
        firstRowIds.shift();
        distanceMatrix.shift();
        distanceMatrix.pop();
        return distanceMatrix.flatMap((row) => {
          const id = row[0];
          row.shift();
          var filteredNodesIndex = matchingNodesIndex.filter(distanceIndex => distanceIndex.id == id)[0].indexes;
          return filteredNodesIndex.slice(0, 10).map((nodeIndex) => {
            var distance = row[nodeIndex];
            var linkedNodeId = firstRowIds[nodeIndex];
            return {
              source: id,
              target: linkedNodeId,
              value: Math.round(distance),
            };
          });
        });
      });
    },
  },
};
