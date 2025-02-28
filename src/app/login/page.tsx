'use client'

import React, { useState } from 'react';
import { Form, Input, Row, notification } from "antd";
import Image from "next/image";
import { LoginDecorBlue, LoginDecorRed, MainLogo } from "@/assets/img";
import styles from "./login.module.scss";
import { SubmitButton } from '@/components';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';

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
                <h1>La Boîte à</h1>
                <h1 style={{ fontWeight: 300 }}>outils de</h1>
                <h1>{"l'applicateur"}</h1>
            </div>

            <section style={{ width: '50%', display: 'flex' }}>
                <main className={styles.main}>
                    <Loading loading={loading}>

                        <Row justify="center">
                            <Image
                                src={MainLogo}
                                alt="Main Logo"
                                style={{ margin: 'auto' }}
                                priority
                            />
                        </Row>

                        <Form form={form} layout="vertical" className={styles.form} onFinish={handleLogin} >

                            <Form.Item name={'email'} label={'Email'} rules={[{ required: true }]}>
                                <Input className={styles.emailInput} />
                            </Form.Item>

                            <Form.Item name={'password'} label={'Password'} rules={[{ required: true }]}>
                                <Input.Password className={styles.pwdInput} />
                            </Form.Item>

                        </Form>

                        {/* <Link href={""} className={styles.forgotPwd}>
                            <LockOutlined /> {t('Forgot password ?')}
                        </Link> */}

                        <Row style={{ marginTop: 30 }}>
                            <SubmitButton handleClick={() => form.submit()} label={"Sign In"} />
                        </Row>

                    </Loading>
                </main>
            </section>

        </section>
    )
}

export default Login