import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const generatePdf = async ({
	name,
	description,
	titleFontSize,
	descFontSize,
}) => {
	/*
	 * Using font.widthOfTextAtSize transform text adding \n to break lines
	 * if width of text is bigger than the width passed as parameter
	 * and return the text with the line breaks
	 * @param text: string
	 * @param width: number
	 * @param font: font
	 * @param fontSize: number
	 * @returns string
	 */
	const wrapText = (text, width, font, fontSize) => {
		const words = text.split(' ');
		let line = '';
		let result = '';
		for (let n = 0; n < words.length; n++) {
			const testLine = line + words[n] + ' ';
			const testWidth = font.widthOfTextAtSize(testLine, fontSize);
			if (testWidth > width) {
				result += line + '\n';
				line = words[n] + ' ';
			} else {
				line = testLine;
			}
		}
		result += line;
		return result;
	};

	// Create a new PDFDocument
	const pdfDoc = await PDFDocument.create();

	// Embed the Times Roman font
	const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

	// Add a blank page to the document
	const page = pdfDoc.addPage();

	// Get the width and height of the page
	const { width, height } = page.getSize();

	// const jpgUrl = 'https://pdf-lib.js.org/assets/cat_riding_unicorn.jpg';
	// const jpgImageBytes = await fetch(jpgUrl).then((res) => {
	// 	res.blob();
	// });

	// console.log('jpgImageBytes' + jpgImageBytes);

	// const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
	// const jpgDims = jpgImage.scale(0.25);

	// page.drawImage(jpgImage, {
	// 	x: page.getWidth() / 2 - jpgDims.width / 2,
	// 	y: page.getHeight() / 2 - jpgDims.height / 2,
	// 	width: jpgDims.width,
	// 	height: jpgDims.height,
	// });

	// Draw a string of text toward the top of the page
	page.drawText(name, {
		x: 50,
		y: height - 4 * titleFontSize,
		size: +titleFontSize,
		font: font,
		color: rgb(0.2, 0.2, 0.2),
	});

	let desc = wrapText(description, 500, font, +descFontSize);
	page.drawText(desc, {
		x: 50,
		y: height - 6 * titleFontSize,
		size: +descFontSize,
		font: font,
		color: rgb(0.4, 0.4, 0.4),
	});

	const b64 = await pdfDoc.saveAsBase64();

	return { as: b64 };
};

export default generatePdf;
