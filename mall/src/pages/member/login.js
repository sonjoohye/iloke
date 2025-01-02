import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { memLogin } from '../../services/api';
import styles from './login.module.scss';

const Login = () => {
  const [id, setPid] = useState('');
  const [pw, setPassword] = useState('');
  const [pname, setPname] = useState('');
  const [orderNo, setOrderNo] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await memLogin(id, pw);

      if (response.data.success) {
        const userName = response.data.user.name;

        // 세션 스토리지에 사용자 정보 저장
        sessionStorage.setItem('userId', id);
        sessionStorage.setItem('userName', userName);
        sessionStorage.setItem('auth', 'true');

        // storage 이벤트를 수동으로 발생시킴
        window.dispatchEvent(new Event('storage'));

        alert(`${userName}님, 환영합니다!`);

        navigate('/home'); // 홈 페이지로 이동

        //window.location.reload();

      } else {
        alert(response.data.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
       if (error.response) {
      // 403 상태 코드 처리
      if (error.response.status === 403) {
        alert('탈퇴한 회원입니다. 로그인할 수 없습니다.');
      } else if (error.response.status === 401) {
        alert('아이디 또는 비밀번호가 잘못되었습니다.');
      } else {
        alert('서버 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } else {
      alert('네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  }
};

  return (
    <section className={styles.loginSection}>
      <div className={styles.loginContainer}>
        <div className={styles.loginTitle}>회원 로그인</div>
        <form id="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            className={styles.inputLogin}
            id="pid"
            placeholder="아이디"
            required
            value={id}
            onChange={(e) => setPid(e.target.value)}
          />
          <input
            type="password"
            id="password"
            placeholder="비밀번호"
            required
            value={pw}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input type="submit" className={styles.btnLogin} value="로그인" />
        </form>

        <div className={styles.linkButtons}>
          <Link to="/joinMethod" className={`${styles.linkButton} ${styles.active}`}>
            회원가입
          </Link>
          <Link to="/findId" className={styles.linkButton}>
            아이디 찾기
          </Link>
          <Link to="/findPw" className={styles.linkButton}>
            비밀번호 찾기
          </Link>
        </div>

        <p id="result"></p>
        <hr />

        <div className={styles.snsLoginSection}>
          <div className={styles.snsLoginTitle}>SNS 간편 로그인</div>
          <button className={`${styles.snsButton} ${styles.payco}`}>PAYCO 아이디 로그인</button>
          <button className={`${styles.snsButton} ${styles.naver}`}>네이버 아이디 로그인</button>
          <button className={`${styles.snsButton} ${styles.kakao}`}>카카오 아이디 로그인</button>
        </div>

        <hr />
      {/*
        <div className="non-member-section">
          <div className="non-member-title">비회원 주문조회 하기</div>
          <input
            type="text"
            className="input-login"
            name="pname"
            placeholder="주문자명"
            required
            value={pname}
            onChange={(e) => setPname(e.target.value)}
          />
          <input
            type="text"
            className="input-login"
            name="orderNo"
            placeholder="주문번호"
            required
            value={orderNo}
            onChange={(e) => setOrderNo(e.target.value)}
          />
          <button type="button" className="btn-search" onClick={handleOrderSearch}>
            주문조회
          </button>
          <p className="non-member-info">
            주문번호와 비밀번호를 잊으신 경우 고객센터로 문의하여 주시기 바랍니다.
          </p>
        </div>
        */}
      </div>
    </section>
  );
};

export default Login;