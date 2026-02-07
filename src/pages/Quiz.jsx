import { useEffect, useMemo, useState } from "react";
import "./Quiz.css";
import { fetchQuestions } from "../services/quizService";
import { getCurrentUser } from "../services/authService";

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildOptions(question) {
  const unique = Array.from(
    new Set([question.correct_answer, ...question.incorrect_answers])
  );
  return shuffleArray(unique);
}

const QUIZ_PROGRESS_KEY = "quizProgress";

function Quiz() {
  const currentUser = useMemo(() => getCurrentUser(), []);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);

  // Fetch soal
  const progressKey = currentUser
    ? `${QUIZ_PROGRESS_KEY}_${currentUser}`
    : QUIZ_PROGRESS_KEY;

  const loadQuestions = () => {
    setLoading(true);
    setError("");
    fetchQuestions().then((data) => {
      setQuestions(data);
      if (!data.length) {
        setError("Failed to load questions. Please try again.");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    const saved = localStorage.getItem(progressKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setQuestions(parsed.questions || []);
        setCurrentIndex(parsed.currentIndex || 0);
        setAnswers(parsed.answers || []);
        setTimeLeft(
          typeof parsed.remainingTime === "number"
            ? parsed.remainingTime
            : typeof parsed.timeLeft === "number"
            ? parsed.timeLeft
            : 60
        );
        setStarted(true);
        setLoading(false);
        return;
      } catch {
        localStorage.removeItem(progressKey);
      }
    }
    loadQuestions();
    setStarted(false);
  }, [progressKey]);

  const isFinished = timeLeft <= 0 || currentIndex >= questions.length;

  useEffect(() => {
    if (!started) return;
    if (loading) return;
    if (!questions.length) return;
    if (isFinished) return;
    const payload = {
      questions,
      currentIndex,
      answers,
      remainingTime: timeLeft,
    };
    localStorage.setItem(progressKey, JSON.stringify(payload));
  }, [started, loading, questions, currentIndex, answers, timeLeft, isFinished, progressKey]);

  useEffect(() => {
    if (loading) return;
    if (isFinished) {
      localStorage.removeItem(progressKey);
    }
  }, [loading, isFinished, progressKey]);

  // Timer
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!started) return;
    if (timeLeft <= 0 || currentIndex >= questions.length) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, currentIndex, questions.length]);

  // Ganti soal → shuffle opsi
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!questions[currentIndex]) return;

    const q = questions[currentIndex];
    setOptions(buildOptions(q));
    const existing = answers.find((a) => a.index === currentIndex);
    setSelected(existing ? existing.selected : null);
  }, [currentIndex, questions]);

  // Intro
  if (!started) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2>Quiz App</h2>
          <div className="quiz-intro">
            <p>Total Questions: 10</p>
            <p>Total Time: 60 seconds</p>
            <ul>
              <li>Answers cannot be changed</li>
              <li>No going back to previous questions</li>
              <li>Timer runs continuously</li>
            </ul>
          </div>

          {loading && <p>Loading questions...</p>}
          {error && <p className="quiz-error">{error}</p>}

          <button
            className="quiz-next"
            onClick={() => {
              setStarted(true);
            }}
            disabled={loading || !!error}
          >
            Start Quiz
          </button>

        </div>
      </div>
    );
  }

  // LOADING STATE (UI TETAP ADA)
  if (loading) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2>Quiz App</h2>
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2>Quiz App</h2>
          {error ? <p className="quiz-error">{error}</p> : <p>No questions available right now.</p>}
          <button
            className="quiz-next"
            onClick={() => {
              setStarted(false);
              loadQuestions();
            }}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // FINISH
  if (isFinished) {
    const correct = answers.filter((a) => a.selected === a.correct).length;
    const answered = answers.length;
    const wrong = answered - correct;

    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2>Quiz Finished</h2>
          <div className="quiz-result">
            <p>Total Questions: {questions.length}</p>
            <p>Answered: {answered}</p>
            <p>Correct: {correct}</p>
            <p>Wrong: {wrong}</p>
          </div>
          <button
            className="quiz-next"
            onClick={() => {
              setCurrentIndex(0);
              setOptions([]);
              setSelected(null);
              setAnswers([]);
              setTimeLeft(60);
              setStarted(false);
              loadQuestions();
            }}
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleSelect = (option) => {
    if (selected !== null) return;

    setSelected(option);

    setAnswers((prev) => {
      if (prev.some((a) => a.index === currentIndex)) return prev;

      return [
        ...prev,
        {
          index: currentIndex,
          selected: option,
          correct: currentQuestion.correct_answer,
        },
      ];
    });
  };


  const optionClass = (option) => {
    if (!selected) return "quiz-option";
    if (option === currentQuestion.correct_answer)
      return "quiz-option correct";
    if (option === selected) return "quiz-option wrong";
    return "quiz-option";
  };

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <h2>Quiz App</h2>

          <div className="quiz-warning">
            Once you answer a question, you cannot go back.
          </div>

          <div className="quiz-progress">
            <div
              className="quiz-progress-bar"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

        <p className="quiz-info">
          ⏱ {timeLeft}s | Question {currentIndex + 1} of{" "}
          {questions.length}
        </p>

        <h3
          className="quiz-question"
          dangerouslySetInnerHTML={{
            __html: currentQuestion.question,
          }}
        />

        {options.map((opt, i) => (
          <div
            key={i}
            className={optionClass(opt)}
            onClick={() => handleSelect(opt)}
            dangerouslySetInnerHTML={{ __html: opt }}
          />
        ))}

        {selected && (
          <button
            className="quiz-next"
            onClick={() => setCurrentIndex((i) => i + 1)}
          >
            {currentIndex === questions.length - 1 ? "Finish" : "Next"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Quiz;
