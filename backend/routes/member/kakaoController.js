const express = require('express');
const router = express.Router();
const db = require('../../utils/dbUtil'); // 데이터베이스 연결

// 카카오 로그인 상태 업데이트
router.post('/', async (req, res) => {
  const { kakaoId } = req.body;

  try {
    console.log('kakao login 접근')
    if (!kakaoId) {
      return res.status(400).json({ success: false, message: '필수 데이터가 누락되었습니다.' });
    }

    const kakaoUserId = `kakao_${kakaoId}`;

    console.log('Received kakaoId:', kakaoUserId);

    // 사용자 확인 (ID 필드 기준)
    // const [existingUser] = await db.query('SELECT * FROM mem_info WHERE id = ?', [kakaoUserId]);
    // console.log('Existing user query result:', existingUser);

    // if (existingUser.length === 0) {
    //   return res.status(400).json({ success: false, message: '회원가입되지 않은 사용자입니다.' });
    // }

    // 로그인 상태 업데이트 (최근 접속 시간 갱신)
    const [result] = await db.query(
      'UPDATE mem_info SET last_date = NOW() WHERE id = ?',
      [kakaoUserId]
    );
    console.log('Update result:', result);

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