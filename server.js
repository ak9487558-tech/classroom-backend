const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("VITS Portal Backend is Working!");
});

app.get("/api/test-db", (req, res) => {
    db.query("SELECT 1 AS test", (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Database connection failed"
            });
        }

        res.json({
            success: true,
            message: "Database connected successfully!",
            result: results
        });
    });
});

app.post("/api/student-login", (req, res) => {
    const { enrollment_number } = req.body;

    const sql = "SELECT * FROM students WHERE enrollment_number = ?";

    db.query(sql, [enrollment_number], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            message: "Login successful",
            student: results[0]
        });
    });
});
app.post("/api/save-attendance", (req, res) => {

    const {
        student_id,
        date,
        status,
        course,
        semester,
        section,
        subject
    } = req.body;

    const sql = `
        INSERT INTO attendance
        (student_id, date, status, course, semester, section, subject)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            student_id,
            date,
            status,
            course,
            semester,
            section,
            subject
        ],
        (error, result) => {

            if (error) {
                console.log(error);

                return res.status(500).json({
                    success: false,
                    message: "Attendance save failed"
                });
            }

            res.json({
                success: true,
                message: "Attendance saved successfully"
            });
        }
    );
});
app.get("/api/students", (req, res) => {

    const sql = "SELECT id, name, enrollment_number FROM students";

    db.query(sql, (error, results) => {

        if (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: "Unable to fetch students"
            });
        }

        res.json({
            success: true,
            students: results
        });
    });
});
app.get("/api/student-attendance", (req, res) => {

    const {
        enrollment_number,
        course,
        semester,
        section,
        subject
    } = req.query;

    const sql = `
        SELECT
            students.name,
            students.enrollment_number,
            attendance.date,
            attendance.status
        FROM attendance
        INNER JOIN students
            ON attendance.student_id = students.id
        WHERE students.enrollment_number = ?
        AND attendance.course = ?
        AND attendance.semester = ?
        AND attendance.section = ?
        AND attendance.subject = ?
        ORDER BY attendance.date DESC
    `;

    db.query(
        sql,
        [
            enrollment_number,
            course,
            semester,
            section,
            subject
        ],
        (error, results) => {

            if (error) {
                console.log(error);

                return res.status(500).json({
                    success: false,
                    message: "Unable to fetch attendance"
                });
            }

            res.json({
                success: true,
                attendance: results
            });
        }
    );
});
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});