1️⃣ Authentication

Simple login page

Redirect to the Dashboard after successful login.

2️⃣ Dashboard
Admin Dashboard

Show total numbers of:

Students

Teachers

Classes

Courses

small chart or graph for attendance or progress.

chart for average attendance in courses.

3️⃣ Teachers Management (Admin Only)

View all teachers in a data table.

Add a new teacher (form with name, email, phone, specialization).

Edit teacher information.

Delete teacher.

Click on a teacher to open a details page showing their assigned courses.

4️⃣ Students Management (Admin Only)

View all students in a data table.

Filter students by class or search by name.

Add / Edit / Delete student.

Each student must belong to a class.

Student Details Page:

Basic info (name, email, phone, class).

Address: latitude and longitude. (two numbers) Choose location on a map.

List all the student’s courses.

Show progress in each course.

Show attendance summary.

5️⃣ Classes Management (Admin Only)

View all classes in a table.

Add / Edit / Delete class (name, level, capacity).

View students belonging to each class.

6️⃣ Courses Management
Admin Features:

View all courses.

Add / Edit / Delete course.

When creating a course:

Select a class.

Select a teacher.

Select multiple students (only from the chosen class).

Select Start Date

Select Course Time

Select Course duration

Select Course Days

Select Estimated End Date

View course details (info, students, teacher, sessions).


Teacher Features:

View only their own courses.

Open course details to view students and sessions.

7️⃣ Course Details Page

Show:

Course title and description.

Class and assigned teacher.

Actual Duration.

Tabs or sections: Info / Students List / Sessions List

8️⃣ Sessions Management

Each course can have multiple sessions.

Teacher can create Sessions for his own course.

Session contain (name and duration)

View list of sessions in the course details.

9️⃣ Attendance System (Optional)

Attendance is linked to each session.

Each student has an attendance record for every session.

🔟 Buses Management (Optional)

View list of buses.

Add / Edit / Delete bus.

Each bus has:

Driver name.

Start time.

Assigned students.

Bus Details Page:

Show driver info.

Show list of students assigned.

1️⃣1️⃣ Maps Features (Advanced)

In student form → choose address on map → get latitude & longitude.

Show student location on map in their details page.

In bus details → show all student locations on one map as pins.

Optional: draw connection lines (bus route) between students.

1️⃣2️⃣ General Functionalities

Role-based routing (different views for admin and teacher).

Validation for all forms.

Searching and filtering in lists.

light/dark theme toggle.

multiple languages.

Optional: server side pagination.

Optional: toast notifications for success/error.

Optional: export tables to excel.