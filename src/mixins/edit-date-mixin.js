export default {
    data() {
        return {

        };
    },
    methods: {
    async parseImagesDataJson(){
        // eslint-disable-next-line no-undef
        return fetch(`${process.env.VUE_APP_PATH_FILES}short_properties_for_app_new.json`)
        .then(response => response.json())
        },
    },
    async setNewDate(nodeId, startDate, endDate){
        var json = await this.parseImagesDataJson();
        for (var i = 0; i < json.length; i++) {
            if (json[i].id === nodeId) {
                json[i].converted_timeline = `${startDate}${endDate ? '/' + endDate : ''}`;
                return;
            }
        }
    }
}