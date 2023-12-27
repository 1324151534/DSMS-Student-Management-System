let url = document.location.toString();
let urlParmStr = url.slice(url.indexOf('?') + 1);//获取问号后所有的字符串
let student_id = urlParmStr.slice(urlParmStr.indexOf('=') + 1);

function fetchValues(name, gender, s_class, birth, stuid) {
    fetch('http://127.0.0.1:5000/students/' + student_id , {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            gender: gender,
            class_id: s_class,
            birth: birth,
            student_number: stuid
        })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('上传失败:', data.error);
                document.getElementById('submit').style.backgroundColor = "#ffa4a4";
                document.getElementById('submit-btn-text').innerText = "提交错误，请修改请求";
            } else {
                console.log('上传成功');
                document.getElementById('submit').style.backgroundColor = "#e5ffe5";
                document.getElementById('submit-btn-text').innerText = "提交成功";
                setTimeout("document.getElementById('submit').style.backgroundColor = ''; document.getElementById('submit-btn-text').innerText = '提交添加学生请求';", 2000);
            }
        });
}

function getStuInfo() {
    fetch('http://127.0.0.1:5000/students/' + student_id , {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("stu-name").value = data.name;
            document.getElementById("stu-gender").value = data.gender;
            document.getElementById("stu-class").value = data.class_id;
            document.getElementById("stu-birth").value = data.birth;
            document.getElementById("stu-stuid").value = data.student_number;
        });
}

function submit() {
    let student_name = document.getElementById("stu-name");
    let student_gender = document.getElementById("stu-gender");
    let student_class = document.getElementById("stu-class");
    let student_birth = document.getElementById("stu-birth");
    let student_stuid = document.getElementById("stu-stuid");

    let bCanSubmit = true;
    //check can submit
    if(student_name.value == "") {
        student_name.style.borderColor = "red";
        bCanSubmit = false;
    }
    else {
        student_name.style.borderColor = "";
    }

    if(student_gender.value == "") {
        student_gender.style.borderColor = "red";
        bCanSubmit = false;
    }
    else {
        student_gender.style.borderColor = "";
    }

    if(student_class.value == "") {
        student_class.style.borderColor = "red";
        bCanSubmit = false;
    }
    else {
        student_class.style.borderColor = "";
    }

    if(student_birth.value == "") {
        student_birth.style.borderColor = "red";
        bCanSubmit = false;
    }
    else {
        student_birth.style.borderColor = "";
    }

    if(student_stuid.value == "") {
        student_stuid.style.borderColor = "red";
        bCanSubmit = false;
    }
    else {
        student_stuid.style.borderColor = "";
    }

    if(bCanSubmit) {
        fetchValues(student_name.value, student_gender.value, student_class.value, student_birth.value, student_stuid.value);
    }
}

document.getElementById('submit').addEventListener('click', () => {
    submit();
})

getStuInfo();