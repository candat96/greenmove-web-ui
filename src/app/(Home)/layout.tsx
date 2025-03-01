'use client'

import { LogoWhite } from "@/assets/img";
import styles from "./home.module.scss"
import Image from "next/image";
import { Avatar, Button, Space } from "antd";
import { PoweroffOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LoadingScreen } from "@/components";

const HomeLayout: React.FC = ({ children }: React.PropsWithChildren) => {

    const { data: session, status } = useSession();

    const router = useRouter()

    // Auto signOut when maxAge below 0
    // useEffect(() => {
    //     session && session?.maxAge <= 0 && signOut()
    // }, [update])

    const handleGet = async () => {
        try {
            const res = await fetch("https://graph.microsoft.com/v1.0/me", {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.accessToken}`,
                }
            })
            // console.log(await res.json())
            const payload = await res.json()
            console.log(payload)
        } catch (e) {

        }
    }

    if (status == "loading") {
        return <LoadingScreen />
    }

    if (true) {
        return (
            <main style={{ background: "rgba(249, 252, 255, 1)" }}>
                <header className={styles.header}>
                    <Image
                        src={LogoWhite}
                        alt="Logo White"
                        priority
                    />
                    <Space size={40}>
                        <ul className={styles.menu}>

                        </ul>
                        <Space className={styles.user} size={23}>
                            <Button
                                icon={<SettingOutlined style={{ fontSize: 20 }} />}
                                type="link"
                                className={styles.configBtn}
                                onClick={handleGet}
                            />
                            <Button
                                icon={<PoweroffOutlined style={{ fontSize: 20 }} />}
                                type="link"
                                className={styles.logoutBtn}
                                onClick={() => signOut()}
                            />
                            <Space>
                                <Avatar size={42} icon={<UserOutlined />} />
                                <span>{session?.user?.name}</span>
                            </Space>
                        </Space>
                    </Space>
                </header>
                {children}
            </main>
        )
    } else {
        router.push('/login')
    }
}

export default HomeLayout;