from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # 导入 CORS
from sqlalchemy import func
from flask import abort

app = Flask(__name__)
CORS(app)  # 启用 CORS

# 配置数据库连接
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123456@localhost/DSMS_Server'

db = SQLAlchemy(app)

# 数据库模型定义
class Majors(db.Model):
    __tablename__ = 'majors'
    major_id = db.Column(db.Integer, primary_key=True)
    major_name = db.Column(db.String(255), nullable=False)

class Classes(db.Model):
    __tablename__ = 'classes'
    class_id = db.Column(db.Integer, primary_key=True)
    major_id = db.Column(db.Integer, db.ForeignKey('majors.major_id'), nullable=False)
    year = db.Column(db.Integer, nullable=False)

class Students(db.Model):
    __tablename__ = 'students'
    student_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    gender = db.Column(db.String(50))
    birth = db.Column(db.String(50))
    class_id = db.Column(db.Integer, db.ForeignKey('classes.class_id'), nullable=False)
    student_number = db.Column(db.String(10))

class Teachers(db.Model):
    __tablename__ = 'teachers'
    teacher_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)

class Courses(db.Model):
    __tablename__ = 'courses'
    course_id = db.Column(db.Integer, primary_key=True)
    course_name = db.Column(db.String(255), nullable=False)
    courses_year = db.Column(db.Integer, nullable=False)
    nature = db.Column(db.String(50), nullable=False)
    major_id = db.Column(db.Integer, db.ForeignKey('majors.major_id'), nullable=False)
    credits = db.Column(db.Integer, nullable=False)

class Grades(db.Model):
    __tablename__ = 'grades'
    grade_id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.student_id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.course_id'), nullable=False)
    grade = db.Column(db.DECIMAL(5, 2))

class TeacherCourseClass(db.Model):
    __tablename__ = 'teacher_course_class'
    id = db.Column(db.Integer, primary_key=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.teacher_id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.course_id'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.class_id'), nullable=False)

# 获取全体学生
@app.route('/students', methods=['GET'])
def get_students():
    students_list = Students.query.all()
    return jsonify([{'student_id': student.student_id, 'name': student.name, 'gender': student.gender, 'birth': student.birth, 'class_id': student.class_id, 'student_number': student.student_number} for student in students_list])

# 获取全体教师
@app.route('/teachers', methods=['GET'])
def get_teachers_courses():
    result = db.session.query(
        Teachers.name, 
        Courses.course_name, 
        Teachers.teacher_id, 
        Courses.course_id, 
        TeacherCourseClass.class_id,
        Majors.major_name
    ).join(TeacherCourseClass, TeacherCourseClass.teacher_id == Teachers.teacher_id)\
     .join(Courses, Courses.course_id == TeacherCourseClass.course_id)\
     .join(Majors, Majors.major_id == Courses.major_id)\
     .all()
    
    return jsonify([{
        'teacher_name': teacher_name, 
        'course_name': course_name, 
        'teacher_id': teacher_id, 
        'course_id': course_id, 
        'class_id': class_id,
        'major_name': major_name
    } for teacher_name, course_name, teacher_id, course_id, class_id, major_name in result])


# 获取所有班级
@app.route('/classes', methods=['GET'])
def get_classes():
    classes_list = db.session.query(
        Classes.class_id, 
        Classes.year, 
        Majors.major_name, 
        func.count(Students.student_id).label('student_count')
    ).join(Majors, Majors.major_id == Classes.major_id)\
     .outerjoin(Students, Students.class_id == Classes.class_id)\
     .group_by(Classes.class_id, Majors.major_name, Classes.year)\
     .all()
    
    return jsonify([{
        'class_id': class_id, 
        'year': year, 
        'major_name': major_name,
        'student_count': student_count
    } for class_id, year, major_name, student_count in classes_list])


# 获取课程以及它们的授课班级、老师等
@app.route('/courses', methods=['GET'])
def get_courses():
    courses_list = db.session.query(
        Courses.course_id,
        Courses.course_name,
        Courses.courses_year,
        Courses.nature,
        Majors.major_name,
        Courses.credits
    ).join(Majors, Majors.major_id == Courses.major_id)\
     .all()

    return jsonify([{
        'course_id': course_id,
        'course_name': course_name,
        'courses_year': courses_year,
        'nature': nature,
        'major_name': major_name,
        'credits': credits
    } for course_id, course_name, courses_year, nature, major_name, credits in courses_list])



# 删除学生
@app.route('/students/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    student = Students.query.get(student_id)
    if student is None:
        return jsonify({'message': 'Student not found'}), 404
    db.session.delete(student)
    db.session.commit()
    return jsonify({'message': 'Student deleted successfully'}), 200

# 修改学生信息
@app.route('/students/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    student = Students.query.get(student_id)
    if student is None:
        return jsonify({'message': 'Student not found'}), 404

    data = request.get_json()
    student.name = data.get('name', student.name)
    student.gender = data.get('gender', student.gender)
    student.birth = data.get('birth', student.birth)
    student.class_id = data.get('class_id', student.class_id)
    student.student_number = data.get('student_number', student.student_number)

    db.session.commit()
    return jsonify({'message': 'Student updated successfully'}), 200

# 根据ID查找学生
@app.route('/students/<int:student_id>', methods=['GET'])
def get_student(student_id):
    student = Students.query.get(student_id)
    if student is None:
        return jsonify({'message': 'Student not found'}), 404

    student_data = {
        'student_id': student.student_id,
        'name': student.name,
        'gender': student.gender,
        'birth': student.birth,
        'class_id': student.class_id,
        'student_number': student.student_number
    }

    return jsonify(student_data), 200

# 添加学生
@app.route('/students', methods=['POST'])
def add_student():
    data = request.get_json()
    
    # 验证数据是否完整
    if not all(key in data for key in ['name', 'gender', 'birth', 'class_id', 'student_number']):
        return jsonify({'message': 'Missing data'}), 400

    # 创建新的学生实例
    new_student = Students(
        name=data['name'],
        gender=data['gender'],
        birth=data['birth'],
        class_id=data['class_id'],
        student_number=data['student_number']
    )

    # 添加到数据库并提交
    db.session.add(new_student)
    db.session.commit()

    return jsonify({'message': 'New student added', 'student_id': new_student.student_id}), 201

# 添加教师（实际上是直接添加TeacherCourseClass）
@app.route('/teacher_course_class', methods=['POST'])
def add_teacher_course_class():
    data = request.get_json()

    # 检查必需字段
    if not all(key in data for key in ['teacher_name', 'course_name', 'major_name', 'class_id']):
        return jsonify({'message': 'Missing data'}), 400

    # 查询或创建专业
    major = Majors.query.filter_by(major_name=data['major_name']).first()
    if not major:
        major = Majors(major_name=data['major_name'])
        db.session.add(major)
        db.session.flush()  # 获取新添加的专业ID

    # 查询课程
    course = Courses.query.filter_by(course_name=data['course_name']).first()
    if not course:
        return jsonify({'message': 'Course not found'}), 404

    # 查询班级
    class_ = Classes.query.filter_by(class_id=data['class_id']).first()
    if not class_ or class_.major_id != major.major_id:
        return jsonify({'message': 'Class does not match the specified major or class not found'}), 400

    # 查询或创建教师
    teacher = Teachers.query.filter_by(name=data['teacher_name']).first()
    if not teacher:
        teacher = Teachers(name=data['teacher_name'])
        db.session.add(teacher)
        db.session.flush()  # 获取新添加的教师ID

    # 检查该教师是否已经教授该班级
    existing_teaching = TeacherCourseClass.query.filter_by(
        teacher_id=teacher.teacher_id, class_id=data['class_id']
    ).first()
    if existing_teaching:
        return jsonify({'message': 'This teacher is already assigned to this class'}), 400

    # 添加 TeacherCourseClass 记录
    new_teacher_course_class = TeacherCourseClass(
        teacher_id=teacher.teacher_id, 
        course_id=course.course_id, 
        class_id=data['class_id']
    )

    db.session.add(new_teacher_course_class)
    db.session.commit()

    return jsonify({'message': 'Teacher-Course-Class added successfully'}), 201

# 添加课程
@app.route('/courses', methods=['POST'])
def add_course():
    data = request.get_json()

    # 检查必需字段
    if not all(key in data for key in ['course_name', 'courses_year', 'nature', 'major_name', 'credits']):
        return jsonify({'message': 'Missing data'}), 400

    # 查询或创建专业
    major = Majors.query.filter_by(major_name=data['major_name']).first()
    if not major:
        major = Majors(major_name=data['major_name'])
        db.session.add(major)
        db.session.flush()  # 获取新添加的专业ID

    # 创建新的课程实例
    new_course = Courses(
        course_name=data['course_name'],
        courses_year=data['courses_year'],
        nature=data['nature'],
        major_id=major.major_id,
        credits=data['credits']
    )

    db.session.add(new_course)
    db.session.commit()

    return jsonify({'message': 'New course added', 'course_id': new_course.course_id}), 201

# 根据课程ID获取课程信息
@app.route('/courses/<int:course_id>', methods=['GET'])
def get_course(course_id):
    course = Courses.query.get(course_id)
    if course is None:
        return jsonify({'message': 'Course not found'}), 404

    major = Majors.query.get(course.major_id)

    course_data = {
        'course_id': course.course_id,
        'course_name': course.course_name,
        'courses_year': course.courses_year,
        'nature': course.nature,
        'major_name': major.major_name if major else 'Unknown',
        'credits': course.credits
    }

    return jsonify(course_data), 200

# 更新课程信息
@app.route('/courses/<int:course_id>', methods=['PUT'])
def update_course(course_id):
    course = Courses.query.get(course_id)
    if course is None:
        return jsonify({'message': 'Course not found'}), 404

    data = request.get_json()

    # 更新课程信息
    course.course_name = data.get('course_name', course.course_name)
    course.courses_year = data.get('courses_year', course.courses_year)
    course.nature = data.get('nature', course.nature)
    course.credits = data.get('credits', course.credits)

    # 如果专业名被提供且不同，更新专业
    if 'major_name' in data:
        major = Majors.query.filter_by(major_name=data['major_name']).first()
        if major:
            course.major_id = major.major_id

    db.session.commit()
    return jsonify({'message': 'Course updated successfully'}), 200

# 删除课程
@app.route('/courses/<int:course_id>', methods=['DELETE'])
def delete_course(course_id):
    course = Courses.query.get(course_id)
    if course is None:
        return jsonify({'message': 'Course not found'}), 404

    db.session.delete(course)
    db.session.commit()
    return jsonify({'message': 'Course deleted successfully'}), 200

# 获取成绩
@app.route('/grades', methods=['GET'])
def get_all_grades():
    grades_list = db.session.query(
        Grades.grade_id,
        Students.student_id,
        Students.name.label('student_name'),
        Courses.course_name,
        Majors.major_name,
        Grades.grade,
        Courses.credits,
        Courses.nature
    ).join(Grades, Grades.student_id == Students.student_id)\
     .join(Courses, Courses.course_id == Grades.course_id)\
     .join(Majors, Majors.major_id == Courses.major_id)\
     .all()

    # 计算必修课和选修课低于 60 分的课的学分和
    failing_credits_required = db.session.query(
        Students.student_id,
        func.sum(Courses.credits).label('failing_credits_required')
    ).join(Grades, Grades.student_id == Students.student_id)\
     .join(Courses, Courses.course_id == Grades.course_id)\
     .filter(Grades.grade < 60, Courses.nature == '必修')\
     .group_by(Students.student_id)\
     .all()

    failing_credits_elective = db.session.query(
        Students.student_id,
        func.sum(Courses.credits).label('failing_credits_elective')
    ).join(Grades, Grades.student_id == Students.student_id)\
     .join(Courses, Courses.course_id == Grades.course_id)\
     .filter(Grades.grade < 60, Courses.nature == '选修')\
     .group_by(Students.student_id)\
     .all()

    failing_credits_required_dict = {student_id: credits for student_id, credits in failing_credits_required}
    failing_credits_elective_dict = {student_id: credits for student_id, credits in failing_credits_elective}

    return jsonify([{
        'grade_id': grade_id,
        'student_id': student_id,
        'student_name': student_name,
        'course_name': course_name,
        'major_name': major_name,
        'grade': grade,
        'credits': credits,
        'nature': nature,
        'failing_credits_required': failing_credits_required_dict.get(student_id, 0),
        'failing_credits_elective': failing_credits_elective_dict.get(student_id, 0)
    } for grade_id, student_id, student_name, course_name, major_name, grade, credits, nature in grades_list])

# 根据ID获取grades
@app.route('/grades/<int:grade_id>', methods=['GET'])
def get_grade(grade_id):
    grade = Grades.query.get(grade_id)
    if grade is None:
        return jsonify({'message': 'Grade not found'}), 404

    student = Students.query.get(grade.student_id)
    course = Courses.query.get(grade.course_id)
    if not student or not course:
        return jsonify({'message': 'Associated student or course not found'}), 404

    grade_data = {
        'grade_id': grade.grade_id,
        'student_name': student.name,
        'course_name': course.course_name,
        'grade': grade.grade,
    }

    return jsonify(grade_data), 200

# 删除某项成绩
@app.route('/grades/<int:grade_id>', methods=['DELETE'])
def delete_grade(grade_id):
    grade = Grades.query.get(grade_id)
    if grade is None:
        return jsonify({'message': 'Grade not found'}), 404

    db.session.delete(grade)
    db.session.commit()
    return jsonify({'message': 'Grade deleted successfully'}), 200

# 添加新的成绩
@app.route('/grades', methods=['POST'])
def add_grade():
    data = request.get_json()

    # 检查必需字段
    if not all(key in data for key in ['student_name', 'course_name', 'grade']):
        return jsonify({'message': 'Missing data'}), 400

    student = Students.query.filter_by(name=data['student_name']).first()
    course = Courses.query.filter_by(course_name=data['course_name']).first()

    if not student or not course:
        return jsonify({'message': 'Student or course not found'}), 404

    new_grade = Grades(
        student_id=student.student_id,
        course_id=course.course_id,
        grade=data['grade']
    )

    db.session.add(new_grade)
    db.session.commit()

    return jsonify({'message': 'New grade added', 'grade_id': new_grade.grade_id}), 201


# 更新成绩
@app.route('/grades/<int:grade_id>', methods=['PUT'])
def update_grade(grade_id):
    grade = Grades.query.get(grade_id)
    if grade is None:
        return jsonify({'message': 'Grade not found'}), 404

    data = request.get_json()
    student = Students.query.filter_by(name=data.get('student_name')).first()
    course = Courses.query.filter_by(course_name=data.get('course_name')).first()

    if not student or not course:
        return jsonify({'message': 'Student or course not found'}), 404

    grade.student_id = student.student_id
    grade.course_id = course.course_id
    grade.grade = data.get('grade', grade.grade)

    db.session.commit()
    return jsonify({'message': 'Grade updated successfully'}), 200

# 获取危险学生
@app.route('/dangerous', methods=['GET'])
def get_dangerous_students():
    # 查询每个学生的姓名、专业、班级信息
    student_info = db.session.query(
        Students.student_id,
        Students.name.label('student_name'),
        Majors.major_name,
        Classes.class_id
    ).join(Classes, Classes.class_id == Students.class_id)\
     .join(Majors, Majors.major_id == Classes.major_id)\
     .all()

    # 构建学生信息字典
    students_dict = {student_id: {'student_name': student_name, 'major_name': major_name, 'class_id': class_id} 
                     for student_id, student_name, major_name, class_id in student_info}

    # 计算每个学生的选修挂科学分总和
    elective_failing_credits = db.session.query(
        Grades.student_id,
        func.sum(Courses.credits).label('failing_credits_elective')
    ).join(Courses, Courses.course_id == Grades.course_id)\
     .filter(Grades.grade < 60, Courses.nature == '选修')\
     .group_by(Grades.student_id)\
     .all()

    # 计算每个学生的必修挂科学分总和
    required_failing_credits = db.session.query(
        Grades.student_id,
        func.sum(Courses.credits).label('failing_credits_required')
    ).join(Courses, Courses.course_id == Grades.course_id)\
     .filter(Grades.grade < 60, Courses.nature == '必修')\
     .group_by(Grades.student_id)\
     .all()

    # 更新学生信息字典，添加挂科学分信息
    for student_id, credits in elective_failing_credits:
        if student_id in students_dict:
            students_dict[student_id]['failing_credits_elective'] = credits

    for student_id, credits in required_failing_credits:
        if student_id in students_dict:
            students_dict[student_id]['failing_credits_required'] = credits

    # 构建最终的响应列表
    response = []
    for student_id, info in students_dict.items():
        info['failing_credits_elective'] = info.get('failing_credits_elective', 0)
        info['failing_credits_required'] = info.get('failing_credits_required', 0)
        response.append(info)

    return jsonify(response)

# 获取服务器状态
@app.route('/', methods=['GET'])
def get_server_status():
    return jsonify({'server_status': 'good'})

# 启动服务器
if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)