(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[603],{8266:function(e,s,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/search",function(){return t(3109)}])},3109:function(e,s,t){"use strict";t.r(s),t.d(s,{default:function(){return x}});var l=t(5893),a=t(9008),n=t.n(a),c=t(1664),i=t.n(c),r=t(7294);function x(){let[e,s]=(0,r.useState)([]),[t,a]=(0,r.useState)(""),[c,x]=(0,r.useState)(!1),d=async e=>{if(x(!0),!t.length)return;e.preventDefault();let l=await fetch("/api/article?all=".concat(t)),a=await l.json();s(a)};return(0,l.jsxs)("div",{className:"flex flex-col items-center",children:[(0,l.jsxs)(n(),{children:[(0,l.jsx)("title",{children:"검색 | Allog"}),(0,l.jsx)("meta",{name:"description",content:"Allog의 회원님들이 작성한 글을 검색할 수 있는 페이지입니다."}),(0,l.jsx)("meta",{name:"keywords",content:"BLOG, 블로그, Allog, 태그검색, 검색"})]}),(0,l.jsx)("section",{className:"w-3/4 lg:w-[768px] mb-8",children:(0,l.jsx)("div",{className:"mt-16 flex border border-black h-16",children:(0,l.jsxs)("div",{className:"flex w-full text-center",children:[(0,l.jsx)("button",{className:"mx-4",type:"button",onClick:d,children:(0,l.jsx)("svg",{width:"24",height:"36",viewBox:"0 0 24 24",children:(0,l.jsx)("path",{d:"M23.707,22.293l-5.969-5.969a10.016,10.016,0,1,0-1.414,1.414l5.969,5.969a1,1,0,0,0,1.414-1.414ZM10,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,10,18Z"})})}),(0,l.jsx)("input",{type:"hidden"}),(0,l.jsx)("input",{className:"focus:outline-none w-5/6 md:text-xl",placeholder:"검색어를 입력해주세요",onChange:e=>{a(e.target.value)}})]})})}),(0,l.jsxs)("section",{className:"",children:[c&&(0,l.jsxs)("div",{className:"text-gray-600",children:["총",(0,l.jsxs)("span",{className:"font-bold mx-1",children:[e.length?e.length:0,"개"]}),"의 작성글을 찾았습니다."]}),Array.isArray(e)&&e.map(e=>(0,l.jsxs)("div",{className:"my-8 w-[300px] sm:w-[400px] md:w-[768px]",children:[(0,l.jsxs)("div",{className:"flex flex-row items-center mb-8",children:[(0,l.jsx)("img",{className:"rounded-full bg-white h-12 w-12 bg-cover mr-1 inline",alt:"profile",src:e.profile}),(0,l.jsx)("span",{className:"mx-2 text-sm font-bold",children:e.writer})]}),(0,l.jsxs)(i(),{href:"/article/@".concat(e.writer,"/").concat(e._id,"/").concat(e.slug),children:[e.thumbnailImage?(0,l.jsx)("div",{className:"",children:(0,l.jsx)("img",{alt:"thumbnail",className:"rounded-md inline-block w-full h-full object-center object-cover",src:e.thumbnailImage})}):(0,l.jsx)("div",{}),(0,l.jsx)("h1",{className:"text-2xl font-bold my-4 truncate",children:e.title}),(0,l.jsx)("p",{className:"text-base mb-8 line_clamp whitespace-pre-wrap",children:e.plainText})]}),(0,l.jsx)("div",{children:e.hashtag.map(e=>(0,l.jsx)("a",{href:"/hashtag/".concat(e),className:"text-sky-500 px-1 mx-2 my-4 cursor-pointer inline-block text-base",children:e},e))}),(0,l.jsxs)("div",{className:"flex flex-row truncate text-sm text-gray-400",children:[(0,l.jsx)("div",{className:"",children:e.createdAt}),(0,l.jsx)("span",{className:"px-2",children:"\xb7"}),(0,l.jsxs)("div",{children:["❤ ",e.liked]})]})]},e._id))]})]})}},9008:function(e,s,t){e.exports=t(3121)}},function(e){e.O(0,[774,888,179],function(){return e(e.s=8266)}),_N_E=e.O()}]);