import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { insertBoardContentImage, insertBoardContent } from '../../services/api';

import styles from './ItemWrite.module.css';

function ItemWrite(props) {
    const location = useLocation();
    const { code, previousPage } = location.state || {};
    const [file, setFile] = useState(null); // 업로드할 파일 상태
    const [title, setTitle] = useState(''); // title 상태
    const [contents, setContents] = useState(''); // contents 상태
    const userName = sessionStorage.getItem('userName');
    const userId = sessionStorage.getItem('userId');

    useEffect(() => {
        
    }, []);

    function commentSubmit(event) {
        event.preventDefault();
        
        if (!title.trim()) {
            alert("제목을 입력하세요!");
            return;
        }
        
        if (!contents.trim()) {
            alert("내용을 입력하세요!");
            return;
        }
        
        const frmDataTemp = new FormData(document.myFrm);
        frmDataTemp.append("code", code);
        frmDataTemp.append("userId", userId);
        const frmData = Object.fromEntries(frmDataTemp);
        
        insertBoardContent(frmData)
        .then((res) => {
            alert("내용이 등록되었습니다.");
            // setFile(null);  // 파일 상태 초기화
            window.location.href = previousPage;
        })
        .catch((error) => {
            console.error("Error uploading file:", error);
            alert("내용 수정 실패!");
        });
    }

    // 파일 선택 처리
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    // title 값 변경 처리
    const handleTitleChange = (e) => {
        setTitle(e.target.value); // title 상태 업데이트
    };

    // contents 값 변경 처리
    const handleContentsChange = (e) => {
        setContents(e.target.value); // contents 상태 업데이트
    };

    // 폼 제출 처리
    const submitGo = (e) => {
        e.preventDefault(); // 이벤트 끄기
        
        if (!title.trim()) {
            alert("제목을 입력하세요!");
            return;
        }
        
        if (!contents.trim()) {
            alert("내용을 입력하세요!");
            return;
        }
        
        if (!file) {
            commentSubmit();
            return;
        }

        const frmData = new FormData();
        frmData.append('upfile', file);  // 'upfile'이라는 key로 파일을 서버에 전송

        // 추가적인 데이터도 전송 (예: title, contents, code, userId 등)
        frmData.append('title', title); // 상태에서 title 값을 가져옴
        frmData.append('contents', contents); // 상태에서 contents 값을 가져옴
        frmData.append('code', code);
        frmData.append('userId', userId);

        for (let [key, value] of frmData.entries()) {
            console.log(key + ': ' + value);  // 전송할 데이터 콘솔에 출력
        }

        // 파일 업로드 API 호출
        insertBoardContentImage(frmData)
        .then((res) => {
            alert("파일 업로드 성공!");
            // setFile(null);  // 파일 상태 초기화
            window.location.href = previousPage;
        })
        .catch((error) => {
            console.error("Error uploading file:", error);
            alert("파일 업로드 실패!");
        });
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.filter_header}>
                <h2>글쓰기</h2>
                <span>{code == "rv" ? "전체후기" : (code == "pr" ? "포토후기" : (code == "pq" ? "상품문의" : (code == "fq"? "FAQ" : (code == "nt" ? "공지사항" : "1:1문의"))))}</span>
            </div>
            <form name='myFrm' onSubmit={submitGo}>
                <table border="" className={styles.write_table}>
                    <tbody>
                        <tr>
                            <th>작성자</th>
                            <td>{userName}</td>
                        </tr>
                        <tr>
                            <th>제목</th>
                            <td>
                                <label className={styles.title_label} htmlFor="name_title">
                                    <input 
                                        type="text" 
                                        placeholder="제목을 입력해주세요." 
                                        name="title" 
                                        value={title} // 상태 값 바인딩
                                        onChange={handleTitleChange} // 입력 변경 시 상태 업데이트
                                    />
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <th>본문</th>
                            <td>
                                <textarea 
                                    name="contents" 
                                    placeholder="내용" 
                                    className={styles.textfield}  
                                    style={{ width: '100%', height: '150px' }} 
                                    value={contents} // 상태 값 바인딩
                                    onChange={handleContentsChange} // 입력 변경 시 상태 업데이트
                                />
                            </td>
                        </tr>
                        {code === 'pr' ? (
                            <tr>
                                <th>첨부파일</th>
                                <td>
                                    <input className={styles.file_upload} type="file" name="upfile" onChange={handleFileChange} />
                                </td>
                            </tr>
                        ):( <></> )}
                    </tbody>
                </table>

                <div className={styles.btn_container}>
                    <button type="button" className={styles.btn_before} onClick={() => window.location.href = previousPage}>
                        <strong className={styles.itone}>목록으로</strong>
                    </button>
                    {code === 'pr' ? (
                        <input className={styles.btn_write} style={{margin:"5px"}} type="submit" value="저장" />
                    ):( <button className={styles.btn_write} onClick={commentSubmit}><strong className={styles.ittwo}>저장</strong></button> )}
                </div>
            </form>
        </div>
    );
}

export default ItemWrite;
