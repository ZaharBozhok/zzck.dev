
function isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        return true;
    return false;
}
class BdManager {
    constructor() {
        this.bdHolder = {}
    }
    async getBd(path) {
        if (path in this.bdHolder) {
            return this.bdHolder[path];
        } else {
            this.bdHolder[path] = new Bd(await (await fetch(path)).json())
            return this.bdHolder[path];
        }
    }
}

let bdManager = new BdManager()

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
    constructor(tagId, enabled, visible) {
        this._enabled = enabled
        this.onEnabledChanged = []
        this.tagId = tagId
        this._visible = visible
        this.onVisibleChanged = []
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
    get visible() {
        return this._visible
    }
    set visible(val) {
        if (val == this._visible) return

        const old = this._visible
        this._visible = val;
        for (let handler in this.onVisibleChanged) {
            this.onVisibleChanged[handler](old, this._visible)
        }
    }
}
class TagFilterButtonAvailableNumber {
    constructor(props, state) {
        this.tagsState = state.tagsStates
        this.dataSource = state.dataSource
        this.tagId = props.tagId

        this.htmlElem = document.createElement('div')
        this.htmlElem.classList.add('tag-filter-button-available-number')

        this.number = document.createElement('p')
        this.number.innerText = '0'

        this.htmlElem.append(this.number)

        for (let key in this.tagsState) {
            this.tagsState[key].onEnabledChanged.push(() => this.OnAnyFilterButtonChanged())//async not waited
        }
        this.OnAnyFilterButtonChanged() // async not waited
    }
    get html() {
        return this.htmlElem
    }
    async OnAnyFilterButtonChanged() {
        let bd = await bdManager.getBd(this.dataSource)
        let questionsProps = bd.questionProps

        // Enabled state
        const enabledState = []
        for (const key in this.tagsState) {
            if (this.tagsState[key].enabled) {
                enabledState.push(this.tagsState[key].tagId)
            }
        }
        if (this.tagId in enabledState) { } else {
            enabledState.push(this.tagId)
        }

        let added = 0;
        questionsProps.forEach(
            (questionProp) => {
                for (let i in enabledState) {
                    const tagId = enabledState[i]
                    const found = questionProp.questionTagsProps.find(tagProp => tagProp.tagId == tagId)
                    if (!found) return;
                }
                added++;
            }
        )
        this.updateState(parseInt(this.number.innerText), added);
    }
    updateState(oldVal, newVal) {
        let i = 0;
        let step = (newVal - oldVal) / 15
        if (this.interval) clearInterval(this.interval)
        this.interval = setInterval(() => {
            if (i < 15) {
                this.number.innerText = Math.round(oldVal + (step * (i + 1))).toString()
                i++;
            } else {
                this.number.innerText = newVal.toString()
                clearInterval(this.interval)
            }
        }, 25);
        if (newVal == 0) {
            this.tagsState[this.tagId].visible = false
        } else if (newVal > 0) {
            this.tagsState[this.tagId].visible = true
        }
    }
}

class TagFilterButton {
    constructor(props, state) {
        this.emoji = new Emoji(props.imgSrc)
        this.text = new TagFilterText(props.text)
        this.number = new TagFilterButtonAvailableNumber({ tagId: props.tagId }, { "tagsStates": state.tagsStates, "dataSource": state.dataSource })
        this.tagId = props.tagId

        this.htmlElem = document.createElement('div');
        this.htmlElem.onclick = () => this.Click()
        this.htmlElem.classList.add('question-tag', 'question-tag-nav');
        this.htmlElem.append(this.emoji.html)
        this.htmlElem.append(this.text.html)
        this.htmlElem.append(this.number.html)

        this.state = state.tagState
        this.state.onEnabledChanged.push((oldVal, newVal) => { this.OnEnabledChanged(oldVal, newVal) })
        this.OnEnabledChanged(null, this.state.enabled)


        this.state.onVisibleChanged.push((oldVal, newVal) => { this.OnVisibilityChanged(oldVal, newVal) })
    }
    get html() {
        return this.htmlElem
    }

    OnVisibilityChanged(oldVal, newVal) {
        if (newVal == true) {
            this.htmlElem.classList.remove('unavailable')
        }
        else if (newVal == false) {
            this.htmlElem.classList.add('unavailable')
        }
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
        this.clearButton = new TagFilterClearButton({ imgSrc: "/assets/images/emojis/cross-mark.png" }, state)
        this.tagFilterButtons = []
        for (let i in props.tagsProps) {
            this.tagFilterButtons.push(new TagFilterButton(props.tagsProps[i], {
                "tagState": state.tagsStates[props.tagsProps[i].tagId],
                "tagsStates": state.tagsStates,
                "dataSource": state.dataSource
            }))
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
                index: parseInt(index) + 1,
                urlEncodedCode: question['urlEncodedCode'],
                godBoltcode: question['godBoltcode']
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

class GodBoltCodeBlock {
    constructor(props, state) {
        this.htmlElem = document.createElement('div')
        const encodedcode = props.godBoltcode
        const count = (encodedcode.match(/%0A/g) || []).length;
        const height = (21 * (count + 1)) + 200;
        this.htmlElem.innerHTML = `<iframe loading="lazy" class="codeframe" height="${height}px"frameBorder="0" src="https://godbolt.org/e?hideEditorToolbars=true#g:!((g:!((g:!((h:codeEditor,i:(filename:'1',fontScale:14,fontUsePx:'0',j:1,lang:c%2B%2B,source:'${encodedcode}'),l:'5',n:'0',o:'C%2B%2B+source+%231',t:'0')),k:100,l:'4',m:50,n:'0',o:'',s:0,t:'0'),(g:!((h:executor,i:(argsPanelShown:'1',compilationPanelShown:'0',compiler:g112,compilerOutShown:'0',execArgs:'',execStdin:'',fontScale:14,fontUsePx:'0',j:1,lang:c%2B%2B,libs:!(),options:'',source:1,stdinPanelShown:'1',tree:'1',wrap:'1'),l:'5',n:'0',o:'Executor+x86-64+gcc+11.2+(C%2B%2B,+Editor+%231)',t:'0')),header:(),l:'4',m:50,n:'0',o:'',s:0,t:'0')),l:'3',n:'0',o:'',t:'0')),version:4"></iframe>`;
    }
    get html() {
        return this.htmlElem
    }
}

class HLJSCodeBlock {
    constructor(props, state) {
        this.htmlElem = document.createElement('div')
        const encodedcode = props.urlEncodedCode
        let elem = `<pre><code class="language-cpp">${decodeURIComponent(encodedcode)
            .replace(/&/g, '&amp;')
            .replace(/\</, '&lt;')
            .replace(/\>/, '&gt;')
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            }</code></pre>`;
        this.htmlElem.innerHTML = elem;
    }
    get html() {
        return this.htmlElem
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

        if (isMobile()) {
            if (props["urlEncodedCode"]) {
                const hljsCodeBlock = new HLJSCodeBlock(props)
                this.htmlElem.append(hljsCodeBlock.html)
            }
        }
        else {
            if (props["godBoltcode"]) {
                const godBolt = new GodBoltCodeBlock(props)
                this.htmlElem.append(godBolt.html)
            }
        }
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
        tagsStates[tagProp] = new TagFilterButtonState(tagProp, false, true)
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

function iosCopyToClipboard(el) {
    var oldContentEditable = el.contentEditable,
        oldReadOnly = el.readOnly,
        range = document.createRange();

    el.contentEditable = true;
    el.readOnly = false;
    range.selectNodeContents(el);

    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(range);

    el.setSelectionRange(0, 999999); // A big number, to cover anything that could be inside the element.

    el.contentEditable = oldContentEditable;
    el.readOnly = oldReadOnly;

    document.execCommand('copy');
}

function CopyUrl(val) {
}

class CopyLinkButton {
    constructor(props, state) {
        this.tagsState = state
        this.textInput = document.createElement('input')
        this.textInput.type = 'text'
        this.textInput.classList.add('copy-link-input')
        this.textInput.setAttribute('readonly', "")

        const label = document.createElement('label')
        label.classList.add('copy-link-label')
        label.innerText = "Share selected tags:";
        label.append(this.textInput)

        this.htmlElem = document.createElement('div');
        this.htmlElem.onclick = () => this.Click()
        this.htmlElem.classList.add('copy-link-button')
        this.htmlElem.append(label)

        this.toast = document.createElement('div');
        this.toast.id = 'snackbar'
        this.toast.innerText = "Link copied to clipboard!"

        this.htmlElem.append(this.toast)

        for (const key in this.tagsState) {
            this.tagsState[key].onEnabledChanged.push(() => this.OnAnyTagChanged())
        }
        this.OnAnyTagChanged()
    }
    get html() {
        return this.htmlElem
    }
    OnAnyTagChanged() {
        const filter = { tags: [] }
        for (let key in this.tagsState) {
            if (this.tagsState[key].enabled) {
                filter.tags.push(this.tagsState[key].tagId)
            }
        }
        const url = document.URL.split('?')[0]
        let urlWithParams = url
        if (filter.tags.length > 0) {
            urlWithParams = url + '?' + 'filter=' + encodeURIComponent(JSON.stringify(filter))
        }
        this.textInput.value = urlWithParams;
    }
    async Click() {
        const val = this.textInput.value
        if (navigator.clipboard) {
            navigator.clipboard.writeText(val).then(() => {
                this.toast.classList.add('show')
                setTimeout(() => {
                    this.toast.classList.remove('show')
                }, 3000);
            }).catch(function () {
                console.log("Failed to navigator.clipboard.writeText")
            });
        } else {
            console.log("need fallback code")
            iosCopyToClipboard(this.textInput);
            // Here's where you put the fallback code for older browsers.
        }
    }
}

async function processQuestionsContainers(questionsContainerHtmlElem, questionsJsonSource, URIfilter) {
    let bd = await bdManager.getBd(questionsJsonSource)

    let tagsProps = bd.tagsProps;
    let tagsStates = createTagsStatesFromProps(tagsProps)
    if (URIfilter) {
        URIfilter.tags.forEach(tag => {
            tagsStates[tag].enabled = true
        })
    }

    let copyLinkButton = new CopyLinkButton(null, tagsStates);
    questionsContainerHtmlElem.append(copyLinkButton.html)

    let navBar = new TagNavBar({ tagsProps: tagsProps }, { tagsStates: tagsStates, dataSource: questionsJsonSource })
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
    if (hljs) hljs.highlightAll();

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
        if (hljs) hljs.highlightAll();
    }

    for (const key in tagsStates) {
        let tagState = tagsStates[key]
        tagState.onEnabledChanged.push(onAnyTagStateChanged)
    }
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}

async function processTags() {
    if (navigator.permissions) {
        navigator.permissions.query({ name: "clipboard-write" })
            .then(() => console.log("Access to clipboard-write approved"))
    }
    let filter = getQueryVariable('filter')
    if (filter) filter = JSON.parse(filter)
    let questionsContainers = document.getElementsByTagName('questions-container')
    for (let i = 0; i < questionsContainers.length; i++) {
        await processQuestionsContainers(
            questionsContainers[i],
            questionsContainers[i].getAttribute('dataSource'),
            filter
        )
    }
}
processTags()