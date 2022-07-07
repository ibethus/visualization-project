import * as axios from "axios";
import * as papa from "papaparse";
import { LEVELS_ENUM } from "@/helpers/constants";

export default {
  data() {
    return {
      //distanceIndexesByImageId: Map,
      imagesData: null,
      imagesDatesData: null,
      imagesLoading: true
    };
  },
  methods: {
    getActualUrl(){
      return `${window.location.origin}`;
    },
    async parseImagesDataJson(){
      // eslint-disable-next-line no-undef
      return fetch(`${process.env.VUE_APP_PATH_FILES}short_properties_for_app_new.json`)
      .then(response => response.json())
      .then(this.imagesLoading = false)
    },
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
          // eslint-disable-next-line no-undef
          image_path: `${process.env.VUE_APP_PATH_IMAGES}${imageData[0].Path}`,
          timeline: imageData[0].converted_timeline,
          pdf: imageData[0].path_to_report,
          caption: imageData[0].caption,
          page: imageData[0].page
        };
      });
    },
    async getDistanceIndexesByImageId(neighborCSV) {
      // eslint-disable-next-line no-undef
      return axios.get(process.env.VUE_APP_PATH_DATA + neighborCSV).then((response) => {
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
      // eslint-disable-next-line no-undef
      return axios.get(process.env.VUE_APP_PATH_DATA + level.distanceCSV).then((response) => {
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
          return filteredNodesIndex.slice(0, 5).map((nodeIndex) => {
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
    getClassImageIds(nodeClass, level) {
        var matchingImages = null;
        switch (level) {
          case LEVELS_ENUM.One:
            matchingImages = this.imagesData.filter(image => image.level1 == nodeClass);
            break;
          case LEVELS_ENUM.Two:
            matchingImages = this.imagesData.filter(image => image.level2 == nodeClass);
            break;
          case LEVELS_ENUM.Three:
            matchingImages = this.imagesData.filter(image => image.level3 == nodeClass);
            break;
          case LEVELS_ENUM.Four:
            matchingImages = this.imagesData.filter(image => image.level4 == nodeClass);
            break;
          case LEVELS_ENUM.Five:
            matchingImages = this.imagesData.filter(image => image.level5 == nodeClass);
            break;
          default:
            matchingImages = this.imagesData.filter(image => image.level1 == nodeClass);
            break;
        }
        return matchingImages.map(image => image.id.toString());
    },
    prepareImageWithDates() {
      return this.imagesData.map(image => {
        var firstDate = null;
        var secondDate = null;
        if(image.converted_timeline) {
          if(image.converted_timeline.includes('/')) {
            firstDate = image.converted_timeline.split('/')[0];
            secondDate = image.converted_timeline.split('/')[1];
          }
          else {
            firstDate = image.converted_timeline;
            secondDate = firstDate;
          }
        }
        return {
          id : image.id,
          dateMin : Date.parse(firstDate),
          dateMax : Date.parse(secondDate)
        }
      })
    }
  },
};
