import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';


var vue = createApp({
    data(){
        return {
            tasks: [],
            errorOutput: ""
        }
    },
    methods: {
        fetchData(){ //Fetches Table of Tasks from Server

            console.info("fetching data");

            let xhr = new XMLHttpRequest();            

            xhr.onerror = function(){ //Handling Errors in communication
                vue.errorOutput = "An Error has occured: " + xhr.status;
            }

            xhr.ontimeout = function(){ //timeout handling
                vue.errorOutput = "Server took too long to respond";
            }

            xhr.onload = function(){
                if(xhr.status === 200) {
                    vue.tasks = JSON.parse(xhr.responseText);
                } else {
                    vue.errorOutput = "Error fetching data: " + xhr.status;
                }
            }

            xhr.open('GET', 'backend.php?', true);
            xhr.send();
        }

    },
    mounted: function(){
        this.fetchData();
        //this todo when loading the webpage
    }

}).mount('#app')