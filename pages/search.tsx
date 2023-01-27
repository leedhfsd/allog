export default function Search() {
  return (
    <div className="flex justify-center">
      <div className="mt-16 flex border border-black h-16 w-4/6">
        <form className="flex w-full text-center">
          <button className="mx-4" type="submit">
            <svg width="24" height="36" viewBox="0 0 24 24">
              <path d="M23.707,22.293l-5.969-5.969a10.016,10.016,0,1,0-1.414,1.414l5.969,5.969a1,1,0,0,0,1.414-1.414ZM10,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,10,18Z" />
            </svg>
          </button>
          <input
            className="focus:outline-none w-5/6 text-sm md:text-xl"
            placeholder="찾고싶은 작성자의 id나 태그를 입력하세요..."
          />
        </form>
      </div>
    </div>
  );
}
