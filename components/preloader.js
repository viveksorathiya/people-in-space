import styles from '../styles/preloader.module.css'

export default function Loader() {
    return (
			<>
				<div className={styles.container}>
					<div className={styles.body}>
						<span>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
						</span>
						<div className={styles.base}>
							<span></span>
							<div className={styles.face}></div>
						</div>
					</div>
					<div className={styles.longfazers}>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
					</div>
					<h1 className={styles.h1}>Taking into space</h1>
				</div>
			</>
		);
}