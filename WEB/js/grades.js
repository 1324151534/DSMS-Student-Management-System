let list_container = document.getElementsByClassName("students-list-item-container")[0];

function spawnDiv(id, name, major, course_name, nature, credits, grade, target_div) {
    let outDiv = document.createElement('div');
    outDiv.setAttribute('class', 'students-list-item');
    outDiv.setAttribute('id', id);

    let insideDiv_name = document.createElement('div');
    insideDiv_name.setAttribute('class', 'student-list-item-info');
    insideDiv_name.innerText = name;

    let insideDiv_major = document.createElement('div');
    insideDiv_major.setAttribute('class', 'student-list-item-info');
    insideDiv_major.innerText = major;

    let insideDiv_c_name = document.createElement('div');
    insideDiv_c_name.setAttribute('class', 'student-list-item-info');
    insideDiv_c_name.innerText = course_name;
    
    let insideDiv_nature = document.createElement('div');
    insideDiv_nature.setAttribute('class', 'student-list-item-info');
    insideDiv_nature.innerText = nature;
    
    let insideDiv_credits = document.createElement('div');
    insideDiv_credits.setAttribute('class', 'student-list-item-info');
    insideDiv_credits.innerText = credits;
    
    let insideDiv_grade = document.createElement('div');
    insideDiv_grade.setAttribute('class', 'student-list-item-info');
    insideDiv_grade.innerText = grade;

    let insideDiv_Ctrl = document.createElement('div');
    insideDiv_Ctrl.setAttribute('class', 'student-list-item-info');

    let insideBtn_Edit = document.createElement('button');
    insideBtn_Edit.setAttribute('class', 'student-list-btn btn-edit');
    insideBtn_Edit.setAttribute('id', "btn_e" + id);
    insideBtn_Edit.innerText = "编辑"

    let insideBtn_Del = document.createElement('button');
    insideBtn_Del.setAttribute('class', 'student-list-btn btn-del');
    insideBtn_Del.setAttribute('id', "btn_d" + id);
    insideBtn_Del.innerText = "删除"

    insideDiv_Ctrl.appendChild(insideBtn_Edit);
    insideDiv_Ctrl.appendChild(insideBtn_Del);

    outDiv.appendChild(insideDiv_name);
    outDiv.appendChild(insideDiv_major);
    outDiv.appendChild(insideDiv_c_name);
    outDiv.appendChild(insideDiv_nature); 
    outDiv.appendChild(insideDiv_credits);
    outDiv.appendChild(insideDiv_grade);
    outDiv.appendChild(insideDiv_Ctrl);

    target_div.appendChild(outDiv);
}

function getStudents() {
    fetch('http://127.0.0.1:5000/grades', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    })
    .catch(() => {
        list_container.innerHTML = "<div style='width: 100%; text-align: center; font-weight: lighter; font-size: 20px; margin-top: 10px; color: red;'>获取学生列表失败</div>";
    })
    .then(response => response.json())
    .then(data => {
        list_container.innerHTML = '';
        for(i = 0; i < Object.keys(data).length; i++) {
            spawnDiv(data[i].grade_id, data[i].student_name, data[i].major_name, data[i].course_name, data[i].nature, data[i].credits, data[i].grade, list_container);
        }
        addCtrlBtns();
    })
}

function delStudent(student_id) {
    fetch('http://127.0.0.1:5000/grades/' + student_id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('删除失败:', data.error);
            } else {
                console.log('删除成功');
            }
        });
}

setTimeout("getStudents()", 500);

function addCtrlBtns() {
    let editBtns = document.getElementsByClassName('btn-edit');
    let delBtns = document.getElementsByClassName('btn-del');

    for(i = 0; i < editBtns.length; i++) {
        editBtns[i].addEventListener('click', (e) => {
            window.location.href='edit-grades.html?id=' + e.target.id.slice(5);
        })
    }

    for(i = 0; i < delBtns.length; i++) {
        delBtns[i].addEventListener('click', (e) => {
            delStudent(e.target.id.slice(5));
            list_container.removeChild(document.getElementById(e.target.id.slice(5)));
        })
    }
}