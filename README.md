# Simple Database Project - Blogging Platform

A console-based blogging platform built with Node.js, JavaScript, and MySQL. The application provides user registration and authentication, blog management, role-based admin operations, and database-driven CRUD functionality through an interactive CLI.

## Table of Contents

- [Project Description](#project-description)
- [Project Demonstration](#project-demonstration)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Database Information](#database-information)
- [Application Flow](#application-flow)
- [Usage Instructions](#usage-instructions)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Author](#author)

---

## Project Description

This project is a simple blogging platform developed using Node.js and MySQL.

The application uses an interactive Command Line Interface (CLI) where users can register, log in, create and manage their own blog posts, while administrators have additional privileges for managing users and blogs.

Sequelize ORM is used to interact with the MySQL database and manage the relationship between users and blogs.

---

## Project Demonstration

A complete project demonstration with voice explanation is available below:

🎥 **[Watch Project Demonstration](https://drive.google.com/file/d/1mI0fpcgGN5OGtklCrAoijwqhEIj2i5sq/view?usp=sharing)**

The demonstration covers:

- User registration and login
- Viewing available blogs
- Creating blogs
- Viewing user blogs
- Searching blogs by ID or title
- Updating blogs
- Deleting blogs
- Admin operations
- User activation/deactivation
- Database operations


---

## Features

### Reader Features

Readers can access available blog content without logging in.

- View all available blogs
- View blog titles, content, categories, and associated information

### User Features

Registered users can log in and manage their own blog posts.

- User registration
- User login
- View own blogs
- Create multiple blogs
- Search blogs by ID or title
- Update own blogs using blog ID
- Delete own blogs using blog ID
- Display `No blogs are found` when the user has no blogs

### Admin Features

Administrators have additional privileges for managing the application.

- View all registered users
- View all blogs
- Search blogs by ID or title
- Update user account status & Activate or deactivate users
- Display `User is deactivated` when a deactivated user attempts to log in
- Delete any user
- Delete any blog

### Database Features

- MySQL database integration
- Sequelize ORM
- CRUD operations
- One-to-many relationship between users and blogs
- Foreign key relationship using `userId`
- Unique email constraint
- Required field validation
- Automatic timestamps for records

---

## Technologies Used

- **Runtime:** Node.js
- **Language:** JavaScript
- **Database:** MySQL
- **ORM:** Sequelize
- **Database Driver:** mysql2
- **Environment Management:** dotenv
- **CLI:** Node.js readline module

---

## Setup Instructions

### Prerequisites

Make sure the following are installed on your system:

- Node.js
- npm
- MySQL Server

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Simple_Database_Project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create the Database

Create the required MySQL database:

```sql
CREATE DATABASE blogdb;
```

### 4. Configure Environment Variables

Create a `.env` file in the project root directory:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=blogdb
DB_USER=your_user_name
DB_PASSWORD=your_password
```

Update the values according to your local MySQL configuration.

### 5. Run the Application

```bash
node main.js
```
## Database Information

The application uses a MySQL database named `blogdb`.

### Users Table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| firstname | STRING | User's first name |
| lastname | STRING | User's last name |
| email | STRING | User email, unique |
| password | STRING | User password |
| isActive | BOOLEAN | Account status, default true |
| role | STRING | User role, default user |
| createAt | TIMESTAMP | Account creation timestamp |
| updateAt | TIMESTAMP | Last update timestamp |

New users are created with:

- `isActive = true`
- `role = user`

An administrator can be created by manually changing the user's role value to `admin`.

### Blogs Table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| userId | INTEGER | Foreign key referencing users.id |
| blogTitle | STRING | Blog title |
| blog | TEXT | Blog content |
| category | STRING | Blog category |
| createAt | TIMESTAMP | Blog creation timestamp |
| updateAt | TIMESTAMP | Last update timestamp |
### Relationship

The application uses a one-to-many relationship between users and blogs:

```
User
  |
  | 1
  |
  |--------< Many
             |
           Blog
```

- One user can create multiple blogs
- Each blog belongs to one user
- `blogs.userId` references `users.id`

## Application Flow

When the application starts, the main menu provides the following options:

1. View All Blogs
2. Login
3. Register

### Reader Flow

A reader can select **1. View All Blogs** to view all available blogs without authentication.

### Registration Flow

A new user can register by providing:

- First name
- Last name
- Email (must be unique)
- Password

### Login Flow

A registered user can log in using:

- Email
- Password

After successful login, the application checks the user's role and account status. Regular users are directed to the user menu, while administrators are directed to the admin menu.

## Usage Instructions

### Main Menu

1. View All Blogs
2. Login
3. Register

## User Menu

After logging in as a regular user, the following operations are available:

1. View Your Blogs
2. Search Blog by ID/Title
3. Create Blog
4. Update Blog
5. Delete Blog

### View Your Blogs

Displays all blogs created by the currently logged-in user. If the user has no blogs, the message `No blogs are found` is displayed.

### Search Blog

A blog can be searched using:

- Blog ID
- Blog title

### Create Blog

A user can create a blog by providing:

- Blog title
- Blog content
- Category

Each created blog is associated with the logged-in user's ID.

### Update Blog

A user can update their own blog using the blog ID.

### Delete Blog

A user can delete their own blog using the blog ID.

## Admin Menu

After logging in with an administrator account, the admin can perform additional operations:

1. View All Users
2. View All Blogs
3. Search Blog by ID/Title
4. Update User
5. Delete User
6. Delete Blog

### View All Users

Displays the complete list of registered users using the `allUsers()` function.

### View All Blogs

Displays blogs created by all users using the `allUsersBlog()` function.

### Search Blog

Administrators can search for any blog using:

- Blog ID
- Blog title

#### Update User

Administrators can update a user's account information, including the `isActive` status. If a user's account is deactivated (`isActive = false`), that user cannot log in. The application displays: `User is deactivated`

#### Delete User

Administrators can delete any user from the system.

#### Delete Blog

Administrators can delete any blog regardless of its owner.

## Project Structure

```
Simple_Database_Project/
├── db.js
├── index.js
├── blog.js
├── main.js
├── package.json
├── package-lock.json
├── .gitignore
├── .env
└── README.md
```

### File Descriptions

| File | Description |
|------|-------------|
| `db.js` | Database connection and Sequelize models |
| `index.js` | User-related operations |
| `blog.js` | Blog-related operations |
| `main.js` | Application flow and CLI interaction |
| `package.json` | Project configuration and dependencies |
| `.env` | Database configuration (must remain local) |
| `.gitignore` | Specifies files excluded from Git |
| `README.md` | Project documentation |


## Environment Variables

The application requires the following environment variables in a `.env` file:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=blogdb
DB_USER=your_user_name
DB_PASSWORD=your_password
```

| Variable | Description |
|----------|-------------|
| `DB_HOST` | MySQL server host |
| `DB_PORT` | MySQL server port |
| `DB_NAME` | Database name |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |


## Troubleshooting

### Database Connection Error

If you receive a connection error, verify that:

- MySQL Server is running
- `DB_HOST` is correct
- `DB_PORT` is correct
- `DB_NAME` is correct
- `DB_USER` is correct
- `DB_PASSWORD` is correct

### User Already Registered

If the application displays:

```
Error: User already registered
```

The provided email is already registered in the database. Use a different email address or update the existing database record.

### User Is Deactivated

If login displays:

```
User is deactivated
```

The user's `isActive` value is currently `false`. An administrator can update the value to `true` to reactivate the account.

### Module Not Found

If dependencies are missing, run:

```bash
npm install
```

## Author

Pronoy Sarker Amit