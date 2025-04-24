'use client'

import React, { useState } from 'react';
import Image from "next/image";
import { LoginDecorBlue, LoginDecorRed, MainLogo } from "@/assets/img";
import styles from "./login.module.scss";
import { SubmitButton } from '@/components';
import { signIn } from "next-auth/react";
import Loading from '@/components/Loading';
import { Form, Input, notification, Row } from 'antd';
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {

    const [form] = Form.useForm()
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)

    const handleLogin = async (data: { email: string; password: string; }) => {
        setLoading(true)
        const response = await signIn('credentials', {
            email: data.email,
            password: data.password,
            callbackUrl: '/',
            redirect: false,
        });
        if (response) {
            if (response.ok) {
                notification.success({ message: 'Success', duration: 0.5 });
                router.push('/dashboard');
            } else {
                notification.error({ message: 'Login failed !' });
                setLoading(false)
            }
        } else {
            notification.error({ message: 'Network error' });
            setLoading(false)
        }
    }

    // const handleLogin = () => {
    //     setLoading(true)
    //     signIn('azure-ad')
    // }

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

                        <Form form={form} layout="vertical" className={styles.form} onFinish={handleLogin} >
                            <Form.Item
                                name={'email'}
                                label={'Email'}
                                rules={[{ required: true }]}
                            >
                                <Input placeholder='Email' className={styles.emailInput} />
                            </Form.Item>
                            <Form.Item
                                name={'password'}
                                label={"Mot de passe"}
                                rules={[{ required: true }]}
                            >
                                <Input.Password placeholder="Mot de passe" className={styles.pwdInput} />
                            </Form.Item>
                        </Form>

                        <Row style={{ marginTop: 30 }}>
                            <SubmitButton handleClick={() => form.submit()} label={"Se Connecter"} />
                        </Row>

                        {/* <SubmitButton
                            handleClick={() => handleLogin()}
                            label={"Sign In with Microsoft"}
                        /> */}
                    </Loading>
                </main>
            </section>

        </section>
    )
}

export default Login