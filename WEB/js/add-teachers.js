function fetchValues(name, s_class, major, coursename) {
    fetch('http://127.0.0.1:5000/teacher_course_class' , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            teacher_name: name,
            class_id: s_class,
            major_name: major,
            course_name: coursename
        })
        })
        .catch(error => {
            console.log(error);
            document.getElementById('submit').style.backgroundColor = "#ffa4a4";
            document.getElementById('submit-btn-text').innerText = "提交错误，请修改请求";
        })
        .then(response => {
            console.log(response.json());
            if(response.status != "200" && response.status != "201" ) {
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

function submit() {
    let teacher_name = document.getElementById("stu-name");
    let teacher_class = document.getElementById("stu-class");
    let teacher_major = document.getElementById("stu-major");
    let teacher_coursename = document.getElementById("stu-coursename");

    let bCanSubmit = true;
    //check can submit
    if(teacher_name.value == "") {
        teacher_name.style.borderColor = "red";
        bCanSubmit = false;
    }
    else {
        teacher_name.style.borderColor = "";
    }

    if(teacher_class.value == "") {
        teacher_class.style.borderColor = "red";
        bCanSubmit = false;
    }
    else {
        teacher_class.style.borderColor = "";
    }

    if(teacher_major.value == "") {
        teacher_major.style.borderColor = "red";
        bCanSubmit = false;
    }
    else {
        teacher_major.style.borderColor = "";
    }

    if(teacher_coursename.value == "") {
        teacher_coursename.style.borderColor = "red";
        bCanSubmit = false;
    }
    else {
        teacher_coursename.style.borderColor = "";
    }

    if(bCanSubmit) {
        document.getElementById('submit').style.backgroundColor = "";
        document.getElementById('submit-btn-text').innerText = "提交中";
        fetchValues(teacher_name.value, teacher_class.value, teacher_major.value, teacher_coursename.value);
    }
}

document.getElementById('submit').addEventListener('click', () => {
    submit();
})