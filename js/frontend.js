import { createApp } from 'https://cdn.jsdelivr.net/npm/vue/dist/vue.global.js'

var vue = createApp({
    data(){
        return {
            tasks: [],
            errorOutput: ""
        }
    },
    methods: {
        fetchData(){ //Fetches Table of Tasks from Server
            let xhr = new XMLHttpRequest();

            xhr.onerror = function(){ //Handling Errors in communication
                vue.errorOutput = "An Error has occured: " + xhr.status;
            }

            xhr.ontimeout = function(){ //timeout handling
                vue.errorOutput = "Server took too long to respond";
            }

            xhr.onload = function(){
                //TODO: what to do once i get data from server.
                if(xhr.status === 200) {

                } else {
                    vue.errorOutput = "Error fetching data: " + xhr.status;
                }
            }

        }

    },
    mounted: function(){
        //this todo when loading the webpage
    }

}).mount('#app')