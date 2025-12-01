// ---------------------------------------------------
// SETUP
// ---------------------------------------------------

const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = 42072;

// Database connection
const db = require('./database/db-connector');

// Handlebars setup
const { engine } = require('express-handlebars');
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');


// ---------------------------------------------------
// ROUTES
// ---------------------------------------------------

// Home Page
app.get('/', async function (req, res) {
  try {
    res.render('home');
  } catch (error) {
    console.error('Error rendering home page:', error);
    res.status(500).send('An error occurred while rendering the home page.');
  }
});


app.get('/play', async function (req, res) {
	try {
		res.render('play');
	} catch (error) {
		console.error('Error loading play page:', error);
		res.status(500).send('An error occurred while rendering the play page.');
	}
});

// ---------------------------------------------------
// RESET BUTTON (calls your Reset() stored procedure)
// ---------------------------------------------------

app.get('/reset', async function (req, res) {
  try {
    const reset_query = 'CALL Reset();';
    await db.query(reset_query);
    res.redirect('/');
  } catch (error) {
    console.error('Error executing reset:', error);
    res.status(500).send('An error occurred while executing the reset.');
  }
});


// ---------------------------------------------------
// USERS
// ---------------------------------------------------

app.get('/users', async function (req, res) {
  try {
    const query1 = 'SELECT * FROM Users;';
    const [users] = await db.query(query1);
    res.render('users', { users: users });
  } catch (error) {
    console.error('Error loading users:', error);
    res.status(500).send('An error occurred while loading Users.');
  }
});

// Delete User
app.get('/users/delete/:id', async function (req, res) {
  try {
    const userID = req.params.id;
    const delete_query = `DELETE FROM Users WHERE userID = ?;`;
    await db.query(delete_query, [userID]);
    res.redirect('/users');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('An error occurred while deleting the User.');
  }
});

app.post('/users/add', async function (req, res) {
	try {
		const {userName} = req.body;
		const insert_query = `INSERT INTO Users (userName) VALUES (?);`;
		await db.query(insert_query, [userName]);
	} catch (error) {
		console.error('Error posting new user: ', error);
		res.status(500).send('An error occured while adding he user.');
	}
});

app.post('/users/update/:id', async function (req, res) {
	try {
		const {userName} = req.body;
		const userID = req.params.id;
		const update_query = `UPDATE Users SET userName = ? WHERE userID = ?;`;
		await db.query(update_query, [userName, userID]);
		alert(`User name changes to ${userName}`)
	} catch (error) {
		console.error('Error updating user name: ', error);
		res.status(500).send('An error occured while updating the user.');
	}
});

app.get('/getUser/:name', async function (req, res) {
	try {
		const userName = req.params.name;
		const id_query = `SELECT userID FROM Users WHERE userName = ?;`;
		const [results, fields] = await db.query(id_query, [userName]);
		const userID = results[0];
		res.json(userID);

	} catch (error) {
		console.error('Error retrieving id:', error);
		res.status(500).send('An error occured while getting user info.');
	}
});
// ---------------------------------------------------
// GAMES
// ---------------------------------------------------

app.get('/games', async function (req, res) {
  try {
    const query = 'SELECT * FROM Games;';
    const [games] = await db.query(query);

    // Convert releaseDate to just the year
    games.forEach(game => {
      game.releaseDate = game.releaseDate.getFullYear();
    });

    res.render('games', { games: games });
  } catch (error) {
    console.error('Error loading games:', error);
    res.status(500).send('An error occurred while loading Games.');
  }
});


// ---------------------------------------------------
// SCORES
// ---------------------------------------------------

app.get('/scores', async function (req, res) {
  try {
    const query = 'SELECT Scores.scoreID, Scores.scoreValue, Scores.scoreDate, Users.userName, Games.title AS gameTitle FROM Scores LEFT JOIN Users ON Scores.userID = Users.userID LEFT JOIN Games ON Scores.gameID = Games.gameID;';
    
    const [scores] = await db.query(query);

    res.render('scores', { scores: scores });
  } catch (error) {
    console.error('Error loading scores:', error);
    res.status(500).send('An error occurred while loading Scores.');
  }
});

app.post('/scores', async function (req, res) {
	try {
		const {userID, gameID, scoreValue} = req.body;
		const scoreDate = new Date().toISOString().slice(0, 10);
      		const insert_query = `INSERT INTO Scores (scoreValue, scoreDate, userID, gameID) VALUES (${scoreValue}, ${scoreDate}, ${userID}, ${gameID});`;
		
		await db.query(insert_query);
		
	} catch (error) {
			console.error('Error posting score: ', error);
			res.status(500).send('An error occured while posting score.');
	}
});


// ---------------------------------------------------
// ACHIEVEMENTS
// ---------------------------------------------------

app.get('/achievements', async function (req, res) {
  try {
    const query = 'SELECT * FROM Achievements;';
    const [achievements] = await db.query(query);
    res.render('achievements', { achievements: achievements });
  } catch (error) {
    console.error('Error loading achievements:', error);
    res.status(500).send('An error occurred while loading Achievements.');
  }
});


// ---------------------------------------------------
// USER ACHIEVEMENTS (M:M TABLE)
// ---------------------------------------------------

// Helper page to select users to view achievements (helper)
app.get('/userachievements', async function (req, res) {
  try {
    const query = 'SELECT * FROM Users;';

    const [users] = await db.query(query);

    res.render('uapage', {users:users});
  } catch (error) {
    console.error('Error loading user selection page: ', error);
    res.status(500).send('An error occured loading the user selection page.');
  }
});

app.post('/userachievements', async function (req, res) {
  try {
    const {userID} = req.body;
    res.redirect(`/achievements/user/${userID}`);
  } catch (error) {
    console.error('Error loading selected user achievement page: ', error);
    res.status(500).send('An error occured loading the selected users achievement page.');
  }
});

// READ Achievements for 1 User
app.get('/achievements/user/:id', async function (req, res) {
  try {
    const userID = req.params.id;

    const query = `
      SELECT UA.userID, UA.achievementID, A.title, UA.achievedDate
      FROM UserAchievements UA
      JOIN Achievements A ON UA.achievementID = A.achievementID
      WHERE UA.userID = ?;
    `;

    const user_query = `SELECT userName FROM Users WHERE userID = ?;`;
    const all_users_query = `SELECT userID, userName FROM Users;`;
    const all_achievements_query = `SELECT achievementID, title FROM Achievements;`;

    const [user_achievements] = await db.query(query, [userID]);
    const [user_name] = await db.query(user_query, [userID]);
    const [users] = await db.query(all_users_query);
    const [achievements] = await db.query(all_achievements_query);

    res.render('userachievements', {
      user_achievements,
      user_name: user_name[0].userName,
      users,
      achievements,
      userID
    });

  } catch (error) {
    console.error('Error loading user achievements:', error);
    res.status(500).send('An error occurred while loading User Achievements.');
  }
});

// INSERT
app.post('/userachievements/add', async function (req, res) {
  try {
    const { userID, achievementID, achievedDate } = req.body;

    const insert_query = `
      INSERT INTO UserAchievements (userID, achievementID, achievedDate)
      VALUES (?, ?, ?);
    `;

    await db.query(insert_query, [userID, achievementID, achievedDate]);

    res.redirect(`/achievements/user/${userID}`);
  } catch (error) {
    console.error('Error adding user achievement:', error);
    res.status(500).send('An error occurred while adding user achievement.');
  }
});

// DELETE
app.post('/userachievements/delete', async function (req, res) {
  try {
    const { userID, achievementID } = req.body;

    const delete_query = `
      DELETE FROM UserAchievements
      WHERE userID = ? AND achievementID = ?;
    `;

    await db.query(delete_query, [userID, achievementID]);

    res.redirect(`/achievements/user/${userID}`);
  } catch (error) {
    console.error('Error deleting user achievement:', error);
    res.status(500).send('An error occurred while deleting user achievement.');
  }
});


// ---------------------------------------------------
// LISTENER
// ---------------------------------------------------

app.listen(PORT, '0.0.0.0', function () {
  console.log(`Server running on http://classwork.engr.oregonstate.edu:${PORT}`);
});
