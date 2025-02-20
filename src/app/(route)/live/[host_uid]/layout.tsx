import Header from "@/app/_components/Header/Header.server";
// import "./style.css"

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div id="container" className="">
            <Header/>
            {children}
        </div>
    );
  }
  