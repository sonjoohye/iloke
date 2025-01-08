import React, { useEffect } from 'react';
import axios from 'axios';

const KakaoCallback = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      console.log('인가코드:', code);
      getAccessToken(code);  // 인증 코드로 액세스 토큰 요청
    }
  }, []);

  // 액세스 토큰 요청
  const getAccessToken = async (code) => {
    try {
      const response = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        null,
        {
          params: {
            grant_type: 'authorization_code',
            client_id: 'YOUR_REST_API_KEY', // 카카오 REST API 키
            redirect_uri: 'YOUR_REDIRECT_URI', // 등록된 Redirect URI
            code: code, // 받은 인증 코드
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      console.log('액세스 토큰:', response.data); // 액세스 토큰 응답
      const { access_token } = response.data;

      // 액세스 토큰으로 사용자 정보 요청
      getUserInfo(access_token);
    } catch (error) {
      console.error('액세스 토큰 요청 실패:', error);
      alert('카카오 로그인에 실패했습니다.');
    }
  };

  // 사용자 정보 요청
  const getUserInfo = async (accessToken) => {
    try {
      const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,  // 액세스 토큰을 헤더에 추가
        },
      });

      console.log('사용자 정보:', response.data);  // 사용자 정보 확인
      // 여기서 사용자 정보를 세션에 저장하거나 상태를 업데이트할 수 있음
      const { id, properties, kakao_account } = response.data;
      console.log('사용자 ID:', id);
      console.log('사용자 닉네임:', properties.nickname);
      console.log('사용자 이메일:', kakao_account.email);  // 이메일이 있는 경우

      // 세션에 사용자 정보 저장
      sessionStorage.setItem('userId', id);
      sessionStorage.setItem('userName', properties.nickname);
      sessionStorage.setItem('userEmail', kakao_account.email);  // 이메일도 저장

      alert(`${properties.nickname}님, 카카오 로그인 성공!`);
    } catch (error) {
      console.error('사용자 정보 요청 실패:', error);
      alert('사용자 정보를 가져오는 데 실패했습니다.');
    }
  };

  return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoCallback;
