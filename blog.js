import { Blog, User } from './db.js';
import { Op } from 'sequelize';

//---------------- createBlog ---------------------

export async function createBlog(userId, blogTitle, blog, category) {
  const user = await User.findByPk(userId);

  if (!user) {
    console.log('Error: User not found');
    return null;
  }

  const newBlog = await Blog.create({
    userId,
    blogTitle,
    blog,
    category
  });

  console.log(
    'Blog created:',
    JSON.stringify(newBlog, null, 2)
  );

  return newBlog;
}

//---------------- viewUserBlogs ----------------

export async function viewUserBlogs(userId) {
  const blogs = await Blog.findAll({
    where: { userId },
    order: [['id', 'ASC']]
  });

  if (blogs.length === 0) {
    console.log('No blogs are found');
    return [];
  }

  console.log('\nYour blogs:');

  blogs.forEach((item) => {
    console.log(
      `ID: ${item.id} | Title: ${item.blogTitle}`
    );
  });

  return blogs;
}

//---------------- allBlog ----------------

export async function allBlog() {
  const blogs = await Blog.findAll({
    order: [['id', 'ASC']]
  });

  if (blogs.length === 0) {
    console.log('No blogs are found');
    return [];
  }

  console.log('\nAll blogs:');

  blogs.forEach((item) => {
    console.log(
      `ID: ${item.id} | User ID: ${item.userId} | Title: ${item.blogTitle} | Category: ${item.category}`
    );
  });

  return blogs;
}

//---------------- searchBlog ----------------

export async function searchBlog(query) {
  const input = String(query ?? '').trim();

  if (!input) {
    console.log('Search value cannot be empty');
    return [];
  }

  const isNumericId = /^\d+$/.test(input);

  const where = isNumericId
    ? { id: Number(input) }
    : {
        blogTitle: {
          [Op.like]: `%${input}%`
        }
      };

  const blogs = await Blog.findAll({
    where,
    order: [['id', 'ASC']]
  });

  if (blogs.length === 0) {
    console.log(`No blog found for "${query}"`);
    return [];
  }

  console.log('\nSearch results:');

  blogs.forEach((item) => {
    console.log(`
Blog ID: ${item.id}
User ID: ${item.userId}
Title: ${item.blogTitle}
Category: ${item.category}
Content: ${item.blog}
------------------------------
`);
  });

  return blogs;
}

//---------------- updateBlog ------------------

export async function updateBlog(id, userId, updates) {
  const [affectedRows] = await Blog.update(
    updates,
    {
      where: {
        id,
        userId
      }
    }
  );

  if (affectedRows === 0) {
    console.log(`No blog found with id ${id}`);
    return null;
  }

  const updated = await Blog.findByPk(id);

  console.log(
    'Blog updated:',
    JSON.stringify(updated, null, 2)
  );

  return updated;
}

//---------------- deleteBlog -------------------

export async function deleteBlog(id, userId) {
  const deleted = await Blog.destroy({
    where: {
      id,
      userId
    }
  });

  if (deleted === 0) {
    console.log('No blog found to delete.');
    return false;
  }

  console.log(`Deleted ${deleted} blog(s).`);

  return true;
}

//---------------- allUsersBlog ----------------

export async function allUsersBlog() {
  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: [
        'id',
        'firstname',
        'lastname',
        'email'
      ]
    },

    order: [['id', 'ASC']]
  });

  if (blogs.length === 0) {
    console.log('No blogs are found');
    return [];
  }

  console.log('\nAll users blogs:');

  blogs.forEach((item) => {
    console.log(`
Blog ID: ${item.id}
User ID: ${item.userId}
User: ${item.User.firstname} ${item.User.lastname}
Title: ${item.blogTitle}
Category: ${item.category}
Content: ${item.blog}
------------------------------
`);
  });

  return blogs;
}

//---------------- adminDeleteBlog ----------------

export async function adminDeleteBlog(id) {
  const deleted = await Blog.destroy({
    where: { id }
  });

  if (deleted === 0) {
    console.log('No blog found to delete.');
    return false;
  }

  console.log(`Deleted ${deleted} blog(s).`);

  return true;
}