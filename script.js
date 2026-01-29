document.addEventListener("DOMContentLoaded", () => {
    let textDisplay = document.getElementById('text-display')
    let textInput = document.getElementById('text-input')
    let startBtn = document.getElementById('start-btn')
    let resetBtn = document.getElementById('reset-btn')
    let nextBtn = document.getElementById('next-btn')
    let speedElement = document.getElementById('speed')
    let accuracyElement = document.getElementById('accuracy')
    let levelElement = document.getElementById('level')
    let keys = document.getElementById('key')

    let sentences = [
        'سلام، به تمرین تایپ خوش آمدید. با تایپ این متن شروع کنید.',
        'تمرین مداوم تایپ باعث افزایش سرعت و دقت شما خواهد شد.',
        'برای بهبود مهارت تایپ، نیاز به تمرین منظم روزانه دارید.',
        'سعی کنید به صفحه کلید نگاه نکنید و فقط به متن روی صفحه توجه کنید.',
        'با تمرین کافی، میتوانید بدون نگاه کردن به کیبورد، تایپ کنید.',
        'هر چه سریعتر تایپ کنید، زمان بیشتری برای کارهای دیگر خواهید داشت.',
        'با تمرین مداوم، تایپ کردن به یک عادت طبیعی تبدیل خواهد شد.',
        'یادگیری تایپ ده انگشتی یکی از مهارت‌های اساسی در دنیای امروز است.',
        'با یادگیری تایپ سریع، میتوانید در زمان صرفه‌جویی قابل توجهی داشته باشید.',
        'امیدوارم این تمرین‌ها به شما در بهبود مهارت تایپ کمک کند.'
    ]

    let currentLevle = 0
    let startTime
    let timer
    let mistakes = 0
    let isTyping = false
    let totlaChars = 0

    function init() {
        textInput.disabled = true
        displayLeval()
        preventPasting()
    }
    init()

    function preventPasting() {
        textInput.addEventListener('paste', (e) => {
            e.preventDefault()
            alert('"تقلب ممنوع! لطفا متن را تایپ کنید."')
        })
        textInput.addEventListener('keydown', (e) => {
            console.log(e.key)
            highlightKey(e.key)
        })
    }

    function highlightKey(key) {
        const keyElement = document.querySelector(`.key[data-key="${key}"]`)

        if (keyElement) {
            keyElement.classList.add("highlight")

            setTimeout(() => {
                keyElement.classList.remove("highlight")
            }, 200)
        }
    }

    function displayLeval() {
        textDisplay.innerHTML = sentences[currentLevle]
        levelElement.innerHTML = currentLevle + 1
    }

    function startTest() {
        textInput.disabled = false
        textInput.value = ''
        textInput.focus()
        startTime = new Date()
        mistakes = 0
        isTyping = true
        totlaChars = 0

        startBtn.disabled = true
        nextBtn.disabled = true
        timer = setInterval(updateSpeed, 1000)
        formatTextDisplay()
    }

    function formatTextDisplay() {
        const text = sentences[currentLevle]
        textDisplay.innerHTML = ''

        Array.from(text).forEach(char => {
            const CharSpan = document.createElement('span')
            CharSpan.textContent = char
            textDisplay.appendChild(CharSpan)
        });
    }

    function checkTyping() {
        const textToYype = sentences[currentLevle]
        const typedText = textInput.value
        const spans = textDisplay.querySelectorAll('span')
        totlaChars = typedText.length

        let correct = true

        for (i = 0; i < spans.length; i++) {
            spans[i].classList.remove('correct', 'incorrect', 'current')
            if (i < typedText.length) {
                if (typedText[i] === textToYype[i]) {
                    spans[i].classList.add('correct')
                }
                else {
                    spans[i].classList.add('incorrect')
                    correct = false
                    if (i >= mistakes) {

                        mistakes++
                    }
                }
            }
            else if (i === typedText.length) {
                spans[i].classList.add('current')
            }
        }
        if (typedText.length === textToYype.length) {
            clearInterval(timer)
            textInput.disabled = true
            isTyping = false
            nextBtn.disabled = false
            startBtn.disabled = false
        }
        updateAccuracy()
    }

    function updateSpeed() {
        if (!isTyping) return

        const cureentTime = new Date()
        const timeElapsed = (cureentTime - startTime) / 60000
        const wordsType = textInput.value.trim().split(/\s+/).length

        if (timeElapsed > 0) {
            const wpm = Math.round(wordsType / timeElapsed)
            speedElement.textContent = wpm
        }
    }

    function updateAccuracy() {
        if (totlaChars === 0) {
            accuracyElement.textContent = '100%'
            return
        }
        const accuracy = Math.max(0, Math.round(((totlaChars - mistakes) / totlaChars) * 100))
        accuracyElement.textContent = accuracy
    }

    function restTest() {
        clearInterval(timer)
        textInput.value = ''
        textInput.disabled = true
        isTyping = false

        startBtn.disabled = false
        nextBtn.disabled = true
        speedElement.textContent = '0'
        accuracyElement.textContent = '100'
        displayLeval()
    }

    function nextLevel() {
        currentLevle = (currentLevle + 1) % sentences.length
        restTest()
    }

    startBtn.addEventListener('click', startTest)
    textInput.addEventListener('input', checkTyping)
    nextBtn.addEventListener('click', nextLevel)
    resetBtn.addEventListener('click', restTest)
})