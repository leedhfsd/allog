## 프로젝트명 
프로젝트명은 Allog입니다.  https://allog.vercel.app/ 에서 배포중입니다.

## 기술 스택
![Typescript](https://img.shields.io/badge/-Typescript-007acc?style=for-the-badge&logo=typescript&logoColor=ffffff)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Next.js&logoColor=white)
<img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=for-the-badge&logo=Tailwind CSS&logoColor=white"/>
<img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white"/>


## 개발 도구의 선정 이유
해당 프로젝트는 데이터베이스는 [MongoDB](https://github.com/mongodb/mongo)를, 백엔드와 프론트엔드 개발은 Typescript 기반의 [Next.js](https://github.com/vercel/next.js)를 사용하였습니다.  
또한 [eslint](https://github.com/eslint/eslint)와 [prettier](https://github.com/prettier/prettier)를 사용하여 코드 가독성을 높이고 일관성 있는 코드를 작성하고자 노력하였습니다.    

데이터베이스로 [MongoDB](https://github.com/mongodb/mongo)를 선택한 이유는 블로그 시스템의 설계부터 구현까지 혼자 진행하면서 데이터 모델의 변경이 자주 발생할 것으로 생각되어 필드를 추가하거나 제거하는 것이 다른 데이터베이스에 비해 [MongoDB](https://github.com/mongodb/mongo)를 이용하는 것이 간단하다고 생각하였기 때문입니다.  

[Next.js](https://github.com/vercel/next.js)를 선택한 이유는 백엔드와 프론트엔드 개발을 동시에 진행할 수 있으며 간편한 페이지 라우팅과 [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss)를 비롯한 개발 환경 구축을 하는 것이 간편하다고 생각했습니다.  

## 구현 내용
* ### 로그인 시스템과 회원가입
로그인 시스템은 [next-auth](https://github.com/nextauthjs/next-auth)를 이용하여 구현하였습니다.  

[next-auth](https://github.com/nextauthjs/next-auth)는 [Next.js](https://github.com/vercel/next.js) 애플리케이션을 위한 오픈 소스 인증 솔루션으로 다양한 OAuth Provider를 제공하고 데이터베이스를 이용한 이메일-패스워드 로그인을 구현하는 것 역시 간편하게 인증 시스템을 구현할 수 있는 장점이 있습니다.  

회원가입은 이메일-패스워드 로그인을 사용하고자 원하는 경우 [nodemailer](https://github.com/nodemailer/nodemailer)를 통해 서버에서 사용자가 입력한 메일 주소로 6자리의 인증번호를 입력하는 메일을 전송하고 이를 클라이언트에서 검증하는 이메일 인증 방식을 사용하여 구현하였습니다.  

사용자의 비밀번호는 salt와 해시 함수를 이용하여 암호화되어 데이터베이스에 저장됩니다.  
* ### 마크다운 문법 지원  
개발자들에게 친숙한 마크다운 문법을 지원합니다.  
마크다운은 [marked.js](https://github.com/markedjs/marked)와 코드 블록을 위한 [PrismJS](https://github.com/PrismJS/prism)를 이용하여 구현하였습니다.  
또한 마크다운의 CSS는 깃허브의 스타일의 [github-markdown-css](https://github.com/sindresorhus/github-markdown-css)를 사용하였습니다.
* ### '좋아요'와 댓글 그리고 비공개 설정
사용자가 마음에 드는 작성 글이나 다른 사용자들의 목록들을 저장할 수 있는 '좋아요' 기능과 다른 사용자와 상호작용을 할 수 있는 댓글 기능을 구현하였습니다.  
공개 설정한 작성 글들은 메인 페이지에 공개되는 사이트 특성상 이를 원치 않은 경우 사용할 수 있는, 비공개 글로 전환할 수 있는 기능을 구현하였습니다.  
* ### 사용자 정보 관리
프로필 이미지, 사용자 이름과 자신을 표현할 수 있는 한 줄 메시지를 도입하여 사용자들이 자신의 정보를 수정할 수 있도록 구현하였습니다.  
또한 더 이상 Allog의 시스템을 사용하는 것을 원치 않은 경우 회원 탈퇴를 통해 사용자의 데이터를 데이터베이스에서 즉시 삭제하도록 하였습니다.  
* ### 검색 기능
제목과 해시태그 사용자 아이디를 이용하여 작성 글들을 검색할 수 있습니다. 비공개 설정을 한 작성 글은 해당 쿼리에 포함되지 않습니다.  

## 개발하며 고려한 부분 
* ### 백엔드  
백엔드 개발에서는 HTTP 메서드를 이용해 자원에 대한 CRUD 작업을 진행하여 클라이언트와 서버 간 상호작용이 간결하고 명확한 REST 방법론을 채택하였습니다. RESTful한 API를 작성하고자 노력하여 API의 재사용성과 확장성을 높이고자 하였습니다.  
* ### 프론트엔드  
이전의 프로젝트들을 진행하면서 사용자를 위한 인터페이스를 설계하는 것이 매우 중요하고 쉽지 않은 부분이라는 것을 깨달아, 프로젝트의 주제를 다루는 실제 서비스 중인 웹이나 앱을 직접 사용해보면서 좋았던 부분들을 기록하여 사용자 인터페이스에 녹여내고자 노력하였습니다.
특히 모바일 기기의 사용이 매우 늘어난 지금 반응형 웹 디자인에 꼼꼼하게 신경을 써 뛰어난 사용자 경험을 제공하고자 노력하였습니다. 

## 스크린샷
* ### 웹
[웹1](https://github.com/leedhfsd/allog/assets/89757700/fd99eecd-827b-4a57-8de8-d832e1b8d225){:target="_blank"}   
[웹2](https://github.com/leedhfsd/allog/assets/89757700/435aca48-83f3-4f55-8d54-3de2e5e95f88){:target="_blank"}    
[웹3](https://github.com/leedhfsd/allog/assets/89757700/ddab7d65-6156-4a5a-a195-d08c866d5f06){:target="_blank"}   

* ### 모바일
[모바일1](https://github.com/leedhfsd/allog/assets/89757700/d611d00a-629e-4668-9d76-3d1437744e2e){:target="_blank"}   
[모바일2](https://github.com/leedhfsd/allog/assets/89757700/2aca2573-4f62-440c-9e10-c58da59a02fb){:target="_blank"}   
[모바일3](https://github.com/leedhfsd/allog/assets/89757700/8874f3bc-b083-4674-ba97-d54598ad7c3b){:target="_blank"}    

## 사용
https://allog.vercel.app/ 
현재 vercel을 이용하여 배포 중에 있습니다.  
로컬 환경에서 테스트를 원하는 경우 환경변수를 작성해야 합니다.  

**GITHUB_ID**=자신의 Github OAuth Client ID  
**GITHUB_SECRET**=자신의 Github OAuth Client secrets  
**GOOGLE_ID**=자신의 Google OAuth Client ID  
**GOOGLE_SECRET**=자신의 Google OAuth Client secrets  
**MONGODB_URI**=자신의 Mongodb Atlas 주소  
**BASE_URL**=http://localhost:3000    
**EMAIL_SERVER_USER**=자신이 사용할 이메일 서버의 유저 ID  
**EMAIL_SERVER_PASSWORD**=자신이 사용할 이메일 서버의 비밀번호  
**EMAIL_SERVER_HOST**=자신이 사용할 이메일 서버의 호스트 주소  
**EMAIL_SERVER_PORT**=자신이 사용할 이메일 서버의 포트번호  
**NEXT_PUBLIC_NEXTAUTH_SECRET**=next-auth의 인증에 사용할 secret으로 아무 문자열  
**CLOUDINARY_API_KEY**=Cloudinary 서비스의 개인 API KEY  
**CLOUDINARY_API_SECRET**=Cloudinary 서비스의 개인 API secrets  
**NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESETS**=Cloudinary 서비스의 Upload preset 이름  

* 실행
```bash
npm run dev
# or
yarn dev
```
웹 브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속 후 테스트를 진행하시면 됩니다.
