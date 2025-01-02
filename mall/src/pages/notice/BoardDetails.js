import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { deleteBoardAnswer, insertBoardContent, insertBoardAnswer, selectImageLoad } from '../../services/api';

import styles from './BoardDetails.module.css';

const backendBaseURL = process.env.REACT_APP_BACK_URL;

const BoardDetails = () => {
  const location = useLocation();
  const { id, title, contents, comment, code, previousPage, reg_id } = location.state || {};

  const [content, setContent] = useState(contents || '');
  const [answerValue, setAnswerValue] = useState(comment || '');
  const [imageSrc, setImageSrc] = useState(null);

  const userId = sessionStorage.getItem('userId');

  useEffect(() => {     
    // console.log(reg_id);
    if (code !== 'rv') {
      imageLoad();
    }
  }, []);

  function commentSubmit(event) {
    event.preventDefault();

    if(reg_id!=userId){
      alert("작성자만 수정할 수 있습니다.");
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력하세요!");
      return;
    }
    
    const frmData = {
        id: id,
        code: code,
        title: title,
        contents: content,
        userId: userId
    };

    // 수정도 포함된 API
    insertBoardContent(frmData)
    .then((res) => {
        alert("내용이 수정되었습니다.");
        // setFile(null);  // 파일 상태 초기화
    })
    .catch((error) => {
        console.error("Error uploading file:", error);
        alert("내용 수정 실패!");
    });
  }

  function delBoard() {
    if(reg_id!=userId){
      alert("작성자만 삭제할 수 있습니다.");
      return;
    }
    // 삭제 전에 확인을 묻는 confirm 창을 띄움
    const isConfirmed = window.confirm('삭제하면 되돌릴 수 없습니다. 삭제하시겠습니까?');
  
    if (isConfirmed) {
      // 사용자가 삭제를 확인한 경우
      deleteBoardAnswer(id)
        .then(() => {
          alert(`${id}번 게시판이 삭제 되었습니다.`);
          window.location.href = previousPage; // 삭제 후 이전 페이지로 돌아감
        })
        .catch((error) => {
          console.error("Error deleting the board:", error);
        });
    } else {
      // 사용자가 삭제를 취소한 경우
      console.log('삭제가 취소되었습니다.');
    }
  }

  function imageLoad() {

    selectImageLoad(id)
    .then((res) => {
      // console.log(Array.isArray(res.data));
      if (Array.isArray(res.data)) {
        const imageUrls = res.data.map(item => `${backendBaseURL}/image/${item.new_name}`);
        // console.log(imageUrls);
        setImageSrc(imageUrls); // 배열로 설정
      }
    })
    .catch((error) => {
      console.error('Error fetching image:', error);
    });
  }

  function handleInputChange(event) {
    setAnswerValue(event.target.value);
  }

  function handleContent(event) {
    setContent(event.target.value);
  }

  return (
    <div className={styles.board_detail}>
      <h3>{code == "rv" ? "전체후기" : (code == "pr" ? "포토후기" : (code == "pq" ? "상품문의" : (code == "fq"? "FAQ" : (code == "nt" ? "공지사항" : "1:1문의"))))}</h3>
      <p className={styles.content_head}>본문</p>
      
      {code === 'pq' || code === 'ui'|| code ==='pr' || code ==='rv' ? (
        <textarea style={{ width: '100%', height: '150px' }} className={styles.content_detail} value={content || ""} onChange={handleContent}/>
      ):(
        <textarea style={{ width: '100%', height: '150px' }} className={styles.content_detail} value={content || ""} onChange={handleContent} disabled/>
      )}
      {/* {imageSrc && <img src={imageSrc} alt="Uploaded" />} */}
      {Array.isArray(imageSrc) && imageSrc.length > 0 && (
        imageSrc.map((src, index) => (
          <img key={index} src={src} alt={`Uploaded ${index}`} className={styles.custom_image} />
        ))
      )}
      {code === 'pq' || code === 'ui'? (
        <>
          <p className={styles.content_head}>답변</p>
          <textarea
            style={{ width: '100%', height: '150px' }}
            name="contents"
            placeholder="답변 대기중..."
            value={answerValue}
            onChange={handleInputChange}
            disabled 
          />
        </>
      ) : null}
      <hr />
      {code === 'pq'|| code === 'ui'|| code ==='pr' || code ==='rv' ? (
        <button onClick={commentSubmit}>수정</button>
      ) : (
        <></>
      )}
      {code === 'pq' || code === 'ui'|| code ==='pr' || code ==='rv' ? (
        <button onClick={delBoard}>삭제</button>
      ) : (
        <></>
      )}
      <button onClick={() => window.location.href = previousPage}>목록으로</button>
    </div>
  );
};

export default BoardDetails;
