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

            //console.info("fetching data");

            let xhr = new XMLHttpRequest();            

            xhr.onerror = function(){ //Handling Errors in communication
                vue.errorOutput = "Ein Fehler ist aufgetreten: " + xhr.status;
            }

            xhr.ontimeout = function(){ //timeout handling
                vue.errorOutput = "Server brauchte zu lange zum antworten";
            }

            xhr.onload = function(){ //handle successful transfer
                if(xhr.status === 200) { //if successful, update table of tasks, else show error
                    vue.tasks = JSON.parse(xhr.responseText);
                } else {
                    vue.errorOutput = "Fehler beim Datenabruf: " + xhr.status;
                }
            }

            xhr.open('GET', 'backend.php', true);
            xhr.send();
        },
        saveNameInCookie(){
            var username = document.getElementById('username').value;
            document.cookie = 'username=' + encodeURIComponent(username) + '; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/';
            document.getElementById('username').value = "";
        },
        async submit(){
            //TODO: Validation 
            dueDate = document.getElementById('dueDate').value;
            taskName = document.getElementById('taskName').value;

            if(taskName.trim() === ""){
                vue.errorOutput = "Task Name darf nicht leer sein"
                return;
            }

            if(dueDate.trim() === ""){
                vue.errorOutput = "End Datum darf nicht leer sein."
                return;
            }

            //console.log("sending Task")
            let xhr = new XMLHttpRequest();
            xhr.onerror = function(){vue.errorOutputoutput = "Ein Fehler ist aufgetreten";}

            xhr.ontimeout = function() {vue.errorOutput = "Server brauchte zu lange zum antworten";}

            xhr.onload = function() {
                vue.errorOutput = "Erfolg";
                vue.tasks = JSON.parse(xhr.responseText);
            }

            //create empty json
            var body = {
                "dueDate": "",
                "taskName": "",
                "taskDesc": ""
            };

            //fillout json
            body.dueDate = dueDate;
            body.taskName = taskName;
            body.taskDesc = document.getElementById('taskDesc').value;

            let json = JSON.stringify(body);

            xhr.open('POST', 'backend.php', true);
            xhr.setRequestHeader('Content-Type', 'application/json')
            xhr.send(json);
        },
        async finishTask(task){
            //console.log("finishing Task");

            let xhr = new XMLHttpRequest();
            xhr.onerror = function(){vue.errorOutput = "Ein Fehler ist aufgetreten";}

            xhr.ontimeout = function() {vue.errorOutput = "Server benötigte zu lange zum antworten";}

            xhr.onload = function(){
                //remove choosen task from list
                vue.tasks = vue.tasks.filter((t) => t.taskId !== task.taskId);
            }

            xhr.open('POST', 'backend.php?finishTask=' + task.taskId, true);
            xhr.send();
        }
    },
    mounted: function(){
        this.fetchData();
    }

}).mount('#app')