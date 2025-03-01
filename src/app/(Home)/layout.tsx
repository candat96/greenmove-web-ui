'use client'

import { LogoWhite } from "@/assets/img";
import styles from "./home.module.scss"
import Image from "next/image";
import { Avatar, Button, Popover } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LoadingScreen } from "@/components";
import { navigateMenu } from "@/lib/data";
import Link from "next/link";
import { PoweroffOutlined } from "@ant-design/icons";

const HomeLayout: React.FC = ({ children }: React.PropsWithChildren) => {

    const { data: session, status } = useSession();

    const router = useRouter()
    const pathname = usePathname()

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
                                className={pathname === item.link ? styles.current_link : ""}
                            >
                                <Link href={item.link}>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <Popover
                        content={(
                            <Button
                                icon={<PoweroffOutlined style={{ fontSize: 20 }} />}
                                type="link"
                                className={styles.logoutBtn}
                                onClick={() => signOut()}
                            />
                        )}
                        placement="left"
                    >
                        <Avatar
                            style={{ backgroundColor: '#234B8E' }}
                            size={38}
                        >
                            {session.user?.name?.split(" ").pop()[0]}
                        </Avatar>
                    </Popover>
                </header>
                {children}
            </main>
        )
    } else {
        router.push('/login');
    }
}

export default HomeLayout;