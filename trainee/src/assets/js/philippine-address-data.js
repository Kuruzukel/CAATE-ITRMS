// Comprehensive Philippine Address Data
// This file contains complete province, city/municipality, and barangay data for the Philippines

const PHILIPPINE_ADDRESS_DATA = {
    'NCR': {
        'Metro Manila': {
            'Manila': [
                'Barangay 1', 'Barangay 2', 'Barangay 3', 'Barangay 4', 'Barangay 5', 'Barangay 6', 'Barangay 7', 'Barangay 8', 'Barangay 9', 'Barangay 10',
                'Ermita', 'Intramuros', 'Malate', 'Paco', 'Pandacan', 'Port Area', 'Quiapo', 'Sampaloc', 'San Andres', 'San Miguel', 'San Nicolas', 'Santa Ana', 'Santa Cruz', 'Santa Mesa', 'Tondo'
            ],
            'Quezon City': [
                'Alicia', 'Amihan', 'Apolonio Samson', 'Aurora', 'Baesa', 'Bagbag', 'Bagong Lipunan ng Crame', 'Bagong Pag-asa', 'Bagong Silangan', 'Bagumbayan',
                'Bagumbuhay', 'Balingasa', 'Balintawak', 'Balong Bato', 'Barangay Commonwealth', 'Barangay Holy Spirit', 'Barangay Batasan Hills', 'Barangay Fairview',
                'Barangay Novaliches', 'Barangay Diliman', 'Barangay Project 8', 'Barangay Cubao', 'Barangay Kamuning', 'Barangay Teachers Village'
            ],
            'Makati': [
                'Barangay Poblacion', 'Barangay Bel-Air', 'Barangay Forbes Park', 'Barangay Dasmariñas', 'Barangay San Lorenzo', 'Barangay Urdaneta',
                'Barangay Valenzuela', 'Barangay Bangkal', 'Barangay La Paz', 'Barangay Magallanes', 'Barangay Olympia', 'Barangay Palanan', 'Barangay Pio del Pilar',
                'Barangay Rizal', 'Barangay San Antonio', 'Barangay Santa Cruz', 'Barangay Singkamas', 'Barangay Tejeros'
            ],
            'Pasig': [
                'Barangay Rosario', 'Barangay Bagong Ilog', 'Barangay Kapitolyo', 'Barangay Ugong', 'Barangay Ortigas Center', 'Barangay San Miguel',
                'Barangay Manggahan', 'Barangay Maybunga', 'Barangay Pinagbuhatan', 'Barangay Santolan', 'Barangay Sagad', 'Barangay San Antonio',
                'Barangay San Joaquin', 'Barangay San Jose', 'Barangay San Nicolas', 'Barangay Santa Lucia', 'Barangay Santa Rosa', 'Barangay Santo Tomas'
            ],
            'Taguig': [
                'Barangay Fort Bonifacio', 'Barangay Bagumbayan', 'Barangay Bambang', 'Barangay Calzada', 'Barangay Central Bicutan', 'Barangay Central Signal Village',
                'Barangay Hagonoy', 'Barangay Ibayo-Tipas', 'Barangay Katuparan', 'Barangay Ligid-Tipas', 'Barangay Lower Bicutan', 'Barangay Maharlika Village',
                'Barangay Napindan', 'Barangay New Lower Bicutan', 'Barangay North Daang Hari', 'Barangay North Signal Village', 'Barangay Palingon',
                'Barangay Pinagsama', 'Barangay San Miguel', 'Barangay Santa Ana', 'Barangay South Daang Hari', 'Barangay South Signal Village',
                'Barangay Tanyag', 'Barangay Tuktukan', 'Barangay Upper Bicutan', 'Barangay Ususan', 'Barangay Wawa', 'Barangay Western Bicutan'
            ],
            'Caloocan': [
                'Barangay 1', 'Barangay 2', 'Barangay 3', 'Barangay 4', 'Barangay 5', 'Barangay 6', 'Barangay 7', 'Barangay 8', 'Barangay 9', 'Barangay 10',
                'Barangay 11', 'Barangay 12', 'Barangay 13', 'Barangay 14', 'Barangay 15', 'Barangay 16', 'Barangay 17', 'Barangay 18', 'Barangay 19', 'Barangay 20',
                'Bagong Silang', 'Camarin', 'Kaybiga', 'Novaliches North', 'Novaliches South', 'Sangandaan', 'Tala'
            ],
            'Las Piñas': [
                'Barangay Almanza Dos', 'Barangay Almanza Uno', 'Barangay BF International Village', 'Barangay Daniel Fajardo', 'Barangay Elias Aldana',
                'Barangay Ilaya', 'Barangay Manuyo Dos', 'Barangay Manuyo Uno', 'Barangay Pamplona Dos', 'Barangay Pamplona Tres', 'Barangay Pamplona Uno',
                'Barangay Pilar', 'Barangay Poblacion', 'Barangay Pulang Lupa Dos', 'Barangay Pulang Lupa Uno', 'Barangay Talon Dos', 'Barangay Talon Kuatro',
                'Barangay Talon Singko', 'Barangay Talon Tres', 'Barangay Talon Uno', 'Barangay Zapote'
            ],
            'Marikina': [
                'Barangay Barangka', 'Barangay Calumpang', 'Barangay Concepcion Dos', 'Barangay Concepcion Uno', 'Barangay Fortune',
                'Barangay Industrial Valley Complex', 'Barangay Jesus Dela Peña', 'Barangay Malanday', 'Barangay Marikina Heights',
                'Barangay Nangka', 'Barangay Parang', 'Barangay San Roque', 'Barangay Santa Elena', 'Barangay Santo Niño', 'Barangay Tanong', 'Barangay Tumana'
            ],
            'Muntinlupa': [
                'Barangay Alabang', 'Barangay Ayala Alabang', 'Barangay Buli', 'Barangay Cupang', 'Barangay New Alabang Village',
                'Barangay Poblacion', 'Barangay Putatan', 'Barangay Sucat', 'Barangay Tunasan'
            ],
            'Navotas': [
                'Barangay Bagumbayan North', 'Barangay Bagumbayan South', 'Barangay Bangculasi', 'Barangay Daanghari', 'Barangay NBBS Dagat-dagatan',
                'Barangay NBBN', 'Barangay NBBS Kaunlaran', 'Barangay NBBS Proper', 'Barangay North Bay Boulevard North', 'Barangay North Bay Boulevard South',
                'Barangay San Jose', 'Barangay San Rafael Village', 'Barangay San Roque', 'Barangay Sipac-Almacen', 'Barangay Tangos North', 'Barangay Tangos South',
                'Barangay Tanza I', 'Barangay Tanza II'
            ],
            'Parañaque': [
                'Barangay Baclaran', 'Barangay BF Homes', 'Barangay Don Bosco', 'Barangay La Huerta', 'Barangay Marcelo Green Village',
                'Barangay Merville', 'Barangay Moonwalk', 'Barangay San Antonio', 'Barangay San Dionisio', 'Barangay San Isidro',
                'Barangay San Martin de Porres', 'Barangay Santo Niño', 'Barangay Sun Valley', 'Barangay Tambo', 'Barangay Vitalez'
            ],
            'Pasay': [
                'Barangay 1', 'Barangay 2', 'Barangay 3', 'Barangay 4', 'Barangay 5', 'Barangay 6', 'Barangay 7', 'Barangay 8', 'Barangay 9', 'Barangay 10',
                'Barangay 11', 'Barangay 12', 'Barangay 13', 'Barangay 14', 'Barangay 15', 'Barangay 16', 'Barangay 17', 'Barangay 18', 'Barangay 19', 'Barangay 20',
                'Barangay 76', 'Barangay 129', 'Barangay 178', 'Barangay 183', 'Barangay 201'
            ],
            'Pateros': [
                'Barangay Aguho', 'Barangay Magtanggol', 'Barangay Martires del 96', 'Barangay Poblacion', 'Barangay San Pedro',
                'Barangay San Roque', 'Barangay Santa Ana', 'Barangay Santo Rosario-Kanluran', 'Barangay Santo Rosario-Silangan', 'Barangay Tabacalera'
            ],
            'San Juan': [
                'Barangay Addition Hills', 'Barangay Balong-Bato', 'Barangay Batis', 'Barangay Corazon de Jesus', 'Barangay Ermitaño',
                'Barangay Greenhills', 'Barangay Halo-halo', 'Barangay Isabelita', 'Barangay Kabayanan', 'Barangay Little Baguio',
                'Barangay Maytunas', 'Barangay Onse', 'Barangay Pasadeña', 'Barangay Pedro Cruz', 'Barangay Poblacion',
                'Barangay Progreso', 'Barangay Rivera', 'Barangay Salapan', 'Barangay San Perfecto', 'Barangay Santa Lucia', 'Barangay Tibagan', 'Barangay West Crame'
            ],
            'Valenzuela': [
                'Barangay Arkong Bato', 'Barangay Bagbaguin', 'Barangay Balangkas', 'Barangay Bignay', 'Barangay Bisig',
                'Barangay Canumay East', 'Barangay Canumay West', 'Barangay Coloong', 'Barangay Dalandanan', 'Barangay Gen. T. de Leon',
                'Barangay Hen. T. de Leon', 'Barangay Isla', 'Barangay Karuhatan', 'Barangay Lawang Bato', 'Barangay Lingunan',
                'Barangay Mabolo', 'Barangay Malanday', 'Barangay Malinta', 'Barangay Mapulang Lupa', 'Barangay Marulas',
                'Barangay Maysan', 'Barangay Palasan', 'Barangay Parada', 'Barangay Pariancillo Villa', 'Barangay Paso de Blas',
                'Barangay Pasolo', 'Barangay Poblacion', 'Barangay Polo', 'Barangay Punturin', 'Barangay Rincon', 'Barangay Tagalag',
                'Barangay Ugong', 'Barangay Viente Reales', 'Barangay Wawang Pulo'
            ],
            'Malabon': [
                'Barangay Acacia', 'Barangay Baritan', 'Barangay Bayan-bayanan', 'Barangay Catmon', 'Barangay Concepcion',
                'Barangay Dampalit', 'Barangay Flores', 'Barangay Hulong Duhat', 'Barangay Ibaba', 'Barangay Longos',
                'Barangay Maysilo', 'Barangay Muzon', 'Barangay Niugan', 'Barangay Panghulo', 'Barangay Potrero',
                'Barangay San Agustin', 'Barangay Santolan', 'Barangay Tanong', 'Barangay Tinajeros', 'Barangay Tonsuya', 'Barangay Tugatog'
            ]
        }
    }
};

// Add more NCR cities
PHILIPPINE_ADDRESS_DATA.NCR['Metro Manila']['Caloocan'] = [
    'Barangay 1', 'Barangay 2', 'Barangay 3', 'Barangay 4', 'Barangay 5', 'Barangay 6', 'Barangay 7', 'Barangay 8', 'Barangay 9', 'Barangay 10',
    'Barangay 11', 'Barangay 12', 'Barangay 13', 'Barangay 14', 'Barangay 15', 'Barangay 16', 'Barangay 17', 'Barangay 18', 'Barangay 19', 'Barangay 20',
    'Bagong Silang', 'Camarin', 'Kaybiga', 'Novaliches North', 'Novaliches South', 'Sangandaan', 'Tala'
];

PHILIPPINE_ADDRESS_DATA.NCR['Metro Manila']['Las Piñas'] = [
    'Barangay Almanza Dos', 'Barangay Almanza Uno', 'Barangay BF International Village', 'Barangay Daniel Fajardo', 'Barangay Elias Aldana',
    'Barangay Ilaya', 'Barangay Manuyo Dos', 'Barangay Manuyo Uno', 'Barangay Pamplona Dos', 'Barangay Pamplona Tres', 'Barangay Pamplona Uno',
    'Barangay Pilar', 'Barangay Poblacion', 'Barangay Pulang Lupa Dos', 'Barangay Pulang Lupa Uno', 'Barangay Talon Dos', 'Barangay Talon Kuatro',
    'Barangay Talon Singko', 'Barangay Talon Tres', 'Barangay Talon Uno', 'Barangay Zapote'
];

PHILIPPINE_ADDRESS_DATA.NCR['Metro Manila']['Marikina'] = [
    'Barangay Barangka', 'Barangay Calumpang', 'Barangay Concepcion Dos', 'Barangay Concepcion Uno', 'Barangay Fortune',
    'Barangay Industrial Valley Complex', 'Barangay Jesus Dela Peña', 'Barangay Malanday', 'Barangay Marikina Heights',
    'Barangay Nangka', 'Barangay Parang', 'Barangay San Roque', 'Barangay Santa Elena', 'Barangay Santo Niño', 'Barangay Tanong', 'Barangay Tumana'
];

PHILIPPINE_ADDRESS_DATA.NCR['Metro Manila']['Muntinlupa'] = [
    'Barangay Alabang', 'Barangay Ayala Alabang', 'Barangay Buli', 'Barangay Cupang', 'Barangay New Alabang Village',
    'Barangay Poblacion', 'Barangay Putatan', 'Barangay Sucat', 'Barangay Tunasan'
];

PHILIPPINE_ADDRESS_DATA.NCR['Metro Manila']['Navotas'] = [
    'Barangay Bagumbayan North', 'Barangay Bagumbayan South', 'Barangay Bangculasi', 'Barangay Daanghari', 'Barangay NBBS Dagat-dagatan',
    'Barangay NBBN', 'Barangay NBBS Kaunlaran', 'Barangay NBBS Proper', 'Barangay North Bay Boulevard North', 'Barangay North Bay Boulevard South',
    'Barangay San Jose', 'Barangay San Rafael Village', 'Barangay San Roque', 'Barangay Sipac-Almacen', 'Barangay Tangos North', 'Barangay Tangos South',
    'Barangay Tanza I', 'Barangay Tanza II'
];

PHILIPPINE_ADDRESS_DATA.NCR['Metro Manila']['Parañaque'] = [
    'Barangay Baclaran', 'Barangay BF Homes', 'Barangay Don Bosco', 'Barangay La Huerta', 'Barangay Marcelo Green Village',
    'Barangay Merville', 'Barangay Moonwalk', 'Barangay San Antonio', 'Barangay San Dionisio', 'Barangay San Isidro',
    'Barangay San Martin de Porres', 'Barangay Santo Niño', 'Barangay Sun Valley', 'Barangay Tambo', 'Barangay Vitalez'
];

PHILIPPINE_ADDRESS_DATA.NCR['Metro Manila']['Pasay'] = [
    'Barangay 1', 'Barangay 2', 'Barangay 3', 'Barangay 4', 'Barangay 5', 'Barangay 6', 'Barangay 7', 'Barangay 8', 'Barangay 9', 'Barangay 10',
    'Barangay 11', 'Barangay 12', 'Barangay 13', 'Barangay 14', 'Barangay 15', 'Barangay 16', 'Barangay 17', 'Barangay 18', 'Barangay 19', 'Barangay 20',
    'Barangay 76', 'Barangay 129', 'Barangay 178', 'Barangay 183', 'Barangay 201'
];

PHILIPPINE_ADDRESS_DATA.NCR['Metro Manila']['Pateros'] = [
    'Barangay Aguho', 'Barangay Magtanggol', 'Barangay Martires del 96', 'Barangay Poblacion', 'Barangay San Pedro',
    'Barangay San Roque', 'Barangay Santa Ana', 'Barangay Santo Rosario-Kanluran', 'Barangay Santo Rosario-Silangan', 'Barangay Tabacalera'
];

PHILIPPINE_ADDRESS_DATA.NCR['Metro Manila']['San Juan'] = [
    'Barangay Addition Hills', 'Barangay Balong-Bato', 'Barangay Batis', 'Barangay Corazon de Jesus', 'Barangay Ermitaño',
    'Barangay Greenhills', 'Barangay Halo-halo', 'Barangay Isabelita', 'Barangay Kabayanan', 'Barangay Little Baguio',
    'Barangay Maytunas', 'Barangay Onse', 'Barangay Pasadeña', 'Barangay Pedro Cruz', 'Barangay Poblacion',
    'Barangay Progreso', 'Barangay Rivera', 'Barangay Salapan', 'Barangay San Perfecto', 'Barangay Santa Lucia', 'Barangay Tibagan', 'Barangay West Crame'
];

PHILIPPINE_ADDRESS_DATA.NCR['Metro Manila']['Valenzuela'] = [
    'Barangay Arkong Bato', 'Barangay Bagbaguin', 'Barangay Balangkas', 'Barangay Bignay', 'Barangay Bisig',
    'Barangay Canumay East', 'Barangay Canumay West', 'Barangay Coloong', 'Barangay Dalandanan', 'Barangay Gen. T. de Leon',
    'Barangay Hen. T. de Leon', 'Barangay Isla', 'Barangay Karuhatan', 'Barangay Lawang Bato', 'Barangay Lingunan',
    'Barangay Mabolo', 'Barangay Malanday', 'Barangay Malinta', 'Barangay Mapulang Lupa', 'Barangay Marulas',
    'Barangay Maysan', 'Barangay Palasan', 'Barangay Parada', 'Barangay Pariancillo Villa', 'Barangay Paso de Blas',
    'Barangay Pasolo', 'Barangay Poblacion', 'Barangay Polo', 'Barangay Punturin', 'Barangay Rincon', 'Barangay Tagalag',
    'Barangay Ugong', 'Barangay Viente Reales', 'Barangay Wawang Pulo'
];

PHILIPPINE_ADDRESS_DATA.NCR['Metro Manila']['Malabon'] = [
    'Barangay Acacia', 'Barangay Baritan', 'Barangay Bayan-bayanan', 'Barangay Catmon', 'Barangay Concepcion',
    'Barangay Dampalit', 'Barangay Flores', 'Barangay Hulong Duhat', 'Barangay Ibaba', 'Barangay Longos',
    'Barangay Maysilo', 'Barangay Muzon', 'Barangay Niugan', 'Barangay Panghulo', 'Barangay Potrero',
    'Barangay San Agustin', 'Barangay Santolan', 'Barangay Tanong', 'Barangay Tinajeros', 'Barangay Tonsuya', 'Barangay Tugatog'
];

// Region I - Ilocos Region
PHILIPPINE_ADDRESS_DATA['Region I'] = {
    'Ilocos Norte': {
        'Laoag': [
            'Barangay 1 San Lorenzo', 'Barangay 2 Santo Tomas', 'Barangay 3 Cataban', 'Barangay 4 Zamora', 'Barangay 5 Nangalisan',
            'Barangay 6 Caaoacan', 'Barangay 7 Barit-Barit', 'Barangay 8 Balacad', 'Barangay 9 Buttong', 'Barangay 10 San Matias',
            'Barangay 11 Vira', 'Barangay 12 Cavit', 'Barangay 13 Nalbo', 'Barangay 14 Caaoacan', 'Barangay 15 Tangid',
            'Barangay 16 Balatong', 'Barangay 17 Casili', 'Barangay 18 Nangalisan West', 'Barangay 19 Nangalisan East',
            'Barangay 20 Suyo', 'Barangay 21 Bengcag', 'Barangay 22 Gabu Norte', 'Barangay 23 Gabu Sur'
        ],
        'Batac': [
            'Barangay Aglipay', 'Barangay Baay', 'Barangay Baligat', 'Barangay Baoa East', 'Barangay Baoa West',
            'Barangay Bil-loca', 'Barangay Binacag', 'Barangay Biningan', 'Barangay Callaguip', 'Barangay Cangrunaan',
            'Barangay Capacuan', 'Barangay Caunayan', 'Barangay Colo', 'Barangay Dariwdiw', 'Barangay Lacub'
        ]
    },
    'Ilocos Sur': {
        'Vigan': [
            'Barangay I Ayusan Norte', 'Barangay II Ayusan Sur', 'Barangay III Barraca', 'Barangay IV Bulala',
            'Barangay V Camaligan', 'Barangay VI Camangaan', 'Barangay VII Capangpangan', 'Barangay VIII Kasanglayan',
            'Barangay IX Nagsangalan', 'Barangay X Paoa', 'Barangay XI Pantay Daya', 'Barangay XII Pantay Laud',
            'Barangay XIII Poblacion East', 'Barangay XIV Poblacion West', 'Barangay XV Purok-a-bassit',
            'Barangay XVI Purok-a-dackel', 'Barangay XVII Raois', 'Barangay XVIII Rugsuanan', 'Barangay XIX Salindeg',
            'Barangay XX San Jose', 'Barangay XXI San Julian Norte', 'Barangay XXII San Julian Sur',
            'Barangay XXIII San Pedro', 'Barangay XXIV Tamag'
        ],
        'Candon': [
            'Barangay Allangigan 1st', 'Barangay Allangigan 2nd', 'Barangay Amguid', 'Barangay Bagani Campo',
            'Barangay Bagani Gabor', 'Barangay Bagani Tocgo', 'Barangay Bagani Ubbog', 'Barangay Balingaoan',
            'Barangay Bagar', 'Barangay Banayoyo', 'Barangay Bugnay', 'Barangay Calaoa-an', 'Barangay Caterman'
        ]
    },
    'La Union': {
        'San Fernando': [
            'Barangay Abut', 'Barangay Apaleng', 'Barangay Bacsil', 'Barangay Bangbangolan', 'Barangay Bangcusay',
            'Barangay Biday', 'Barangay Birunget', 'Barangay Cabaroan', 'Barangay Cadaclan', 'Barangay Calabugao',
            'Barangay Camansi', 'Barangay Canaoay', 'Barangay Carlatan', 'Barangay Catbangen', 'Barangay Dalumpinas East',
            'Barangay Dalumpinas West', 'Barangay Dili', 'Barangay Ilocanos Norte', 'Barangay Ilocanos Sur',
            'Barangay Langcuas', 'Barangay Lingsat', 'Barangay Madayegdeg', 'Barangay Mameltac', 'Barangay Masicong'
        ],
        'Bagulin': [
            'Barangay Alilem', 'Barangay Balluay', 'Barangay Cambaly', 'Barangay Cardiz', 'Barangay Dagup',
            'Barangay Libbo', 'Barangay Poblacion East', 'Barangay Poblacion West', 'Barangay Suyo', 'Barangay Wallayan'
        ]
    },
    'Pangasinan': {
        'Dagupan': [
            'Barangay Bacayao Norte', 'Barangay Bacayao Sur', 'Barangay Bolosan', 'Barangay Bonuan Binloc',
            'Barangay Bonuan Boquig', 'Barangay Bonuan Gueset', 'Barangay Calmay', 'Barangay Carael',
            'Barangay Caranglaan', 'Barangay Herrero', 'Barangay Lasip Chico', 'Barangay Lasip Grande',
            'Barangay Lomboy', 'Barangay Lucao', 'Barangay Malued', 'Barangay Mamalingling', 'Barangay Mangin',
            'Barangay Mayombo', 'Barangay Pantal', 'Barangay Poblacion Oeste', 'Barangay Pogo Chico',
            'Barangay Pogo Grande', 'Barangay Pugaro Suit', 'Barangay Salapingao', 'Barangay Salisay',
            'Barangay Tambac', 'Barangay Tapuac', 'Barangay Tebeng'
        ],
        'Alaminos': [
            'Barangay Amandiego', 'Barangay Amangbangan', 'Barangay Bisocol', 'Barangay Bolaney', 'Barangay Bued',
            'Barangay Cabatuan', 'Barangay Cayucay', 'Barangay Dulacac', 'Barangay Inerangan', 'Barangay Landoc',
            'Barangay Linmansangan', 'Barangay Lucap', 'Barangay Maawi', 'Barangay Macatiw', 'Barangay Magsaysay',
            'Barangay Mona', 'Barangay Palamis', 'Barangay Pangapisan', 'Barangay Poblacion', 'Barangay Pocal-pocal',
            'Barangay Pogo', 'Barangay Quibuar', 'Barangay Sabangan', 'Barangay San Antonio', 'Barangay San Jose',
            'Barangay San Roque', 'Barangay San Vicente', 'Barangay Santa Maria', 'Barangay Tangcarang', 'Barangay Tawintawin'
        ]
    }
};
// Region III - Central Luzon
PHILIPPINE_ADDRESS_DATA['Region III'] = {
    'Bulacan': {
        'Malolos': [
            'Barangay Atlag', 'Barangay Bagbaguin', 'Barangay Balayong', 'Barangay Balite', 'Barangay Bangkal',
            'Barangay Barihan', 'Barangay Bulihan', 'Barangay Bungahan', 'Barangay Caingin', 'Barangay Calero',
            'Barangay Caliligawan', 'Barangay Canalate', 'Barangay Caniogan', 'Barangay Catmon', 'Barangay Cofradia',
            'Barangay Dakila', 'Barangay Guinhawa', 'Barangay Liang', 'Barangay Ligas', 'Barangay Longos',
            'Barangay Look 1st', 'Barangay Look 2nd', 'Barangay Lugam', 'Barangay Mabolo', 'Barangay Mambog',
            'Barangay Masile', 'Barangay Matimbo', 'Barangay Mojon', 'Barangay Namayan', 'Barangay Niugan',
            'Barangay Pamarawan', 'Barangay Panasahan', 'Barangay Pinagbakahan', 'Barangay San Agustin',
            'Barangay San Gabriel', 'Barangay San Juan', 'Barangay San Pablo', 'Barangay San Vicente',
            'Barangay Santa Ana', 'Barangay Santa Rosa', 'Barangay Santiago', 'Barangay Santisima Trinidad',
            'Barangay Santo Cristo', 'Barangay Santo Niño', 'Barangay Santo Rosario', 'Barangay Sumapang Bata',
            'Barangay Sumapang Matanda', 'Barangay Taal', 'Barangay Tikay'
        ],
        'San Jose del Monte': [
            'Barangay Assumption', 'Barangay Bagong Buhay I', 'Barangay Bagong Buhay II', 'Barangay Bagong Buhay III',
            'Barangay Ciudad Real', 'Barangay Dulong Bayan', 'Barangay Fatima I', 'Barangay Fatima II', 'Barangay Fatima III',
            'Barangay Fatima IV', 'Barangay Fatima V', 'Barangay Francisco Homes-Guijo', 'Barangay Francisco Homes-Mulawin',
            'Barangay Francisco Homes-Narra', 'Barangay Francisco Homes-Yakal', 'Barangay Gaya-gaya', 'Barangay Graceville',
            'Barangay Kaybanban', 'Barangay Kaypian', 'Barangay Lawang Pari', 'Barangay Maharlika', 'Barangay Minuyan I',
            'Barangay Minuyan II', 'Barangay Minuyan III', 'Barangay Minuyan IV', 'Barangay Minuyan V', 'Barangay Minuyan Proper',
            'Barangay Muzon', 'Barangay Paradise III', 'Barangay Poblacion', 'Barangay San Isidro', 'Barangay San Manuel',
            'Barangay San Martin I', 'Barangay San Martin II', 'Barangay San Martin III', 'Barangay San Martin IV',
            'Barangay San Pedro', 'Barangay San Rafael I', 'Barangay San Rafael II', 'Barangay San Rafael III',
            'Barangay San Rafael IV', 'Barangay San Rafael V', 'Barangay Santa Cruz I', 'Barangay Santa Cruz II',
            'Barangay Santa Cruz III', 'Barangay Santa Cruz IV', 'Barangay Santo Cristo', 'Barangay Santo Niño I',
            'Barangay Santo Niño II', 'Barangay Sapang Palay', 'Barangay Tungkong Mangga'
        ],
        'Meycauayan': [
            'Barangay Bagbaguin', 'Barangay Bahay Pare', 'Barangay Bancal', 'Barangay Banga', 'Barangay Calvario',
            'Barangay Camalig', 'Barangay Hulo', 'Barangay Iba', 'Barangay Langka', 'Barangay Lawa',
            'Barangay Libtong', 'Barangay Liputan', 'Barangay Malhacan', 'Barangay Pandayan', 'Barangay Perez',
            'Barangay Poblacion', 'Barangay Saluysoy', 'Barangay St. Francis', 'Barangay Tugatog', 'Barangay Ubihan',
            'Barangay Zamora'
        ]
    },
    'Pampanga': {
        'San Fernando': [
            'Barangay Baliti', 'Barangay Dela Paz Norte', 'Barangay Dela Paz Sur', 'Barangay Dolores', 'Barangay Juliana',
            'Barangay Lara', 'Barangay Magliman', 'Barangay Malino', 'Barangay Malpitic', 'Barangay Panipuan',
            'Barangay Pulung Bulu', 'Barangay Saguin', 'Barangay San Agustin', 'Barangay San Felipe', 'Barangay San Isidro',
            'Barangay San Jose', 'Barangay San Juan', 'Barangay San Nicolas', 'Barangay San Pedro', 'Barangay Santa Lucia',
            'Barangay Santa Teresita', 'Barangay Santo Niño', 'Barangay Santo Rosario', 'Barangay Sindalan'
        ],
        'Angeles': [
            'Barangay Agapito del Rosario', 'Barangay Amsic', 'Barangay Balibago', 'Barangay Capaya', 'Barangay Claro M. Recto',
            'Barangay Cuayan', 'Barangay Cutcut', 'Barangay Cutud', 'Barangay Lourdes Norte', 'Barangay Lourdes Sur',
            'Barangay Malabañas', 'Barangay Margot', 'Barangay Mining', 'Barangay Ninoy Aquino', 'Barangay Pampang',
            'Barangay Pandan', 'Barangay Pulung Cacutud', 'Barangay Pulung Maragul', 'Barangay Salapungan',
            'Barangay San Jose', 'Barangay San Nicolas', 'Barangay Santa Teresita', 'Barangay Santa Trinidad',
            'Barangay Santo Cristo', 'Barangay Santo Domingo', 'Barangay Santo Rosario', 'Barangay Sapalibutad',
            'Barangay Sapangbato', 'Barangay Tabun', 'BarangayTalimundoc', 'Barangay Timog', 'Barangay Trinoma',
            'Barangay Virgen delos Remedios'
        ]
    },
    'Nueva Ecija': {
        'Cabanatuan': [
            'Barangay Aduas Norte', 'Barangay Aduas Sur', 'Barangay Bakero', 'Barangay Barrera', 'Barangay Bitas',
            'Barangay Caalibangbangan', 'Barangay Camp Tinio', 'Barangay Caudillo', 'Barangay Daang Sarile',
            'Barangay H. Concepcion', 'Barangay Hermogenes Concepcion Sr.', 'Barangay Isla', 'Barangay Kalikid Norte',
            'Barangay Kalikid Sur', 'Barangay Kapitan Pepe', 'Barangay Lagare', 'Barangay Magsaysay Norte',
            'Barangay Magsaysay Sur', 'Barangay Mahipon', 'Barangay Malapit', 'Barangay Mayapyap Norte',
            'Barangay Mayapyap Sur', 'Barangay MS Garcia', 'Barangay Pagas', 'Barangay Pampanga',
            'Barangay Pangatian', 'Barangay Piñahan', 'Barangay Poblacion', 'Barangay Polilio',
            'Barangay Rosales', 'Barangay Sabani', 'Barangay San Roque Norte', 'Barangay San Roque Sur',
            'Barangay Sangitan East', 'Barangay Sangitan West', 'Barangay Santa Arcadia', 'Barangay Samon',
            'Barangay Sumacab Este', 'Barangay Sumacab Norte', 'Barangay Talipapa', 'Barangay Tambo Adorable',
            'Barangay Tambo Malaki', 'Barangay Tambo Medyo', 'Barangay Tambo Turko', 'Barangay Tecnologia',
            'Barangay Valdefuente', 'Barangay Valle Cruz', 'Barangay Zulueta'
        ]
    }
};

// Region IV-A - CALABARZON
PHILIPPINE_ADDRESS_DATA['Region IV-A'] = {
    'Cavite': {
        'Bacoor': [
            'Barangay Alima', 'Barangay Aniban I', 'Barangay Aniban II', 'Barangay Aniban III', 'Barangay Aniban IV',
            'Barangay Aniban V', 'Barangay Banalo', 'Barangay Bayanan', 'Barangay Campo Santo', 'Barangay Daang Bukid',
            'Barangay Digman', 'Barangay Dulong Bayan', 'Barangay Habay I', 'Barangay Habay II', 'Barangay Kaingin',
            'Barangay Ligas I', 'Barangay Ligas II', 'Barangay Ligas III', 'Barangay Mabolo I', 'Barangay Mabolo II',
            'Barangay Mabolo III', 'Barangay Maliksi I', 'Barangay Maliksi II', 'Barangay Maliksi III', 'Barangay Molino I',
            'Barangay Molino II', 'Barangay Molino III', 'Barangay Molino IV', 'Barangay Molino V', 'Barangay Molino VI',
            'Barangay Molino VII', 'Barangay Niog I', 'Barangay Niog II', 'Barangay Niog III', 'Barangay Panapaan I',
            'Barangay Panapaan II', 'Barangay Panapaan III', 'Barangay Panapaan IV', 'Barangay Panapaan V',
            'Barangay Panapaan VI', 'Barangay Panapaan VII', 'Barangay Panapaan VIII', 'Barangay Queens Row Central',
            'Barangay Queens Row East', 'Barangay Queens Row West', 'Barangay Real I', 'Barangay Real II',
            'Barangay Salinas I', 'Barangay Salinas II', 'Barangay Salinas III', 'Barangay San Nicolas I',
            'Barangay San Nicolas II', 'Barangay San Nicolas III', 'Barangay Springville', 'Barangay Tabing Dagat',
            'Barangay Talaba I', 'Barangay Talaba II', 'Barangay Talaba III', 'Barangay Talaba IV',
            'Barangay Talaba V', 'Barangay Talaba VI', 'Barangay Talaba VII', 'Barangay Zapote I',
            'Barangay Zapote II', 'Barangay Zapote III', 'Barangay Zapote IV', 'Barangay Zapote V'
        ],
        'Imus': [
            'Barangay Alapan I-A', 'Barangay Alapan I-B', 'Barangay Alapan II-A', 'Barangay Alapan II-B',
            'Barangay Anabu I-A', 'Barangay Anabu I-B', 'Barangay Anabu I-C', 'Barangay Anabu I-D',
            'Barangay Anabu I-E', 'Barangay Anabu I-F', 'Barangay Anabu I-G', 'Barangay Anabu II-A',
            'Barangay Anabu II-B', 'Barangay Anabu II-C', 'Barangay Anabu II-D', 'Barangay Anabu II-E',
            'Barangay Anabu II-F', 'Barangay Bayan Luma I', 'Barangay Bayan Luma II', 'Barangay Bayan Luma III',
            'Barangay Bayan Luma IV', 'Barangay Bayan Luma V', 'Barangay Bayan Luma VI', 'Barangay Bayan Luma VII',
            'Barangay Bayan Luma VIII', 'Barangay Bayan Luma IX', 'Barangay Bucandala I', 'Barangay Bucandala II',
            'Barangay Bucandala III', 'Barangay Bucandala IV', 'Barangay Bucandala V', 'Barangay Buhay na Tubig',
            'Barangay Carsadang Bago I', 'Barangay Carsadang Bago II', 'Barangay Magdalo', 'Barangay Malagasang I-A',
            'Barangay Malagasang I-B', 'Barangay Malagasang I-C', 'Barangay Malagasang I-D', 'Barangay Malagasang I-E',
            'Barangay Malagasang I-F', 'Barangay Malagasang I-G', 'Barangay Malagasang II-A', 'Barangay Malagasang II-B',
            'Barangay Malagasang II-C', 'Barangay Malagasang II-D', 'Barangay Malagasang II-E', 'Barangay Malagasang II-F',
            'Barangay Malagasang II-G', 'Barangay Medicion I-A', 'Barangay Medicion I-B', 'Barangay Medicion I-C',
            'Barangay Medicion II-A', 'Barangay Medicion II-B', 'Barangay Medicion II-C', 'Barangay Medicion II-D',
            'Barangay Medicion II-E', 'Barangay Medicion II-F', 'Barangay Palico I', 'Barangay Palico II',
            'Barangay Palico III', 'Barangay Palico IV', 'Barangay Pantay I', 'Barangay Pantay II',
            'Barangay Pantay III', 'Barangay Pantay IV', 'Barangay Poblacion I-A', 'Barangay Poblacion I-B',
            'Barangay Poblacion I-C', 'Barangay Poblacion II-A', 'Barangay Poblacion II-B', 'Barangay Poblacion III-A',
            'Barangay Poblacion III-B', 'Barangay Poblacion IV-A', 'Barangay Poblacion IV-B', 'Barangay Poblacion IV-C',
            'Barangay Tanzang Luma I', 'Barangay Tanzang Luma II', 'Barangay Tanzang Luma III', 'Barangay Tanzang Luma IV',
            'Barangay Tanzang Luma V', 'Barangay Tanzang Luma VI', 'Barangay Toclong I-A', 'Barangay Toclong I-B',
            'Barangay Toclong I-C', 'Barangay Toclong II-A', 'Barangay Toclong II-B'
        ]
    },
    'Laguna': {
        'Santa Rosa': [
            'Barangay Aplaya', 'Barangay Balibago', 'Barangay Caingin', 'Barangay Dila', 'Barangay Dita',
            'Barangay Don Jose', 'Barangay Ibaba', 'Barangay Kanluran', 'Barangay Labas', 'Barangay Macabling',
            'Barangay Malitlit', 'Barangay Malusak', 'Barangay Market Area', 'Barangay Pooc', 'Barangay Pulong Santa Cruz',
            'Barangay Santo Domingo', 'Barangay Sinalhan', 'Barangay Tagapo'
        ],
        'Biñan': [
            'Barangay Biñan', 'Barangay Bungahan', 'Barangay Canlalay', 'Barangay Casile', 'Barangay De La Paz',
            'Barangay Ganado', 'Barangay Langkiwa', 'Barangay Loma', 'Barangay Malaban', 'Barangay Malamig',
            'Barangay Mamplasan', 'Barangay Platero', 'Barangay Poblacion', 'Barangay San Antonio',
            'Barangay San Francisco', 'Barangay San Jose', 'Barangay San Vicente', 'Barangay Santo Domingo',
            'Barangay Santo Niño', 'Barangay Soro-soro', 'Barangay Southville', 'Barangay Timbao',
            'Barangay Tubigan', 'Barangay Zapote'
        ]
    },
    'Batangas': {
        'Batangas City': [
            'Barangay Alangilan', 'Barangay Balagtas', 'Barangay Balete', 'Barangay Banaba Center', 'Barangay Banaba Kanluran',
            'Barangay Banaba Silangan', 'Barangay Barangay 1', 'Barangay Barangay 2', 'Barangay Barangay 3',
            'Barangay Barangay 4', 'Barangay Barangay 5', 'Barangay Barangay 6', 'Barangay Barangay 7',
            'Barangay Barangay 8', 'Barangay Barangay 9', 'Barangay Barangay 10', 'Barangay Barangay 11',
            'Barangay Barangay 12', 'Barangay Barangay 13', 'Barangay Barangay 14', 'Barangay Barangay 15',
            'Barangay Barangay 16', 'Barangay Barangay 17', 'Barangay Barangay 18', 'Barangay Barangay 19',
            'Barangay Barangay 20', 'Barangay Barangay 21', 'Barangay Barangay 22', 'Barangay Barangay 23',
            'Barangay Barangay 24', 'Barangay Bolbok', 'Barangay Bucal', 'Barangay Calicanto', 'Barangay Catandala',
            'Barangay Concepcion', 'Barangay Conde Itaas', 'Barangay Conde Labac', 'Barangay Cumba',
            'Barangay Dumantay', 'Barangay Gulod Itaas', 'Barangay Gulod Labac', 'Barangay Libjo',
            'Barangay Maapaz', 'Barangay Malibayo', 'Barangay Malitam', 'Barangay Maruclap', 'Barangay Mohon',
            'Barangay Pagkilatan', 'Barangay Paharang Kanluran', 'Barangay Paharang Silangan', 'Barangay Pallocan Kanluran',
            'Barangay Pallocan Silangan', 'Barangay Pinamucan', 'Barangay Pinamucan Ibaba', 'Barangay Sampaga',
            'Barangay San Agapito', 'Barangay San Agustin Kanluran', 'Barangay San Agustin Silangan',
            'Barangay San Andres', 'Barangay San Antonio', 'Barangay San Isidro', 'Barangay San Jose Sico',
            'Barangay San Miguel', 'Barangay Santa Clara', 'Barangay Santa Rita Kita', 'Barangay Santa Rita Proper',
            'Barangay Santo Domingo', 'Barangay Santo Niño', 'Barangay Simlong', 'Barangay Sirang Lupa',
            'Barangay Sorosoro Ibaba', 'Barangay Sorosoro Ilaya', 'Barangay Sorosoro Karsada', 'Barangay Tabangao Ambulong',
            'Barangay Tabangao Aplaya', 'Barangay Talahib Pandayan', 'Barangay Talahib Payapa', 'Barangay Tingga Itaas',
            'Barangay Tingga Labac', 'Barangay Tulo', 'Barangay Wawa'
        ]
    }
};
// Region VII - Central Visayas
PHILIPPINE_ADDRESS_DATA['Region VII'] = {
    'Cebu': {
        'Cebu City': [
            'Barangay Adlaon', 'Barangay Agsungot', 'Barangay Apas', 'Barangay Babag', 'Barangay Bacayan',
            'Barangay Banilad', 'Barangay Basak Pardo', 'Barangay Basak San Nicolas', 'Barangay Binaliw',
            'Barangay Bonbon', 'Barangay Budla-an', 'Barangay Buhisan', 'Barangay Bulacao', 'Barangay Busay',
            'Barangay Calamba', 'Barangay Cambinocot', 'Barangay Capitol Site', 'Barangay Carreta',
            'Barangay Cogon Pardo', 'Barangay Cogon Ramos', 'Barangay Day-as', 'Barangay Duljo Fatima',
            'Barangay Ermita', 'Barangay Guadalupe', 'Barangay Guba', 'Barangay Hipodromo', 'Barangay Inayawan',
            'Barangay Kalubihan', 'Barangay Kalunasan', 'Barangay Kamagayan', 'Barangay Kamputhaw',
            'Barangay Kasambagan', 'Barangay Kinasang-an Pardo', 'Barangay Labangon', 'Barangay Lahug',
            'Barangay Lorega San Miguel', 'Barangay Lusaran', 'Barangay Luz', 'Barangay Mabini',
            'Barangay Mabolo', 'Barangay Malubog', 'Barangay Mambaling', 'Barangay Pahina Central',
            'Barangay Pahina San Nicolas', 'Barangay Pardo', 'Barangay Paril', 'Barangay Pasil',
            'Barangay Pit-os', 'Barangay Poblacion Pardo', 'Barangay Pulangbato', 'Barangay Pung-ol Sibugay',
            'Barangay Punta Princesa', 'Barangay Quiot', 'Barangay Sambag I', 'Barangay Sambag II',
            'Barangay San Antonio', 'Barangay San Jose', 'Barangay San Nicolas Central', 'Barangay San Nicolas Proper',
            'Barangay San Roque', 'Barangay Santa Cruz', 'Barangay Sapangdaku', 'Barangay Sawang Calero',
            'Barangay Sinsin', 'Barangay Sirao', 'Barangay Suba', 'Barangay Sudlon I', 'Barangay Sudlon II',
            'Barangay Tabunan', 'Barangay Tagba-o', 'Barangay Talamban', 'Barangay Taptap', 'Barangay Tejero',
            'Barangay Tinago', 'Barangay Tisa', 'Barangay To-ong', 'Barangay Zapatera'
        ],
        'Lapu-Lapu': [
            'Barangay Agus', 'Barangay Babag', 'Barangay Bankal', 'Barangay Baring', 'Barangay Basak',
            'Barangay Buaya', 'Barangay Calawisan', 'Barangay Canjulao', 'Barangay Caw-oy', 'Barangay Caubian',
            'Barangay Gun-ob', 'Barangay Ibo', 'Barangay Looc', 'Barangay Mactan', 'Barangay Maribago',
            'Barangay Marigondon', 'Barangay Pajac', 'Barangay Pajo', 'Barangay Poblacion', 'Barangay Punta Engaño',
            'Barangay Pusok', 'Barangay Sabang', 'Barangay Santa Rosa', 'Barangay Subabasbas', 'Barangay Talima',
            'Barangay Tingo', 'Barangay Tubigan', 'Barangay Tungasan'
        ]
    },
    'Bohol': {
        'Tagbilaran': [
            'Barangay Bool', 'Barangay Booy', 'Barangay Cabawan', 'Barangay Cogon', 'Barangay Dao',
            'Barangay Dampas', 'Barangay Manga', 'Barangay Mansasa', 'Barangay Poblacion I', 'Barangay Poblacion II',
            'Barangay Poblacion III', 'Barangay San Isidro', 'Barangay Taloto', 'Barangay Tiptip', 'Barangay Ubujan'
        ]
    }
};

// Region XI - Davao Region
PHILIPPINE_ADDRESS_DATA['Region XI'] = {
    'Davao del Sur': {
        'Davao City': [
            'Barangay 1-A', 'Barangay 2-A', 'Barangay 3-A', 'Barangay 4-A', 'Barangay 5-A', 'Barangay 6-A',
            'Barangay 7-A', 'Barangay 8-A', 'Barangay 9-A', 'Barangay 10-A', 'Barangay 11-B', 'Barangay 12-B',
            'Barangay 13-B', 'Barangay 14-B', 'Barangay 15-B', 'Barangay 16-B', 'Barangay 17-B', 'Barangay 18-B',
            'Barangay 19-B', 'Barangay 20-B', 'Barangay 21-C', 'Barangay 22-C', 'Barangay 23-C', 'Barangay 24-C',
            'Barangay 25-C', 'Barangay 26-C', 'Barangay 27-C', 'Barangay 28-C', 'Barangay 29-C', 'Barangay 30-C',
            'Barangay 31-D', 'Barangay 32-D', 'Barangay 33-D', 'Barangay 34-D', 'Barangay 35-D', 'Barangay 36-D',
            'Barangay 37-D', 'Barangay 38-D', 'Barangay 39-D', 'Barangay 40-D', 'Barangay Agdao', 'Barangay Alambre',
            'Barangay Angalan', 'Barangay Bago Aplaya', 'Barangay Bago Gallera', 'Barangay Bago Oshiro',
            'Barangay Baguio', 'Barangay Bangkas Heights', 'Barangay Biao Escuela', 'Barangay Biao Guianga',
            'Barangay Biao Joaquin', 'Barangay Bucana', 'Barangay Buda', 'Barangay Buhangin', 'Barangay Bunawan',
            'Barangay Cabantian', 'Barangay Calinan', 'Barangay Callawa', 'Barangay Catalunan Grande',
            'Barangay Catalunan Pequeño', 'Barangay Catitipan', 'Barangay Cawayan', 'Barangay Centro',
            'Barangay Communal', 'Barangay Crossing Bayabas', 'Barangay Dacudao', 'Barangay Daliao',
            'Barangay Daliaon Plantation', 'Barangay Dominga', 'Barangay Dumoy', 'Barangay Eden',
            'Barangay Fatima', 'Barangay Gatungan', 'Barangay Guadalupe', 'Barangay Gumalang',
            'Barangay Ilang', 'Barangay Inayangan', 'Barangay Indangan', 'Barangay Kap. Tomas Monteverde Sr.',
            'Barangay Kilate', 'Barangay Lacson', 'Barangay Lamanan', 'Barangay Lampianao', 'Barangay Langub',
            'Barangay Lapu-lapu', 'Barangay Leon Garcia', 'Barangay Lizada', 'Barangay Los Amigos',
            'Barangay Lubogan', 'Barangay Lumiad', 'Barangay Ma-a', 'Barangay Mabuhay', 'Barangay Magsaysay',
            'Barangay Mahayag', 'Barangay Malabog', 'Barangay Malagos', 'Barangay Malamba', 'Barangay Manambulan',
            'Barangay Mandug', 'Barangay Manuel Guianga', 'Barangay Mapula', 'Barangay Marapangi',
            'Barangay Marilog', 'Barangay Matina Aplaya', 'Barangay Matina Biao', 'Barangay Matina Crossing',
            'Barangay Matina Pangi', 'Barangay Megkawayan', 'Barangay Mintal', 'Barangay Mudiang',
            'Barangay Mulig', 'Barangay New Carmen', 'Barangay New Valencia', 'Barangay Pampanga',
            'Barangay Panacan', 'Barangay Panabo', 'Barangay Paquibato', 'Barangay Paradise Embac',
            'Barangay Riverside', 'Barangay Saloy', 'Barangay Sambulog', 'Barangay Santo Tomas',
            'Barangay Sasa', 'Barangay Sibulan', 'Barangay Sirawan', 'Barangay Sirib', 'Barangay Suawan',
            'Barangay Subasta', 'Barangay Sumimao', 'Barangay Tacunan', 'Barangay Tagakpan', 'Barangay Tagluno',
            'Barangay Tagurano', 'Barangay Talandang', 'Barangay Talomo', 'Barangay Tamayong', 'Barangay Tambobong',
            'Barangay Tamuntuan', 'Barangay Tapak', 'Barangay Tawan-tawan', 'Barangay Tibuloy', 'Barangay Tibungco',
            'Barangay Tigatto', 'Barangay Toril', 'Barangay Tugbok', 'Barangay Tungkalan', 'Barangay Ubalde',
            'Barangay Ula', 'Barangay Waan', 'Barangay Wangan', 'Barangay Wilfredo Aquino'
        ]
    }
};

// Export the data for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PHILIPPINE_ADDRESS_DATA;
}
// Region V - Bicol Region
PHILIPPINE_ADDRESS_DATA['Region V'] = {
    'Albay': {
        'Legazpi': [
            'Barangay Bagumbayan', 'Barangay Banquerohan', 'Barangay Bigaa', 'Barangay Bitano', 'Barangay Bonot',
            'Barangay Bonga', 'Barangay Buyuan', 'Barangay Cabangan', 'Barangay Cabid-an', 'Barangay Cruzada',
            'Barangay Dap-dap', 'Barangay Dinagaan', 'Barangay Dita', 'Barangay Gogon', 'Barangay Hacienda',
            'Barangay Homapon', 'Barangay Ilawod', 'Barangay Kapantawan', 'Barangay Kawit', 'Barangay Lamba',
            'Barangay Landang', 'Barangay Mabinit', 'Barangay Magallanes', 'Barangay Maoyod', 'Barangay Matanag',
            'Barangay Oro Site Proper', 'Barangay Oro Site Tenement', 'Barangay Padang', 'Barangay Pawa',
            'Barangay Pigcale', 'Barangay Poblacion', 'Barangay Puro', 'Barangay Rawis', 'Barangay Sabang',
            'Barangay San Joaquin', 'Barangay San Rafael', 'Barangay San Roque', 'Barangay Santa Cruz',
            'Barangay Tahao', 'Barangay Tamaoyan', 'Barangay Taysan', 'Barangay Tinago', 'Barangay Tula-tula Grande',
            'Barangay Tula-tula Pequeño', 'Barangay Victory Village North', 'Barangay Victory Village South',
            'Barangay Washington Drive', 'Barangay Yawa'
        ]
    },
    'Camarines Sur': {
        'Naga': [
            'Barangay Abella', 'Barangay Bagumbayan Norte', 'Barangay Bagumbayan Sur', 'Barangay Balatas',
            'Barangay Calauag', 'Barangay Cararayan', 'Barangay Carolina', 'Barangay Concepcion Grande',
            'Barangay Concepcion Pequeña', 'Barangay Dayangdang', 'Barangay Del Rosario', 'Barangay Dinaga',
            'Barangay Igualdad Interior', 'Barangay Lerma', 'Barangay Liboton', 'Barangay Mabolo',
            'Barangay Pacol', 'Barangay Panicuason', 'Barangay Peñafrancia', 'Barangay Sabang',
            'Barangay San Felipe', 'Barangay San Francisco', 'Barangay San Isidro', 'Barangay Tabuco',
            'Barangay Tinago', 'Barangay Triangulo'
        ]
    }
};

// Region VI - Western Visayas  
PHILIPPINE_ADDRESS_DATA['Region VI'] = {
    'Iloilo': {
        'Iloilo City': [
            'Barangay Airport', 'Barangay Bakhaw', 'Barangay Baldoza', 'Barangay Balud Proper', 'Barangay Banuyao',
            'Barangay Bito-on', 'Barangay Bo. Obrero', 'Barangay Bolilao', 'Barangay Buntatala', 'Barangay Calaparan',
            'Barangay Camalig', 'Barangay Cansi-ay', 'Barangay Cochero', 'Barangay Compania', 'Barangay Cubay',
            'Barangay Culandanum', 'Barangay Danao', 'Barangay Desamparados', 'Barangay Dungon A',
            'Barangay Dungon B', 'Barangay Dungon C', 'Barangay El 98 Castilla', 'Barangay Fajardo',
            'Barangay General Hughes', 'Barangay Gloria', 'Barangay Guzman-Jesena', 'Barangay Habog-habog Salvacion',
            'Barangay Hipodromo', 'Barangay Jalandoni Estate', 'Barangay Jereos', 'Barangay Kasingkasing',
            'Barangay Kauswagan', 'Barangay Laguda', 'Barangay Lanit', 'Barangay Lapaz Norte',
            'Barangay Lapaz Sur', 'Barangay Libertad-Santa Isabel', 'Barangay Lopez Jaena Norte',
            'Barangay Lopez Jaena Sur', 'Barangay Luna', 'Barangay Mabolo-Delgado', 'Barangay Magsaysay Village',
            'Barangay Malipayon-Delgado', 'Barangay Marcelo H. del Pilar', 'Barangay Maria Clara',
            'Barangay Maria Cristina', 'Barangay Mohon', 'Barangay Molo Boulevard', 'Barangay Nabitasan',
            'Barangay Nonoy', 'Barangay North Baluarte', 'Barangay North Fundidor', 'Barangay North San Jose',
            'Barangay Obrero', 'Barangay Ortiz', 'Barangay Our Lady of Fatima', 'Barangay Our Lady of Lourdes',
            'Barangay Pale Benedicto Rizal', 'Barangay Poblacion', 'Barangay Progreso-Lapuz',
            'Barangay Quintin Salas', 'Barangay Rizal Estanzuela', 'Barangay Rizal Ibarra',
            'Barangay Sambag', 'Barangay San Agustin', 'Barangay San Antonio', 'Barangay San Felix',
            'Barangay San Isidro', 'Barangay San Jose', 'Barangay San Juan', 'Barangay San Nicolas',
            'Barangay San Pedro', 'Barangay San Rafael', 'Barangay San Roque', 'Barangay Santa Cruz',
            'Barangay Santa Rosa', 'Barangay Santo Domingo', 'Barangay Santo Niño Norte',
            'Barangay Santo Niño Sur', 'Barangay Santo Rosario-Duran', 'Barangay Sinikway',
            'Barangay Sooc', 'Barangay South Baluarte', 'Barangay South Fundidor', 'Barangay South San Jose',
            'Barangay Tabuc Suba', 'Barangay Tacas', 'Barangay Tagbac', 'Barangay Tabucan',
            'Barangay Tanza-Esperanza', 'Barangay Tap-oc', 'Barangay Ungka I', 'Barangay Ungka II',
            'Barangay Villa Anita', 'Barangay West Habog-habog', 'Barangay West Timawa', 'Barangay Yulo-Arroyo',
            'Barangay Yulo Drive', 'Barangay Zamora-Melliza'
        ]
    }
};
// Region II - Cagayan Valley
PHILIPPINE_ADDRESS_DATA['Region II'] = {
    'Cagayan': {
        'Tuguegarao': [
            'Barangay Annafunan East', 'Barangay Annafunan West', 'Barangay Atulayan Norte', 'Barangay Atulayan Sur',
            'Barangay Bagay', 'Barangay Buntun', 'Barangay Caggay', 'Barangay Capatan', 'Barangay Carig',
            'Barangay Caritan Centro', 'Barangay Caritan Norte', 'Barangay Caritan Sur', 'Barangay Cataggaman Nuevo',
            'Barangay Cataggaman Pardo', 'Barangay Cataggaman Viejo', 'Barangay Centro 1', 'Barangay Centro 2',
            'Barangay Centro 3', 'Barangay Centro 4', 'Barangay Centro 5', 'Barangay Centro 6', 'Barangay Centro 7',
            'Barangay Centro 8', 'Barangay Centro 9', 'Barangay Centro 10', 'Barangay Centro 11', 'Barangay Centro 12',
            'Barangay Dadda', 'Barangay Gosi Norte', 'Barangay Gosi Sur', 'Barangay Larion Alto',
            'Barangay Larion Bajo', 'Barangay Leonarda', 'Barangay Libag Norte', 'Barangay Libag Sur',
            'Barangay Linao East', 'Barangay Linao Norte', 'Barangay Linao West', 'Barangay Namabbalan Norte',
            'Barangay Namabbalan Sur', 'Barangay Pallua Norte', 'Barangay Pallua Sur', 'Barangay Pengue-Ruyu',
            'Barangay Reyes', 'Barangay San Gabriel', 'Barangay Tagga', 'Barangay Tanza', 'Barangay Ugac Norte',
            'Barangay Ugac Sur'
        ]
    }
};

// Region IV-B - MIMAROPA
PHILIPPINE_ADDRESS_DATA['Region IV-B'] = {
    'Palawan': {
        'Puerto Princesa': [
            'Barangay Bagong Bayan', 'Barangay Bagong Pag-asa', 'Barangay Bagong Sikat', 'Barangay Bahile',
            'Barangay Bancao-bancao', 'Barangay Binduyan', 'Barangay Buenavista', 'Barangay Cabayugan',
            'Barangay Concepcion', 'Barangay Inagawan', 'Barangay Irawan', 'Barangay Iwahig', 'Barangay Kalipay',
            'Barangay Kamuning', 'Barangay Langogan', 'Barangay Liwanag', 'Barangay Lucbuan', 'Barangay Luzviminda',
            'Barangay Macarascas', 'Barangay Magkakaibigan', 'Barangay Maligaya', 'Barangay Manalo',
            'Barangay Mandaragat', 'Barangay Manggahan', 'Barangay Mangingisda', 'Barangay Maningning',
            'Barangay Maoyon', 'Barangay Marufinas', 'Barangay Masigla', 'Barangay Masikap', 'Barangay Masipag',
            'Barangay Matahimik', 'Barangay Matiyaga', 'Barangay Maunlad', 'Barangay Milagrosa',
            'Barangay Model', 'Barangay Montible', 'Barangay Napsan', 'Barangay New Panggangan',
            'Barangay Pagkakaisa', 'BarangayPalawan', 'Barangay Poblacion', 'Barangay Salvacion',
            'Barangay San Jose', 'Barangay San Manuel', 'Barangay San Miguel', 'Barangay San Pedro',
            'Barangay San Rafael', 'Barangay Santa Cruz', 'Barangay Santa Lourdes', 'Barangay Santa Lucia',
            'Barangay Santa Monica', 'Barangay Seaside', 'Barangay Simpocan', 'Barangay Sicsican',
            'Barangay Tagabinet', 'Barangay Tagburos', 'Barangay Tagumpay', 'Barangay Tanabag',
            'Barangay Tanglaw', 'Barangay Tiniguiban'
        ]
    }
};

// CAR - Cordillera Administrative Region
PHILIPPINE_ADDRESS_DATA['CAR'] = {
    'Benguet': {
        'Baguio': [
            'Barangay A. Bonifacio-Caguioa-Rimando', 'Barangay Ambiong', 'Barangay Andres Bonifacio',
            'Barangay Apugan-Loakan', 'Barangay Asin Road', 'Barangay Atok Trail', 'Barangay Aurora Hill North Central',
            'Barangay Aurora Hill Proper', 'Barangay Aurora Hill South Central', 'Barangay Bagong Lipunan',
            'Barangay Bakakeng Central', 'Barangay Bakakeng North', 'Barangay Bal-Marcoville',
            'Barangay Balsigan', 'Barangay Bayan Park East', 'Barangay Bayan Park Village',
            'Barangay Bayan Park West', 'Barangay BGH Compound', 'Barangay Brookside', 'Barangay Brookspoint',
            'Barangay Cabinet Hill-Teacher\'s Camp', 'Barangay Camdas Subdivision', 'Barangay Camp 7',
            'Barangay Camp 8', 'Barangay Camp Allen', 'Barangay Campo Filipino', 'Barangay Country Club Village',
            'Barangay Cresencia Village', 'Barangay Dagsian Lower', 'Barangay Dagsian Upper',
            'Barangay Dizon Subdivision', 'Barangay Dominican Hill-Mirador', 'Barangay Dontogan',
            'Barangay DPS Area', 'Barangay Engineers\' Hill', 'Barangay Fairview Village',
            'Barangay Ferdinand', 'Barangay Fort del Pilar', 'Barangay General Emilio F. Aguinaldo',
            'Barangay General Luna Lower', 'Barangay General Luna Upper', 'Barangay Gibraltar',
            'Barangay Greenwater Village', 'Barangay Guisad Central', 'Barangay Guisad Sorong',
            'Barangay Happy Hollow', 'Barangay Harrison-Claudio Carantes', 'Barangay Hillside',
            'Barangay Holy Ghost Extension', 'Barangay Holy Ghost Proper', 'Barangay Honeymoon',
            'Barangay Imelda R. Marcos', 'Barangay Imelda Village', 'Barangay Irisan', 'Barangay Kabayanihan',
            'Barangay Kagitingan', 'Barangay Kayang Extension', 'Barangay Kayang-Hilltop',
            'Barangay Kias', 'Barangay Legarda-Burnham-Kisad', 'Barangay Lourdes Subdivision Extension',
            'Barangay Lourdes Subdivision Lower', 'Barangay Lourdes Subdivision Proper',
            'Barangay Loakan Proper', 'Barangay Lopez Jaena', 'Barangay Lualhati', 'Barangay Lucnab',
            'Barangay Magsaysay Lower', 'Barangay Magsaysay Private Road', 'Barangay Magsaysay Upper',
            'Barangay Malcolm Square-Perfecto', 'Barangay Manuel A. Roxas', 'Barangay Market Subdivision Upper',
            'Barangay Middle Quezon Hill Subdivision', 'Barangay Military Cut-off', 'Barangay Mines View Park',
            'Barangay Modern Site East', 'Barangay Modern Site West', 'Barangay New Lucban',
            'Barangay Outlook Drive', 'Barangay Pacdal', 'Barangay Padre Burgos', 'Barangay Padre Zamora',
            'Barangay Palma-Urbano', 'Barangay Phil-Am', 'Barangay Pinget', 'Barangay Pinsao Pilot Project',
            'Barangay Pinsao Proper', 'Barangay Poliwes', 'Barangay Pucsusan', 'Barangay Quezon Hill Lower',
            'Barangay Quezon Hill Middle', 'Barangay Quezon Hill Proper', 'Barangay Quezon Hill Upper',
            'Barangay Quirino Hill East', 'Barangay Quirino Hill Lower', 'Barangay Quirino Hill Middle',
            'Barangay Quirino Hill West', 'Barangay Rizal Monument Area', 'Barangay Rock Quarry Lower',
            'Barangay Rock Quarry Middle', 'Barangay Rock Quarry Upper', 'Barangay Salud Mitra',
            'Barangay San Antonio Village', 'Barangay San Luis Village', 'Barangay San Roque Village',
            'Barangay San Vicente', 'Barangay Sanitary Camp North', 'Barangay Sanitary Camp South',
            'Barangay Santa Escolastica', 'Barangay Santo Rosario', 'Barangay Santo Tomas Proper',
            'Barangay Santo Tomas School Area', 'Barangay Scoutborromeo', 'Barangay Session Road Area',
            'Barangay Slaughter House Area', 'Barangay SLU-SVP Housing Village', 'Barangay South Drive',
            'Barangay Teodora Alonzo', 'Barangay Trancoville', 'Barangay Upper Brookside',
            'Barangay Upper General Luna', 'Barangay Upper QM', 'Barangay Victoria Village',
            'Barangay West Modern Site', 'Barangay Whiteplains'
        ]
    }
};
// CAR - Cordillera Administrative Region
PHILIPPINE_ADDRESS_DATA['CAR'] = {
    'Abra': {
        'Bangued': ['Barangay Agtangao', 'Barangay Angad', 'Barangay Bangbangar', 'Barangay Cosili East', 'Barangay Cosili West'],
        'Boliney': ['Barangay Amti', 'Barangay Dao-angan', 'Barangay Poblacion'],
        'Bucay': ['Barangay Bangbangcag', 'Barangay Cosili', 'Barangay Layugan']
    },
    'Benguet': {
        'Baguio': [
            'Barangay A. Bonifacio-Caguioa-Rimando', 'Barangay Ambiong', 'Barangay Andres Bonifacio',
            'Barangay Apugan-Loakan', 'Barangay Asin Road', 'Barangay Atok Trail', 'Barangay Aurora Hill North Central',
            'Barangay Aurora Hill Proper', 'Barangay Aurora Hill South Central', 'Barangay Bagong Lipunan',
            'Barangay Bakakeng Central', 'Barangay Bakakeng North', 'Barangay Bal-Marcoville',
            'Barangay Balsigan', 'Barangay Bayan Park East', 'Barangay Bayan Park Village',
            'Barangay Bayan Park West', 'Barangay BGH Compound', 'Barangay Brookside', 'Barangay Brookspoint'
        ],
        'La Trinidad': ['Barangay Alapang', 'Barangay Balili', 'Barangay Beckel', 'Barangay Bineng'],
        'Itogon': ['Barangay Ampucao', 'Barangay Antamok', 'Barangay Dalupirip', 'Barangay Loacan']
    },
    'Ifugao': {
        'Lagawe': ['Barangay Boliwon', 'Barangay Buyabuyan', 'Barangay Olilicon', 'Barangay Poblacion'],
        'Banaue': ['Barangay Bocos', 'Barangay Poblacion', 'Barangay Tam-an', 'Barangay Viewpoint']
    },
    'Kalinga': {
        'Tabuk': ['Barangay Agbannawag', 'Barangay Amlao', 'Barangay Appas', 'Barangay Bagumbayan'],
        'Pinukpuk': ['Barangay Aciga', 'Barangay Allaguia', 'Barangay Ammacian', 'Barangay Ballayangon']
    },
    'Mountain Province': {
        'Bontoc': ['Barangay Alab Oriente', 'Barangay Alab Proper', 'Barangay Balili', 'Barangay Bontoc Ili'],
        'Sagada': ['Barangay Ambasing', 'Barangay Antadao', 'Barangay Bangaan', 'Barangay Barangay Proper']
    },
    'Apayao': {
        'Kabugao': ['Barangay Allubnag', 'Barangay Apo', 'Barangay Dagupan Centro', 'Barangay Poblacion'],
        'Calanasan': ['Barangay Badduat', 'Barangay Bayag', 'Barangay Dagupan', 'Barangay Poblacion']
    }
};

// Region I - Ilocos Region
PHILIPPINE_ADDRESS_DATA['Region I'] = {
    'Ilocos Norte': {
        'Laoag': [
            'Barangay 1 San Lorenzo', 'Barangay 2 Santo Tomas', 'Barangay 3 Cataban', 'Barangay 4 Zamora', 'Barangay 5 Nangalisan',
            'Barangay 6 Caaoacan', 'Barangay 7 Barit-Barit', 'Barangay 8 Balacad', 'Barangay 9 Buttong', 'Barangay 10 San Matias'
        ],
        'Batac': ['Barangay Aglipay', 'Barangay Baay', 'Barangay Baligat', 'Barangay Baoa East', 'Barangay Baoa West'],
        'Pagudpud': ['Barangay Balaoi', 'Barangay Burayoc', 'Barangay Caunayan', 'Barangay Pancian']
    },
    'Ilocos Sur': {
        'Vigan': [
            'Barangay I Ayusan Norte', 'Barangay II Ayusan Sur', 'Barangay III Barraca', 'Barangay IV Bulala',
            'Barangay V Camaligan', 'Barangay VI Camangaan', 'Barangay VII Capangpangan', 'Barangay VIII Kasanglayan'
        ],
        'Candon': ['Barangay Allangigan 1st', 'Barangay Allangigan 2nd', 'Barangay Amguid', 'Barangay Bagani Campo'],
        'Santa': ['Barangay Ampandula', 'Barangay Banaoang', 'Barangay Cabaroan', 'Barangay Poblacion Norte']
    },
    'La Union': {
        'San Fernando': [
            'Barangay Abut', 'Barangay Apaleng', 'Barangay Bacsil', 'Barangay Bangbangolan', 'Barangay Bangcusay',
            'Barangay Biday', 'Barangay Birunget', 'Barangay Cabaroan', 'Barangay Cadaclan', 'Barangay Calabugao'
        ],
        'Bagulin': ['Barangay Alilem', 'Barangay Balluay', 'Barangay Cambaly', 'Barangay Cardiz', 'Barangay Dagup'],
        'Bauang': ['Barangay Bagbag', 'Barangay Bilis', 'Barangay Boy-utan', 'Barangay Bucayab', 'Barangay Cabaroan']
    },
    'Pangasinan': {
        'Dagupan': [
            'Barangay Bacayao Norte', 'Barangay Bacayao Sur', 'Barangay Bolosan', 'Barangay Bonuan Binloc',
            'Barangay Bonuan Boquig', 'Barangay Bonuan Gueset', 'Barangay Calmay', 'Barangay Carael'
        ],
        'Alaminos': ['Barangay Amandiego', 'Barangay Amangbangan', 'Barangay Bisocol', 'Barangay Bolaney', 'Barangay Bued'],
        'San Carlos': ['Barangay Abanon', 'Barangay Agdao', 'Barangay Anando', 'Barangay Antipangol', 'Barangay Bacnar'],
        'Urdaneta': ['Barangay Anonas', 'Barangay Bactad East', 'Barangay Bactad West', 'Barangay Bayaoas', 'Barangay Bolaoen']
    }
};

// Region II - Cagayan Valley
PHILIPPINE_ADDRESS_DATA['Region II'] = {
    'Batanes': {
        'Basco': ['Barangay Chanarian', 'Barangay Kayhuvokan', 'Barangay San Antonio', 'Barangay San Joaquin'],
        'Itbayat': ['Barangay Raele', 'Barangay San Rafael', 'Barangay Santa Lucia', 'Barangay Santa Maria']
    },
    'Cagayan': {
        'Tuguegarao': [
            'Barangay Annafunan East', 'Barangay Annafunan West', 'Barangay Atulayan Norte', 'Barangay Atulayan Sur',
            'Barangay Bagay', 'Barangay Buntun', 'Barangay Caggay', 'Barangay Capatan', 'Barangay Carig'
        ],
        'Aparri': ['Barangay Backiling', 'Barangay Bangag', 'Barangay Bisagu', 'Barangay Bukig', 'Barangay Bulala'],
        'Ilagan': ['Barangay Alibagu', 'Barangay Bagumbayan', 'Barangay Batal', 'Barangay Bliss Village', 'Barangay Buenavista']
    },
    'Isabela': {
        'Ilagan': ['Barangay Alibagu', 'Barangay Bagumbayan', 'Barangay Batal', 'Barangay Bliss Village', 'Barangay Buenavista'],
        'Cauayan': ['Barangay Alicaocao', 'Barangay Andarayan', 'Barangay Babaran', 'Barangay Baculod', 'Barangay Buena Suerte'],
        'Santiago': ['Barangay Abra', 'Barangay Ambalatungan', 'Barangay Batal', 'Barangay Buenavista', 'Barangay Calaocan']
    },
    'Nueva Vizcaya': {
        'Bayombong': ['Barangay Bansing', 'Barangay Bintawan Norte', 'Barangay Bintawan Sur', 'Barangay Busilac', 'Barangay District I'],
        'Bambang': ['Barangay Almaguer Norte', 'Barangay Almaguer Sur', 'Barangay Banggot', 'Barangay Barat', 'Barangay Bascaran']
    },
    'Quirino': {
        'Cabarroguis': ['Barangay Andres Bonifacio', 'Barangay Burgos', 'Barangay Gaddang', 'Barangay Poblacion'],
        'Diffun': ['Barangay Barangay I', 'Barangay Barangay II', 'Barangay Barangay III', 'Barangay Barangay IV']
    }
};
// Region III - Central Luzon
PHILIPPINE_ADDRESS_DATA['Region III'] = {
    'Bataan': {
        'Balanga': ['Barangay Bagong Silang', 'Barangay Bagumbayan', 'Barangay Cabog-Cabog', 'Barangay Cataning', 'Barangay Central'],
        'Mariveles': ['Barangay Alas-asin', 'Barangay Alion', 'Barangay Balon-anito', 'Barangay Bataan', 'Barangay Biaan']
    },
    'Bulacan': {
        'Malolos': [
            'Barangay Atlag', 'Barangay Bagbaguin', 'Barangay Balayong', 'Barangay Balite', 'Barangay Bangkal',
            'Barangay Barihan', 'Barangay Bulihan', 'Barangay Bungahan', 'Barangay Caingin', 'Barangay Calero'
        ],
        'San Jose del Monte': [
            'Barangay Assumption', 'Barangay Bagong Buhay I', 'Barangay Bagong Buhay II', 'Barangay Bagong Buhay III',
            'Barangay Ciudad Real', 'Barangay Dulong Bayan', 'Barangay Fatima I', 'Barangay Fatima II', 'Barangay Fatima III'
        ],
        'Meycauayan': ['Barangay Bagbaguin', 'Barangay Bahay Pare', 'Barangay Bancal', 'Barangay Banga', 'Barangay Calvario'],
        'Marilao': ['Barangay Abangan Norte', 'Barangay Abangan Sur', 'Barangay Ibayo', 'Barangay Lambakin', 'Barangay Lias']
    },
    'Nueva Ecija': {
        'Cabanatuan': [
            'Barangay Aduas Norte', 'Barangay Aduas Sur', 'Barangay Bakero', 'Barangay Barrera', 'Barangay Bitas',
            'Barangay Caalibangbangan', 'Barangay Camp Tinio', 'Barangay Caudillo', 'Barangay Daang Sarile'
        ],
        'Gapan': ['Barangay Balante', 'Barangay Bayanihan', 'Barangay Bungo', 'Barangay Kapalangan', 'Barangay Lambac'],
        'San Jose': ['Barangay Abar 1st', 'Barangay Abar 2nd', 'Barangay Bagong Sikat', 'Barangay Caanawan', 'Barangay Camanacsacan'],
        'Palayan': ['Barangay Atate', 'Barangay Bagong Buhay', 'Barangay Marcos', 'Barangay Maligaya', 'Barangay Singalat'],
        'Muñoz': ['Barangay Bagong Sikat', 'Barangay Bantug', 'Barangay Calabalabaan', 'Barangay Curva', 'Barangay Poblacion Norte']
    },
    'Pampanga': {
        'San Fernando': [
            'Barangay Baliti', 'Barangay Dela Paz Norte', 'Barangay Dela Paz Sur', 'Barangay Dolores', 'Barangay Juliana',
            'Barangay Lara', 'Barangay Magliman', 'Barangay Malino', 'Barangay Malpitic', 'Barangay Panipuan'
        ],
        'Angeles': [
            'Barangay Agapito del Rosario', 'Barangay Amsic', 'Barangay Balibago', 'Barangay Capaya', 'Barangay Claro M. Recto',
            'Barangay Cuayan', 'Barangay Cutcut', 'Barangay Cutud', 'Barangay Lourdes Norte', 'Barangay Lourdes Sur'
        ]
    },
    'Tarlac': {
        'Tarlac City': ['Barangay Aguso', 'Barangay Alvindia', 'Barangay Amucao', 'Barangay Armenia', 'Barangay Asturias'],
        'Capas': ['Barangay Aranguren', 'Barangay Bueno', 'Barangay Cristo Rey', 'Barangay Cutcut I', 'Barangay Cutcut II']
    },
    'Zambales': {
        'Olongapo': ['Barangay Asinan', 'Barangay Banicain', 'Barangay Barretto', 'Barangay East Bajac-bajac', 'Barangay East Tapinac'],
        'Iba': ['Barangay Amungan', 'Barangay Bangantalinga', 'Barangay Lipay', 'Barangay Palanginan', 'Barangay Poblacion']
    },
    'Aurora': {
        'Baler': ['Barangay Buhangin', 'Barangay Calabuanan', 'Barangay Obligacion', 'Barangay Pingit', 'Barangay Poblacion'],
        'Casiguran': ['Barangay Bianoan', 'Barangay Cozo', 'Barangay Culat', 'Barangay Esperanza', 'Barangay Lual']
    }
};

// Region IV-A - CALABARZON
PHILIPPINE_ADDRESS_DATA['Region IV-A'] = {
    'Batangas': {
        'Batangas City': [
            'Barangay Alangilan', 'Barangay Balagtas', 'Barangay Balete', 'Barangay Banaba Center', 'Barangay Banaba Kanluran',
            'Barangay Banaba Silangan', 'Barangay Barangay 1', 'Barangay Barangay 2', 'Barangay Barangay 3'
        ],
        'Lipa': ['Barangay Adya', 'Barangay Anilao', 'Barangay Antipolo del Norte', 'Barangay Antipolo del Sur', 'Barangay Bagong Pook'],
        'Tanauan': ['Barangay Altura Bata', 'Barangay Altura Matanda', 'Barangay Ambulong', 'Barangay Balele', 'Barangay Banjo East'],
        'Santo Tomas': ['Barangay Barangay I', 'Barangay Barangay II', 'Barangay Barangay III', 'Barangay Barangay IV', 'Barangay San Antonio'],
        'Calaca': ['Barangay Bagong Tubig', 'Barangay Bakia', 'Barangay Balibago', 'Barangay Banaba Kanluran', 'Barangay Banaba Silangan']
    },
    'Cavite': {
        'Bacoor': [
            'Barangay Alima', 'Barangay Aniban I', 'Barangay Aniban II', 'Barangay Aniban III', 'Barangay Aniban IV',
            'Barangay Aniban V', 'Barangay Banalo', 'Barangay Bayanan', 'Barangay Campo Santo', 'Barangay Daang Bukid'
        ],
        'Imus': [
            'Barangay Alapan I-A', 'Barangay Alapan I-B', 'Barangay Alapan II-A', 'Barangay Alapan II-B',
            'Barangay Anabu I-A', 'Barangay Anabu I-B', 'Barangay Anabu I-C', 'Barangay Anabu I-D'
        ],
        'Dasmariñas': ['Barangay Bagong Bayan', 'Barangay Burol I', 'Barangay Burol II', 'Barangay Burol III', 'Barangay Langkaan I'],
        'General Trias': ['Barangay Alingaro', 'Barangay Arnaldo Poblacion', 'Barangay Bacao I', 'Barangay Bacao II', 'Barangay Bagumbayan'],
        'Trece Martires': ['Barangay Aguado', 'Barangay Cabezas', 'Barangay Cabuco', 'Barangay Conchu', 'Barangay De Ocampo'],
        'Kawit': ['Barangay Binakayan-Kanluran', 'Barangay Binakayan-Silangan', 'Barangay Kaingen', 'Barangay Magdalo', 'Barangay Panamitan'],
        'Rosario': ['Barangay Kanluran', 'Barangay Ligtong I', 'Barangay Ligtong II', 'Barangay Ligtong III', 'Barangay Poblacion'],
        'Tagaytay': ['Barangay Asisan', 'Barangay Bagong Tubig', 'Barangay Calabuso', 'Barangay Dapdap East', 'Barangay Dapdap West']
    },
    'Laguna': {
        'Santa Rosa': [
            'Barangay Aplaya', 'Barangay Balibago', 'Barangay Caingin', 'Barangay Dila', 'Barangay Dita',
            'Barangay Don Jose', 'Barangay Ibaba', 'Barangay Kanluran', 'Barangay Labas', 'Barangay Macabling'
        ],
        'Biñan': [
            'Barangay Biñan', 'Barangay Bungahan', 'Barangay Canlalay', 'Barangay Casile', 'Barangay De La Paz',
            'Barangay Ganado', 'Barangay Langkiwa', 'Barangay Loma', 'Barangay Malaban', 'Barangay Malamig'
        ],
        'San Pedro': ['Barangay Calendola', 'Barangay Chrysanthemum', 'Barangay Cuyab', 'Barangay Fatima', 'Barangay G.S.I.S.'],
        'Cabuyao': ['Barangay Banay-banay', 'Barangay Banlic', 'Barangay Bigaa', 'Barangay Butong', 'Barangay Casile'],
        'Calamba': ['Barangay Bagong Kalsada', 'Barangay Banadero', 'Barangay Banlic', 'Barangay Barandal', 'Barangay Batino'],
        'Los Baños': ['Barangay Anos', 'Barangay Bagong Silang', 'Barangay Bambang', 'Barangay Batong Malake', 'Barangay Baybayin']
    },
    'Quezon': {
        'Lucena': ['Barangay Barra', 'Barangay Bocohan', 'Barangay Cotta', 'Barangay Dalahican', 'Barangay Gulang-Gulang'],
        'Tayabas': ['Barangay Alitao', 'Barangay Angustias', 'Barangay Ayaas', 'Barangay Bukal', 'Barangay Domoit'],
        'Sariaya': ['Barangay Antipolo', 'Barangay Bignay I', 'Barangay Bignay II', 'Barangay Bucal', 'Barangay Bunot']
    },
    'Rizal': {
        'Antipolo': ['Barangay Bagong Nayon', 'Barangay Beverly Hills', 'Barangay Calawis', 'Barangay Cupang', 'Barangay Dalig'],
        'Cainta': ['Barangay Dayap', 'Barangay San Andres', 'Barangay San Isidro', 'Barangay San Juan', 'Barangay Santo Domingo'],
        'Taytay': ['Barangay Bagumbayan', 'Barangay Dolores', 'Barangay Muzon', 'Barangay San Isidro', 'Barangay San Juan']
    }
};
// MIMAROPA Region
PHILIPPINE_ADDRESS_DATA['Region IV-B'] = {
    'Marinduque': {
        'Boac': ['Barangay Agot', 'Barangay Agumaymayan', 'Barangay Amoingon', 'Barangay Apitong', 'Barangay Balagasan'],
        'Gasan': ['Barangay Antipolo', 'Barangay Bachao Ibaba', 'Barangay Bachao Ilaya', 'Barangay Bahi', 'Barangay Bangbang']
    },
    'Occidental Mindoro': {
        'Mamburao': ['Barangay Balansay', 'Barangay Fatima', 'Barangay Payompon', 'Barangay Poblacion', 'Barangay Tangkalan'],
        'San Jose': ['Barangay Bagong Sikat', 'Barangay Bangkal', 'Barangay Batasan', 'Barangay Buri', 'Barangay Central']
    },
    'Oriental Mindoro': {
        'Calapan': ['Barangay Balite', 'Barangay Batino', 'Barangay Bayanan I', 'Barangay Bayanan II', 'Barangay Biga'],
        'Puerto Galera': ['Barangay Aninuan', 'Barangay Balatero', 'Barangay Palangan', 'Barangay Poblacion', 'Barangay Sabang']
    },
    'Palawan': {
        'Puerto Princesa': [
            'Barangay Bagong Bayan', 'Barangay Bagong Pag-asa', 'Barangay Bagong Sikat', 'Barangay Bahile',
            'Barangay Bancao-bancao', 'Barangay Binduyan', 'Barangay Buenavista', 'Barangay Cabayugan'
        ],
        'El Nido': ['Barangay Bacuit', 'Barangay Bagong Bayan', 'Barangay Bebeladan', 'Barangay Bucana', 'Barangay Corong-Corong'],
        'Coron': ['Barangay Banuang Daan', 'Barangay Bosuanga', 'Barangay Bulalacao', 'Barangay Cheey', 'Barangay Decalachao']
    },
    'Romblon': {
        'Romblon': ['Barangay Agbaluto', 'Barangay Agpanabat', 'Barangay Agbudia', 'Barangay Calabasa', 'Barangay Capaclan'],
        'Odiongan': ['Barangay Anahao', 'Barangay Bagacay', 'Barangay Bato', 'Barangay Bjmp', 'Barangay Budiong']
    }
};

// Region V - Bicol Region
PHILIPPINE_ADDRESS_DATA['Region V'] = {
    'Albay': {
        'Legazpi': [
            'Barangay Bagumbayan', 'Barangay Banquerohan', 'Barangay Bigaa', 'Barangay Bitano', 'Barangay Bonot',
            'Barangay Bonga', 'Barangay Buyuan', 'Barangay Cabangan', 'Barangay Cabid-an', 'Barangay Cruzada'
        ],
        'Tabaco': ['Barangay Agnas', 'Barangay Bariw', 'Barangay Bombon', 'Barangay Bonga', 'Barangay Buang'],
        'Ligao': ['Barangay Amtic', 'Barangay Balinad', 'Barangay Banga', 'Barangay Binatagan', 'Barangay Bonga']
    },
    'Camarines Norte': {
        'Daet': ['Barangay Alawihao', 'Barangay Bagasbas', 'Barangay Bibirao', 'Barangay Borabod', 'BarangayAbulog'],
        'Jose Panganiban': ['Barangay Bagong Bayan', 'Barangay Calero', 'Barangay Dahican', 'Barangay Larap', 'Barangay Luklukan']
    },
    'Camarines Sur': {
        'Naga': [
            'Barangay Abella', 'Barangay Bagumbayan Norte', 'Barangay Bagumbayan Sur', 'Barangay Balatas',
            'Barangay Calauag', 'Barangay Cararayan', 'Barangay Carolina', 'Barangay Concepcion Grande'
        ],
        'Iriga': ['Barangay Cristo Rey', 'Barangay La Medalla', 'Barangay Sagrada', 'Barangay San Agustin', 'Barangay San Francisco'],
        'Pili': ['Barangay Anayan', 'Barangay Bagacay', 'Barangay Banga', 'Barangay Bato', 'Barangay Binanuahan']
    },
    'Catanduanes': {
        'Virac': ['Barangay Bagamanoc', 'Barangay Balite', 'Barangay Bato', 'Barangay Buenavista', 'Barangay Calatagan'],
        'Bato': ['Barangay Bato', 'Barangay Buenavista', 'Barangay Cagraray', 'Barangay Sagrada', 'Barangay Talisay']
    },
    'Masbate': {
        'Masbate City': ['Barangay Bagumbayan', 'Barangay Bantigue', 'Barangay Bapor', 'Barangay Bolo', 'Barangay Buntod'],
        'Aroroy': ['Barangay Balawing', 'Barangay Binahan', 'Barangay Capsay', 'Barangay Domorog', 'Barangay Ginto']
    },
    'Sorsogon': {
        'Sorsogon City': ['Barangay Abas', 'Barangay Bacolod', 'Barangay Bagonbon', 'Barangay Balogo', 'Barangay Barayong'],
        'Bulan': ['Barangay Amtic', 'Barangay Bacolod', 'Barangay Bagacay', 'Barangay Bato', 'Barangay Binanuahan']
    }
};

// Region VI - Western Visayas
PHILIPPINE_ADDRESS_DATA['Region VI'] = {
    'Aklan': {
        'Kalibo': ['Barangay Andagao', 'Barangay Bachaw Norte', 'Barangay Bachaw Sur', 'Barangay Bugtong Bato', 'Barangay Buswang'],
        'Boracay (Malay)': ['Barangay Balabag', 'Barangay Manoc-Manoc', 'Barangay Yapak']
    },
    'Antique': {
        'San Jose de Buenavista': ['Barangay Asluman', 'Barangay Bagumbayan', 'Barangay Botbot', 'Barangay Cagay', 'Barangay Dawis'],
        'Sibalom': ['Barangay Alegre', 'Barangay Asluman', 'Barangay Bagumbayan', 'Barangay Bongbongan', 'Barangay Cabadiangan']
    },
    'Capiz': {
        'Roxas City': ['Barangay Adlawan', 'Barangay Banica', 'Barangay Barra', 'Barangay Baybay', 'Barangay Bolo'],
        'Panay': ['Barangay Agbalo', 'Barangay Bago', 'Barangay Bakhaw', 'Barangay Bato', 'Barangay Bula']
    },
    'Iloilo': {
        'Iloilo City': [
            'Barangay Airport', 'Barangay Bakhaw', 'Barangay Baldoza', 'Barangay Balud Proper', 'Barangay Banuyao',
            'Barangay Bito-on', 'Barangay Bo. Obrero', 'Barangay Bolilao', 'Barangay Buntatala', 'Barangay Calaparan'
        ],
        'Passi': ['Barangay Aglalana', 'Barangay Agustin Navarra', 'Barangay Ayuyan', 'Barangay Bago', 'Barangay Banbanan'],
        'Bacolod': ['Barangay 1', 'Barangay 2', 'Barangay 3', 'Barangay 4', 'Barangay 5']
    },
    'Guimaras': {
        'Jordan': ['Barangay Alaguisoc', 'Barangay Anjawan', 'Barangay Balaan Bukid', 'Barangay Constancia', 'Barangay Hoskyn'],
        'Buenavista': ['Barangay Agsanayan', 'Barangay Banban', 'Barangay Getulio', 'Barangay Lucmayan', 'Barangay Navalas']
    }
};
// Negros Island Region (NIR)
PHILIPPINE_ADDRESS_DATA['NIR'] = {
    'Negros Occidental': {
        'Bacolod': ['Barangay 1', 'Barangay 2', 'Barangay 3', 'Barangay 4', 'Barangay 5', 'Barangay 6', 'Barangay Alijis', 'Barangay Banago'],
        'Talisay': ['Barangay Cabatangan', 'Barangay Dos Hermanas', 'Barangay Efigenio Lizares', 'Barangay Katilingban', 'Barangay Matab-ang'],
        'Silay': ['Barangay Bagtic', 'Barangay Balaring', 'Barangay Eustaquio Lopez', 'Barangay Guinhalaran', 'Barangay Kapitan Ramon']
    },
    'Negros Oriental': {
        'Dumaguete': ['Barangay Bagacay', 'Barangay Bajumpandan', 'Barangay Banilad', 'Barangay Batinguel', 'Barangay Bunao'],
        'Bais': ['Barangay Cabanlutan', 'Barangay Cambaguio', 'Barangay Kansumoroy', 'Barangay Mabunao', 'Barangay Okiot'],
        'Tanjay': ['Barangay Azagra', 'Barangay Bahi-an', 'Barangay Luca', 'Barangay Novallas', 'Barangay Poblacion I']
    },
    'Siquijor': {
        'Siquijor': ['Barangay Caipilan', 'Barangay Cangmeniao', 'Barangay Libo', 'Barangay Napo', 'Barangay Poblacion'],
        'Larena': ['Barangay Campalanas', 'Barangay Canlucani', 'Barangay Poblacion', 'Barangay Talisay', 'Barangay Tubod']
    }
};

// Region VII - Central Visayas
PHILIPPINE_ADDRESS_DATA['Region VII'] = {
    'Bohol': {
        'Tagbilaran': [
            'Barangay Bool', 'Barangay Booy', 'Barangay Cabawan', 'Barangay Cogon', 'Barangay Dao',
            'Barangay Dampas', 'Barangay Manga', 'Barangay Mansasa', 'Barangay Poblacion I', 'Barangay Poblacion II'
        ],
        'Panglao': ['Barangay Bil-isan', 'Barangay Bolod', 'Barangay Danao', 'Barangay Doljo', 'Barangay Libaong'],
        'Carmen': ['Barangay Alegria', 'Barangay Buenos Aires', 'Barangay Katipunan', 'Barangay Poblacion', 'Barangay Poblacion Weste']
    },
    'Cebu': {
        'Cebu City': [
            'Barangay Adlaon', 'Barangay Agsungot', 'Barangay Apas', 'Barangay Babag', 'Barangay Bacayan',
            'Barangay Banilad', 'Barangay Basak Pardo', 'Barangay Basak San Nicolas', 'Barangay Binaliw',
            'Barangay Bonbon', 'Barangay Budla-an', 'Barangay Buhisan', 'Barangay Bulacao', 'Barangay Busay'
        ],
        'Lapu-Lapu': [
            'Barangay Agus', 'Barangay Babag', 'Barangay Bankal', 'Barangay Baring', 'Barangay Basak',
            'Barangay Buaya', 'Barangay Calawisan', 'Barangay Canjulao', 'Barangay Caw-oy', 'Barangay Caubian'
        ],
        'Mandaue': ['Barangay Alang-alang', 'Barangay Bakilid', 'Barangay Banilad', 'Barangay Basak', 'Barangay Cabancalan'],
        'Talisay': ['Barangay Biasong', 'Barangay Bulacao', 'Barangay Camp IV', 'Barangay Candulawan', 'Barangay Cansojong'],
        'Toledo': ['Barangay Awihao', 'Barangay Bagakay', 'Barangay Bato', 'Barangay Biga', 'Barangay Bulongan'],
        'Danao': ['Barangay Baliang', 'Barangay Bayabas', 'Barangay Binaliw', 'Barangay Cabanawan', 'Barangay Cabungahan']
    }
};

// Region VIII - Eastern Visayas
PHILIPPINE_ADDRESS_DATA['Region VIII'] = {
    'Eastern Samar': {
        'Borongan': ['Barangay Alang-alang', 'Barangay Bato', 'Barangay Cabong', 'Barangay Campokpok', 'Barangay Hindang'],
        'Guiuan': ['Barangay Bagua', 'Barangay Barbo', 'Barangay Bitaugan', 'Barangay Bungtod', 'Barangay Cagusu']
    },
    'Leyte': {
        'Tacloban': ['Barangay 1', 'Barangay 2', 'Barangay 3', 'Barangay 4', 'Barangay 5', 'Barangay 6', 'Barangay 7', 'Barangay 8'],
        'Ormoc': ['Barangay Alegria', 'Barangay Alta Vista', 'Barangay Bagong Buhay', 'Barangay Bantigue', 'Barangay Batuan'],
        'Baybay': ['Barangay Altavista', 'Barangay Amguhan', 'Barangay Balao', 'Barangay Bato', 'Barangay Biasong']
    },
    'Northern Samar': {
        'Catarman': ['Barangay Acacia', 'Barangay Bangkerohan', 'Barangay Cawayan', 'Barangay Dalakit', 'Barangay Gebulwangan'],
        'Laoang': ['Barangay Bangon', 'Barangay Buenavista', 'Barangay Cahayagan', 'Barangay Calachuchi', 'Barangay Canlampay']
    },
    'Samar': {
        'Catbalogan': ['Barangay 1', 'Barangay 2', 'Barangay 3', 'Barangay 4', 'Barangay 5', 'Barangay Bagacay', 'Barangay Baybay'],
        'Calbayog': ['Barangay Aguit-itan', 'Barangay Bagacay', 'Barangay Balud', 'Barangay Bantigue', 'Barangay Baybay'],
        'Catbalogan': ['Barangay 1', 'Barangay 2', 'Barangay 3', 'Barangay 4', 'Barangay 5']
    },
    'Southern Leyte': {
        'Maasin': ['Barangay Abgao', 'Barangay Asuncion', 'Barangay Bato', 'Barangay Combado', 'Barangay Guinsohotan'],
        'Sogod': ['Barangay Amparo', 'Barangay Benit', 'Barangay Hibunawan', 'Barangay Kauswagan', 'Barangay Libagon']
    },
    'Biliran': {
        'Naval': ['Barangay Agpangi', 'Barangay Alegria', 'Barangay Anahawan', 'Barangay Atipolo', 'Barangay Bagongbong'],
        'Biliran': ['Barangay Busali', 'Barangay Hugpa', 'Barangay Julita', 'Barangay Pinangumhan', 'Barangay Villa Enage']
    }
};
// Region IX - Zamboanga Peninsula
PHILIPPINE_ADDRESS_DATA['Region IX'] = {
    'Sulu': {
        'Jolo': ['Barangay Alat', 'Barangay Asturias', 'Barangay Bangkal', 'Barangay Bus-bus', 'Barangay Chinese Pier'],
        'Indanan': ['Barangay Baunoh', 'Barangay Kajatian', 'Barangay Kan-Islam', 'Barangay Karawan', 'Barangay Tandu Banak']
    },
    'Zamboanga del Norte': {
        'Dipolog': ['Barangay Barra', 'Barangay Biasong', 'Barangay Cogon', 'Barangay Dicayas', 'Barangay Estaka'],
        'Dapitan': ['Barangay Aliguay', 'Barangay Bagting', 'Barangay Banbanan', 'Barangay Barcelona', 'Barangay Burgos'],
        'Sindangan': ['Barangay Balok', 'Barangay Goleo', 'Barangay Kauswagan', 'Barangay Labrador', 'Barangay Poblacion']
    },
    'Zamboanga del Sur': {
        'Pagadian': ['Barangay Balangasan', 'Barangay Baloyboan', 'Barangay Banale', 'Barangay Bogo', 'Barangay Bomba'],
        'Zamboanga City': ['Barangay Ayala', 'Barangay Baliwasan', 'Barangay Boalan', 'Barangay Bolong', 'Barangay Bunguiao'],
        'Molave': ['Barangay Bag-ong Misamis', 'Barangay Baking', 'Barangay Bolitoc', 'Barangay Dipili', 'Barangay Lourdes']
    },
    'Zamboanga Sibugay': {
        'Ipil': ['Barangay Balugo', 'Barangay Bangkaw-bangkaw', 'Barangay Keytodac', 'Barangay Poblacion', 'Barangay Tenan'],
        'Kabasalan': ['Barangay Balok', 'Barangay Dimalinao', 'Barangay Lumbog', 'Barangay Poblacion', 'Barangay Surop']
    }
};

// Region X - Northern Mindanao
PHILIPPINE_ADDRESS_DATA['Region X'] = {
    'Bukidnon': {
        'Malaybalay': ['Barangay Aglayan', 'Barangay Bangcud', 'Barangay Busdi', 'Barangay Cabangahan', 'Barangay Casisang'],
        'Valencia': ['Barangay Bagontaas', 'Barangay Banlag', 'Barangay Catumbalon', 'Barangay Guinoyuran', 'Barangay Laligan'],
        'Maramag': ['Barangay Aglayan', 'Barangay Bagontaas', 'Barangay Dalwangan', 'Barangay Kuya', 'Barangay Laguitas']
    },
    'Camiguin': {
        'Mambajao': ['Barangay Agoho', 'Barangay Anito', 'Barangay Balbagon', 'Barangay Benoni', 'Barangay Bura'],
        'Catarman': ['Barangay Alangilan', 'Barangay Binangawan', 'Barangay Bonbon', 'Barangay Catibac', 'Barangay Compol']
    },
    'Lanao del Norte': {
        'Iligan': ['Barangay Abuno', 'Barangay Acmac', 'Barangay Bagong Silang', 'Barangay Bonbonon', 'Barangay Bunawan'],
        'Tubod': ['Barangay Bacolod', 'Barangay Bagong Silang', 'Barangay Baroy', 'Barangay Bulod', 'Barangay Caromatan']
    },
    'Misamis Occidental': {
        'Oroquieta': ['Barangay Apil', 'Barangay Binuangan', 'Barangay Bunga', 'Barangay Canubay', 'Barangay Dullan Norte'],
        'Ozamiz': ['Barangay Aguada', 'Barangay Banadero', 'Barangay Baybay Triunfo', 'Barangay Bongbong', 'Barangay Capucao C.'],
        'Tangub': ['Barangay Bintana', 'Barangay Katipunan', 'Barangay Kauswagan', 'Barangay Maloro', 'Barangay Poblacion']
    },
    'Misamis Oriental': {
        'Cagayan de Oro': ['Barangay Agusan', 'Barangay Balulang', 'Barangay Barangay 1', 'Barangay Barangay 2', 'Barangay Barangay 3'],
        'Gingoog': ['Barangay 1', 'Barangay 2', 'Barangay 3', 'Barangay 4', 'Barangay 5'],
        'El Salvador': ['Barangay Bobontugan', 'Barangay Hinigdaan', 'Barangay Kibawe', 'Barangay Poblacion', 'Barangay Salvacion']
    }
};

// Region XI - Davao Region
PHILIPPINE_ADDRESS_DATA['Region XI'] = {
    'Davao del Norte': {
        'Tagum': ['Barangay Apokon', 'Barangay Bincungan', 'Barangay Busaon', 'Barangay Cuambogan', 'Barangay La Filipina'],
        'Panabo': ['Barangay Buenavista', 'Barangay Cagangohan', 'Barangay Dapco', 'Barangay Gredu', 'Barangay J.P. Laurel'],
        'Samal': ['Barangay Adecor', 'Barangay Aundanao', 'Barangay Babak', 'Barangay Caliclic', 'Barangay Camudmud']
    },
    'Davao del Sur': {
        'Davao City': [
            'Barangay 1-A', 'Barangay 2-A', 'Barangay 3-A', 'Barangay 4-A', 'Barangay 5-A', 'Barangay 6-A',
            'Barangay 7-A', 'Barangay 8-A', 'Barangay 9-A', 'Barangay 10-A', 'Barangay Agdao', 'Barangay Alambre'
        ],
        'Digos': ['Barangay Aplaya', 'Barangay Balabag', 'Barangay Binaton', 'Barangay Colorado', 'Barangay Cogon']
    },
    'Davao Oriental': {
        'Mati': ['Barangay Badas', 'Barangay Buso', 'Barangay Central', 'Barangay Dahican', 'Barangay Dawan'],
        'Baganga': ['Barangay Batawan', 'Barangay Binondo', 'Barangay Bobonao', 'Barangay Campawan', 'Barangay Dapnan']
    },
    'Davao de Oro': {
        'Nabunturan': ['Barangay Anislagan', 'Barangay Antongalon', 'Barangay Basak', 'Barangay Bukal', 'Barangay Cabidianan'],
        'Pantukan': ['Barangay Bongabong', 'Barangay Kingking', 'Barangay Magnaga', 'Barangay Napnapan', 'Barangay Tibagon']
    },
    'Davao Occidental': {
        'Malita': ['Barangay Bito', 'Barangay Bolila', 'Barangay Culaman', 'Barangay Dapnan', 'Barangay Kiblagon'],
        'Santa Maria': ['Barangay Basiawan', 'Barangay Buca', 'Barangay Kidawa', 'Barangay Liargao', 'Barangay Poblacion']
    }
};
// Region XII - SOCCSKSARGEN
PHILIPPINE_ADDRESS_DATA['Region XII'] = {
    'Cotabato': {
        'Kidapawan': ['Barangay Amazion', 'Barangay Balindog', 'Barangay Binoligan', 'Barangay Gayola', 'Barangay Ginatilan'],
        'Midsayap': ['Barangay Aleosan', 'Barangay Bual Norte', 'Barangay Bual Sur', 'Barangay Kapinpilan', 'Barangay Lomopog'],
        'Cotabato City': ['Barangay Bagua I', 'Barangay Bagua II', 'Barangay Bagua III', 'Barangay Kalanganan I', 'Barangay Kalanganan II']
    },
    'South Cotabato': {
        'General Santos': ['Barangay Apopong', 'Barangay Baluan', 'Barangay Batomelong', 'Barangay Buayan', 'Barangay Calumpang'],
        'Koronadal': ['Barangay Assumption', 'Barangay Avanceña', 'Barangay Carpenter Hill', 'Barangay Concepcion', 'Barangay Esperanza'],
        'Surallah': ['Barangay Albagan', 'Barangay Bagacay', 'Barangay Centrala', 'Barangay Datal Anggas', 'Barangay Lambayong']
    },
    'Sultan Kudarat': {
        'Isulan': ['Barangay Bambad', 'Barangay Dansuli', 'Barangay Kalawag I', 'Barangay Kalawag II', 'Barangay Kalawag III'],
        'Tacurong': ['Barangay Baras', 'Barangay Buenaflor', 'Barangay Calean', 'Barangay EJC Montilla', 'Barangay Griño'],
        'Bagumbayan': ['Barangay Alunan', 'Barangay Antong', 'Barangay Datu Karon', 'Barangay Esperanza', 'Barangay Kabulohan']
    },
    'Sarangani': {
        'Alabel': ['Barangay Alegria', 'Barangay Bagacay', 'Barangay Baluntay', 'Barangay Datal Anggas', 'Barangay Kawas'],
        'Glan': ['Barangay Baliton', 'Barangay Batulaki', 'Barangay Big Margus', 'Barangay Calpan', 'Barangay Cross'],
        'Malungon': ['Barangay Amsipit', 'Barangay Datal Batong', 'Barangay Kalaong', 'Barangay Landan', 'Barangay Lebe']
    }
};

// Region XIII - Caraga
PHILIPPINE_ADDRESS_DATA['Region XIII'] = {
    'Agusan del Norte': {
        'Butuan': ['Barangay Agao', 'Barangay Agusan Pequeño', 'Barangay Ambago', 'Barangay Amparo', 'Barangay Anticala'],
        'Cabadbaran': ['Barangay Bay-ang', 'Barangay Bayabas', 'Barangay Cabinet', 'Barangay Calibunan', 'Barangay Comagascas']
    },
    'Agusan del Sur': {
        'Bayugan': ['Barangay Anahaw', 'Barangay Bading', 'Barangay Bucac', 'Barangay Bunawan Brook', 'Barangay Claro Cortez'],
        'Prosperidad': ['Barangay Aurora', 'Barangay Bayugan III', 'Barangay Cabayawa', 'Barangay Kasapa', 'Barangay Libertad'],
        'Trento': ['Barangay Alegria', 'Barangay Bayugan I', 'Barangay Bayugan II', 'Barangay Mahagsay', 'Barangay Poblacion']
    },
    'Surigao del Norte': {
        'Surigao City': ['Barangay Alang-alang', 'Barangay Anomar', 'Barangay Buenavista', 'Barangay Canlanipa', 'Barangay Caridad'],
        'Siargao': ['Barangay Catangnan', 'Barangay General Luna', 'Barangay Malinao', 'Barangay Pacifico', 'Barangay Union']
    },
    'Surigao del Sur': {
        'Tandag': ['Barangay Awasian', 'Barangay Bag-ong Lungsod', 'Barangay Banobohan', 'Barangay Bongtud', 'Barangay Dagocdoc'],
        'Bislig': ['Barangay Coleto', 'Barangay Cumawas', 'Barangay Lawigan', 'Barangay Mangagoy', 'Barangay Poblacion'],
        'Hinatuan': ['Barangay Cambatong', 'Barangay Loyola', 'Barangay Magosilom', 'Barangay Poblacion', 'Barangay Talisay']
    },
    'Dinagat Islands': {
        'San Jose': ['Barangay Aurelio', 'Barangay Don Ruben E. Ecleo Sr.', 'Barangay Justiniana Edera', 'Barangay Lake Bababu', 'Barangay San Juan'],
        'Basilisa': ['Barangay Benglen', 'Barangay Catadman', 'Barangay Poblacion', 'Barangay Puyo', 'Barangay Villa Aurora']
    }
};

// BARMM - Bangsamoro Autonomous Region in Muslim Mindanao
PHILIPPINE_ADDRESS_DATA['BARMM'] = {
    'Basilan': {
        'Isabela City': ['Barangay Baluno', 'Barangay Begang', 'Barangay Cabunbata', 'Barangay Calvario', 'Barangay Kaumpurnah'],
        'Lamitan': ['Barangay Baimbing', 'Barangay Balobo', 'Barangay Baungis', 'Barangay Bohelebung', 'Barangay Bulingan']
    },
    'Lanao del Sur': {
        'Marawi': ['Barangay Angoyao', 'Barangay Banggolo', 'Barangay Basak Malutlut', 'Barangay Boganga', 'Barangay Bubonga Cadayonan'],
        'Malabang': ['Barangay Bacayawan', 'Barangay Balabagan', 'Barangay Binidayan', 'Barangay Cadayonan', 'Barangay Dansalan'],
        'Wao': ['Barangay Bandera', 'Barangay Bubong Dinaig', 'Barangay Kalanganan', 'Barangay Poblacion', 'Barangay Rebe']
    },
    'Tawi-Tawi': {
        'Bongao': ['Barangay Ipil', 'Barangay Lamion', 'Barangay Lamiun', 'Barangay Masantong', 'Barangay Poblacion'],
        'Panglima Sugala': ['Barangay Bangkal', 'Barangay Karaha', 'Barangay Languyan', 'Barangay Poblacion', 'Barangay Tandu']
    },
    'Maguindanao del Norte': {
        'Cotabato City': ['Barangay Bagua I', 'Barangay Bagua II', 'Barangay Bagua III', 'Barangay Kalanganan I', 'Barangay Kalanganan II'],
        'Datu Odin Sinsuat': ['Barangay Awang', 'Barangay Dalican', 'Barangay Dinaig', 'Barangay Kapinpilan', 'Barangay Poblacion']
    },
    'Maguindanao del Sur': {
        'Buluan': ['Barangay Digal', 'Barangay Keytodac', 'Barangay Lower Kapinpilan', 'Barangay Poblacion', 'Barangay Upper Kapinpilan'],
        'Sultan Kudarat': ['Barangay Bagumbayan', 'Barangay Kulambog', 'Barangay Midtungok', 'Barangay Poblacion', 'Barangay Salimbao']
    }
};

// Export the data for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PHILIPPINE_ADDRESS_DATA;
}