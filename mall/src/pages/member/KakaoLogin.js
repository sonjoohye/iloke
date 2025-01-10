import React, { useEffect } from 'react';
import styles from './login.module.scss';

const KakaoLogin = () => {
  const REST_API_KEY = "4c0a1fd995d48357daf4967bf25d50cb";
  const REDIRECT_URI = "http://localhost:5500/KakaoLogin";

  console.log("REST_API_KEY:", REST_API_KEY);
  console.log("REDIRECT_URI:", REDIRECT_URI);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');

    if (authCode) {
      console.log('인증 코드:', authCode);
      getAccessToken(authCode);
    } else {
      console.error('인증 코드가 없습니다.');
    }
  }, []);

  const getAccessToken = async (authCode) => {
    const tokenUrl = "https://kauth.kakao.com/oauth/token";
    const data = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: REST_API_KEY,
      redirect_uri: REDIRECT_URI,
      code: authCode,
    });

    console.log("토큰 요청 데이터:", {
      grant_type: "authorization_code",
      client_id: REST_API_KEY,
      redirect_uri: REDIRECT_URI,
      code: authCode,
    });

    try {
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: data,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("액세스 토큰:", result.access_token);
        getUserInfo(result.access_token);
      } else {
        console.error("토큰 요청 실패:", response.statusText);
        const errorResponse = await response.json();
        console.error("오류 응답:", errorResponse);
      }
    } catch (error) {
      console.error("토큰 요청 중 오류 발생:", error);
    }
  };

  const getUserInfo = async (accessToken) => {
    try {
      const response = await fetch("https://kapi.kakao.com/v2/user/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const userInfo = await response.json();
        console.log("사용자 정보:", userInfo);
        saveLoginStatus(userInfo);
      } else {
        console.error("사용자 정보 요청 실패:", response.statusText);
      }
    } catch (error) {
      console.error("사용자 정보 요청 중 오류 발생:", error);
    }
  };

  const saveLoginStatus = async (userInfo) => {
    const payload = {
      kakaoId: userInfo.id,
      email: userInfo.kakao_account?.email || null,
      nickname: userInfo.properties?.nickname || 'unknown',
    };

    console.log("백엔드로 전송될 데이터:", payload);

    const response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/login/kakao`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("테스트:", response.ok);


    if (response.ok) {
      const result = await response.json();
      console.log("로그인 상태 업데이트 성공:", result);
    } else {
      const errorText = await response.text();
      console.error("로그인 상태 업데이트 실패:", response.statusText, errorText);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1>카카오 로그인 처리 중...</h1>
    </div>
  );
};

export default KakaoLogin;
