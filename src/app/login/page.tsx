'use client'

import React, { useState } from 'react';
import Image from "next/image";
import { LoginDecorBlue, LoginDecorRed, MainLogo } from "@/assets/img";
import styles from "./login.module.scss";
import { SubmitButton } from '@/components';
import { signIn } from "next-auth/react";
import Loading from '@/components/Loading';

const Login: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false)

    const handleLogin = () => {
        setLoading(true)
        signIn('azure-ad')
    }

    return (
        <section className={styles.section}>

            <Image
                className={styles.decorBlue}
                src={LoginDecorBlue}
                alt="Decor Blue"
                priority
            />
            <Image
                className={styles.decorRed}
                src={LoginDecorRed}
                alt="Decor Red"
                priority
            />

            <div className={styles.name}>
                <h1>Rapport</h1>
                <h1 style={{ fontWeight: 300 }}>VINCI</h1>
                <h1>Greenmove</h1>
            </div>

            <section style={{ width: '50%', display: 'flex' }}>
                <main className={styles.main}>
                    <Loading loading={loading}>
                        <Image
                            src={MainLogo}
                            alt="Main Logo"
                            priority
                        />
                        <SubmitButton
                            handleClick={() => handleLogin()}
                            label={"Sign In with Microsoft"}
                        />
                    </Loading>
                </main>
            </section>

        </section>
    )
}

export default Login