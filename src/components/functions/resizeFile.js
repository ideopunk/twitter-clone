import Resizer from "react-image-file-resizer";

const resizeFile = (file, width, height) =>
	new Promise((resolve) => {
		Resizer.imageFileResizer(
			file,
			width,
			height,
			"JPEG",
			100,
			0,
			(uri) => {
				resolve(uri);
			},
			"blob",
			width,
			height
		);
	});

    export default resizeFile;