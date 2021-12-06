let filterState = {};
let respJson = {};
function anySelected(state) {
    for (const key in state) {
        if (state[key].enabled) return true;
    }
    return false;
}
async function myFunction(event) {
    const target = event.currentTarget;
    const tagName = target.getAttribute('tagName');

    const tag = filterState[tagName];
    if (tag.enabled) {
        tag.elem.classList.remove('question-tag-selected');
    } else {
        tag.elem.classList.add('question-tag-selected');
    }
    tag.enabled = !tag.enabled;
    await loadQuestions()
}

async function createNavBar(allTags) {
    let navbar = document.createElement('div');
    navbar.id = "mynavbar";
    for (let key in allTags) {
        let tag = document.createElement('span');
        tag.onclick = myFunction;
        tag.classList.add('question-tag', 'question-tag-nav');
        tag.innerHTML = `<i class='emoji'>${allTags[key]['emoji']}</i> ${key}`
        tag.setAttribute('tagName', key);
        filterState[key] = {
            elem: tag,
            enabled: false
        };
        navbar.append(tag);
    }
    return navbar;
}

function getMax(questions) {
    let max = 1;
    questions.forEach(questionBlock => {
        if ("timesAsked" in questionBlock) {
            const timesAsked = questionBlock["timesAsked"]
            if (max < timesAsked) max = timesAsked
        }
    })
    return max;
}

function isTagDisabled(tag){
    if (tag in filterState) {
        if (filterState[tag].enabled == false) {
            return true;
        }
    }
    return true;
}

function takeQuestion(q) {
    if (!anySelected(filterState)) return true
    if (!('tags' in q)) {
        return true;
    }
    let enabled = [];
    const qTags = q['tags'];
    for(const key in filterState) {
        if(filterState[key].enabled == true) {
            if (!qTags.includes(key)) {
                return false;
            }
        }
    }
    return true;
}

function createQuestionBlock(question, max) {
    if (!takeQuestion(question)) return undefined;
    let questionBlock = document.createElement("div");
    questionBlock.classList.add('question-block');
    if ("timesAsked" in question) {
        const timesAsked = question["timesAsked"];
        if (timesAsked >= (max * 0.3)) {
            questionBlock.innerHTML += `<p><i class="fire">🔥</i>${question["question"]}</p>`
        }
    }
    else {
        questionBlock.innerHTML += `<p>${question["question"]}</p>`
    }
    let tagsBlock = document.createElement("div");
    tagsBlock.classList.add("tagsContainer")
    if ("tags" in question) {
        question["tags"].forEach(tag => {
            let tagElem = document.createElement('span');
            tagElem.classList.add('question-tag');
            tagElem.innerText = tag;
            tagElem.onclick = myFunction;
            tagElem.setAttribute('tagName', tag);
            tagsBlock.append(tagElem);
        })
    }
    questionBlock.append(tagsBlock);
    if ("code" in question) {
        const encodedcode = question["code"];
        const count = (encodedcode.match(/%0A/g) || []).length;
        const height = (21 * (count + 1)) + 200;
        questionBlock.innerHTML += `<iframe loading="lazy" class="codeframe" height="${height}px"frameBorder="0" src="https://godbolt.org/e?hideEditorToolbars=true#g:!((g:!((g:!((h:codeEditor,i:(filename:'1',fontScale:14,fontUsePx:'0',j:1,lang:c%2B%2B,source:'${encodedcode}'),l:'5',n:'0',o:'C%2B%2B+source+%231',t:'0')),k:100,l:'4',m:50,n:'0',o:'',s:0,t:'0'),(g:!((h:executor,i:(argsPanelShown:'1',compilationPanelShown:'0',compiler:g112,compilerOutShown:'0',execArgs:'',execStdin:'',fontScale:14,fontUsePx:'0',j:1,lang:c%2B%2B,libs:!(),options:'',source:1,stdinPanelShown:'1',tree:'1',wrap:'1'),l:'5',n:'0',o:'Executor+x86-64+gcc+11.2+(C%2B%2B,+Editor+%231)',t:'0')),header:(),l:'4',m:50,n:'0',o:'',s:0,t:'0')),l:'3',n:'0',o:'',t:'0')),version:4"></iframe>`;
    }
    return questionBlock;
}

function createQuestionsDiv(questions, max) {
    let questionsDiv = document.createElement('div');
    questionsDiv.id = 'inner-questions-div';
    questions.forEach(question => {
        const questionBlock = createQuestionBlock(question, max)
        if (questionBlock) {
            questionsDiv.append(questionBlock)
        }
    })
    return questionsDiv;
}

async function addNavbar() {
    const mainDiv = document.getElementById("questions");
    mainDiv.append(await createNavBar(respJson['tags']));
}

async function loadQuestions() {
    const mainDiv = document.getElementById("questions");
    const questions = respJson["questions"];

    let max = getMax(questions);
    let min = 1;

    const inner = document.getElementById('inner-questions-div');
    if (inner) {
        console.log("Removing inner")
        mainDiv.removeChild(inner);
    }
    mainDiv.append(createQuestionsDiv(questions, max));
}

async function loadBd() {
    respJson = await (await fetch("/assets/data/c++-questions/questions.json")).json();
}

async function main() {
    await loadBd()
    await addNavbar()
    await loadQuestions()
}
main()