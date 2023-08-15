const inquirer = require('inquirer');
const connection = require('./connection');
const prompts = require('./inquirer-prompts');

// Function to view all departments
async function viewAllDepartments() {
  const query = 'SELECT * FROM departments';
  connection.query(query, (err, results) => {
    if (err) throw err;
    console.table('All Departments:', results);
    startApp();
  });
}

// Function to view all roles
async function viewAllRoles() {
  const query = 'SELECT * FROM roles';
  connection.query(query, (err, results) => {
    if (err) throw err;
    console.table('All Roles:', results);
    startApp();
  });
}

// Function to view all employees
async function viewAllEmployees() {
  const query = 'SELECT * FROM employees';
  connection.query(query, (err, results) => {
    if (err) throw err;
    console.table('All Employees:', results);
    startApp();
  });
}

// Function to add a role
async function addRole() {
  const rolePrompt = await prompts.addRole();
  const { title, salary, department_id } = rolePrompt;

  const insertRoleQuery = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
  connection.query(insertRoleQuery, [title, salary, department_id], (err, result) => {
    if (err) {
      console.error('Error adding role:', err);
    } else {
      console.log('Role added successfully!');
    }
    startApp();
  });
}

// Function to add an employee
async function addEmployee() {
  const employeePrompt = await prompts.addEmployee();
  const { first_name, last_name, role_id, manager_id } = employeePrompt;

  const insertEmployeeQuery = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
  connection.query(insertEmployeeQuery, [first_name, last_name, role_id, manager_id], (err, result) => {
    if (err) {
      console.error('Error adding employee:', err);
    } else {
      console.log('Employee added successfully!');
    }
    startApp();
  });
}

// Function to update an employee's role
async function updateEmployeeRole() {
  // Get employee list and role list from the database

  const employeePrompt = await prompts.updateEmployeeRole(employeeList, roleList);
  const { employee_id, new_role_id } = employeePrompt;

  const updateEmployeeRoleQuery = 'UPDATE employees SET role_id = ? WHERE id = ?';
  connection.query(updateEmployeeRoleQuery, [new_role_id, employee_id], (err, result) => {
    if (err) {
      console.error('Error updating employee role:', err);
    } else {
      console.log('Employee role updated successfully!');
    }
    startApp();
  });
}

// Function to start the application
async function startApp() {
  console.log('Welcome to the Employee Management System!\n');

  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    }
  ]);

  switch (action) {
    case 'View all departments':
      viewAllDepartments();
      break;

    case 'View all roles':
      viewAllRoles();
      break;

    case 'View all employees':
      viewAllEmployees();
      break;

    case 'Add a department':
      const departmentPrompt = await prompts.addDepartment();
      const departmentName = departmentPrompt.departmentName;

      const insertDepartmentQuery = 'INSERT INTO departments (name) VALUES (?)';
      connection.query(insertDepartmentQuery, [departmentName], (err, result) => {
        if (err) {
          console.error('Error adding department:', err);
        } else {
          console.log('Department added successfully!');
        }
        startApp();
      });
      break;

    case 'Add a role':
      addRole();
      break;

    case 'Add an employee':
      addEmployee();
      break;

    case 'Update an employee role':
      updateEmployeeRole();
      break;

    case 'Exit':
      console.log('Goodbye!');
      connection.end();
      break;

    default:
      console.log('Invalid choice. Please select a valid action.');
      startApp();
  }
}

// Call startApp to initiate the application
startApp();

