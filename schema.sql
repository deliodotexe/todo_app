CREATE DATABASE todo_app;
USE todo_app;

CREATE TABLE tasks (
  taskId int AUTO_INCREMENT PRIMARY KEY,
  taskName VARCHAR(255) NOT NULL,
  taskDesc VARCHAR(255),
  dueDate DATE,
  isDone BOOLEAN NOT NULL DEFAULT FALSE,
  username VARCHAR(255) NOT NULL
);
--sql was created by hand. i had this at ZHAW and feel more confortable using sql rather than usinh phpmyadmin ui since i dont know it.