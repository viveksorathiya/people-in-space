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
import { frameEdit, initCanvas, initCursor } from "../utils/cursor";

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
		// set the starting position of the cursor outside of the screen
		let clientX = -100;
		let clientY = -100;
		const innerCursor = document.querySelector(".cursor--small");

		const initCursor = () => {
			// add listener to track the current mouse position
			document.addEventListener("mousemove", (e) => {
				clientX = e.clientX;
				clientY = e.clientY;
			});

			// transform the innerCursor to the current mouse position
			// use requestAnimationFrame() for smooth performance
			const render = () => {
				innerCursor.style.transform = `translate(${clientX}px, ${clientY}px)`;
				// if you are already using TweenMax in your project, you might as well
				// use TweenMax.set() instead
				// TweenMax.set(innerCursor, {
				//   x: clientX,
				//   y: clientY
				// });

				requestAnimationFrame(render);
			};
			requestAnimationFrame(render);
		};

		initCursor();

		let lastX = 0;
		let lastY = 0;
		let isStuck = false;
		let showCursor = false;
		let group, stuckX, stuckY, fillOuterCursor;

		const initCanvas = () => {
			const canvas = document.querySelector(".cursor--canvas");
			const shapeBounds = {
				width: 75,
				height: 75,
			};
			paper.setup(canvas);
			const strokeColor = "rgba(255, 255, 255, 0.8)";
			const strokeWidth = 2;
			const segments = 8;
			const radius = 15;

			// we'll need these later for the noisy circle
			const noiseScale = 150; // speed
			const noiseRange = 4; // range of distortion
			let isNoisy = false; // state

			// the base shape for the noisy circle
			const polygon = new paper.Path.RegularPolygon(
				new paper.Point(0, 0),
				segments,
				radius
			);
			polygon.strokeColor = strokeColor;
			polygon.strokeWidth = strokeWidth;
			polygon.smooth();
			group = new paper.Group([polygon]);
			group.applyMatrix = false;

			const noiseObjects = polygon.segments.map(() => new SimplexNoise());
			let bigCoordinates = [];

			// function for linear interpolation of values
			const lerp = (a, b, n) => {
				return (1 - n) * a + n * b;
			};

			// function to map a value from one range to another range
			const map = (value, in_min, in_max, out_min, out_max) => {
				return (
					((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
				);
			};

			// the draw loop of Paper.js
			// (60fps with requestAnimationFrame under the hood)
			paper.view.onFrame = (event) => {
				// using linear interpolation, the circle will move 0.2 (20%)
				// of the distance between its current position and the mouse
				// coordinates per Frame
				paper.view.onFrame = (event) => {
					// using linear interpolation, the circle will move 0.2 (20%)
					// of the distance between its current position and the mouse
					// coordinates per Frame
					if (!isStuck) {
						// move circle around normally
						lastX = lerp(lastX, clientX, 0.2);
						lastY = lerp(lastY, clientY, 0.2);
						group.position = new paper.Point(lastX, lastY);
					} else if (isStuck) {
						// fixed position on a nav item
						lastX = lerp(lastX, stuckX, 0.2);
						lastY = lerp(lastY, stuckY, 0.2);
						group.position = new paper.Point(lastX, lastY);
					}

					if (isStuck && polygon.bounds.width < shapeBounds.width) {
						// scale up the shape
						polygon.scale(1.08);
					} else if (!isStuck && polygon.bounds.width > 30) {
						// remove noise
						if (isNoisy) {
							polygon.segments.forEach((segment, i) => {
								segment.point.set(bigCoordinates[i][0], bigCoordinates[i][1]);
							});
							isNoisy = false;
							bigCoordinates = [];
						}
						// scale down the shape
						const scaleDown = 0.92;
						polygon.scale(scaleDown);
					}

					// while stuck and big, apply simplex noise
					if (isStuck && polygon.bounds.width >= shapeBounds.width) {
						isNoisy = true;
						// first get coordinates of large circle
						if (bigCoordinates.length === 0) {
							polygon.segments.forEach((segment, i) => {
								bigCoordinates[i] = [segment.point.x, segment.point.y];
							});
						}

						// loop over all points of the polygon
						polygon.segments.forEach((segment, i) => {
							// get new noise value
							// we divide event.count by noiseScale to get a very smooth value
							const noiseX = noiseObjects[i].noise2D(
								event.count / noiseScale,
								0
							);
							const noiseY = noiseObjects[i].noise2D(
								event.count / noiseScale,
								1
							);

							// map the noise value to our defined range
							const distortionX = map(noiseX, -1, 1, -noiseRange, noiseRange);
							const distortionY = map(noiseY, -1, 1, -noiseRange, noiseRange);

							// apply distortion to coordinates
							const newX = bigCoordinates[i][0] + distortionX;
							const newY = bigCoordinates[i][1] + distortionY;

							// set new (noisy) coodrindate of point
							segment.point.set(newX, newY);
						});
					}
					polygon.smooth();
				};
			};
		};

		initCanvas();

		const initHovers = () => {
			// find the center of the link element and set stuckX and stuckY
			// these are needed to set the position of the noisy circle
			const handleMouseEnter = (e) => {
				const navItem = e.currentTarget;
				const navItemBox = navItem.getBoundingClientRect();
				stuckX = Math.round(navItemBox.left + navItemBox.width / 2);
				stuckY = Math.round(navItemBox.top + navItemBox.height / 2);
				isStuck = true;
			};

			// reset isStuck on mouseLeave
			const handleMouseLeave = () => {
				isStuck = false;
			};

			// add event listeners to all items
			const linkItems = document.querySelectorAll(".link");
			linkItems.forEach((item) => {
				item.addEventListener("mouseenter", handleMouseEnter);
				item.addEventListener("mouseleave", handleMouseLeave);
			});
		};

		initHovers();

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
							className="icon-3d link"
							href="https://twitter.com/vivek_sorathiya"
							target="_blank">
							<Twitter style={{ color: "#fff" }} />
						</Link>
						<Link
							className="icon-3d link"
							href="https://facebook.com/iamviveksorathiya"
							target="_blank">
							<Facebook style={{ color: "#fff" }} />
						</Link>
						<Link
							className="icon-3d link"
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

					<Link href="#" onClick={() => setDashboardView(true)}>
						<div className="menu-icon link">
							<span id="menu1">.</span>
							<span id="menu2">.</span>
						</div>
					</Link>
				</div>
				<h5 className="disclaimer">
					* There is no official source of data available
				</h5>
				<h5 className="footer">
					MADE WITH ❤️ BY <a href="#">VIVEK SORATHIYA</a>
				</h5>
			</main>
			{!loaded && <Loader />}
			<div className="cursor cursor--small"></div>
			<canvas className="cursor cursor--canvas" resize></canvas>
			<script src="https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.0/paper-core.min.js"></script>
			<script src="https://cdnjs.cloudflare.com/ajax/libs/simplex-noise/2.4.0/simplex-noise.min.js"></script>
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
