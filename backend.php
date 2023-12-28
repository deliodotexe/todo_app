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
        json_encode($tasks);
    }
    mysqli_close($conn)
}


mysqli_close($conn); //close connection
?>