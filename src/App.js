import React, { useState, useEffect, useRef } from "react";
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
  const [linkNhac, setLinkNhac] = useState("");
  const [danhSachPhat, setDanhSachPhat] = useState([]);
  const [chiSoNhacHienTai, setChiSoNhacHienTai] = useState(0);
  const [dangPhat, setDangPhat] = useState(false);
  const [tienDoNhac, setTienDoNhac] = useState(0);
  const [amLuong, setAmLuong] = useState(50);
  const [phatLaiLienTuc, setPhatLaiLienTuc] = useState(false);
  const [hienNhac, setHienNhac] = useState(false);
  const [thoiGianDemNguoc, setThoiGianDemNguoc] = useState(0);
  const [dangDemNguoc, setDangDemNguoc] = useState(false);
  const [hienDemNguoc, setHienDemNguoc] = useState(false);
  const [thoiGianTuyChinh, setThoiGianTuyChinh] = useState({
    gio: "",
    phut: "",
    giay: "",
  });
  const playerRef = useRef(null);
  const playerReady = useRef(false);

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

  const xuLyLinkNhac = () => {
    if (!linkNhac) {
      setThongBaoLoi("Vui lòng nhập link YouTube!");
      return;
    }
    const videoIdMatch = linkNhac.match(/(?:v=|youtu\.be\/)([^&\n]+)/);
    if (videoIdMatch) {
      const videoId = videoIdMatch[1];
      setDanhSachPhat((prev) => [...prev, videoId]);
      setThongBaoLoi("");
      if (danhSachPhat.length === 0) {
        setChiSoNhacHienTai(0);
        khoiTaoPlayer(videoId);
      } else if (playerRef.current && playerReady.current) {
        setChiSoNhacHienTai(danhSachPhat.length);
        playerRef.current.loadVideoById(videoId);
        playerRef.current.playVideo();
        setDangPhat(true);
      }
    } else {
      setThongBaoLoi("Link YouTube không hợp lệ!");
    }
    setLinkNhac("");
  };

  useEffect(() => {
    if (
      !window.YT &&
      !document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      )
    ) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  const khoiTaoPlayer = (videoId) => {
    if (playerRef.current) {
      playerRef.current.destroy();
    }
    playerRef.current = new window.YT.Player("youtube-player", {
      height: "0",
      width: "0",
      videoId: videoId || danhSachPhat[chiSoNhacHienTai],
      playerVars: {
        autoplay: 1,
        controls: 0,
        modestbranding: 1,
      },
      events: {
        onReady: (event) => {
          event.target.setVolume(amLuong);
          event.target.playVideo();
          setDangPhat(true);
          playerReady.current = true;
        },
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            setDangPhat(true);
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            setDangPhat(false);
          } else if (event.data === window.YT.PlayerState.ENDED) {
            if (phatLaiLienTuc) {
              event.target.playVideo();
            } else {
              phatBaiTiepTheo();
            }
          }
        },
        onError: (event) => {
          console.error("Lỗi YouTube Player:", event.data);
          setThongBaoLoi("Có lỗi khi phát video: " + event.data);
          phatBaiTiepTheo();
        },
      },
    });
  };

  useEffect(() => {
    let interval;
    if (playerRef.current && playerReady.current && danhSachPhat.length > 0) {
      const updateProgress = () => {
        if (
          playerRef.current &&
          typeof playerRef.current.getCurrentTime === "function"
        ) {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          if (duration > 0) {
            setTienDoNhac((currentTime / duration) * 100);
          }
        }
      };
      interval = setInterval(updateProgress, 500);
    }
    return () => clearInterval(interval);
  }, [dangPhat, danhSachPhat]);

  const handleProgressClick = (e) => {
    if (playerRef.current && playerReady.current) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      const width = rect.width;
      const percentage = (clickPosition / width) * 100;
      const duration = playerRef.current.getDuration();
      const newTime = (percentage / 100) * duration;
      playerRef.current.seekTo(newTime, true);
      setTienDoNhac(percentage);
    }
  };

  const togglePlayPause = () => {
    if (playerRef.current && playerReady.current) {
      if (dangPhat) {
        playerRef.current.pauseVideo();
        setDangPhat(false);
      } else {
        playerRef.current.playVideo();
        setDangPhat(true);
      }
    }
  };

  const tuaToi = () => {
    if (playerRef.current && playerReady.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime + 10, true);
    }
  };

  const tuaLui = () => {
    if (playerRef.current && playerReady.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime - 10, true);
    }
  };

  const phatBaiTiepTheo = () => {
    if (danhSachPhat.length > 0 && playerRef.current && playerReady.current) {
      const chiSoMoi = (chiSoNhacHienTai + 1) % danhSachPhat.length;
      setChiSoNhacHienTai(chiSoMoi);
      playerRef.current.loadVideoById(danhSachPhat[chiSoMoi]);
      playerRef.current.playVideo();
      setDangPhat(true);
    }
  };

  const phatBaiTruocDo = () => {
    if (danhSachPhat.length > 0 && playerRef.current && playerReady.current) {
      const chiSoMoi =
        (chiSoNhacHienTai - 1 + danhSachPhat.length) % danhSachPhat.length;
      setChiSoNhacHienTai(chiSoMoi);
      playerRef.current.loadVideoById(danhSachPhat[chiSoMoi]);
      playerRef.current.playVideo();
      setDangPhat(true);
    }
  };

  const togglePhatLaiLienTuc = () => {
    setPhatLaiLienTuc(!phatLaiLienTuc);
  };

  const thayDoiAmLuong = (e) => {
    const newVolume = parseInt(e.target.value);
    setAmLuong(newVolume);
    if (playerRef.current && playerReady.current) {
      playerRef.current.setVolume(newVolume);
    }
  };

  useEffect(() => {
    if (dangDemNguoc && thoiGianDemNguoc > 0) {
      const interval = setInterval(() => {
        setThoiGianDemNguoc((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (thoiGianDemNguoc === 0 && dangDemNguoc) {
      setDangDemNguoc(false);
    }
  }, [dangDemNguoc, thoiGianDemNguoc]);

  const batDauDemNguocTuyChinh = () => {
    const gio = parseInt(thoiGianTuyChinh.gio) || 0;
    const phut = parseInt(thoiGianTuyChinh.phut) || 0;
    const giay = parseInt(thoiGianTuyChinh.giay) || 0;
    const tongGiay = gio * 3600 + phut * 60 + giay;
    if (tongGiay > 0) {
      setThoiGianDemNguoc(tongGiay);
      setDangDemNguoc(true);
      setThoiGianTuyChinh({ gio: "", phut: "", giay: "" });
    }
  };

  const dinhDangThoiGian = (giay) => {
    const gio = Math.floor(giay / 3600);
    const phut = Math.floor((giay % 3600) / 60);
    const giayConLai = giay % 60;
    return `${gio < 10 ? "0" + gio : gio}:${phut < 10 ? "0" + phut : phut}:${
      giayConLai < 10 ? "0" + giayConLai : giayConLai
    }`;
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
    utterance.lang = "en-US"; // Đặt ngôn ngữ là tiếng Anh (Mỹ)
    utterance.rate = 0.9; // Tốc độ đọc (gần giống Google Dịch)
    utterance.pitch = 1; // Độ cao giọng
    utterance.volume = 1; // Âm lượng

    // Hủy các utterance đang phát (nếu có)
    window.speechSynthesis.cancel();
    // Phát âm từ
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (cheDo === 1 && danhSachTuVung.length > 0) {
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
      cheDo === 3 &&
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
        setLuaChonHienTai(taoLuaChon(tuVungKiemTraMoi[0]));
        setThongBaoLoi("");
      }
    }
  }, [cheDo, danhSachTuVung, ketQuaKiemTra]);

  useEffect(() => {
    if (cheDo === 3 && tuVungKiemTra.length > 0 && !ketQuaKiemTra) {
      setLuaChonHienTai(taoLuaChon(tuVungKiemTra[chiSoHienTai]));
    }
  }, [chiSoHienTai, tuVungKiemTra, ketQuaKiemTra]);

  const xuLyCauTraLoi = (luaChon) => {
    const dung = tuVungKiemTra[chiSoHienTai].tiengViet === luaChon;
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

  const taoLuaChon = (tuHienTai) => {
    if (!tuHienTai) return [];
    const dapAnDung = tuHienTai.tiengViet;
    const luaChon = [dapAnDung];
    while (
      luaChon.length < Math.min(4, danhSachTuVung.length) &&
      danhSachTuVung.length > luaChon.length
    ) {
      const tuNgauNhien =
        danhSachTuVung[Math.floor(Math.random() * danhSachTuVung.length)]
          .tiengViet;
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
    setLuaChonHienTai(taoLuaChon(tuVungKiemTraMoi[0]));
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
          {(cheDo === 1 || cheDo === 2 || (cheDo === 3 && !ketQuaKiemTra)) && (
            <div className={`card ${hienNghia ? "show-meaning" : ""}`}>
              <h2 className="word">
                {(cheDo === 3 ? tuVungKiemTra : danhSachTuVung)[chiSoHienTai]
                  ?.tiengAnh || "Không có dữ liệu"}
              </h2>
              {(cheDo === 1 || cheDo === 2) && hienNghia && (
                <p className="meaning slide-in">
                  {danhSachTuVung[chiSoHienTai]?.tiengViet}
                </p>
              )}
              {cheDo === 1 && (
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{ width: `${tienDo}%` }}
                  ></div>
                </div>
              )}
              {cheDo === 2 && (
                <div className="manual-controls">
                  <button className="speak-btn" onClick={docTuVung}>
                    🔊 Phát âm
                  </button>
                  <button className="next-btn" onClick={sangTheTiepTheo}>
                    {hienNghia ? "Tiếp theo →" : "Hiện nghĩa"}
                  </button>
                </div>
              )}
              {cheDo === 3 && !ketQuaKiemTra && tuVungKiemTra.length > 0 && (
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
          {cheDo === 3 && ketQuaKiemTra && (
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
                      {traLoi.tu.tiengAnh}: {traLoi.luaChon}{" "}
                      {traLoi.dung ? "✔️" : "❌"}
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
                  Chế độ 1: Tự động
                </button>
                <button
                  className="mode-btn"
                  onClick={() => setCheDo(2)}
                  disabled={danhSachTuVung.length === 0}
                >
                  Chế độ 2: Thủ công
                </button>
                <button
                  className="mode-btn"
                  onClick={() => setCheDo(3)}
                  disabled={danhSachTuVung.length < 2}
                >
                  Chế độ 3: Kiểm tra
                </button>
              </div>
            </>
          )}
        </>
      )}

      <div className="floating-widget bottom-left">
        {!hienNhac && (
          <button className="toggle-btn" onClick={() => setHienNhac(true)}>
            🎵
          </button>
        )}
        {hienNhac && (
          <div className="music-player-widget">
            <button className="close-btn" onClick={() => setHienNhac(false)}>
              ×
            </button>
            <div className="music-info">
              <div className="icon">🎵</div>
              <div className="details">
                <h3>
                  {danhSachPhat.length > 0
                    ? `Bài hát ${chiSoNhacHienTai + 1}`
                    : "Chưa có bài hát"}
                </h3>
                <p>Uni - LGM</p>
              </div>
              <div className="thumbnail"></div>
            </div>
            <div className="music-input-container">
              <input
                type="text"
                value={linkNhac}
                onChange={(e) => setLinkNhac(e.target.value)}
                placeholder="Dán link YouTube"
                className="music-input"
              />
              <button className="load-btn" onClick={xuLyLinkNhac}>
                Thêm
              </button>
            </div>
            <div className="music-controls">
              <button className="control-btn" onClick={phatBaiTruocDo}>
                ⏮️
              </button>
              <button className="control-btn" onClick={tuaLui}>
                ⏪
              </button>
              <button
                className="control-btn play-pause"
                onClick={togglePlayPause}
              >
                {dangPhat ? "⏸️" : "▶️"}
              </button>
              <button className="control-btn" onClick={tuaToi}>
                ⏩
              </button>
              <button className="control-btn" onClick={phatBaiTiepTheo}>
                ⏭️
              </button>
            </div>
            <div className="music-progress" onClick={handleProgressClick}>
              <div
                className="music-progress-bar"
                style={{ width: `${tienDoNhac}%` }}
              ></div>
            </div>
            <div id="youtube-player" style={{ display: "none" }}></div>
          </div>
        )}
      </div>

      <div className="floating-widget bottom-right">
        {!hienDemNguoc && (
          <div className="countdown-widget">
            <button
              className="toggle-btn"
              onClick={() => setHienDemNguoc(true)}
            >
              ⏲️
            </button>
            <div className="countdown-input">
              <input
                type="number"
                value={thoiGianTuyChinh.gio}
                onChange={(e) =>
                  setThoiGianTuyChinh({
                    ...thoiGianTuyChinh,
                    gio: e.target.value,
                  })
                }
                placeholder="Giờ"
                className="custom-time-input"
                min="0"
              />
              <button className="start-btn" onClick={batDauDemNguocTuyChinh}>
                Bắt đầu
              </button>
            </div>
          </div>
        )}
        {hienDemNguoc && (
          <div className="countdown-widget">
            <button
              className="close-btn"
              onClick={() => setHienDemNguoc(false)}
            >
              ×
            </button>
            <h3 className="countdown-title">Countdown Timer</h3>
            <div className="countdown-display">
              <h3>{dinhDangThoiGian(thoiGianDemNguoc)}</h3>
            </div>
            <div className="countdown-labels">
              <span>hours</span>
              <span>minutes</span>
              <span>seconds</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
