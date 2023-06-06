const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2/promise");
const connection = require("./config/connection");

const PORT = 3001;

/**
 * @description
 * @template {} T
 * @param {string} sql query to send to the db
 * @returns {Promise<T>} result of the query or err
 */
const runQuery = (sql, rowsAsArray = true) =>
  new Promise((res, rej) => {
    connection.query({ sql, rowsAsArray }, (err, result) => {
      if (err) {
        console.log("Error: query failed: ", sql);
        console.error(err);
        rej(err);
      } else {
        res(result);
      }
    });
  });

function startMenu() {
  inquirer
    .prompt([
      {
        name: "choices",
        type: "list",
        message: "Which action would you like to perform?",
        choices: [
          "View All Employees",
          "View All Roles",
          "View All Departments",
          "Update Employee Role",
          "Add Employee",
          "Add Role",
          "Add Department",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      const { choices } = answers;
      if (choices === "View All Employees") {
        viewEmployees();
      }
      if (choices === "View All Roles") {
        viewAllRoles();
      }
      if (choices === "View All Departments") {
        viewDepartments();
      }
      if (choices === "Update Employee Role") {
        updateEmployeeRole();
      }
      if (choices === "Add Employee") {
        addEmployee();
      }
      if (choices === "Add Role") {
        addRole();
      }
      if (choices === "Add Department") {
        addDepartment();
      }
      if (choices === "Exit") {
        console.log("Thanks for using Employee Tracker. Until next time.");
        connection.end();
      }
    });
}

function viewEmployees() {
  let sql = `SELECT employee.id, 
              employee.first_name, 
              employee.last_name, 
              role.title, 
              department.department_name AS 'department', 
              role.salary
              FROM employee, role, department 
              WHERE department.id = role.department_id 
              AND role.id = employee.role_id
              ORDER BY employee.id ASC`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.log(
      "------------------------------------------------------------------"
    );
    console.log(`${"All Employees:\n"}`);
    console.table(response);
    console.log(
      "------------------------------------------------------------------"
    );
    startMenu();
  });
}

async function viewAllRoles() {
  const sql = "select * from role";

  //get the roles from the db
  const roles = await runQuery(sql);
  //  present them on he screen
  console.table(roles);

  startMenu();
}

async function viewDepartments() {
  console.table(await getDepartments());
  startMenu()
}

/**
 * a function to update a specific role in the database
 */
function updateEmployeeRole() {
  inquirer.prompt([
    {
      type:"input",
      name:"firstName",
      message:"please enter the employee's first name"
    },
    {
      type:"input",
      name:"lastName",
      message:"please enter the employee's last name"
    },
    {
      type: "list",
      name: "updateRole",
      message: "please update the Employee's new position",
      choices: [1, 2, 3, 4, 5, 6]
    },
  ])
  .then(results => {
    // var employee = runQuery(`SELECT id FROM employee WHERE first_name = "${results.firstName}" AND last_name = "${results.lastName}";`)
        var employee = runQuery(`SELECT * FROM employee;`)

  })
  .then(employee => {
    console.log(employee)

    // startMenu()
  })
}

// async function updateEmployeeRole() {
//   /**
//    * update an employees roles
//    * specify what the employees name is
//    * 
//    */
//   inquirer.prompt([
//     {
//       type: "input",
//       name: "updateRole",
//       message: "please update the Employee's new position",
//       choices: await runQuery(" select role from role")
//     },
//     {

//     }
//   ]);
// }

function addEmployee() {
  inquirer.prompt([
    {
      type: "input",
      name: "firstname",
      message: "Add first name of employee",
    },
    {
      type: "input",
      name: "lastname",
      message: "Add Last name of employee",
    },
    {
      type: "list",
      name: "department",
      choices: ["Sales", "Design", "Production", "Dev", "Marketing"],
      message: "Add the Department they belong to",
    },
    {
      type: "list",
      name: "role",
      message: "Add the role of the employee",
    },
  ]);
}

function addRole() {
  inquirer.prompt([
    {
      type: "input",
      name: "addRole",
      message: "Please add the new role name",
    },
    {
      type: "input",
      name: "addSalary",
      message: "Please add new role salary",
    },
    {
      type: "input",
      name: "addRoleDepartmentId",
      message: "Please add the new role department ID",
    }
  ])
  .then(results => {
    var addRoleString = `INSERT INTO role (title, salary, department_id ) VALUES ('${results.addRole}', '${results.addSalary}','${results.addRoleDepartmentId}')`
    runQuery(addRoleString)
    startMenu();
  })
  
}

function addDepartment() {
  inquirer.prompt([
    {
      type: "input",
      name: "newDepartment",
      message: "add Department name",
    },
    startMenu()
  ]);
}

function getDepartments() {
  return runQuery("select department_name from department");
}
async function addEmployee() {
  inquirer.prompt([
    {
      type: "input",
      name: "firstname",
      message: "Add first name of employee",
    },
    {
      type: "input",
      name: "lastname",
      message: "Add Last name of employee",
    },
    {
      type: "list",
      name: "department",
      // choices: ["Sales", "Design", "Production", "Dev", "Marketing"],
      choices: await getDepartments(),
      message: "Add the Department they belong to",
    },
    {
      type: "list",
      name: "role",
      message: "Add the role of the employee",
    },
  ]);
}

//start application
startMenu();

/**
 * runnin a node app from terminal
 * `node filename.js`
 */

// async function viewEmployees() {
//   const [rows] = await connection.query(
//     "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id"
//   );
//   console.table(rows);
//   promptUser();
// }

// async function viewRoles() {
//   const [rows] = await connection.query("SELECT * FROM role");
//   console.table(rows);
//   promptUser();
// }

// async function viewDepartments() {
//   const [rows] = await connection.query("SELECT * FROM department");
//   console.table(rows);
//   promptUser();
// }

// async function addEmployee() {
//   const roles = await connection.query("SELECT * FROM role");
//   const managers = await connection.query(
//     "SELECT id, first_name, last_name FROM employee"
//   );

//   const roleChoices = roles[0].map((role) => ({
//     name: role.title,
//     value: role.id,
//   }));
//   const managerChoices = managers[0].map((manager) => ({
//     name: `${manager.first_name} ${manager.last_name}`,
//     value: manager.id,
//   }));
//   managerChoices.unshift({ name: "None", value: null });

//   const answers = await inquirer.prompt([
//     {
//       type: "input",
//       name: "firstName",
//       message: "Enter employee's first name:",
//     },
//     {
//       type: "input",
//       name: "lastName",
//       message: "Enter employee's last name:",
//     },
//     {
//       type: "list",
//       name: "roleId",
//       message: "Choose employee's role:",
//       choices: roleChoices,
//     },
//     {
//       type: "list",
//       name: "managerId",
//       message: "Choose employee's manager:",
//       choices: managerChoices,
//     },
//   ]);

//   await connection.query("INSERT INTO employee SET ?", {
//     first_name: answers.firstName,
//     last_name: answers.lastName,
//     role_id: answers.roleId,
//     manager_id: answers.managerId,
//   });

//   console.log("Employee added successfully!");
//   promptUser();
// }

// async function addRole() {
//   const departments = await connection.query("SELECT * FROM department");
//   const departmentChoices = departments[0].map((department) => ({
//     name: department.name,
//     value: department.id,
//   }));

//   const answers = await inquirer.prompt([
//     {
//       type: "input",
//       name: "title",
//       message: "Enter role title:",
//     },
//     {
//       type: "number",
//       name: "salary",
//       message: "Enter role salary:",
//     },
//     {
//       type: "list",
//       name

// let employees = [];

// // function fields() {
// //     [
// //         input: "list",
// //         name:

// //     ]
// // },

// // Function to add a field for an employee
// function addField(employee, field) {
//   employee.fields.push({ name: field, value: "" });
// }

// // Function to delete a field for an employee
// function deleteField(employee, fieldIndex) {
//   employee.fields.splice(fieldIndex, 1);
// }

// // Function to prompt user to select an employee to edit
// function promptEmployeeSelection() {
//   return inquirer.prompt([
//     {
//       type: "list",
//       name: "employeeIndex",
//       message: "Select an employee to edit: ",
//       choices: employees.map((employee, index) => ({
//         name: employee.name,
//         value: index,
//       })),
//     },
//   ]);
// }

// // Function to prompt user to add or delete fields for an employee
// async function editEmployee() {
//   const { employeeIndex } = await promptEmployeeSelection();
//   let editing = true;

//   while (editing) {
//     const { action, field, fieldToDelete } = await promptFields();

//     switch (action) {
//       case "Add a field":
//         addField(employees[employeeIndex], field);
//         break;

//       case "Delete a field":
//         const fieldIndex = employees[employeeIndex].fields.findIndex(
//           (field) => field.name === fieldToDelete
//         );
//         deleteField(employees[employeeIndex], fieldIndex);
//         break;

//       case "Finish editing":
//         editing = false;
//         break;
//     }
//   }
// }

// // Function to start the program
// async function start() {
//   let addingEmployees = true;

//   while (addingEmployees) {
//     const employee = await promptEmployee();
//     employee.fields = [];

//     let addingFields = true;

//     while (addingFields) {
//       const { action } = await promptFields();

//       switch (action) {
//         case
