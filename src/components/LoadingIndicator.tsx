import '../resources/style/spinner.css';
import styles from '../resources/style/LoadingIndicator.module.css';


export default function LoadingIndicator() {
    return (<div className={styles.loadingIndicatorWrapper}>
        <h2>loading typing test...</h2>
        <div className="lds-spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>);
}