const express = require('express');
const router = express.Router();
const db = require('../../utils/dbUtil'); // 데이터베이스 연결

// 카카오 회원가입
router.post('/', async (req, res) => {
  const { kakaoId, email, nickname } = req.body;
  console.log('받은 데이터:', req.body);

  if (!kakaoId || !nickname) {
    return res.status(400).json({ success: false, message: '필수 데이터가 누락되었습니다.' });
  }

  try {
    const kakaoUserId = `kakao_${kakaoId}`;
    console.log('생성된 사용자 ID:', kakaoUserId);

    // 중복 가입 확인
    const existingUser = await db.query('SELECT * FROM mem_info WHERE id = ? OR email = ?', [kakaoUserId, email]);
    console.log('중복 사용자 조회 결과:', existingUser);

    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: '이미 가입된 사용자입니다.' });
    }

    // 신규 회원 등록
    const result = await db.query(
      'INSERT INTO mem_info (id, pw, email, nick, role, type, level, join_date, reg_id) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)',
      [kakaoUserId, 'kakao_default_pw', email || null, nickname, '회원', '일반', '브론즈', 'system']
    );
    console.log('회원가입 결과:', result);

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
module.exports = router;