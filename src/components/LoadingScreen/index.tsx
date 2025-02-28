import { MainLogo } from "@/assets/img";
import Image from "next/image";

const LoadingScreen: React.FC = () => (
    <body style={{ width: '100vw', height: '100vh', display: 'flex' }}>
        <Image
            src={MainLogo}
            alt="Main Logo"
            style={{ margin: 'auto' }}
            priority
        />
    </body>
)

export default LoadingScreen