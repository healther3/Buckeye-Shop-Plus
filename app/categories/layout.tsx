import Nav from "../ui/category-nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center w-full min-h-screen pb-10">
      
      <div className="w-full mb-10">
        <Nav />
      </div>

      {children}
      
    </div>
  );
}