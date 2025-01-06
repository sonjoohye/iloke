import React, {useEffect} from 'react';

const KakaoCallback = () => {
    useEffect( () =>{
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if(code) {
            console.log("인가코드:",code);
        }
    }, []);
    return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoCallback
