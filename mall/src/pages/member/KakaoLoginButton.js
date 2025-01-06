import React from 'react';

const KakaoLoginButton = () => {
    const REST_API_KEY = "4c0a1fd995d48357daf4967bf25d50cb"; // 카카오에서 발급받은 REST API 키
  const REDIRECT_URI = "https://localhost:5005/oauth"; // 설정한 Redirect URI

  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

  const handleLogin = () => {
    window.location.href = kakaoAuthUrl; // 카카오 로그인 페이지로 이동
  };
  return (
    <button onClick={handleLogin}>
      카카오로 로그인
    </button>
  );
};

export default KakaoLoginButton
