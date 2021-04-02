import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Parallax from "../utils/parallax";
import { Popover } from "@material-ui/core";

export default function Home(props) {
	const [anchorEl, setAnchorEl] = useState(null);
	// const [show, setShow] = useState(false);

	const handlePopoverOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);

	useEffect(() => {
		var objects = document.getElementsByClassName("object");

		var scene = document.getElementById("scene");
		console.log(scene);
		if (scene !== null) {
      var parallax = new Parallax(scene);
      
			for (let i = 0; i < objects.length; i++) {
				objects[i].style.top = `${Math.random() * 60 + 10}%`;
				objects[i].style.left = `${Math.random() * 60 + 10}%`;
			}
		}
		return () => {};
	});

	const getImage = (index) => {
		if (props.data.number > 7) {
			return `a${Math.floor(Math.random() * 6 + 1)}.png`;
		}
		return `a${index}.png`;
	};

	return (
		<div className={styles.container}>
			<Head>
				<title>People in space</title>
				{/* <link rel="icon" href="/favicon.ico" /> */}
			</Head>

			<main className={styles.main}>
				<img className="back" src="back-min.png" />
				<img className="earth" src="earth.png" />
				<div className="earth_container" id="scene">
					<img className="ss" src="spacestation.png" data-depth="0.2" />
					<img className="moon" src="moon.png" data-depth="0.2" />
					<img className="layer" src="text.png" data-depth="0.3" />
					<img className="layer" src="ob1.png" data-depth="0.6" />
					<img className="layer" src="ob2.png" data-depth="0.4" />
					<img className="layer" src="ob3.png" data-depth="0.5" />
					{props.data.message === "success" &&
						props.data.people.map((astro, index) => (
							<>
								<div
									key={"div" + index}
									className="object"
									id="object"
									data-depth="0.1">
									<img
										key={"img" + index}
										src={getImage(index + 1)}
										style={{ height: "inherit" }}
									/>
									<h5 key={"text" + index} className="name">
										{astro.name}
									</h5>
								</div>
							</>
						))}
					<Popover
						open={open}
						anchorEl={anchorEl}
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "left",
						}}
						transformOrigin={{
							vertical: "top",
							horizontal: "left",
						}}
						onClose={handlePopoverClose}
						disableRestoreFocus>
						Hello there
					</Popover>
					<div className="menu-icon">Menu</div>
				</div>
			</main>
		</div>
	);
}

Home.getInitialProps = async () => {
	const res = await axios.get("http://api.open-notify.org/astros.json");
	const data = res.data;
	return {
		data,
	};
};
