const CLOUD_NAME = "a57m0ysa";

const cld = (id: string, w: number) =>
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_${w}/${id}`;

export const collageImages = [
    { src: cld("collage-1_plhnph", 600), alt: "Orange streetwear look" },
    { src: cld("collage-2_ls0bbz", 600), alt: "Colorful jacket look" },
    { src: cld("collage-3_qv9p16", 600), alt: "Green coat look" },
    { src: cld("collage-4_fmoexw", 600), alt: "Yellow hat look" },
    { src: cld("collage-5_opu2l5", 600), alt: "Blue outfit look" },
    { src: cld("collage-6_npdj8t", 600), alt: "Sunglasses look" },
    { src: cld("collage-7_cdtjwd", 600), alt: "Green jacket look" },
];

export const photosImages = {
    left: cld("photos-left_kloksj", 800),
    right: cld("photos-right_rjikhu", 800),
    center: cld("photos-center_rfdbv8", 800),
};

export const storiesImage = cld("stories_ijamua", 1000);