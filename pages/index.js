import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Parallax from "../utils/parallax";
import { BottomNavigation, Link, Popover } from "@material-ui/core";
import Loader from "../components/preloader";
import Dashboard from "../components/dashboard";
import Button from "../components/button";
import { Facebook, Twitter, Instagram } from "@material-ui/icons";

export default function Home(props) {
	const [anchorEl, setAnchorEl] = useState(null);
	// const [show, setShow] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [dashboardView, setDashboardView] = useState(false);

	const handlePopoverOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);

	useEffect(() => {
		positioning();
		return () => {};
	}, [dashboardView]);

	useEffect(() => {
		setTimeout(() => {
			if (document.readyState === "complete") {
				setLoaded(true);
				positioning();
				
			}
			document.onreadystatechange = () => {
				if (document.readyState === "complete") {
					setLoaded(true);
					positioning();
				}
			};
		}, 3000);

		return () => {};
	}, []);

	function positioning() {
		var objects = document.getElementsByClassName("object");

		let places = [];
		function check(top, left) {
			for (let i = 0; i < places.length; i++) {
				if (top > places[i].top && top < places[i].top + 150) {
					return false;
				}

				if (left > places[i].left && left < places[i].left + 150) {
					return false;
				}
			}
			return true;
		}
		for (let i = 0; i < objects.length; i++) {
			let top = 30,
				left = 30,
				val;

			do {
				if (innerWidth > innerHeight) {
					top = Math.random() * (innerHeight - 200 - 100) + 100;
					left = Math.random() * (innerWidth - 200 - 100) + 100;
				} else {
					top = Math.random() * (innerHeight - 150 - 50) + 50;
					left = Math.random() * (innerWidth - 50 - 50) + 50;
				}
				val = false;
				val = check(top, left);
			} while (!val);

			places.push({
				top: top,
				left: left,
			});
			console.log(places);
			objects[i].style.top = `${top}px`;
			objects[i].style.left = `${left}px`;
			dragElement(objects[i]);
		}
	}
	useEffect(() => {
		positioning();
		addEventListener("resize", positioning);
		// }
		return () => {};
	}, []);

	useEffect(() => {
		const width = screen.width;
		const height = screen.height;
		document.addEventListener("mousemove", parallax);
		function parallax(e) {
			this.querySelectorAll(".parallax").forEach((layer) => {
				const depth = layer.getAttribute("data-depth");
				let x, y;
				if (width > height) {
					x = (window.innerWidth - e.pageX * depth) / 100 - 10;
					y = (window.innerHeight - e.pageY * depth) / 100 - 10;
				} else {
					x = (window.innerWidth - e.pageX * depth) / 100;
					y = (window.innerHeight - e.pageY * depth) / 100;
				}

				layer.style.transform = `translateX(${x}%) translateY(${y}%)`;
			});
		}
		return () => {};
	}, []);

	function dragElement(elmnt) {
		var pos1 = 0,
			pos2 = 0,
			pos3 = 0,
			pos4 = 0;
		if (document.getElementById(elmnt.id + "header")) {
			// if present, the header is where you move the DIV from:
			document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
		} else {
			// otherwise, move the DIV from anywhere inside the DIV:
			elmnt.onmousedown = dragMouseDown;
		}

		function dragMouseDown(e) {
			e = e || window.event;
			e.preventDefault();
			// get the mouse cursor position at startup:
			pos3 = e.clientX;
			pos4 = e.clientY;
			document.onmouseup = closeDragElement;
			// call a function whenever the cursor moves:
			document.onmousemove = elementDrag;
		}

		function elementDrag(e) {
			e = e || window.event;
			e.preventDefault();
			// calculate the new cursor position:
			pos1 = pos3 - e.clientX;
			pos2 = pos4 - e.clientY;
			pos3 = e.clientX;
			pos4 = e.clientY;
			// set the element's new position:
			elmnt.style.top = elmnt.offsetTop - pos2 + "px";
			elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
		}

		function closeDragElement() {
			// stop moving when mouse button is released:
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}

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
			{dashboardView && (
				<Dashboard
					astros={props.data.people}
					onClose={() => setDashboardView(false)}
				/>
			)}

			<main
				className={styles.main}
				style={{ display: `${loaded && !dashboardView ? "" : "none"}` }}>
				{/* <Button name="View List" onCLick></Button> */}
				<img className="back" src="back-min.png" />
				<img className="earth" src="earth.png" />
				<div className="earth_container" id="scene">
					<img
						className="ss parallax"
						src="spacestation.png"
						data-depth="0.2"
					/>
					<img className="moon parallax" src="moon.png" data-depth="0.2" />
					<img className="layer parallax" src="text.png" data-depth="0.3" />
					<img className="layer parallax" src="ob1.png" data-depth="0.6" />
					<img className="layer parallax" src="ob2.png" data-depth="0.4" />
					<img className="layer parallax" src="ob3.png" data-depth="0.5" />
					<div className="media-icons">
						<Link
							className="icon-3d"
							href="https://twitter.com/vivek_sorathiya"
							target="_blank">
							<Twitter style={{ color: "#fff" }} />
						</Link>
						<Link
							className="icon-3d"
							href="https://facebook.com/iamviveksorathiya"
							target="_blank">
							<Facebook style={{ color: "#fff" }} />
						</Link>
						<Link
							className="icon-3d"
							href="https://instagram.com/viveksorathiyaofficial"
							target="_blank">
							<Instagram style={{ color: "#fff" }} />
						</Link>
						{/* <i className="icon-3d"></i> */}
					</div>
					{props.data.message === "success" &&
						props.data.people.map((astro, index) => (
							<>
								<div
									key={"div" + index}
									draggable
									className="object parallax"
									id="object"
									data-depth="0.3"
									onClick={handlePopoverOpen}>
									<img
										key={"img" + index}
										src={getImage(index + 1)}
										style={{ height: "inherit" }}
									/>
									<h5 className="name">{astro.name}</h5>
								</div>
							</>
						))}

					<div className="menu-icon" onClick={() => setDashboardView(true)}>
						<span id="menu1">.</span>
						<span id="menu2">.</span>
					</div>
				</div>
				<h5 className="disclaimer">
					* There is no official source of data available
				</h5>
				<h5 className="footer">MADE WITH ❤️ BY <a href="#">VIVEK SORATHIYA</a></h5>
			</main>
			{!loaded && <Loader />}
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
