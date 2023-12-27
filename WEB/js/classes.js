let list_container = document.getElementsByClassName("students-list-item-container")[0];

function spawnDiv(id, major, year, stu_count, target_div) {
    let outDiv = document.createElement('div');
    outDiv.setAttribute('class', 'students-list-item');
    outDiv.setAttribute('id', id);

    let insideDiv_id = document.createElement('div');
    insideDiv_id.setAttribute('class', 'student-list-item-info');
    insideDiv_id.innerText = id;
    
    let insideDiv_major = document.createElement('div');
    insideDiv_major.setAttribute('class', 'student-list-item-info');
    insideDiv_major.innerText = major;
    
    let insideDiv_year = document.createElement('div');
    insideDiv_year.setAttribute('class', 'student-list-item-info');
    insideDiv_year.innerText = year;
    
    let insideDiv_stu_count = document.createElement('div');
    insideDiv_stu_count.setAttribute('class', 'student-list-item-info');
    insideDiv_stu_count.innerText = stu_count;

    outDiv.appendChild(insideDiv_id);
    outDiv.appendChild(insideDiv_major);
    outDiv.appendChild(insideDiv_year);
    outDiv.appendChild(insideDiv_stu_count);

    target_div.appendChild(outDiv);
}

function getClasses() {
    fetch('http://127.0.0.1:5000/classes', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    })
    .catch(() => {
        list_container.innerHTML = "<div style='width: 100%; text-align: center; font-weight: lighter; font-size: 20px; margin-top: 10px; color: red;'>获取班级列表失败</div>";
    })
    .then(response => response.json())
    .then(data => {
        list_container.innerHTML = '';
        console.log(data);
        for(i = 0; i < Object.keys(data).length; i++) {
            spawnDiv(data[i].class_id, data[i].major_name, data[i].year, data[i].student_count, list_container);
        }
    })
}

setTimeout("getClasses()", 500);