-- 创建专业表
CREATE TABLE majors (
    major_id SERIAL PRIMARY KEY,
    major_name VARCHAR(255) NOT NULL
);

-- 创建班级表
CREATE TABLE classes (
    class_id SERIAL PRIMARY KEY,
    major_id INT NOT NULL,
    year INT NOT NULL,
    FOREIGN KEY (major_id) REFERENCES majors(major_id)
);

-- 创建学生表
CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(50),
    birth VARCHAR(50),
    class_id INT NOT NULL,
    student_number VARCHAR(10),
    FOREIGN KEY (class_id) REFERENCES classes(class_id)
);

-- 创建教师表
CREATE TABLE teachers (
    teacher_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- 创建课表
CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL,
    courses_year INT NOT NULL,
    nature VARCHAR(50) NOT NULL CHECK (nature IN ('必修', '选修')),
    major_id INT NOT NULL,
    credits INT NOT NULL,
    FOREIGN KEY (major_id) REFERENCES majors(major_id)
);

-- 创建成绩表
CREATE TABLE grades (
    grade_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    grade DECIMAL(5, 2),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

-- 创建教师课程班级关联表
CREATE TABLE teacher_course_class (
    id SERIAL PRIMARY KEY,
    teacher_id INT NOT NULL,
    course_id INT NOT NULL,
    class_id INT NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    FOREIGN KEY (class_id) REFERENCES classes(class_id)
);

INSERT INTO majors (major_name) VALUES ('计算机科学');
INSERT INTO majors (major_name) VALUES ('数学');
INSERT INTO majors (major_name) VALUES ('中文');

INSERT INTO classes (major_id, year) VALUES (1, 2023);  -- 计算机科学
INSERT INTO classes (major_id, year) VALUES (2, 2023);  -- 数学
INSERT INTO classes (major_id, year) VALUES (3, 2023);  -- 中文

INSERT INTO students (name, gender, birth, class_id, student_number) VALUES ('张三', '男', '2003.2.12', 1, 'S001');
INSERT INTO students (name, gender, birth, class_id, student_number) VALUES ('李四', '女', '2002.12.21', 2, 'S002');
INSERT INTO students (name, gender, birth, class_id, student_number) VALUES ('王五', '男', '2002.11.14', 3, 'S003');

INSERT INTO teachers (name) VALUES ('陈老师');
INSERT INTO teachers (name) VALUES ('刘老师');
INSERT INTO teachers (name) VALUES ('戴老师');

INSERT INTO courses (course_name, courses_year, nature, major_id, credits) VALUES ('数据库', 2023, '必修', 1, 4);
INSERT INTO courses (course_name, courses_year, nature, major_id, credits) VALUES ('线性代数', 2023, '必修', 2, 3);
INSERT INTO courses (course_name, courses_year, nature, major_id, credits) VALUES ('古代文学', 2023, '选修', 3, 1);

INSERT INTO grades (student_id, course_id, grade) VALUES (1, 1, 85, false);
INSERT INTO grades (student_id, course_id, grade) VALUES (2, 2, 90, false);
INSERT INTO grades (student_id, course_id, grade) VALUES (3, 3, 82, false);

INSERT INTO teacher_course_class (teacher_id, course_id, class_id) VALUES (1, 1, 1);
INSERT INTO teacher_course_class (teacher_id, course_id, class_id) VALUES (2, 2, 2);
INSERT INTO teacher_course_class (teacher_id, course_id, class_id) VALUES (3, 3, 3);
