import React, { useState } from 'react';
import axios from 'axios';

async function registerKakaoUser(kakaoId, email, nickname) {
  const url = 'http://localhost:5000/register/kakao'; // 백엔드 주소
  const data = { kakaoId, email, nickname }; // 보낼 데이터

  try {
    const response = await axios.post(url, data); // 요청 보내기
    alert(response.data.message); // 서버에서 온 메시지 보여주기
  } catch (error) {
    console.error('회원가입 에러:', error); // 에러 로그
    alert('문제가 생겼어요.');
  }
}

async function loginKakaoUser(kakaoId) {
  const url = 'http://localhost:5000/login/kakao'; // 백엔드 주소
  const data = { kakaoId }; // 보낼 데이터

  try {
    const response = await axios.post(url, data); // 요청 보내기
    alert(response.data.message); // 서버에서 온 메시지 보여주기
  } catch (error) {
    console.error('로그인 에러:', error); // 에러 로그
    alert('문제가 생겼어요.');
  }
}

function KakaoAuth() {
  const [kakaoId, setKakaoId] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');

  return (
    <div>
      <h1>카카오 인증</h1>
      <input
        type="text"
        placeholder="카카오 ID"
        value={kakaoId}
        onChange={(e) => setKakaoId(e.target.value)}
      />
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="닉네임"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <button onClick={() => registerKakaoUser(kakaoId, email, nickname)}>회원가입</button>
      <button onClick={() => loginKakaoUser(kakaoId)}>로그인</button>
    </div>
  );
}

export default KakaoAuth;
