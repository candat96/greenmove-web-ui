import { MainLogo } from "@/assets/img";
import Image from "next/image";

const LoadingScreen: React.FC = () => (
    <main style={{ width: '100vw', height: '100vh', display: 'flex', backgroundColor : "white" }}>
        <Image
            src={MainLogo}
            alt="Main Logo"
            style={{ margin: 'auto' }}
            priority
        />
    </main>
)

export default LoadingScreen