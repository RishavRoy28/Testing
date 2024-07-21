document.getElementById('start-quiz').addEventListener('click', startQuiz);

async function startQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = 'Loading...';

    const questions = await fetchQuestions();

    quizContainer.innerHTML = '';
    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');

        const questionText = document.createElement('p');
        questionText.innerText = `${index + 1}. ${q.question}`;
        questionDiv.appendChild(questionText);

        q.answers.forEach(answer => {
            const answerButton = document.createElement('button');
            answerButton.innerText = answer;
            answerButton.onclick = () => checkAnswer(q.correct_answer, answer);
            questionDiv.appendChild(answerButton);
        });

        quizContainer.appendChild(questionDiv);
    });
}

async function fetchQuestions() {
    const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer YOUR_OPENAI_API_KEY`
        },
        body: JSON.stringify({
            prompt: "Generate a quiz question with 4 answers, and indicate the correct answer.",
            max_tokens: 100,
            n: 5,
            stop: ["\n"]
        })
    });

    const data = await response.json();
    const questions = data.choices.map(choice => {
        const [question, ...answers] = choice.text.trim().split('\n');
        return {
            question,
            answers: answers.map(a => a.replace(/^[A-D]\.\s*/, '')),
            correct_answer: answers.find(a => a.startsWith('*')).replace(/^\*\s*/, '')
        };
    });

    return questions;
}

function checkAnswer(correctAnswer, selectedAnswer) {
    if (correctAnswer === selectedAnswer) {
        alert('Correct!');
    } else {
        alert('Wrong!');
    }
}
