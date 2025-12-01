
-- Widdle Media Game Services
-- Data Manipulation (CRUD) Queries
-- Variables use @varName placeholders

-- =============================
-- USERS (FULL CRUD)
-- =============================

-- SELECT
SELECT userID, userName, createdDate
FROM Users;

-- INSERT
INSERT INTO Users (userName)
VALUES (@userName);

-- UPDATE
UPDATE Users
SET userName = @userName
WHERE userID = @userID;

-- DELETE
DELETE FROM Users
WHERE userID = @userID;



-- =============================
-- GAMES (FULL CRUD)
-- =============================

-- SELECT
SELECT gameID, title, releaseDate, developer
FROM Games;

-- INSERT
INSERT INTO Games (title, releaseDate, developer)
VALUES (@title, @releaseDate, @developer);

-- UPDATE
UPDATE Games
SET title = @title,
    releaseDate = @releaseDate,
    developer = @developer
WHERE gameID = @gameID;

-- DELETE
DELETE FROM Games
WHERE gameID = @gameID;



-- =============================
-- ACHIEVEMENTS (FULL CRUD + JOIN)
-- =============================

-- SELECT (with JOIN for readability)
SELECT 
  Achievements.achievementID,
  Achievements.title AS achievementTitle,
  Achievements.description,
  Games.title AS gameTitle
FROM Achievements
LEFT JOIN Games ON Achievements.gameID = Games.gameID;

-- INSERT
INSERT INTO Achievements (gameID, title, description)
VALUES (@gameID, @achievementTitle, @description);

-- UPDATE
UPDATE Achievements
SET gameID = @gameID,
    title = @achievementTitle,
    description = @description
WHERE achievementID = @achievementID;

-- DELETE
DELETE FROM Achievements
WHERE achievementID = @achievementID;



-- =============================
-- SCORES (FULL CRUD + JOIN)
-- =============================

-- SELECT with JOINs
SELECT 
  Scores.scoreID,
  Scores.scoreValue,
  Scores.scoreDate,
  Users.userName,
  Games.title AS gameTitle
FROM Scores
LEFT JOIN Users ON Scores.userID = Users.userID
LEFT JOIN Games ON Scores.gameID = Games.gameID;

-- INSERT
INSERT INTO Scores (scoreValue, scoreDate, userID, gameID)
VALUES (@scoreValue, @scoreDate, @userID, @gameID);

-- UPDATE
UPDATE Scores
SET scoreValue = @scoreValue,
    scoreDate  = @scoreDate,
    userID     = @userID,
    gameID     = @gameID
WHERE scoreID = @scoreID;

-- DELETE
DELETE FROM Scores
WHERE scoreID = @scoreID;



-- =============================
-- USERACHIEVEMENTS (FULL CRUD + JOIN)
-- =============================

-- SELECT with JOIN
SELECT 
  UserAchievements.userID,
  Users.userName,
  UserAchievements.achievementID,
  Achievements.title AS achievementTitle,
  UserAchievements.achievedDate
FROM UserAchievements
LEFT JOIN Users ON UserAchievements.userID = Users.userID
LEFT JOIN Achievements ON UserAchievements.achievementID = Achievements.achievementID;

-- INSERT
INSERT INTO UserAchievements (userID, achievementID, achievedDate)
VALUES (@userID, @achievementID, @achievedDate);

-- UPDATE
UPDATE UserAchievements
SET achievedDate = @achievedDate
WHERE userID = @userID AND achievementID = @achievementID;

-- DELETE
DELETE FROM UserAchievements
WHERE userID = @userID AND achievementID = @achievementID;
