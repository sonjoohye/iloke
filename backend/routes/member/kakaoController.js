const express = require('express');
const router = express.Router();
const db = require('../../utils/dbUtil'); // 데이터베이스 연결

// 카카오 회원가입
router.post('/register/kakao', async (req, res) => {
  const { kakaoId, email, nickname } = req.body;
  console.log('받은 데이터:', req.body);

  if (!kakaoId || !nickname) {
    return res.status(400).json({ success: false, message: '필수 데이터가 누락되었습니다.' });
  }

  try {
    // 중복 가입 확인
    const existingUser = await db.query('SELECT * FROM mem_info WHERE id = ? OR email = ?', [`kakao_${kakaoId}`, email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: '이미 가입된 사용자입니다.' });
    }

    // 신규 회원 등록
    const result = await db.query(
      'INSERT INTO mem_info (id, email, nick, role, type, level, join_date, reg_id) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)',
      [`kakao_${kakaoId}`, email || null, nickname, '회원', '일반', '브론즈', 'system']
    );

    if (result.affectedRows > 0) {
      res.json({ success: true, message: '회원가입이 완료되었습니다.' });
    } else {
      res.status(500).json({ success: false, message: '회원가입에 실패했습니다.' });
    }
  } catch (error) {
    console.error('회원가입 처리 중 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// 카카오 로그인 상태 업데이트
router.post('/login/kakao', async (req, res) => {
  const { kakaoId } = req.body;

  try {
    // 사용자 확인
    const existingUser = await db.query('SELECT * FROM mem_info WHERE id = ?', [`kakao_${kakaoId}`]);

    if (existingUser.length === 0) {
      return res.status(400).json({ success: false, message: '회원가입되지 않은 사용자입니다.' });
    }

    // 로그인 상태 업데이트 (최근 접속 시간 갱신)
    const result = await db.query(
      'UPDATE mem_info SET last_date = NOW() WHERE id = ?',
      [`kakao_${kakaoId}`]
    );

    if (result.affectedRows > 0) {
      res.json({ success: true, message: '로그인 상태가 업데이트되었습니다.' });
    } else {
      res.status(500).json({ success: false, message: '로그인 상태 업데이트에 실패했습니다.' });
    }
  } catch (error) {
    console.error('로그인 상태 업데이트 중 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
