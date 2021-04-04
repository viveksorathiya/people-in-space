import { AnimatorGeneralProvider, Animator } from "@arwes/animation";
import { BleepsProvider } from "@arwes/sounds";
import {
	ArwesThemeProvider,
	StylesBaseline,
	Text,
	Card,
	Button,
} from "@arwes/core";
import { useState } from "react";
import styles from "../styles/dashboard.module.css";
import { Link } from "@material-ui/core";

const FONT_FAMILY_ROOT = '"Titillium Web", sans-serif';
const IMAGE_URL = "/assets/images/wallpaper.jpg";
const SOUND_OBJECT_URL = "/assets/sounds/object.mp3";
const SOUND_ASSEMBLE_URL = "/assets/sounds/assemble.mp3";
const SOUND_TYPE_URL = "/assets/sounds/type.mp3";
const SOUND_CLICK_URL = "/assets/sounds/click.mp3";

const globalStyles = { body: { fontFamily: FONT_FAMILY_ROOT } };
const animatorGeneral = { duration: { enter: 200, exit: 200, stagger: 30 } };
const audioSettings = { common: { volume: 0.5 } };
const playersSettings = {
	object: { src: [SOUND_OBJECT_URL] },
	assemble: { src: [SOUND_ASSEMBLE_URL], loop: true },
	type: { src: [SOUND_TYPE_URL], loop: true },
	click: { src: [SOUND_CLICK_URL] },
};
const bleepsSettings = {
	object: { player: "object" },
	assemble: { player: "assemble" },
	type: { player: "type" },
	click: { player: "click" },
};

export default function Dashboard(props) {
	const [activate, setActivate] = useState(true);
	return (
		<ArwesThemeProvider>
			<StylesBaseline styles={globalStyles} />
			<BleepsProvider
				audioSettings={audioSettings}
				playersSettings={playersSettings}
				bleepsSettings={bleepsSettings}>
				<AnimatorGeneralProvider animator={animatorGeneral}>
					<Button className={styles.btn} onClick={props.onClose}>
						<Text>Close</Text>
					</Button>
					<div className={styles.container}>
						{props.astros.map((astro) => (
							<Card
								className={styles.card}
								animator={{ activate }}
								title={astro.name}
								options={
									<Link href={"https://www.google.com/search?q=" + astro.name} target="_blank">
										<Button palette="secondary">
											<Text>Learn More</Text>
										</Button>
									</Link>
								}
								landscape
								hover
								style={{ maxWidth: 800 }}>
								<Text>{astro.craft}</Text>
							</Card>
						))}
					</div>
				</AnimatorGeneralProvider>
			</BleepsProvider>
		</ArwesThemeProvider>
	);
}
