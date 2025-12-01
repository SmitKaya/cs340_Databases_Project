-- Widdle Media Game Services
-- Database Definition (DDL)
-- Final Corrected Version

-- Drop tables in correct dependency order
DROP TABLE IF EXISTS UserAchievements;
DROP TABLE IF EXISTS Scores;
DROP TABLE IF EXISTS Achievements;
DROP TABLE IF EXISTS Games;
DROP TABLE IF EXISTS Users;

-- ==========================
-- USERS
-- ==========================
CREATE TABLE Users (
  userID INT AUTO_INCREMENT NOT NULL,
  userName VARCHAR(45) NOT NULL UNIQUE,
  createdDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (userID)
);

-- ==========================
-- GAMES
-- ==========================
CREATE TABLE Games (
  gameID INT AUTO_INCREMENT NOT NULL,
  title VARCHAR(45) NOT NULL UNIQUE,
  releaseDate DATE NOT NULL,
  developer VARCHAR(45) NOT NULL,
  PRIMARY KEY (gameID)
);

-- ==========================
-- ACHIEVEMENTS
-- ==========================
CREATE TABLE Achievements (
  achievementID INT AUTO_INCREMENT NOT NULL,
  gameID INT NOT NULL,
  title VARCHAR(45) NOT NULL,
  description VARCHAR(200),
  PRIMARY KEY (achievementID),
  FOREIGN KEY (gameID)
    REFERENCES Games(gameID)
    ON DELETE CASCADE
);

-- ==========================
-- SCORES
-- ==========================
CREATE TABLE Scores (
  scoreID INT AUTO_INCREMENT NOT NULL,
  scoreValue INT NOT NULL,
  scoreDate DATE NOT NULL,
  userID INT NOT NULL,
  gameID INT NOT NULL,
  PRIMARY KEY (scoreID),
  FOREIGN KEY (userID)
    REFERENCES Users(userID)
    ON DELETE CASCADE,
  FOREIGN KEY (gameID)
    REFERENCES Games(gameID)
    ON DELETE CASCADE
);

-- ==========================
-- USERACHIEVEMENTS
-- ==========================
CREATE TABLE UserAchievements (
  userID INT NOT NULL,
  achievementID INT NOT NULL,
  achievedDate DATE NOT NULL,
  PRIMARY KEY (userID, achievementID),
  FOREIGN KEY (userID)
    REFERENCES Users(userID)
    ON DELETE CASCADE,
  FOREIGN KEY (achievementID)
    REFERENCES Achievements(achievementID)
    ON DELETE CASCADE
);

-- ==========================
-- SAMPLE DATA
-- ==========================

INSERT INTO Games (title, releaseDate, developer) VALUES
  ('Back to the Boat!', '2025-04-01', 'Widdle Media'),
  ('Astro Jams',       '2025-10-06', 'Widdle Media'),
  ('Blood Writes',     '2024-04-15', 'Widdle Media'),
  ('HATCH',            '2024-10-07', 'Widdle Media');

INSERT INTO Users (userName, createdDate) VALUES
  ('jelch',    '2013-09-24'),
  ('crid626',  '2013-09-30'),
  ('newquinn', '2014-04-15');

INSERT INTO Achievements (gameID, title, description) VALUES
  ((SELECT gameID FROM Games WHERE title = 'Back to the Boat!'), 'Safe at Last!',       'Beat the game.'),
  ((SELECT gameID FROM Games WHERE title = 'Astro Jams'),        'Full Band!',          'Collect 100% of the musical jams.'),
  ((SELECT gameID FROM Games WHERE title = 'Blood Writes'),      'From the Deep It Comes', 'Complete the ritual.');

INSERT INTO Scores (scoreValue, scoreDate, userID, gameID) VALUES
  (1256, '2024-10-10', 2, 4),
  (800,  '2024-10-11', 1, 4),
  (1337, '2024-10-12', 3, 4);

INSERT INTO UserAchievements (userID, achievementID, achievedDate) VALUES
  (2, 1, '2025-04-02'),
  (1, 1, '2025-04-04'),
  (3, 2, '2025-10-15'),
  (1, 3, '2025-10-31');
