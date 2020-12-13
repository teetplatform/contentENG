var prop = '', newitem = true, fileObj, fileName;
createNewFile = (_this) => {
    fileName = _this.parentElement.parentElement.children[1].value;
    if (fileName) {
        if (!localStorage.getItem(fileName)) {
            localStorage.setItem(fileName, "{}");
        }
        getLocalStorage();
        setButtonSection();
    }
}
downloadFile = () => {
    const fileName = document.getElementById('currentFileName').value;
    if (fileName) {
        var myString = localStorage.getItem(fileName);
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(myString));
        element.setAttribute('download', fileName + '.json');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}
getLocalStorage = () => {
    fileObj = JSON.parse(localStorage.getItem(fileName));
}
setButtonSection = () => {
    const btnGrid = document.getElementById('btn-grid');
    btnGrid.innerHTML = '';
    let lastBtn = null;
    Object.keys(fileObj).forEach(qId => {
        const btn = document.createElement('button');
        btn.classList.add('btn', 'btn-info', 'm-1');
        btn.innerText = Number(qId.substring(7));
        btn.onclick = loadQuestionInUI(btn);
        btn.id = qId;
        btn.qArray = fileObj[qId];
        btnGrid.appendChild(btn);
        lastBtn = btn;
    });
    document.getElementById('addnewbtn').onclick = createNewQuestion();
    lastBtn && lastBtn.click();
}
loadQuestionInUI = (btn) => {
    return () => {
        saveFileObj();
        clrAll();
        const card = document.querySelector('.card');
        card.qArray = btn['qArray'];
        card.qId = btn.id;
        renderCard();
    }
}
createNewQuestion = () => {
    return function () {
        let newfilename = fileName;
        if (newfilename[0] === 'S') {
            newfilename = newfilename.slice(1);
        }
        fileObj[newfilename + ('0000' + (Object.keys(fileObj).length + 1)).slice(-4)] = [];
        localStorage.setItem(fileName, JSON.stringify(fileObj));
        setButtonSection();
    }
}
saveFileObj = () => {
    const card = document.querySelector('.card');
    const qArray = card.qArray;
    const qId = card['qId'];
    if (qArray && qArray.length > 0 && qId) {
        qObj = Object.assign({}, qArray);
        Object.keys(qObj).forEach(index => {
            if (qObj[index].length <= 2) {
                delete qObj[index];
            }
        });
        fileObj[qId] = Object.values(qObj);
        localStorage.setItem(fileName, JSON.stringify(fileObj));
    }
}
clrAll = () => {
    document.getElementById('content-input').value = '';
    let btn = document.getElementById(prop);
    btn && btn.classList.remove('bg-info', 'text-light');
    prop = '';
}
renderCard = () => {
    const card = document.querySelector('.card');
    const header = document.querySelector('.card-header');
    header.innerHTML = '';
    const body = document.querySelector('.card-body');
    body.innerHTML = '';
    const footer = document.querySelector('.card-footer');
    footer.innerHTML = '';
    card.qArray.forEach(item => {
        const prop = item.slice(0, 2);
        const val = item.slice(2);
        if (prop.indexOf('Q') > -1) {
            renderInHead(prop, val, header);
        } else if (prop.indexOf('A') > -1 || prop.indexOf('B') > -1 || prop.indexOf('C') > -1 || prop.indexOf('D') > -1) {
            renderInBody(prop, val, body);
        } else if (prop.indexOf('H') > -1) {
            renderInFooter(prop, val, footer);
        }
    });
    renderMathInElement(card, { throwOnError: false, strict: true, delimiters: [{ left: "$", right: "$", display: false }] });
}
renderInHead = (prop, val, header) => {
    switch (prop) {
        case 'QS':
        case 'QI': {
            const ele = document.createElement('div');
            ele.innerHTML = val;
            ele.setAttribute('data-value', val);
            ele.setAttribute('data-prop', prop);
            ele.addEventListener('dblclick', dblclickhandler(ele));
            header.appendChild(ele);
            break;
        }
        case 'QT': {
            const table = document.createElement('table');
            table.setAttribute('data-value', val);
            table.setAttribute('data-prop', prop);
            table.addEventListener('dblclick', dblclickhandler(table));
            getTable(table, val);
            header.appendChild(table);
            break;
        }
    }
}
renderInBody = (prop, val, body) => {
    switch (prop) {
        case 'AS':
        case 'BS':
        case 'CS':
        case 'DS':
        case 'AI':
        case 'BI':
        case 'CI':
        case 'DI': {
            const ele = document.createElement('div');
            ele.innerHTML = val;
            ele.className = 'my-2';
            ele.setAttribute('data-value', val);
            ele.setAttribute('data-prop', prop);
            ele.addEventListener('dblclick', dblclickhandler(ele));
            body.appendChild(ele);
            break;
        }
        case 'AT':
        case 'BT':
        case 'CT':
        case 'DT': {
            const table = document.createElement('table');
            table.setAttribute('data-value', val);
            table.setAttribute('data-prop', prop);
            table.addEventListener('dblclick', dblclickhandler(table));
            getTable(table, val);
            body.appendChild(table);
            break;
        }
    }
}
renderInFooter = (prop, val, footer) => {
    switch (prop) {
        case 'HS':
        case 'HI': {
            const ele = document.createElement('div');
            ele.innerHTML = val;
            ele.setAttribute('data-value', val);
            ele.setAttribute('data-prop', prop);
            ele.addEventListener('dblclick', dblclickhandler(ele));
            footer.appendChild(ele);
            break;
        }
        case 'HT': {
            const table = document.createElement('table');
            table.setAttribute('data-value', val);
            table.setAttribute('data-prop', prop);
            table.addEventListener('dblclick', dblclickhandler(table));
            getTable(table, val);
            footer.appendChild(table);
            break;
        }
    }
}
updateProp = (p) => {
    if (p !== prop) {
        newitem = true;
    }
    clrAll();
    prop = p;
    btn = document.getElementById(prop);
    btn.classList.add('bg-info', 'text-light');
}
updateCard = (_this) => {
    const text = _this.value;
    const qArray = document.querySelector('.card').qArray;
    if (qArray) {
        if (newitem === true) {
            newitem = qArray.length;
        }
        qArray[newitem] = prop + text;
        renderCard();
    }
}
dblclickhandler = (ele) => {
    return () => {
        const value = ele.getAttribute('data-value');
        const prop = ele.getAttribute('data-prop');
        updateProp(prop);
        document.getElementById('content-input').value = value;
        newitem = document.querySelector('.card').qArray.findIndex(s => {return s === prop + value});
    }
}
getTable = (table, tableData) => {
    table.innerHTML = '';
    const cols = tableData.split('&&');
    cols.forEach((col, index) => {
        cols[index] = col.split('&');
    });
    tableData = cols;
    const rowCount = tableData[0].length;
    table.classList.add('table', 'table-bordered', 'table-dark', 'm-0', 'font-weight-light');
    // table.style.minWidth = '500px';
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    for (var row = 0; row < rowCount; row++) {
        const tr = document.createElement('tr');
        for (var col = 0; col < tableData.length; col++) {
            if (row === 0) {
                const th = document.createElement('th');
                th.innerText = tableData[col][row];
                tr.appendChild(th);
            } else {
                const td = document.createElement('td');
                td.innerText = tableData[col][row];
                tr.appendChild(td);
            }
        }
        if (row === 0) {
            thead.appendChild(tr);
        } else {
            tbody.appendChild(tr);
        }
    }
    table.appendChild(thead);
    table.appendChild(tbody);
}