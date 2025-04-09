import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [vocabList, setVocabList] = useState([]);
  const [mode, setMode] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [score, setScore] = useState(0);
  const [testResult, setTestResult] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [testVocab, setTestVocab] = useState([]);
  const [showDataInput, setShowDataInput] = useState(false);
  const [inputData, setInputData] = useState("");
  const [progress, setProgress] = useState(0); // Progress bar state for Mode 1

  const TEST_SIZE = 30;
  const AUTO_INTERVAL = 6000; // Total interval for Mode 1 (6s)

  // Hàm xáo trộn mảng
  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  // Xử lý dữ liệu từ notepad
  const processInputData = () => {
    const lines = inputData.split("\n").filter((line) => line.trim() !== "");
    const vocab = lines
      .map((line) => {
        const [english, vietnamese] = line.split(":");
        return {
          english: english?.trim() || "",
          vietnamese: vietnamese?.trim() || "",
        };
      })
      .filter((v) => v.english && v.vietnamese); // Only keep valid entries
    setVocabList(vocab);
    setInputData("");
    setShowDataInput(false);
  };

  // Chế độ 1: Tự động trượt với thanh tiến độ
  useEffect(() => {
    if (mode === 1 && vocabList.length > 0) {
      setProgress(0); // Reset progress
      const interval = setInterval(() => {
        setShowMeaning(true);
        setTimeout(() => {
          setShowMeaning(false);
          setCurrentIndex((prev) => (prev + 1) % vocabList.length);
          setProgress(0); // Reset progress after card change
        }, 3000);
      }, AUTO_INTERVAL);

      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress((prev) =>
          Math.min(prev + 100 / (AUTO_INTERVAL / 100), 100)
        );
      }, 100);

      return () => {
        clearInterval(interval);
        clearInterval(progressInterval);
      };
    }
  }, [mode, vocabList]);

  // Chế độ 2: Next hiển thị nghĩa, lần nữa sang từ mới
  const nextCard = () => {
    if (!showMeaning) {
      setShowMeaning(true);
    } else {
      setShowMeaning(false);
      setCurrentIndex((prev) => (prev + 1) % vocabList.length);
    }
  };

  // Chế độ 3: Chuẩn bị bài kiểm tra
  useEffect(() => {
    if (
      mode === 3 &&
      !testResult &&
      testVocab.length === 0 &&
      vocabList.length > 0
    ) {
      const shuffled = shuffleArray([...vocabList]);
      setTestVocab(shuffled.slice(0, Math.min(TEST_SIZE, shuffled.length)));
    }
  }, [mode, vocabList, testResult]);

  // Xử lý câu trả lời trong chế độ kiểm tra
  const handleTestAnswer = (selected) => {
    const correct = testVocab[currentIndex].vietnamese === selected;
    setAnswers([
      ...answers,
      { word: testVocab[currentIndex], selected, correct },
    ]);
    if (correct) setScore(score + 1);

    if (currentIndex + 1 === testVocab.length) {
      setTestResult(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Tạo 4 lựa chọn ngẫu nhiên
  const getOptions = () => {
    const correctAnswer = testVocab[currentIndex].vietnamese;
    const options = [correctAnswer];
    while (options.length < 4 && vocabList.length > options.length) {
      const randomVocab =
        vocabList[Math.floor(Math.random() * vocabList.length)].vietnamese;
      if (!options.includes(randomVocab)) options.push(randomVocab);
    }
    return shuffleArray(options);
  };

  // Reset bài kiểm tra
  const resetTest = () => {
    setTestResult(null);
    setScore(0);
    setAnswers([]);
    setCurrentIndex(0);
    setTestVocab([]);
    const shuffled = shuffleArray([...vocabList]);
    setTestVocab(shuffled.slice(0, Math.min(TEST_SIZE, shuffled.length)));
  };

  return (
    <div className="App">
      <h1 className="title">Học Từ Vựng Tiếng Anh</h1>

      {/* Nút mở notepad */}
      <button
        className="data-btn"
        onClick={() => setShowDataInput(!showDataInput)}
      >
        {showDataInput ? "Ẩn Notepad" : "Nhập dữ liệu"}
      </button>

      {/* Notepad nhập dữ liệu */}
      {showDataInput && (
        <div className="notepad">
          <h3>Nhập từ vựng (định dạng: tiếng Anh: tiếng Việt)</h3>
          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder="Dán hoặc nhập từ vựng, mỗi dòng một từ, ví dụ:\napple: quả táo\ncat: con mèo"
            rows="10"
            cols="50"
          />
          <div className="notepad-actions">
            <button onClick={processInputData}>Xác nhận</button>
            <button onClick={() => setShowDataInput(false)}>Hủy</button>
          </div>
        </div>
      )}

      {!mode && !showDataInput && (
        <div className="mode-selection">
          <button
            className="mode-btn"
            onClick={() => setMode(1)}
            disabled={vocabList.length === 0}
          >
            Chế độ 1: Tự động
          </button>
          <button
            className="mode-btn"
            onClick={() => setMode(2)}
            disabled={vocabList.length === 0}
          >
            Chế độ 2: Thủ công
          </button>
          <button
            className="mode-btn"
            onClick={() => setMode(3)}
            disabled={vocabList.length === 0}
          >
            Chế độ 3: Kiểm tra
          </button>
        </div>
      )}

      {mode && vocabList.length > 0 && (
        <div className="content">
          <button
            className="back-btn"
            onClick={() => {
              setMode(null);
              setTestVocab([]);
            }}
          >
            ← Chọn chế độ khác
          </button>
          <div className={`card ${showMeaning ? "show-meaning" : ""}`}>
            <h2 className="word">
              {(mode === 3 ? testVocab : vocabList)[currentIndex]?.english ||
                "No data"}
            </h2>
            {(mode === 1 || mode === 2) && showMeaning && (
              <p className="meaning slide-in">
                {vocabList[currentIndex].vietnamese}
              </p>
            )}
            {mode === 1 && (
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
            {mode === 2 && (
              <button className="next-btn" onClick={nextCard}>
                {showMeaning ? "Tiếp theo →" : "Hiện nghĩa"}
              </button>
            )}
            {mode === 3 && !testResult && testVocab.length > 0 && (
              <div className="options">
                {getOptions().map((option, idx) => (
                  <button
                    key={idx}
                    className="option-btn"
                    onClick={() => handleTestAnswer(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
            {mode === 3 && testResult && (
              <div className="result">
                <h3>Kết quả kiểm tra</h3>
                <p>
                  Điểm: {score}/{testVocab.length} (
                  {((score / testVocab.length) * 100).toFixed(1)}%)
                </p>
                <h4>Thống kê chi tiết:</h4>
                <ul>
                  {answers.map((ans, idx) => (
                    <li key={idx} className={ans.correct ? "correct" : "wrong"}>
                      {ans.word.english}: {ans.selected}{" "}
                      {ans.correct ? "✔️" : "❌"}
                    </li>
                  ))}
                </ul>
                <button className="restart-btn" onClick={resetTest}>
                  Làm lại bài kiểm tra
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
