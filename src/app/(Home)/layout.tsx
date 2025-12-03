'use client'

import { LogoWhite } from "@/assets/img";
import styles from "./home.module.scss"
import Image from "next/image";
import { Avatar, Button, Popover, Modal, Form, Input, message } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LoadingScreen } from "@/components";
import { navigateMenu } from "@/lib/data";
import Link from "next/link";
import { PoweroffOutlined, LockOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { changePassword } from "@/services/auth";

const HomeLayout: React.FC = ({ children }: React.PropsWithChildren) => {
    const { data: session, status } = useSession();
    const router = useRouter()
    const pathname = usePathname()
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [form] = Form.useForm()

    useEffect(() => {
        if (session) {
            const { accessToken, refreshToken } = session.user;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
        }
    }, [session])
    

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
                            <div className={styles.popoverContent}>
                                <Button
                                    icon={<LockOutlined style={{ fontSize: 18 }} />}
                                    type="link"
                                    className={styles.changePasswordBtn}
                                    onClick={() => setIsPasswordModalOpen(true)}
                                >
                                    Changer le mot de passe
                                </Button>
                                <Button
                                    icon={<PoweroffOutlined style={{ fontSize: 18 }} />}
                                    type="link"
                                    className={styles.logoutBtn}
                                    onClick={handleLogout}
                                >
                                    Se déconnecter
                                </Button>
                            </div>
                        )}
                        placement="bottomRight"
                        trigger="click"
                    >
                        <Avatar
                            style={{ backgroundColor: '#234B8E', cursor: 'pointer' }}
                            size={38}
                        >
                            {session.user?.email?.split(" ").pop()[0]}
                        </Avatar>
                    </Popover>

                    <Modal
                        title="Changer le mot de passe"
                        open={isPasswordModalOpen}
                        onCancel={handleClosePasswordModal}
                        footer={null}
                        destroyOnClose
                        className={styles.passwordModal}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleChangePassword}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Mot de passe actuel"
                                name="currentPassword"
                                rules={[
                                    { required: true, message: 'Veuillez entrer votre mot de passe actuel !' }
                                ]}
                            >
                                <Input.Password 
                                    placeholder="Entrez le mot de passe actuel"
                                    prefix={<LockOutlined />}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Nouveau mot de passe"
                                name="newPassword"
                                rules={[
                                    { required: true, message: 'Veuillez entrer un nouveau mot de passe !' },
                                    { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères !' }
                                ]}
                            >
                                <Input.Password 
                                    placeholder="Entrez le nouveau mot de passe"
                                    prefix={<LockOutlined />}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Confirmer le nouveau mot de passe"
                                name="confirmPassword"
                                dependencies={['newPassword']}
                                rules={[
                                    { required: true, message: 'Veuillez confirmer le nouveau mot de passe !' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Les mots de passe ne correspondent pas !'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password 
                                    placeholder="Confirmez le nouveau mot de passe"
                                    prefix={<LockOutlined />}
                                />
                            </Form.Item>

                            <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                                <div className={styles.modalFooter}>
                                    <Button onClick={handleClosePasswordModal}>
                                        Annuler
                                    </Button>
                                    <Button 
                                        type="primary" 
                                        htmlType="submit"
                                        loading={isChangingPassword}
                                    >
                                        Confirmer
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </Modal>
                </header>
                {children}
            </main>
        )
    } else {
        router.push('/login');
    }

    function handleLogout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        void signOut();
    }

    function handleClosePasswordModal() {
        setIsPasswordModalOpen(false);
        form.resetFields();
    }

    async function handleChangePassword(values: { currentPassword: string; newPassword: string }) {
        setIsChangingPassword(true);
        try {
            await changePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword
            });
            message.success('Mot de passe modifié avec succès !');
            handleClosePasswordModal();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Échec du changement de mot de passe. Veuillez réessayer !';
            message.error(errorMessage);
        } finally {
            setIsChangingPassword(false);
        }
    }
}

export default HomeLayout;