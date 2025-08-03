import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleProducts = [
  {
    title: "Weird Queer Grumpy Frog Toad Statue Ugly Angry",
    description: "🐸 This grumpy frog statue brings all the attitude you need! Perfect for expressing your inner mood or just confusing your guests. Guaranteed to make people question your decorating choices.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUIS2jjioP9boiWN48BwMJDLaYyvQF0l9HGOxndp",
    affiliateLink: "https://amzn.to/4onkrXa",
    tags: ["sculpture", "weird", "frog", "statue"],
    isFeatured: true,
    platformType: "Amazon"
  },
  {
    title: "Weird Queer Grumpy Smiley Frog Toad Statue",
    description: "🐸 The happier cousin of the grumpy frog! This smiley toad statue will brighten your day while still maintaining that weird charm. Perfect for mood swings.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISHNQwD4SvIs6QxfwVAPnEoum5DZN2qrCjM3zK",
    affiliateLink: "https://amzn.to/3Hftcl9",
    tags: ["sculpture", "weird", "frog", "statue"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "DR Dingus Fart",
    description: "💨 The ultimate gag gift! Dr. Dingus brings sophisticated humor to your collection. Warning: May cause uncontrollable laughter and questionable life choices.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISJxnNxycqIdlGLXKA2YknuS9jO3imPFevzUfc",
    affiliateLink: "https://amzn.to/4mhUciS",
    tags: ["other", "funny", "gag", "gift"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Bread Slippers",
    description: "🍞 Step into comfort with these bread slippers! Perfect for when you want your feet to look like fresh loaves. Butter not included but highly recommended.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISw22a9I2puBhGHzw6TgFLyEq34YtC7K8pVkxv",
    affiliateLink: "https://amzn.to/4lRKfJf",
    tags: ["slippers", "bread", "comfort", "weird"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Monster Slippers",
    description: "👹 Unleash your inner monster with these fierce slippers! Perfect for stomping around the house and scaring the cat. Roaring not included.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISoIIUA1JvIcgBMy31k6s0xqetupFf4YQmGi7E",
    affiliateLink: "https://amzn.to/4lXbZfv",
    tags: ["shoes", "slippers", "monster", "comfort"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Big Toe Shoes Slippers",
    description: "🦶 These big toe slippers will make your feet the center of attention! Perfect for when you want to make a statement or just weird people out.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISH3VmiKSvIs6QxfwVAPnEoum5DZN2qrCjM3zK",
    affiliateLink: "https://amzn.to/46EsRD8",
    tags: ["shoes", "slippers", "toe", "weird"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Real Dinosaur",
    description: "🦕 Finally! A real dinosaur for your collection! This prehistoric pal will bring Jurassic vibes to any room. Feeding instructions not included.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISgRBd3w5WYj7ElXAIqeDk0ivhbcMUaQPyn2x3",
    affiliateLink: "https://amzn.to/40NceBv",
    tags: ["toys", "dinosaur", "prehistoric", "collectible"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Lobster Slipper",
    description: "🦞 Pinch your way to comfort with these lobster slippers! Perfect for seafood lovers or anyone who wants to feel fancy while lounging.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISjaxxwkzLTRru6cnaUyZkCIK9FSVm5Pevlgwp",
    affiliateLink: "https://amzn.to/3UFxPrN",
    tags: ["slippers", "lobster", "seafood", "comfort"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Fish Mask",
    description: "🐟 Transform into an aquatic creature with this fish mask! Perfect for underwater themed parties or just swimming in style. Gills not functional.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUIS8YkgtQIRS0sEbN5un8PBZU4D2mpR1WQVdXAq",
    affiliateLink: "https://amzn.to/4oj3EEy",
    tags: ["mask", "fish", "costume", "aquatic"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Funny Apron",
    description: "👨‍🍳 Cook with style and humor! This funny apron will make you the chef everyone remembers. Warning: May cause excessive compliments on your cooking.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISrQbJji3Gv2is5zEJyS7CIR9KAoYpkZd3ef16",
    affiliateLink: "https://amzn.to/46EGrpY",
    tags: ["kitchen", "apron", "funny", "cooking"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Duck Night Lamp",
    description: "🦆 Light up your nights with this adorable duck lamp! Perfect for creating a cozy atmosphere or just having a rubber duck that actually does something useful.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISdTpYi1VRKy1M6a39no4JTACmxWPVXzbBfpk2",
    affiliateLink: "https://amzn.to/4ff8O08",
    tags: ["lamp", "duck", "night light", "cute"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Aperitif Board",
    description: "🍷 Elevate your entertaining game with this stylish aperitif board! Perfect for impressing guests or just making your snacks look fancy.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISilK0LJQDIfUz5gmbkvlK9BcOsoLh7018djPA",
    affiliateLink: "https://amzn.to/3H3SnY3",
    tags: ["board", "entertaining", "aperitif", "kitchen"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Waving Inflatable Guy",
    description: "👋 Bring the car dealership energy to your home! This waving inflatable guy will greet everyone with endless enthusiasm. Batteries not included.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUIS2At8UA9boiWN48BwMJDLaYyvQF0l9HGOxndp",
    affiliateLink: "https://amzn.to/4lcAAMn",
    tags: ["toys", "inflatable", "waving", "decoration"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Gorilla Toys",
    description: "🦍 Go bananas with these gorilla toys! Perfect for jungle-themed adventures or just monkeying around. Banana not included but recommended.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISp1JglKhEUvLxqo4C2dZjPWJ9khG8YXNyVteb",
    affiliateLink: "https://amzn.to/45ddsHs",
    tags: ["toys", "gorilla", "jungle", "animals"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Belly Waist Pack",
    description: "👨 Embrace the dad bod aesthetic with this belly waist pack! Perfect for carrying essentials while looking like you've got a beer gut. Confidence included.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUIS3c2em5wPlQwzmTeH2p15R0sajJLENbokxBnX",
    affiliateLink: "https://amzn.to/4mm0YUG",
    tags: ["men", "waist pack", "belly", "funny"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Shot Glass",
    description: "🥃 Take your shots in style with this unique shot glass! Perfect for parties or just making your drinking look more sophisticated than it actually is.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUIS8esTcqRS0sEbN5un8PBZU4D2mpR1WQVdXAqi",
    affiliateLink: "https://amzn.to/4frQNMo",
    tags: ["cup", "shot glass", "drinking", "party"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Banana Phone",
    description: "🍌 Ring ring! It's the banana phone! Perfect for making calls that are both functional and fruit-themed. May cause uncontrollable giggling.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISEiDk8SAn2uFKOaoT8WblNYiw1gXHdVPxz9Iv",
    affiliateLink: "https://amzn.to/45hLaeX",
    tags: ["speaker", "banana", "phone", "funny"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Candy Bar Gar",
    description: "🍫 This candy bar figurine will satisfy your sweet tooth for decoration! Perfect for candy lovers or anyone who wants edible-looking art.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISPOCFzI6gZlx7cUqhHJiOD84Vmu6Kpb3tM5X9",
    affiliateLink: "https://amzn.to/4mh5fc0",
    tags: ["figurine", "candy", "sweet", "decoration"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Snail Soap Dispenser",
    description: "🐌 Slow and steady wins the hygiene race! This snail soap dispenser brings garden charm to your bathroom. Slime trail not included.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISkoN5e0XRLMbsOIVUD0hdvBq5kAH19x68ytoS",
    affiliateLink: "https://amzn.to/46J4lAR",
    tags: ["bathroom", "soap dispenser", "snail", "cute"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Liquor Dispenser",
    description: "🍺 Dispense your favorite beverages in style! This liquor dispenser will make you feel like a professional bartender. Drinks not included but highly recommended.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISD17CB8ZjVpkTeiOuUyZ2HAQbEmMsFRvxGLYg",
    affiliateLink: "https://amzn.to/3IVPXv4",
    tags: ["dispenser", "liquor", "bar", "entertaining"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Pig Bottle Opener",
    description: "🐷 Pop bottles with porcine power! This pig bottle opener brings barnyard charm to your bar setup. Oinking optional but encouraged.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISPqDG5B6gZlx7cUqhHJiOD84Vmu6Kpb3tM5X9",
    affiliateLink: "https://amzn.to/4owDAWK",
    tags: ["opener", "pig", "bottle opener", "kitchen"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Toilet Bowl Night Light",
    description: "🚽 Light up your midnight bathroom visits! This toilet bowl night light ensures you never miss your target. Your aim will thank you.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISYm496rBOmzFhuaV7LltC52AQpbIw4G1DZ98n",
    affiliateLink: "https://amzn.to/45vIlbn",
    tags: ["bathroom", "night light", "toilet", "practical"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Articulated Fingers",
    description: "👆 Give your fingers some finger friends! These articulated finger accessories will make you the most interesting person at any gathering.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISVt6ePPgkeBHuY2XKFRkzymr54xf7JO8hTDgM",
    affiliateLink: "https://amzn.to/3GRhVrm",
    tags: ["accessories", "fingers", "weird", "funny"],
    isFeatured: false,
    platformType: "Amazon"
  },
  {
    title: "Car Pig Decor",
    description: "🐷 Bring some swine style to your ride! This car pig decoration will make your vehicle the talk of the parking lot. Squealing not included.",
    imageUrl: "https://2fulyibz94.ufs.sh/f/hmmNzN2AJUISTVIzbYA05teDvw8XUI6ZbJPgxi9proFH7aR0",
    affiliateLink: "https://amzn.to/3HfEoOL",
    tags: ["decoration", "car", "pig", "automotive"],
    isFeatured: false,
    platformType: "Amazon"
  }
];

async function main() {
  console.log('🌍 Seeding WTF Earth Discovers database...');
  
  for (const product of sampleProducts) {
    await prisma.wtfProduct.create({
      data: product,
    });
    console.log(`✅ Added: ${product.title}`);
  }
  
  console.log('🎉 Seeding completed! Your database is now full of weird stuff!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });