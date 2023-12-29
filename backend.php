<?php

$conn = new mysqli("localhost", "root", "", "todo_app");

if (!$conn) { echo json_encode(['error' => "Connection failed"]); exit; } //copied from slide

if ($_SERVER['REQUEST_METHOD'] === 'GET') { 
    //Handling Get request from FetchData

    //Zusatztechniken 2: some SQL request to grab data from DB and return it
    $stmt = mysqli_prepare($conn, "SELECT taskName, taskDesc, dueDate, username FROM tasks WHERE isDone is FALSE ORDER BY dueDate");
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if($result){
        $tasks = [];
        while($row = mysqli_fetch_assoc($result)) {
            $tasks[] = $row;
        }
        echo json_encode($tasks);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST'){ 

    //decode Json
    $data = json_decode(file_get_contents("php://input"));
    //TODO: Validation

    if(isset($_GET['finishTask'])){
        //TODO: Update DB so isDone is true
    } else {
        //get values from json body and escape them to prevent sql injection
        $dueDate = $conn->real_escape_string($data->dueDate);
        $taskName = $conn->real_escape_string($data->taskName);
        $taskDesc = $conn->real_escape_string($data->taskDesc);
        
        //get username from cookie
        $username = isset($_COOKIE['username']) ? $_COOKIE['username'] : '';

        //prepare to prevent sql injection
        $query = "INSERT INTO tasks (dueDate, taskname, taskDesc, username) VALUES (?, ?, ?, ?)";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, 'ssss', $dueDate, $taskName, $taskDesc, $username);

        if(mysqli_stmt_execute($stmt)){ //execute
            $result= $conn->query("SELECT * FROM tasks WHERE isDone is FALSE");
            $tasks = [];

            while ($row = $result->fetch_assoc()) {
                $tasks[] = $row;
            }

            echo json_encode($tasks); //if successful, return open tasks to update the table
        } else {
            echo json_encode(['error' => "Error inserting task: " . $sql->error]);
        }
    }
}


mysqli_close($conn); //close connection
?>