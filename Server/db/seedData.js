const client = require('./client');
require('dotenv').config();

const adminPass = process.env.ADMIN_PASS;
const adminUser = process.env.ADMIN_USER;

const {
  createUser,
  getUserByUsername,
  getUserById,
  getUser,
  getUserByEmail,
  getAllUsers,
  updateUser,
  updateUserPassword,

  // attachServicesToUser,
  // attachBundleToUser,
} = require('./users');

async function dropTables() {
  try {
    console.log('Dropping All Tables!..');

    await client.query(`
      DROP TABLE IF EXISTS users;
      `);

    console.log('All Tables Dropped!..');
  } catch (error) {
    console.log('Error dropping tables!..');
    throw error;
  }
}

async function createTables() {
  try {
    console.log('Starting to build tables...');

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name varchar(255) NOT NULL,
        username varchar(255) NOT NULL,
        password varchar(255) NOT NULL,
        address varchar(255) NOT NULL,
        email varchar(255) NOT NULL,
        isadmin BOOLEAN DEFAULT false,
        UNIQUE (username, email)
      );
      `);

    console.log('All tables created!');
  } catch (error) {
    console.error('Error creating tables!');
    throw error;
  }
}
async function createFakeUsers() {
  try {
    const fakeUsers = [
      {
        name: 'Rachaela',
        username: 'rachaela',
        password: 'rachaela1!',
        address: '1234 Street St',
        email: 'rachaela@gmail.com',
      },
      {
        name: 'Rus',
        username: 'rus',
        password: 'rus1!',
        address: '1234 Lane Ln',
        email: 'rus@gmail.com',
      },
      {
        name: 'Philip',
        username: 'philip',
        password: 'philip1!',
        address: '1234 Avenue Ave',
        email: 'philip@gmail.com',
      },
    ];
    const users = await Promise.all(fakeUsers.map(createUser));
    console.log('Users created:');
    console.log(users);
    console.log('Finished creating users!');
  } catch (error) {
    console.error('Error creating users!');
    throw error;
  }
}

// *******************USER TESTS******************//
async function testDB() {
  try {
    const userByUsername = await getUserByUsername('rachaela');
    console.log('testing getUserByUsername', userByUsername);

    const allUsers = await getAllUsers();
    console.log('These are all the users!', allUsers);

    const userById = await getUserById(1);
    console.log('testing getUserById', userById);

    const userByUser = await getUser('rus', 'rus1!');
    console.log('testing getUser', userByUser);

    const userByEmail = await getUserByEmail('philip@gmail.com');
    console.log('testing getUserByemail', userByEmail);

    console.log('finished testing database!');
  } catch (error) {
    console.log('error testing database');
    console.error(error);
  }
}

// *******************REBUILD*************************//
async function rebuildDB() {
  try {
    await dropTables();
    await createTables();
    await createFakeUsers();

    await testDB();
    //await initial stuff
  } catch (error) {
    console.log('Error during rebuildDB');
    throw error;
  }
}

module.exports = {
  rebuildDB,
  dropTables,
  createTables,
};
