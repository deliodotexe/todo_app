import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';


var vue = createApp({
    data(){ //data object to store everything global
        return {
            tasks: [],
            formData:{
                taskName: '',
                dueDate: '',
            },
            errorOutput: {
                addTask: '',
                getTasks: '',
                taskName: '',
                dueDate: ''                
            },
            workloadPercentage: 0
        };
    },
    computed: { 
        isTaskNameValid() {
            return this.formData.taskName.trim() !== '';
        },
        isDueDateValid() {
            return this.formData.dueDate.trim() !== '';
        },
        isFormValid() {
            return this.isTaskNameValid && this.isDueDateValid;
        }
    },
    watch: {
        isTaskNameValid(newValue) {
            this.errorOutput.taskName = newValue ? '' : 'Task Name darf nicht leer sein.';
        },
        isDueDateValid(newValue) {
            this.errorOutput.dueDate = newValue ? '' : 'End Datum darf nicht leer sein.';
        }
    },
    methods: {
        fetchData(){ //Fetches Table of Tasks from Server

            //console.info("fetching data");

            let xhr = new XMLHttpRequest();            

            xhr.onerror = function(){ //Handling Errors in communication
                vue.errorOutput.getTasks = "Ein Fehler ist aufgetreten: " + xhr.status;
            }

            xhr.ontimeout = function(){ //timeout handling
                vue.errorOutput.getTask = "Server brauchte zu lange zum antworten";
            }

            xhr.onload = function(){ //handle successful transfer
                if(xhr.status === 200) { //if successful, update table of tasks, else show error
                    vue.tasks = JSON.parse(xhr.responseText);
                    vue.workloadPercentage = (vue.tasks.length / 16) * 100; //16 is the max amount of tasks i feel is too much

                    vue.drawWorkLoadBar(); //update bar
                } else {
                    vue.errorOutput.getTasks = "Fehler beim Datenabruf: " + xhr.status;
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
        submit(){ 
            dueDate = document.getElementById('dueDate').value;
            taskName = document.getElementById('taskName').value;

            vue.errorOutput.taskName = '';
            vue.errorOutput.dueDate = '';
            vue.errorOutput.addTask = '';
            vue.errorOutput.getTask = '';

            if (!this.isTaskNameValid || !this.isDueDateValid) {
                return; 
            }
            //console.log("sending Task")
            let xhr = new XMLHttpRequest();
            xhr.onerror = function(){vue.errorOutput.addTask = "Ein Fehler ist aufgetreten";}

            xhr.ontimeout = function() {vue.errorOutput.addTask = "Server brauchte zu lange zum antworten";}

            xhr.onload = function() {
                vue.tasks = JSON.parse(xhr.responseText);
                vue.workloadPercentage = (vue.tasks.length / 16) * 100; //16 is the max amount of tasks i feel is too much

                vue.drawWorkLoadBar();
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
        finishTask(task){
            //console.log("finishing Task");

            vue.errorOutput.taskName = '';
            vue.errorOutput.dueDate = '';
            vue.errorOutput.addTask = '';
            vue.errorOutput.getTask = '';

            let xhr = new XMLHttpRequest();
            xhr.onerror = function(){vue.errorOutput.getTasks = "Ein Fehler ist aufgetreten";}

            xhr.ontimeout = function() {vue.errorOutput.getTasks = "Server benötigte zu lange zum antworten";}

            xhr.onload = function(){
                //remove choosen task from list
                vue.tasks = vue.tasks.filter((t) => t.taskId !== task.taskId);
                vue.workloadPercentage = (vue.tasks.length / 16) * 100; //16 is the max amount of tasks i feel is too much

                vue.drawWorkLoadBar();
            }

            xhr.open('POST', 'backend.php?finishTask=' + task.taskId, true);
            xhr.send();
        },
        drawWorkLoadBar() {
            var canvas = document.getElementById('workLoadCanvas');
            var ctx = canvas.getContext('2d');
        
            // Set canvas dimensions based on its parent container
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = 25;  // You can adjust the height as needed
        
            var barWidth = (canvas.width * vue.workloadPercentage) / 100;
        
            // Clear the canvas before drawing
            ctx.clearRect(0, 0, canvas.width, canvas.height); //1
        
            if (vue.workloadPercentage < 30) {
                ctx.fillStyle = '#009900'; 
            } else if (vue.workloadPercentage < 70) {
                ctx.fillStyle = '#ff9900';
            } else {
                ctx.fillStyle = '#ff0000';
            }

            ctx.moveTo(0,0);
            ctx.lineTo(canvas.width, 0);
            ctx.stroke();
            ctx.lineTo(canvas.width, canvas.height);
            ctx.stroke();
            ctx.lineTo(0, canvas.height);
            ctx.stroke();
            ctx.lineTo(0,0);
            ctx.stroke();

            var thirtyProcentBar = (canvas.width * 30) / 100;
            var SeventyProcentBaar = (canvas.width * 70) / 100;
        
            // Draw filled bar
            ctx.fillRect(0, 0, barWidth, canvas.height); //2

            ctx.moveTo(thirtyProcentBar, 0);
            ctx.lineTo(thirtyProcentBar, canvas.height);
            ctx.stroke();

            ctx.moveTo(SeventyProcentBaar, 0);
            ctx.lineTo(SeventyProcentBaar, canvas.height);
            ctx.stroke();

            
            // Add text in the middle of the canvas
            var text = 'Auslastung: ' + vue.workloadPercentage + '%';
            ctx.fillStyle = '#000'; // Set text color
            ctx.font = '16px Arial'; // Set font size and type
            var textWidth = ctx.measureText(text).width;
            var textX = (canvas.width - textWidth) / 2;
            var textY = canvas.height / 2;
            ctx.fillText(text, textX, textY+5); //3
        }
    },
    mounted: function(){
        this.fetchData();
        
    }

}).mount('#app')