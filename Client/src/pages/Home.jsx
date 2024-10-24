import bgImage from "../../public/bg.webp";

export default function Home() {
  return (
    <div
      className="flex flex-col justify-center items-center w-screen h-[100vh] text-white"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 className="text-5xl italic mb-4 text-black font-extrabold">
        Track Your Expenses Easily
      </h1>
      <p className="text-lg  font-semibold text-center max-w-2xl text-black ">
        Managing your finances has never been easier. With our simple and
        intuitive expense tracker, you can monitor your spending, set budgets,
        and gain control over your financial future. Start organizing your
        expenses today and achieve your financial goals with confidence!
      </p>
    </div>
  );
}
