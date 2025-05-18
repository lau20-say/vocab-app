import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [danhSachTuVung, setDanhSachTuVung] = useState([]);
  const [cheDo, setCheDo] = useState(null);
  const [chiSoHienTai, setChiSoHienTai] = useState(0);
  const [hienNghia, setHienNghia] = useState(false);
  const [diemSo, setDiemSo] = useState(0);
  const [ketQuaKiemTra, setKetQuaKiemTra] = useState(null);
  const [cauTraLoi, setCauTraLoi] = useState([]);
  const [tuVungKiemTra, setTuVungKiemTra] = useState([]);
  const [luaChonHienTai, setLuaChonHienTai] = useState([]);
  const [hienBangNhap, setHienBangNhap] = useState(false);
  const [duLieuNhap, setDuLieuNhap] = useState("");
  const [tienDo, setTienDo] = useState(0);
  const [thongBaoLoi, setThongBaoLoi] = useState("");

  const SO_CAU_HOI_TOI_DA = 20;
  const KHOANG_THOI_GIAN_TU_DONG = 6000;

  const xaoTronMang = (mang) => [...mang].sort(() => Math.random() - 0.5);
  const chonChiSoNgauNhien = () =>
    Math.floor(Math.random() * danhSachTuVung.length);

  const xuLyDuLieuNhap = () => {
    const cacDong = duLieuNhap.split("\n").filter((dong) => dong.trim() !== "");
    const tuVung = cacDong
      .map((dong) => {
        const [tiengAnh, tiengViet] = dong.split(":");
        return {
          tiengAnh: tiengAnh?.trim() || "",
          tiengViet: tiengViet?.trim() || "",
        };
      })
      .filter((tu) => tu.tiengAnh && tu.tiengViet);
    setDanhSachTuVung(tuVung);
    setDuLieuNhap("");
    setHienBangNhap(false);
  };

  useEffect(() => {
    if ((cheDo === 1 || cheDo === 4) && danhSachTuVung.length > 0) {
      setTienDo(0);
      const interval = setInterval(() => {
        setHienNghia(true);
        setTimeout(() => {
          setHienNghia(false);
          setChiSoHienTai(chonChiSoNgauNhien());
          setTienDo(0);
        }, 3000);
      }, KHOANG_THOI_GIAN_TU_DONG);

      const tienDoInterval = setInterval(() => {
        setTienDo((truoc) =>
          Math.min(truoc + 100 / (KHOANG_THOI_GIAN_TU_DONG / 100), 100)
        );
      }, 100);

      return () => {
        clearInterval(interval);
        clearInterval(tienDoInterval);
      };
    }
  }, [cheDo, danhSachTuVung]);

  const sangTheTiepTheo = () => {
    if (!hienNghia) {
      setHienNghia(true);
    } else {
      setHienNghia(false);
      setChiSoHienTai(chonChiSoNgauNhien());
    }
  };

  useEffect(() => {
    if (
      (cheDo === 3 || cheDo === 6) &&
      !ketQuaKiemTra &&
      tuVungKiemTra.length === 0 &&
      danhSachTuVung.length > 0
    ) {
      if (danhSachTuVung.length < 2) {
        setThongBaoLoi("Danh sách từ vựng cần ít nhất 2 từ để kiểm tra!");
        setCheDo(null);
      } else {
        const soCauHoi = Math.min(SO_CAU_HOI_TOI_DA, danhSachTuVung.length);
        const mangXaoTron = xaoTronMang(danhSachTuVung);
        const tuVungKiemTraMoi = mangXaoTron.slice(0, soCauHoi);
        setTuVungKiemTra(tuVungKiemTraMoi);
        setLuaChonHienTai(taoLuaChon(tuVungKiemTraMoi[0], cheDo));
        setThongBaoLoi("");
      }
    }
  }, [cheDo, danhSachTuVung, ketQuaKiemTra]);

  useEffect(() => {
    if (
      (cheDo === 3 || cheDo === 6) &&
      tuVungKiemTra.length > 0 &&
      !ketQuaKiemTra
    ) {
      setLuaChonHienTai(taoLuaChon(tuVungKiemTra[chiSoHienTai], cheDo));
    }
  }, [chiSoHienTai, tuVungKiemTra, ketQuaKiemTra, cheDo]);

  const xuLyCauTraLoi = (luaChon) => {
    const dung = tuVungKiemTra[chiSoHienTai].tiengAnh === luaChon;
    setCauTraLoi([
      ...cauTraLoi,
      { tu: tuVungKiemTra[chiSoHienTai], luaChon, dung },
    ]);
    if (dung) setDiemSo(diemSo + 1);

    if (chiSoHienTai + 1 === tuVungKiemTra.length) {
      setKetQuaKiemTra(true);
    } else {
      setChiSoHienTai(chiSoHienTai + 1);
    }
  };

  const taoLuaChon = (tuHienTai, cheDoKiemTra) => {
    if (!tuHienTai) return [];
    const dapAnDung = tuHienTai.tiengAnh;
    const luaChon = [dapAnDung];
    while (
      luaChon.length < Math.min(4, danhSachTuVung.length) &&
      danhSachTuVung.length > luaChon.length
    ) {
      const tuNgauNhien =
        danhSachTuVung[Math.floor(Math.random() * danhSachTuVung.length)]
          .tiengAnh;
      if (!luaChon.includes(tuNgauNhien)) luaChon.push(tuNgauNhien);
    }
    return xaoTronMang(luaChon);
  };

  const datLaiKiemTra = () => {
    setKetQuaKiemTra(null);
    setDiemSo(0);
    setCauTraLoi([]);
    setChiSoHienTai(0);
    setTuVungKiemTra([]);
    setLuaChonHienTai([]);
    const soCauHoi = Math.min(SO_CAU_HOI_TOI_DA, danhSachTuVung.length);
    const mangXaoTron = xaoTronMang(danhSachTuVung);
    const tuVungKiemTraMoi = mangXaoTron.slice(0, soCauHoi);
    setTuVungKiemTra(tuVungKiemTraMoi);
    setLuaChonHienTai(taoLuaChon(tuVungKiemTraMoi[0], cheDo));
  };

  const docTuVung = () => {
    if (
      danhSachTuVung.length === 0 ||
      !danhSachTuVung[chiSoHienTai]?.tiengAnh
    ) {
      return;
    }

    const tuHienTai = danhSachTuVung[chiSoHienTai].tiengAnh;
    const utterance = new SpeechSynthesisUtterance(tuHienTai);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="App">
      <h1 className="title">Học Từ Vựng Tiếng Anh</h1>

      {cheDo && danhSachTuVung.length > 0 && (
        <div className="content">
          <button
            className="back-btn"
            onClick={() => {
              setCheDo(null);
              setTuVungKiemTra([]);
            }}
          >
            ← Chọn chế độ khác
          </button>
          {(cheDo === 1 ||
            cheDo === 2 ||
            cheDo === 4 ||
            cheDo === 5 ||
            (cheDo === 3 && !ketQuaKiemTra) ||
            (cheDo === 6 && !ketQuaKiemTra)) && (
            <div className={`card ${hienNghia ? "show-meaning" : ""}`}>
              <h2 className="word">
                {cheDo === 4 || cheDo === 5 || cheDo === 6
                  ? (cheDo === 6 ? tuVungKiemTra : danhSachTuVung)[chiSoHienTai]
                      ?.tiengViet
                  : (cheDo === 3 ? tuVungKiemTra : danhSachTuVung)[chiSoHienTai]
                      ?.tiengAnh || "Không có dữ liệu"}
              </h2>
              {(cheDo === 1 || cheDo === 2 || cheDo === 4 || cheDo === 5) &&
                hienNghia && (
                  <p className="meaning slide-in">
                    {cheDo === 4 || cheDo === 5
                      ? danhSachTuVung[chiSoHienTai]?.tiengAnh
                      : danhSachTuVung[chiSoHienTai]?.tiengViet}
                  </p>
                )}
              {(cheDo === 1 || cheDo === 4) && (
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{ width: `${tienDo}%` }}
                  ></div>
                </div>
              )}
              {(cheDo === 2 || cheDo === 5) && (
                <div className="manual-controls">
                  {cheDo === 2 && (
                    <button className="speak-btn" onClick={docTuVung}>
                      🔊 Phát âm
                    </button>
                  )}
                  <button className="next-btn" onClick={sangTheTiepTheo}>
                    {hienNghia ? "Tiếp theo →" : "Hiện nghĩa"}
                  </button>
                </div>
              )}
              {(cheDo === 3 || cheDo === 6) &&
                !ketQuaKiemTra &&
                tuVungKiemTra.length > 0 && (
                  <div className="options">
                    {luaChonHienTai.map((luaChon, idx) => (
                      <button
                        key={idx}
                        className="option-btn"
                        onClick={() => xuLyCauTraLoi(luaChon)}
                      >
                        {luaChon}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          )}
          {(cheDo === 3 || cheDo === 6) && ketQuaKiemTra && (
            <div className="result-container">
              <div className="result">
                <h3>Kết quả kiểm tra</h3>
                <p>
                  Điểm: {diemSo}/{tuVungKiemTra.length} (
                  {((diemSo / tuVungKiemTra.length) * 100).toFixed(1)}%)
                </p>
                <h4>Thống kê chi tiết:</h4>
                <ul>
                  {cauTraLoi.map((traLoi, idx) => (
                    <li key={idx} className={traLoi.dung ? "correct" : "wrong"}>
                      {cheDo === 6 ? traLoi.tu.tiengViet : traLoi.tu.tiengAnh}:{" "}
                      {traLoi.luaChon} {traLoi.dung ? "✔️" : "❌"}
                    </li>
                  ))}
                </ul>
                <button className="restart-btn" onClick={datLaiKiemTra}>
                  Làm lại bài kiểm tra
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!cheDo && (
        <>
          {thongBaoLoi && <p className="error-message">{thongBaoLoi}</p>}

          {hienBangNhap && (
            <div className="notepad">
              <h3>Nhập từ vựng (định dạng: tiếng Anh: tiếng Việt)</h3>
              <textarea
                value={duLieuNhap}
                onChange={(e) => setDuLieuNhap(e.target.value)}
                placeholder="Dán hoặc nhập từ vựng, mỗi dòng một từ, ví dụ:\napple: quả táo\ncat: con mèo\nCần ít nhất 2 từ cho chế độ kiểm tra!"
                rows="10"
              />
              <div className="notepad-actions">
                <button onClick={xuLyDuLieuNhap}>Xác nhận</button>
                <button onClick={() => setHienBangNhap(false)}>Hủy</button>
              </div>
            </div>
          )}

          {!hienBangNhap && (
            <>
              <button
                className="data-btn"
                onClick={() => setHienBangNhap(!hienBangNhap)}
              >
                {hienBangNhap ? "Ẩn Notepad" : "Nhập dữ liệu"}
              </button>
              <div className="mode-selection">
                <button
                  className="mode-btn"
                  onClick={() => setCheDo(1)}
                  disabled={danhSachTuVung.length === 0}
                >
                  Chế độ 1: Tự động (Anh → Việt)
                </button>
                <button
                  className="mode-btn"
                  onClick={() => setCheDo(2)}
                  disabled={danhSachTuVung.length === 0}
                >
                  Chế độ 2: Thủ công (Anh → Việt)
                </button>
                <button
                  className="mode-btn"
                  onClick={() => setCheDo(3)}
                  disabled={danhSachTuVung.length < 2}
                >
                  Chế độ 3: Kiểm tra (Anh → Việt)
                </button>
                <button
                  className="mode-btn"
                  onClick={() => setCheDo(4)}
                  disabled={danhSachTuVung.length === 0}
                >
                  Chế độ 4: Tự động (Việt → Anh)
                </button>
                <button
                  className="mode-btn"
                  onClick={() => setCheDo(5)}
                  disabled={danhSachTuVung.length === 0}
                >
                  Chế độ 5: Thủ công (Việt → Anh)
                </button>
                <button
                  className="mode-btn"
                  onClick={() => setCheDo(6)}
                  disabled={danhSachTuVung.length < 2}
                >
                  Chế độ 6: Kiểm tra (Việt → Anh)
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App;
