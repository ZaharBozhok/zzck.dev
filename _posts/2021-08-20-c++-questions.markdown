---
layout: post
title:  "[ WIP ] C/C++ interviewing questions"
date:   2021-08-20
last_modified_at: 2021-11-23
categories: [C++]
tags: [C++,Interviewing,Puzzles,Questions]
---
<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/themes/prism.min.css" rel="stylesheet" />
<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/themes/prism-solarizedlight.min.css" rel="stylesheet" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-cpp.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/plugins/autoloader/prism-autoloader.min.js"></script>

<style>
.question-block {
    border-radius: 15px;
    padding: 20px;
}
.question-tag {
    border-radius: 5px;
    border-style: solid;
    border-width: 1px;
    padding-top: 1px;
    padding-bottom: 1px;
    padding-left: 5px;
    padding-right: 5px;
    font-size: 11pt;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    margin-right: 5px;
}
</style>
<div id="questions"></div>

<script>
   async function main() {
      const response = await fetch("/assets/data/c++-questions/questions.json")
      const questions = (await response.json())["questions"];
      console.log(questions);

      const questionsDiv = document.getElementById("questions");
      questions.forEach(question => {
         let questionBlock = document.createElement("div");
         questionBlock.innerHTML += `<p>${question["question"]}</p>`
         questionBlock.classList.add('question-block');
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
</script>
<script>hljs.highlightAll();</script>