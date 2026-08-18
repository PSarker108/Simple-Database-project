import readline from 'readline';

import {
  userRegistration,
  login,
  allUsers,
  updateUser,
  searchUser,
  deleteUser
} from './index.js';

import {
  createBlog,
  viewUserBlogs,
  allBlog,
  searchBlog,
  updateBlog,
  deleteBlog,
  allUsersBlog,
  adminDeleteBlog
} from './blog.js';

import {
  initDB,
  closeDB
} from './db.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//---------------- Input Helper ----------------

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

//---------------- Register ----------------

async function register() {
  console.log('\n========== Register ==========');

  const firstname = await ask('First Name: ');
  const lastname = await ask('Last Name: ');
  const email = await ask('Email: ');
  const password = await ask('Password: ');

  if (!firstname || !lastname || !email || !password) {
    console.log('All fields are required.');
    return;
  }

  await userRegistration(
    firstname,
    lastname,
    email,
    password
  );
}

//---------------- Login ----------------

async function handleLogin() {
  console.log('\n========== Login ==========');

  const email = await ask('Email: ');
  const password = await ask('Password: ');

  const user = await login(email, password);

  if (!user) {
    return;
  }

  if (user.role === 'admin') {
    await adminMenu(user);
  } else {
    await userMenu(user);
  }
}

//================================================
// USER MENU
//================================================

async function userMenu(user) {
  while (true) {
    console.log(`
========== User Menu ==========

1. View Your Blogs
2. Search Blog by ID/Title
3. Create Blog
4. Update Blog
5. Delete Blog
6. Logout
`);

    const choice = await ask('Choose an option: ');

    switch (choice) {

      case '1':
        await viewUserBlogs(user.id);
        break;

      case '2': {
        const query = await ask(
          'Enter Blog ID or Title: '
        );

        await searchBlog(query);
        break;
      }

      case '3':
        await handleCreateBlog(user);
        break;

      case '4':
        await handleUpdateBlog(user);
        break;

      case '5':
        await handleDeleteBlog(user);
        break;

      case '6':
        console.log('Logged out successfully.');
        return;

      default:
        console.log('Invalid option.');
    }
  }
}

//---------------- Create Blog ----------------

async function handleCreateBlog(user) {
  console.log('\n========== Create Blog ==========');

  const blogTitle = await ask('Blog Title: ');
  const blog = await ask('Blog Content: ');
  const category = await ask('Category: ');

  if (!blogTitle || !blog || !category) {
    console.log('All fields are required.');
    return;
  }

  await createBlog(
    user.id,
    blogTitle,
    blog,
    category
  );
}

//---------------- Update Blog ----------------

async function handleUpdateBlog(user) {
  console.log('\n========== Update Blog ==========');

  const id = await ask('Enter Blog ID: ');

  if (!/^\d+$/.test(id)) {
    console.log('Invalid Blog ID.');
    return;
  }

  const blogTitle = await ask(
    'New Blog Title: '
  );

  const blog = await ask(
    'New Blog Content: '
  );

  const category = await ask(
    'New Category: '
  );

  const updates = {};

  if (blogTitle) {
    updates.blogTitle = blogTitle;
  }

  if (blog) {
    updates.blog = blog;
  }

  if (category) {
    updates.category = category;
  }

  if (Object.keys(updates).length === 0) {
    console.log('No changes provided.');
    return;
  }

  await updateBlog(
    Number(id),
    user.id,
    updates
  );
}

//---------------- Delete Blog ----------------

async function handleDeleteBlog(user) {
  console.log('\n========== Delete Blog ==========');

  const id = await ask('Enter Blog ID: ');

  if (!/^\d+$/.test(id)) {
    console.log('Invalid Blog ID.');
    return;
  }

  await deleteBlog(
    Number(id),
    user.id
  );
}

//================================================
// ADMIN MENU
//================================================

async function adminMenu(user) {
  while (true) {
    console.log(`
========== Admin Menu ==========

1. View All Users
2. View All Blogs
3. Search Blog by ID/Title
4. Update User
5. Delete User
6. Delete Blog
7. Logout
`);

    const choice = await ask('Choose an option: ');

    switch (choice) {

      case '1':
        await allUsers();
        break;

      case '2':
        await allUsersBlog();
        break;

      case '3': {
        const query = await ask(
          'Enter Blog ID or Title: '
        );

        await searchBlog(query);
        break;
      }

      case '4':
        await handleUpdateUser();
        break;

      case '5':
        await handleDeleteUser(user);
        break;

      case '6':
        await handleAdminDeleteBlog();
        break;

      case '7':
        console.log('Logged out successfully.');
        return;

      default:
        console.log('Invalid option.');
    }
  }
}

//---------------- Admin Update User ----------------

async function handleUpdateUser() {
  console.log('\n========== Update User ==========');

  const id = await ask('Enter User ID: ');

  if (!/^\d+$/.test(id)) {
    console.log('Invalid User ID.');
    return;
  }

  console.log(`
1. Activate User
2. Deactivate User
`);

  const choice = await ask(
    'Choose an option: '
  );

  if (choice === '1') {
    await updateUser(Number(id), {
      isActive: true
    });

  } else if (choice === '2') {
    await updateUser(Number(id), {
      isActive: false
    });

  } else {
    console.log('Invalid option.');
  }
}

//---------------- Admin Delete User ----------------

async function handleDeleteUser(admin) {
  console.log('\n========== Delete User ==========');

  const id = await ask('Enter User ID: ');

  if (!/^\d+$/.test(id)) {
    console.log('Invalid User ID.');
    return;
  }

  if (Number(id) === admin.id) {
    console.log('Admin cannot delete the currently logged-in account.');
    return;
  }

  await deleteUser(Number(id));
}

//---------------- Admin Delete Blog ----------------

async function handleAdminDeleteBlog() {
  console.log('\n========== Delete Blog ==========');

  const id = await ask('Enter Blog ID: ');

  if (!/^\d+$/.test(id)) {
    console.log('Invalid Blog ID.');
    return;
  }

  await adminDeleteBlog(Number(id));
}

//================================================
// MAIN MENU
//================================================

async function mainMenu() {
  while (true) {
    console.log(`
========================================
        BLOG DATABASE APPLICATION
========================================

1. View All Blogs
2. Login
3. Register
4. Exit
`);

    const choice = await ask('Choose an option: ');

    switch (choice) {

      case '1':
        await allBlog();
        break;

      case '2':
        await handleLogin();
        break;

      case '3':
        await register();
        break;

      case '4':
        console.log('Application closed.');
        return;

      default:
        console.log('Invalid option.');
    }
  }
}

//================================================
// APPLICATION START
//================================================

try {
  await initDB();

  await mainMenu();

} catch (error) {
  console.error('Application error:', error.message);

} finally {
  rl.close();
  await closeDB();
}