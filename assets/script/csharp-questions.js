let filterState = {};

function isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        return true;
    return false;
}

function anySelected(state) {
    for (const key in state) {
        if (state[key].enabled) return true;
    }
    return false;
}

async function writeToLocalStore() {
    window.localStorage.setItem('filterState', JSON.stringify(filterState));
}

async function readFromLocalStore() {
    const item = window.localStorage.getItem('filterState');
    if (item == null) {
        filterState = {}
    }
    else {
        filterState = JSON.parse(item);
    }
}

async function onFilterButtonClicked(event) {
    const target = event.currentTarget;
    const tagName = target.getAttribute('tagName');
    if (tagName == 'clear') {
        for (const key in filterState) {
            if (filterState[key].enabled) {
                filterState[key].enabled = false;
                filterState[key].elem.classList.remove('question-tag-selected');
            }
        }
    }
    else {
        const tag = filterState[tagName];
        if (tag.enabled) {
            tag.elem.classList.remove('question-tag-selected');
        } else {
            tag.elem.classList.add('question-tag-selected');
        }
        tag.enabled = !tag.enabled;
    }
    await loadQuestions()
    hljs.highlightAll();
    await writeToLocalStore()
}

function createEmoji(src, additionalClasses) {
    let emoji = document.createElement('img')
    emoji.classList.add('emoji')
    if (additionalClasses) {
        for (let cssClass in additionalClasses) {
            emoji.classList.add(additionalClasses)
        }
    }
    emoji.setAttribute('align', 'left')
    emoji.src = src
    return emoji
}

function createNavTagText(innerText) {
    let tagText = document.createElement('span');
    tagText.classList.add('nav-tag-text');
    tagText.innerText = innerText;
    return tagText
}

function createCloseButton() {
    let close = document.createElement('span');
    close.onclick = onFilterButtonClicked;
    close.classList.add('question-tag', 'question-tag-nav');
    {
        let emoji = createEmoji(`/assets/images/emojis/cross-mark.png`, ['emoji-cross-mark'])
        close.append(emoji);
    }
    close.setAttribute('tagName', 'clear');
    filterState['clear'] = {
        elem: close,
        enabled: false
    };
    return close
}

function createTag(emojiSrc, tagKey) {
    let tag = document.createElement('div');
    tag.onclick = onFilterButtonClicked;
    tag.classList.add('question-tag', 'question-tag-nav');
    {
        let emoji = createEmoji(emojiSrc)
        let tagText = createNavTagText(tagKey)
        tag.append(emoji);
        tag.append(tagText)
    }
    tag.setAttribute('tagName', tagKey);
    if (tagKey in filterState) {
        if (filterState[tagKey].enabled) {
            tag.classList.add('question-tag-selected');
        }
        filterState[tagKey].elem = tag;
    } else {
        filterState[tagKey] = {
            elem: tag,
            enabled: false
        };
    }
    return tag
}

function createNavBar(allTags) {
    let navbar = document.createElement('div');
    navbar.id = "mynavbar";
    for (let key in allTags) {
        let tag = createTag(`/assets/images/emojis/${allTags[key]['emoji']}.png`, key)
        navbar.append(tag);
    }
    navbar.append(createCloseButton());
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

function isTagDisabled(tag) {
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
    for (const key in filterState) {
        if (filterState[key].enabled == true) {
            if (!qTags.includes(key)) {
                return false;
            }
        }
    }
    return true;
}

function isHotQuestion(question, max) {
    if ("timesAsked" in question) {
        const timesAsked = question["timesAsked"];
        if (timesAsked >= (max * 0.3)) {
            return true;
        }
    }
    return false;
}

function createQuestionBlock(question, max, indx) {
    if (!takeQuestion(question)) return undefined;
    let questionBlock = document.createElement("div");
    questionBlock.classList.add('question-block');
    const hotQuestion = isHotQuestion(question, max)
    {
        let questionP = document.createElement('span');

        let indxText = document.createElement('b');
        indxText.innerText = `${indx}. `

        let questionText = document.createElement('p');
        const newText = question['question']?.replace(/\`(.+?)\`/g, '<code class="inline-code">$1</code>');
        questionText.innerHTML = newText;
        questionText.prepend(indxText)

        questionP.append(questionText);
        questionBlock.append(questionP);
    }
    {
        let tagsBlock = document.createElement("div");
        tagsBlock.classList.add("tagsContainer")
        if ("tags" in question) {
            question["tags"].sort().forEach(tag => {
                let tagElem = document.createElement('span');
                tagElem.classList.add('question-tag');
                tagElem.onclick = onFilterButtonClicked;
                tagElem.setAttribute('tagName', tag);

                let tagText = document.createElement('span');
                if (tag == 'hot') {
                    tagText.innerText = '🔥' + tag;
                } else {
                    tagText.innerText += tag;
                }
                tagText.classList.add('tag-text')

                tagElem.append(tagText);
                tagsBlock.append(tagElem);
            })
        }
        questionBlock.append(tagsBlock);
    }
    if (!isMobile()) {
        if ("godBoltcode" in question) {
            const encodedcode = question["godBoltcode"];
            const count = (encodedcode.match(/%0A/g) || []).length;
            const height = (21 * (count + 1)) + 200;
            questionBlock.innerHTML += `<iframe loading="lazy" class="codeframe" height="${height}px"frameBorder="0" src="https://godbolt.org/e?hideEditorToolbars=true#g:!((g:!((g:!((h:codeEditor,i:(filename:'1',fontScale:14,fontUsePx:'0',j:1,lang:c%2B%2B,source:'${encodedcode}'),l:'5',n:'0',o:'C%2B%2B+source+%231',t:'0')),k:100,l:'4',m:50,n:'0',o:'',s:0,t:'0'),(g:!((h:executor,i:(argsPanelShown:'1',compilationPanelShown:'0',compiler:g112,compilerOutShown:'0',execArgs:'',execStdin:'',fontScale:14,fontUsePx:'0',j:1,lang:c%2B%2B,libs:!(),options:'',source:1,stdinPanelShown:'1',tree:'1',wrap:'1'),l:'5',n:'0',o:'Executor+x86-64+gcc+11.2+(C%2B%2B,+Editor+%231)',t:'0')),header:(),l:'4',m:50,n:'0',o:'',s:0,t:'0')),l:'3',n:'0',o:'',t:'0')),version:4"></iframe>`;
        }
    }
    else {
        if ("urlEncodedCode" in question) {
            const encodedcode = question["urlEncodedCode"];
            let elem = `<pre><code class="language-cpp">${decodeURIComponent(encodedcode)
                .replace(/&/g, '&amp;')
                .replace(/\</, '&lt;')
                .replace(/\>/, '&gt;')
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;")
                }</code></pre>`;
            questionBlock.innerHTML += elem;
        }
    }
    return questionBlock;
}

function createQuestionsDiv(questions, max) {
    let questionsDiv = document.createElement('div');
    questionsDiv.id = 'inner-questions-div';
    let indx = 0;
    let taken = 0;
    questions.forEach(question => {
        indx++
        const questionBlock = createQuestionBlock(question, max, indx)
        if (questionBlock) {
            questionsDiv.append(questionBlock)
            taken++;
        }
    })
    const elem = document.getElementById('counter');
    elem.innerText = "0"
    let i = 0;
    var interval = setInterval(function () {
        if (i < 15) {
            elem.innerText = " " + ((parseInt(elem.innerText)) + Math.round(taken / 15));
            i++;
        } else {
            elem.innerText = " " + taken
            clearInterval(interval)
        }
    }, 25);
    return questionsDiv;
}

async function loadQuestions(mainDiv, bd) {
    const questions = bd["questions"];

    let max = getMax(questions);

    const inner = document.getElementById('inner-questions-div');
    if (inner) {
        mainDiv.removeChild(inner);
    }
    mainDiv.append(createQuestionsDiv(questions, max));
}

async function addCounter(mainDiv) {
    const counterContainer = document.createElement('div');
    counterContainer.classList.add('counterContainer')
    const counter = document.createElement('div');
    counter.classList.add('counter-inner')
    const counterText = document.createElement('div');
    counterText.classList.add('counter-inner')
    counterText.innerText = "Result:";
    counter.setAttribute('align', 'center');
    counter.id = "counter"
    counter.innerText = "0"

    mainDiv.append(counterText);
    mainDiv.append(counter);
    mainDiv.append(counterContainer);
}

async function main(questionsJson) {
    let bd = await (await fetch(questionsJson)).json();

    await readFromLocalStore()
    const questionsDiv = document.getElementById("questions");
    questionsDiv.append(createNavBar(bd['tags']))
    addCounter(questionsDiv)
    loadQuestions(questionsDiv, bd)

    let coffee = document.getElementById("buymecoffeediv")
    if (isMobile()) {
        coffee.classList.add("mobile")
    }
    hljs.highlightAll();
}

main("/assets/data/csharp-questions/questions-demo.json")
