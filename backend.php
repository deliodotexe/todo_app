<?php

$conn = new mysqli("localhost", "root", "", "todo_app");

if (!$conn) { echo json_encode(['error' => "Connection failed"]); exit; } //copied from slide

if ($_SERVER['REQUEST_METHOD'] === 'GET') { 
    //Handling Get request from FetchData

    //Zusatztechniken 2: some SQL request to grab data from DB and return it
    $stmt = mysqli_prepare($conn, "SELECT taskName, taskDesc, dueDate, username, taskId FROM tasks WHERE isDone is FALSE ORDER BY dueDate");
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

    if(isset($_GET['finishTask'])){
        $taskId = intval($_GET['finishTask']);

        $query = "UPDATE tasks SET isDone = TRUE WHERE taskId = ?";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, 'i', $taskId);

        if(mysqli_stmt_execute($stmt)){
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => "Error updating task: " . $conn->error]);
        }

    } else {
        if(isset($data->dueDate, $data->taskName) && $data->dueDate !== "" && $data->taskName !== "") {
            $dueDate = $data->dueDate;
            $taskName = $data->taskName;
            $taskDesc = $data->taskDesc;
            
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
        } else {
            echo json_encode(['error' => "missing Data"]);
        }         
    }
}


mysqli_close($conn); //close connection
?>