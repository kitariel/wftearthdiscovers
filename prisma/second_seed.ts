import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const movieStuffProducts = [
  {
    title: "Car Headrest Cover",
    description: "🎭 Transform your car into a mysterious ride with this unique headrest cover mask! Perfect for adding some intrigue to your daily commute or just confusing other drivers.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISOwMtFFrCGpZcy3r6EzxungvTM1fblVNjRieP",
    affiliateLink: "https://amzn.to/4lcltSN",
    tags: ["mask", "car", "headrest", "mysterious"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Shower Curtain",
    description: "🚿 Make your bathroom the talk of the house with this eye-catching shower curtain! Perfect for adding personality to your daily routine and surprising guests.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISA0f94CgLcmfuYs9tiIhdwOS40NGWTxaX5C8B",
    affiliateLink: "https://amzn.to/4lXf0MR",
    tags: ["curtain", "bathroom", "shower", "decoration"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Holding Nose Statue",
    description: "👃 This expressive statue captures that universal 'something smells' moment! Perfect for your garden, bathroom, or anywhere you want to make a statement about odors.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISGzRjewYpCiVBSwUI2j64O5XhDs7A3qRN0TJc",
    affiliateLink: "https://amzn.to/4ftqPrJ",
    tags: ["statue", "funny", "nose", "sculpture"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Bloody Matt",
    description: "🩸 Add some horror movie vibes to your home with this bloody mat! Perfect for Halloween decorations or year-round spooky aesthetics.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISsuyIx67VKbMGyfpSUCYw6xPHLT7Q4Iod29uh",
    affiliateLink: "https://amzn.to/3IVQGfM",
    tags: ["matt", "bloody", "horror", "halloween"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Pop Up Box",
    description: "📦 Surprise and delight with this pop-up box toy! Perfect for pranks, gifts, or just adding some unexpected fun to someone's day.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISZ6cKDVIMr4gP8dNxblAa56UyVQcGzSRqOofL",
    affiliateLink: "https://amzn.to/4ojjfE5",
    tags: ["toys", "surprise", "box", "prank"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Duck Car Decor",
    description: "🦆 Quack up your car's style with this adorable duck ornament! Perfect for dashboard decoration or making your vehicle more waterfowl-friendly.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISgRFrloWYj7ElXAIqeDk0ivhbcMUaQPyn2x31",
    affiliateLink: "https://amzn.to/4lZur7m",
    tags: ["ornament", "duck", "car", "decoration"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Toilet Timer",
    description: "⏰ Time your bathroom breaks with this hilarious toilet timer! Perfect for encouraging efficiency or just adding some humor to your daily routine.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISdidMicVRKy1M6a39no4JTACmxWPVXzbBfpk2",
    affiliateLink: "https://amzn.to/46DiDTx",
    tags: ["timer", "toilet", "bathroom", "funny"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Monkey Shower Curtain",
    description: "🐵 Go bananas in your bathroom with this monkey-themed shower curtain! Perfect for adding some primate personality to your daily wash routine.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISIQfRhlsPQ9HNy3gWEe1R2m64AUoasizBCqc7",
    affiliateLink: "https://amzn.to/3ULEukc",
    tags: ["curtain", "monkey", "bathroom", "animals"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Novelty Socks",
    description: "🧦 Step up your sock game with these novelty socks! Perfect for expressing your personality from the ground up and starting conversations.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISfUCQURDnstXE362RWdl5xpL9gCHMSabUqBJe",
    affiliateLink: "https://amzn.to/4odURnr",
    tags: ["socks", "novelty", "clothing", "funny"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Dinosaur Soft Case",
    description: "🦕 Protect your phone with prehistoric style! This dinosaur soft case brings Jurassic vibes to your modern device. Roaring not included.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISiwtxoiQDIfUz5gmbkvlK9BcOsoLh7018djPA",
    affiliateLink: "https://amzn.to/4fmWlYr",
    tags: ["phone case", "dinosaur", "protection", "prehistoric"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Unicorn Softcase",
    description: "🦄 Add some magic to your phone with this unicorn soft case! Perfect for believers in magic and anyone who wants their device to sparkle with personality.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISBtZkipqPoASyv27XkuIYwaBDf14LZ3dr0UCJ",
    affiliateLink: "https://amzn.to/45wm0um",
    tags: ["phone case", "unicorn", "magic", "fantasy"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Red Stone Dragon Ring",
    description: "🐉 Channel your inner dragon with this fierce red stone ring! Perfect for making a bold statement and adding some mythical power to your style.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISPFiMPer6gZlx7cUqhHJiOD84Vmu6Kpb3tM5X",
    affiliateLink: "https://amzn.to/4lROBjz",
    tags: ["hand ring", "dragon", "red stone", "jewelry"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Snake Ring",
    description: "🐍 Slither into style with this serpentine ring! Perfect for adding some reptilian elegance to your jewelry collection and making people do double-takes.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISETqyp8An2uFKOaoT8WblNYiw1gXHdVPxz9Iv",
    affiliateLink: "https://amzn.to/3U9aNte",
    tags: ["hand ring", "snake", "jewelry", "reptile"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Stud Earrings",
    description: "✨ Add some sparkle to your ears with these stylish stud earrings! Perfect for everyday wear or special occasions when you want to shine.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUIS64lEUMNBb3FNDzcKERuHwhlt1T8afZWj9MA4",
    affiliateLink: "https://amzn.to/3UbNrDl",
    tags: ["earrings", "studs", "jewelry", "sparkle"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Skeleton Earrings",
    description: "💀 Rock some bone-chilling style with these skeleton earrings! Perfect for Halloween, goth fashion, or anyone who likes their jewelry with a side of spook.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISkuPcz4XRLMbsOIVUD0hdvBq5kAH19x68ytoS",
    affiliateLink: "https://amzn.to/4lXg1o9",
    tags: ["earrings", "skeleton", "gothic", "spooky"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Fish Bone Earrings",
    description: "🐟 Make waves with these fish bone earrings! Perfect for ocean lovers, seafood enthusiasts, or anyone who wants their jewelry to tell a fishy tale.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISs61AbWu7VKbMGyfpSUCYw6xPHLT7Q4Iod29u",
    affiliateLink: "https://amzn.to/3HbKMXp",
    tags: ["earrings", "fish bone", "ocean", "nautical"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Wall E Necklace",
    description: "🤖 Show your love for everyone's favorite robot with this Wall-E necklace pendant! Perfect for Pixar fans and anyone who believes in robot romance.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISAg5iMALcmfuYs9tiIhdwOS40NGWTxaX5C8BR",
    affiliateLink: "https://amzn.to/4l4aScF",
    tags: ["necklace pendant", "wall-e", "robot", "pixar"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Panda Necklace Pendant",
    description: "🐼 Embrace your inner panda with this adorable necklace pendant! Perfect for animal lovers and anyone who wants to add some bamboo-munching charm to their style.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISBdebZCqPoASyv27XkuIYwaBDf14LZ3dr0UCJ",
    affiliateLink: "https://amzn.to/4oggN0X",
    tags: ["necklace pendant", "panda", "animals", "cute"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Osubo Bestie Water Bottle",
    description: "💧 Stay hydrated with your bestie bottle! This insulated water bottle keeps your drinks at the perfect temperature while showing off your friendship goals.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISUiKMtrZb2oXPEv01LktaqymDHClKWsNzI7Rp",
    affiliateLink: "https://amzn.to/4msNOWm",
    tags: ["insulated bottle", "water bottle", "bestie", "hydration"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Moana 2 Figurine",
    description: "🌊 Set sail for adventure with this Moana 2 figurine! Perfect for Disney fans and anyone ready to explore the ocean with the heart of Te Fiti.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISu8h6Lovjg0wEeM6aqAGWKr5IZikFmhzcn1DL",
    affiliateLink: "https://amzn.to/45u8xTM",
    tags: ["figurine", "moana", "disney", "collectible"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Sing Along Moana Boom Box",
    description: "🎵 Bring the music of Moana everywhere with this sing-along boom box! Perfect for beach parties, car rides, or whenever you need to feel the call of the ocean.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISzDAUkcEO0i8cPwA5yMUVCJDvbIXE9N6gljd3",
    affiliateLink: "https://amzn.to/46DZnFq",
    tags: ["toys", "moana", "music", "sing-along"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "McQueen Sunglasses",
    description: "🏎️ Race into style with these Lightning McQueen sunglasses! Perfect for Cars fans and anyone who wants to look fast while standing still. Ka-chiga!",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUIS2sV4er9boiWN48BwMJDLaYyvQF0l9HGOxndp",
    affiliateLink: "https://amzn.to/47dfcmx",
    tags: ["toys", "mcqueen", "sunglasses", "cars"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Halloween Famous Painting Costumes",
    description: "🎨 Become a masterpiece with these famous painting Halloween costumes! Perfect for art lovers and anyone who wants to be the most cultured person at the party.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISq1lR99jApJLTh8InPmHvfzGoFUtQ2RV9ZsMD",
    affiliateLink: "https://amzn.to/4ffF3we",
    tags: ["custome", "halloween", "painting", "art"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Luau Hula Skirt Costume",
    description: "🌺 Bring the tropical vibes with this luau hula skirt costume! Perfect for Hawaiian parties, beach events, or whenever you need to feel the aloha spirit.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISRRCYPoGPcf5l2qu6BK0hxDG9eAU1SYrMEION",
    affiliateLink: "https://amzn.to/46DjoMn",
    tags: ["custome", "hula", "luau", "tropical"],
    isFeatured: false,
    platformType: "Amazon"
  }
];

async function main() {
  console.log('🎬 Starting to seed movie stuff products...');
  
  for (const product of movieStuffProducts) {
    await prisma.wtfProduct.create({
      data: product,
    });
  }
  
  console.log('✅ Movie stuff products seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });