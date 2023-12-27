function fetchValues(name, year, nature, major, credits) {
    fetch('http://127.0.0.1:5000/courses' , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            course_name: name,
            courses_year: year,
            nature: nature,
            major_name: major,
            credits: credits
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

function submit() {
    let course_name = document.getElementById("stu-name");
    let course_year = document.getElementById("stu-class");
    let course_nature = document.getElementById("stu-nature");
    let course_major = document.getElementById("stu-major");
    let course_credits = document.getElementById("stu-coursename");

    let bCanSubmit = true;
    //check can submit
    if(course_name.value == "") {
        course_name.style.borderColor = "red";
        bCanSubmit = false;
    }
    else {
        course_name.style.borderColor = "";
    }

    if(course_year.value == "") {
        course_year.style.borderColor = "red";
        bCanSubmit = false;
    }
    else {
        course_year.style.borderColor = "";
    }

    if(course_nature.value == "") {
        course_nature.style.borderColor = "red";
        bCanSubmit = false;
    }
    else {
        course_nature.style.borderColor = "";
    }

    if(course_major.value == "") {
        course_major.style.borderColor = "red";
        bCanSubmit = false;
    }
    else {
        course_major.style.borderColor = "";
    }

    if(course_credits.value == "") {
        course_credits.style.borderColor = "red";
        bCanSubmit = false;
    }
    else {
        course_credits.style.borderColor = "";
    }

    if(bCanSubmit) {
        document.getElementById('submit').style.backgroundColor = "";
        document.getElementById('submit-btn-text').innerText = "提交中";
        fetchValues(course_name.value, course_year.value, course_nature.value, course_major.value, course_credits.value);
    }
}

document.getElementById('submit').addEventListener('click', () => {
    submit();
})