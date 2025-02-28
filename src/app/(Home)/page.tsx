import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';

const Home: React.FC = async () => {
    const session = await getServerSession(authOptions);
    if (session) {
        // redirect("/")
        return <div/>
    } else {
      redirect("/login") 
    }
}

export default Home;