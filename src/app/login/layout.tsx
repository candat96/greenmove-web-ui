import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';

const LoginLayout: React.FC = async ({ children }: React.PropsWithChildren) => {
    const session = await getServerSession(authOptions);
    if (session) {
        redirect("/dashboard")
    } else {
        return children
    }
}

export default LoginLayout;