class Emoji {
    constructor(imgSrc) {
        this.imgSrc = imgSrc
    }
    toHtml() {
        let emoji = document.createElement('img')
        emoji.classList.add('emoji')
        emoji.setAttribute('align', 'left')
        emoji.src = this.imgSrc
        return emoji
    }
}

class TagFilterText {
    constructor(text) {
        this.text = text
    }
    toHtml() {
        let tagText = document.createElement('span');
        tagText.classList.add('nav-tag-text');
        tagText.innerText = this.text;
        return tagText
    }
}

class TagFilterButtonState {
    constructor(enabled) {
        this._enabled = enabled
        this.onEnabledChanged = []
    }
    get enabled() {
        return this._enabled
    }
    set enabled(val) {
        if (val === this._enabled) return

        for (let handler in this.onEnabledChanged) {
            this.onEnabledChanged[handler](this._enabled, val)
        }

        this._enabled = val;
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
        this.htmlElem.append(this.emoji.toHtml())
        this.htmlElem.append(this.text.toHtml())

        this.state = state
        this.state.onEnabledChanged.push((oldVal, newVal) => {
            if (newVal == true) {
                this.htmlElem.classList.add('question-tag-selected')
            }
            else {
                this.htmlElem.classList.remove('question-tag-selected')
            }
        })
    }
    get html() {
        return this.htmlElem
    }

    Click() {
        this.state.enabled = !this.state.enabled
    }
}

class TagNavBar {
    constructor(props, state) {
        this.tagFilterButtons = []
        for (let i in props.tagsProps) {
            this.tagFilterButtons.push(new TagFilterButton(props.tagsProps[i], state.tagsStates[i]))
        }

        this.htmlElem = document.createElement('div')
        this.htmlElem.classList.add('tag-nav-bar')
        for (let i in this.tagFilterButtons) {
            this.htmlElem.append(this.tagFilterButtons[i].html)
        }
    }

    get html() {
        return this.htmlElem
    }
}

class Bd {
    constructor(bd) {
        this.bd = bd
    }
    get tagsProps() {
        let tagsProps = []
        for (let key in this.bd['tags']) {
            tagsProps.push({
                imgSrc: `/assets/images/emojis/${this.bd['tags'][key]['emoji']}.png`,
                text: key,
                tagId: "tagId000"
            })
        }
        return tagsProps
    }
}

async function main(questionsJson) {
    let bd = new Bd(await (await fetch(questionsJson)).json())

    let tagsProps = bd.tagsProps;
    let tagsStates = []
    tagsProps.forEach(() => {
        tagsStates.push(new TagFilterButtonState(false))
    })

    let navBar = new TagNavBar({ tagsProps: tagsProps }, { tagsStates: tagsStates })

    let main = document.getElementById("main")
    main.append(navBar.html)
}
main("/assets/data/csharp-questions/questions-demo.json")