const express = require('express');
const conn = require('../../utils/dbUtil');
const {singleFile} = require("../../utils/uploadUtil");  // 수정된 uploadFile 유틸

const router = express.Router();

    // 소스 로그 보는곳 이후 주석처리할것
router.use((req, res, next) => {
    // console.log(`///deps2: [${req.method}] ${req.url}`);
    // console.log(`${req.body}`);
    next();
});

router.get('/', async (req, res, next) => {
    // 쿼리 매개변수에서 값 가져오기
    const { code, title, reg_id } = req.query;
    const query = `SELECT 
                        b.id, b.code, b.title, b.contents, b.read_no, b.score, 
                        CASE 
                            WHEN a.comment is null THEN '답변필요' 
                            ELSE '답변완료' 
                        END AS comment_yn,
                        CASE 
                            WHEN b.delete_yn = 0 THEN '활성' 
                            WHEN b.delete_yn = 1 THEN '삭제' 
                        END AS delete_yn,
                        b.reg_id, DATE_FORMAT(b.reg_date, '%Y-%m-%d %H:%i:%s') AS reg_date,
                        b.upt_id, DATE_FORMAT(b.upt_date, '%Y-%m-%d %H:%i:%s') AS upt_date,
                        a.comment 
                    FROM board b
                    LEFT OUTER JOIN answer a ON a.id = b.id
                    WHERE b.code = ?
                    AND b.TITLE LIKE ?
                    AND b.REG_ID LIKE ?`;

    // const params = [code, startDate, endDate, title, reg_id];
    const params = [
        code,
        title ? `%${title}%` : '%', // title 라이크절
        reg_id ? `${reg_id}` : '%' // reg_id가 빈 문자열이면 모든 데이터 아니면 값 조회
    ];
    
    try {
        const [ret] = await conn.execute(query, params);
        res.json(ret);
    } catch (err) {
        console.error('SQL 실패: ', err.message);
        next(err); // 에러 미들웨어로 전달
    }
});

router.post('/', async (req, res, next) => {
    let { id, title, contents, code, userId } = req.body;
    // id 값이 null 일 경우 채번
    if(!id || id == "null" || id == "undefined" || id == ""){
        const query = `
            SELECT 
                CONCAT(
                    'bd',
                    DATE_FORMAT(NOW(), '%Y%m%d'),
                    LPAD(
                        IFNULL(
                            MAX(CAST(SUBSTRING(id, 11, 4) AS UNSIGNED)) + 1,
                            1
                        ), 
                        4, 
                        '0'
                    )
                ) AS new_id
            FROM board
            WHERE id LIKE CONCAT('bd', DATE_FORMAT(NOW(), '%Y%m%d'), '%')
        `;

        try {
            const [rows] = await conn.execute(query);

            // 채번한 값을 id에 할당
            id = rows[0]?.new_id;
        } catch (err) {
            console.error('SQL 실패:', err.message);
            next(err); // 에러 미들웨어로 전달
        }
    }

    const insertQuery = `INSERT INTO board (
                        id, code, title, contents, reg_id, reg_date, upt_id, upt_date
                    )
                    VALUES (
                        ?, ?, ?, ?, ?, NOW(), ?, NOW()
                    )
                    ON DUPLICATE KEY UPDATE
                        code = VALUES(code),
                        title = VALUES(title),
                        contents = VALUES(contents),
                        upt_id = VALUES(upt_id),
                        upt_date = VALUES(upt_date)`;

    const insertParams = [
        id,
        code,
        title,
        contents,
        userId,
        userId
    ];

    // console.log(insertParams);
    try {
        const [ret] = await conn.execute(insertQuery, insertParams);
        res.json(ret);
    } catch (err) {
        console.error('SQL 실패: ', err.message);
        next(err); // 에러 미들웨어로 전달
    }
});

router.post('/image', async (req, res, next) => {
    // 신규 id 생성
    let id = "";
    const query = `
        SELECT 
            CONCAT(
                'bd',
                DATE_FORMAT(NOW(), '%Y%m%d'),
                LPAD(
                    IFNULL(
                        MAX(CAST(SUBSTRING(id, 11, 4) AS UNSIGNED)) + 1,
                        1
                    ), 
                    4, 
                    '0'
                )
            ) AS new_id
        FROM board
        WHERE id LIKE CONCAT('bd', DATE_FORMAT(NOW(), '%Y%m%d'), '%')
    `;

    try {
        const [rows] = await conn.execute(query);
        id = rows[0]?.new_id; // 채번한 id 할당
    } catch (err) {
        console.error('SQL 실패:', err.message);
        return next(err); // 에러 미들웨어로 전달
    }

    // 파일 업로드 및 DB 저장 함수 호출 (singleFile)
    try {
        const result = await singleFile(req, res, id, 1, req.originalUrl, "", "1", "1"); // 파일 업로드 후 결과

        // 파일 업로드 및 DB 저장 처리
        const { title, contents, code, userId } = req.body;
        // console.log("req.body");
        // console.log(req.body);
        
        // 게시판 내용 저장 (DB)
        const insertQuery = `
            INSERT INTO board (id, code, title, contents, reg_id, reg_date, upt_id, upt_date)
            VALUES (?, ?, ?, ?, ?, NOW(), ?, NOW())
        `;
        const insertParams = [id, code, title, contents, userId, userId];

        // console.log(insertParams); // 게시판 데이터 출력

        const [ret] = await conn.execute(insertQuery, insertParams);
        res.json(ret); // 게시판 정보 반환
    } catch (error) {
        console.error('파일 업로드 오류:', error);
        res.status(500).send(error); // 파일 업로드 실패
    }
});

module.exports = router;
