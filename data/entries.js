const entries = [
  {
    id: "lullaby-01",
    title: {
      km: "បំពេរកូន",
      en: "Lullaby (Bompe Kon)",
    },
    description: {
      km: "បទចម្រៀងបំពេរកូនបែបបុរាណ ដែលម្ដាយ បងស្រី និងលោកយាយក្នុងប្រទេសកម្ពុជាច្រៀងដើម្បីឲ្យកូនៗគេងលក់ស្រួល។",
      en: "Traditional lullaby sung by mothers, sisters, and grandmothers in Cambodia to soothe their children to sleep.",
    },
    contributor: {
      km: "ថោង អមរា",
      en: "Thorng Amara",
    },
    place: {
      km: "តាកែវ",
      en: "Takeo",
    },
    image: "/images/lullaby-01.jpg",
    audio: "/audio/lullaby-01.mp3",
    category: "Lullaby",
    language: "Khmer",
  },
  {
    id: "lullaby-02",
    title: {
      km: "មាន់រងាវ",
      en: "Rooster Crowing (Morn Rongeav)",
    },
    description: {
      km: "នេះជាចម្រៀងដែលច្រៀងឲ្យក្មេងៗគេងលក់ព្រោះវាមានសំលេងរន្តំចិត្ត។",
      en: "A song sang to help the children fall asleep, with a voice that soothes the heart.",
    },
    contributor: {
      km: "ម៉ាង​ ម៉ាលីស",
      en: "Mang Malis",
    },
    place: {
      km: "តាកែវ",
      en: "Takeo",
    },
    image: "/images/lullaby-02.jpg",
    audio: "/audio/lullaby-02.mp3",
    category: "Lullaby",
    language: "Khmer",
  },
  {
    id: "lullaby-03",
    title: {
      km: "ពេលមេឃស្រទុំ",
      en: "Gloomy Sky (Pel Mek Srotom)",
    },
    description: {
      km: "ជាបទដែលមានអត្ថន័យក្រៀមក្រោះ បង្កប់ដោយមនោសញ្ចេតនាជ្រាលជ្រៅ ដែលពោរពេញដោយការស្រណោះស្រទន់",
      en: "A song of deep, melancholy emotion, filled with tenderness and affection.",
    },
    contributor: {
      km: "ម៉ាង​ ម៉ាលីស",
      en: "Mang Malis",
    },
    place: {
      km: "តាកែវ",
      en: "Takeo",
    },
    image: "/images/lullaby-03.jpg",
    audio: "/audio/lullaby-03.mp3",
    category: "Lullaby",
    language: "Khmer",
  },
  {
    id: "lullaby-04",
    title: {
      km: "តាក់ទីងណឹងៗ",
      en: "Tak Ting Nung Nung",
    },
    description: {
      km: "ជាចម្រៀងដែលនិយាយពីបងស្រីបានច្រៀងដើម្បីបំពេរឲ្យប្អូនៗរបស់គេគេងលក់ពេលប្អូនយំ។",
      en: "A song that many older sisters sang to soothe their younger siblings to sleep when their younger siblings were crying.",
    },
    contributor: {
      km: "សាង​ គន្ធា",
      en: "Seang Kunthea",
    },
    place: {
      km: "តាកែវ",
      en: "Takeo",
    },
    image: "/images/lullaby-04.jpg",
    audio: "/audio/lullaby-04.mp3",
    category: "Lullaby",
    language: "Khmer",
  },
  {
    id: "lullaby-05",
    title: {
      km: "ស្រណោះម្ដាយថ្នម",
      en: "Reminiscing Mother's Love (Sronos Mday Thnom)",
    },
    description: {
      km: "ជាបទបង្កប់ដោយមនោសញ្ចេតនាពីម្តាយស្រឡាញ់មើលថែរកូនពីតូចដល់ពេញវ័យរៀបការ។",
      en: "A song of a mother's love, cherishing her child from infancy until they grow up and marry.",
    },
    contributor: {
      km: "ខាត់ សុឃីម",
      en: "Khat Sukheam",
    },
    place: {
      km: "តាកែវ",
      en: "Takeo",
    },
    image: "/images/lullaby-05.jpg",
    audio: "/audio/lullaby-05.mp3",
    category: "Lullaby",
    language: "Khmer",
  },
  {
    id: "lullaby-06",
    title: {
      km: "យូរឆ្នាំដែលចាំអូន",
      en: "Years of waiting for you (Yoo Chnam Del Cham Aun)",
    },
    description: {
      km: "បទនេះមានភាពស្រទន់បង្ហាញពីសេចក្តីស្នេហាដ៏ស្មោះស្ម័គ្រការរង់ចាំនិងក្តីនឹករលឹកដែលឆ្លងកាត់ពេលវេលាយ៉ាងយូរ។",
      en: "This song is gentle, showing true love, waiting, and longing that lasts for a long time.",
    },
    contributor: {
      km: "សាទ គន្ធី",
      en: "Sath Kunthy",
    },
    place: {
      km: "តាកែវ",
      en: "Takeo",
    },
    image: "/images/lullaby-06.jpg",
    audio: "/audio/lullaby-06.mp3",
    category: "Lullaby",
    language: "Khmer",
  },
  {
    id: "lullaby-07",
    title: {
      km: "ជំនោរប៉ៃលិន",
      en: "The breeze of Pailin (Jumno Pailin)",
    },
    description: {
      km: "បទនេះរៀបរាប់ពីខ្យល់ត្រជាក់ដែលបក់នាំមកនូវអនុស្សាវរីយ៍ និងក្តីនឹករលឹក",
      en: "It is a timeless song filled with nostalgia and soft emotion.",
    },
    contributor: {
      km: "សាទ គន្ធី",
      en: "Sath Kunthy",
    },
    place: {
      km: "តាកែវ",
      en: "Takeo",
    },
    image: "/images/lullaby-07.jpg",
    audio: "/audio/lullaby-07.mp3",
    category: "Lullaby",
    language: "Khmer",
  },
  {
    id: "lullaby-08",
    title: {
      km: "កូនស្រីអ្នកនេសាទ",
      en: "The Fisherman's Daughter (Kon Srey Neak Nesat)",
    },
    description: {
      km: "បទចម្រៀងដ៏ស្រទន់និងរំលេចពីមនោសញ្ចេតនាដ៏ស៊ីជម្រៅនាំយើងឱ្យស្រមៃឃើញនូវសម្រស់ធម្មជាតិ និងភាពបរិសុទ្ធនៃបេះដូងកូនស្រីអ្នកនេសាទ",
      en: "The song portrays a touching story of simple life, devotion, and gentle emotion along the peaceful waterside.",
    },
    contributor: {
      km: "សាទ គន្ធី",
      en: "Sath Kunthy",
    },
    place: {
      km: "តាកែវ",
      en: "Takeo",
    },
    image: "/images/lullaby-08.jpg",
    audio: "/audio/lullaby-08.mp3",
    category: "Lullaby",
    language: "Khmer",
  },
];

export default entries;
