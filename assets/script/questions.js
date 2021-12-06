async function main() {
    const questionsDiv = document.getElementById("questions");
    const response = await fetch("/assets/data/c++-questions/questions.json")
    const respJson = await response.json();
    const questions = respJson["questions"];
    const allTags = respJson["tags"];
    console.log(allTags)

    let uniqueTags = new Set();
    questions.forEach(questionBlock => {
        if ("tags" in questionBlock) {
            questionBlock["tags"].forEach(tag => {
                uniqueTags.add(tag)
            })
        }
    })

    let navbar = document.createElement('div');
    navbar.id = "mynavbar";
    uniqueTags.forEach(tag => {
        if (tag in allTags)
            navbar.innerHTML += `<span class='question-tag question-tag-nav'>${allTags[tag]['emoji']}${tag}</span>`
        else
            navbar.innerHTML += `<span class='question-tag question-tag-nav'>${tag}</span>`
    })
    questionsDiv.append(navbar)

    let max = 1;
    let min = 1;
    questions.forEach(questionBlock => {
        if ("timesAsked" in questionBlock) {
            const timesAsked = questionBlock["timesAsked"]
            if (max < timesAsked) max = timesAsked
        }
    })

    console.log(min)
    console.log(max)

    console.log(uniqueTags);
    console.log(questions);

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
            const code = decodeURIComponent(question["code"]);
            questionBlock.innerHTML += `<pre><code class='language-cpp'>${code}</code></pre>`
        }
        questionsDiv.append(questionBlock)

    })
}
main()