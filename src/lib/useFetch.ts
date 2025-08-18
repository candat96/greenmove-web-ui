import { notification } from "antd";
import { useSession, signOut } from "next-auth/react";

const useFetch = () => {

    const { data: session } = useSession();
    const baseURL: string = process.env.NEXT_PUBLIC_BASE_URI

    const commonGET = async (url: string, params: URLSearchParams) => {
        const res = await fetch(`${baseURL + url}?` + new URLSearchParams(params).toString(), {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.token}`,
            }
        })
        if (!res) {
            return notification.error({ message: "Network error" })
        } else {
            if (res.status === 401) {
                return signOut()
            } else {
                return res.json()
            }
        }
    }

    const commonPOST = async <T extends object>(url: string, payload: T) => {
        const res = await fetch(`${baseURL + url}`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.token}`,
            }
        })
        if (!res) {
            return notification.error({ message: "Network error" })
        } else {
            if (res.status === 401) {
                return signOut()
            } else {
                return res.json()
            }
        }
    }

    const commonPUT = async <T extends object>(url: string, payload: T) => {
        const res = await fetch(`${baseURL + url}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.token}`,
            }
        })
        if (!res) {
            return notification.error({ message: "Network error" })
        } else {
            if (res.status === 401) {
                return signOut()
            } else {
                return res.json()
            }
        }
    }

    const commonDELETE = async <T extends object>(url: string, payload?: T) => {
        const res = await fetch(`${baseURL + url}`, {
            method: 'DELETE',
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.token}`,
            }
        })
        if (!res) {
            return notification.error({ message: "Network error" })
        } else {
            if (res.status === 401) {
                return signOut()
            } else {
                return res.json()
            }
        }
    }

    return { commonGET, commonPOST, commonPUT, commonDELETE }
}

export default useFetch;