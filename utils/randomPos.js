const layoutGrid = (height, width) => {
	const container = document.getElementById("container");
	container.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
	container.style.gridTemplateRows = `repeat(${height}, 1fr)`;
};
