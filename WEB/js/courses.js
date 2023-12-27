let list_container = document.getElementsByClassName("students-list-item-container")[0];

function spawnDiv(id, name, teacher_name, major, class_id, credits, target_div) {
    let outDiv = document.createElement('div');
    outDiv.setAttribute('class', 'students-list-item');
    outDiv.setAttribute('id', id);

    let insideDiv_ID = document.createElement('div');
    insideDiv_ID.setAttribute('class', 'student-list-item-info');
    insideDiv_ID.innerText = id;

    let insideDiv_name = document.createElement('div');
    insideDiv_name.setAttribute('class', 'student-list-item-info');
    insideDiv_name.innerText = name;

    let insideDiv_t_name = document.createElement('div');
    insideDiv_t_name.setAttribute('class', 'student-list-item-info');
    insideDiv_t_name.innerText = teacher_name;
    
    let insideDiv_major = document.createElement('div');
    insideDiv_major.setAttribute('class', 'student-list-item-info');
    insideDiv_major.innerText = major;
    
    let insideDiv_class = document.createElement('div');
    insideDiv_class.setAttribute('class', 'student-list-item-info');
    insideDiv_class.innerText = class_id;
    
    let insideDiv_credits = document.createElement('div');
    insideDiv_credits.setAttribute('class', 'student-list-item-info');
    insideDiv_credits.innerText = credits;

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


    outDiv.appendChild(insideDiv_ID);
    outDiv.appendChild(insideDiv_name);
    outDiv.appendChild(insideDiv_t_name);
    outDiv.appendChild(insideDiv_major);
    outDiv.appendChild(insideDiv_class);
    outDiv.appendChild(insideDiv_credits);
    outDiv.appendChild(insideDiv_Ctrl);

    target_div.appendChild(outDiv);
}

function getCourses() {
    fetch('http://127.0.0.1:5000/courses', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    })
    .catch(() => {
        list_container.innerHTML = "<div style='width: 100%; text-align: center; font-weight: lighter; font-size: 20px; margin-top: 10px; color: red;'>获取课程列表失败</div>";
    })
    .then(response => response.json())
    .then(data => {
        list_container.innerHTML = '';
        for(i = 0; i < Object.keys(data).length; i++) {
            spawnDiv(data[i].course_id, data[i].course_name, data[i].courses_year, data[i].major_name, data[i].nature, data[i].credits, list_container);
        }
        addCtrlBtns();
    })
}

function delCourse(course_id) {
    fetch('http://127.0.0.1:5000/courses/' + course_id, {
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

function addCtrlBtns() {
    let editBtns = document.getElementsByClassName('btn-edit');
    let delBtns = document.getElementsByClassName('btn-del');

    for(i = 0; i < editBtns.length; i++) {
        editBtns[i].addEventListener('click', (e) => {
            window.location.href='edit-courses.html?id=' + e.target.id.slice(5);
        })
    }

    for(i = 0; i < delBtns.length; i++) {
        delBtns[i].addEventListener('click', (e) => {
            delCourse(e.target.id.slice(5));
            list_container.removeChild(document.getElementById(e.target.id.slice(5)));
        })
    }
}

setTimeout("getCourses()", 500);