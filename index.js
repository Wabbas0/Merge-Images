import { join } from "path";
import fetch from "node-fetch";
import mergeImg from "merge-img";
import minimist from "minimist";

let argv = minimist(process.argv.slice(2));

let {
    greeting = "Hello",
    who = "You",
    width = 400,
    height = 500,
    color = "Pink",
    size = 100,
} = argv;

const getImageUrl = (name) =>
    `https://cataas.com/cat/says/${name}?width=${width}&height=${height}&color=${color}&s=${size}`;

const fileOut = join(process.cwd(), `/cat-card.jpg`);

const [image1, image2] = await Promise.all([
    getPhotoFromAPI(getImageUrl(greeting)),
    getPhotoFromAPI(getImageUrl(who)),
]);

const mergedImg = await mergeImg([
    { src: image1, x: width, y: height },
    { src: image2, x: width, y: height },
]);

mergedImg.write(fileOut, () => console.log("Saved!"));

async function getPhotoFromAPI(url) {
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return buffer;
    } catch (err) {
        console.log("Error while fetching image from API", err);
    }
}
