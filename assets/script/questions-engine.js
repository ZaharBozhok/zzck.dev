class Emoji {
    constructor(imgSrc) {
        this.imgSrc = imgSrc
        this.htmlElem = document.createElement('img')
        this.htmlElem.classList.add('emoji')
        this.htmlElem.setAttribute('align', 'left')
        this.htmlElem.src = this.imgSrc
    }
    get html() {
        return this.htmlElem
    }
}

class TagFilterText {
    constructor(text) {
        this.text = text
        this.htmlElem = document.createElement('span');
        this.htmlElem.classList.add('tag-text');
        this.htmlElem.innerText = this.text;
    }
    get html() {
        return this.htmlElem
    }
}

class TagFilterButtonState {
    constructor(tagId, enabled) {
        this._enabled = enabled
        this.onEnabledChanged = []
        this.tagId = tagId
    }
    get enabled() {
        return this._enabled
    }
    set enabled(val) {
        if (val === this._enabled) return

        const old = this._enabled
        this._enabled = val;
        for (let handler in this.onEnabledChanged) {
            this.onEnabledChanged[handler](old, this._enabled)
        }

    }
}

class TagFilterButton {
    constructor(props, state) {
        this.emoji = new Emoji(props.imgSrc)
        this.text = new TagFilterText(props.text)
        this.tagId = props.tagId

        this.htmlElem = document.createElement('div');
        this.htmlElem.onclick = () => this.Click()
        this.htmlElem.classList.add('question-tag', 'question-tag-nav');
        this.htmlElem.append(this.emoji.html)
        this.htmlElem.append(this.text.html)

        this.state = state
        this.state.onEnabledChanged.push((oldVal, newVal) => { this.OnEnabledChanged(oldVal, newVal) })
        this.OnEnabledChanged(null, this.state.enabled)
    }
    get html() {
        return this.htmlElem
    }

    OnEnabledChanged(oldVal, newVal) {
        if (newVal === true) {
            this.htmlElem.classList.add('question-tag-selected')
        }
        else {
            this.htmlElem.classList.remove('question-tag-selected')
        }
    }

    Click() {
        this.state.enabled = !this.state.enabled
    }
}

class TagFilterClearButton {
    constructor(props, state) {
        this.emoji = new Emoji(props.imgSrc)
        this.tagsProps = state.tagsStates

        this.htmlElem = document.createElement('div');
        this.htmlElem.onclick = () => this.Click()
        this.htmlElem.classList.add('question-tag', 'question-tag-nav');
        this.htmlElem.append(this.emoji.html)
    }
    Click() {
        for (const key in this.tagsProps) {
            this.tagsProps[key].enabled = false
        }
    }
    get html() {
        return this.htmlElem
    }
}

class TagNavBar {
    constructor(props, state) {
        this.clearButton = new TagFilterClearButton({ imgSrc: `/assets/images/emojis/cross-mark.png` }, state)
        this.tagFilterButtons = []
        for (let i in props.tagsProps) {
            this.tagFilterButtons.push(new TagFilterButton(props.tagsProps[i], state.tagsStates[props.tagsProps[i].tagId]))
        }

        this.htmlElem = document.createElement('div')
        this.htmlElem.classList.add('tag-nav-bar')
        for (let i in this.tagFilterButtons) {
            this.htmlElem.append(this.tagFilterButtons[i].html)
        }
        this.htmlElem.append(this.clearButton.html)
    }

    get html() {
        return this.htmlElem
    }
}

class QuestionText {
    constructor(props) {
        this.text = props.text
        this.index = props.index

        this.htmlElem = document.createElement('span')

        let indxText = document.createElement('b');
        indxText.innerText = `${this.index}. `

        let questionText = document.createElement('p');
        const newText = this.text?.replace(/\`(.+?)\`/g, '<code class="inline-code">$1</code>');
        questionText.innerHTML = newText;
        questionText.prepend(indxText)

        this.htmlElem.append(questionText);
    }
    get html() {
        return this.htmlElem
    }
}

class QuestionTagsBlock {
    constructor(props, state) {
        this.questionTags = []
        for (let index in props.questionTagsProps) {
            this.questionTags.push(new QuestionTag(props.questionTagsProps[index], state.questionTagsStates[index]))
        }

        this.htmlElem = document.createElement("div");
        this.htmlElem.classList.add("tagsContainer")
        for (let index in this.questionTags) {
            this.htmlElem.append(this.questionTags[index].html)
        }
    }
    get html() {
        return this.htmlElem
    }
}

class QuestionTag {
    constructor(props, state) {
        this.text = new TagFilterText(props.text)
        this.tagId = props.tagId

        this.htmlElem = document.createElement('span')
        this.htmlElem.classList.add('question-tag');
        this.htmlElem.onclick = () => this.Click()
        this.htmlElem.append(this.text.html)

        this.state = state
        this.state.onEnabledChanged.push((oldVal, newVal) => this.OnEnabledChanged(oldVal, newVal))
        this.OnEnabledChanged(null, this.state.enabled)
    }

    OnEnabledChanged(oldVal, newVal) {
        if (newVal === true) {
            this.htmlElem.classList.add('question-tag-selected')
        }
        else {
            this.htmlElem.classList.remove('question-tag-selected')
        }
    }

    get html() {
        return this.htmlElem
    }

    Click() {
        this.state.enabled = !this.state.enabled
    }

}

class Bd {
    constructor(bd) {
        this.bd = bd
    }
    get tagsProps() {
        let tagsProps = {}
        for (let key in this.bd['tags']) {
            tagsProps[key] = {
                imgSrc: `/assets/images/emojis/${this.bd['tags'][key]['emoji']}.png`,
                text: key,
                tagId: key
            }
        }
        return tagsProps
    }
    get questionProps() {
        let questionsProps = []
        for (let index in this.bd['questions']) {
            let question = this.bd['questions'][index]
            let questionBlock = {
                questionTagsProps: [],
                text: question['question'],
                companies: question['companies'],
                index: parseInt(index) + 1
            }
            for (let index2 in question['tags']) {
                const tag = question['tags'][index2]
                questionBlock.questionTagsProps.push({
                    text: tag,
                    tagId: tag
                })
            }
            questionsProps.push(questionBlock)
        }
        return questionsProps
    }

}

class QuestionBlock {
    constructor(props, state) {
        this.questionText = new QuestionText(props)
        this.tagsBlock = new QuestionTagsBlock(props, state)

        this.htmlElem = document.createElement("div");
        this.htmlElem.classList.add('question-block');
        this.htmlElem.append(this.questionText.html)
        this.htmlElem.append(this.tagsBlock.html)
    }
    get html() {
        return this.htmlElem
    }
}

function createQuestionBlockFromPropsAndState(questionProps, tagsStates) {
    let questionBlockState = {
        questionTagsStates: []
    }
    for (let i in questionProps.questionTagsProps) {
        let questionTagProp = questionProps.questionTagsProps[i]
        questionBlockState.questionTagsStates.push(tagsStates[questionTagProp.tagId])
    }
    return new QuestionBlock(questionProps, questionBlockState)
}

function createTagsStatesFromProps(tagsProps) {
    let tagsStates = {}
    for (let tagProp in tagsProps) {
        tagsStates[tagProp] = new TagFilterButtonState(tagProp, false)
    }
    return tagsStates
}

class QuestionsList {
    constructor(props, state) {
        let questionProps = []

        // Enabled state
        const enabledState = []
        for (const key in state.tagsStates) {
            if (state.tagsStates[key].enabled) {
                enabledState.push(state.tagsStates[key].tagId)
            }
        }

        let added = 0;
        props.questionsProps.forEach(
            (questionProp) => {
                for (let i in enabledState) {
                    const tagId = enabledState[i]
                    const found = questionProp.questionTagsProps.find(tagProp => tagProp.tagId == tagId)
                    if (!found) return;
                }
                added++;
                questionProps.push(createQuestionBlockFromPropsAndState(questionProp, state.tagsStates))
            }
        )
        state.filterCounterState.num = added

        this.htmlElem = document.createElement('div')
        questionProps.forEach(
            (val) => this.htmlElem.append(val.html)
        )
    }

    get html() {
        return this.htmlElem
    }
}

class FilterCounterState {
    constructor(num) {
        this._num = num
        this.onNumChanged = []
    }
    get num() {
        return this._num
    }
    set num(val) {
        if (val === this._num) return

        const old = this._num
        this._num = val;
        for (let handler in this.onNumChanged) {
            this.onNumChanged[handler](old, this._num)
        }
    }
}

class FilterCounter {
    constructor(props, state) {
        this.numState = state
        this.numHolder = document.createElement('b')
        this.numHolder.innerText = this.numState.num.toString()

        this.htmlElem = document.createElement('div')
        const text = document.createElement('span')
        text.innerHTML = "Result : "
        this.htmlElem.append(text)
        let numSpan = document.createElement('span')
        numSpan.append(this.numHolder)
        this.htmlElem.append(numSpan)

        this.numState.onNumChanged.push((oldVal, newVal) => this.updateState(oldVal, newVal))
        this.interval = null
    }
    get html() {
        return this.htmlElem
    }
    updateState(oldVal, newVal) {
        let i = 0;
        let step = (newVal - oldVal) / 15
        if (this.interval) clearInterval(this.interval)
        this.interval = setInterval(() => {
            if (i < 15) {
                this.numHolder.innerText = Math.round(oldVal + (step * (i + 1))).toString()
                i++;
            } else {
                this.numHolder.innerText = newVal.toString()
                clearInterval(this.interval)
            }
        }, 25);
    }
}

async function processQuestionsContainers(questionsContainerHtmlElem, questionsJson) {
    let bd = new Bd(await (await fetch(questionsJson)).json())

    let tagsProps = bd.tagsProps;
    let tagsStates = createTagsStatesFromProps(tagsProps)

    let navBar = new TagNavBar({ tagsProps: tagsProps }, { tagsStates: tagsStates })

    questionsContainerHtmlElem.append(navBar.html)
    let filterCounterState = new FilterCounterState(0)
    let filterCounter = new FilterCounter(null, filterCounterState)
    questionsContainerHtmlElem.append(filterCounter.html)

    let questionsList = new QuestionsList(
        {
            questionsProps: bd.questionProps
        },
        {
            tagsStates: tagsStates,
            filterCounterState: filterCounterState
        })
    questionsContainerHtmlElem.append(questionsList.html)

    const onAnyTagStateChanged = () => {
        questionsContainerHtmlElem.removeChild(questionsList.html)
        questionsList = new QuestionsList(
            {
                questionsProps: bd.questionProps
            },
            {
                tagsStates: tagsStates,
                filterCounterState: filterCounterState
            })
        questionsContainerHtmlElem.append(questionsList.html)
    }

    for (const key in tagsStates) {
        let tagState = tagsStates[key]
        tagState.onEnabledChanged.push(onAnyTagStateChanged)
    }

}
async function processTags() {
    let questionsContainers = document.getElementsByTagName('questions-container')
    for (let i = 0; i < questionsContainers.length; i++) {
        await processQuestionsContainers(
            questionsContainers[i],
            questionsContainers[i].getAttribute('dataSource')
        )
    }
}
processTags()