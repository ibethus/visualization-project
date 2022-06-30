import * as axios from "axios";
import * as papa from "papaparse";
import * as images from "@/assets/files/short_properties_for_app_new.json";
import { LEVELS_ENUM } from "@/helpers/constants";

export default {
  data() {
    return {
      //distanceIndexesByImageId: Map,
      imagesData: null,
    };
  },
  async created() {
    //this.distanceIndexesByImageId = await this.getDistanceIndexesByImageId();
    this.imagesData = images.default;
  },
  methods: {
    async getNodes(level) {
      var indexIds = await this.getDistanceIndexesByImageId(level.neighborCSV);
      return indexIds.map((indexId) => {
        var imageData = this.imagesData.filter((i) => i.id == indexId.id);
        var imageClass = null;
        switch (level) {
          case LEVELS_ENUM.One:
            imageClass = imageData[0].level1;
            break;
          case LEVELS_ENUM.Two:
            imageClass = imageData[0].level2;
            break;
          case LEVELS_ENUM.Three:
            imageClass = imageData[0].level3;
            break;
          case LEVELS_ENUM.Four:
            imageClass = imageData[0].level4;
            break;
          case LEVELS_ENUM.Five:
            imageClass = imageData[0].level5;
            break;
          default:
            imageClass = imageData[0].level1;
            break;
        }
        return {
          id: indexId.id,
          group: imageClass,
        };
      });
    },
    async getDistanceIndexesByImageId(neighborCSV) {
      return axios.get("/data/" + neighborCSV).then((response) => {
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
    async getLinks(level) {
      var matchingNodesIndex = await this.getDistanceIndexesByImageId(level.neighborCSV);
      var firstRowIds = [];
      return axios.get("/data/" + level.distanceCSV).then((response) => {
        var distanceMatrix = papa.parse(response.data).data;
        firstRowIds = distanceMatrix[0];
        firstRowIds.shift();
        distanceMatrix.shift();
        distanceMatrix.pop();
        return distanceMatrix.flatMap((row) => {
          const id = row[0];
          row.shift();
          var filteredNodesIndex = matchingNodesIndex.filter(
            (distanceIndex) => distanceIndex.id == id
          )[0].indexes;
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
