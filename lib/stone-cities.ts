export interface StoneCity {
  slug: string; name: string; locative: string; pop: number; focus: string;
  scenario: string; warning: string; question: string; answer: string; nearby: string[]
}
// Data: population of cities in Podkarpackie, 2025, https://ranking-miast.pl/wojewodztwa/podkarpackie (GUS).
export const stoneCities: StoneCity[] = [
  {
    "slug": "rzeszow",
    "name": "Rzeszów",
    "locative": "w Rzeszowie",
    "pop": 199436,
    "focus": "Taras przy budynku mieszkalnym",
    "scenario": "W przypadku tarasu po starych płytkach sprawdź przede wszystkim stan wylewki, spadek od drzwi i ciągłość izolacji. Jeżeli fuga pękała przez kilka sezonów, przyczyna może znajdować się głębiej niż sama okładzina.",
    "warning": "Przy progu balkonowym trzeba zostawić miejsce na cały układ warstw, a przy czołach płyt przewidzieć okapnik.",
    "question": "Czy stare płytki można pozostawić?",
    "answer": "To zależy od przyczepności, wilgotności i szczelności istniejącego układu. Nie powinno się przykrywać odspojonej okładziny ani zamykać zawilgoconej wylewki.",
    "nearby": [
      "glogow-malopolski",
      "lancut",
      "sedziszow-malopolski"
    ]
  },
  {
    "slug": "mielec",
    "name": "Mielec",
    "locative": "w Mielcu",
    "pop": 56032,
    "focus": "Zewnętrzny podest przy wejściu",
    "scenario": "W strefie często użytkowanej zwróć uwagę na wnoszony na butach piasek, możliwość czyszczenia i odporność krawędzi. Wygląd kruszywa to tylko jeden z elementów wyboru; znaczenie ma także porowatość nawierzchni.",
    "warning": "Przy małym podeście oceń spadek od progu i czy woda z zadaszenia nie spływa na stopnie.",
    "question": "Czy fakturę kamiennego dywanu łatwo czyścić?",
    "answer": "W otwartych porach może zatrzymywać się drobny brud. Wybór frakcji i ewentualnego zamknięcia porów warto uzgodnić z wykonawcą na etapie doboru systemu.",
    "nearby": [
      "debica",
      "tarnobrzeg"
    ]
  },
  {
    "slug": "przemysl",
    "name": "Przemyśl",
    "locative": "w Przemyślu",
    "pop": 54352,
    "focus": "Zewnętrzne schody i podstopnice",
    "scenario": "Na schodach główną kwestią jest geometria stopni i nośność ich narożników. Wykończenie pionów wymaga odpowiedniego spoiwa, a profile krawędziowe powinny pasować do całego systemu, nie tylko koloru kruszywa.",
    "warning": "Przed wyceną policz stopnie i udokumentuj pęknięcia oraz miejsca styku ze ścianą.",
    "question": "Czy można wykonać pionowe podstopnice?",
    "answer": "Tak, pod warunkiem użycia systemu dopuszczającego aplikację pionową. Technika układania różni się od wykonania powierzchni poziomej.",
    "nearby": [
      "jaroslaw",
      "lubaczow"
    ]
  },
  {
    "slug": "stalowa-wola",
    "name": "Stalowa Wola",
    "locative": "w Stalowej Woli",
    "pop": 53540,
    "focus": "Większy taras z dylatacjami",
    "scenario": "Przy większej płycie dekoracyjna nawierzchnia musi respektować pracę podłoża. Nie można po prostu zasypać szczelin dylatacyjnych i traktować powierzchni jak monolitu; przebieg dylatacji należy uwzględnić w projekcie.",
    "warning": "Jeżeli obok tarasu jest chodnik na gruncie, sprawdź, czy ma osobną konstrukcję i odwodnienie.",
    "question": "Czy kamienny dywan przykryje dylatacje?",
    "answer": "Dylatacje konstrukcyjne muszą zachować swoją funkcję. Sposób przeniesienia ich przez nawierzchnię wynika z dokumentacji konkretnego systemu.",
    "nearby": [
      "nisko",
      "tarnobrzeg"
    ]
  },
  {
    "slug": "krosno",
    "name": "Krosno",
    "locative": "w Krośnie",
    "pop": 43274,
    "focus": "Balkon z balustradą",
    "scenario": "Na balkonie warto rozpocząć ocenę od mocowań balustrady, obróbek czoła płyty i połączenia przy progu. To detale decydujące o szczelności, których dekoracyjne kruszywo nie naprawi samodzielnie.",
    "warning": "Zdjęcie spodu balkonu może ujawnić zacieki wskazujące na wcześniejsze nieszczelności.",
    "question": "Czy wystarczy sam kamienny dywan na balkonie?",
    "answer": "Nie. W typowym otwartoporowym układzie konieczna jest osobna, poprawna hydroizolacja oraz szczelne detale krawędziowe.",
    "nearby": [
      "jaslo",
      "sanok"
    ]
  },
  {
    "slug": "tarnobrzeg",
    "name": "Tarnobrzeg",
    "locative": "w Tarnobrzegu",
    "pop": 42730,
    "focus": "Taras przy ogrodzie",
    "scenario": "W strefie połączonej z rabatami i trawnikiem liczy się nie tylko spadek samej płyty, lecz także dopływ wody z otoczenia. Obrzeża powinny ograniczać zabrudzenie kruszywa ziemią i umożliwiać odpływ.",
    "warning": "Ścieżka na gruncie i taras betonowy nie mają identycznych wymagań dotyczących podbudowy.",
    "question": "Czy wystarczy wysypać kruszywo z żywicą na grunt?",
    "answer": "Nie. Posadzka potrzebuje stabilnego, zgodnego z systemem podłoża i rozwiązania odwodnienia.",
    "nearby": [
      "nowa-deba",
      "stalowa-wola"
    ]
  },
  {
    "slug": "debica",
    "name": "Dębica",
    "locative": "w Dębicy",
    "pop": 42223,
    "focus": "Remont tarasu po płytkach",
    "scenario": "Jeśli płytki odspajają się albo pod nimi jest mokro, wycenę trzeba zacząć od diagnostyki podłoża. Nałożenie warstwy dekoracyjnej nie usuwa przyczyny zawilgocenia ani pękania starej wylewki.",
    "warning": "Rozbij w kosztorysie prace rozbiórkowe, naprawę spadku, izolację i warstwę dekoracyjną.",
    "question": "Czy można przykryć spękany beton?",
    "answer": "Dopiero po ustaleniu przyczyn rys i wykonaniu napraw właściwych dla danego systemu.",
    "nearby": [
      "ropczyce",
      "mielec"
    ]
  },
  {
    "slug": "jaroslaw",
    "name": "Jarosław",
    "locative": "w Jarosławiu",
    "pop": 34707,
    "focus": "Schody do drzwi wejściowych",
    "scenario": "Na stopniach zewnętrznych istotne są równomierne wysokości, odwodnienie stopnic i bezpieczna krawędź. Faktura kruszywa nie eliminuje konieczności odśnieżania ani ryzyka oblodzenia.",
    "warning": "Sprawdź sposób uszczelnienia progu i kierunek spływu wody z górnego podestu.",
    "question": "Czy kamienny dywan jest całkowicie nieślizgający zimą?",
    "answer": "Nie. Antypoślizgowość zależy od systemu i warunków; lodu i śniegu nie eliminuje żadna okładzina.",
    "nearby": [
      "przeworsk",
      "przemysl"
    ]
  },
  {
    "slug": "sanok",
    "name": "Sanok",
    "locative": "w Sanoku",
    "pop": 33488,
    "focus": "Taras narażony na cykle mrozu",
    "scenario": "Przy nawierzchniach na zewnątrz sprawdź szczelność izolacji i drogę odpływu wody, która w wersji otwartoporowej przenika przez dekoracyjne kruszywo. Bez poprawnego układu woda może zalegać pod wykończeniem.",
    "warning": "Ważna jest dostępna wysokość przy drzwiach na wszystkie warstwy i obróbki.",
    "question": "Czy kamienny dywan sam uszczelnia płytę?",
    "answer": "Nie, w systemie drenażowym ochronę konstrukcji zapewnia membrana hydroizolacyjna.",
    "nearby": [
      "krosno",
      "jaslo"
    ]
  },
  {
    "slug": "jaslo",
    "name": "Jasło",
    "locative": "w Jaśle",
    "pop": 32042,
    "focus": "Taras przy elewacji",
    "scenario": "Przy tarasie stykającym się z dociepleniem domu starannie zaplanuj cokoły i szczeliny przy ścianach. Sztywne połączenie różnych materiałów bez odpowiednich detali może prowadzić do problemów podczas zmian temperatury.",
    "warning": "Na małym tarasie koszty obróbek często mają duże znaczenie w całej wycenie.",
    "question": "Czy cokół można wykończyć tym samym kruszywem?",
    "answer": "Zwykle istnieją rozwiązania na piony, ale wymagają właściwego spoiwa i przygotowania podłoża.",
    "nearby": [
      "krosno",
      "debica"
    ]
  },
  {
    "slug": "lancut",
    "name": "Łańcut",
    "locative": "w Łańcucie",
    "pop": 17809,
    "focus": "Podest i stopnie wejściowe",
    "scenario": "W jednym zestawie wejściowym warto połączyć spójny wygląd stopnic, podstopnic i podestu, pamiętając o różnej pracochłonności tych elementów. Każdy fragment wymaga oceny nośności.",
    "warning": "Przed doborem grubości sprawdź próg drzwi i wysokość ostatniego stopnia.",
    "question": "Czy można wykończyć podest i schody jednakowo?",
    "answer": "Tak, jeśli system przewiduje zarówno poziome, jak i pionowe aplikacje oraz właściwe wykończenie krawędzi.",
    "nearby": [
      "rzeszow",
      "przeworsk"
    ]
  },
  {
    "slug": "ropczyce",
    "name": "Ropczyce",
    "locative": "w Ropczycach",
    "pop": 15834,
    "focus": "Wylewka tarasu wymagająca naprawy",
    "scenario": "Nawet równa wizualnie wylewka może mieć niewłaściwy spadek lub nadmierną wilgotność. Przed aplikacją żywicy należy skontrolować stan płyty i zgodność podłoża z parametrami technicznymi wybranego systemu.",
    "warning": "Na etapie kosztorysu uwzględnij też narożniki, cokoły i profile, nie tylko metry kwadratowe.",
    "question": "Czy do wyceny wystarczy powierzchnia w m²?",
    "answer": "Nie zawsze. Metraż określa skalę inwestycji, ale przygotowanie podłoża i detale mogą istotnie zmieniać koszt.",
    "nearby": [
      "sedziszow-malopolski",
      "debica"
    ]
  },
  {
    "slug": "przeworsk",
    "name": "Przeworsk",
    "locative": "w Przeworsku",
    "pop": 14354,
    "focus": "Zadaszone wejście do domu",
    "scenario": "Zadaszenie ogranicza kontakt z deszczem, ale nie usuwa ryzyka wilgoci w samym betonie ani podczas deszczu z wiatrem. Trzeba ustalić, czy schody są całkowicie osłonięte, a próg i boki poprawnie uszczelnione.",
    "warning": "Na podstopnicach dobór spoiwa i przygotowanie pionów są równie ważne jak kruszywo.",
    "question": "Czy pod zadaszeniem można pominąć hydroizolację?",
    "answer": "Taka decyzja wymaga oceny całej konstrukcji i specyfikacji systemu; samego zadaszenia nie można traktować jako izolacji.",
    "nearby": [
      "lancut",
      "jaroslaw"
    ]
  },
  {
    "slug": "nisko",
    "name": "Nisko",
    "locative": "w Nisku",
    "pop": 14117,
    "focus": "Strefa wejścia przy podjeździe",
    "scenario": "Kamienny dywan wybrany dla ruchu pieszego nie musi nadawać się pod obciążenia kołami auta. Jeżeli dekoracyjna strefa sąsiaduje z miejscem manewrowania, określ granicę użytkowania i wymagane parametry.",
    "warning": "Taras, podjazd i chodnik mogą wymagać różnych podbudów oraz grubości warstw.",
    "question": "Czy po kamiennym dywanie można jeździć samochodem?",
    "answer": "Tylko jeśli konkretny system został dopuszczony do takich obciążeń i zaprojektowano odpowiednią podbudowę.",
    "nearby": [
      "stalowa-wola",
      "lezajsk"
    ]
  },
  {
    "slug": "sedziszow-malopolski",
    "name": "Sędziszów Małopolski",
    "locative": "w Sędziszowie Małopolskim",
    "pop": 12472,
    "focus": "Taras domu jednorodzinnego",
    "scenario": "Przy tarasie połączonym ze schodami do ogrodu dobór powierzchni powinien zaczynać się od sprawdzenia spadku, szczelności progu i wilgotności betonu. Sam ładny kamień nie chroni płyty przed wodą.",
    "warning": "W starej wylewce usuwanie płytek może odkryć wilgoć. Nie warto przyspieszać aplikacji bez diagnostyki.",
    "question": "Czy kamienny dywan jest alternatywą dla płytek?",
    "answer": "Tak, pod warunkiem odbudowania wymaganych warstw hydroizolacyjnych i przygotowania podłoża. Zamiana okładziny nie naprawia mokrego tarasu.",
    "nearby": [
      "ropczyce",
      "rzeszow"
    ]
  },
  {
    "slug": "lezajsk",
    "name": "Leżajsk",
    "locative": "w Leżajsku",
    "pop": 12395,
    "focus": "Rodzinne schody zewnętrzne",
    "scenario": "Na codziennie używanych stopniach zwróć uwagę na noski, równomierne wysokości i możliwość utrzymania powierzchni. Starannie naprawione krawędzie są warunkiem właściwego wykonania nawierzchni.",
    "warning": "Warto osobno oszacować podest, piony i stopnice, gdyż różnią się nakładem prac.",
    "question": "Czy można pominąć naprawę wykruszonych narożników?",
    "answer": "Nie. Prawidłowa przyczepność wymaga nośnego, przygotowanego podłoża bez luźnych fragmentów.",
    "nearby": [
      "nisko",
      "lancut"
    ]
  },
  {
    "slug": "lubaczow",
    "name": "Lubaczów",
    "locative": "w Lubaczowie",
    "pop": 11125,
    "focus": "Balkon i detale przy balustradzie",
    "scenario": "Na małym balkonie punkty mocowania barierki mogą być bardziej kłopotliwe od samej powierzchni. Potrzebne jest szczelne rozwiązanie przejść przez hydroizolację i czoła płyty.",
    "warning": "Zrób zdjęcia mocowań balustrady i spodu balkonu, szczególnie jeśli widać wykwity lub zacieki.",
    "question": "Czy dywan kamienny uszczelni balkon z przeciekiem?",
    "answer": "Nie. Najpierw potrzebna jest diagnoza przecieku i odpowiednia membrana pod dekoracyjną warstwą.",
    "nearby": [
      "jaroslaw",
      "przemysl"
    ]
  },
  {
    "slug": "glogow-malopolski",
    "name": "Głogów Małopolski",
    "locative": "w Głogowie Małopolskim",
    "pop": 11112,
    "focus": "Nowy taras na etapie budowy",
    "scenario": "Na nowym tarasie lepiej uwzględnić kamienny dywan już podczas projektowania wysokości przy drzwiach, spadków i okapów. To łatwiejsze niż poprawki po wykonaniu elewacji lub osadzeniu stolarki.",
    "warning": "Przekrój warstw i projekt progu są na tym etapie cenniejsze niż zdjęcie koloru kamienia.",
    "question": "Kiedy wybrać system na nowy taras?",
    "answer": "Na etapie planowania detali budowlanych, a termin montażu dopiero po osiągnięciu wymaganych parametrów podłoża.",
    "nearby": [
      "rzeszow",
      "sedziszow-malopolski"
    ]
  },
  {
    "slug": "nowa-deba",
    "name": "Nowa Dęba",
    "locative": "w Nowej Dębie",
    "pop": 10091,
    "focus": "Podest, schody i odprowadzenie wody",
    "scenario": "Nawet niewielki podest może sprawiać problemy, gdy spadek prowadzi w stronę drzwi. Przed ułożeniem żywicy sprawdź również, czy wylot rynny nie kieruje strumienia bezpośrednio na stopnie.",
    "warning": "Kamienny dywan należy porównać z innymi okładzinami razem z kosztami napraw i obróbek.",
    "question": "Czy można układać kamienny dywan na starym betonie?",
    "answer": "Tak, jeśli beton jest nośny, suchy w granicach dopuszczonych przez system i odpowiednio przygotowany; często wymaga napraw.",
    "nearby": [
      "tarnobrzeg",
      "mielec"
    ]
  }
]
export const findStoneCity = (slug: string): StoneCity | undefined => stoneCities.find((city) => city.slug === slug)
