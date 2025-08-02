import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleProducts = [
  {
    title: "Banana Phone - Yes, It Actually Works",
    description: "🍌 Finally! A phone that looks like a banana and makes you question all your life choices. Perfect for when you want to confuse telemarketers AND your friends. Warning: May cause uncontrollable giggling.",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
    affiliateLink: "https://amazon.com/banana-phone",
    tags: ["weird", "tech", "wtf", "gift"],
    isFeatured: true,
  },
  {
    title: "Inflatable Toast Pool Float",
    description: "🍞 Because nothing says 'summer vibes' like floating on a giant piece of bread. Your pool parties will never be the same. Butter not included (sadly).",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500",
    affiliateLink: "https://amazon.com/toast-float",
    tags: ["pool", "summer", "weird", "gift"],
    isFeatured: false,
  },
  {
    title: "Pickle Rick Air Freshener",
    description: "🥒 Turn your car into the most scientifically advanced pickle in the universe! Smells like genius and existential dread. Wubba lubba dub dub!",
    imageUrl: "https://images.unsplash.com/photo-1628191081676-8f40d4ce6c44?w=500",
    affiliateLink: "https://amazon.com/pickle-rick-freshener",
    tags: ["car", "rick-morty", "weird", "smell"],
    isFeatured: false,
  },
  {
    title: "Screaming Rubber Chicken",
    description: "🐔 The classic! Press it and it screams like it's having an existential crisis. Perfect for meetings, awkward silences, or just general chaos. Therapy not included.",
    imageUrl: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500",
    affiliateLink: "https://amazon.com/screaming-chicken",
    tags: ["classic", "noise", "wtf", "stress-relief"],
    isFeatured: false,
  },
  {
    title: "Unicorn Meat in a Can",
    description: "🦄 Finally, you can taste the rainbow! This 'canned unicorn meat' is 100% fake but 200% hilarious. Great for pranking vegetarian friends. Sparkles guaranteed!",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
    affiliateLink: "https://amazon.com/unicorn-meat",
    tags: ["food", "prank", "unicorn", "gift"],
    isFeatured: false,
  },
  {
    title: "Giant Rubber Duck for Adults",
    description: "🦆 Because your bathtub deserves a friend that's bigger than your problems. This 6-foot rubber duck will make you feel like a giant baby. Squeaks included!",
    imageUrl: "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=500",
    affiliateLink: "https://amazon.com/giant-rubber-duck",
    tags: ["bath", "giant", "duck", "wtf"],
    isFeatured: false,
  },
  {
    title: "Toilet Paper Wedding Dress Kit",
    description: "👰 For when you want to get married but also be prepared for emergencies. This DIY kit turns toilet paper into haute couture. Divorce papers not included.",
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500",
    affiliateLink: "https://amazon.com/tp-wedding-dress",
    tags: ["wedding", "diy", "weird", "emergency"],
    isFeatured: false,
  },
  {
    title: "Bacon Bandages",
    description: "🥓 Heal your wounds with the power of bacon! These bandages look like strips of bacon and make every injury deliciously dramatic. Vegetarians may experience confusion.",
    imageUrl: "https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500",
    affiliateLink: "https://amazon.com/bacon-bandages",
    tags: ["medical", "bacon", "funny", "first-aid"],
    isFeatured: false,
  },
  {
    title: "Ostrich Pillow - Human Hibernation",
    description: "😴 Transform into a human ostrich and nap anywhere! This pillow makes you look like an alien but feel like you're in heaven. Airport sleeping champion approved.",
    imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500",
    affiliateLink: "https://amazon.com/ostrich-pillow",
    tags: ["sleep", "travel", "weird", "comfort"],
    isFeatured: false,
  },
  {
    title: "Yodeling Pickle",
    description: "🥒 A pickle that yodels. That's it. That's the product. Press the button and question everything you thought you knew about vegetables and music.",
    imageUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=500",
    affiliateLink: "https://amazon.com/yodeling-pickle",
    tags: ["music", "pickle", "wtf", "classic"],
    isFeatured: false,
  },
  {
    title: "Handerpants - Underwear for Your Hands",
    description: "👐 Finally! Underwear for your hands because apparently that's what we needed. Keep your hands modest and warm. Your fingers will thank you (maybe).",
    imageUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500",
    affiliateLink: "https://amazon.com/handerpants",
    tags: ["hands", "underwear", "weird", "winter"],
    isFeatured: false,
  },
  {
    title: "Emergency Clown Nose",
    description: "🔴 For those moments when life gets too serious. Break glass in case of emergency and instantly become 47% funnier. Warning: May cause spontaneous honking.",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
    affiliateLink: "https://amazon.com/emergency-clown-nose",
    tags: ["emergency", "clown", "funny", "stress-relief"],
    isFeatured: false,
  },
  {
    title: "Canned Bread - Yes, Bread in a Can",
    description: "🍞 Bread. In a can. Because apparently we've run out of normal ways to store bread. Perfect for the apocalypse or really weird dinner parties.",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500",
    affiliateLink: "https://amazon.com/canned-bread",
    tags: ["food", "bread", "survival", "wtf"],
    isFeatured: false,
  },
  {
    title: "Pet Rock 2.0 - Now with Bluetooth",
    description: "🪨 The classic pet rock, but make it smart! This rock connects to your phone and does absolutely nothing, but with style. The future is weird.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500",
    affiliateLink: "https://amazon.com/smart-pet-rock",
    tags: ["pet", "tech", "rock", "smart"],
    isFeatured: false,
  },
  {
    title: "Mustache Pacifier",
    description: "👶 Give your baby instant sophistication with this mustache pacifier. Your infant will look like a tiny Victorian gentleman. Monocle sold separately.",
    imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500",
    affiliateLink: "https://amazon.com/mustache-pacifier",
    tags: ["baby", "mustache", "funny", "gift"],
    isFeatured: false,
  },
  {
    title: "Zombie Gnome - Garden of the Dead",
    description: "🧟 This garden gnome has seen better days. Perfect for scaring away both burglars and your neighbors. Comes pre-zombified for your convenience.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
    affiliateLink: "https://amazon.com/zombie-gnome",
    tags: ["garden", "zombie", "gnome", "scary"],
    isFeatured: false,
  },
  {
    title: "Spaghetti Measuring Tool",
    description: "🍝 Finally solve the age-old question: 'How much spaghetti is enough?' This tool measures pasta for 1-4 people. Revolutionary pasta technology!",
    imageUrl: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=500",
    affiliateLink: "https://amazon.com/spaghetti-tool",
    tags: ["kitchen", "pasta", "measuring", "useful"],
    isFeatured: false,
  },
  {
    title: "Finger Hands - Hands for Your Fingers",
    description: "✋ Put tiny hands on your fingers and achieve maximum weirdness. Perfect for tiny high-fives and confusing everyone around you. Inception level: finger.",
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500",
    affiliateLink: "https://amazon.com/finger-hands",
    tags: ["hands", "fingers", "weird", "wtf"],
    isFeatured: false,
  },
  {
    title: "Avocado Saver - Keep Your Avo Fresh",
    description: "🥑 This plastic avocado keeps your half-eaten avocado fresh. Because apparently we needed to invent fake avocados to save real avocados. Peak millennial.",
    imageUrl: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500",
    affiliateLink: "https://amazon.com/avocado-saver",
    tags: ["kitchen", "avocado", "millennial", "food"],
    isFeatured: false,
  },
  {
    title: "Taco Cat Backwards Spelled Taco Cat",
    description: "🌮 A cat-shaped taco holder that's also a palindrome. Your tacos will never be the same. Warning: May cause existential crisis about language.",
    imageUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500",
    affiliateLink: "https://amazon.com/taco-cat",
    tags: ["taco", "cat", "palindrome", "kitchen"],
    isFeatured: false,
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