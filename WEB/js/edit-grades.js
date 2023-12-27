let url = document.location.toString();
let urlParmStr = url.slice(url.indexOf('?') + 1);//获取问号后所有的字符串
let course_id = urlParmStr.slice(urlParmStr.indexOf('=') + 1);

function fetchValues(student_name, course_name, grade) {
    fetch('http://127.0.0.1:5000/grades/' + course_id , {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            student_name: student_name,
            course_name: course_name,
            grade: grade
        })
        })
        .catch(error => {
            console.log(error);
            document.getElementById('submit').style.backgroundColor = "#ffa4a4";
            document.getElementById('submit-btn-text').innerText = "提交错误，请修改请求";
        })
        .then(response => {
            console.log(response);
            if(!(response.status == "200" || response.status == "201")) {
                document.getElementById('submit').style.backgroundColor = "#ffa4a4";
                document.getElementById('submit-btn-text').innerText = "错误：" + response.status + ": " + response.statusText;
            }
            else {
                document.getElementById('submit').style.backgroundColor = "#e5ffe5";
                document.getElementById('submit-btn-text').innerText = "提交成功";
                setTimeout("document.getElementById('submit').style.backgroundColor = ''; document.getElementById('submit-btn-text').innerText = '提交添加学生请求';", 2000);
            }
        })
}

function getStuInfo() {
    fetch('http://127.0.0.1:5000/grades/' + course_id , {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("stu-name").value = data.student_name;
            document.getElementById("stu-class").value = data.course_name;
            document.getElementById("stu-nature").value = data.grade;
        });
}

function submit() {
    let grade_name = document.getElementById("stu-name");
    let grade_c_name = document.getElementById("stu-class");
    let grade_score = document.getElementById("stu-nature");

    let bCanSubmit = true;
    //check can submit
    if(grade_name.value == "") {
        grade_name.style.borderColor = "red";
        bCanSubmit = false;
    }
    else {
        grade_name.style.borderColor = "";
    }

    if(grade_c_name.value == "") {
        grade_c_name.style.borderColor = "red";
        bCanSubmit = false;
    }
    else {
        grade_c_name.style.borderColor = "";
    }

    if(grade_score.value == "") {
        grade_score.style.borderColor = "red";
        bCanSubmit = false;
    }
    else {
        grade_score.style.borderColor = "";
    }

    if(bCanSubmit) {
        document.getElementById('submit').style.backgroundColor = "";
        document.getElementById('submit-btn-text').innerText = "提交中";
        fetchValues(grade_name.value, grade_c_name.value, grade_score.value);
    }
}

document.getElementById('submit').addEventListener('click', () => {
    submit();
})

getStuInfo();