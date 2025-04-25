-- Script per creare il database ToDoAppDB
-- Include le tabelle: Users, Lists, Tasks

CREATE DATABASE ToDoAppDB;
GO

USE ToDoAppDB;
GO

CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(50) NOT NULL,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL
);

CREATE TABLE Lists (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Color NVARCHAR(20) NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE TABLE Tasks (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    ListId INT NULL,
    Title NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX),
    DueDate DATE NOT NULL,
    Status NVARCHAR(20) NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (ListId) REFERENCES Lists(Id)
);
