use employeeTracker;

INSERT INTO department(department_name)
VALUES("Sales"), ("Design"), ("Production"), ("Dev"), ("Marketing");

INSERT INTO role(Title, Salary, department_id)
VALUES("President", 200000, 1), ("Senior Designer", 120000, 2), ("Designer", 83000, 2), ("Intern", 28000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Tyler", "Mills", 2, 2), ("John", "Smith", 1, null), ("Carlos", "Jameson", 1, 2), ("Marky", "Mark", 2, 2), ("Mario", "Mario", 4, null);

-- designer = role_id 1
-- senior designer = role_id 2
-- president = role_id 3
-- intern = role_id 4
-- consultant = role_id 5
-- temp = role_id 7