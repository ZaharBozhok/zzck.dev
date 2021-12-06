async function main() {
    const questionsDiv = document.getElementById("questions");
    const response = await fetch("/assets/data/c++-questions/questions.json")
    const respJson = await response.json();
    const questions = respJson["questions"];
    const allTags = respJson["tags"];

    let navbar = document.createElement('div');
    navbar.id = "mynavbar";
    for(let key in allTags) {
        navbar.innerHTML += `<span class='question-tag question-tag-nav'>${allTags[key]['emoji']}${key}</span>`
    }
    questionsDiv.append(navbar)

    let max = 1;
    let min = 1;
    questions.forEach(questionBlock => {
        if ("timesAsked" in questionBlock) {
            const timesAsked = questionBlock["timesAsked"]
            if (max < timesAsked) max = timesAsked
        }
    })

    questions.forEach(question => {
        let questionBlock = document.createElement("div");
        questionBlock.classList.add('question-block');
        if ("timesAsked" in question) {
            const timesAsked = question["timesAsked"];
            if (timesAsked >= (max * 0.3)) {
                questionBlock.innerHTML += `<p>🔥${question["question"]}</p>`
            }
        }
        else {
            questionBlock.innerHTML += `<p>${question["question"]}</p>`
        }
        if ("tags" in question) {
            question["tags"].forEach(tag => {
                questionBlock.innerHTML += `<span class='question-tag'>${tag}</span>`
            })
        }
        if ("code" in question) {
            const encodedcode = question["code"];
            const count = (encodedcode.match(/%0A/g) || []).length;
            const height = (21 * (count+1)) + 200;
            questionBlock.innerHTML += `<iframe loading="lazy" class="codeframe" height="${height}px"frameBorder="0" src="https://godbolt.org/e?hideEditorToolbars=true#g:!((g:!((g:!((h:codeEditor,i:(filename:'1',fontScale:14,fontUsePx:'0',j:1,lang:c%2B%2B,source:'${encodedcode}'),l:'5',n:'0',o:'C%2B%2B+source+%231',t:'0')),k:100,l:'4',m:50,n:'0',o:'',s:0,t:'0'),(g:!((h:executor,i:(argsPanelShown:'1',compilationPanelShown:'0',compiler:g112,compilerOutShown:'0',execArgs:'',execStdin:'',fontScale:14,fontUsePx:'0',j:1,lang:c%2B%2B,libs:!(),options:'',source:1,stdinPanelShown:'1',tree:'1',wrap:'1'),l:'5',n:'0',o:'Executor+x86-64+gcc+11.2+(C%2B%2B,+Editor+%231)',t:'0')),header:(),l:'4',m:50,n:'0',o:'',s:0,t:'0')),l:'3',n:'0',o:'',t:'0')),version:4"></iframe>`;
        }
        questionsDiv.append(questionBlock)

    })
}
main()