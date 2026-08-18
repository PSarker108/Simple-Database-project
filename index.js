import { User } from './db.js';
import { Op } from 'sequelize';

//----------------userRegistration---------------------

export async function userRegistration(firstname, lastname, email, password) {
  const existing = await User.findOne({ where: { email } });

  if (existing) {
    console.log('Error: User already registered');
    return null;
  }

  const user = await User.create({
    firstname,
    lastname,
    email,
    password
  });

  console.log('User registered:', JSON.stringify(user, null, 2));
  return user;
}

//----------------allUsers----------------

export async function allUsers() {
  const users = await User.findAll();

  console.log('All users:', JSON.stringify(users, null, 2));

  return users;
}

//--------------updateUser------------------

export async function updateUser(id, updates) {
  const [affectedRows] = await User.update(updates, {
    where: { id }
  });

  if (affectedRows === 0) {
    console.log(`No user found with id ${id}`);
  } else {
    const updated = await User.findByPk(id);

    console.log(
      'User updated:',
      JSON.stringify(updated, null, 2)
    );
  }
}

//---------------searchUser-----------------

export async function searchUser(query) {
  const input = String(query ?? '').trim();
  const isNumericId = /^\d+$/.test(input);

  const where = isNumericId
    ? { id: Number(input) }
    : {
        [Op.or]: [
          { firstname: { [Op.like]: `%${input}%` } },
          { lastname: { [Op.like]: `%${input}%` } },
          { email: { [Op.like]: `%${input}%` } },
        ],
      };

  const users = await User.findAll({ where });

  console.log(
    `Search results for "${query}":`,
    JSON.stringify(users, null, 2)
  );

  return users;
}

//----------------deleteUser-------------------

export async function deleteUser(id) {
  const deleted = await User.destroy({
    where: { id }
  });

  if (deleted === 0) {
    console.log('No user found to delete.');
  } else {
    console.log(`Deleted ${deleted} user(s).`);
  }
}

//----------------login---------------------

export async function login(email, password) {
  const user = await User.findOne({
    where: {
      email,
      password
    }
  });

  if (!user) {
    console.log('Invalid email or password');
    return null;
  }

  if (!user.isActive) {
    console.log('User is deactivated');
    return null;
  }

  console.log('Login successful');
  return user;
}