import { Point2d } from "../geometry";

const rawList = [
  {
    id: "1001",
    x: 0.8152563701791398,
    y: 0.5271300009750255,
  },
  {
    id: "1002",
    x: 0.6636049745856181,
    y: 0.7776371128871944,
  },
  {
    id: "1003",
    x: 0.13658252918344238,
    y: 0.5573325656751065,
  },
  {
    id: "1004",
    x: 0.2939487579754252,
    y: 0.2988643094128982,
  },
  {
    id: "1005",
    x: 0.05710769135652938,
    y: 0.8550848481139981,
  },
  {
    id: "1006",
    x: 0.058601243174710715,
    y: 0.0641743864607347,
  },
  {
    id: "1007",
    x: 0.19823803651243432,
    y: 0.41921249475048317,
  },
  {
    id: "1008",
    x: 0.20509796470168573,
    y: 0.72563801988787,
  },
  {
    id: "1009",
    x: 0.6476473997142576,
    y: 0.9063439313494566,
  },
  {
    id: "1010",
    x: 0.5450100630114243,
    y: 0.4399880259895754,
  },
  {
    id: "1011",
    x: 0.10794816935374651,
    y: 0.520756236424871,
  },
  {
    id: "1012",
    x: 0.8358900896538572,
    y: 0.5410584035239949,
  },
  {
    id: "1013",
    x: 0.5019860118557133,
    y: 0.33052484626689393,
  },
  {
    id: "1014",
    x: 0.4557598385502384,
    y: 0.8686046593013828,
  },
  {
    id: "1015",
    x: 0.7703096194948469,
    y: 0.3088126575485719,
  },
  {
    id: "1016",
    x: 0.42519615911573316,
    y: 0.9452409530870312,
  },
  {
    id: "1017",
    x: 0.3188576458524135,
    y: 0.4395721931295329,
  },
  {
    id: "1018",
    x: 0.22193683402952402,
    y: 0.3713884461983781,
  },
  {
    id: "1019",
    x: 0.4443193778812695,
    y: 0.11748614196812324,
  },
  {
    id: "1020",
    x: 0.39183366852098467,
    y: 0.8369775619806894,
  },
  {
    id: "1021",
    x: 0.16315586669920834,
    y: 0.37950678107080615,
  },
  {
    id: "1022",
    x: 0.3099910056780033,
    y: 0.5468031938791378,
  },
  {
    id: "1023",
    x: 0.674418617050903,
    y: 0.530966237508532,
  },
  {
    id: "1024",
    x: 0.6547039210880501,
    y: 0.6414373536879854,
  },
  {
    id: "1025",
    x: 0.9992604238797616,
    y: 0.2814422938791741,
  },
  {
    id: "1026",
    x: 0.07572587050074286,
    y: 0.9410717093931107,
  },
  {
    id: "1027",
    x: 0.5878257108617577,
    y: 0.5815414126527343,
  },
  {
    id: "1028",
    x: 0.4401566321216748,
    y: 0.5000875463960164,
  },
  {
    id: "1029",
    x: 0.5410889956093616,
    y: 0.2496619473253019,
  },
  {
    id: "1030",
    x: 0.08914192195389159,
    y: 0.44691483458665715,
  },
  {
    id: "1031",
    x: 0.7400665105375168,
    y: 0.4500072878694812,
  },
  {
    id: "1032",
    x: 0.62079266489935,
    y: 0.26632436082998545,
  },
  {
    id: "1033",
    x: 0.719494025390724,
    y: 0.12056627707950596,
  },
  {
    id: "1034",
    x: 0.6180540587906038,
    y: 0.28073248604040524,
  },
  {
    id: "1035",
    x: 0.6355888225721309,
    y: 0.5712034065835996,
  },
  {
    id: "1036",
    x: 0.2279574921501848,
    y: 0.12270101487240237,
  },
  {
    id: "1037",
    x: 0.8018467316723572,
    y: 0.5887492022387382,
  },
  {
    id: "1038",
    x: 0.5908165931513956,
    y: 0.2020616765327472,
  },
  {
    id: "1039",
    x: 0.2570388192698976,
    y: 0.8459810814330653,
  },
  {
    id: "1040",
    x: 0.9036738267315838,
    y: 0.42780236259834803,
  },
  {
    id: "1041",
    x: 0.04717940406573096,
    y: 0.6360826209456212,
  },
  {
    id: "1042",
    x: 0.9925309796006543,
    y: 0.07532481082421238,
  },
  {
    id: "1043",
    x: 0.537507342532282,
    y: 0.2208463709599069,
  },
  {
    id: "1044",
    x: 0.326802955348205,
    y: 0.7319959179805595,
  },
  {
    id: "1045",
    x: 0.1491184005892996,
    y: 0.69692697335457,
  },
  {
    id: "1046",
    x: 0.6054533788626899,
    y: 0.5713214552183341,
  },
  {
    id: "1047",
    x: 0.45566540775071407,
    y: 0.34059175189228696,
  },
  {
    id: "1048",
    x: 0.8681348551353787,
    y: 0.7760689629415132,
  },
  {
    id: "1049",
    x: 0.7912746453704693,
    y: 0.9316047291525735,
  },
  {
    id: "1050",
    x: 0.923062060320303,
    y: 0.41911511564705695,
  },
  {
    id: "1051",
    x: 0.6772604186086861,
    y: 0.6140912003441417,
  },
  {
    id: "1052",
    x: 0.1443382597765801,
    y: 0.4259246386636153,
  },
  {
    id: "1053",
    x: 0.9953422207411509,
    y: 0.4502001854266584,
  },
  {
    id: "1054",
    x: 0.36927566818202573,
    y: 0.8912670360342432,
  },
  {
    id: "1055",
    x: 0.9634169694052854,
    y: 0.9091122123426736,
  },
  {
    id: "1056",
    x: 0.4800658696267033,
    y: 0.07253259458091343,
  },
  {
    id: "1057",
    x: 0.47341574042563517,
    y: 0.6877732107849066,
  },
  {
    id: "1058",
    x: 0.3451774797827627,
    y: 0.4381316417811516,
  },
  {
    id: "1059",
    x: 0.1513890096495214,
    y: 0.2547712436945664,
  },
  {
    id: "1060",
    x: 0.4341591637874258,
    y: 0.8831702228832845,
  },
  {
    id: "1061",
    x: 0.7202743540144585,
    y: 0.41047623165697544,
  },
  {
    id: "1062",
    x: 0.32491105904439377,
    y: 0.1546650070842639,
  },
  {
    id: "1063",
    x: 0.6685777751602928,
    y: 0.5144000123549965,
  },
  {
    id: "1064",
    x: 0.4234061562094473,
    y: 0.653132234220237,
  },
  {
    id: "1065",
    x: 0.12276187822943796,
    y: 0.013088582163099716,
  },
  {
    id: "1066",
    x: 0.46049480598303005,
    y: 0.7030080283354314,
  },
  {
    id: "1067",
    x: 0.6041439011240097,
    y: 0.07687511807213654,
  },
  {
    id: "1068",
    x: 0.21447679394723584,
    y: 0.8230719529040036,
  },
  {
    id: "1069",
    x: 0.7805596755380633,
    y: 0.6523815032058329,
  },
  {
    id: "1070",
    x: 0.2972477883029485,
    y: 0.5330660806164813,
  },
  {
    id: "1071",
    x: 0.21896803210485016,
    y: 0.6885485650230765,
  },
  {
    id: "1072",
    x: 0.9434959263349398,
    y: 0.2829830691880362,
  },
  {
    id: "1073",
    x: 0.6733619075244528,
    y: 0.65536943256824,
  },
  {
    id: "1074",
    x: 0.5394815810655751,
    y: 0.5228960104316804,
  },
  {
    id: "1075",
    x: 0.9150260565672166,
    y: 0.675127001112847,
  },
  {
    id: "1076",
    x: 0.021967323245459358,
    y: 0.12621313753593233,
  },
  {
    id: "1077",
    x: 0.5095603054555669,
    y: 0.5555496420817805,
  },
  {
    id: "1078",
    x: 0.22475793481079243,
    y: 0.03351613839530354,
  },
  {
    id: "1079",
    x: 0.08458735268985018,
    y: 0.3269970782659839,
  },
  {
    id: "1080",
    x: 0.5700148157735496,
    y: 0.8594185255220879,
  },
  {
    id: "1081",
    x: 0.08843342741070526,
    y: 0.11579761981150538,
  },
  {
    id: "1082",
    x: 0.615117262348901,
    y: 0.3046862842221665,
  },
  {
    id: "1083",
    x: 0.6850419639835656,
    y: 0.08321010690306663,
  },
  {
    id: "1084",
    x: 0.77553278049644,
    y: 0.6048577172105944,
  },
  {
    id: "1085",
    x: 0.12913542861052885,
    y: 0.7795513254968784,
  },
  {
    id: "1086",
    x: 0.9003084902165417,
    y: 0.39554169990898,
  },
  {
    id: "1087",
    x: 0.8554304064120666,
    y: 0.3793641173417257,
  },
  {
    id: "1088",
    x: 0.8444037902117438,
    y: 0.16456658536763014,
  },
  {
    id: "1089",
    x: 0.6391452930778192,
    y: 0.36066947407856875,
  },
  {
    id: "1090",
    x: 0.8354525762471543,
    y: 0.6671505139652916,
  },
  {
    id: "1091",
    x: 0.9558618718751484,
    y: 0.36073863605324386,
  },
  {
    id: "1092",
    x: 0.6833509235189117,
    y: 0.34176846120512194,
  },
  {
    id: "1093",
    x: 0.04483770716651092,
    y: 0.27834619361559443,
  },
  {
    id: "1094",
    x: 0.1100516692235336,
    y: 0.3472436682953992,
  },
  {
    id: "1095",
    x: 0.788229054309211,
    y: 0.1025925331893991,
  },
  {
    id: "1096",
    x: 0.4532237833135504,
    y: 0.603194708090488,
  },
  {
    id: "1097",
    x: 0.7275353271061855,
    y: 0.3962666617404049,
  },
  {
    id: "1098",
    x: 0.8630799072504625,
    y: 0.010239211427921724,
  },
  {
    id: "1099",
    x: 0.22648834045420707,
    y: 0.611388761506179,
  },
  {
    id: "1100",
    x: 0.679080251896693,
    y: 0.7430738878351999,
  },
];

function getPointList() {
  return rawList.map((raw) => {
    return new Point2d(raw.x, raw.y, raw.id);
  });
}

export const pointList = getPointList();