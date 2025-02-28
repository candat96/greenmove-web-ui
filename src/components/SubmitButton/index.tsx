import { Button } from "antd"
import styles from "./submitBtn.module.scss"

interface BtnTypes {
    handleClick: () => void;
    label: string;
    loading?: boolean;
}

const SubmitButton: React.FC<BtnTypes> = ({handleClick, label, loading }) => {
    return (
        <Button
            onClick={handleClick}
            type="primary"
            className={styles.submitBtn}
            loading={loading}
        >
            <div />{label}
        </Button>
    )
}

export default SubmitButton