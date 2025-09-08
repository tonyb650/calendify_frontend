import Navbar from "@/app/(protected)/_components/NavBar";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

const ProtectedLayout = async ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      {/* <Suspense fallback="Loading..."> */}
        {/* <AwaitedNavbar /> */}
        <Navbar/>
      {/* </Suspense> */}
      <main className="max-w-7xl mx-auto">{children}</main>
    </SessionProvider>
  );
}

export default ProtectedLayout
// const AwaitedNavbar = async () => {
//   const user = (await getCurrentUser()) || undefined;

//   return <Navbar user={user} />;
// };
