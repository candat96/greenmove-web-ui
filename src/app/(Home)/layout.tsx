'use client'

import { LogoWhite } from "@/assets/img";
import styles from "./home.module.scss"
import Image from "next/image";
import { Avatar } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LoadingScreen } from "@/components";
import { navigateMenu } from "@/lib/data";
import Link from "next/link";

const HomeLayout: React.FC = ({ children }: React.PropsWithChildren) => {

    const { data: session, status } = useSession();

    const router = useRouter()
    const pathname = usePathname()

    console.log(session)
    // Auto signOut when maxAge below 0
    // useEffect(() => {
    //     session && session?.maxAge <= 0 && signOut()
    // }, [update])

    if (status == "loading") {
        return <LoadingScreen />
    }

    if (session) {
        return (
            <main>
                <header className={styles.header}>
                    <Image
                        src={LogoWhite}
                        alt="Logo White"
                        priority
                    />
                    <ul className={styles.menu}>
                        {navigateMenu.map(item => (
                            <li
                                key={item.link}
                                className={pathname === item.link ? styles.current_link : styles.link}
                            >
                                <Link href={item.link}>
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <Avatar
                        style={{ backgroundColor: '#234B8E' }}
                        size={42}
                        onClick={() => signOut()}
                    >
                        Đ
                    </Avatar>
                </header>
                {children}
            </main>
        )
    } else {
        router.push('/login')
    }
}

export default HomeLayout;