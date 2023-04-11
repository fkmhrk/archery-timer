const restrictInput = (e) => {
    if (!/^[XxMm0-9]*$/.test(e.key)) {
        e.preventDefault();
    }
};

const scoreValue = (input) => {
    const value = input.value.toUpperCase();
    if (value === "X") return 10;
    if (value === "M") return 0;
    const intValue = parseInt(value);
    if (isNaN(intValue) || intValue < 0 || intValue > 10) return null;
    return intValue;
};

const calculateScore = () => {
    const scoreTable = document.getElementById("score-table");
    let totalScore = 0;
    for (let i = 0; i < 6; i++) {
        const endIndex = i * 2;
        const inputs1 = scoreTable.rows[endIndex].querySelectorAll("input");
        const inputs2 = scoreTable.rows[endIndex + 1].querySelectorAll("input");

        const sum1 = Array.from(inputs1).reduce((acc, input) => acc + (scoreValue(input) || 0), 0);
        const sum2 = Array.from(inputs2).reduce((acc, input) => acc + (scoreValue(input) || 0), 0);
        const total = sum1 + sum2;

        scoreTable.rows[endIndex].cells[4].textContent = sum1 || "0"; // 1本目〜3本目の計
        scoreTable.rows[endIndex + 1].cells[4].textContent = sum2 || "0"; // 4本目〜6本目の計
        totalScore += total;

        scoreTable.rows[endIndex].cells[5].textContent = total; // 6本計
        scoreTable.rows[endIndex].cells[6].textContent = totalScore;
    }
};

const moveToNextInput = (e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
        return;
    }
    const target = e.target;
    const value = target.value;
    const inputs = Array.from(document.getElementById("score-table").querySelectorAll("input"));
    const index = inputs.indexOf(target);
    if (index < inputs.length - 1) {
        inputs[index + 1].focus();
    }
};

const handleBackspace = (e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
        const target = e.target;
        const value = target.value;
        if (value.length === 0) {
            const inputs = Array.from(document.getElementById("score-table").querySelectorAll("input"));
            const index = inputs.indexOf(target);
            if (index > 0) {
                inputs[index - 1].focus();
                inputs[index - 1].value = "";
            }
        }
    }
};

let focusedInput = null;

const keyboard = document.getElementById("keyboard");

const onScreenKeyboardBtns = keyboard.querySelectorAll("button");

onScreenKeyboardBtns.forEach(btn => {
    btn.addEventListener("mousedown", function (e) {
        e.preventDefault();
    });
    btn.addEventListener("click", function () {
        const currentInput = document.activeElement;
        if (currentInput.tagName === "INPUT") {
            currentInput.value = this.textContent;
            currentInput.dispatchEvent(new Event('input'));
            moveToNextInput({ target: currentInput });
        }
    });
});

document.body.appendChild(keyboard);

const initScoreTable = () => {
    const scoreTable = document.getElementById("score-table");

    for (let i = 0; i < 12; i++) {
        const row = scoreTable.insertRow();
        if (i % 2 === 0) {
            row.innerHTML = `
                <td>${(i / 2) + 1}</td>
                <td><input type="text" maxlength="2" size="2"></td>
                <td><input type="text" maxlength="2" size="2"></td>
                <td><input type="text" maxlength="2" size="2"></td>
                <td></td>
                <td rowspan="2"></td>
                <td rowspan="2"></td>
            `;
        } else {
            row.innerHTML = `
                <td></td>
                <td><input type="text" maxlength="2" size="2"></td>
                <td><input type="text" maxlength="2" size="2"></td>
                <td><input type="text" maxlength="2" size="2"></td>
                <td></td>
            `;
        }
    }

    // Add event listeners to input elements
    const inputs = scoreTable.querySelectorAll("input");
    inputs.forEach(input => {
        input.addEventListener("keydown", restrictInput);
        input.addEventListener("keyup", moveToNextInput);
        input.addEventListener("keyup", handleBackspace);
        input.addEventListener("input", calculateScore);
    });
};

initScoreTable();
const adjustScoreWrapperHeight = () => {
    const keyboard = document.getElementById('keyboard');
    const scoreWrapper = document.querySelector('.score-wrapper');
    const keyboardHeight = keyboard.offsetHeight;

    scoreWrapper.style.maxHeight = `calc(100vh - ${keyboardHeight + 100}px)`; // 50px for additional spacing
    console.log(scoreWrapper.style.maxHeight);
};

adjustScoreWrapperHeight();
