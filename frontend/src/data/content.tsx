import type { ContentItem, GameObject, GroceryItem, MMPair } from "../types";
import { TeaCupSVG, KeysSVG, AppleSVG, SpectaclesSVG, BookSVG, FlowerSVG, ClockSVG, UmbrellaSVG, RiceSVG, PotatoSVG, OnionSVG, TomatoSVG, PeasSVG, CarrotSVG, BananaSVG, BreadSVG, EggSVG, MilkSVG, DalSVG, FishSVG, MangoSVG, MustardOilSVG, FlowerPotSVG, WateringCanSVG, SpadeSVG, SeedsSVG, PlantSVG, GamosaItemSVG, DiyaSVG, DholSVG, LanternSVG, CowSVG, HenSVG, BirdSVG, BroomSVG, KettleSVG, MatSVG, SchoolBagSVG, SickleSVG, LoomShuttleSVG } from "../components/illustrations";

export const F = "'Nunito', sans-serif";
export const REMEMBER_SECONDS = 15;
export const GR_SECONDS = 20;
export const today = new Date().toLocaleDateString("en-US",{ weekday:"long", month:"long", day:"numeric" });
export const timeStr = new Date().toLocaleTimeString("en-US",{ hour:"2-digit", minute:"2-digit", hour12: false });
export const LANGUAGES = ["English","Hindi","Tamil","Telugu","Kannada","Malayalam","Bengali","Gujarati"];
export const CARE_THEMES = [
  { id:"Cooking", label:"Cooking", emoji:"🍳" }, { id:"Farming", label:"Farming", emoji:"🌾" },
  { id:"Gardening", label:"Gardening", emoji:"🌱" }, { id:"Festivals", label:"Festivals", emoji:"🪔" },
  { id:"Animals", label:"Animals", emoji:"🐄" }, { id:"Household", label:"Household", emoji:"🏠" },
  { id:"Profession", label:"Profession", emoji:"📚" },
] as const;
export const activities = [
  { id:1, label:"Memory Recall Game", time:"5 min", icon:"🧠", accent:"#8B7BC8", bg:"#F0ECFD" },
  { id:2, label:"Morning Medicine", time:"8:00 AM", icon:"💊", accent:"#E9A080", bg:"#FFF0EA" },
  { id:3, label:"Drink Water", time:"10:00 AM", icon:"💧", accent:"#5BBCD6", bg:"#E5F6FC" },
  { id:4, label:"Evening Walk", time:"6:00 PM", icon:"🚶", accent:"#C97A96", bg:"#FCEEF3" },
];
export function shuffle<T>(arr: T[]): T[] { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

export const ALL_OBJECTS: GameObject[] = [
  { id:"teacup",     label:"Tea Cup",    correct:true,  bg:"#FFF3EC", accent:"#E9A080", Illustration:TeaCupSVG     },
  { id:"keys",       label:"Keys",       correct:true,  bg:"#F0ECFD", accent:"#8B7BC8", Illustration:KeysSVG       },
  { id:"apple",      label:"Apple",      correct:true,  bg:"#FFF0F4", accent:"#D96B8A", Illustration:AppleSVG      },
  { id:"spectacles", label:"Spectacles", correct:true,  bg:"#E8F5FC", accent:"#4BAAC8", Illustration:SpectaclesSVG },
  { id:"book",       label:"Book",       correct:false, bg:"#FFF4EE", accent:"#E9A080", Illustration:BookSVG       },
  { id:"flower",     label:"Flower",     correct:false, bg:"#FFF0F4", accent:"#D96B8A", Illustration:FlowerSVG     },
  { id:"clock",      label:"Clock",      correct:false, bg:"#F0ECFD", accent:"#8B7BC8", Illustration:ClockSVG      },
  { id:"umbrella",   label:"Umbrella",   correct:false, bg:"#E8F5FC", accent:"#4BAAC8", Illustration:UmbrellaSVG   },
];

export const ALL_GROCERIES: GroceryItem[] = [
  { id:"rice",    label:"Rice",    correct:true,  bg:"#FFF8EC", accent:"#C8A860", Illustration:RiceSVG    },
  { id:"potato",  label:"Potato",  correct:true,  bg:"#FFF4E0", accent:"#C8A860", Illustration:PotatoSVG  },
  { id:"onion",   label:"Onion",   correct:true,  bg:"#FDF0F8", accent:"#C870A0", Illustration:OnionSVG   },
  { id:"tomato",  label:"Tomato",  correct:true,  bg:"#FFF0F0", accent:"#E84848", Illustration:TomatoSVG  },
  { id:"peas",    label:"Peas",    correct:true,  bg:"#F0FAE8", accent:"#60B030", Illustration:PeasSVG    },
  { id:"carrot",  label:"Carrot",  correct:false, bg:"#FFF4EC", accent:"#F07830", Illustration:CarrotSVG  },
  { id:"banana",  label:"Banana",  correct:false, bg:"#FFFBE8", accent:"#D8A010", Illustration:BananaSVG  },
  { id:"bread",   label:"Bread",   correct:false, bg:"#FFF8EC", accent:"#D8943A", Illustration:BreadSVG   },
  { id:"egg",     label:"Egg",     correct:false, bg:"#FFFDF0", accent:"#C8A840", Illustration:EggSVG     },
  { id:"milk",    label:"Milk",    correct:false, bg:"#EEF8FC", accent:"#4BAAC8", Illustration:MilkSVG    },
];


// ─── Personalisation: content library ─────────────────────────────────────────

export const CONTENT_LIBRARY: ContentItem[] = [
  // Cooking / Kitchen
  { id:"rice",        label:"Rice",         bg:"#FFF8EC", accent:"#C8A860", themes:["Cooking"],                    Illustration:RiceSVG        },
  { id:"potato",      label:"Potato",       bg:"#FFF4E0", accent:"#C8A860", themes:["Cooking","Farming"],          Illustration:PotatoSVG      },
  { id:"onion",       label:"Onion",        bg:"#FDF0F8", accent:"#C870A0", themes:["Cooking"],                    Illustration:OnionSVG       },
  { id:"tomato",      label:"Tomato",       bg:"#FFF0F0", accent:"#E84848", themes:["Cooking"],                    Illustration:TomatoSVG      },
  { id:"peas",        label:"Peas",         bg:"#F0FAE8", accent:"#60B030", themes:["Cooking","Gardening"],        Illustration:PeasSVG        },
  { id:"carrot",      label:"Carrot",       bg:"#FFF4EC", accent:"#F07830", themes:["Cooking","Gardening"],        Illustration:CarrotSVG      },
  { id:"banana",      label:"Banana",       bg:"#FFFBE8", accent:"#D8A010", themes:["Cooking","Festivals"],        Illustration:BananaSVG      },
  { id:"bread",       label:"Bread",        bg:"#FFF8EC", accent:"#D8943A", themes:["Cooking"],                    Illustration:BreadSVG       },
  { id:"egg",         label:"Egg",          bg:"#FFFDF0", accent:"#C8A840", themes:["Cooking","Farming"],          Illustration:EggSVG         },
  { id:"milk",        label:"Milk",         bg:"#EEF8FC", accent:"#4BAAC8", themes:["Cooking","Farming"],          Illustration:MilkSVG        },
  { id:"dal",         label:"Dal",          bg:"#FFF4E8", accent:"#E88040", themes:["Cooking"],                    Illustration:DalSVG         },
  { id:"fish",        label:"Fish",         bg:"#E8F8FF", accent:"#3CAAD8", themes:["Cooking","Animals"],          Illustration:FishSVG        },
  { id:"mango",       label:"Mango",        bg:"#FFF8E0", accent:"#E8A820", themes:["Cooking","Festivals"],        Illustration:MangoSVG       },
  { id:"mustardoil",  label:"Mustard Oil",  bg:"#FFF8E0", accent:"#D8C020", themes:["Cooking"],                    Illustration:MustardOilSVG  },
  // Gardening
  { id:"flowerpot",   label:"Flower Pot",   bg:"#FFF0E8", accent:"#C87840", themes:["Gardening"],                  Illustration:FlowerPotSVG   },
  { id:"wateringcan", label:"Watering Can", bg:"#E8F4FF", accent:"#4898D8", themes:["Gardening"],                  Illustration:WateringCanSVG },
  { id:"spade",       label:"Spade",        bg:"#F0F0F4", accent:"#7888A8", themes:["Gardening","Farming","Profession"],Illustration:SpadeSVG  },
  { id:"seeds",       label:"Seeds",        bg:"#F8F4E8", accent:"#9A7840", themes:["Gardening","Farming"],        Illustration:SeedsSVG       },
  { id:"plant",       label:"Plant",        bg:"#F0FAF0", accent:"#50A050", themes:["Gardening"],                  Illustration:PlantSVG       },
  // Festivals / Culture
  { id:"gamosaitem",  label:"Gamosa",       bg:"#FEF0F0", accent:"#D03028", themes:["Festivals"],                  Illustration:GamosaItemSVG  },
  { id:"diya",        label:"Diya",         bg:"#FFF8E8", accent:"#E8A820", themes:["Festivals"],                  Illustration:DiyaSVG        },
  { id:"dhol",        label:"Dhol",         bg:"#FDF0F8", accent:"#C87038", themes:["Festivals"],                  Illustration:DholSVG        },
  { id:"lantern",     label:"Lantern",      bg:"#FFF8E0", accent:"#D8A020", themes:["Festivals","Household"],      Illustration:LanternSVG     },
  // Animals / Nature
  { id:"cow",         label:"Cow",          bg:"#F8FAF4", accent:"#688848", themes:["Animals","Farming"],          Illustration:CowSVG         },
  { id:"hen",         label:"Hen",          bg:"#FFF8EC", accent:"#E89840", themes:["Animals","Farming"],          Illustration:HenSVG         },
  { id:"bird",        label:"Bird",         bg:"#E8F4FF", accent:"#4898C8", themes:["Animals"],                    Illustration:BirdSVG        },
  // Household
  { id:"broom",       label:"Broom",        bg:"#F8F4E8", accent:"#9A7840", themes:["Household"],                  Illustration:BroomSVG       },
  { id:"kettle",      label:"Kettle",       bg:"#EEF4FF", accent:"#5888C8", themes:["Household","Cooking"],        Illustration:KettleSVG      },
  { id:"umbrella",    label:"Umbrella",     bg:"#E8F5FC", accent:"#4BAAC8", themes:["Household"],                  Illustration:UmbrellaSVG    },
  { id:"mat",         label:"Mat",          bg:"#FFF8E8", accent:"#B89840", themes:["Household"],                  Illustration:MatSVG         },
  // Profession
  { id:"schoolbag",   label:"School Bag",   bg:"#F0F4FF", accent:"#6878C8", themes:["Profession"],                 Illustration:SchoolBagSVG   },
  { id:"sickle",      label:"Sickle",       bg:"#F4F4F0", accent:"#808860", themes:["Farming","Profession"],       Illustration:SickleSVG      },
  { id:"loomshuttle", label:"Loom Shuttle", bg:"#F8F4EC", accent:"#B88848", themes:["Profession"],                 Illustration:LoomShuttleSVG },
];

export function buildGRGame(themes: string[]): GroceryItem[] {
  const themed    = themes.length === 0 ? CONTENT_LIBRARY
    : CONTENT_LIBRARY.filter(item => item.themes.some(t => themes.includes(t)));
  const nonThemed = CONTENT_LIBRARY.filter(item => !item.themes.some(t => themes.includes(t)));
  const correctPool = shuffle(themed.length >= 5 ? [...themed] : [...themed, ...nonThemed]);
  const correctItems = correctPool.slice(0, 5);
  const correctIds   = new Set(correctItems.map(i => i.id));
  const distractors  = shuffle(CONTENT_LIBRARY.filter(i => !correctIds.has(i.id))).slice(0, 5);
  return [
    ...correctItems.map(item => ({ id:item.id, label:item.label, correct:true,  bg:item.bg, accent:item.accent, Illustration:item.Illustration })),
    ...distractors .map(item => ({ id:item.id, label:item.label, correct:false, bg:item.bg, accent:item.accent, Illustration:item.Illustration })),
  ];
}

export function buildMMPairs(themes: string[]): MMPair[] {
  const themed    = themes.length === 0 ? CONTENT_LIBRARY
    : CONTENT_LIBRARY.filter(item => item.themes.some(t => themes.includes(t)));
  const nonThemed = CONTENT_LIBRARY.filter(item => !item.themes.some(t => themes.includes(t)));
  const pool = shuffle(themed.length >= 6 ? [...themed] : [...themed, ...nonThemed]);
  return pool.slice(0, 6).map((item, i) => ({
    pairId:      i + 1,
    label:       item.label,
    frontBg:     item.bg,
    Illustration:item.Illustration,
  }));
}


