import Image from "next/image";
import Logout from "@/components/Logout";

export default function Home() {
  return (
    <div>
      <Logout />
      <h1>Bookstore</h1>
      <Image src="/bookstore.jpg" alt="bookstore" width={500} height={500} />
    </div>
  );
}
