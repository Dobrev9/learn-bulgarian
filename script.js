(function(){
  var sec = document.getElementById("sec-catechisme");
  if(!sec) return;
  var KEY = "cat_chapter";
  var input = document.getElementById("cat-search");
  var count = document.getElementById("cat-count");
  var empty = document.getElementById("cat-empty");
  var frh = document.getElementById("cat-frh");
  var fhp = document.getElementById("cat-fhp");
  var prev = document.getElementById("cat-prev");
  var next = document.getElementById("cat-next");
  var btns = Array.prototype.slice.call(frh.querySelectorAll(".fh"));
  var arts = Array.prototype.slice.call(sec.querySelectorAll("article.cat-chapter"));
  var qas = Array.prototype.slice.call(sec.querySelectorAll(".cat-qa"));
  var heads = Array.prototype.slice.call(sec.querySelectorAll(".cat-h"));
  var cur = 0;
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function norm(s){ return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""); }
  qas.forEach(function(q){ q._t = norm(q.textContent); });

  function pick(i, scroll){
    cur = i;
    btns.forEach(function(b,k){ b.classList.toggle("on", k===i); b.setAttribute("aria-pressed", k===i); });
    arts.forEach(function(a,k){ a.hidden = k!==i; });
    var d = arts[i].dataset;
    fhp.innerHTML = '<span class="tl-date">Chapitre '+d.num+' · '+d.mins+' min de lecture · '+esc(d.range)+'</span><h3>'+esc(d.title)+'</h3><p>'+esc(d.epi)+'</p>';
    prev.hidden = i===0; next.hidden = i===arts.length-1;
    if(i>0) prev.textContent = "← Chapitre "+arts[i-1].dataset.num+" · "+arts[i-1].dataset.title;
    if(i<arts.length-1) next.textContent = "Chapitre "+arts[i+1].dataset.num+" · "+arts[i+1].dataset.title+" →";
    try{ localStorage.setItem(KEY, i); }catch(e){}
    if(scroll) frh.scrollIntoView({behavior:"smooth", block:"start"});
    var b = btns[i];
    if(b && frh.scrollWidth > frh.clientWidth && frh.style.flexWrap !== "wrap"){ try{ b.scrollIntoView({inline:"center", block:"nearest"}); }catch(e){} }
  }
  frh.addEventListener("click", function(e){
    var b = e.target.closest(".fh"); if(!b) return;
    if(input.value){ input.value = ""; filter(); }
    pick(+b.dataset.p, true);
  });
  prev.addEventListener("click", function(){ pick(cur-1, true); });
  next.addEventListener("click", function(){ pick(cur+1, true); });

  function filter(){
    var terms = norm(input.value).split(/\s+/).filter(Boolean);
    if(!terms.length){
      sec.classList.remove("cat-searching");
      qas.forEach(function(q){ q.hidden = false; });
      heads.forEach(function(h){ h.hidden = false; });
      count.textContent = ""; empty.hidden = true; pick(cur, false); return;
    }
    sec.classList.add("cat-searching");
    var total = 0;
    qas.forEach(function(q){
      var ok = terms.every(function(t){ return q._t.indexOf(t) !== -1; });
      q.hidden = !ok; if(ok) total++;
    });
    heads.forEach(function(h){ h.hidden = true; });
    arts.forEach(function(a){ a.hidden = !a.querySelector(".cat-qa:not([hidden])"); });
    count.textContent = total + (total > 1 ? " questions trouvées" : " question trouvée") + " dans tout le catéchisme";
    empty.hidden = total > 0;
  }
  var timer;
  input.addEventListener("input", function(){ clearTimeout(timer); timer = setTimeout(filter, 150); });

  var start = 0;
  try{ var s = parseInt(localStorage.getItem(KEY), 10); if(s >= 0 && s < arts.length) start = s; }catch(e){}
  pick(start, false);
})();

/* ---------------- DATA ---------------- */

const ALPHABET = [
  {l:"А а", name:"a", sound:'comme "a" de "papa"', ex:"апартамент — appartement"},
  {l:"Б б", name:"бъ (be)", sound:'comme "b"', ex:"баба — grand-mère"},
  {l:"В в", name:"въ (ve)", sound:'comme "v"', ex:"вода — eau"},
  {l:"Г г", name:"гъ (gue)", sound:'comme "g" dur de "gare"', ex:"град — ville"},
  {l:"Д д", name:"дъ (de)", sound:'comme "d"', ex:"ден — jour"},
  {l:"Е е", name:"e", sound:'comme "è" de "mère"', ex:"есен — automne"},
  {l:"Ж ж", name:"жъ (je)", sound:'comme "j" de "jour"', ex:"жена — femme"},
  {l:"З з", name:"зъ (ze)", sound:'comme "z"', ex:"здраве — santé"},
  {l:"И и", name:"i", sound:'comme "i" de "ici"', ex:"име — prénom"},
  {l:"Й й", name:"и кратко (i court)", sound:'comme "y" de "yaourt"', ex:"той — lui"},
  {l:"К к", name:"къ (ke)", sound:'comme "k"', ex:"къща — maison"},
  {l:"Л л", name:"лъ (le)", sound:'comme "l"', ex:"лято — été"},
  {l:"М м", name:"мъ (me)", sound:'comme "m"', ex:"море — mer"},
  {l:"Н н", name:"нъ (ne)", sound:'comme "n"', ex:"небе — ciel"},
  {l:"О о", name:"o", sound:'comme "o" de "porte"', ex:"око — œil"},
  {l:"П п", name:"пъ (pe)", sound:'comme "p"', ex:"приятел — ami"},
  {l:"Р р", name:"ръ (re)", sound:'"r" roulé', ex:"риба — poisson"},
  {l:"С с", name:"съ (se)", sound:'comme "s" de "sale"', ex:"слънце — soleil"},
  {l:"Т т", name:"тъ (te)", sound:'comme "t"', ex:"тук — ici"},
  {l:"У у", name:"u", sound:'comme "ou" de "fou"', ex:"улица — rue"},
  {l:"Ф ф", name:"фъ (fe)", sound:'comme "f"', ex:"филм — film"},
  {l:"Х х", name:"хъ (he)", sound:'"h" fortement aspiré', ex:"хляб — pain"},
  {l:"Ц ц", name:"цъ (tse)", sound:'comme "ts" de "tsar"', ex:"цвете — fleur"},
  {l:"Ч ч", name:"чъ (tche)", sound:'comme "tch" de "tchèque"', ex:"час — heure"},
  {l:"Ш ш", name:"шъ (che)", sound:'comme "ch" de "chat"', ex:"шапка — chapeau"},
  {l:"Щ щ", name:"щъ (chte)", sound:'comme "cht"', ex:"щастие — bonheur"},
  {l:"Ъ ъ", name:"ер голям", sound:'voyelle neutre, "e" muet', ex:"възраст — âge"},
  {l:"Ь ь", name:"ер малък", sound:"signe mou", ex:"рядко използван"},
  {l:"Ю ю", name:"ю (yu)", sound:'comme "you"', ex:"юг — sud"},
  {l:"Я я", name:"я (ya)", sound:'comme "ya"', ex:"ябълка — pomme"},
];

function getWordItems(catKey){
  return VOCAB[catKey].items.filter(it => it.type !== "table");
}

const VOCAB = {
  essentiel: {label:"Mots essentiel", items:[
    {bg:"Свобо́да и́ли смъ́рт", tr:"svoboda ili smart", fr:"La liberté ou la mort"},
    {bg:"страна́", tr:"strana", fr:"pays"},
    {bg:"държа́ва", tr:"darzhava", fr:"État / pays"},
    {bg:"въпро́с", tr:"vapros", fr:"question"},
    {bg:"не́що", tr:"neshto", fr:"quelque chose"},
    {bg:"ня́кой", tr:"nyakoy", fr:"quelqu'un"},
    {bg:"ни́кой", tr:"nikoy", fr:"personne (ne… personne)"},
    {bg:"зле", tr:"zle", fr:"mal"},
    {bg:"то́зи", tr:"tozi", fr:"ce / cet"},
    {bg:"та́зи", tr:"tazi", fr:"cette"},
    {bg:"това́", tr:"tova", fr:"ceci / cela"},
    {bg:"те́зи", tr:"tezi", fr:"ces"},
    {bg:"о́нзи", tr:"onzi", fr:"celui-là"},
    {bg:"она́зи", tr:"onazi", fr:"celle-là"},
    {bg:"оно́ва", tr:"onova", fr:"cela (là-bas)"},
    {bg:"оне́зи", tr:"onezi", fr:"ceux-là"},
    {bg:"твой", tr:"tvoy", fr:"ton / tien"},
    {bg:"не́гов", tr:"negov", fr:"son / le sien"},
    {bg:"не́ин", tr:"nein", fr:"son / le sien (fém.)"},
    {bg:"те́хен", tr:"tehen", fr:"leur / le leur"},
    {bg:"се́бе си", tr:"sebe si", fr:"soi-même"},
    {bg:"по́сле", tr:"posle", fr:"après / plus tard"},
    {bg:"ве́че", tr:"veche", fr:"déjà"},
    {bg:"Спо́мням си", tr:"Spomnyam si", fr:"je m'en rappelle"},
    {bg:"Така́ ли?", tr:"Taka li?", fr:"Ah bon ? / Vraiment ?"},
    {bg:"така́", tr:"taka", fr:"comme ça / ainsi / de cette manière"},
    {bg:"Вче́ра", tr:"Vchera", fr:"hier"},
    {bg:"преди́", tr:"predi", fr:"Avant"},
    {bg:"след", tr:"sled", fr:"Après"},
    {bg:"сле́дващата се́дмица", tr:"sledvashtata sedmitsa", fr:"la semaine prochaine"},
    {bg:"У́тре", tr:"Utre", fr:"Demain"},
    {bg:"Днес", tr:"Dnes", fr:"Aujourd'hui"},
    {bg:"да", tr:"da", fr:"à, que"},
    {bg:"и́ма", tr:"ima", fr:"il y a"},
    {bg:"за да", tr:"za da", fr:"pour que"},
    {bg:"И́скам да полу́ча бъ́лгарско гражда́нство", tr:"Iskam da polucha balgarsko grazhdanstvo", fr:"Je veux obtenir la nationalité bulgare."},
    {bg:"И́мам ну́жда от по́мощ", tr:"Imam nuzhda ot pomosht", fr:"J'ai besoin d'aide."},
    {bg:"А́ко Бог е за нас, кой мо́же да бъ́де проти́в нас?", tr:"Ako Bog e za nas, koy mozhe da bade protiv nas?", fr:"Si Dieu est pour nous, qui peut être contre nous ?"},
    {bg:"Ба́ща ми", tr:"Bashta mi", fr:"mon père"},
    {bg:"По вре́ме на", tr:"po vreme na", fr:"pendant (la réunion)"},
    {bg:"В продълже́ние на", tr:"v prodalzhenie na", fr:"pendant (3 semaines)"},
    {bg:"единаде́сет", tr:"edinadeset", fr:"onze (11)"},
    {bg:"два́десет", tr:"dvadeset", fr:"vingt (20)"},
    {bg:"два́десет и де́вет", tr:"dvadeset i devet", fr:"vingt-neuf (29)"},
    {bg:"Ще до́йда.", tr:"Shte doyda.", fr:"Je viendrai."},
    {bg:"Ще тръ́гнем.", tr:"Shte tragnem.", fr:"Nous partirons."},
    {bg:"Изо́бщо", tr:"Izobshto", fr:"Pas du tout"},
    {bg:"часа́", tr:"chasa", fr:"l'heure"},
    {bg:"в ко́йто", tr:"v koyto", fr:"à laquelle"},
    {bg:"жа́ден/жа́дна съм", tr:"zhaden/zhadna sam", fr:"j'ai soif"},
    {bg:"и́мам ну́жда от", tr:"imam nuzhda ot", fr:"j'ai besoin de"},
    {bg:"Пома́га", tr:"Pomaga", fr:"Ça aide"},
    {bg:"Пода́рък", tr:"Podarak", fr:"cadeau"},
    {bg:"автога́рата", tr:"avtogarata", fr:"la gare routière"},
    {bg:"лети́щето", tr:"letishteto", fr:"l'aéroport"},
    {bg:"наля́во", tr:"nalyavo", fr:"à gauche"},
    {bg:"надя́сно", tr:"nadyasno", fr:"à droite"},
    {bg:"Мно́го вку́сно!", tr:"Mnogo vkusno!", fr:"Délicieux !"},
    {bg:"понеде́лник", tr:"ponedelnik", fr:"lundi"},
    {bg:"вто́рник", tr:"vtornik", fr:"mardi"},
    {bg:"сря́да", tr:"sryada", fr:"mercredi"},
    {bg:"четвъ́ртък", tr:"chetvartak", fr:"jeudi"},
    {bg:"пе́тък", tr:"petak", fr:"vendredi"},
    {bg:"съ́бота", tr:"sabota", fr:"samedi"},
    {bg:"неде́ля", tr:"nedelya", fr:"dimanche"},
    {bg:"януа́ри / февруа́ри / март", tr:"yanuari / fevruari / mart", fr:"janvier / février / mars"},
    {bg:"апри́л / май / ю́ни", tr:"april / may / juni", fr:"avril / mai / juin"},
    {bg:"ю́ли / а́вгуст / септе́мври", tr:"juli / avgust / septemvri", fr:"juillet / août / septembre"},
    {bg:"окто́мври / ное́мври / деке́мври", tr:"oktomvri / noemvri / dekemvri", fr:"octobre / novembre / décembre"},
    {bg:"сега́", tr:"sega", fr:"maintenant"},
    {bg:"Ко́лко стру́ва?", tr:"Kolko struva?", fr:"Combien ça coûte ?"}
  ]},
  greetings: {label:"Salutations & Civilités", items:[
    {bg:"Здраве́й", tr:"Zdravey", fr:"Salut (tu)"},
    {bg:"Здраве́йте", tr:"Zdraveyte", fr:"Bonjour / Salut (vous)"},
    {bg:"Добро́ у́тро", tr:"Dobro utro", fr:"Bonjour (matin)"},
    {bg:"Добъ́р ден", tr:"Dobar den", fr:"Bonjour (journée)"},
    {bg:"Добъ́р ве́чер", tr:"Dobar vecher", fr:"Bonsoir"},
    {bg:"Ле́ка нощ", tr:"Leka nosht", fr:"Bonne nuit"},
    {bg:"Дови́ждане", tr:"Dovizhdane", fr:"Au revoir"},
    {bg:"Ча́о", tr:"Chao", fr:"Salut (au revoir)"},
    {bg:"Благодаря́", tr:"Blagodarya", fr:"Merci"},
    {bg:"Мо́ля", tr:"Molya", fr:"S'il vous plaît / Je vous en prie"},
    {bg:"Извине́те", tr:"Izvinete", fr:"Excusez-moi"},
    {bg:"Съжаля́вам", tr:"Sazhalyavam", fr:"Désolé"},
    {bg:"Да", tr:"Da", fr:"Oui"},
    {bg:"Не", tr:"Ne", fr:"Non"},
    {bg:"Как си?", tr:"Kak si?", fr:"Comment vas-tu ?"},
    {bg:"Добре́ съм", tr:"Dobre sam", fr:"Je vais bien"},
    {bg:"Прия́тно ми е", tr:"Priyatno mi e", fr:"Enchanté(e)"},
    {bg:"Ка́звам се...", tr:"Kazvam se...", fr:"Je m'appelle..."},
    {bg:"Аз съм французи́н", tr:"Az sam frantsuzin", fr:"Je suis français (homme)"},
    {bg:"Аз съм французо́йка", tr:"Az sam frantsuzoyka", fr:"Je suis française"},
    {bg:"Как се ка́звате?", tr:"Kak se kazvate?", fr:"Comment vous appelez-vous ?"},
    {bg:"Откъде́ сте?", tr:"Otkade ste?", fr:"D'où êtes-vous ?"},
    {bg:"Аз съм от Фра́нция", tr:"Az sam ot Frantsiya", fr:"Je viens de France"},
  ]},
  verbs: {label:"Verbes & Conjugaisons", items:[
    {bg:"съм / си / е / сме / сте / са", tr:"sam, si, e, sme, ste, sa", fr:"être (je suis, tu es, il est...)"},
    {bg:"и́мам / и́маш / и́ма...", tr:"imam, imash, ima...", fr:"avoir (j'ai, tu as, il a...)"},
    {bg:"пра́вя / пра́виш / пра́ви", tr:"pravya, pravish, pravi", fr:"faire (je fais, tu fais, il fait)"},
    {bg:"напра́вих / напра́ви", tr:"napravih, napravi", fr:"j'ai fait / tu as fait"},
    {bg:"мо́га / мо́жеш / мо́же", tr:"moga, mozhesh, mozhe", fr:"pouvoir (je peux, tu peux, il peut)"},
    {bg:"и́скам", tr:"iskam", fr:"vouloir"},
    {bg:"зна́м", tr:"znam", fr:"savoir"},
    {bg:"разби́рам", tr:"razbiram", fr:"comprendre"},
    {bg:"говоря́", tr:"govorya", fr:"parler"},
    {bg:"оти́вам / оти́да / хо́дя", tr:"otivam, otida, hodya", fr:"aller (en train d'aller / une fois / habituellement)"},
    {bg:"оти́дох / оти́де / оти́доха", tr:"otidoh, otide, otidoha", fr:"je suis allé / tu es allé / ils sont allés"},
    {bg:"живе́я / живе́еш / живе́е", tr:"zhiveya, zhiveesh, zhivee", fr:"habiter / vivre"},
    {bg:"рабо́тя", tr:"rabotya", fr:"travailler"},
    {bg:"бях / бе́ше / бя́хме", tr:"byah, beshe, byahme", fr:"j'étais / tu étais / nous étions"},
    {bg:"ка́звам / ка́зваш / ка́зва", tr:"kazvam, kazvash, kazva", fr:"dire / appeler"},
    {bg:"да дам / да даде́ш / да даде́", tr:"da dam, da dadesh, da dade", fr:"que je donne / que tu donnes / qu'il donne"},
    {bg:"да́вам / да́ваш / да́ва", tr:"davam, davash, dava", fr:"donner (présent)"},
    {bg:"у́ча / у́чиш / у́чи", tr:"ucha, uchish, uchi", fr:"apprendre / étudier"},
    {bg:"ям", tr:"yam", fr:"manger"},
    {bg:"пи́я", tr:"piya", fr:"boire"},
  ]},
  lucy: {label:"Notes & Expressions", items:[
    {bg:"Това́ е за мен.", tr:"", fr:"C'est pour moi."},
    {bg:"Как да кажа́…?", tr:"kak da kazha", fr:"Comment dire… ? (littéralement : как « comment » + да + кажа « je dis »)"},
    {bg:"говоря́", tr:"govorya", fr:"parler"},
    {bg:"И́скам да говоря́ за…", tr:"iskam da govorya za", fr:"Je veux parler de…"},
    {bg:"Бих и́скал/и́скала да говоря́ за…", tr:"bih iskal/iskala da govorya za", fr:"Je voudrais parler de…"},
    {bg:"с Лю́си", tr:"s Lyusi", fr:"avec Lucy"},
    {bg:"Чести́та Ба́ба Ма́рта", tr:"chestita Baba Marta", fr:"Joyeuse Baba Marta ! (fête traditionnelle du 1er mars)"},
    {bg:"брое́ница", tr:"broenitsa", fr:"chapelet / rosaire (fil à compter)"},
    {bg:"Спо́мням си", tr:"", fr:"je m'en rappelle"},
    {bg:"краси́во е", tr:"", fr:"c'est beau"},
    {bg:"Тру́дно е", tr:"", fr:"c'est difficile"},
    {bg:"На два́десет и две годи́ни съм", tr:"", fr:"J'ai vingt-deux ans."},
    {bg:"И́скам да чета́.", tr:"", fr:"Je veux lire. (Infinitif)"},
    {bg:"Така́ ли?", tr:"", fr:"Ah bon ? / Vraiment ?"},
    {bg:"така́", tr:"", fr:"comme ça / ainsi / de cette manière"},
    {bg:"Това́ е мо́ята прия́телка Лучи́я", tr:"", fr:"C'est mon amie Lucía."},
    {bg:"Днес хо́дих на рабо́та", tr:"", fr:"Aujourd'hui, je suis allé(e) au travail."},
    {bg:"У́тре ще хо́дя на рабо́та", tr:"", fr:"Demain, j'irai au travail."},
    {bg:"Вче́ра", tr:"", fr:"hier"},
    {bg:"преди́", tr:"", fr:"Avant"},
    {bg:"след", tr:"", fr:"Après"},
    {bg:"сле́дващата се́дмица", tr:"", fr:"la semaine prochaine"},
    {bg:"У́ча се да говоря́ бъ́лгарски.", tr:"", fr:"J'apprends à parler bulgare."},
    {bg:"Да гово́рим на бъ́лгарски", tr:"", fr:"Parlons en bulgare."},
    {bg:"да", tr:"", fr:"à, que"},
    {bg:"си́чко", tr:"", fr:"tout"},
    {bg:"и́ма", tr:"", fr:"il y a"},
    {bg:"за да", tr:"", fr:"pour que"},
    {bg:"Сме́свам", tr:"", fr:"je mélange"},
    {bg:"кой", tr:"", fr:"qui ?, който = qui, lequel"},
    {bg:"И́скам да полу́ча бъ́лгарско гражда́нство", tr:"", fr:"Je veux obtenir la nationalité bulgare."},
    {bg:"и осве́н това́", tr:"i osven tova", fr:"et en plus"},
    {bg:"Ни́що не пра́ви", tr:"", fr:"Il/Elle ne fait rien."},
    {bg:"И́мам ну́жда от по́мощ", tr:"", fr:"J'ai besoin d'aide."},
    {bg:"И́скаш ли по́мощ?", tr:"", fr:"Veux-tu de l'aide ?"},
    {bg:"А́ко Бог е за нас, кой мо́же да бъ́де проти́в нас?", tr:"", fr:"Si Dieu est pour nous, qui peut être contre nous ?"},
    {bg:"Лю́си, би ли ми напра́вила едно́ кафе́, мо́ля?", tr:"", fr:"Lucy, pourrais-tu me faire un café, s'il te plaît ?"},
    {bg:"Мо́же ли едно́ кафе́, мо́ля?", tr:"", fr:"Je pourrais avoir un café, s'il vous plaît ?"},
    {bg:"Бих и́скал едно́ кафе́, мо́ля", tr:"", fr:"Je voudrais un café, s'il vous plaît."},
    {bg:"вме́сто", tr:"", fr:"au lieu de"},
    {bg:"Предпочи́там да у́ча бъ́лгарски", tr:"", fr:"Je préfère apprendre le bulgare."},
    {bg:"в съ́щото вре́ме", tr:"", fr:"au même moment / en même temps"},
    {bg:"Ба́ща ми", tr:"", fr:"mon père"},
    {bg:"тя", tr:"tya", fr:"elle"},
    {bg:"Мо́же ли еди́н стол?", tr:"", fr:"Je pourrais avoir une chaise ?"},
    {bg:"Мо́же ли сто́лът?", tr:"", fr:"Je pourrais avoir la chaise ?"},
    {bg:"Днес оти́дох на рабо́та. Бе́ше тру́дно", tr:"", fr:"Aujourd'hui je suis allé(e) au travail. C'était difficile."},
    {bg:"По вре́ме на", tr:"po vreme na", fr:"pendant (la réunion)"},
    {bg:"В продълже́ние на", tr:"v prodalzhenie na", fr:"pendant (3 semaines)"},
    {bg:"Попи́тах го", tr:"", fr:"je lui ai demandé"},
    {bg:"се", tr:"se", fr:"particule réfléchie « se »"},
    {bg:"Да́вам ти кни́гата.", tr:"", fr:"Je te donne le livre."},
    {bg:"Все́ки ден да́вам храна́ на ку́чето.", tr:"", fr:"Chaque jour, je donne de la nourriture au chien."},
    {bg:"единаде́сет", tr:"edinadeset", fr:"onze (11)"},
    {bg:"два́десет", tr:"dvadeset", fr:"vingt (20)"},
    {type:"table", title:"Les jours de la semaine", rows:[
      ["Lundi","понеде́лник"],["Mardi","вто́рник"],["Mercredi","сря́да"],["Jeudi","четвъ́ртък"],
      ["Vendredi","пе́тък"],["Samedi","съ́бота"],["Dimanche","неде́ля"]
    ]},
    {type:"table", title:"Aller (passé) — отидох", rows:[
      ["Je suis allé","оти́дох"],["Tu es allé","оти́де"],["Il/Elle est allé(e)","оти́де"],
      ["Nous sommes allés","оти́дохме"],["Vous êtes allés","оти́дохте"],["Ils/Elles sont allés","оти́доха"]
    ]},
    {type:"table", title:"Être (imparfait) — бях", rows:[
      ["J'étais","бях"],["Tu étais","бе́ше"],["Il/Elle était","бе́ше"],
      ["Nous étions","бя́хме"],["Vous étiez","бя́хте"],["Ils/Elles étaient","бя́ха"]
    ]},
    {type:"table", title:"Adjectifs possessifs (forme courte)", rows:[
      ["mon / ma / mes","ми"],["ton / ta / tes","ти"],["son / sa / ses (à lui)","му"],
      ["son / sa / ses (à elle)","ѝ"],["notre / nos","ни"],["votre / vos","ви"],["leur / leurs","им"]
    ]},
    {type:"table", title:"Vivre — живея", rows:[
      ["Je vis","живе́я"],["Tu vis","живе́еш"],["Il/Elle vit","живе́е"],
      ["Nous vivons","живе́ем"],["Vous vivez","живе́ете"],["Ils/Elles vivent","живе́ят"]
    ]},
    {type:"table", title:"Dire — казвам", rows:[
      ["Je dis","ка́звам"],["Tu dis","ка́зваш"],["Il/Elle dit","ка́зва"],
      ["Nous disons","ка́зваме"],["Vous dites","ка́звате"],["Ils/Elles disent","ка́зват"]
    ]},
    {type:"table", title:"Subjonctif de donner — да дам", rows:[
      ["que je donne","да дам"],["que tu donnes","да даде́ш"],["qu'il/elle donne","да даде́"],
      ["que nous donnions","да даде́м"],["que vous donniez","да даде́те"],["qu'ils donnent","да дада́т"]
    ]},
    {type:"table", title:"Donner (présent) — давам", rows:[
      ["Je donne","да́вам"],["Tu donnes","да́ваш"],["Il/Elle donne","да́ва"],
      ["Nous donnons","да́ваме"],["Vous donnez","да́вате"],["Ils/Elles donnent","да́ват"]
    ]},
    {type:"table", title:"Mots interrogatifs", rows:[
      ["Qui ?","Кой? (homme), Коя? (femme), Кое? (neutre), Кои? (pluriel)"],
      ["Quoi ?","Какво́?"],["Où ?","Къде́?"],["Quand ?","Кога́?"],["Comment ?","Как?"],
      ["Pourquoi ?","Защо́?"],["Combien ?","Ко́лко?"],["Lequel ?","Кой? / Коя? / Кое?"]
    ]},
    {type:"table", title:"Apprendre — уча", rows:[
      ["J'apprends","у́ча"],["Tu apprends","у́чиш"],["Il/Elle apprend","у́чи"],
      ["Nous apprenons","у́чим"],["Vous apprenez","у́чите"],["Ils/Elles apprennent","у́чат"]
    ]},
    {type:"table", title:"Aller : отивам / отида / ходя", rows:[
      ["","оти́вам (être en train d'aller) — оти́да (aller une fois, perfectif) — хо́дя (aller habituellement)"],
      ["Je","оти́вам — оти́да — хо́дя"],["Tu","оти́ваш — оти́деш — хо́диш"],["Il/Elle","оти́ва — оти́де — хо́ди"],
      ["Nous","оти́ваме — оти́дем — хо́дим"],["Vous","оти́вате — оти́дете — хо́дите"],["Ils/Elles","оти́ват — оти́дат — хо́дят"]
    ]},
    {type:"table", title:"Pronoms personnels sujets", rows:[
      ["je","аз"],["tu","ти"],["il","той"],["elle","тя"],["il/elle (neutre, « cela »)","то"],
      ["nous","ни́е"],["vous (pluriel ou politesse)","ви́е"],["ils / elles","те"]
    ]},
    {type:"table", title:"Expressions de base", rows:[
      ["bonjour","здраве́й"],["merci","благодаря́"],["oui","да"],["non","не"],
      ["je suis","аз съм"],["tu es","ти си"],["il est","той е"],
      ["avoir","и́мам"],["aimer","оби́чам"],["manger","ям"],["boire","пи́я"]
    ]},
    {type:"table", title:"Être — съм", rows:[
      ["je suis","съм"],["tu es","си"],["il est","е"],["elle est","е"],
      ["nous sommes","сме"],["vous êtes","сте"],["ils sont","са"]
    ]},
    {type:"table", title:"Avoir — имам", rows:[
      ["j'ai","и́мам"],["tu as","и́маш"],["il a","и́ма"],
      ["nous avons","и́маме"],["vous avez","и́мате"],["ils ont","и́мат"]
    ]},
    {type:"table", title:"Faire (présent) — правя", rows:[
      ["je fais","пра́вя"],["tu fais","пра́виш"],["il fait","пра́ви"],
      ["nous faisons","пра́вим"],["vous faites","пра́вите"],["ils font","пра́вят"]
    ]},
    {type:"table", title:"Faire (passé) — направих", rows:[
      ["j'ai fait","напра́вих"],["tu as fait","напра́ви"],["il/elle a fait","напра́ви"],
      ["nous avons fait","напра́вихме"],["vous avez fait","напра́вихте"],["ils/elles ont fait","напра́виха"]
    ]},
    {type:"table", title:"Pouvoir — мога", rows:[
      ["je peux","мо́га"],["tu peux","мо́жеш"],["il peut","мо́же"],
      ["nous pouvons","мо́жем"],["vous pouvez","мо́жете"],["ils peuvent","мо́гат"]
    ]},
    {bg:"Това́ е", tr:"", fr:"c'est"},
    {bg:"И́маш ли кни́га? / И́маш ли кни́гата?", tr:"", fr:"As-tu un livre ? / As-tu le livre ?"},
    {bg:"Какво́ е това́?", tr:"", fr:"Qu'est-ce que c'est ? (à comparer au russe : Что это?)"},
    {bg:"Ще присти́гна в Со́фия на 29-и.", tr:"", fr:"J'arriverai à Sofia le 29."},
    {bg:"два́десет и де́вет", tr:"", fr:"vingt-neuf (29)"},
    {bg:"Ще до́йда.", tr:"", fr:"Je viendrai."},
    {bg:"Ще тръ́гнем.", tr:"", fr:"Nous partirons."},
    {bg:"ни", tr:"", fr:"nous"},
    {bg:"Тя и́ма", tr:"", fr:"Elle a"},
    {bg:"Ще хо́дя", tr:"", fr:"j'irai / je vais marcher"},
    {bg:"Ще вали́", tr:"", fr:"il va pleuvoir"},
    {bg:"Тя чете́", tr:"", fr:"elle lit"},
    {bg:"Не яде́", tr:"", fr:"elle ne mange pas"},
    {bg:"Изо́бщо", tr:"", fr:"Pas du tout"},
    {bg:"Къ́сно е", tr:"", fr:"il est tard"},
    {bg:"То лети́", tr:"", fr:"il vole"},
    {bg:"Сме́е се", tr:"", fr:"Il rit"},
    {bg:"зака́ра", tr:"", fr:"emmener, conduire"},
    {bg:"до", tr:"", fr:"jusqu'à, vers, à"},
    {bg:"в зави́симост от", tr:"", fr:"selon"},
    {bg:"часа́", tr:"", fr:"l'heure"},
    {bg:"в ко́йто", tr:"", fr:"à laquelle"},
    {bg:"биле́тът", tr:"", fr:"billet"},
    {bg:"за автобу́са", tr:"", fr:"le bus"},
    {bg:"Ми́тко ще ни зака́ра до Ри́лския манасти́р на 30-и или на 31-ви, в зави́симост от часа́, в ко́йто е биле́тът ни за автобу́са до Ва́рна.", tr:"", fr:"Mitko nous emmènera au monastère de Rila le 30 ou le 31, selon l'heure de notre billet de bus pour Varna."},
    {bg:"Аз съм у Лю́си", tr:"", fr:"Je suis chez Lucy."},
    {bg:"здраве́й", tr:"", fr:"salut / bonjour"},
    {bg:"защо́то", tr:"", fr:"parce que"},
    {bg:"защо́", tr:"", fr:"pourquoi"},
    {bg:"какво́", tr:"", fr:"quoi / que"},
    {bg:"а́ко", tr:"", fr:"si"},
    {bg:"и́ли", tr:"", fr:"ou"},
    {bg:"затова́", tr:"", fr:"donc / c'est pourquoi"},
    {bg:"и така́", tr:"", fr:"donc / alors"},
    {bg:"но", tr:"", fr:"mais"},
    {bg:"не разби́рам", tr:"", fr:"Je ne comprends pas"},
    {bg:"мо́ля, мо́га ли да полу́ча", tr:"", fr:"S'il vous plaît, puis-je avoir…"},
    {bg:"не зна́м", tr:"", fr:"Je ne sais pas"},
    {bg:"не съм си́гурен", tr:"", fr:"Je ne suis pas sûr(e)"},
    {bg:"съжаля́вам", tr:"", fr:"Je suis désolé(e) / Pardon"},
    {bg:"аз съм", tr:"", fr:"je suis"},
    {bg:"и́мам", tr:"", fr:"j'ai"},
    {bg:"тъ́рсене", tr:"", fr:"chercher / la recherche"},
    {bg:"и́скам", tr:"", fr:"je veux"},
    {bg:"жа́ден/жа́дна съм", tr:"", fr:"j'ai soif"},
    {bg:"и́мам ну́жда от", tr:"", fr:"j'ai besoin de"},
    {bg:"аз пи́я", tr:"", fr:"je bois"},
    {bg:"ям", tr:"", fr:"je mange"},
    {bg:"сега́", tr:"", fr:"maintenant"},
    {bg:"Пома́га", tr:"", fr:"Ça aide"},
    {bg:"Пода́рък", tr:"", fr:"cadeau"},
    {bg:"ча́кай", tr:"", fr:"attends"},
    {bg:"Извине́те", tr:"", fr:"Excusez-moi"},
    {bg:"Мо́жете ли да ми помо́гнете?", tr:"", fr:"Pouvez-vous m'aider ?"},
    {bg:"Къде́ е...?", tr:"", fr:"Où est...?"},
    {bg:"автога́рата", tr:"", fr:"la gare routière"},
    {bg:"лети́щето", tr:"", fr:"l'aéroport"},
    {bg:"наля́во", tr:"", fr:"à gauche"},
    {bg:"надя́сно", tr:"", fr:"à droite"},
    {bg:"Мно́го вку́сно!", tr:"", fr:"Délicieux !"},
    {bg:"Ко́лко стру́ва?", tr:"", fr:"Combien ça coûte ?"},
    {bg:"До то́зи адре́с, мо́ля.", tr:"", fr:"À cette adresse, s'il vous plaît."}
  ]},
  grammar: {label:"Pronoms, Questions & Grammaire", items:[
    {bg:"аз / ти / той / тя / то", tr:"az, ti, toy, tya, to", fr:"je, tu, il, elle, il/elle (neutre)"},
    {bg:"ни́е / ви́е / те", tr:"nie, vie, te", fr:"nous, vous, ils / elles"},
    {bg:"ми / ти / му / ѝ / ни / ви / им", tr:"mi, ti, mu, i, ni, vi, im", fr:"mon, ton, son (lui), son (elle), notre, votre, leur"},
    {bg:"Как? / Кой? / Какво́?", tr:"Kak? / Koy? / Kakvo?", fr:"Comment ? / Qui ? / Quoi ?"},
    {bg:"Къде́? / Кога́? / Защо́? / Ко́лко?", tr:"Kade? / Koga? / Zashto? / Kolko?", fr:"Où ? / Quand ? / Pourquoi ? / Combien ?"},
    {bg:"Кой? Коя? Кое? Кои?", tr:"Koy? Koya? Koe? Koi?", fr:"Lequel (masc, fém, neutre, pluriel)"},
    {bg:"Това́ е", tr:"Tova e", fr:"C'est"},
    {bg:"И́маш ли кни́га? / кни́гата?", tr:"Imash li kniga? / knigata?", fr:"As-tu un livre ? / le livre ?"},
    {bg:"Какво́ е това́? (Что это?)", tr:"Kakvo e tova?", fr:"Qu'est-ce que c'est ?"},
  ]},
  numbers: {label:"Nombres & Chiffres", items:[
    {bg:"ну́ла", tr:"nula", fr:"0 - zéro"},
    {bg:"едно́", tr:"edno", fr:"1 - un"},
    {bg:"две", tr:"dve", fr:"2 - deux"},
    {bg:"три", tr:"tri", fr:"3 - trois"},
    {bg:"че́тири", tr:"chetiri", fr:"4 - quatre"},
    {bg:"пет", tr:"pet", fr:"5 - cinq"},
    {bg:"шест", tr:"shest", fr:"6 - six"},
    {bg:"се́дем", tr:"sedem", fr:"7 - sept"},
    {bg:"о́сем", tr:"osem", fr:"8 - huit"},
    {bg:"де́вет", tr:"devet", fr:"9 - neuf"},
    {bg:"де́сет", tr:"deset", fr:"10 - dix"},
    {bg:"единаде́сет", tr:"edinadeset", fr:"11 - onze"},
    {bg:"дванаде́сет", tr:"dvanadeset", fr:"12 - douze"},
    {bg:"тринаде́сет", tr:"trinadeset", fr:"13 - treize"},
    {bg:"четиринаде́сет", tr:"chetirinadeset", fr:"14 - quatorze"},
    {bg:"петнаде́сет", tr:"petnadeset", fr:"15 - quinze"},
    {bg:"шестнаде́сет", tr:"shestnadeset", fr:"16 - seize"},
    {bg:"седемнаде́сет", tr:"sedemnadeset", fr:"17 - dix-sept"},
    {bg:"осемнаде́сет", tr:"osemnadeset", fr:"18 - dix-huit"},
    {bg:"деветнаде́сет", tr:"devetnadeset", fr:"19 - dix-neuf"},
    {bg:"два́десет", tr:"dvadeset", fr:"20 - vingt"},
    {bg:"два́десет и де́вет", tr:"dvadeset i devet", fr:"29 - vingt-neuf"},
    {bg:"три́десет", tr:"trideset", fr:"30 - trente"},
    {bg:"сто", tr:"sto", fr:"100 - cent"},
  ]},
  time: {label:"Jours, Mois & Temps", items:[
    {bg:"понеде́лник", tr:"ponedelnik", fr:"lundi"},
    {bg:"вто́рник", tr:"vtornik", fr:"mardi"},
    {bg:"сря́да", tr:"sryada", fr:"mercredi"},
    {bg:"четвъ́ртък", tr:"chetvartak", fr:"jeudi"},
    {bg:"пе́тък", tr:"petak", fr:"vendredi"},
    {bg:"съ́бота", tr:"sabota", fr:"samedi"},
    {bg:"неде́ля", tr:"nedelya", fr:"dimanche"},
    {bg:"януа́ри / февруа́ри / март", tr:"yanuari / fevruari / mart", fr:"janvier / février / mars"},
    {bg:"апри́л / май / ю́ни", tr:"april / may / juni", fr:"avril / mai / juin"},
    {bg:"ю́ли / а́вгуст / септе́мври", tr:"juli / avgust / septemvri", fr:"juillet / août / septembre"},
    {bg:"окто́мври / ное́мври / деке́мври", tr:"oktomvri / noemvri / dekemvri", fr:"octobre / novembre / décembre"},
    {bg:"сега́", tr:"sega", fr:"maintenant"},
  ]},
  food: {label:"Nourriture, Boissons & Restaurant", items:[
    {bg:"Вода́", tr:"Voda", fr:"Eau"},
    {bg:"Кафе́", tr:"Kafe", fr:"Café"},
    {bg:"Чай", tr:"Chay", fr:"Thé"},
    {bg:"Би́ра", tr:"Bira", fr:"Bière"},
    {bg:"Ви́но", tr:"Vino", fr:"Vin"},
    {bg:"Хляб", tr:"Hlyab", fr:"Pain"},
    {bg:"мля́ко", tr:"mlyako", fr:"lait"},
    {bg:"си́рене", tr:"sirene", fr:"fromage blanc bulgare"},
    {bg:"сала́та", tr:"salata", fr:"salade"},
    {bg:"су́па", tr:"supa", fr:"soupe"},
    {bg:"месо́", tr:"meso", fr:"viande"},
    {bg:"Меню́", tr:"Menu", fr:"Menu"},
    {bg:"Сме́тката, мо́ля", tr:"Smetkata, molya", fr:"L'addition, s'il vous plaît"},
    {bg:"Мно́го вку́сно!", tr:"Mnogo vkusno!", fr:"C'est très délicieux !"},
  ]},
  travel: {label:"Hôtel, Transport & Ville", items:[
    {bg:"Ста́я", tr:"Staya", fr:"Chambre"},
    {bg:"Ключ", tr:"Klyuch", fr:"Clé"},
    {bg:"Резерва́ция", tr:"Rezervatsiya", fr:"Réservation"},
    {bg:"Ба́ня", tr:"Banya", fr:"Salle de bain"},
    {bg:"Заку́ска", tr:"Zakuska", fr:"Petit-déjeuner"},
    {bg:"Автобу́с", tr:"Avtobus", fr:"Bus"},
    {bg:"Влак", tr:"Vlak", fr:"Train"},
    {bg:"Лети́ще", tr:"Letishte", fr:"Aéroport"},
    {bg:"Биле́т", tr:"Bilet", fr:"Billet"},
    {bg:"Такси́", tr:"Taksi", fr:"Taxi"},
    {bg:"Га́ра", tr:"Gara", fr:"Gare"},
    {bg:"автога́рата / лети́щето", tr:"avtogarata / letishteto", fr:"la gare routière / l'aéroport"},
    {bg:"наля́во / надя́сно", tr:"nalyavo / nadyasno", fr:"à gauche / à droite"},
    {bg:"Къде́ е...?", tr:"Kade e...?", fr:"Où est... ?"},
    {bg:"До то́зи адре́с, мо́ля.", tr:"Do tozi adres, molya.", fr:"À cette adresse, s'il vous plaît."},
  ]},
  survival: {label:"Survie & Anglais-Bulgare", items:[
    {bg:"Не разби́рам", tr:"Ne razbiram", fr:"Je ne comprends pas"},
    {bg:"Гово́рите ли фре́нски / англи́йски?", tr:"Govorite li frenski / angliyski?", fr:"Parlez-vous français / anglais ?"},
    {bg:"По́мощ! / Помо́жете ми", tr:"Pomosht! / Pomozhete mi", fr:"Au secours ! / Aidez-moi !"},
    {bg:"Къде́ е тоале́тната?", tr:"Kade e tualetnata?", fr:"Où sont les toilettes ?"},
    {bg:"Ко́лко стру́ва?", tr:"Kolko struva?", fr:"Combien ça coûte ?"},
    {bg:"Мо́же ли? / Еди́н моме́нт", tr:"Mozhe li? / Edin moment", fr:"Est-ce possible ? / Un instant"},
    {bg:"защо́то / защо́ / какво́", tr:"zashtoto / zashto / kakvo", fr:"parce que / pourquoi / quoi"},
    {bg:"а́ко / и́ли / затова́ / но", tr:"ako / ili / zatova / no", fr:"si / ou / par conséquent / mais"},
    {bg:"не зна́м / не съм си́гурен", tr:"ne znam / ne sam siguren", fr:"je ne sais pas / je ne suis pas sûr"},
    {bg:"и́мам ну́жда от / жа́ден съм", tr:"imam nuzhda ot / zhaden sam", fr:"j'ai besoin de / j'ai soif"},
    {bg:"Пома́га / Пода́рък / Ча́кай", tr:"Pomaga / Podarak / Chakay", fr:"Ça aide / Cadeau / Attends"},
  ]},
  base: {label:"Base : pronoms, gens & questions", items:[
    {bg:"аз", tr:"az", fr:"je"},
    {bg:"ти", tr:"ti", fr:"tu"},
    {bg:"той", tr:"toy", fr:"il"},
    {bg:"тя", tr:"tya", fr:"elle"},
    {bg:"то", tr:"to", fr:"il/elle (neutre)"},
    {bg:"ни́е", tr:"nie", fr:"nous"},
    {bg:"ви́е", tr:"vie", fr:"vous"},
    {bg:"те", tr:"te", fr:"ils / elles"},
    {bg:"чове́к", tr:"chovek", fr:"personne / être humain"},
    {bg:"хо́ра", tr:"hora", fr:"gens"},
    {bg:"мъж", tr:"mazh", fr:"homme"},
    {bg:"жена́", tr:"zhena", fr:"femme"},
    {bg:"дете́", tr:"dete", fr:"enfant"},
    {bg:"момче́", tr:"momche", fr:"garçon"},
    {bg:"моми́че", tr:"momiche", fr:"fille"},
    {bg:"прия́тел", tr:"priyatel", fr:"ami"},
    {bg:"прия́телка", tr:"priyatelka", fr:"amie"},
    {bg:"съсе́д", tr:"sased", fr:"voisin"},
    {bg:"съсе́дка", tr:"sasedka", fr:"voisine"},
    {bg:"господи́н", tr:"gospodin", fr:"monsieur"},
    {bg:"госпожа́", tr:"gospozha", fr:"madame"},
    {bg:"госпо́жица", tr:"gospozhitsa", fr:"mademoiselle"},
    {bg:"и́ме", tr:"ime", fr:"nom / prénom"},
    {bg:"фами́лия", tr:"familiya", fr:"nom de famille"},
    {bg:"адре́с", tr:"adres", fr:"adresse"},
    {bg:"телефо́н", tr:"telefon", fr:"téléphone"},
    {bg:"страна́", tr:"strana", fr:"pays"},
    {bg:"държа́ва", tr:"darzhava", fr:"État / pays"},
    {bg:"град", tr:"grad", fr:"ville"},
    {bg:"се́ло", tr:"selo", fr:"village"},
    {bg:"ези́к", tr:"ezik", fr:"langue"},
    {bg:"ду́ма", tr:"duma", fr:"mot"},
    {bg:"въпро́с", tr:"vapros", fr:"question"},
    {bg:"отго́вор", tr:"otgovor", fr:"réponse"},
    {bg:"пробле́м", tr:"problem", fr:"problème"},
    {bg:"не́що", tr:"neshto", fr:"quelque chose"},
    {bg:"ни́що", tr:"nishto", fr:"rien"},
    {bg:"вси́чко", tr:"vsichko", fr:"tout"},
    {bg:"ня́кой", tr:"nyakoy", fr:"quelqu'un"},
    {bg:"ни́кой", tr:"nikoy", fr:"personne (ne… personne)"},
    {bg:"здраве́й", tr:"zdravey", fr:"salut (tu)"},
    {bg:"здраве́йте", tr:"zdraveyte", fr:"bonjour (vous)"},
    {bg:"добъ́р ден", tr:"dobar den", fr:"bonjour"},
    {bg:"добро́ у́тро", tr:"dobro utro", fr:"bonjour (le matin)"},
    {bg:"добъ́р ве́чер", tr:"dobar vecher", fr:"bonsoir"},
    {bg:"ле́ка нощ", tr:"leka nosht", fr:"bonne nuit"},
    {bg:"дови́ждане", tr:"dovizhdane", fr:"au revoir"},
    {bg:"ча́о", tr:"chao", fr:"salut / au revoir"},
    {bg:"благодаря́", tr:"blagodarya", fr:"merci"},
    {bg:"мо́ля", tr:"molya", fr:"s'il vous plaît / de rien"},
    {bg:"извиня́вай", tr:"izvinyavay", fr:"excuse-moi"},
    {bg:"извине́те", tr:"izvinete", fr:"excusez-moi"},
    {bg:"съжаля́вам", tr:"sazhalyavam", fr:"je suis désolé"},
    {bg:"да", tr:"da", fr:"oui"},
    {bg:"не", tr:"ne", fr:"non / ne… pas"},
    {bg:"добре́", tr:"dobre", fr:"bien"},
    {bg:"зле", tr:"zle", fr:"mal"},
    {bg:"мо́же", tr:"mozhe", fr:"c'est possible / on peut"},
    {bg:"разби́ра се", tr:"razbira se", fr:"bien sûr"},
    {bg:"вя́рно", tr:"vyarno", fr:"vrai / correct"},
    {bg:"гре́шно", tr:"greshno", fr:"faux / incorrect"},
    {bg:"как", tr:"kak", fr:"comment"},
    {bg:"какво́", tr:"kakvo", fr:"quoi / que"},
    {bg:"кой", tr:"koy", fr:"qui"},
    {bg:"коя", tr:"koya", fr:"qui (fém.)"},
    {bg:"кое", tr:"koe", fr:"lequel / laquelle (neutre)"},
    {bg:"кои", tr:"koi", fr:"lesquels"},
    {bg:"къде́", tr:"kade", fr:"où"},
    {bg:"откъде́", tr:"otkade", fr:"d'où"},
    {bg:"накъде́", tr:"nakade", fr:"vers où"},
    {bg:"кога́", tr:"koga", fr:"quand"},
    {bg:"защо́", tr:"zashto", fr:"pourquoi"},
    {bg:"ко́лко", tr:"kolko", fr:"combien"},
    {bg:"чий", tr:"chiy", fr:"à qui / de qui"},
    {bg:"чия́", tr:"chiya", fr:"à qui (fém.)"},
    {bg:"то́зи", tr:"tozi", fr:"ce / cet"},
    {bg:"та́зи", tr:"tazi", fr:"cette"},
    {bg:"това́", tr:"tova", fr:"ceci / cela"},
    {bg:"те́зи", tr:"tezi", fr:"ces"},
    {bg:"о́нзи", tr:"onzi", fr:"celui-là"},
    {bg:"она́зи", tr:"onazi", fr:"celle-là"},
    {bg:"оно́ва", tr:"onova", fr:"cela (là-bas)"},
    {bg:"оне́зи", tr:"onezi", fr:"ceux-là"},
    {bg:"мой", tr:"moy", fr:"mon / mien"},
    {bg:"твой", tr:"tvoy", fr:"ton / tien"},
    {bg:"не́гов", tr:"negov", fr:"son / le sien"},
    {bg:"не́ин", tr:"nein", fr:"son / le sien (fém.)"},
    {bg:"наш", tr:"nash", fr:"notre / nôtre"},
    {bg:"ваш", tr:"vash", fr:"votre / vôtre"},
    {bg:"те́хен", tr:"tehen", fr:"leur / le leur"},
    {bg:"се́бе си", tr:"sebe si", fr:"soi-même"},
    {bg:"тук", tr:"tuk", fr:"ici"},
    {bg:"там", tr:"tam", fr:"là-bas"},
    {bg:"сега́", tr:"sega", fr:"maintenant"},
    {bg:"по́сле", tr:"posle", fr:"après / plus tard"},
    {bg:"ве́че", tr:"veche", fr:"déjà"},
    {bg:"о́ще", tr:"oshte", fr:"encore"},
    {bg:"мно́го", tr:"mnogo", fr:"beaucoup / très"},
    {bg:"ма́лко", tr:"malko", fr:"peu / un peu"}
  ]},
  family: {label:"Famille, maison & objets", items:[
    {bg:"семе́йство", tr:"semeystvo", fr:"famille"},
    {bg:"ма́йка", tr:"mayka", fr:"mère"},
    {bg:"ба́ща", tr:"bashta", fr:"père"},
    {bg:"роди́тели", tr:"roditeli", fr:"parents"},
    {bg:"син", tr:"sin", fr:"fils"},
    {bg:"дъщеря́", tr:"dashterya", fr:"fille (de qqn)"},
    {bg:"брат", tr:"brat", fr:"frère"},
    {bg:"сестра́", tr:"sestra", fr:"sœur"},
    {bg:"съпру́г", tr:"saprug", fr:"mari / époux"},
    {bg:"съпру́га", tr:"sapruga", fr:"épouse"},
    {bg:"ба́ба", tr:"baba", fr:"grand-mère"},
    {bg:"дя́до", tr:"dyado", fr:"grand-père"},
    {bg:"внук", tr:"vnuk", fr:"petit-fils"},
    {bg:"вну́чка", tr:"vnuchka", fr:"petite-fille"},
    {bg:"чи́чо", tr:"chicho", fr:"oncle"},
    {bg:"ле́ля", tr:"lelya", fr:"tante"},
    {bg:"братовче́д", tr:"bratovched", fr:"cousin"},
    {bg:"братовче́дка", tr:"bratovchedka", fr:"cousine"},
    {bg:"родни́на", tr:"rodnina", fr:"parent (de la famille)"},
    {bg:"брак", tr:"brak", fr:"mariage"},
    {bg:"сва́тба", tr:"svatba", fr:"noces / cérémonie"},
    {bg:"любо́в", tr:"lyubov", fr:"amour"},
    {bg:"прия́телство", tr:"priyatelstvo", fr:"amitié"},
    {bg:"възра́стен", tr:"vazrasten", fr:"adulte"},
    {bg:"въ́зраст", tr:"vazrast", fr:"âge"},
    {bg:"бе́бе", tr:"bebe", fr:"bébé"},
    {bg:"домаки́н", tr:"domakin", fr:"hôte"},
    {bg:"домаки́ня", tr:"domakinya", fr:"hôtesse"},
    {bg:"гост", tr:"gost", fr:"invité"},
    {bg:"дом", tr:"dom", fr:"foyer / maison"},
    {bg:"къ́ща", tr:"kashta", fr:"maison"},
    {bg:"апартаме́нт", tr:"apartament", fr:"appartement"},
    {bg:"жи́лище", tr:"zhilishte", fr:"logement"},
    {bg:"сгра́да", tr:"sgrada", fr:"bâtiment"},
    {bg:"ета́ж", tr:"etazh", fr:"étage"},
    {bg:"ста́я", tr:"staya", fr:"pièce / chambre"},
    {bg:"спа́лня", tr:"spalnya", fr:"chambre à coucher"},
    {bg:"ку́хня", tr:"kuhnya", fr:"cuisine"},
    {bg:"ба́ня", tr:"banya", fr:"salle de bains"},
    {bg:"тоале́тна", tr:"toaletna", fr:"toilettes"},
    {bg:"хол", tr:"hol", fr:"salon"},
    {bg:"коридо́р", tr:"koridor", fr:"couloir"},
    {bg:"балко́н", tr:"balkon", fr:"balcon"},
    {bg:"гради́на", tr:"gradina", fr:"jardin"},
    {bg:"двор", tr:"dvor", fr:"cour"},
    {bg:"гара́ж", tr:"garazh", fr:"garage"},
    {bg:"врата́", tr:"vrata", fr:"porte"},
    {bg:"прозо́рец", tr:"prozorets", fr:"fenêtre"},
    {bg:"стена́", tr:"stena", fr:"mur"},
    {bg:"под", tr:"pod", fr:"sol"},
    {bg:"тава́н", tr:"tavan", fr:"plafond / grenier"},
    {bg:"по́крив", tr:"pokriv", fr:"toit"},
    {bg:"стъ́лба", tr:"stalba", fr:"escalier"},
    {bg:"асансьо́р", tr:"asansyor", fr:"ascenseur"},
    {bg:"ключ", tr:"klyuch", fr:"clé"},
    {bg:"ма́са", tr:"masa", fr:"table"},
    {bg:"стол", tr:"stol", fr:"chaise"},
    {bg:"дива́н", tr:"divan", fr:"canapé"},
    {bg:"легло́", tr:"leglo", fr:"lit"},
    {bg:"шкаф", tr:"shkaf", fr:"armoire / placard"},
    {bg:"гардеро́б", tr:"garderob", fr:"armoire"},
    {bg:"рафт", tr:"raft", fr:"étagère"},
    {bg:"огледа́ло", tr:"ogledalo", fr:"miroir"},
    {bg:"ла́мпа", tr:"lampa", fr:"lampe"},
    {bg:"светлина́", tr:"svetlina", fr:"lumière"},
    {bg:"телеви́зор", tr:"televizor", fr:"télévision"},
    {bg:"ра́дио", tr:"radio", fr:"radio"},
    {bg:"компю́тър", tr:"kompyutar", fr:"ordinateur"},
    {bg:"часо́вник", tr:"chasovnik", fr:"horloge / montre"},
    {bg:"карти́на", tr:"kartina", fr:"tableau / image"},
    {bg:"сни́мка", tr:"snimka", fr:"photo"},
    {bg:"кни́га", tr:"kniga", fr:"livre"},
    {bg:"тетра́дка", tr:"tetradka", fr:"cahier"},
    {bg:"химика́л", tr:"himikal", fr:"stylo"},
    {bg:"мо́лив", tr:"moliv", fr:"crayon"},
    {bg:"ха́ртия", tr:"hartiya", fr:"papier"},
    {bg:"ча́нта", tr:"chanta", fr:"sac"},
    {bg:"кути́я", tr:"kutiya", fr:"boîte"},
    {bg:"бути́лка", tr:"butilka", fr:"bouteille"},
    {bg:"ча́ша", tr:"chasha", fr:"verre / tasse"},
    {bg:"чи́ния", tr:"chiniya", fr:"assiette"},
    {bg:"лъжи́ца", tr:"lazhitsa", fr:"cuillère"},
    {bg:"ви́лица", tr:"vilitsa", fr:"fourchette"},
    {bg:"нож", tr:"nozh", fr:"couteau"},
    {bg:"те́нджера", tr:"tendzhera", fr:"casserole"},
    {bg:"тига́н", tr:"tigan", fr:"poêle"},
    {bg:"къ́рпа", tr:"karpa", fr:"serviette"},
    {bg:"сапу́н", tr:"sapun", fr:"savon"},
    {bg:"шампоа́н", tr:"shampoan", fr:"shampoing"},
    {bg:"че́тка", tr:"chetka", fr:"brosse"},
    {bg:"кърпи́чка", tr:"karpichka", fr:"mouchoir"}
  ]},
  kitchen: {label:"Nourriture, boissons & restaurant", items:[
    {bg:"храна́", tr:"hrana", fr:"nourriture"},
    {bg:"я́стие", tr:"yastie", fr:"plat"},
    {bg:"заку́ска", tr:"zakuska", fr:"petit-déjeuner"},
    {bg:"обя́д", tr:"obyad", fr:"déjeuner"},
    {bg:"вечеря́", tr:"vecherya", fr:"dîner"},
    {bg:"хляб", tr:"hlyab", fr:"pain"},
    {bg:"ма́сло", tr:"maslo", fr:"beurre"},
    {bg:"си́рене", tr:"sirene", fr:"fromage (blanc)"},
    {bg:"кашкава́л", tr:"kashkaval", fr:"fromage jaune"},
    {bg:"мля́ко", tr:"mlyako", fr:"lait"},
    {bg:"ки́село мля́ко", tr:"kiselo mlyako", fr:"yaourt"},
    {bg:"смета́на", tr:"smetana", fr:"crème"},
    {bg:"яйце́", tr:"yaytse", fr:"œuf"},
    {bg:"месо́", tr:"meso", fr:"viande"},
    {bg:"сви́нско", tr:"svinsko", fr:"porc"},
    {bg:"те́лешко", tr:"teleshko", fr:"bœuf / veau"},
    {bg:"пи́лешко", tr:"pileshko", fr:"poulet"},
    {bg:"а́гнешко", tr:"agneshko", fr:"agneau"},
    {bg:"ри́ба", tr:"riba", fr:"poisson"},
    {bg:"сьо́мга", tr:"syomga", fr:"saumon"},
    {bg:"шу́нка", tr:"shunka", fr:"jambon"},
    {bg:"наде́ница", tr:"nadenitsa", fr:"saucisse"},
    {bg:"су́па", tr:"supa", fr:"soupe"},
    {bg:"сала́та", tr:"salata", fr:"salade"},
    {bg:"ори́з", tr:"oriz", fr:"riz"},
    {bg:"карто́ф", tr:"kartof", fr:"pomme de terre"},
    {bg:"дома́т", tr:"domat", fr:"tomate"},
    {bg:"кра́ставица", tr:"krastavitsa", fr:"concombre"},
    {bg:"лук", tr:"luk", fr:"oignon"},
    {bg:"че́сън", tr:"chesan", fr:"ail"},
    {bg:"мо́рков", tr:"morkov", fr:"carotte"},
    {bg:"зе́ле", tr:"zele", fr:"chou"},
    {bg:"чу́шка", tr:"chushka", fr:"poivron / piment"},
    {bg:"грах", tr:"grah", fr:"pois"},
    {bg:"боб", tr:"bob", fr:"haricot"},
    {bg:"царе́вица", tr:"tsarevitsa", fr:"maïs"},
    {bg:"гъ́ба", tr:"gaba", fr:"champignon"},
    {bg:"плод", tr:"plod", fr:"fruit"},
    {bg:"я́бълка", tr:"yabalka", fr:"pomme"},
    {bg:"кру́ша", tr:"krusha", fr:"poire"},
    {bg:"бана́н", tr:"banan", fr:"banane"},
    {bg:"портока́л", tr:"portokal", fr:"orange"},
    {bg:"мандари́на", tr:"mandarina", fr:"mandarine"},
    {bg:"лимо́н", tr:"limon", fr:"citron"},
    {bg:"гро́зде", tr:"grozde", fr:"raisin"},
    {bg:"я́года", tr:"yagoda", fr:"fraise"},
    {bg:"чере́ша", tr:"cheresha", fr:"cerise"},
    {bg:"пра́скова", tr:"praskova", fr:"pêche"},
    {bg:"кайси́я", tr:"kaysiya", fr:"abricot"},
    {bg:"ди́ня", tr:"dinya", fr:"pastèque"},
    {bg:"пъ́пеш", tr:"papesh", fr:"melon"},
    {bg:"анана́с", tr:"ananas", fr:"ananas"},
    {bg:"я́дка", tr:"yadka", fr:"fruit à coque"},
    {bg:"о́рех", tr:"oreh", fr:"noix"},
    {bg:"фъстъ́к", tr:"fastak", fr:"cacahuète"},
    {bg:"за́хар", tr:"zahar", fr:"sucre"},
    {bg:"сол", tr:"sol", fr:"sel"},
    {bg:"пипе́р", tr:"piper", fr:"poivre"},
    {bg:"подпра́вка", tr:"podpravka", fr:"épice"},
    {bg:"о́цет", tr:"otset", fr:"vinaigre"},
    {bg:"о́лио", tr:"olio", fr:"huile"},
    {bg:"мед", tr:"med", fr:"miel"},
    {bg:"сла́дко", tr:"sladko", fr:"confiture"},
    {bg:"шокола́д", tr:"shokolad", fr:"chocolat"},
    {bg:"бонбо́н", tr:"bonbon", fr:"bonbon"},
    {bg:"то́рта", tr:"torta", fr:"gâteau"},
    {bg:"сладоле́д", tr:"sladoled", fr:"glace"},
    {bg:"бискви́та", tr:"biskvita", fr:"biscuit"},
    {bg:"кафе́", tr:"kafe", fr:"café"},
    {bg:"чай", tr:"chay", fr:"thé"},
    {bg:"вода́", tr:"voda", fr:"eau"},
    {bg:"сок", tr:"sok", fr:"jus"},
    {bg:"лимона́да", tr:"limonada", fr:"limonade"},
    {bg:"напи́тка", tr:"napitka", fr:"boisson"},
    {bg:"би́ра", tr:"bira", fr:"bière"},
    {bg:"ви́но", tr:"vino", fr:"vin"},
    {bg:"черве́но ви́но", tr:"cherveno vino", fr:"vin rouge"},
    {bg:"бя́ло ви́но", tr:"byalo vino", fr:"vin blanc"},
    {bg:"ка́на", tr:"kana", fr:"carafe"},
    {bg:"рестора́нт", tr:"restorant", fr:"restaurant"},
    {bg:"кафене́", tr:"kafene", fr:"café (lieu)"},
    {bg:"меню́", tr:"menyu", fr:"menu"},
    {bg:"сервитьо́р", tr:"servityor", fr:"serveur"},
    {bg:"сервитьо́рка", tr:"servityorka", fr:"serveuse"},
    {bg:"клие́нт", tr:"klient", fr:"client"},
    {bg:"сме́тка", tr:"smetka", fr:"addition"},
    {bg:"цена́", tr:"tsena", fr:"prix"},
    {bg:"по́рция", tr:"portsiya", fr:"portion"},
    {bg:"вкус", tr:"vkus", fr:"goût"},
    {bg:"миризма́", tr:"mirizma", fr:"odeur"},
    {bg:"глад", tr:"glad", fr:"faim"},
    {bg:"жа́жда", tr:"zhazhda", fr:"soif"},
    {bg:"заку́свам", tr:"zakusvam", fr:"prendre le petit-déjeuner"},
    {bg:"обя́двам", tr:"obyadvam", fr:"déjeuner"},
    {bg:"вечеря́м", tr:"vecheryam", fr:"dîner"},
    {bg:"ям", tr:"yam", fr:"manger"},
    {bg:"пи́я", tr:"piya", fr:"boire"},
    {bg:"го́твя", tr:"gotvya", fr:"cuisiner"}
  ]},
  verbs1: {label:"Verbes essentiels (1)", items:[
    {bg:"съм", tr:"sam", fr:"être"},
    {bg:"и́мам", tr:"imam", fr:"avoir"},
    {bg:"ста́вам", tr:"stavam", fr:"devenir / se lever"},
    {bg:"живе́я", tr:"zhiveya", fr:"vivre / habiter"},
    {bg:"рабо́тя", tr:"rabotya", fr:"travailler"},
    {bg:"у́ча", tr:"ucha", fr:"étudier / apprendre"},
    {bg:"препода́вам", tr:"prepodavam", fr:"enseigner"},
    {bg:"говоря́", tr:"govorya", fr:"parler"},
    {bg:"ка́звам", tr:"kazvam", fr:"dire"},
    {bg:"пи́там", tr:"pitam", fr:"demander"},
    {bg:"отгова́рям", tr:"otgovaryam", fr:"répondre"},
    {bg:"слу́шам", tr:"slusham", fr:"écouter"},
    {bg:"чу́вам", tr:"chuvam", fr:"entendre"},
    {bg:"разби́рам", tr:"razbiram", fr:"comprendre"},
    {bg:"знам", tr:"znam", fr:"savoir"},
    {bg:"позна́вам", tr:"poznavam", fr:"connaître"},
    {bg:"по́мня", tr:"pomnya", fr:"se souvenir"},
    {bg:"забра́вям", tr:"zabravyam", fr:"oublier"},
    {bg:"ми́сля", tr:"mislya", fr:"penser"},
    {bg:"вя́рвам", tr:"vyarvam", fr:"croire"},
    {bg:"и́скам", tr:"iskam", fr:"vouloir"},
    {bg:"жела́я", tr:"zhelaya", fr:"désirer"},
    {bg:"мо́га", tr:"moga", fr:"pouvoir"},
    {bg:"тря́бва", tr:"tryabva", fr:"devoir / falloir"},
    {bg:"оби́чам", tr:"obicham", fr:"aimer"},
    {bg:"харе́свам", tr:"haresvam", fr:"aimer / apprécier"},
    {bg:"мра́зя", tr:"mrazya", fr:"détester"},
    {bg:"предпочи́там", tr:"predpochitam", fr:"préférer"},
    {bg:"тъ́рся", tr:"tarsya", fr:"chercher"},
    {bg:"нами́рам", tr:"namiram", fr:"trouver"},
    {bg:"ви́ждам", tr:"vizhdam", fr:"voir"},
    {bg:"гле́дам", tr:"gledam", fr:"regarder"},
    {bg:"пока́звам", tr:"pokazvam", fr:"montrer"},
    {bg:"чета́", tr:"cheta", fr:"lire"},
    {bg:"пи́ша", tr:"pisha", fr:"écrire"},
    {bg:"рису́вам", tr:"risuvam", fr:"dessiner"},
    {bg:"изпо́лзвам", tr:"izpolzvam", fr:"utiliser"},
    {bg:"пра́вя", tr:"pravya", fr:"faire"},
    {bg:"да́вам", tr:"davam", fr:"donner"},
    {bg:"взе́мам", tr:"vzemam", fr:"prendre"},
    {bg:"но́ся", tr:"nosya", fr:"porter / apporter"},
    {bg:"сла́гам", tr:"slagam", fr:"mettre"},
    {bg:"ма́хам", tr:"maham", fr:"enlever"},
    {bg:"отва́рям", tr:"otvaryam", fr:"ouvrir"},
    {bg:"затва́рям", tr:"zatvaryam", fr:"fermer"},
    {bg:"вклю́чвам", tr:"vklyuchvam", fr:"allumer / brancher"},
    {bg:"изклю́чвам", tr:"izklyuchvam", fr:"éteindre / débrancher"},
    {bg:"запо́чвам", tr:"zapochvam", fr:"commencer"},
    {bg:"свъ́ршвам", tr:"svarshvam", fr:"finir"},
    {bg:"продължа́вам", tr:"prodalzhavam", fr:"continuer"},
    {bg:"спи́рам", tr:"spiram", fr:"arrêter"},
    {bg:"ча́кам", tr:"chakam", fr:"attendre"},
    {bg:"пома́гам", tr:"pomagam", fr:"aider"},
    {bg:"опи́твам", tr:"opitvam", fr:"essayer / goûter"},
    {bg:"успя́вам", tr:"uspyavam", fr:"réussir"},
    {bg:"реша́вам", tr:"reshavam", fr:"décider / résoudre"},
    {bg:"избирам", tr:"izbiram", fr:"choisir"},
    {bg:"купу́вам", tr:"kupuvam", fr:"acheter"},
    {bg:"прода́вам", tr:"prodavam", fr:"vendre"},
    {bg:"пла́щам", tr:"plashtam", fr:"payer"},
    {bg:"стру́вам", tr:"struvam", fr:"coûter"},
    {bg:"получа́вам", tr:"poluchavam", fr:"recevoir"},
    {bg:"изпра́щам", tr:"izprashtam", fr:"envoyer"},
    {bg:"връ́щам", tr:"vrashtam", fr:"rendre / retourner"},
    {bg:"сме́ням", tr:"smenyam", fr:"changer"},
    {bg:"оста́вям", tr:"ostavyam", fr:"laisser"},
    {bg:"сре́щам", tr:"sreshtam", fr:"rencontrer"},
    {bg:"ка́ня", tr:"kanya", fr:"inviter"},
    {bg:"посеща́вам", tr:"poseshtavam", fr:"visiter"},
    {bg:"пъту́вам", tr:"patuvam", fr:"voyager"},
    {bg:"оти́вам", tr:"otivam", fr:"aller"},
    {bg:"и́двам", tr:"idvam", fr:"venir"},
    {bg:"тръ́гвам", tr:"tragvam", fr:"partir"},
    {bg:"присти́гам", tr:"pristigam", fr:"arriver"},
    {bg:"връ́щам се", tr:"vrashtam se", fr:"revenir"},
    {bg:"вли́зам", tr:"vlizam", fr:"entrer"},
    {bg:"изли́зам", tr:"izlizam", fr:"sortir"},
    {bg:"ка́чвам се", tr:"kachvam se", fr:"monter"},
    {bg:"сли́зам", tr:"slizam", fr:"descendre"},
    {bg:"хо́дя", tr:"hodya", fr:"aller (habituellement) / marcher"},
    {bg:"вървя́", tr:"varvya", fr:"marcher"},
    {bg:"ти́чам", tr:"ticham", fr:"courir"},
    {bg:"ка́рам", tr:"karam", fr:"conduire"},
    {bg:"летя́", tr:"letya", fr:"voler"},
    {bg:"плу́вам", tr:"pluvam", fr:"nager"},
    {bg:"стоя́", tr:"stoya", fr:"rester debout"},
    {bg:"ся́дам", tr:"syadam", fr:"s'asseoir"},
    {bg:"лежа́", tr:"lezha", fr:"être allongé"},
    {bg:"спя", tr:"spya", fr:"dormir"},
    {bg:"събу́ждам се", tr:"sabuzhdam se", fr:"se réveiller"},
    {bg:"ми́я", tr:"miya", fr:"laver"},
    {bg:"къ́пя се", tr:"kapya se", fr:"se doucher / se baigner"},
    {bg:"обли́чам", tr:"oblicham", fr:"habiller"},
    {bg:"събли́чам", tr:"sablicham", fr:"déshabiller"},
    {bg:"бръ́сна се", tr:"brasna se", fr:"se raser"},
    {bg:"усми́хвам се", tr:"usmihvam se", fr:"sourire"}
  ]},
  verbs2: {label:"Verbes essentiels (2)", items:[
    {bg:"сме́я се", tr:"smeya se", fr:"rire"},
    {bg:"пла́ча", tr:"placha", fr:"pleurer"},
    {bg:"чу́вствам", tr:"chuvstvam", fr:"sentir / ressentir"},
    {bg:"чу́вствам се", tr:"chuvstvam se", fr:"se sentir"},
    {bg:"страху́вам се", tr:"strahuvam se", fr:"avoir peur"},
    {bg:"надя́вам се", tr:"nadyavam se", fr:"espérer"},
    {bg:"съглася́вам се", tr:"saglasyavam se", fr:"être d'accord"},
    {bg:"отка́звам", tr:"otkazvam", fr:"refuser"},
    {bg:"обеща́вам", tr:"obeshtavam", fr:"promettre"},
    {bg:"лъжа́", tr:"lazha", fr:"mentir"},
    {bg:"обясня́вам", tr:"obyasnyavam", fr:"expliquer"},
    {bg:"повта́рям", tr:"povtaryam", fr:"répéter"},
    {bg:"преве́ждам", tr:"prevezhdam", fr:"traduire"},
    {bg:"произна́сям", tr:"proiznasyam", fr:"prononcer"},
    {bg:"у́ча се", tr:"ucha se", fr:"apprendre"},
    {bg:"упражня́вам", tr:"uprazhnyavam", fr:"pratiquer / s'exercer"},
    {bg:"забеля́звам", tr:"zabelyazvam", fr:"remarquer"},
    {bg:"забраня́вам", tr:"zabranyavam", fr:"interdire"},
    {bg:"позволя́вам", tr:"pozvolyavam", fr:"permettre"},
    {bg:"па́зя", tr:"pazya", fr:"garder / protéger"},
    {bg:"гу́бя", tr:"gubya", fr:"perdre"},
    {bg:"печеля́", tr:"pechelya", fr:"gagner"},
    {bg:"игра́я", tr:"igraya", fr:"jouer"},
    {bg:"танцу́вам", tr:"tantsuvam", fr:"danser"},
    {bg:"пе́я", tr:"peya", fr:"chanter"},
    {bg:"сви́ря", tr:"svirya", fr:"jouer d'un instrument"},
    {bg:"сни́мам", tr:"snimam", fr:"photographier / filmer"},
    {bg:"чи́стя", tr:"chistya", fr:"nettoyer"},
    {bg:"пера́", tr:"pera", fr:"laver le linge"},
    {bg:"суша́", tr:"susha", fr:"sécher"},
    {bg:"гла́дя", tr:"gladya", fr:"repasser"},
    {bg:"подре́ждам", tr:"podrezhdam", fr:"ranger"},
    {bg:"попра́вям", tr:"popravyam", fr:"réparer / corriger"},
    {bg:"строя́", tr:"stroya", fr:"construire"},
    {bg:"ре́жа", tr:"rezha", fr:"couper"},
    {bg:"чу́пя", tr:"chupya", fr:"casser"},
    {bg:"пека́", tr:"peka", fr:"cuire au four"},
    {bg:"варя́", tr:"varya", fr:"faire bouillir"},
    {bg:"пъ́ржа", tr:"parzha", fr:"frire"},
    {bg:"доба́вям", tr:"dobavyam", fr:"ajouter"},
    {bg:"сме́свам", tr:"smesvam", fr:"mélanger"},
    {bg:"серви́рам", tr:"serviram", fr:"servir"},
    {bg:"поръ́чвам", tr:"porachvam", fr:"commander"},
    {bg:"резерви́рам", tr:"rezerviram", fr:"réserver"},
    {bg:"закъсня́вам", tr:"zakasnyavam", fr:"être en retard"},
    {bg:"бъ́рзам", tr:"barzam", fr:"être pressé"},
    {bg:"почи́вам си", tr:"pochivam si", fr:"se reposer"},
    {bg:"завъ́ршвам", tr:"zavarshvam", fr:"terminer"},
    {bg:"сре́щам се", tr:"sreshtam se", fr:"se rencontrer"},
    {bg:"оба́ждам се", tr:"obazhdam se", fr:"téléphoner"},
    {bg:"звъня́", tr:"zvanya", fr:"sonner / appeler"},
    {bg:"проверя́вам", tr:"proveryavam", fr:"vérifier"},
    {bg:"държа́", tr:"darzha", fr:"tenir"},
    {bg:"хва́щам", tr:"hvashtam", fr:"attraper"},
    {bg:"пу́скам", tr:"puskam", fr:"lâcher / laisser aller"},
    {bg:"хвъ́рлям", tr:"hvarlyam", fr:"jeter"},
    {bg:"броя́", tr:"broya", fr:"compter"},
    {bg:"изме́рвам", tr:"izmervam", fr:"mesurer"},
    {bg:"заклю́чвам", tr:"zaklyuchvam", fr:"verrouiller"},
    {bg:"отклю́чвам", tr:"otklyuchvam", fr:"déverrouiller"},
    {bg:"заре́ждам", tr:"zarezhdam", fr:"charger"},
    {bg:"рабо́ти", tr:"raboti", fr:"ça fonctionne"},
    {bg:"мири́ша", tr:"mirisha", fr:"sentir (une odeur)"},
    {bg:"вку́свам", tr:"vkusvam", fr:"goûter"},
    {bg:"доко́свам", tr:"dokosvam", fr:"toucher"},
    {bg:"усе́щам", tr:"useshtam", fr:"ressentir"},
    {bg:"изгле́ждам", tr:"izglezhdam", fr:"avoir l'air"}
  ]},
  adj: {label:"Adjectifs & qualités", items:[
    {bg:"добъ́р", tr:"dobar", fr:"bon / gentil"},
    {bg:"лош", tr:"losh", fr:"mauvais"},
    {bg:"голя́м", tr:"golyam", fr:"grand"},
    {bg:"ма́лък", tr:"malak", fr:"petit"},
    {bg:"дъ́лъг", tr:"dalag", fr:"long"},
    {bg:"къс", tr:"kas", fr:"court"},
    {bg:"висо́к", tr:"visok", fr:"haut / grand"},
    {bg:"ни́сък", tr:"nisak", fr:"bas / petit"},
    {bg:"широ́к", tr:"shirok", fr:"large"},
    {bg:"те́сен", tr:"tesen", fr:"étroit"},
    {bg:"дебе́л", tr:"debel", fr:"gros / épais"},
    {bg:"слаб", tr:"slab", fr:"mince / faible"},
    {bg:"те́жък", tr:"tezhak", fr:"lourd / difficile"},
    {bg:"лек", tr:"lek", fr:"léger / facile"},
    {bg:"бърз", tr:"barz", fr:"rapide"},
    {bg:"ба́вен", tr:"baven", fr:"lent"},
    {bg:"ле́сен", tr:"lesen", fr:"facile"},
    {bg:"тру́ден", tr:"truden", fr:"difficile"},
    {bg:"нов", tr:"nov", fr:"nouveau"},
    {bg:"стар", tr:"star", fr:"vieux / ancien"},
    {bg:"млад", tr:"mlad", fr:"jeune"},
    {bg:"краси́в", tr:"krasiv", fr:"beau"},
    {bg:"гро́зен", tr:"grozen", fr:"laid"},
    {bg:"ху́бав", tr:"hubav", fr:"joli / bon"},
    {bg:"чист", tr:"chist", fr:"propre"},
    {bg:"мръ́сен", tr:"mrasen", fr:"sale"},
    {bg:"то́пъл", tr:"topal", fr:"chaud"},
    {bg:"студе́н", tr:"studen", fr:"froid"},
    {bg:"горе́щ", tr:"goresht", fr:"très chaud"},
    {bg:"хла́ден", tr:"hladen", fr:"frais"},
    {bg:"сла́дък", tr:"sladak", fr:"sucré / doux"},
    {bg:"соле́н", tr:"solen", fr:"salé"},
    {bg:"ки́сел", tr:"kisel", fr:"acide / aigre"},
    {bg:"горчи́в", tr:"gorchiv", fr:"amer"},
    {bg:"вку́сен", tr:"vkusen", fr:"délicieux"},
    {bg:"пре́сен", tr:"presen", fr:"frais (produit)"},
    {bg:"сух", tr:"suh", fr:"sec"},
    {bg:"мо́кър", tr:"mokar", fr:"mouillé"},
    {bg:"пъ́лен", tr:"palen", fr:"plein"},
    {bg:"пра́зен", tr:"prazen", fr:"vide"},
    {bg:"отво́рен", tr:"otvoren", fr:"ouvert"},
    {bg:"затво́рен", tr:"zatvoren", fr:"fermé"},
    {bg:"свобо́ден", tr:"svoboden", fr:"libre"},
    {bg:"зае́т", tr:"zaet", fr:"occupé"},
    {bg:"гото́в", tr:"gotov", fr:"prêt"},
    {bg:"ва́жен", tr:"vazhen", fr:"important"},
    {bg:"интере́сен", tr:"interesen", fr:"intéressant"},
    {bg:"ску́чен", tr:"skuchen", fr:"ennuyeux"},
    {bg:"разли́чен", tr:"razlichen", fr:"différent"},
    {bg:"съ́щият", tr:"sashtiyat", fr:"le même"},
    {bg:"възмо́жен", tr:"vazmozhen", fr:"possible"},
    {bg:"невъзмо́жен", tr:"nevazmozhen", fr:"impossible"},
    {bg:"необходи́м", tr:"neobhodim", fr:"nécessaire"},
    {bg:"си́гурен", tr:"siguren", fr:"sûr / certain"},
    {bg:"опа́сен", tr:"opasen", fr:"dangereux"},
    {bg:"безопа́сен", tr:"bezopasen", fr:"sans danger"},
    {bg:"пра́вилен", tr:"pravilen", fr:"correct"},
    {bg:"гре́шен", tr:"greshen", fr:"faux / incorrect"},
    {bg:"и́стинен", tr:"istinen", fr:"vrai"},
    {bg:"лъжли́в", tr:"lazhliv", fr:"faux / mensonger"},
    {bg:"здрав", tr:"zdrav", fr:"en bonne santé"},
    {bg:"бо́лен", tr:"bolen", fr:"malade"},
    {bg:"щастли́в", tr:"shtastliv", fr:"heureux"},
    {bg:"тъ́жен", tr:"tazhen", fr:"triste"},
    {bg:"ве́сел", tr:"vesel", fr:"joyeux"},
    {bg:"ядо́сан", tr:"yadosan", fr:"fâché"},
    {bg:"уморе́н", tr:"umoren", fr:"fatigué"},
    {bg:"гла́ден", tr:"gladen", fr:"affamé"},
    {bg:"жа́ден", tr:"zhaden", fr:"assoiffé"},
    {bg:"упла́шен", tr:"uplashen", fr:"effrayé"},
    {bg:"споко́ен", tr:"spokoen", fr:"calme"},
    {bg:"не́рвен", tr:"nerven", fr:"nerveux"},
    {bg:"бога́т", tr:"bogat", fr:"riche"},
    {bg:"бе́ден", tr:"beden", fr:"pauvre"},
    {bg:"скъп", tr:"skap", fr:"cher"},
    {bg:"е́втин", tr:"evtin", fr:"bon marché"},
    {bg:"прекра́сен", tr:"prekrasen", fr:"magnifique"},
    {bg:"ужа́сен", tr:"uzhasen", fr:"horrible"},
    {bg:"норма́лен", tr:"normalen", fr:"normal"},
    {bg:"стра́нен", tr:"stranen", fr:"étrange"},
    {bg:"изве́стен", tr:"izvesten", fr:"célèbre / connu"},
    {bg:"популя́рен", tr:"populyaren", fr:"populaire"},
    {bg:"специа́лен", tr:"spetsialen", fr:"spécial"},
    {bg:"обикнове́н", tr:"obiknoven", fr:"ordinaire"},
    {bg:"подо́бен", tr:"podoben", fr:"similaire"},
    {bg:"пъ́рви", tr:"parvi", fr:"premier"},
    {bg:"после́ден", tr:"posleden", fr:"dernier"},
    {bg:"сле́дващ", tr:"sledvasht", fr:"suivant"},
    {bg:"преди́шен", tr:"predishen", fr:"précédent"},
    {bg:"еди́нствен", tr:"edinstven", fr:"unique / seul"},
    {bg:"цял", tr:"tsyal", fr:"entier"},
    {bg:"полови́н", tr:"polovin", fr:"demi / moitié"},
    {bg:"друг", tr:"drug", fr:"autre"}
  ]},
  numtime: {label:"Nombres, jours & temps", items:[
    {bg:"ну́ла", tr:"nula", fr:"zéro"},
    {bg:"едно́", tr:"edno", fr:"un"},
    {bg:"две", tr:"dve", fr:"deux"},
    {bg:"три", tr:"tri", fr:"trois"},
    {bg:"че́тири", tr:"chetiri", fr:"quatre"},
    {bg:"пет", tr:"pet", fr:"cinq"},
    {bg:"шест", tr:"shest", fr:"six"},
    {bg:"се́дем", tr:"sedem", fr:"sept"},
    {bg:"о́сем", tr:"osem", fr:"huit"},
    {bg:"де́вет", tr:"devet", fr:"neuf"},
    {bg:"де́сет", tr:"deset", fr:"dix"},
    {bg:"единаде́сет", tr:"edinadeset", fr:"onze"},
    {bg:"дванаде́сет", tr:"dvanadeset", fr:"douze"},
    {bg:"тринаде́сет", tr:"trinadeset", fr:"treize"},
    {bg:"четиринаде́сет", tr:"chetirinadeset", fr:"quatorze"},
    {bg:"петнаде́сет", tr:"petnadeset", fr:"quinze"},
    {bg:"шестнаде́сет", tr:"shestnadeset", fr:"seize"},
    {bg:"седемнаде́сет", tr:"sedemnadeset", fr:"dix-sept"},
    {bg:"осемнаде́сет", tr:"osemnadeset", fr:"dix-huit"},
    {bg:"деветнаде́сет", tr:"devetnadeset", fr:"dix-neuf"},
    {bg:"два́десет", tr:"dvadeset", fr:"vingt"},
    {bg:"три́десет", tr:"trideset", fr:"trente"},
    {bg:"четири́десет", tr:"chetirideset", fr:"quarante"},
    {bg:"петдесе́т", tr:"petdeset", fr:"cinquante"},
    {bg:"шестдесе́т", tr:"shestdeset", fr:"soixante"},
    {bg:"седемдесе́т", tr:"sedemdeset", fr:"soixante-dix"},
    {bg:"осемдесе́т", tr:"osemdeset", fr:"quatre-vingts"},
    {bg:"деветдесе́т", tr:"devetdeset", fr:"quatre-vingt-dix"},
    {bg:"сто", tr:"sto", fr:"cent"},
    {bg:"хиля́да", tr:"hilyada", fr:"mille"},
    {bg:"милио́н", tr:"milion", fr:"million"},
    {bg:"понеде́лник", tr:"ponedelnik", fr:"lundi"},
    {bg:"вто́рник", tr:"vtornik", fr:"mardi"},
    {bg:"сря́да", tr:"sryada", fr:"mercredi"},
    {bg:"четвъ́ртък", tr:"chetvartak", fr:"jeudi"},
    {bg:"пе́тък", tr:"petak", fr:"vendredi"},
    {bg:"съ́бота", tr:"sabota", fr:"samedi"},
    {bg:"неде́ля", tr:"nedelya", fr:"dimanche"},
    {bg:"ден", tr:"den", fr:"jour"},
    {bg:"се́дмица", tr:"sedmitsa", fr:"semaine"},
    {bg:"ме́сец", tr:"mesets", fr:"mois"},
    {bg:"годи́на", tr:"godina", fr:"année"},
    {bg:"час", tr:"chas", fr:"heure"},
    {bg:"мину́та", tr:"minuta", fr:"minute"},
    {bg:"секу́нда", tr:"sekunda", fr:"seconde"},
    {bg:"су́трин", tr:"sutrin", fr:"matin"},
    {bg:"о́бед", tr:"obed", fr:"midi"},
    {bg:"следо́бед", tr:"sledobed", fr:"après-midi"},
    {bg:"ве́чер", tr:"vecher", fr:"soir"},
    {bg:"нощ", tr:"nosht", fr:"nuit"},
    {bg:"поня́кога", tr:"ponyakoga", fr:"parfois"},
    {bg:"ви́наги", tr:"vinagi", fr:"toujours"},
    {bg:"ни́кога", tr:"nikoga", fr:"jamais"},
    {bg:"че́сто", tr:"chesto", fr:"souvent"},
    {bg:"ря́дко", tr:"ryadko", fr:"rarement"},
    {bg:"обикнове́но", tr:"obiknoveno", fr:"habituellement"},
    {bg:"днес", tr:"dnes", fr:"aujourd'hui"},
    {bg:"у́тре", tr:"utre", fr:"demain"},
    {bg:"вдруги́ден", tr:"vdrugiden", fr:"après-demain"},
    {bg:"вче́ра", tr:"vchera", fr:"hier"},
    {bg:"завче́ра", tr:"zavchera", fr:"avant-hier"},
    {bg:"ско́ро", tr:"skoro", fr:"bientôt"},
    {bg:"къ́сно", tr:"kasno", fr:"tard"},
    {bg:"ра́но", tr:"rano", fr:"tôt"},
    {bg:"ведна́га", tr:"vednaga", fr:"immédiatement"},
    {bg:"преди́", tr:"predi", fr:"avant"},
    {bg:"отда́вна", tr:"otdavna", fr:"depuis longtemps"},
    {bg:"януа́ри", tr:"yanuari", fr:"janvier"},
    {bg:"февруа́ри", tr:"fevruari", fr:"février"},
    {bg:"март", tr:"mart", fr:"mars"},
    {bg:"апри́л", tr:"april", fr:"avril"},
    {bg:"май", tr:"may", fr:"mai"},
    {bg:"ю́ни", tr:"yuni", fr:"juin"},
    {bg:"ю́ли", tr:"yuli", fr:"juillet"},
    {bg:"а́вгуст", tr:"avgust", fr:"août"},
    {bg:"септе́мври", tr:"septemvri", fr:"septembre"},
    {bg:"окто́мври", tr:"oktomvri", fr:"octobre"},
    {bg:"ное́мври", tr:"noemvri", fr:"novembre"},
    {bg:"деке́мври", tr:"dekemvri", fr:"décembre"},
    {bg:"про́лет", tr:"prolet", fr:"printemps"},
    {bg:"ля́то", tr:"lyato", fr:"été"},
    {bg:"е́сен", tr:"esen", fr:"automne"},
    {bg:"зи́ма", tr:"zima", fr:"hiver"},
    {bg:"да́та", tr:"data", fr:"date"},
    {bg:"рожде́н ден", tr:"rozhden den", fr:"anniversaire"},
    {bg:"пра́зник", tr:"praznik", fr:"fête / jour férié"},
    {bg:"вака́нция", tr:"vakantsiya", fr:"vacances"},
    {bg:"почи́вка", tr:"pochivka", fr:"repos / pause"},
    {bg:"нача́ло", tr:"nachalo", fr:"début"},
    {bg:"край", tr:"kray", fr:"fin"},
    {bg:"ми́нало", tr:"minalo", fr:"passé"},
    {bg:"настоя́ще", tr:"nastoyashte", fr:"présent"},
    {bg:"бъ́деще", tr:"badeshte", fr:"futur"},
    {bg:"моме́нт", tr:"moment", fr:"moment"},
    {bg:"вре́ме", tr:"vreme", fr:"temps"}
  ]},
  city: {label:"Ville, transports & travail", items:[
    {bg:"у́лица", tr:"ulitsa", fr:"rue"},
    {bg:"път", tr:"pat", fr:"route / chemin"},
    {bg:"площа́д", tr:"ploshtad", fr:"place"},
    {bg:"це́нтър", tr:"tsentar", fr:"centre"},
    {bg:"кварта́л", tr:"kvartal", fr:"quartier"},
    {bg:"парк", tr:"park", fr:"parc"},
    {bg:"магази́н", tr:"magazin", fr:"magasin"},
    {bg:"суперма́ркет", tr:"supermarket", fr:"supermarché"},
    {bg:"паза́р", tr:"pazar", fr:"marché"},
    {bg:"апте́ка", tr:"apteka", fr:"pharmacie"},
    {bg:"бо́лница", tr:"bolnitsa", fr:"hôpital"},
    {bg:"ба́нка", tr:"banka", fr:"banque"},
    {bg:"по́ща", tr:"poshta", fr:"poste"},
    {bg:"поли́ция", tr:"politsiya", fr:"police"},
    {bg:"учи́лище", tr:"uchilishte", fr:"école"},
    {bg:"университе́т", tr:"universitet", fr:"université"},
    {bg:"библиоте́ка", tr:"biblioteka", fr:"bibliothèque"},
    {bg:"музе́й", tr:"muzey", fr:"musée"},
    {bg:"ки́но", tr:"kino", fr:"cinéma"},
    {bg:"теа́тър", tr:"teatar", fr:"théâtre"},
    {bg:"цъ́рква", tr:"tsarkva", fr:"église"},
    {bg:"хоте́л", tr:"hotel", fr:"hôtel"},
    {bg:"га́ра", tr:"gara", fr:"gare"},
    {bg:"лети́ще", tr:"letishte", fr:"aéroport"},
    {bg:"спи́рка", tr:"spirka", fr:"arrêt"},
    {bg:"ста́нция", tr:"stantsiya", fr:"station"},
    {bg:"бар", tr:"bar", fr:"bar"},
    {bg:"биле́т", tr:"bilet", fr:"billet"},
    {bg:"ка́рта", tr:"karta", fr:"carte"},
    {bg:"пари́", tr:"pari", fr:"argent"},
    {bg:"портфе́йл", tr:"portfeyl", fr:"portefeuille"},
    {bg:"паспо́рт", tr:"pasport", fr:"passeport"},
    {bg:"докуме́нт", tr:"dokument", fr:"document"},
    {bg:"ку́фар", tr:"kufar", fr:"valise"},
    {bg:"бага́ж", tr:"bagazh", fr:"bagages"},
    {bg:"кола́", tr:"kola", fr:"voiture"},
    {bg:"автомоби́л", tr:"avtomobil", fr:"automobile"},
    {bg:"автобу́с", tr:"avtobus", fr:"bus"},
    {bg:"влак", tr:"vlak", fr:"train"},
    {bg:"метро́", tr:"metro", fr:"métro"},
    {bg:"трамва́й", tr:"tramvay", fr:"tramway"},
    {bg:"троле́йбус", tr:"troleybus", fr:"trolleybus"},
    {bg:"такси́", tr:"taksi", fr:"taxi"},
    {bg:"велосипе́д", tr:"velosiped", fr:"vélo"},
    {bg:"мото́р", tr:"motor", fr:"moto"},
    {bg:"самоле́т", tr:"samolet", fr:"avion"},
    {bg:"ко́раб", tr:"korab", fr:"navire"},
    {bg:"ло́дка", tr:"lodka", fr:"bateau"},
    {bg:"шофьо́р", tr:"shofyor", fr:"conducteur / chauffeur"},
    {bg:"пъ́тник", tr:"patnik", fr:"passager"},
    {bg:"посо́ка", tr:"posoka", fr:"direction"},
    {bg:"ля́во", tr:"lyavo", fr:"gauche"},
    {bg:"дя́сно", tr:"dyasno", fr:"droite"},
    {bg:"напра́во", tr:"napravo", fr:"tout droit"},
    {bg:"бли́зо", tr:"blizo", fr:"près"},
    {bg:"дале́ч", tr:"dalech", fr:"loin"},
    {bg:"рабо́та", tr:"rabota", fr:"travail"},
    {bg:"профе́сия", tr:"profesiya", fr:"profession"},
    {bg:"слу́жба", tr:"sluzhba", fr:"emploi / service"},
    {bg:"о́фис", tr:"ofis", fr:"bureau"},
    {bg:"фи́рма", tr:"firma", fr:"entreprise"},
    {bg:"компа́ния", tr:"kompaniya", fr:"société"},
    {bg:"шеф", tr:"shef", fr:"patron"},
    {bg:"коле́га", tr:"kolega", fr:"collègue"},
    {bg:"нача́лник", tr:"nachalnik", fr:"chef / supérieur"},
    {bg:"служи́тел", tr:"sluzhitel", fr:"employé"},
    {bg:"рабо́тник", tr:"rabotnik", fr:"ouvrier"},
    {bg:"ле́кар", tr:"lekar", fr:"médecin"},
    {bg:"учи́тел", tr:"uchitel", fr:"enseignant"},
    {bg:"студе́нт", tr:"student", fr:"étudiant"},
    {bg:"учени́к", tr:"uchenik", fr:"élève"},
    {bg:"инжене́р", tr:"inzhener", fr:"ingénieur"},
    {bg:"адвока́т", tr:"advokat", fr:"avocat"},
    {bg:"продава́ч", tr:"prodavach", fr:"vendeur"},
    {bg:"готва́ч", tr:"gotvach", fr:"cuisinier"},
    {bg:"профе́сор", tr:"profesor", fr:"professeur"},
    {bg:"дире́ктор", tr:"direktor", fr:"directeur"},
    {bg:"сре́ща", tr:"sreshta", fr:"rendez-vous / réunion"},
    {bg:"запла́та", tr:"zaplata", fr:"salaire"},
    {bg:"до́говор", tr:"dogovor", fr:"contrat"},
    {bg:"зада́ча", tr:"zadacha", fr:"tâche / exercice"},
    {bg:"уро́к", tr:"urok", fr:"leçon"},
    {bg:"клас", tr:"klas", fr:"classe"},
    {bg:"курс", tr:"kurs", fr:"cours"},
    {bg:"и́зпит", tr:"izpit", fr:"examen"},
    {bg:"оце́нка", tr:"otsenka", fr:"note / évaluation"},
    {bg:"гре́шка", tr:"greshka", fr:"erreur"}
  ]},
  body: {label:"Corps, santé & vêtements", items:[
    {bg:"тя́ло", tr:"tyalo", fr:"corps"},
    {bg:"глава́", tr:"glava", fr:"tête"},
    {bg:"лице́", tr:"litse", fr:"visage"},
    {bg:"коса́", tr:"kosa", fr:"cheveux"},
    {bg:"око́", tr:"oko", fr:"œil"},
    {bg:"ухо́", tr:"uho", fr:"oreille"},
    {bg:"нос", tr:"nos", fr:"nez"},
    {bg:"уста́", tr:"usta", fr:"bouche"},
    {bg:"зъб", tr:"zab", fr:"dent"},
    {bg:"врат", tr:"vrat", fr:"cou"},
    {bg:"ра́мо", tr:"ramo", fr:"épaule"},
    {bg:"ръка́", tr:"raka", fr:"main / bras"},
    {bg:"пръст", tr:"prast", fr:"doigt"},
    {bg:"крак", tr:"krak", fr:"jambe / pied"},
    {bg:"коля́но", tr:"kolyano", fr:"genou"},
    {bg:"стъпа́ло", tr:"stapalo", fr:"pied"},
    {bg:"гръб", tr:"grab", fr:"dos"},
    {bg:"коре́м", tr:"korem", fr:"ventre"},
    {bg:"сърце́", tr:"sartse", fr:"cœur"},
    {bg:"кръв", tr:"krav", fr:"sang"},
    {bg:"ко́жа", tr:"kozha", fr:"peau"},
    {bg:"бо́лка", tr:"bolka", fr:"douleur"},
    {bg:"здра́ве", tr:"zdrave", fr:"santé"},
    {bg:"лека́рство", tr:"lekarstvo", fr:"médicament"},
    {bg:"медици́нска сестра́", tr:"meditsinska sestra", fr:"infirmière"},
    {bg:"температу́ра", tr:"temperatura", fr:"température / fièvre"},
    {bg:"ка́шлица", tr:"kashlitsa", fr:"toux"},
    {bg:"насти́нка", tr:"nastinka", fr:"rhume"},
    {bg:"грип", tr:"grip", fr:"grippe"},
    {bg:"бо́лест", tr:"bolest", fr:"maladie"},
    {bg:"ра́на", tr:"rana", fr:"blessure"},
    {bg:"по́мощ", tr:"pomosht", fr:"aide"},
    {bg:"спе́шност", tr:"speshnost", fr:"urgence"},
    {bg:"дре́ха", tr:"dreha", fr:"vêtement"},
    {bg:"ри́за", tr:"riza", fr:"chemise"},
    {bg:"тени́ска", tr:"teniska", fr:"T-shirt"},
    {bg:"пантало́н", tr:"pantalon", fr:"pantalon"},
    {bg:"дъ́нки", tr:"danki", fr:"jean"},
    {bg:"пола́", tr:"pola", fr:"jupe"},
    {bg:"ро́кля", tr:"roklya", fr:"robe"},
    {bg:"яке́", tr:"yake", fr:"veste"},
    {bg:"палто́", tr:"palto", fr:"manteau"},
    {bg:"пуло́вер", tr:"pulover", fr:"pull"},
    {bg:"обу́вка", tr:"obuvka", fr:"chaussure"},
    {bg:"чора́п", tr:"chorap", fr:"chaussette"},
    {bg:"ша́пка", tr:"shapka", fr:"chapeau / bonnet"}
  ]},
  nature: {label:"Nature, animaux & mots de liaison", items:[
    {bg:"слъ́нце", tr:"slantse", fr:"soleil"},
    {bg:"луна́", tr:"luna", fr:"lune"},
    {bg:"звезда́", tr:"zvezda", fr:"étoile"},
    {bg:"небе́", tr:"nebe", fr:"ciel"},
    {bg:"о́блак", tr:"oblak", fr:"nuage"},
    {bg:"дъжд", tr:"dazhd", fr:"pluie"},
    {bg:"сняг", tr:"snyag", fr:"neige"},
    {bg:"вя́тър", tr:"vyatar", fr:"vent"},
    {bg:"бу́ря", tr:"burya", fr:"tempête"},
    {bg:"мъгла́", tr:"magla", fr:"brouillard"},
    {bg:"река́", tr:"reka", fr:"rivière"},
    {bg:"море́", tr:"more", fr:"mer"},
    {bg:"е́зеро", tr:"ezero", fr:"lac"},
    {bg:"планина́", tr:"planina", fr:"montagne"},
    {bg:"гора́", tr:"gora", fr:"forêt"},
    {bg:"дърво́", tr:"darvo", fr:"arbre"},
    {bg:"цве́те", tr:"tsvete", fr:"fleur"},
    {bg:"трева́", tr:"treva", fr:"herbe"},
    {bg:"земя́", tr:"zemya", fr:"terre"},
    {bg:"ка́мък", tr:"kamak", fr:"pierre"},
    {bg:"плаж", tr:"plazh", fr:"plage"},
    {bg:"о́стров", tr:"ostrov", fr:"île"},
    {bg:"приро́да", tr:"priroda", fr:"nature"},
    {bg:"живо́тно", tr:"zhivotno", fr:"animal"},
    {bg:"ку́че", tr:"kuche", fr:"chien"},
    {bg:"ко́тка", tr:"kotka", fr:"chat"},
    {bg:"пти́ца", tr:"ptitsa", fr:"oiseau"},
    {bg:"кон", tr:"kon", fr:"cheval"},
    {bg:"кра́ва", tr:"krava", fr:"vache"},
    {bg:"овца́", tr:"ovtsa", fr:"mouton"},
    {bg:"и", tr:"i", fr:"et"},
    {bg:"и́ли", tr:"ili", fr:"ou"},
    {bg:"но", tr:"no", fr:"mais"},
    {bg:"защо́то", tr:"zashtoto", fr:"parce que"},
    {bg:"а́ко", tr:"ako", fr:"si"},
    {bg:"че", tr:"che", fr:"que"},
    {bg:"кога́то", tr:"kogato", fr:"quand / lorsque"},
    {bg:"след", tr:"sled", fr:"après"},
    {bg:"за", tr:"za", fr:"pour"},
    {bg:"от", tr:"ot", fr:"de / depuis"},
    {bg:"до", tr:"do", fr:"jusqu'à / à côté de"},
    {bg:"с", tr:"s", fr:"avec"},
    {bg:"без", tr:"bez", fr:"sans"},
    {bg:"в", tr:"v", fr:"dans / à"},
    {bg:"на", tr:"na", fr:"de / à / sur"},
    {bg:"при", tr:"pri", fr:"chez / auprès de"},
    {bg:"ме́жду", tr:"mezhdu", fr:"entre"}
  ]},
  difficile: {label:"Mots difficiles ", items:[
    {bg:"съсе́д", tr:"sased", fr:"voisin"},
    {bg:"съсе́дка", tr:"sasedka", fr:"voisine"},
    {bg:"и́ме", tr:"ime", fr:"nom / prénom"},
    {bg:"фами́лия", tr:"familiya", fr:"nom de famille"},
    {bg:"страна́", tr:"strana", fr:"pays"},
    {bg:"държа́ва", tr:"darzhava", fr:"État / pays"},
    {bg:"се́ло", tr:"selo", fr:"village"},
    {bg:"ду́ма", tr:"duma", fr:"mot"},
    {bg:"въпро́с", tr:"vapros", fr:"question"},
    {bg:"отго́вор", tr:"otgovor", fr:"réponse"},
    {bg:"не́що", tr:"neshto", fr:"quelque chose"},
    {bg:"ня́кой", tr:"nyakoy", fr:"quelqu'un"},
    {bg:"ни́кой", tr:"nikoy", fr:"personne (ne… personne)"},
    {bg:"извиня́вай", tr:"izvinyavay", fr:"excuse-moi"},
    {bg:"съжаля́вам", tr:"sazhalyavam", fr:"je suis désolé"},
    {bg:"зле", tr:"zle", fr:"mal"},
    {bg:"разби́ра се", tr:"razbira se", fr:"bien sûr"},
    {bg:"вя́рно", tr:"vyarno", fr:"vrai / correct"},
    {bg:"гре́шно", tr:"greshno", fr:"faux / incorrect"},
    {bg:"как", tr:"kak", fr:"comment"},
    {bg:"какво́", tr:"kakvo", fr:"quoi / que"},
    {bg:"кой", tr:"koy", fr:"qui"},
    {bg:"коя", tr:"koya", fr:"qui (fém.)"},
    {bg:"кое", tr:"koe", fr:"lequel / laquelle (neutre)"},
    {bg:"кои", tr:"koi", fr:"lesquels"},
    {bg:"откъде́", tr:"otkade", fr:"d'où"},
    {bg:"накъде́", tr:"nakade", fr:"vers où"},
    {bg:"кога́", tr:"koga", fr:"quand"},
    {bg:"чий", tr:"chiy", fr:"à qui / de qui"},
    {bg:"чия́", tr:"chiya", fr:"à qui (fém.)"},
    {bg:"то́зи", tr:"tozi", fr:"ce / cet"},
    {bg:"та́зи", tr:"tazi", fr:"cette"},
    {bg:"това́", tr:"tova", fr:"ceci / cela"},
    {bg:"те́зи", tr:"tezi", fr:"ces"},
    {bg:"о́нзи", tr:"onzi", fr:"celui-là"},
    {bg:"она́зи", tr:"onazi", fr:"celle-là"},
    {bg:"оно́ва", tr:"onova", fr:"cela (là-bas)"},
    {bg:"оне́зи", tr:"onezi", fr:"ceux-là"},
    {bg:"мой", tr:"moy", fr:"mon / mien"},
    {bg:"твой", tr:"tvoy", fr:"ton / tien"},
    {bg:"не́гов", tr:"negov", fr:"son / le sien"},
    {bg:"не́ин", tr:"nein", fr:"son / le sien (fém.)"},
    {bg:"наш", tr:"nash", fr:"notre / nôtre"},
    {bg:"ваш", tr:"vash", fr:"votre / vôtre"},
    {bg:"те́хен", tr:"tehen", fr:"leur / le leur"},
    {bg:"се́бе си", tr:"sebe si", fr:"soi-même"},
    {bg:"по́сле", tr:"posle", fr:"après / plus tard"},
    {bg:"ве́че", tr:"veche", fr:"déjà"},
    {bg:"о́ще", tr:"oshte", fr:"encore"},
    {bg:"Спо́мням си", tr:"Spomnyam si", fr:"je m'en rappelle"},
    {bg:"краси́во е", tr:"krasivo e", fr:"c'est beau"},
    {bg:"Така́ ли?", tr:"Taka li?", fr:"Ah bon ? / Vraiment ?"},
    {bg:"така́", tr:"taka", fr:"comme ça / ainsi / de cette manière"},
    {bg:"Вче́ра", tr:"Vchera", fr:"hier"},
    {bg:"преди́", tr:"predi", fr:"Avant"},
    {bg:"след", tr:"sled", fr:"Après"},
    {bg:"сле́дващата се́дмица", tr:"sledvashtata sedmitsa", fr:"la semaine prochaine"},
    {bg:"У́тре", tr:"Utre", fr:"Demain"},
    {bg:"Днес", tr:"Dnes", fr:"Aujourd'hui"},
    {bg:"да", tr:"da", fr:"à, que"},
    {bg:"и́ма", tr:"ima", fr:"il y a"},
    {bg:"за да", tr:"za da", fr:"pour que"},
    {bg:"И́скам да полу́ча бъ́лгарско гражда́нство", tr:"Iskam da polucha balgarsko grazhdanstvo", fr:"Je veux obtenir la nationalité bulgare."},
    {bg:"И́мам ну́жда от по́мощ", tr:"Imam nuzhda ot pomosht", fr:"J'ai besoin d'aide."},
    {bg:"А́ко Бог е за нас, кой мо́же да бъ́де проти́в нас?", tr:"Ako Bog e za nas, koy mozhe da bade protiv nas?", fr:"Si Dieu est pour nous, qui peut être contre nous ?"},
    {bg:"Ба́ща ми", tr:"Bashta mi", fr:"mon père"},
    {bg:"По вре́ме на", tr:"po vreme na", fr:"pendant (la réunion)"},
    {bg:"В продълже́ние на", tr:"v prodalzhenie na", fr:"pendant (3 semaines)"},
    {bg:"единаде́сет", tr:"edinadeset", fr:"onze (11)"},
    {bg:"два́десет", tr:"dvadeset", fr:"vingt (20)"},
    {bg:"два́десет и де́вет", tr:"dvadeset i devet", fr:"vingt-neuf (29)"},
    {bg:"Ще до́йда.", tr:"Shte doyda.", fr:"Je viendrai."},
    {bg:"Ще тръ́гнем.", tr:"Shte tragnem.", fr:"Nous partirons."},
    {bg:"Изо́бщо", tr:"Izobshto", fr:"Pas du tout"},
    {bg:"часа́", tr:"chasa", fr:"l'heure"},
    {bg:"в ко́йто", tr:"v koyto", fr:"à laquelle"},
    {bg:"жа́ден/жа́дна съм", tr:"zhaden/zhadna sam", fr:"j'ai soif"},
    {bg:"и́мам ну́жда от", tr:"imam nuzhda ot", fr:"j'ai besoin de"},
    {bg:"Пома́га", tr:"Pomaga", fr:"Ça aide"},
    {bg:"Пода́рък", tr:"Podarak", fr:"cadeau"},
    {bg:"автога́рата", tr:"avtogarata", fr:"la gare routière"},
    {bg:"лети́щето", tr:"letishteto", fr:"l'aéroport"},
    {bg:"наля́во", tr:"nalyavo", fr:"à gauche"},
    {bg:"надя́сно", tr:"nadyasno", fr:"à droite"},
    {bg:"Мно́го вку́сно!", tr:"Mnogo vkusno!", fr:"Délicieux !"},
    {bg:"Ко́лко стру́ва?", tr:"Kolko struva?", fr:"Combien ça coûte ?"}
  ]}
};

/* ---------------- STORAGE ---------------- */
const STORE_KEY = "bg_a1_progress_v3";
function loadProgress(){
  try{
    return JSON.parse(localStorage.getItem(STORE_KEY)) || {known:{}, quizScores:{}};
  }catch(e){ return {known:{}, quizScores:{}}; }
}
function saveProgress(p){ localStorage.setItem(STORE_KEY, JSON.stringify(p)); }
let progress = loadProgress();

/* ---------------- NAV ---------------- */
const navButtons = document.querySelectorAll("#nav button");
navButtons.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    navButtons.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll("main section").forEach(s=>s.classList.remove("active"));
    document.getElementById("sec-"+btn.dataset.target).classList.add("active");
    if(btn.dataset.target==="progress"){ renderProgressPage(); if(typeof renderCultureProgress==="function") renderCultureProgress(); }
    if(btn.dataset.target==="lucy") renderLucyMiniProgress();
  });
});

/* ---------------- SECTION TOOLBAR (déplier / replier) ---------------- */
document.querySelectorAll(".section-toolbar .mini-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const section = btn.closest("section");
    const open = btn.dataset.expand === "all";
    section.querySelectorAll("details.info-card").forEach(d=>{ d.open = open; });
  });
});

/* ---------------- ALPHABET ---------------- */
const lettersGrid = document.getElementById("letters-grid");
ALPHABET.forEach(a=>{
  const div = document.createElement("div");
  div.className = "letter-card";
  div.innerHTML = `<div class="glyph">${a.l}</div><div class="name">${a.name}</div><div class="sound">${a.sound}</div><div class="ex">${a.ex}</div>`;
  lettersGrid.appendChild(div);
});

/* ---------------- VOCAB LISTS ---------------- */
const vocabChips = document.getElementById("vocab-chips");
const vocabList = document.getElementById("vocab-list");
let currentVocabCat = Object.keys(VOCAB)[0];

function renderVocabChips(){
  vocabChips.innerHTML = "";
  Object.entries(VOCAB).forEach(([key, cat])=>{
    const chip = document.createElement("button");
    chip.className = "chip" + (key===currentVocabCat ? " active":"");
    chip.textContent = cat.label;
    chip.addEventListener("click", ()=>{ currentVocabCat = key; renderVocabChips(); renderVocabList(); });
    vocabChips.appendChild(chip);
  });
}
function renderVocabList(){
  vocabList.innerHTML = "";
  getWordItems(currentVocabCat).forEach(it=>{
    const div = document.createElement("div");
    div.className = "phrase";
    div.innerHTML = `<span class="fr">${it.fr}</span> <span class="bg">${it.bg} <span style="color:var(--muted);font-size:.82rem;">(${it.tr})</span></span>`;
    vocabList.appendChild(div);
  });
}
renderVocabChips();
renderVocabList();

/* ---------------- VERBS SECTION LIST ---------------- */
const verbListEl = document.getElementById("verb-list");
const vsInput = document.getElementById("vs-input");
const vsBar = document.getElementById("vs-bar");
const vsClear = document.getElementById("vs-clear");
const vsCount = document.getElementById("vs-count");
const vsExtra = document.getElementById("vs-extra");

function vsNorm(str){ return (str||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(); }
function vsEsc(str){ return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function vsHl(text, qn){
  text = String(text||"");
  if(!qn) return vsEsc(text);
  let n="", map=[];
  for(let i=0;i<text.length;i++){
    const c = vsNorm(text[i]);
    for(let k=0;k<c.length;k++){ n+=c[k]; map.push(i); }
  }
  const ranges=[]; let from=0, idx;
  while((idx = n.indexOf(qn, from)) !== -1){
    let st = map[idx], en = map[idx+qn.length-1]+1;
    while(en<text.length && /[\u0300-\u036f]/.test(text[en])) en++;
    ranges.push([st,en]); from = idx+qn.length;
  }
  if(!ranges.length) return vsEsc(text);
  let out="", pos=0;
  ranges.forEach(([st,en])=>{
    if(st<pos) st=pos;
    out += vsEsc(text.slice(pos,st)) + '<mark class="vs-mark">' + vsEsc(text.slice(st,en)) + '</mark>';
    pos = en;
  });
  return out + vsEsc(text.slice(pos));
}
function vsMatch(it, qn){
  return vsNorm(it.bg).includes(qn) || vsNorm(it.fr).includes(qn) || vsNorm(it.tr||"").includes(qn);
}
function vsRow(it, qn){
  return `<div class="phrase"><span class="fr">${vsHl(it.fr,qn)}</span> <span class="bg">${vsHl(it.bg,qn)} <span style="color:var(--muted);font-size:.82rem;">(${vsHl(it.tr||"",qn)})</span></span></div>`;
}
function renderVerbSearch(){
  const raw = vsInput.value.trim();
  const qn = vsNorm(raw);
  vsBar.classList.toggle("has-text", raw.length>0);
  const main = VOCAB.verbs.items;

  if(!qn){
    verbListEl.innerHTML = main.map(v=>vsRow(v,"")).join("");
    vsExtra.innerHTML = "";
    vsCount.textContent = "";
    return;
  }

  const mainHits = main.filter(v=>vsMatch(v,qn));
  verbListEl.innerHTML = mainHits.map(v=>vsRow(v,qn)).join("");

  // Autres verbes du vocabulaire (verbes essentiels 1 & 2), sans doublons
  const seen = new Set(main.map(v=>vsNorm(v.bg)));
  const others = [];
  ["verbs1","verbs2"].forEach(k=>{
    if(!VOCAB[k]) return;
    VOCAB[k].items.forEach(v=>{
      if(v.type==="table") return;
      const key = vsNorm(v.bg);
      if(!seen.has(key) && vsMatch(v,qn)){ seen.add(key); others.push(v); }
    });
  });

  // Formes conjuguées (données de l'onglet Conjugaison)
  const forms = [];
  const CJ = window.CJ;
  if(CJ){
    CJ.VERBS.forEach(v=>{
      const nameHit = vsNorm(v.bg).includes(qn) || vsNorm(v.fr).includes(qn);
      if(nameHit) forms.push(`<div class="phrase"><span class="fr">${vsHl(v.fr,qn)} <small style="color:var(--muted)">· ${CJ.GROUPS[v.grp]?CJ.GROUPS[v.grp].label:""}</small></span><span class="vs-form">${vsHl(v.bg,qn)}</span></div>`);
      CJ.T_ORDER.forEach(t=>{
        const arr = v[t]; if(!arr) return;
        const pers = t==="imp" ? CJ.PERS_IMP : CJ.PERS;
        arr.forEach((f,i)=>{
          if(vsNorm(f).includes(qn) && !(nameHit && t==="pres" && i===0 && vsNorm(f)===vsNorm(v.bg))){
            forms.push(`<div class="phrase"><span class="fr">${vsEsc(v.fr)} <small style="color:var(--muted)">· ${CJ.TENSES[t].label} · ${vsEsc(pers[i].fr)}</small></span><span class="vs-form"><small>${vsEsc(pers[i].short)}</small> ${vsHl(f,qn)}</span></div>`);
          }
        });
      });
    });
  }

  let html = "";
  if(!mainHits.length) verbListEl.innerHTML = "";
  if(others.length) html += `<h3 class="vs-h">Autres verbes du vocabulaire (${others.length})</h3><div class="phrase-list">${others.map(v=>vsRow(v,qn)).join("")}</div>`;
  if(forms.length){
    const shown = forms.slice(0,40);
    html += `<h3 class="vs-h">Dans les tableaux de conjugaison (${forms.length})</h3><div class="phrase-list">${shown.join("")}</div>`;
    if(forms.length>shown.length) html += `<p class="vs-count">… ${forms.length-shown.length} autres résultats : précise ta recherche.</p>`;
  }
  const total = mainHits.length + others.length + forms.length;
  if(!total) html = `<div class="vs-empty">Aucun résultat pour « ${vsEsc(raw)} ». Essaie un autre mot, en français, en bulgare ou en lettres latines.</div>`;
  vsExtra.innerHTML = html;
  vsCount.textContent = total ? `${total} résultat${total>1?"s":""}` : "";
}
vsInput.addEventListener("input", renderVerbSearch);
vsInput.addEventListener("keydown", e=>{ if(e.key==="Escape"){ vsInput.value=""; renderVerbSearch(); } });
vsClear.addEventListener("click", ()=>{ vsInput.value=""; renderVerbSearch(); vsInput.focus(); });
renderVerbSearch();

/* ---------------- VOCAB SEARCH (tous les thèmes) ---------------- */
(function(){
  const input=document.getElementById("vc-input"), bar=document.getElementById("vc-bar"),
        clear=document.getElementById("vc-clear"), count=document.getElementById("vc-count");
  const MAX=150;
  function render(){
    const raw=input.value.trim(), qn=vsNorm(raw);
    bar.classList.toggle("has-text", raw.length>0);
    if(!qn){
      vocabChips.style.display="";
      count.textContent="";
      renderVocabChips(); renderVocabList();
      return;
    }
    vocabChips.style.display="none";
    let total=0, shown=0, html="";
    Object.keys(VOCAB).forEach(key=>{
      const hits=getWordItems(key).filter(it=>vsMatch(it,qn));
      if(!hits.length) return;
      total+=hits.length;
      if(shown>=MAX) return;
      const part=hits.slice(0,MAX-shown);
      shown+=part.length;
      html+=`<h3 class="vs-h">${vsEsc(VOCAB[key].label)} (${hits.length})</h3>`+part.map(it=>vsRow(it,qn)).join("");
    });
    if(!total) html=`<div class="vs-empty">Aucun résultat pour « ${vsEsc(raw)} ». Essaie un autre mot, en français, en bulgare ou en lettres latines.</div>`;
    else if(total>shown) html+=`<p class="vs-count">… ${total-shown} autres résultats : précise ta recherche.</p>`;
    vocabList.innerHTML=html;
    count.textContent=total?`${total} résultat${total>1?"s":""} dans tous les thèmes`:"";
  }
  input.addEventListener("input", render);
  input.addEventListener("keydown", e=>{ if(e.key==="Escape"){ input.value=""; render(); } });
  clear.addEventListener("click", ()=>{ input.value=""; render(); input.focus(); });
})();

/* ---------------- LUCY SECTION LIST ---------------- */
const lucyListEl = document.getElementById("lucy-list");
VOCAB.lucy.items.forEach(l=>{
  if(l.type === "table"){
    const wrap = document.createElement("div");
    wrap.className = "mini-table-wrap";
    const rowsHtml = l.rows.map(r=>`<tr><td>${r[0]}</td><td class="bg-cell">${r[1]}</td></tr>`).join("");
    wrap.innerHTML = `
      <div class="mini-table-title">${l.title}</div>
      <table class="mini-table">
        <thead><tr><th>Français</th><th>Bulgare</th></tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>`;
    lucyListEl.appendChild(wrap);
    return;
  }
  const div = document.createElement("div");
  div.className = "phrase";
  div.innerHTML = `<span class="fr">${l.fr}</span> <span class="bg">${l.bg} <span style="color:var(--muted);font-size:.82rem;">(${l.tr})</span></span>`;
  lucyListEl.appendChild(div);
});

/* ---------------- FLASHCARDS (French front, Bulgarian back) ---------------- */
const fcChips = document.getElementById("fc-chips");
let fcCat = Object.keys(VOCAB)[0];
let fcOrder = [];        // indices des cartes du tour en cours
let fcPos = 0;           // position dans le tour
let fcMissed = new Set();// cartes cliquées "Pas encore" pendant ce tour
let fcDone = false;      // tour terminé -> écran de fin
let fcRetry = false;     // tour limité aux cartes "Pas encore"
let fcFlipped = false;
let fcStage = "deck";    // "deck" = paquet à mélanger, "play" = révision en cours
let fcShuffling = false; // animation de mélange en cours

function fcReset(){
  fcStage = "deck";
  fcOrder = getWordItems(fcCat).map((_, i)=>i);
  fcPos = 0;
  fcMissed = new Set();
  fcDone = false;
  fcRetry = false;
}
fcReset();

function renderFcChips(){
  fcChips.innerHTML = "";
  Object.entries(VOCAB).forEach(([key, cat])=>{
    const chip = document.createElement("button");
    chip.className = "chip" + (key===fcCat ? " active":"");
    chip.textContent = cat.label;
    chip.addEventListener("click", ()=>{ fcCat = key; fcReset(); renderFcChips(); renderFlashcard(); });
    fcChips.appendChild(chip);
  });
}

const flashcardEl = document.getElementById("flashcard");
flashcardEl.addEventListener("click", ()=>{
  fcFlipped = !fcFlipped;
  flashcardEl.classList.toggle("flipped", fcFlipped);
});

function knownKey(cat, idx){ return cat + ":" + idx; }

/* Écran de fin de tour (partagé par les flashcards vocabulaire et culture) */
function buildRoundEnd(host, missedCount, totalCount, onMissed, onAll){
  const plural = missedCount > 1;
  host.innerHTML = missedCount > 0
    ? `<div class="re-title">Tour terminé !</div>
       <div class="re-text">Tu as cliqué sur « Pas encore » pour <b>${missedCount}</b> carte${plural?"s":""} sur ${totalCount}.<br>Que veux-tu faire ?</div>
       <div class="re-btns">
         <button class="action primary" data-act="missed"> Refaire uniquement les ${missedCount} carte${plural?"s":""} « Pas encore »</button>
         <button class="action ghost" data-act="all">↺ Recommencer avec toutes les cartes (${totalCount})</button>
       </div>`
    : `<div class="re-title"> Tour terminé !</div>
       <div class="re-text">Aucune carte « Pas encore » sur ce tour. Bravo !</div>
       <div class="re-btns">
         <button class="action primary" data-act="all">↺ Recommencer avec toutes les cartes (${totalCount})</button>
       </div>`;
  const bm = host.querySelector('[data-act="missed"]');
  if(bm) bm.addEventListener("click", onMissed);
  host.querySelector('[data-act="all"]').addEventListener("click", onAll);
}

function fcShowEnd(){
  const total = getWordItems(fcCat).length;
  const host = document.getElementById("fc-end");
  buildRoundEnd(host, fcMissed.size, total,
    ()=>{ // refaire les "Pas encore"
      fcOrder = fcOrder.filter(i=>fcMissed.has(i));
      fcStage = "play";
      fcPos = 0; fcMissed = new Set(); fcDone = false; fcRetry = true;
      renderFlashcard();
    },
    ()=>{ fcReset(); renderFlashcard(); }
  );
  flashcardEl.style.display = "none";
  document.getElementById("fc-controls").style.display = "none";
  document.getElementById("fc-retry-bar").style.display = "none";
  host.style.display = "flex";
  document.getElementById("fc-progress").textContent = "";
}
function fcHideEnd(){
  flashcardEl.style.display = "";
  document.getElementById("fc-controls").style.display = "";
  document.getElementById("fc-retry-bar").style.display = "";
  document.getElementById("fc-end").style.display = "none";
}
function fcUpdateRetry(){
  const b = document.getElementById("fc-retry");
  const n = fcMissed.size;
  b.disabled = n === 0;
  b.textContent = ` Retravailler mes erreurs (${n})`;
}

function renderFlashcard(){
  const items = getWordItems(fcCat);
  if(!fcOrder.length || fcOrder.some(i=>i>=items.length)) fcReset();
  if(fcStage === "deck"){ fcShowDeck(items.length); return; }
  fcHideDeck();
  if(fcDone){ fcShowEnd(); return; }
  fcHideEnd();
  const idx = fcOrder[fcPos];
  const it = items[idx];
  // FRONT = French, BACK = Bulgarian
  document.getElementById("fc-front-word").textContent = it.fr;
  document.getElementById("fc-back-word").textContent = it.bg;
  document.getElementById("fc-back-sub").textContent = it.tr;
  fcFlipped = false;
  flashcardEl.classList.remove("flipped");
  const knownCount = items.filter((_, i)=>progress.known[knownKey(fcCat,i)]).length;
  document.getElementById("fc-progress").textContent =
    `Carte ${fcPos+1} / ${fcOrder.length}${fcRetry ? " (révision des « Pas encore »)" : ""} — ${knownCount}/${items.length} maîtrisées dans ce thème`;
  fcUpdateRetry();
}

/* ---- Paquet + animation « Mélanger » ---- */
const fcDeckEl = document.getElementById("fc-deck");
const fcPileEl = document.getElementById("fc-deck-pile");
const FC_PILE_SIZE = 8;

function fcBuildPile(){
  if(fcPileEl.children.length) return;
  for(let i=0;i<FC_PILE_SIZE;i++){
    const c = document.createElement("div");
    c.className = "fc-deck-card";
    c.textContent = "";
    c.style.zIndex = i;
    c.style.transform = fcPileBase(i);
    fcPileEl.appendChild(c);
  }
}
function fcPileBase(i){
  return `translate(${(i%2 ? 1.5 : -1.5)}px, ${-i*2}px) rotate(0deg)`;
}
function fcShowDeck(total){
  fcBuildPile();
  flashcardEl.style.display = "none";
  document.getElementById("fc-controls").style.display = "none";
  document.getElementById("fc-retry-bar").style.display = "none";
  document.getElementById("fc-end").style.display = "none";
  fcDeckEl.style.display = "flex";
  const known = getWordItems(fcCat).filter((_, i)=>progress.known[knownKey(fcCat,i)]).length;
  document.getElementById("fc-deck-count").textContent =
    fcShuffling ? "Mélange en cours…" : `${total} cartes dans ce thème — ${known} maîtrisées`;
  document.getElementById("fc-progress").textContent = "";
}
function fcHideDeck(){ fcDeckEl.style.display = "none"; }

function fcFisherYates(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  return arr;
}

function fcStartPlay(shuffled){
  fcStage = "play";
  fcPos = 0;
  fcShuffling = false;
  document.getElementById("fc-shuffle").disabled = false;
  document.getElementById("fc-skip-shuffle").disabled = false;
  renderFlashcard();
  if(shuffled){
    flashcardEl.classList.remove("fc-reveal");
    void flashcardEl.offsetWidth; // relance l'animation d'apparition
    flashcardEl.classList.add("fc-reveal");
  }
}

function fcShuffleDeck(){
  if(fcShuffling || fcStage !== "deck") return;
  fcShuffling = true;
  document.getElementById("fc-shuffle").disabled = true;
  document.getElementById("fc-skip-shuffle").disabled = true;
  document.getElementById("fc-deck-count").textContent = "Mélange en cours…";

  // Vrai mélange (Fisher-Yates), différent de l'ordre actuel si possible
  const before = fcOrder.join(",");
  fcFisherYates(fcOrder);
  if(fcOrder.length > 1 && fcOrder.join(",") === before) fcFisherYates(fcOrder);

  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cards = Array.from(fcPileEl.children);
  if(reduce || !cards[0].animate){ setTimeout(()=>fcStartPlay(true), 250); return; }

  const n = cards.length;
  let last = null;
  cards.forEach((c, i)=>{
    const dir = i % 2 ? 1 : -1;
    const by = -i*2;
    const base = fcPileBase(i);
    const out  = `translate(${dir*125}px, ${by-8}px) rotate(${dir*9}deg)`;
    const mid  = `translate(${dir*22}px, ${by}px) rotate(${-dir*3}deg)`;
    last = c.animate([
      { transform:base, zIndex:i,       offset:0 },
      { transform:out,  zIndex:i,       offset:.18, easing:"ease-in-out" },
      { transform:mid,  zIndex:n-i,     offset:.36 },
      { transform:out,  zIndex:n-i,     offset:.54, easing:"ease-in-out" },
      { transform:mid,  zIndex:(i*3)%n, offset:.72 },
      { transform:base, zIndex:i,       offset:1 }
    ], { duration:1500, delay:i*45, easing:"ease-in-out" });
  });
  last.onfinish = ()=>{
    // petit « tapotage » final du paquet avant de révéler la 1re carte
    fcPileEl.animate([
      { transform:"translateY(0)" },
      { transform:"translateY(-7px)" },
      { transform:"translateY(0)" }
    ], { duration:220 }).onfinish = ()=>fcStartPlay(true);
  };
}
document.getElementById("fc-shuffle").addEventListener("click", fcShuffleDeck);
document.getElementById("fc-skip-shuffle").addEventListener("click", ()=>{
  if(fcShuffling) return;
  fcStartPlay(false);
});

function fcMove(step){
  const n = fcOrder.length;
  if(step > 0 && fcPos === n-1){ fcDone = true; renderFlashcard(); return; }
  fcPos = (fcPos + step + n) % n;
  renderFlashcard();
}

document.getElementById("fc-retry").addEventListener("click", ()=>{
  if(!fcMissed.size) return;
  fcStage = "play";
  fcOrder = fcOrder.filter(i=>fcMissed.has(i));
  fcPos = 0; fcMissed = new Set(); fcDone = false; fcRetry = true;
  renderFlashcard();
});
document.getElementById("fc-next").addEventListener("click", ()=>fcMove(1));
document.getElementById("fc-prev").addEventListener("click", ()=>fcMove(-1));
document.getElementById("fc-know").addEventListener("click", ()=>{
  const idx = fcOrder[fcPos];
  progress.known[knownKey(fcCat, idx)] = true;
  fcMissed.delete(idx);
  saveProgress(progress);
  renderLucyMiniProgress();
  fcMove(1);
});
document.getElementById("fc-dontknow").addEventListener("click", ()=>{
  const idx = fcOrder[fcPos];
  delete progress.known[knownKey(fcCat, idx)];
  fcMissed.add(idx);
  saveProgress(progress);
  renderLucyMiniProgress();
  fcMove(1);
});

renderFcChips();
renderFlashcard();

/* ---------------- QUIZ ---------------- */
const quizChips = document.getElementById("quiz-chips");
const quizCountChipsEl = document.getElementById("quiz-count-chips");
const quizWeakNoteEl = document.getElementById("quiz-weak-note");
const quizBox = document.getElementById("quiz-box");
const WEAK_KEY = "__weak__";
const QUIZ_COUNTS = [5,10,15,20,"all"];

if(!progress.quizSettings) progress.quizSettings = {count:10};
if(!progress.quizStats) progress.quizStats = {};

let quizCat = Object.keys(VOCAB)[0];
let quizCount = QUIZ_COUNTS.includes(progress.quizSettings.count) ? progress.quizSettings.count : 10;
let quizQuestions = [];
let quizIndex = 0;
let quizScore = 0;
let lastShownFr = null; // évite qu'une même question ne retombe juste après elle-même

const THEME_WEAK_KEY = "__theme_weak__";
let quizSessionWrong = []; // mots ratés pendant la série de thème en cours (dédupliqués par fr)
let quizTimer = null; // délai avant la question suivante (annulé si on relance une série)
let lastThemeWeakItems = []; // dernière liste utilisée pour une série "points faibles de ce thème"

function quizCatLabel(catKey){
  return catKey===WEAK_KEY ? "Points faibles" : VOCAB[catKey].label;
}

function renderQuizCountChips(){
  quizCountChipsEl.innerHTML = "";
  QUIZ_COUNTS.forEach(c=>{
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "count-chip" + (quizCount===c ? " active":"");
    chip.textContent = c==="all" ? "Toutes" : String(c);
    chip.addEventListener("click", ()=>{
      quizCount = c;
      progress.quizSettings.count = c;
      saveProgress(progress);
      renderQuizCountChips();
      startQuiz();
    });
    quizCountChipsEl.appendChild(chip);
  });
}

function renderQuizChips(){
  quizChips.innerHTML = "";

  const weakChip = document.createElement("button");
  weakChip.type = "button";
  weakChip.className = "chip weak" + (quizCat===WEAK_KEY ? " active":"");
  weakChip.textContent = " Points faibles";
  weakChip.addEventListener("click", ()=>{ quizCat = WEAK_KEY; renderQuizChips(); startQuiz(); });
  quizChips.appendChild(weakChip);

  Object.entries(VOCAB).forEach(([key, cat])=>{
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip" + (key===quizCat ? " active":"");
    chip.textContent = cat.label;
    chip.addEventListener("click", ()=>{ quizCat = key; renderQuizChips(); startQuiz(); });
    quizChips.appendChild(chip);
  });

  quizWeakNoteEl.style.display = quizCat===WEAK_KEY ? "block" : "none";
}

function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

/* --- Statistiques par mot (pour détecter les points faibles) --- */
function statKey(catKey, item){ return catKey + "||" + item.fr; }

function weakScore(catKey, item){
  const st = progress.quizStats[statKey(catKey, item)];
  if(!st) return 0;
  // plus le score est haut, plus le mot est "faible" (fautes récentes comptent double)
  return (st.wrong||0)*2 - (st.right||0);
}

function recordAnswer(catKey, item, correct){
  const k = statKey(catKey, item);
  const st = progress.quizStats[k] || {right:0, wrong:0};
  if(correct) st.right++; else st.wrong++;
  progress.quizStats[k] = st;
  saveProgress(progress);
}

function getAllVocabItems(){
  return Object.entries(VOCAB).flatMap(([key,cat])=>
    getWordItems(key).map(it=>({...it, __cat:key}))
  );
}

/* Sélectionne les mots les plus faibles, tous thèmes confondus (avec un peu
   d'aléatoire pour départager les mots jamais ratés / jamais vus) */
function buildWeakPool(){
  return getAllVocabItems()
    .map(it=>({ it, score: weakScore(it.__cat, it) + Math.random()*0.5 }))
    .sort((a,b)=> b.score - a.score)
    .map(x=>x.it);
}

/* Réordonne la sélection pour qu'un même mot ne tombe jamais deux fois de
   suite, ni juste après la dernière question du quiz précédent */
function avoidAdjacentRepeats(pool){
  if(pool.length<2) return pool;
  const a = pool.slice();
  if(a[0].fr===lastShownFr){
    const idx = a.findIndex((it,i)=> i>0 && it.fr!==lastShownFr && it.fr!==a[1].fr);
    if(idx>0){ [a[0],a[idx]] = [a[idx],a[0]]; }
  }
  for(let i=1;i<a.length;i++){
    if(a[i].fr===a[i-1].fr){
      let swapped = false;
      for(let j=i+1;j<a.length;j++){
        if(a[j].fr!==a[i-1].fr){
          [a[i],a[j]] = [a[j],a[i]];
          swapped = true;
          break;
        }
      }
      if(!swapped){
        for(let j=i-2;j>=0;j--){
          if(a[j].fr!==a[i-1].fr && a[j].fr!==a[i].fr){
            [a[i],a[j]] = [a[j],a[i]];
            break;
          }
        }
      }
    }
  }
  return a;
}

function makeQuestion(correct){
  const cat = correct.__cat;
  let distractors = shuffle(getWordItems(cat).filter(i=>i.fr!==correct.fr)).slice(0,3);
  if(distractors.length<3){
    const extra = shuffle(
      getAllVocabItems().filter(i=> i.fr!==correct.fr && !distractors.some(d=>d.fr===i.fr))
    ).slice(0, 3-distractors.length);
    distractors = distractors.concat(extra);
  }
  const options = shuffle([correct, ...distractors]);
  return { fr: correct.fr, correctBg: correct.bg, cat, options: options.map(o=>o.bg) };
}

function buildQuestions(catKey, count){
  let selected;
  if(catKey===WEAK_KEY){
    const pool = buildWeakPool();
    const n = count==="all" ? pool.length : Math.min(count, pool.length);
    selected = shuffle(pool.slice(0, n));
  } else {
    const items = getWordItems(catKey).map(it=>({...it, __cat:catKey}));
    const n = count==="all" ? items.length : Math.min(count, items.length);
    selected = shuffle(items).slice(0, n);
  }
  selected = avoidAdjacentRepeats(selected);

  return selected.map(makeQuestion);
}

function startQuiz(){
  clearTimeout(quizTimer);
  quizQuestions = buildQuestions(quizCat, quizCount);
  quizIndex = 0;
  quizScore = 0;
  quizSessionWrong = [];
  renderQuizQuestion();
}

/* Relance une série ciblée sur une liste précise de mots (ex : les erreurs
   de la série de thème qui vient de se terminer) */
function startThemeWeakQuiz(items){
  if(!items || !items.length) return;
  clearTimeout(quizTimer);
  lastThemeWeakItems = items.slice();
  quizCat = THEME_WEAK_KEY;
  const pool = avoidAdjacentRepeats(shuffle(items));
  quizQuestions = pool.map(makeQuestion);
  quizIndex = 0;
  quizScore = 0;
  quizSessionWrong = [];
  renderQuizQuestion();
}

function renderQuizQuestion(){
  if(quizIndex >= quizQuestions.length){
    renderQuizResult();
    return;
  }
  const q = quizQuestions[quizIndex];
  quizBox.innerHTML = `
    <div class="quiz-progress">Question ${quizIndex+1} / ${quizQuestions.length} — ${VOCAB[q.cat].label}${quizCat===THEME_WEAK_KEY ? " (révision des erreurs)" : ""}</div>
    <div class="quiz-question">Quel est le bulgare pour : "${q.fr}" ?</div>
    <div class="quiz-options" id="quiz-options"></div>
    <div class="retry-bar"><button type="button" class="action retry-btn" id="quiz-retry-now"></button></div>
  `;
  const retryNow = document.getElementById("quiz-retry-now");
  const updRetryNow = ()=>{
    retryNow.disabled = quizSessionWrong.length === 0;
    retryNow.textContent = ` Retravailler mes erreurs (${quizSessionWrong.length})`;
  };
  updRetryNow();
  retryNow.addEventListener("click", ()=>{
    if(quizSessionWrong.length) startThemeWeakQuiz(quizSessionWrong.slice());
  });
  const optionsEl = document.getElementById("quiz-options");
  q.options.forEach(opt=>{
    const b = document.createElement("button");
    b.className = "opt-btn";
    b.textContent = opt;
    b.addEventListener("click", ()=>{
      const buttons = optionsEl.querySelectorAll(".opt-btn");
      buttons.forEach(bb=>bb.disabled = true);
      const isCorrect = opt === q.correctBg;
      if(isCorrect){
        b.classList.add("correct");
        quizScore++;
      } else {
        b.classList.add("incorrect");
        buttons.forEach(bb=>{ if(bb.textContent===q.correctBg) bb.classList.add("correct"); });
        if(!quizSessionWrong.some(it=>it.fr===q.fr)){
          quizSessionWrong.push({fr:q.fr, bg:q.correctBg, __cat:q.cat});
          updRetryNow();
        }
      }
      recordAnswer(q.cat, {fr:q.fr, bg:q.correctBg}, isCorrect);
      lastShownFr = q.fr;
      quizTimer = setTimeout(()=>{ quizIndex++; renderQuizQuestion(); }, 700);
    });
    optionsEl.appendChild(b);
  });
}

function renderQuizResult(){
  const total = quizQuestions.length;
  const isThemeWeak = quizCat===THEME_WEAK_KEY;

  let bestLineHtml = "";
  if(!isThemeWeak){
    const best = progress.quizScores[quizCat] || 0;
    if(quizScore > best){
      progress.quizScores[quizCat] = quizScore;
      saveProgress(progress);
    }
    const scopeLabel = quizCat===WEAK_KEY ? "sur cette sélection de points faibles" : "dans ce thème";
    bestLineHtml = `<p>Meilleur score ${scopeLabel} : ${Math.max(quizScore,best)} / ${total}</p>`;
  }
  renderLucyMiniProgress();

  const nbWrong = quizSessionWrong.length;
  let weakBtnHtml = "";
  if(nbWrong>0){
    weakBtnHtml += `<button class="action ghost" id="quiz-weak-theme-btn" style="margin-top:.6rem;margin-left:.5rem;"> Travailler ${nbWrong===1 ? "le mot raté" : "les "+nbWrong+" mots ratés"}${isThemeWeak ? "" : " de ce thème"}</button>`;
  }
  if(isThemeWeak){
    weakBtnHtml += `<button class="action ghost" id="quiz-weak-theme-again-btn" style="margin-top:.6rem;margin-left:.5rem;"> Retenter tous ces mots</button>`;
  }

  quizBox.innerHTML = `
    <div class="quiz-result">
      <div class="score">${quizScore} / ${total}</div>
      ${isThemeWeak ? '<p>Série ciblée sur tes erreurs de ce thème.</p>' : bestLineHtml}
      <button class="action primary" id="quiz-restart">Recommencer</button>
      ${weakBtnHtml}
    </div>
  `;
  document.getElementById("quiz-restart").addEventListener("click", ()=>{
    if(isThemeWeak){ startThemeWeakQuiz(lastThemeWeakItems); }
    else { startQuiz(); }
  });
  const weakBtn = document.getElementById("quiz-weak-theme-btn");
  if(weakBtn){
    weakBtn.addEventListener("click", ()=> startThemeWeakQuiz(quizSessionWrong));
  }
  const weakAgainBtn = document.getElementById("quiz-weak-theme-again-btn");
  if(weakAgainBtn){
    weakAgainBtn.addEventListener("click", ()=> startThemeWeakQuiz(lastThemeWeakItems));
  }
}

renderQuizCountChips();
renderQuizChips();
startQuiz();

/* ---------------- LUCY MINI REVIEW (flashcards / quiz / progress) ---------------- */
function switchNavTo(target){
  const btn = document.querySelector(`#nav button[data-target="${target}"]`);
  if(btn) btn.click();
}

function renderLucyMiniProgress(){
  const items = getWordItems("lucy");
  const total = items.length;
  const knownCount = items.filter((_, i)=>progress.known[knownKey("lucy", i)]).length;
  const pct = total ? Math.round((knownCount/total)*100) : 0;
  const quizTotal = Math.min(10, total);
  const quizBest = progress.quizScores["lucy"] || 0;
  document.getElementById("lucy-progress-label").textContent =
    `Flashcards maîtrisées : ${knownCount}/${total} — Meilleur score au quiz : ${quizBest}/${quizTotal}`;
  document.getElementById("lucy-progress-bar").style.width = pct + "%";
}

document.getElementById("lucy-go-flashcards").addEventListener("click", ()=>{
  fcCat = "lucy";
  fcReset();
  renderFcChips();
  renderFlashcard();
  switchNavTo("flashcards");
});

document.getElementById("lucy-go-quiz").addEventListener("click", ()=>{
  quizCat = "lucy";
  renderQuizChips();
  startQuiz();
  switchNavTo("quiz");
});

renderLucyMiniProgress();

/* ---------------- PROGRESS PAGE ---------------- */
function renderProgressPage(){
  const fcHost = document.getElementById("progress-flashcards");
  fcHost.innerHTML = "";
  Object.entries(VOCAB).forEach(([key, cat])=>{
    const items = getWordItems(key);
    const total = items.length;
    const knownCount = items.filter((_,i)=>progress.known[knownKey(key,i)]).length;
    const pct = total ? Math.round((knownCount/total)*100) : 0;
    const row = document.createElement("div");
    row.className = "prog-row";
    row.innerHTML = `
      <div class="lbl">${cat.label}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
      <div class="num">${knownCount}/${total}</div>
    `;
    fcHost.appendChild(row);
  });

  const quizHost = document.getElementById("progress-quiz");
  quizHost.innerHTML = "";
  Object.entries(VOCAB).forEach(([key, cat])=>{
    const total = Math.min(10, getWordItems(key).length);
    const score = progress.quizScores[key] || 0;
    const pct = total ? Math.round((score/total)*100) : 0;
    const row = document.createElement("div");
    row.className = "prog-row";
    row.innerHTML = `
      <div class="lbl">${cat.label}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%; background:var(--gold);"></div></div>
      <div class="num">${score}/${total}</div>
    `;
    quizHost.appendChild(row);
  });
}

document.getElementById("reset-all").addEventListener("click", ()=>{
  if(confirm("Réinitialiser toute la progression ?")){
    progress = {known:{}, quizScores:{}};
    saveProgress(progress);
    renderProgressPage();
    fcReset();
    renderFlashcard();
  }
});


/* ================= CULTURE : HISTOIRE / FÊTES / FIERTÉS ================= */

const CULTURE = {
  hist: { label:"Histoire", items:[
    {q:"En quelle année l'État bulgare danubien est-il reconnu par Byzance ?", a:"681", n:"Après les combats de 680-681 menés par Asparoukh."},
    {q:"Quel khan fonde l'État bulgare danubien ?", a:"Khan Asparoukh", n:"Аспарух, chef proto-bulgare venu des steppes."},
    {q:"Quelle est la première capitale de l'État bulgare ?", a:"Pliska", n:"Capitale du Premier Empire avant Preslav."},
    {q:"Quelle bataille est la victoire fondatrice d'Asparoukh ?", a:"Ongal (680-681)", n:"Victoire contre l'armée byzantine."},
    {q:"Quel khan participe à la défense de Constantinople en 717-718 ?", a:"Khan Tervel", n:"Les forces bulgares aident à repousser les Omeyyades."},
    {q:"Quel khan écrase l'armée de Nicéphore Ier en 811 ?", a:"Khan Krum", n:"Campagne de Pliska : défaite catastrophique pour Byzance."},
    {q:"Quelles sont les dates du règne de Khan Krum ?", a:"803-814", n:"Grand souverain guerrier et législateur."},
    {q:"Quel souverain christianise officiellement la Bulgarie au IXe siècle ?", a:"Boris Ier", n:"Boris-Mikhaïl accueille ensuite les disciples de Cyrille et Méthode."},
    {q:"Quel tsar règne de 893 à 927 ?", a:"Siméon Ier le Grand", n:"Apogée politique, militaire et culturelle du Premier Empire."},
    {q:"Quelle ville devient le grand centre littéraire de l'Âge d'or ?", a:"Preslav", n:"Immense centre de la culture écrite slave."},
    {q:"Quelle grande victoire Siméon remporte-t-il en 917 ?", a:"Acheloos (917)", n:"Victoire majeure contre l'armée byzantine."},
    {q:"Quel tsar mène la résistance contre Byzance à la fin du Xe siècle ?", a:"Tsar Samuel", n:"Samuil, figure centrale de la résistance."},
    {q:"Quelle victoire bulgare a lieu en 986 ?", a:"Porte de Trajan (986)", n:"Victoire de Samuel contre les Byzantins."},
    {q:"Quelle défaite marque la mémoire bulgare en 1014 ?", a:"Kleidion (1014)", n:"Défaite face à Byzance, grand traumatisme historique."},
    {q:"En quelle année Byzance achève-t-elle la conquête de la Bulgarie ?", a:"1018", n:"Fin du Premier Empire bulgare."},
    {q:"Qui déclenche en 1185 la révolte restaurant l'État bulgare ?", a:"Les frères Asen et Petar", n:"Début du Second Empire bulgare."},
    {q:"Quelle victoire Kaloyan remporte-t-il en 1205 ?", a:"Andrinople (1205)", n:"Victoire contre les forces de l'Empire latin."},
    {q:"Quelle victoire décisive Ivan Asen II remporte-t-il en 1230 ?", a:"Klokotnitsa (1230)", n:"La Bulgarie devient la puissance dominante des Balkans."},
    {q:"Quelle est la capitale du Second Empire bulgare ?", a:"Veliko Tarnovo", n:"Cœur politique et spirituel du royaume."},
    {q:"Quelle forteresse symbolise Veliko Tarnovo ?", a:"Tsarevets", n:"Citadelle des tsars du Second Empire."},
    {q:"Qui écrit l'« Histoire slavo-bulgare » en 1762 ?", a:"Paisius de Hilendar", n:"Паисий Хилендарски, texte fondateur de la Renaissance nationale."},
    {q:"Comment appelle-t-on la Renaissance nationale en bulgare ?", a:"Българско възраждане", n:"Langue, éducation, Église et conscience nationale."},
    {q:"Qui est surnommé « l'Apôtre de la liberté » ?", a:"Vasil Levski", n:"Organisateur du mouvement révolutionnaire clandestin."},
    {q:"Quel poète révolutionnaire meurt en 1876 à 28 ans ?", a:"Hristo Botev", n:"Poète national et combattant."},
    {q:"Quel soulèvement éclate en 1876 ?", a:"L'insurrection d'Avril", n:"Réprimée violemment, elle internationalise la question bulgare."},
    {q:"Quelle femme est la figure emblématique de l'insurrection d'Avril ?", a:"Rayna Knyaginya", n:"Symbole de la participation des femmes au mouvement national."},
    {q:"Quelle date correspond à la Libération de la Bulgarie ?", a:"3 mars 1878", n:"Traité préliminaire de San Stefano."},
    {q:"Quel traité est signé le 3 mars 1878 ?", a:"Le traité de San Stefano", n:"Traité préliminaire mettant fin à la guerre russo-turque."},
    {q:"Quelle date correspond à l'Unification ?", a:"6 septembre 1885", n:"Principauté de Bulgarie + Roumélie orientale."},
    {q:"Quelle date correspond à l'Indépendance complète ?", a:"22 septembre 1908", n:"Proclamation de l'indépendance de la Bulgarie."},
    {q:"Quel col symbolise le courage des combats de 1877 ?", a:"Shipka", n:"Symbole du sacrifice des volontaires bulgares et des forces russes."},
    {q:"Quelle date marque la fin du pouvoir de Todor Zhivkov ?", a:"10 novembre 1989", n:"Début de la transition vers le pluralisme."},
    {q:"En quelle année la Bulgarie adopte-t-elle sa nouvelle Constitution ?", a:"1991", n:"Constitution de la Bulgarie démocratique."},
    {q:"En quelle année la Bulgarie rejoint-elle l'OTAN ?", a:"2004", n:"Intégration euro-atlantique."},
    {q:"En quelle année la Bulgarie rejoint-elle l'Union européenne ?", a:"2007", n:"Adhésion à l'UE."},
  ]},

  fetes: { label:"Fêtes & calendrier", items:[
    {q:"Quelle tradition du Nouvel An se fait avec une branche de cornouiller ?", a:"Le survakane (1er janvier)", n:"La survaknitsa symbolise santé, bonheur et prospérité."},
    {q:"Quelle grande fête orthodoxe tombe le 6 janvier ?", a:"Богоявление / Йордановден (Théophanie)", n:"Une croix est jetée dans l'eau et des hommes plongent pour la récupérer."},
    {q:"Quelle fête précède le Grand Carême ?", a:"Сирни Заговезни (Dimanche du Pardon)", n:"On demande pardon, on allume des feux, on pratique le hamkanie."},
    {q:"Quelle fête populaire tombe le 1er mars ?", a:"Баба Марта (Baba Marta)", n:"Fête de l'arrivée du printemps."},
    {q:"Qu'offre-t-on pour Baba Marta ?", a:"Des martenitsi rouges et blanches", n:"Pour souhaiter santé et printemps."},
    {q:"Quelle est la plus grande fête chrétienne en Bulgarie ?", a:"Великден (Pâques orthodoxes)", n:"Œufs rouges, kozunak, veillée pascale."},
    {q:"Quel est le salut pascal traditionnel ?", a:"Христос воскресе! — Воистина воскресе!", n:"Christ est ressuscité ! — En vérité, il est ressuscité !"},
    {q:"Quel pain sucré prépare-t-on pour Pâques ?", a:"Le kozunak", n:"Brioche pascale traditionnelle."},
    {q:"Quelle fête tombe le 6 mai ?", a:"Гергьовден (Saint-Georges)", n:"Aussi Jour de la bravoure et de l'Armée bulgare."},
    {q:"À quels métiers et saisons Saint Georges est-il associé ?", a:"Les soldats, les bergers et le printemps", n:"Fête à la fois religieuse, militaire et pastorale."},
    {q:"Que célèbre-t-on le 24 mai ?", a:"Cyrille, Méthode, l'alphabet et la culture", n:"Une des fêtes culturelles les plus importantes du pays."},
    {q:"Le cyrillique a-t-il été créé directement par Cyrille et Méthode ?", a:"Non, par leurs disciples", n:"Il est associé au travail ultérieur de leurs disciples, notamment en Bulgarie."},
    {q:"Qui honore-t-on le 2 juin ?", a:"Hristo Botev et les morts pour la liberté", n:"Journée de mémoire nationale."},
    {q:"Que se passe-t-il à midi le 2 juin ?", a:"Les sirènes retentissent, minute de silence", n:"Tout le pays s'arrête pour honorer les morts."},
    {q:"Quelle fête du solstice tombe le 24 juin ?", a:"Еньовден (Saint-Jean)", n:"Soleil, herbes médicinales, rosée et cycle annuel."},
    {q:"Quelle grande fête mariale tombe le 15 août ?", a:"Успение Богородично (Dormition)", n:"Liturgies et pèlerinages."},
    {q:"Quelle fête nationale tombe le 6 septembre ?", a:"Съединение (Unification, 1885)", n:"Principauté de Bulgarie et Roumélie orientale."},
    {q:"Quelle fête nationale tombe le 22 septembre ?", a:"Ден на независимостта (1908)", n:"Proclamation de l'indépendance."},
    {q:"Quelle fête populaire tombe le 26 octobre ?", a:"Димитровден (Saint-Démètre)", n:"Fin du cycle agricole et arrivée de l'hiver."},
    {q:"Que célèbre-t-on le 1er novembre ?", a:"Ден на народните будители (Éveilleurs)", n:"Hommage aux écrivains, enseignants et révolutionnaires."},
    {q:"Quelle fête tombe le 6 décembre ?", a:"Никулден (Saint-Nicolas)", n:"Fête des familles et des pêcheurs."},
    {q:"Quel plat est traditionnel à la Saint-Nicolas ?", a:"Le poisson, surtout la carpe", n:"Plat central du repas familial."},
    {q:"Qu'a de particulier le repas du 24 décembre ?", a:"Repas maigre, nombre impair de plats", n:"Бъдни вечер, veille de Noël."},
    {q:"Quelle fête nationale tombe le 3 mars ?", a:"Libération de la Bulgarie (1878)", n:"Traité préliminaire de San Stefano ; Shipka en est le symbole militaire."},
    {q:"Le 10 novembre 1989 est-il une fête nationale officielle ?", a:"Non, une grande date de mémoire", n:"Contrairement au 3 mars, au 6 septembre et au 22 septembre."},
    {q:"Quelle fête de la vigne et du vin tombe le 1er février (ou le 14) ?", a:"Трифон Зарезан (Trifon Zarezan)", n:"On taille symboliquement les ceps et l'on célèbre le vin."},
    {q:"Qui honore-t-on le 19 février ?", a:"Vassil Levski", n:"Héros révolutionnaire exécuté le 19 février 1873 selon la date commémorative actuelle."},
    {q:"Quels rites ont lieu le samedi de Lazare (Лазаровден) ?", a:"Les rites des lazarki, avec les jeunes filles", n:"Le samedi précédant les Rameaux."},
    {q:"Qu'apporte-t-on à l'église le dimanche des Rameaux (Цветница) ?", a:"Des rameaux de saule", n:"Цветница est aussi une fête importante des prénoms."},
    {q:"Que sont les Кукери (Koukeri) ?", a:"Des groupes masqués, avec de grosses cloches", n:"Ils chassent les mauvais esprits et favorisent fertilité et prospérité ; janvier à mars selon les régions."},
    {q:"Quelle fête tombe le 1er mai ?", a:"Ден на труда (fête du Travail)", n:"Jour férié officiel en Bulgarie."},
    {q:"Quelle fête de l'archange tombe le 8 novembre ?", a:"Архангеловден (Saint-Michel-Archange)", n:"Associée aux traditions familiales et aux fêtes de prénom."},
    {q:"Que célèbre-t-on le 8 décembre ?", a:"Студентски празник (fête des étudiants)", n:"Fête nationale étudiante, très populaire."},
    {q:"Que croit-on de la première personne qui entre dans la maison à Игнажден (20 décembre) ?", a:"Qu'elle peut influencer la chance de la famille pour l'année", n:"Date importante du cycle de Noël."},
    {q:"Quelle fête tombe le 7 janvier ?", a:"Ивановден (Saint-Jean)", n:"Fête religieuse et fête des prénoms très répandue."},
    {q:"Quelle fête honore les sages-femmes et les grands-mères le 8 janvier ?", a:"Бабинден", n:"Tradition populaire liée à la maternité."},
    {q:"Quelle grande fête chrétienne tombe le 25 mars ?", a:"Благовещение (Annonciation)", n:"Aussi associée au retour du printemps."},
    {q:"Quelle fête tombe le 29 juin ?", a:"Петровден (Saint-Pierre et Saint-Paul)", n:"Fête religieuse et populaire, liée au calendrier agricole."},
    {q:"Quelle fête tombe le 20 juillet ?", a:"Илинден (Saint-Élie)", n:"Particulièrement importante dans certaines régions."},
    {q:"Quelle fête populaire tombe le 30 novembre ?", a:"Андреевден (Saint-André)", n:"Associée à la croissance des récoltes et à l'approche de l'hiver."},
    {q:"Quelle fête prolonge le cycle de Noël le 27 décembre ?", a:"Стефановден (Saint-Étienne)", n:"Fête religieuse."},
    {q:"Que fait-on lors du Нестинарство (Strandja) ?", a:"Une danse pieds nus sur des braises ardentes", n:"Rituel lié aux saints Constantin et Hélène, inscrit à l'UNESCO (patrimoine immatériel)."},
    {q:"Comment appelle-t-on les danseurs sur les braises ?", a:"Les nestinari", n:"Ils dansent au son de la musique traditionnelle."},
    {q:"Quelle fête des Koukeri a lieu les 13–14 janvier dans la région de Pernik ?", a:"Сурова (Surova)", n:"Les survakari défilent masqués, avec de grosses cloches, pour chasser les mauvais esprits."},
  ]},

  fierte: { label:"Fiertés ", items:[
    {q:"Quel est le grand saint national bulgare ?", a:"Saint Jean de Rila (Ivan Rilski)", n:"Patron spirituel de la Bulgarie."},
    {q:"Quel monastère est le symbole spirituel du pays ?", a:"Le monastère de Rila", n:"Le plus célèbre monument spirituel et culturel bulgare."},
    {q:"Quels autres monastères faut-il connaître ?", a:"Bachkovo et Troyan", n:"Grands monastères orthodoxes bulgares."},
    {q:"Quelle église médiévale est célèbre pour ses fresques ?", a:"L'église de Boyana", n:"Chef-d'œuvre de la peinture médiévale."},
    {q:"Quelles églises rupestres sont emblématiques ?", a:"Les églises d'Ivanovo", n:"Ensemble rupestre du nord-est du pays."},
    {q:"Quel relief rupestre est un emblème du pays ?", a:"Le Cavalier de Madara", n:"Madara Rider, sculpté dans la falaise."},
    {q:"Quelle ville-musée se trouve sur la mer Noire ?", a:"Nessebar", n:"Ville ancienne au patrimoine exceptionnel."},
    {q:"Quels sont les deux tombeaux thraces les plus célèbres ?", a:"Kazanlak et Sveshtari", n:"Joyaux de l'héritage thrace."},
    {q:"Quel est le trésor thrace le plus célèbre ?", a:"Le trésor de Panagyurishte", n:"Orfèvrerie thrace en or."},
    {q:"Quels disciples sont associés à la diffusion du cyrillique ?", a:"Clément d'Ohrid et Naum", n:"Transmetteurs de la culture littéraire slave."},
    {q:"Quels sont les deux grands centres de la littérature slave médiévale ?", a:"Preslav et Ohrid", n:"Foyers de l'Âge d'or bulgare."},
    {q:"Quel sport est le plus associé aux succès bulgares ?", a:"La lutte (борба)", n:"Discipline reine du sport bulgare."},
    {q:"Qui est le premier champion olympique bulgare (1956) ?", a:"Nikola Stanchev", n:"Champion olympique de lutte."},
    {q:"Quelle lutteuse est une grande championne bulgare ?", a:"Stanka Zlateva", n:"Figure majeure de la lutte féminine."},
    {q:"Qui détient le record du saut en hauteur (2,09 m en 1987) ?", a:"Stefka Kostadinova", n:"Record du monde légendaire."},
    {q:"Quelle athlète est célèbre au 100 m haies ?", a:"Yordanka Donkova", n:"Grande sprinteuse bulgare."},
    {q:"Comment appelle-t-on les danses en chaîne traditionnelles ?", a:"Le horo", n:"Danse collective emblématique."},
    {q:"Comment appelle-t-on les masques rituels traditionnels ?", a:"Les kukeri", n:"Rituels de protection et de fertilité."},
    {q:"Quelle région est célèbre pour ses roses ?", a:"La Vallée des Roses", n:"Production d'huile de rose réputée."},
    {q:"Quel animal est le symbole national de la Bulgarie ?", a:"Le lion", n:"Présent sur les armoiries et les monuments."},
    {q:"Quelles sont les couleurs du drapeau bulgare ?", a:"Blanc, vert, rouge", n:"Tricolore horizontal."},
    {q:"Quel idéologue révolutionnaire marque la Renaissance ?", a:"Georgi Rakovski", n:"Penseur du mouvement national."},
    {q:"Quelle figure incarne l'insurrection d'Avril avec Benkovski ?", a:"Todor Kableshkov", n:"Acteur du soulèvement de 1876."},
    {q:"Quel est le triptyque de la Bulgarie moderne ?", a:"1878 · 1885 · 1908", n:"Libération, Unification, Indépendance."},
  ]},

  cuisine: { label:"Cuisine ", items:[
    {q:"Quelle salade est le plat le plus emblématique de Bulgarie ?", a:"La Shopska salata", n:"Tomates, concombres, poivrons, oignon et sirene râpé dessus."},
    {q:"Qu'est-ce que le sirene ?", a:"Un fromage blanc bulgare", n:"Équivalent local de la feta, à base de lait de vache ou de brebis."},
    {q:"Quel feuilleté au sirene et aux œufs est le petit-déjeuner traditionnel bulgare ?", a:"La banitsa", n:"Pâte filo garnie de sirene et d'œufs battus."},
    {q:"Quelle soupe froide est le plat d'été emblématique de Bulgarie ?", a:"Le tarator", n:"Yaourt, concombre, ail, aneth et noix."},
    {q:"Quelle tartinade de poivrons et tomates se prépare en automne pour l'hiver ?", a:"La lyutenitsa", n:"Faite maison dans presque toutes les familles bulgares."},
    {q:"Quelle est l'eau-de-vie nationale bulgare ?", a:"La rakia", n:"À base de prune ou de raisin, apéritif traditionnel."},
    {q:"Quel duo de viande hachée grillée est le plus commandé au restaurant ?", a:"Le kebapche et le kyufte", n:"Rouleau et boulette de viande épicée grillée au charbon."},
    {q:"Quel saucisson sec plat est une spécialité de Panagyurishte et Troyan ?", a:"La lukanka", n:"Saucisson pressé et épicé."},
    {q:"Quelle viande séchée est une très ancienne technique de conservation bulgare ?", a:"La pastarma", n:"Viande de bœuf (parfois porc), séchée et épicée."},
    {q:"Quelle galette de pommes de terre est une spécialité des Rhodopes ?", a:"Le patatnik", n:"Plat paysan traditionnel de la montagne des Rhodopes."},
    {q:"Quelle soupe de tripes très relevée est réputée pour « réveiller » ?", a:"La shkembe chorba", n:"Ail, vinaigre et piment."},
    {q:"Quel ragoût mijoté se cuisine dans un petit plat en terre cuite appelé gyuvече ?", a:"La kavarma", n:"Viande et légumes mijotés lentement."},
    {q:"En quoi la moussaka bulgare diffère-t-elle de la moussaka grecque ?", a:"Elle est nappée d'une sauce yaourt-œuf", n:"Pommes de terre et viande hachée en couches."},
    {q:"Quel gâteau aux noix et au chocolat est né à Ruse ?", a:"La torta Garash", n:"L'un des gâteaux les plus emblématiques du pays."},
    {q:"Quel beignet frit est un petit-déjeuner populaire du week-end ?", a:"La mekitsa", n:"Servie avec confiture, sirene ou miel."},
    {q:"Quelle brioche tressée est la star de la table de Pâques ?", a:"Le kozunak", n:"Brioche pascale sucrée traditionnelle."},
    {q:"Comment appelle-t-on les légumes marinés conservés en bocaux pour l'hiver ?", a:"La tourchia", n:"Chou, poivrons, carottes lacto-fermentés ou marinés."},
    {q:"Quel plat rapide se compose d'œufs brouillés, tomates, poivrons et sirene ?", a:"Le mish-mash", n:"Plat maison très populaire."},
    {q:"Quel fromage jaune se distingue du sirene et se sert souvent pané ?", a:"Le kashkaval", n:"Fromage jaune traditionnel bulgare."},
    {q:"Quel fromage frais bulgare est proche de la ricotta/cottage cheese ?", a:"L'izvara", n:"Fromage frais léger."},
    {q:"Quelle boisson au yaourt dilué avec eau et sel est omniprésente en été ?", a:"L'ayran", n:"Boisson rafraîchissante à base de kiselo mlyako."},
    {q:"Quelle boisson fermentée à base de céréales, peu alcoolisée, est emblématique des Balkans ?", a:"La boza", n:"Boisson épaisse et céréalière typiquement bulgare."},
    {q:"Quel pain rond et festif est important dans les traditions familiales et religieuses ?", a:"La pitka", n:"Pain traditionnel des grandes occasions."},
    {q:"Quel pain/feuilleté levé au fromage est proche de la banitsa ?", a:"Le tutmanik", n:"Pain fourré au fromage."},
    {q:"Comment appelle-t-on les crêpes traditionnelles bulgares ?", a:"Les katmi", n:"Sorte de pancakes traditionnels."},
    {q:"Quelle soupe de haricots est un plat quotidien extrêmement traditionnel ?", a:"La bob chorba", n:"Soupe paysanne de tous les jours."},
    {q:"Quel saucisson sec fermenté est très important dans la charcuterie bulgare ?", a:"Le sudzhuk", n:"Saucisson sec traditionnel."},
    {q:"Quel jambon de porc séché est une spécialité de la région d'Elena ?", a:"L'elenski but", n:"Charcuterie régionale réputée."},
    {q:"Quel plat emblématique de la région de Bansko mijote plusieurs viandes avec du chou ?", a:"La kapama", n:"Plat régional longuement mijoté."},
    {q:"Comment appelle-t-on les viandes et légumes cuits sur une plaque en métal ou en terre cuite ?", a:"Le sach", n:"Servi brûlant, à même le plat de cuisson."},
    {q:"Quel plat rituel d'abats et de riz d'agneau se prépare traditionnellement à Pâques ?", a:"Le drob sarma", n:"Plat pascal traditionnel."},
    {q:"Quelle pâtisserie frite est imbibée de sirop après la friture ?", a:"Les tulumbi", n:"Douceur frite et sirupeuse."},
    {q:"Quel dessert ottoman à base de pâte très fine et de sirop est partagé dans les Balkans ?", a:"Le kadaif", n:"Héritage culinaire ottoman."},
    {q:"Quelle compote de fruits secs cuits est traditionnelle à Noël ?", a:"L'oshav", n:"Dessert/accompagnement des fêtes de fin d'année."},
    {q:"Quels sont les principaux cépages rouges bulgares ?", a:"Mavrud, Melnik, Rubin, Gamza", n:"Cépages locaux pour les vins rouges."},
    {q:"Quels sont les principaux cépages blancs bulgares ?", a:"Dimyat et Misket", n:"Cépages locaux pour les vins blancs."},
    {q:"Quel spiritueux anisé bulgare est souvent associé à la shopska ou au melon ?", a:"La mastika", n:"Souvent accompagnée de menta (liqueur de menthe)."},
    {q:"Quel plat d'agneau rôti est central pour la fête de la Saint-Georges ?", a:"L'agneshko pecheno", n:"Гергьовден, jour de la bravoure et de l'agneau rôti."},
    {q:"Quelle soupe de lentilles est un grand classique domestique bulgare ?", a:"La leshta chorba", n:"Aux côtés de la bob chorba (haricots)."},
    {q:"Comment appelle-t-on les feuilles de chou farcies de riz et de viande ?", a:"Les zelevi sarmi", n:"Particulièrement importantes en hiver et aux fêtes."},
    {q:"Quelle tartinade d'aubergines et de poivrons grillés à l'ail est très classique ?", a:"Le kyopoolu", n:"Servi en entrée avec de l'huile."},
    {q:"Comment appelle-t-on les poivrons simplement grillés, servis à l'ail et au vinaigre ?", a:"Pecheni chushki", n:"Préparation de légumes très répandue."},
    {q:"Quel plat d'aubergines farcies et mijotées est un héritage ottoman partagé dans les Balkans ?", a:"L'imambayaldu", n:"Aubergines farcies, tradition ottomane."},
    {q:"Quel plat mijote des haricots avec de la saucisse ?", a:"Le bob s nadenitsa", n:"Plat familial très populaire."},
    {q:"Quel plat d'œufs pochés sur yaourt à l'ail, beurre chaud et paprika est très représentatif ?", a:"Les yaytsa po panagyurski", n:"Spécialité de Panagyurishte."},
    {q:"Quel repas du réveillon de Noël compte traditionnellement un nombre impair de plats maigres ?", a:"Le Budni vecher", n:"Haricots, sarmi, poivrons farcis, noix, fruits secs..."},
    {q:"Que trouve-t-on cachés dans la banitsa du Nouvel An ?", a:"Des kasmeti (късмети)", n:"Petits messages/prophéties glissés dans la pâte."},
    {q:"Quelle fête traditionnelle est liée à la taille de la vigne et au vin ?", a:"Trifon Zarezan", n:"Fête viticole bulgare."},
    {q:"Quelle galette de pommes de terre et quel pain fourré sont typiques des Rhodopes ?", a:"Le patatnik et le klin", n:"Spécialités paysannes des Rhodopes."},
    {q:"Quel plat rôti à la broche est une spécialité des Rhodopes ?", a:"Le cheverme", n:"Agneau ou cochon de lait rôti à la broche."},
    {q:"Quelle ville est réputée pour la torta Garash ?", a:"Ruse", n:"Ville d'origine de ce célèbre gâteau."},
  ]},

  monuments: { label:"Monuments ", items:[
    {q:"Quelle est la plus grande cathédrale orthodoxe des Balkans ?", a:"La cathédrale Alexandre-Nevski (Sofia)", n:"Construite en hommage aux soldats russes de la Libération."},
    {q:"Quel est le plus grand et le plus célèbre monastère orthodoxe bulgare ?", a:"Le monastère de Rila", n:"Fondé par Saint Jean de Rila, classé à l'UNESCO."},
    {q:"Quelle forteresse fut le siège du pouvoir du Second Empire bulgare ?", a:"Tsarevets (Veliko Tarnovo)", n:"Citadelle royale et patriarcale."},
    {q:"Quel bas-relief rupestre du haut Moyen Âge est classé à l'UNESCO ?", a:"Le Cavalier de Madara", n:"Sculpté à même une falaise."},
    {q:"Quel monument commémore la guerre de libération de 1877-1878 au col de Shipka ?", a:"Le Monument de la Liberté (Shipka)", n:"Accompagné de la Shipka Memorial Church."},
    {q:"Quel monument communiste en forme de soucoupe domine le pic de Buzludzha ?", a:"Le Monument de Buzludzha (1974-1981)", n:"Abandonné depuis les années 1990."},
    {q:"Quelle petite église est célèbre pour ses fresques médiévales du XIIIe siècle ?", a:"L'église de Boyana (Sofia)", n:"Classée à l'UNESCO."},
    {q:"Quelle vieille ville sur une presqu'île de la mer Noire est classée à l'UNESCO ?", a:"Nessebar", n:"Occupée depuis 3000 ans, nombreuses églises médiévales."},
    {q:"Quel tombeau thrace du IVe siècle av. J.-C. est célèbre pour ses fresques ?", a:"Le tombeau thrace de Kazanlak", n:"Avec celui de Sveshtari, classé à l'UNESCO."},
    {q:"Quelle statue de 11 m domine Plovdiv depuis la colline de Bounardjik ?", a:"Le monument Alyosha", n:"Soldat soviétique de la Seconde Guerre mondiale."},
    {q:"Où se trouve le monument marquant le lieu d'exécution de Vasil Levski ?", a:"En plein centre de Sofia (1873)", n:"L'un des lieux de mémoire les plus visités du pays."},
    {q:"Quel ensemble d'églises rupestres du XIVe siècle est classé à l'UNESCO près de Roussé ?", a:"Les églises rupestres d'Ivanovo", n:"Creusées dans les falaises de la vallée du Roussenski Lom."},
    {q:"Quel tombeau thrace du IIIe siècle av. J.-C. est célèbre pour ses cariatides sculptées ?", a:"Le tombeau de Sveshtari", n:"Classé à l'UNESCO depuis 1985."},
    {q:"Quel grand complexe archéologique rupestre se trouve dans les Rhodopes orientales ?", a:"Perperikon", n:"Site thrace majeur."},
    {q:"Quels monuments antiques se trouvent au cœur de la ville actuelle de Plovdiv ?", a:"Le théâtre romain et le stade romain", n:"Vestiges de la Plovdiv antique."},
    {q:"Quelle grande cité romaine fut fondée sous l'empereur Trajan en Bulgarie ?", a:"Nicopolis ad Istrum", n:"Cité romaine antique."},
    {q:"Quel complexe antique romain se trouve sous le centre-ville de Sofia ?", a:"Serdica", n:"Vestiges romains mis au jour à Sofia."},
    {q:"Quelles sont la première et la deuxième capitales du Premier Empire bulgare ?", a:"Pliska puis Preslav", n:"Centres du pouvoir et de l'Âge d'or médiéval."},
    {q:"Quel monastère, avec Rila et Troyan, compte parmi les trois plus importants du pays ?", a:"Le monastère de Bachkovo", n:"Grand monastère historique bulgare."},
    {q:"Quelle église médiévale de Veliko Tarnovo est liée au couronnement des tsars du Second Empire ?", a:"L'église des Quarante-Martyrs", n:"Église commémorative majeure."},
    {q:"Quelle église a donné son nom à la capitale bulgare ?", a:"L'église Sainte-Sophie (Sofia)", n:"L'une des plus anciennes églises de la ville."},
    {q:"Quelle est la forteresse la mieux conservée de Bulgarie, à Vidin ?", a:"Baba Vida", n:"Forteresse médiévale sur le Danube."},
    {q:"Quelle forteresse se trouve sur la côte de la mer Noire, près de Kavarna ?", a:"Kaliakra", n:"Cap et forteresse emblématiques du littoral."},
    {q:"Quelle ville-musée réunit des centaines de monuments de la Renaissance bulgare ?", a:"Koprivshtitsa", n:"Haut lieu de l'architecture du Възраждане."},
    {q:"Quel village est célèbre pour ses maisons de marchands et sa sculpture sur bois ?", a:"Tryavna", n:"Artisanat traditionnel de la Renaissance bulgare."},
    {q:"Quel village près de Veliko Tarnovo est connu pour ses grandes maisons fortifiées ?", a:"Arbanasi", n:"Village historique de la Renaissance bulgare."},
    {q:"Quelle ville est célèbre pour ses maisons historiques et ses pyramides de grès ?", a:"Melnik", n:"Paysage naturel et architecture traditionnelle réunis."},
    {q:"Quel grand palais culturel du XXe siècle se trouve à Sofia ?", a:"Le NDK (Palais national de la culture)", n:"Exemple majeur d'architecture de fin de période socialiste."},
    {q:"Combien de monuments et positions historiques compte le complexe national de Shipka ?", a:"26", n:"Le Monument de la Liberté en est l'élément principal."},
  ]},

  nosiya: { label:"Носии régionales ", items:[
    {q:"Combien de grandes aires folkloriques (носии) compte la Bulgarie ?", a:"7", n:"Добруджанска, Шопска, Тракийска, Родопска, Пиринска, Странджанска, Северняшка."},
    {q:"Quelle région porte la носия rouge très brodée avec une кърпа jaune à franges de soie ?", a:"La Dobroudja (Добруджанска носия)", n:"Sukman rouge brodé, tablier noir, foulard jaune."},
    {q:"Dans quelle région les hommes portent-ils une кърпа blanche à la place du calpak ?", a:"En Dobroudja", n:"Particularité régionale unique du costume masculin."},
    {q:"Quelle носия féminine est du type « сукман » avec une ceinture à grandes boucles (пафти) ?", a:"La Шопска носия (région de Sofia)", n:"Costume de la région du Choplouk."},
    {q:"Comment appelle-t-on le costume masculin « habits blancs » du Choplouk ?", a:"Белодрешна носия", n:"Par opposition aux costumes « noirs » du reste du pays."},
    {q:"Quelle région a un costume masculin « чернодрешен » (habits noirs) avec elek rouge ou vert ?", a:"La Thrace (Тракийска носия)", n:"Potours noirs à galons, elek brodé, chemise blanche."},
    {q:"Quelle носия féminine peut indiquer le statut marital d'une femme selon ses broderies ?", a:"La носия thrace", n:"Jeune fille, fiancée, mariée ou mère se distinguent par l'ornementation."},
    {q:"Quelle région montagnarde du sud a une носия adaptée au climat, avec un elek foncé richement orné ?", a:"Les Rhodopes (Родопска носия)", n:"Chemise sobre, elek très décoré pour le froid."},
    {q:"Quelle région porte une носия proche du style chopsko, avec kochoulya et saya ?", a:"Le Pirin / région macédonienne (Пиринска носия)", n:"Chants héroïques (юнашки песни) similaires au folklore chopsko."},
    {q:"Quelle région est associée au rite du feu Nestinarstvo et à une носия aux couleurs sombres ?", a:"La Strandja (Странджанска носия)", n:"Danse rituelle sur les braises."},
    {q:"Quelle носия du nord se distingue par sa sobriété, avec deux tabliers portés sur la chemise ?", a:"La носия du Nord (Северняшка носия)", n:"Peu de superpositions, esthétique discrète."},
  ]},
};

/* ---- storage helpers (partagés avec le reste de la page) ---- */
function cuKnownStore(){
  if(!progress.cultureKnown) progress.cultureKnown = {};
  return progress.cultureKnown;
}
function cuQuizStore(){
  if(!progress.cultureQuiz) progress.cultureQuiz = {};
  return progress.cultureQuiz;
}
function cuKey(cat, idx){ return cat + "#" + idx; }

/* ---- state ---- */
const cuChipsEl = document.getElementById("cu-chips");
const cuCardsWrap = document.getElementById("cu-cards-wrap");
const cuQuizBox = document.getElementById("cu-quiz-box");
const cuFlashcardEl = document.getElementById("cu-flashcard");
let cuCat = Object.keys(CULTURE)[0];
let cuOrder = null;      // indices des cartes du tour en cours
let cuFullOrder = null;  // ordre complet du thème (mélangé ou non)
let cuPos = 0;
let cuMissed = new Set();// cartes "Pas encore" pendant ce tour
let cuDone = false;
let cuRetry = false;
let cuFlipped = false;
let cuMode = "cards";
let cuQuestions = [];
let cuQIndex = 0;
let cuScore = 0;
let cuWrong = [];       // items ratés pendant la série en cours
let cuQRetry = false;   // série limitée aux erreurs
let cuQTimer = null;

function cuItems(){ return CULTURE[cuCat].items; }

function cuBuildOrder(shuffled){
  const n = cuItems().length;
  const base = Array.from({length:n}, (_,i)=>i);
  cuFullOrder = shuffled ? shuffle(base) : base;
  cuOrder = cuFullOrder.slice();
  cuPos = 0;
  cuMissed = new Set();
  cuDone = false;
  cuRetry = false;
}

function cuShowEnd(){
  const host = document.getElementById("cu-end");
  buildRoundEnd(host, cuMissed.size, cuFullOrder.length,
    ()=>{
      cuOrder = cuFullOrder.filter(i=>cuMissed.has(i));
      cuPos = 0; cuMissed = new Set(); cuDone = false; cuRetry = true;
      cuRenderCard();
    },
    ()=>{
      cuOrder = cuFullOrder.slice();
      cuPos = 0; cuMissed = new Set(); cuDone = false; cuRetry = false;
      cuRenderCard();
    }
  );
  cuFlashcardEl.style.display = "none";
  document.getElementById("cu-controls").style.display = "none";
  document.getElementById("cu-retry-bar").style.display = "none";
  document.getElementById("cu-shuffle-row").style.display = "none";
  host.style.display = "flex";
  document.getElementById("cu-progress").textContent = "";
}
function cuHideEnd(){
  cuFlashcardEl.style.display = "";
  document.getElementById("cu-controls").style.display = "";
  document.getElementById("cu-retry-bar").style.display = "";
  document.getElementById("cu-shuffle-row").style.display = "";
  document.getElementById("cu-end").style.display = "none";
}
function cuUpdateRetry(){
  const b = document.getElementById("cu-retry");
  const n = cuMissed.size;
  b.disabled = n === 0;
  b.textContent = ` Retravailler mes erreurs (${n})`;
}

function cuRenderChips(){
  cuChipsEl.innerHTML = "";
  Object.entries(CULTURE).forEach(([key, cat])=>{
    const chip = document.createElement("button");
    chip.className = "chip" + (key===cuCat ? " active":"");
    chip.textContent = cat.label;
    chip.addEventListener("click", ()=>{
      cuCat = key;
      cuBuildOrder(false);
      cuRenderChips();
      if(cuMode === "cards") cuRenderCard(); else cuStartQuiz();
    });
    cuChipsEl.appendChild(chip);
  });
}

cuFlashcardEl.addEventListener("click", ()=>{
  cuFlipped = !cuFlipped;
  cuFlashcardEl.classList.toggle("flipped", cuFlipped);
});

function cuRenderCard(){
  const items = cuItems();
  if(!cuFullOrder || cuFullOrder.length !== items.length) cuBuildOrder(false);
  if(cuDone){ cuShowEnd(); return; }
  cuHideEnd();
  const idx = cuOrder[cuPos];
  const it = items[idx];
  document.getElementById("cu-front-word").textContent = it.q;
  document.getElementById("cu-back-word").textContent = it.a;
  document.getElementById("cu-back-sub").textContent = it.n || "";
  cuFlipped = false;
  cuFlashcardEl.classList.remove("flipped");
  const known = cuKnownStore();
  const knownCount = items.filter((_, i)=>known[cuKey(cuCat,i)]).length;
  document.getElementById("cu-progress").textContent =
    `Carte ${cuPos+1} / ${cuOrder.length}${cuRetry ? " (révision des « Pas encore »)" : ""} — ${knownCount}/${items.length} maîtrisées dans ce thème`;
  cuUpdateRetry();
}

function cuMove(step){
  const n = cuOrder.length;
  if(step > 0 && cuPos === n-1){ cuDone = true; cuRenderCard(); return; }
  cuPos = (cuPos + step + n) % n;
  cuRenderCard();
}

document.getElementById("cu-retry").addEventListener("click", ()=>{
  if(!cuMissed.size) return;
  cuOrder = cuFullOrder.filter(i=>cuMissed.has(i));
  cuPos = 0; cuMissed = new Set(); cuDone = false; cuRetry = true;
  cuRenderCard();
});
document.getElementById("cu-next").addEventListener("click", ()=>cuMove(1));
document.getElementById("cu-prev").addEventListener("click", ()=>cuMove(-1));
document.getElementById("cu-shuffle").addEventListener("click", ()=>{
  cuBuildOrder(true);
  cuRenderCard();
});
document.getElementById("cu-know").addEventListener("click", ()=>{
  cuKnownStore()[cuKey(cuCat, cuOrder[cuPos])] = true;
  cuMissed.delete(cuOrder[cuPos]);
  saveProgress(progress);
  cuMove(1);
});
document.getElementById("cu-dontknow").addEventListener("click", ()=>{
  delete cuKnownStore()[cuKey(cuCat, cuOrder[cuPos])];
  cuMissed.add(cuOrder[cuPos]);
  saveProgress(progress);
  cuMove(1);
});

/* ---- quiz culture ---- */
function cuMakeQuestion(correct){
  const items = cuItems();
  const distractors = shuffle(items.filter(i=>i!==correct && i.a !== correct.a)).slice(0,3);
  const options = shuffle([correct, ...distractors]);
  return { item: correct, q: correct.q, correct: correct.a, note: correct.n || "", options: options.map(o=>o.a) };
}
function cuBuildQuestions(){
  const items = cuItems();
  const pool = shuffle(items).slice(0, Math.min(10, items.length));
  return pool.map(cuMakeQuestion);
}

function cuStartQuiz(){
  clearTimeout(cuQTimer);
  cuQuestions = cuBuildQuestions();
  cuQIndex = 0;
  cuScore = 0;
  cuWrong = [];
  cuQRetry = false;
  cuRenderQuestion();
}
/* Nouvelle série avec uniquement les questions ratées jusqu'ici */
function cuStartRetryQuiz(){
  if(!cuWrong.length) return;
  clearTimeout(cuQTimer);
  cuQuestions = shuffle(cuWrong).map(cuMakeQuestion);
  cuQIndex = 0;
  cuScore = 0;
  cuWrong = [];
  cuQRetry = true;
  cuRenderQuestion();
}

function cuRenderQuestion(){
  if(cuQIndex >= cuQuestions.length){ cuRenderResult(); return; }
  const q = cuQuestions[cuQIndex];
  cuQuizBox.innerHTML = `
    <div class="quiz-progress">Question ${cuQIndex+1} / ${cuQuestions.length} — ${CULTURE[cuCat].label}${cuQRetry ? " (révision des erreurs)" : ""}</div>
    <div class="quiz-question">${q.q}</div>
    <div class="quiz-options" id="cu-quiz-options"></div>
    <div class="progress-label" id="cu-quiz-note"></div>
    <div class="retry-bar"><button type="button" class="action retry-btn" id="cu-quiz-retry-now"></button></div>
  `;
  const cuRetryNow = document.getElementById("cu-quiz-retry-now");
  const cuUpdRetryNow = ()=>{
    cuRetryNow.disabled = cuWrong.length === 0;
    cuRetryNow.textContent = ` Retravailler mes erreurs (${cuWrong.length})`;
  };
  cuUpdRetryNow();
  cuRetryNow.addEventListener("click", cuStartRetryQuiz);
  const optionsEl = document.getElementById("cu-quiz-options");
  q.options.forEach(opt=>{
    const b = document.createElement("button");
    b.className = "opt-btn";
    b.textContent = opt;
    b.addEventListener("click", ()=>{
      const buttons = optionsEl.querySelectorAll(".opt-btn");
      buttons.forEach(bb=>bb.disabled = true);
      if(opt === q.correct){
        b.classList.add("correct");
        cuScore++;
      } else {
        b.classList.add("incorrect");
        buttons.forEach(bb=>{ if(bb.textContent===q.correct) bb.classList.add("correct"); });
        if(!cuWrong.includes(q.item)) cuWrong.push(q.item);
        cuUpdRetryNow();
      }
      if(q.note) document.getElementById("cu-quiz-note").textContent = " " + q.note;
      cuQTimer = setTimeout(()=>{ cuQIndex++; cuRenderQuestion(); }, q.note ? 1600 : 800);
    });
    optionsEl.appendChild(b);
  });
}

function cuRenderResult(){
  const total = cuQuestions.length;
  const store = cuQuizStore();
  const best = store[cuCat] || 0;
  if(!cuQRetry && cuScore > best){ store[cuCat] = cuScore; saveProgress(progress); }
  cuQuizBox.innerHTML = `
    <div class="quiz-result">
      <div class="score">${cuScore} / ${total}</div>
      ${cuQRetry ? "<p>Série ciblée sur tes erreurs.</p>" : `<p>Meilleur score dans ce thème : ${Math.max(cuScore,best)} / ${total}</p>`}
      ${cuWrong.length ? `<button class="action retry-btn" id="cu-quiz-retry-end" style="margin-right:.5rem;"> Retravailler mes erreurs (${cuWrong.length})</button>` : ""}
      <button class="action primary" id="cu-quiz-restart">Recommencer ce thème</button>
    </div>
  `;
  document.getElementById("cu-quiz-restart").addEventListener("click", cuStartQuiz);
  const cuRetryEnd = document.getElementById("cu-quiz-retry-end");
  if(cuRetryEnd) cuRetryEnd.addEventListener("click", cuStartRetryQuiz);
}

/* ---- modes ---- */
function cuSetMode(mode){
  cuMode = mode;
  const cardsBtn = document.getElementById("cu-mode-cards");
  const quizBtn = document.getElementById("cu-mode-quiz");
  const isCards = mode === "cards";
  cardsBtn.className = "action " + (isCards ? "primary" : "ghost");
  quizBtn.className = "action " + (isCards ? "ghost" : "primary");
  cuCardsWrap.style.display = isCards ? "flex" : "none";
  cuQuizBox.style.display = isCards ? "none" : "block";
  if(isCards) cuRenderCard(); else cuStartQuiz();
}
document.getElementById("cu-mode-cards").addEventListener("click", ()=>cuSetMode("cards"));
document.getElementById("cu-mode-quiz").addEventListener("click", ()=>cuSetMode("quiz"));

/* ---- raccourcis depuis Histoire / Fêtes / Fiertés ---- */
document.querySelectorAll(".cu-jump").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    cuCat = btn.dataset.cat;
    cuBuildOrder(false);
    cuRenderChips();
    cuSetMode(btn.dataset.mode);
    switchNavTo("culture");
  });
});

cuRenderChips();
cuBuildOrder(false);
cuSetMode("cards");

/* ---- progression culture ---- */
function renderCultureProgress(){
  const host = document.getElementById("progress-culture");
  if(!host) return;
  host.innerHTML = "";
  const known = cuKnownStore();
  const quiz = cuQuizStore();
  Object.entries(CULTURE).forEach(([key, cat])=>{
    const total = cat.items.length;
    const knownCount = cat.items.filter((_,i)=>known[cuKey(key,i)]).length;
    const pct = total ? Math.round((knownCount/total)*100) : 0;
    const qTotal = Math.min(10, total);
    const qScore = quiz[key] || 0;
    const qPct = qTotal ? Math.round((qScore/qTotal)*100) : 0;
    const row = document.createElement("div");
    row.className = "prog-row";
    row.innerHTML = `
      <div class="lbl">${cat.label}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
      <div class="num">${knownCount}/${total}</div>
    `;
    host.appendChild(row);
    const row2 = document.createElement("div");
    row2.className = "prog-row";
    row2.innerHTML = `
      <div class="lbl">${cat.label} — quiz</div>
      <div class="bar-track"><div class="bar-fill" style="width:${qPct}%; background:var(--gold);"></div></div>
      <div class="num">${qScore}/${qTotal}</div>
    `;
    host.appendChild(row2);
  });
}

document.getElementById("reset-all").addEventListener("click", ()=>{
  setTimeout(()=>{ renderCultureProgress(); cuRenderCard(); }, 0);
});


/* ---------------- THÈME SOMBRE ---------------- */
(function(){
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  function apply(t){
    root.setAttribute('data-theme', t);
    btn.setAttribute('aria-label', t === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre');
    btn.title = t === 'dark' ? 'Thème clair' : 'Thème sombre';
  }
  apply(root.getAttribute('data-theme') || 'light');
  btn.addEventListener('click', function(){
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
    try{ localStorage.setItem('bg_theme', next); }catch(e){}
  });
})();

/* ---------------- PRONONCIATION : lecture audio ---------------- */
(function(){
  const synth = window.speechSynthesis;
  let bgVoice = null;
  function pickVoice(){
    if(!synth) return;
    bgVoice = synth.getVoices().find(x=>/^bg/i.test(x.lang)) || null;
  }
  if(synth){ pickVoice(); synth.onvoiceschanged = pickVoice; }
  const sec = document.getElementById("sec-pronunciation");
  if(!sec) return;

  let toast = document.createElement("div");
  toast.style.cssText = "position:fixed;left:50%;bottom:20px;transform:translateX(-50%);background:#232B3D;color:#fff;padding:.6rem 1rem;border-radius:8px;font-size:.9rem;z-index:9999;display:none;max-width:90%;text-align:center";
  document.body.appendChild(toast);
  let toastT;
  function say(msg){ toast.textContent = msg; toast.style.display="block"; clearTimeout(toastT); toastT=setTimeout(()=>toast.style.display="none",4000); }

  let audio = null;
  function playOnline(text, el){
    // Repli : voix bulgare en ligne (nécessite une connexion internet)
    if(audio){ audio.pause(); }
    audio = new Audio("https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=bg&q=" + encodeURIComponent(text));
    el.classList.add("playing");
    audio.onended = ()=>el.classList.remove("playing");
    audio.onerror = ()=>{ el.classList.remove("playing"); say("Audio indisponible : installe une voix bulgare dans ton système ou vérifie ta connexion."); };
    audio.play().catch(()=>{ el.classList.remove("playing"); say("Audio bloqué ou indisponible (connexion ?)."); });
  }

  function speak(el){
    const text = el.dataset.say;
    if(!text) return;
    if(!bgVoice) pickVoice();
    if(synth && bgVoice){
      synth.cancel();
      setTimeout(()=>{
        const u = new SpeechSynthesisUtterance(text);
        u.lang = bgVoice.lang; u.voice = bgVoice; u.rate = 0.8;
        u.onstart = ()=>el.classList.add("playing");
        u.onend = u.onerror = ()=>el.classList.remove("playing");
        synth.speak(u);
      }, 60);
    } else {
      playOnline(text, el);
    }
  }
  sec.addEventListener("click", e=>{
    const el = e.target.closest(".say");
    if(el) speak(el);
  });
  sec.addEventListener("keydown", e=>{
    if((e.key==="Enter"||e.key===" ") && e.target.classList.contains("say")){ e.preventDefault(); speak(e.target); }
  });
  sec.querySelectorAll(".say").forEach(el=>{
    el.setAttribute("role","button"); el.setAttribute("tabindex","0");
    el.setAttribute("aria-label","Écouter : "+(el.dataset.say||""));
  });
})();

/* ---------------- FLASHCARDS : bouton « écouter la prononciation » ---------------- */
(function(){
  const btn = document.getElementById("fc-say");
  const wordEl = document.getElementById("fc-back-word");
  if(!btn || !wordEl) return;
  const synth = window.speechSynthesis;
  let bgVoice = null;
  function pickVoice(){
    if(!synth) return;
    bgVoice = synth.getVoices().find(x=>/^bg/i.test(x.lang)) || null;
  }
  if(synth){ pickVoice(); synth.addEventListener("voiceschanged", pickVoice); }

  const toast = document.createElement("div");
  toast.style.cssText = "position:fixed;left:50%;bottom:20px;transform:translateX(-50%);background:#232B3D;color:#fff;padding:.6rem 1rem;border-radius:8px;font-size:.9rem;z-index:9999;display:none;max-width:90%;text-align:center";
  document.body.appendChild(toast);
  let toastT;
  function say(msg){ toast.textContent = msg; toast.style.display = "block"; clearTimeout(toastT); toastT = setTimeout(()=>toast.style.display = "none", 4000); }

  /* Texte à lire : mot bulgare sans accents toniques, variantes « / » séparées par une pause */
  function textToSpeak(){
    return (wordEl.textContent || "")
      .replace(/[\u0300\u0301]/g, "")
      .replace(/\s*\/\s*/g, ", ")
      .trim();
  }

  let audio = null;
  function playOnline(text){
    if(audio) audio.pause();
    audio = new Audio("https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=bg&q=" + encodeURIComponent(text));
    btn.classList.add("playing");
    audio.onended = ()=>btn.classList.remove("playing");
    audio.onerror = ()=>{ btn.classList.remove("playing"); say("Audio indisponible : installe une voix bulgare dans ton système ou vérifie ta connexion."); };
    audio.play().catch(()=>{ btn.classList.remove("playing"); say("Audio bloqué ou indisponible (connexion ?)."); });
  }

  function speak(){
    const text = textToSpeak();
    if(!text || text === "—") return;
    if(!bgVoice) pickVoice();
    if(synth && bgVoice){
      synth.cancel();
      setTimeout(()=>{
        const u = new SpeechSynthesisUtterance(text);
        u.lang = bgVoice.lang; u.voice = bgVoice; u.rate = 0.8;
        u.onstart = ()=>btn.classList.add("playing");
        u.onend = u.onerror = ()=>btn.classList.remove("playing");
        synth.speak(u);
      }, 60);
    } else {
      playOnline(text);
    }
  }

  /* stopPropagation : cliquer sur  ne doit pas retourner la carte */
  btn.addEventListener("click", e=>{ e.stopPropagation(); speak(); });
  btn.addEventListener("keydown", e=>e.stopPropagation());
})();
/* ---------------- NOTRE PÈRE : bouton « écouter la prononciation » ---------------- */
(function(){
  const btn = document.getElementById("np-say");
  const box = document.getElementById("np-text");
  if(!btn || !box) return;
  const synth = window.speechSynthesis;
  let bgVoice = null;
  function pickVoice(){ if(synth) bgVoice = synth.getVoices().find(x=>/^bg/i.test(x.lang)) || null; }
  if(synth){ pickVoice(); synth.addEventListener("voiceschanged", pickVoice); }
  const text = ()=>Array.from(box.childNodes).filter(n=>n.nodeType===3).map(n=>n.textContent).join(" ").replace(/\s+/g," ").trim();
  let audio = null;
  function playOnline(t){
    /* l'API en ligne limite la longueur : lecture par phrases */
    const parts = t.match(/[^.;!]+[.;!]?/g).map(x=>x.trim()).filter(Boolean);
    let i = 0;
    btn.classList.add("playing");
    const next = ()=>{
      if(i >= parts.length){ btn.classList.remove("playing"); return; }
      audio = new Audio("https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=bg&q=" + encodeURIComponent(parts[i++]));
      audio.onended = next;
      audio.onerror = ()=>btn.classList.remove("playing");
      audio.play().catch(()=>btn.classList.remove("playing"));
    };
    next();
  }
  btn.addEventListener("click", ()=>{
    if(audio) audio.pause();
    const t = text();
    if(!t) return;
    if(!bgVoice) pickVoice();
    if(synth && bgVoice){
      synth.cancel();
      setTimeout(()=>{
        const u = new SpeechSynthesisUtterance(t);
        u.lang = bgVoice.lang; u.voice = bgVoice; u.rate = 0.85;
        u.onstart = ()=>btn.classList.add("playing");
        u.onend = u.onerror = ()=>btn.classList.remove("playing");
        synth.speak(u);
      }, 60);
    } else playOnline(t);
  });
})();

/* ================= CONJUGAISON : données + fiches + entraînement ================= */
(function(){
  "use strict";

  /* ---------- Données ---------- */
  const PERS = [
    {bg:"аз", fr:"je", short:"аз"},
    {bg:"ти", fr:"tu", short:"ти"},
    {bg:"той / тя / то", fr:"il / elle", short:"той/тя/то"},
    {bg:"ние", fr:"nous", short:"ние"},
    {bg:"вие", fr:"vous", short:"вие"},
    {bg:"те", fr:"ils / elles", short:"те"}
  ];
  const PERS_IMP = [
    {bg:"ти", fr:"tu", short:"ти"},
    {bg:"вие", fr:"vous", short:"вие"}
  ];
  const TENSES = {
    pres:{label:"Présent", low:"présent"},
    past:{label:"Passé", low:"passé"},
    fut :{label:"Futur", low:"futur"},
    imp :{label:"Impératif", low:"impératif"}
  };
  const T_ORDER = ["pres","past","fut","imp"];
  const GROUPS = {
    e:{label:"1re conjugaison (-е)"},
    i:{label:"2e conjugaison (-и)"},
    a:{label:"3e conjugaison (-а)"},
    irr:{label:"Irréguliers"}
  };

  const VERBS = [
    {id:"sam", bg:"съм", fr:"être", grp:"irr",
      pres:["съм","си","е","сме","сте","са"],
      past:["бях","беше","беше","бяхме","бяхте","бяха"],
      fut:["ще бъда","ще бъдеш","ще бъде","ще бъдем","ще бъдете","ще бъдат"],
      imp:["бъди","бъдете"],
      pastKind:"imparfait / aoriste (formes identiques)",
      tip:"« съм » ne commence jamais une phrase (Уморен съм). Au futur, on utilise бъда."},
    {id:"imam", bg:"имам", fr:"avoir", grp:"a",
      pres:["имам","имаш","има","имаме","имате","имат"],
      past:["имах","имаше","имаше","имахме","имахте","имаха"],
      imp:["имай","имайте"],
      pastKind:"imparfait",
      tip:"Négation irrégulière : нямам, нямаш, няма, нямаме, нямате, нямат."},
    {id:"cheta", bg:"чета", fr:"lire", grp:"e",
      pres:["чета","четеш","чете","четем","четете","четат"],
      past:["четох","чете","чете","четохме","четохте","четоха"],
      imp:["чети","четете"],
      pastKind:"aoriste",
      tip:"1re conjugaison : radical + -а, -еш, -е, -ем, -ете, -ат. Attention : « чете » = il lit ET tu/il as/a lu."},
    {id:"govorya", bg:"говоря", fr:"parler", grp:"i",
      pres:["говоря","говориш","говори","говорим","говорите","говорят"],
      past:["говорих","говори","говори","говорихме","говорихте","говориха"],
      imp:["говори","говорете"],
      pastKind:"aoriste",
      tip:"2e conjugaison : -я, -иш, -и, -им, -ите, -ят. Impératif pluriel en -ете : говорете."},
    {id:"iskam", bg:"искам", fr:"vouloir", grp:"a",
      pres:["искам","искаш","иска","искаме","искате","искат"],
      past:["исках","искаше","искаше","искахме","искахте","искаха"],
      pastKind:"imparfait",
      tip:"3e conjugaison. Souvent suivi de да + présent : Искам да чета. (L'aoriste иска remplace искаше aux 2e/3e pers. du singulier.)"},
    {id:"rabotya", bg:"работя", fr:"travailler", grp:"i",
      pres:["работя","работиш","работи","работим","работите","работят"],
      past:["работих","работи","работи","работихме","работихте","работиха"],
      imp:["работи","работете"],
      pastKind:"aoriste",
      tip:"Modèle du passé en -их : работих, работи, работи, работихме, работихте, работиха."},
    {id:"zhiveya", bg:"живея", fr:"habiter, vivre", grp:"e",
      pres:["живея","живееш","живее","живеем","живеете","живеят"],
      past:["живях","живя","живя","живяхме","живяхте","живяха"],
      imp:["живей","живейте"],
      pastKind:"aoriste",
      tip:"Le -е- du radical se double : живееш, живее. Au passé, е devient я : живях."},
    {id:"piya", bg:"пия", fr:"boire", grp:"e",
      pres:["пия","пиеш","пие","пием","пиете","пият"],
      past:["пих","пи","пи","пихме","пихте","пиха"],
      imp:["пий","пийте"],
      pastKind:"aoriste",
      tip:"Verbe court : passé très réduit (пих, пи, пи…) et impératif пий / пийте."},
    {id:"yam", bg:"ям", fr:"manger", grp:"irr",
      pres:["ям","ядеш","яде","ядем","ядете","ядат"],
      past:["ядох","яде","яде","ядохме","ядохте","ядоха"],
      imp:["яж","яжте"],
      pastKind:"aoriste",
      tip:"Irrégulier : le radical devient яд- sauf à la 1re personne (ям). Impératif : яж / яжте."},
    {id:"znam", bg:"знам", fr:"savoir, connaître", grp:"irr",
      pres:["знам","знаеш","знае","знаем","знаете","знаят"],
      past:["знаех","знаеше","знаеше","знаехме","знаехте","знаеха"],
      imp:["знай","знайте"],
      pastKind:"imparfait",
      tip:"Seule la 1re personne finit en -ам ; ensuite : знаеш, знае, знаем, знаете, знаят."},
    {id:"moga", bg:"мога", fr:"pouvoir", grp:"irr",
      pres:["мога","можеш","може","можем","можете","могат"],
      past:["можах","можа","можа","можахме","можахте","можаха"],
      pastKind:"aoriste",
      tip:"Alternance г → ж : мога, можеш, може, можем, можете, mais могат. Toujours suivi de да + présent."},
    {id:"otivam", bg:"отивам", fr:"aller", grp:"a",
      pres:["отивам","отиваш","отива","отиваме","отивате","отиват"],
      past:["отидох","отиде","отиде","отидохме","отидохте","отидоха"],
      imp:["отивай","отивайте"],
      pastKind:"aoriste de отида (aller, une fois)",
      tip:"Pour une action terminée, on emploie отида : отидох, отиде… L'habitude se dit ходя."},
    {id:"ucha", bg:"уча", fr:"apprendre, étudier", grp:"i",
      pres:["уча","учиш","учи","учим","учите","учат"],
      past:["учих","учи","учи","учихме","учихте","учиха"],
      imp:["учи","учете"],
      pastKind:"aoriste",
      tip:"« Apprendre à » se dit уча се да : Уча се да говоря български."},
    {id:"pravya", bg:"правя", fr:"faire", grp:"i",
      pres:["правя","правиш","прави","правим","правите","правят"],
      past:["правих","прави","прави","правихме","правихте","правиха"],
      imp:["прави","правете"],
      pastKind:"aoriste",
      tip:"Question de base : Какво правиш ? (Que fais-tu ?) / Какво правите ? (vous)."}
  ];
  VERBS.forEach(v=>{
    if(!v.fut) v.fut = v.pres.map(f=>"ще "+f);
  });
  const VBY = {}; VERBS.forEach(v=>VBY[v.id]=v);

  /* Phrases à trous : [verbe, temps, index personne, phrase avec ___, traduction] */
  const SENT = [
    ["govorya","pres",0,"Аз ___ български.","Je parle bulgare."],
    ["govorya","pres",4,"Вие ___ френски.","Vous parlez français."],
    ["govorya","imp",0,"___ по-бавно!","Parle plus lentement !"],
    ["rabotya","pres",3,"Ние ___ в Париж.","Nous travaillons à Paris."],
    ["rabotya","past",0,"Вчера аз ___ цял ден.","Hier, j'ai travaillé toute la journée."],
    ["rabotya","fut",2,"Утре той ___ в офиса.","Demain, il travaillera au bureau."],
    ["cheta","pres",1,"Ти ___ книга.","Tu lis un livre."],
    ["cheta","past",0,"Вчера аз ___ книга.","Hier, j'ai lu un livre."],
    ["cheta","fut",5,"Утре те ___ вестник.","Demain, ils liront le journal."],
    ["cheta","imp",1,"___ внимателно!","Lisez attentivement !"],
    ["iskam","pres",0,"Аз ___ кафе.","Je veux un café."],
    ["iskam","pres",5,"Те ___ вода.","Ils veulent de l'eau."],
    ["iskam","past",0,"Вчера аз ___ да говоря с теб.","Hier, je voulais te parler."],
    ["piya","pres",3,"Ние ___ чай.","Nous buvons du thé."],
    ["piya","past",0,"Вчера аз ___ кафе.","Hier, j'ai bu un café."],
    ["piya","fut",4,"Утре вие ___ вино.","Demain, vous boirez du vin."],
    ["piya","imp",0,"___ вода!","Bois de l'eau !"],
    ["yam","pres",2,"Той ___ хляб.","Il mange du pain."],
    ["yam","past",0,"Вчера аз ___ пица.","Hier, j'ai mangé une pizza."],
    ["yam","fut",3,"Довечера ние ___ у дома.","Ce soir, nous mangerons à la maison."],
    ["sam","pres",2,"Той ___ французин.","Il est français."],
    ["sam","pres",3,"Ние ___ приятели.","Nous sommes amis."],
    ["sam","pres",4,"Вие ___ от Франция.","Vous êtes de France."],
    ["sam","past",0,"Вчера аз ___ на работа.","Hier, j'étais au travail."],
    ["sam","past",5,"Те ___ в София миналата седмица.","Ils étaient à Sofia la semaine dernière."],
    ["sam","fut",0,"Утре аз ___ в Пловдив.","Demain, je serai à Plovdiv."],
    ["imam","pres",0,"Аз ___ брат.","J'ai un frère."],
    ["imam","pres",1,"Ти ___ кола.","Tu as une voiture."],
    ["imam","past",3,"Миналата година ние ___ куче.","L'année dernière, nous avions un chien."],
    ["znam","pres",0,"Аз ___ отговора.","Je connais la réponse."],
    ["znam","pres",5,"Те ___ български.","Ils savent le bulgare."],
    ["moga","pres",0,"Аз ___ да плувам.","Je sais nager."],
    ["moga","pres",3,"Ние ___ да дойдем утре.","Nous pouvons venir demain."],
    ["zhiveya","pres",0,"Аз ___ във Франция.","J'habite en France."],
    ["zhiveya","pres",5,"Те ___ в София.","Ils habitent à Sofia."],
    ["zhiveya","past",0,"Преди аз ___ в Лион.","Avant, j'habitais à Lyon."],
    ["otivam","pres",0,"Аз ___ на работа.","Je vais au travail."],
    ["otivam","pres",3,"Ние ___ на пазар.","Nous allons au marché."],
    ["otivam","past",0,"Вчера аз ___ на кино.","Hier, je suis allé au cinéma."],
    ["ucha","pres",0,"Аз ___ български.","J'apprends le bulgare."],
    ["ucha","past",0,"Вчера аз ___ цял час.","Hier, j'ai étudié une heure entière."],
    ["pravya","pres",4,"Какво ___ вие?","Que faites-vous ?"],
    ["pravya","pres",1,"Какво ___ ти?","Que fais-tu ?"],
    ["pravya","past",0,"Вчера аз ___ торта.","Hier, j'ai fait un gâteau."]
  ].map(s=>({v:s[0], t:s[1], pi:s[2], text:s[3], fr:s[4]}));

  const MODES = {
    choice:{icon:"", name:"Choisir la forme", desc:"Une personne, un temps : trouve la bonne forme parmi 4."},
    type  :{icon:"", name:"Écrire la forme", desc:"Tape la forme conjuguée (clavier cyrillique fourni)."},
    id    :{icon:"", name:"Reconnaître", desc:"On te donne une forme : retrouve le verbe, le temps et la personne."},
    gap   :{icon:"", name:"Phrases à trous", desc:"Complète des phrases en contexte, avec la traduction."},
    table :{icon:"", name:"Tableau à remplir", desc:"Conjugue toutes les personnes d'un verbe d'un coup."},
    mix   :{icon:"", name:"Défi mixte", desc:"Un mélange de tous les exercices (hors tableaux)."}
  };
  const MODE_ORDER = ["choice","type","id","gap","table","mix"];

  /* ---------- Utilitaires ---------- */
  const $ = id => document.getElementById(id);
  const rnd = n => Math.floor(Math.random()*n);
  function sh(a){ const b=a.slice(); for(let i=b.length-1;i>0;i--){ const j=rnd(i+1); [b[i],b[j]]=[b[j],b[i]]; } return b; }
  function uniq(a){ return Array.from(new Set(a)); }
  const TR = {а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"ts",ч:"ch",ш:"sh",щ:"sht",ъ:"a",ь:"y",ю:"yu",я:"ya"};
  function tr(s){ return s.toLowerCase().split("").map(c=>TR[c]!==undefined?TR[c]:c).join(""); }
  function norm(s){
    return String(s||"").normalize("NFD").replace(/[\u0300\u0301]/g,"").normalize("NFC")
      .toLowerCase().replace(/[.,!?;:«»"]/g,"").replace(/\s+/g," ").trim();
  }
  function persOf(tense){ return tense==="imp" ? PERS_IMP : PERS; }
  function forms(v,t){ return v[t]; }
  function hasT(v,t){ return !!v[t]; }
  function esc(s){ return String(s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }

  function store(){
    if(!progress.conj) progress.conj = {};
    const c = progress.conj;
    if(!c.best) c.best = {};
    if(!c.tense) c.tense = {};
    if(!c.verb) c.verb = {};
    return c;
  }
  function record(vid, tense, ok, ko){
    const c = store();
    (c.tense[tense] = c.tense[tense] || {ok:0,ko:0});
    (c.verb[vid] = c.verb[vid] || {ok:0,ko:0});
    c.tense[tense].ok += ok; c.tense[tense].ko += ko;
    c.verb[vid].ok += ok; c.verb[vid].ko += ko;
  }
  function weakVerbs(){
    const c = store();
    return VERBS.filter(v=>{
      const s = c.verb[v.id];
      if(!s || (s.ok+s.ko)<1) return false;
      return s.ko>0 && s.ok/(s.ok+s.ko) < 0.8;
    }).map(v=>v.id);
  }

  /* ---------- Onglets ---------- */
  const paneF = $("cj-pane-fiches"), paneT = $("cj-pane-train");
  function showTab(name){
    document.querySelectorAll(".cj-tab").forEach(b=>b.classList.toggle("active", b.dataset.cj===name));
    paneF.style.display = name==="fiches" ? "block" : "none";
    paneT.style.display = name==="train" ? "block" : "none";
    if(name==="train" && !sess) renderSetup();
  }
  document.querySelectorAll(".cj-tab").forEach(b=>b.addEventListener("click", ()=>showTab(b.dataset.cj)));

  /* ---------- Fiches ---------- */
  let ficheId = VERBS[3].id;
  const vchips = $("cj-vchips");
  function renderVChips(){
    let html = "";
    Object.keys(GROUPS).forEach(g=>{
      const list = VERBS.filter(v=>v.grp===g);
      if(!list.length) return;
      html += `<div class="cj-group-title">${GROUPS[g].label}</div><div class="cj-chipline">` +
        list.map(v=>`<button type="button" class="chip${v.id===ficheId?" active":""}" data-v="${v.id}">${v.bg} <small style="opacity:.75">· ${v.fr.split(",")[0]}</small></button>`).join("") + `</div>`;
    });
    vchips.innerHTML = html;
    vchips.querySelectorAll("[data-v]").forEach(b=>b.addEventListener("click", ()=>{ ficheId=b.dataset.v; renderVChips(); renderFiche(); }));
  }
  function cell(f){ return `${f}<span class="cj-tr">${tr(f)}</span>`; }
  function renderFiche(){
    const v = VBY[ficheId];
    let rows = "";
    for(let i=0;i<6;i++){
      rows += `<tr><td class="p">${PERS[i].bg} <small>${PERS[i].fr}</small></td><td class="f">${cell(v.pres[i])}</td><td class="f">${cell(v.past[i])}</td><td class="f">${cell(v.fut[i])}</td></tr>`;
    }
    const imp = v.imp ? `<div class="tip"><b>Impératif</b> — ти : <span class="bg-cell">${v.imp[0]}</span> <span class="cj-tr" style="display:inline">(${tr(v.imp[0])})</span> · вие : <span class="bg-cell">${v.imp[1]}</span> <span class="cj-tr" style="display:inline">(${tr(v.imp[1])})</span></div>` : "";
    $("cj-fiche").innerHTML = `
      <div class="cj-head">
        <span class="big">${v.bg}</span><span class="fr">${v.fr}</span>
        <span class="cj-badge">${GROUPS[v.grp].label}</span>
        <span class="cj-badge gold">passé : ${v.pastKind}</span>
      </div>
      <div class="tbl-scroll"><table class="gtable cj-table">
        <tr><th></th><th>Présent</th><th>Passé</th><th>Futur</th></tr>${rows}
      </table></div>
      ${imp}
      <div class="tip"> ${v.tip}</div>
      <div class="cj-cta">
        <button type="button" class="action primary" id="cj-train-this"> S'entraîner sur ce verbe</button>
      </div>`;
    $("cj-train-this").addEventListener("click", ()=>{
      cfg.verbs = new Set([v.id]);
      showTab("train"); sess = null; renderSetup();
    });
  }
  $("cj-tr-toggle").addEventListener("change", e=>{
    $("sec-conjugation").classList.toggle("cj-noTr", !e.target.checked);
  });

  /* ---------- Réglages d'entraînement ---------- */
  const cfg = { mode:"choice", tenses:new Set(["pres","past"]), verbs:new Set(VERBS.map(v=>v.id)), len:12, weak:false };
  let sess = null;   // session en cours
  let lastInput = null;
  const stage = $("cj-stage");

  function setupPoolCount(){
    const ids = cfg.weak ? weakVerbs() : Array.from(cfg.verbs);
    return VERBS.filter(v=>ids.includes(v.id) && Array.from(cfg.tenses).some(t=>hasT(v,t))).length;
  }

  function renderSetup(){
    sess = null;
    const weak = weakVerbs();
    const vchipHTML = VERBS.map(v=>`<button type="button" class="chip${cfg.verbs.has(v.id)?" active":""}" data-vsel="${v.id}">${v.bg}</button>`).join("");
    stage.innerHTML = `
      <div class="cj-card">
        <div class="cj-label">1 · Type d'exercice</div>
        <div class="cj-modes">${MODE_ORDER.map(m=>`<button type="button" class="cj-mode${cfg.mode===m?" active":""}" data-mode="${m}"><b>${MODES[m].icon} ${MODES[m].name}</b><span>${MODES[m].desc}</span></button>`).join("")}</div>

        <div class="cj-label">2 · Temps</div>
        <div class="cj-chipline" id="cj-tsel">${T_ORDER.map(t=>`<button type="button" class="chip${cfg.tenses.has(t)?" active":""}" data-tsel="${t}">${TENSES[t].label}</button>`).join("")}</div>

        <div class="cj-label">3 · Verbes</div>
        <div class="cj-chipline" style="margin-bottom:.5rem;">
          <button type="button" class="chip q" data-quick="all">Tous</button>
          <button type="button" class="chip q" data-quick="e">1re conj.</button>
          <button type="button" class="chip q" data-quick="i">2e conj.</button>
          <button type="button" class="chip q" data-quick="a">3e conj.</button>
          <button type="button" class="chip q" data-quick="irr">Irréguliers</button>
        </div>
        <div class="cj-chipline" id="cj-vsel">${vchipHTML}</div>
        <label class="cj-check" style="margin-top:.7rem;${weak.length?"":"opacity:.55;"}">
          <input type="checkbox" id="cj-weak" ${cfg.weak?"checked":""} ${weak.length?"":"disabled"}>
           Cibler mes points faibles ${weak.length?`(${weak.map(id=>VBY[id].bg).join(", ")})`:"(disponible après quelques exercices)"}
        </label>

        <div class="cj-label">4 · Nombre de questions</div>
        <div class="cj-seg" id="cj-len">${[8,12,20].map(n=>`<button type="button" class="${cfg.len===n?"active":""}" data-len="${n}">${n}</button>`).join("")}</div>

        <div class="cj-start">
          <button type="button" class="action primary" id="cj-go"> Commencer</button>
          <span class="cj-hint" id="cj-hint"></span>
        </div>
      </div>`;

    stage.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click", ()=>{ cfg.mode=b.dataset.mode; renderSetup(); }));
    stage.querySelectorAll("[data-tsel]").forEach(b=>b.addEventListener("click", ()=>{
      const t=b.dataset.tsel;
      if(cfg.tenses.has(t)){ if(cfg.tenses.size>1) cfg.tenses.delete(t); } else cfg.tenses.add(t);
      renderSetup();
    }));
    stage.querySelectorAll("[data-vsel]").forEach(b=>b.addEventListener("click", ()=>{
      const id=b.dataset.vsel;
      if(cfg.verbs.has(id)){ if(cfg.verbs.size>1) cfg.verbs.delete(id); } else cfg.verbs.add(id);
      cfg.weak=false; renderSetup();
    }));
    stage.querySelectorAll("[data-quick]").forEach(b=>b.addEventListener("click", ()=>{
      const q=b.dataset.quick;
      cfg.verbs = new Set(VERBS.filter(v=>q==="all"||v.grp===q).map(v=>v.id));
      cfg.weak=false; renderSetup();
    }));
    stage.querySelectorAll("[data-len]").forEach(b=>b.addEventListener("click", ()=>{ cfg.len=+b.dataset.len; renderSetup(); }));
    const w = $("cj-weak"); if(w) w.addEventListener("change", e=>{ cfg.weak=e.target.checked; renderSetup(); });
    $("cj-go").addEventListener("click", startFromSetup);
    const hint = $("cj-hint");
    const n = setupPoolCount();
    hint.textContent = n ? `${n} verbe${n>1?"s":""} · ${cfg.tenses.size} temps` : "Aucun verbe ne correspond à ce temps.";
    if(!n) $("cj-go").disabled = true;
  }

  /* ---------- Fabrication des questions ---------- */
  function candidates(){
    const ids = cfg.weak ? weakVerbs() : Array.from(cfg.verbs);
    const out = [];
    VERBS.forEach(v=>{
      if(!ids.includes(v.id)) return;
      cfg.tenses.forEach(t=>{
        if(!hasT(v,t)) return;
        v[t].forEach((f,pi)=>out.push({v,t,pi,f}));
      });
    });
    return out;
  }
  function ambiguous(v, f){
    let c = 0;
    T_ORDER.forEach(t=>{ if(v[t]) v[t].forEach(x=>{ if(x===f) c++; }); });
    return c>1;
  }
  function formOptions(v,t,pi,correct){
    const same = uniq(v[t].filter((f,i)=>i!==pi && f!==correct));
    const other = uniq(T_ORDER.filter(x=>x!==t && v[x] && !(x==="imp")).map(x=>v[x][Math.min(pi, v[x].length-1)]).filter(f=>f!==correct && !same.includes(f)));
    const otherAll = uniq(T_ORDER.filter(x=>x!==t && x!=="imp" && v[x]).flatMap(x=>v[x]).filter(f=>f!==correct && !same.includes(f)));
    let picks = sh(same).slice(0,2);
    sh(other).forEach(f=>{ if(picks.length<3 && !picks.includes(f)) picks.push(f); });
    sh(same).forEach(f=>{ if(picks.length<3 && !picks.includes(f)) picks.push(f); });
    sh(otherAll).forEach(f=>{ if(picks.length<3 && !picks.includes(f)) picks.push(f); });
    if(picks.length<3){
      sh(VERBS.filter(x=>x!==v && x[t])).forEach(x=>{ const f=x[t][Math.min(pi,x[t].length-1)]; if(picks.length<3 && f!==correct && !picks.includes(f)) picks.push(f); });
    }
    return sh([correct, ...picks]);
  }
  function idLabel(v,t,pi){ return `${v.bg} · ${TENSES[t].low} · ${persOf(t)[pi].short}`; }
  function idOptions(v,t,pi,f){
    const correct = idLabel(v,t,pi);
    const set = new Set([correct]);
    const pick = [];
    function add(lbl){ if(!set.has(lbl) && pick.length<3){ set.add(lbl); pick.push(lbl); } }
    // même verbe, même temps, autre personne
    sh(persOf(t).map((_,i)=>i).filter(i=>i!==pi && v[t][i]!==f)).slice(0,1).forEach(i=>add(idLabel(v,t,i)));
    // même verbe, autre temps, même personne
    sh(T_ORDER.filter(x=>x!==t && v[x] && x!=="imp")).forEach(x=>{ const i=Math.min(pi,v[x].length-1); if(v[x][i]!==f) add(idLabel(v,x,i)); });
    // autre verbe, même temps/personne
    sh(VERBS.filter(x=>x!==v && x[t])).forEach(x=>{ if(x[t][Math.min(pi,x[t].length-1)]!==f) add(idLabel(x,t,Math.min(pi,x[t].length-1))); });
    return sh([correct, ...pick]);
  }

  function makeQuestion(type, c){
    if(type==="choice" || type==="type"){
      return {type, v:c.v, t:c.t, pi:c.pi, answer:c.f, options: type==="choice" ? formOptions(c.v,c.t,c.pi,c.f) : null};
    }
    if(type==="id"){
      return {type, v:c.v, t:c.t, pi:c.pi, form:c.f, answer:idLabel(c.v,c.t,c.pi), options:idOptions(c.v,c.t,c.pi,c.f)};
    }
    return null;
  }
  function makeGap(s){
    const v=VBY[s.v], ans=v[s.t][s.pi];
    return {type:"gap", v, t:s.t, pi:s.pi, s, answer:ans, options:formOptions(v,s.t,s.pi,ans)};
  }
  function gapPool(){
    const ids = cfg.weak ? weakVerbs() : Array.from(cfg.verbs);
    return SENT.filter(s=>ids.includes(s.v) && cfg.tenses.has(s.t));
  }

  function buildQuestions(){
    const cands = candidates();
    const N = cfg.len;
    let qs = [];
    const m = cfg.mode;
    if(m==="choice" || m==="type"){
      qs = sh(cands).slice(0,N).map(c=>makeQuestion(m,c));
    } else if(m==="id"){
      const ok = cands.filter(c=>!ambiguous(c.v,c.f));
      qs = sh(ok).slice(0,N).map(c=>makeQuestion("id",c));
    } else if(m==="gap"){
      qs = sh(gapPool()).slice(0,N).map(makeGap);
    } else if(m==="table"){
      const combos = [];
      VERBS.forEach(v=>{
        const ids = cfg.weak ? weakVerbs() : Array.from(cfg.verbs);
        if(!ids.includes(v.id)) return;
        cfg.tenses.forEach(t=>{ if(hasT(v,t)) combos.push({type:"table", v, t}); });
      });
      qs = sh(combos).slice(0, Math.max(3, Math.ceil(N/3)));
    } else if(m==="mix"){
      const gaps = sh(gapPool());
      const idc = sh(cands.filter(c=>!ambiguous(c.v,c.f)));
      const pool = sh(cands);
      const kinds = ["choice","type","id","gap"];
      let gi=0, ii=0, pi=0;
      for(let k=0;k<N;k++){
        const kind = kinds[k%kinds.length];
        if(kind==="gap" && gi<gaps.length) qs.push(makeGap(gaps[gi++]));
        else if(kind==="id" && ii<idc.length) qs.push(makeQuestion("id", idc[ii++]));
        else if(pi<pool.length) qs.push(makeQuestion(kind==="type"?"type":"choice", pool[pi++]));
      }
      qs = sh(qs);
    }
    return qs.filter(Boolean);
  }

  function startFromSetup(){
    const qs = buildQuestions();
    if(!qs.length){
      $("cj-hint").textContent = "Pas assez de contenu pour cette sélection : ajoute des verbes ou des temps.";
      return;
    }
    beginSession(qs);
  }
  function cjFailedQs(){
    return sess.qs.filter((q,i)=>sess.res[i] && sess.res[i].pts<sess.res[i].max).map(q=>{
      if(q.type==="choice") return {...q, options:formOptions(q.v,q.t,q.pi,q.answer)};
      if(q.type==="gap") return {...q, options:formOptions(q.v,q.t,q.pi,q.answer)};
      return q;
    });
  }
  function updErrBtn(){
    const b = $("cj-err-now"); if(!b || !sess) return;
    const n = cjFailedQs().length;
    b.disabled = n===0;
    b.textContent = ` Retravailler mes erreurs (${n})`;
  }
  function retryErrors(){
    const failed = cjFailedQs();
    if(failed.length) beginSession(sh(failed));
  }
  function beginSession(qs){
    sess = { qs, i:0, res:[], streak:0, bestStreak:0, answered:false };
    renderQuestion();
  }

  /* ---------- Affichage d'une question ---------- */
  const KIND = {choice:"Choisis la forme", type:"Écris la forme", id:"Reconnais la forme", gap:"Complète la phrase", table:"Remplis le tableau"};
  function promptHTML(q){
    const P = persOf(q.t)[q.pi];
    if(q.type==="choice" || q.type==="type"){
      return `Conjugue <span class="v">${q.v.bg}</span> <small style="font-family:'PT Sans';color:var(--muted2)">(${q.v.fr})</small><br>
        <span class="pill t">${TENSES[q.t].label}</span> <span class="pill p">${P.bg}</span> <small style="font-family:'PT Sans';color:var(--muted2)">${P.fr}</small>`;
    }
    if(q.type==="id"){
      return `Quelle est cette forme ?<span class="cj-form">${q.form}</span><span class="cj-tr" style="display:block;font-size:.78rem;color:var(--muted2);font-style:italic;font-family:'PT Sans'">${tr(q.form)}</span>`;
    }
    if(q.type==="gap"){
      const parts = q.s.text.split("___");
      return `${esc(parts[0])}<span class="cj-blank" id="cj-blank">&nbsp;</span>${esc(parts[1]||"")}
        <div class="cj-sent-fr">${esc(q.s.fr)}</div>
        <div style="margin-top:.5rem"><span class="pill">${q.v.bg}</span> <span class="pill t">${TENSES[q.t].label}</span></div>`;
    }
    if(q.type==="table"){
      return `Conjugue <span class="v">${q.v.bg}</span> <small style="font-family:'PT Sans';color:var(--muted2)">(${q.v.fr})</small> au <span class="pill t">${TENSES[q.t].low}</span>`;
    }
    return "";
  }
  function keyboardHTML(){
    const L = "абвгдежзийклмнопрстуфхцчшщъьюя".split("");
    return `<details class="cj-kbd" open><summary> Clavier cyrillique</summary><div class="cj-keys">${
      L.map(c=>`<button type="button" class="cj-key" data-k="${c}">${c}</button>`).join("")
    }<button type="button" class="cj-key wide" data-k=" ">espace</button><button type="button" class="cj-key wide" data-k="⌫">⌫ effacer</button></div></details>`;
  }
  function bindKeyboard(){
    stage.querySelectorAll(".cj-key").forEach(b=>{
      b.addEventListener("mousedown", e=>e.preventDefault());
      b.addEventListener("click", ()=>{
        const inp = (lastInput && document.body.contains(lastInput) && !lastInput.disabled) ? lastInput : stage.querySelector(".cj-input:not([disabled])");
        if(!inp) return;
        const k = b.dataset.k;
        const s = inp.selectionStart==null ? inp.value.length : inp.selectionStart;
        const e = inp.selectionEnd==null ? s : inp.selectionEnd;
        if(k==="⌫"){
          if(s!==e){ inp.value = inp.value.slice(0,s)+inp.value.slice(e); inp.setSelectionRange(s,s); }
          else if(s>0){ inp.value = inp.value.slice(0,s-1)+inp.value.slice(s); inp.setSelectionRange(s-1,s-1); }
        } else {
          inp.value = inp.value.slice(0,s)+k+inp.value.slice(e);
          inp.setSelectionRange(s+1,s+1);
        }
        inp.focus();
      });
    });
  }
  stage.addEventListener("focusin", e=>{ if(e.target.classList && e.target.classList.contains("cj-input")) lastInput = e.target; });

  function topBar(){
    const n = sess.qs.length;
    const pct = Math.round((sess.i/n)*100);
    return `<div class="cj-top">
      <span>${Math.min(sess.i+1,n)} / ${n}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
      <span class="cj-streak">${sess.streak>=3?" "+sess.streak:(sess.streak>0?" "+sess.streak:"")}</span>
      <button type="button" class="cj-quit" id="cj-quit">Quitter</button>
    </div>`;
  }

  function renderQuestion(){
    if(sess.i >= sess.qs.length){ renderResult(); return; }
    const q = sess.qs[sess.i];
    sess.answered = false;
    let body = "";
    if(q.type==="choice" || q.type==="id" || q.type==="gap"){
      body = `<div class="cj-opts">${q.options.map((o,k)=>`<button type="button" class="opt-btn" data-opt="${esc(o)}"><span class="n">${k+1}</span>${esc(o)}</button>`).join("")}</div>`;
    } else if(q.type==="type"){
      body = `<input class="cj-input" id="cj-in" type="text" lang="bg" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Écris ta réponse…">
        ${keyboardHTML()}
        <div class="cj-actions"><button type="button" class="action primary" id="cj-submit">Valider</button></div>`;
    } else if(q.type==="table"){
      const P = persOf(q.t);
      body = `<div class="cj-fill">${P.map((p,i)=>`<label for="cj-c${i}">${p.bg} <small style="color:var(--muted2)">${p.fr}</small></label><input class="cj-input" id="cj-c${i}" type="text" lang="bg" autocomplete="off" autocapitalize="off" spellcheck="false">`).join("")}</div>
        ${keyboardHTML()}
        <div class="cj-actions"><button type="button" class="action primary" id="cj-submit">Vérifier</button></div>`;
    }
    stage.innerHTML = topBar() + `<div class="cj-qbox"><div class="cj-kind">${KIND[q.type]}</div><div class="cj-q">${promptHTML(q)}</div>${body}<div id="cj-fb"></div></div>
      <div class="retry-bar"><button type="button" class="action retry-btn" id="cj-err-now"></button></div>`;
    updErrBtn();
    $("cj-err-now").addEventListener("click", retryErrors);
    $("cj-quit").addEventListener("click", ()=>{ if(confirm("Quitter cet exercice ?")) renderSetup(); });

    if(q.type==="choice" || q.type==="id" || q.type==="gap"){
      stage.querySelectorAll(".opt-btn").forEach(b=>b.addEventListener("click", ()=>answerChoice(b)));
    } else {
      bindKeyboard();
      const first = stage.querySelector(".cj-input"); if(first){ lastInput = first; first.focus(); }
      $("cj-submit").addEventListener("click", ()=> q.type==="table" ? answerTable() : answerType());
    }
  }

  /* ---------- Correction ---------- */
  function paraHTML(v,t,hi){
    const P = persOf(t);
    return `<div class="cj-para">${v[t].map((f,i)=>`<div class="${i===hi?"hi":""}"><small>${P[i].short}</small>${f}</div>`).join("")}</div>`;
  }
  function feedback(q, ok, given){
    const fbEl = $("cj-fb");
    let ansTxt = q.type==="id" ? q.answer : q.answer;
    const trLine = (q.type==="id") ? "" : `<span class="cj-tr" style="display:block;font-size:.8rem;color:var(--muted2);font-style:italic;font-family:'PT Sans'">${tr(q.answer)}</span>`;
    const notes = [];
    if(q.t==="past") notes.push(`Passé de <b>${q.v.bg}</b> : ${q.v.pastKind}.`);
    if(!ok && q.type!=="id") notes.push(q.v.tip);
    fbEl.innerHTML = `<div class="cj-fb ${ok?"":"ko"}">
        <div class="verdict">${ok?" Correct !":" Pas tout à fait"}</div>
        ${ok && q.type!=="id" ? "" : `<div>Réponse : <span class="ans">${esc(ansTxt)}</span>${trLine}</div>`}
        ${ (!ok && given) ? `<div class="why">Ta réponse : <s>${esc(given)}</s></div>` : ""}
        ${q.type==="id" ? "" : paraHTML(q.v,q.t,q.pi)}
        ${notes.length?`<div class="why"> ${notes.join(" ")}</div>`:""}
      </div>
      <div class="cj-actions"><button type="button" class="action primary" id="cj-next">${sess.i+1>=sess.qs.length?"Voir le résultat":"Question suivante"} →</button></div>`;
    $("cj-next").addEventListener("click", nextQ);
    $("cj-next").focus();
  }
  function finishAnswer(q, ok, given, pts, max){
    sess.answered = true;
    sess.res[sess.i] = {ok, given, pts, max};
    sess.streak = ok ? sess.streak+1 : 0;
    sess.bestStreak = Math.max(sess.bestStreak, sess.streak);
    if(q.type!=="table") record(q.v.id, q.t, ok?1:0, ok?0:1);
    saveProgress(progress);
    // met à jour le compteur de série
    const st = stage.querySelector(".cj-streak");
    if(st) st.textContent = sess.streak>=3 ? " "+sess.streak : (sess.streak>0 ? " "+sess.streak : "");
    updErrBtn();
  }
  function answerChoice(btn){
    if(sess.answered) return;
    const q = sess.qs[sess.i];
    const val = btn.dataset.opt;
    const ok = val===q.answer;
    stage.querySelectorAll(".opt-btn").forEach(b=>{
      b.disabled = true;
      if(b.dataset.opt===q.answer) b.classList.add("correct");
    });
    if(!ok) btn.classList.add("incorrect");
    if(q.type==="gap"){ const bl=$("cj-blank"); if(bl) bl.textContent = q.answer; }
    finishAnswer(q, ok, val, ok?1:0, 1);
    feedback(q, ok, ok?"":val);
  }
  function answerType(){
    if(sess.answered) return;
    const q = sess.qs[sess.i];
    const inp = $("cj-in");
    const given = inp.value.trim();
    if(!given){ inp.focus(); return; }
    const ok = norm(given)===norm(q.answer);
    inp.disabled = true; inp.classList.add(ok?"correct":"incorrect");
    const kb = stage.querySelector(".cj-kbd"); if(kb) kb.style.display="none";
    $("cj-submit").style.display="none";
    finishAnswer(q, ok, given, ok?1:0, 1);
    feedback(q, ok, ok?"":given);
  }
  function answerTable(){
    if(sess.answered) return;
    const q = sess.qs[sess.i];
    const P = persOf(q.t);
    let good = 0; const bad = [];
    P.forEach((p,i)=>{
      const inp = $("cj-c"+i);
      const okc = norm(inp.value)===norm(q.v[q.t][i]);
      inp.disabled = true; inp.classList.add(okc?"correct":"incorrect");
      if(okc) good++; else {
        bad.push({p:p.short, given:inp.value.trim(), ans:q.v[q.t][i]});
        const fb = document.createElement("div"); fb.className="cell-fb"; fb.textContent = "→ "+q.v[q.t][i];
        inp.insertAdjacentElement("afterend", fb);
      }
    });
    const kb = stage.querySelector(".cj-kbd"); if(kb) kb.style.display="none";
    $("cj-submit").style.display="none";
    const all = good===P.length;
    record(q.v.id, q.t, good, P.length-good);
    finishAnswer(q, all, "", good, P.length);
    sess.res[sess.i].bad = bad;
    const fbEl = $("cj-fb");
    fbEl.innerHTML = `<div class="cj-fb ${all?"":"ko"}"><div class="verdict">${all?" Tableau parfait !":`${good} / ${P.length} formes justes`}</div>${all?"":`<div class="why"> ${q.v.tip}</div>`}</div>
      <div class="cj-actions"><button type="button" class="action primary" id="cj-next">${sess.i+1>=sess.qs.length?"Voir le résultat":"Question suivante"} →</button></div>`;
    $("cj-next").addEventListener("click", nextQ);
    $("cj-next").focus();
  }
  function nextQ(){ sess.i++; renderQuestion(); }

  /* Raccourcis clavier : 1-4 pour les choix, Entrée pour valider / continuer */
  document.addEventListener("keydown", e=>{
    if(!sess || !$("sec-conjugation").classList.contains("active") || paneT.style.display==="none") return;
    const q = sess.qs[sess.i]; if(!q) return;
    if(e.key==="Enter"){
      if(e.target && e.target.id==="cj-err-now") return;
      const next = $("cj-next");
      if(next){ if(document.activeElement!==next){ e.preventDefault(); nextQ(); } return; }
      if(!sess.answered && (q.type==="type" || q.type==="table")){
        if(q.type==="table"){
          const inputs = Array.from(stage.querySelectorAll(".cj-input"));
          const idx = inputs.indexOf(document.activeElement);
          if(idx>=0 && idx<inputs.length-1){ e.preventDefault(); inputs[idx+1].focus(); return; }
          e.preventDefault(); answerTable();
        } else { e.preventDefault(); answerType(); }
      }
    } else if(!sess.answered && /^[1-4]$/.test(e.key) && (q.type==="choice"||q.type==="id"||q.type==="gap")){
      const b = stage.querySelectorAll(".opt-btn")[+e.key-1]; if(b) b.click();
    }
  });

  /* ---------- Résultats ---------- */
  function renderResult(){
    const pts = sess.res.reduce((a,r)=>a+r.pts,0);
    const max = sess.res.reduce((a,r)=>a+r.max,0);
    const pct = max ? Math.round(pts/max*100) : 0;
    const c = store();
    const prev = c.best[cfg.mode];
    const isNew = !prev || pct>prev.pct;
    if(isNew) c.best[cfg.mode] = {pct, pts, max};
    c.sessions = (c.sessions||0)+1;
    saveProgress(progress);

    const msg = pct>=90 ? "Отлично ! Excellent !" : pct>=70 ? "Много добре ! Très bien !" : pct>=50 ? "Добре ! Pas mal, continue." : "Не се отчайвай — relis la fiche et retente !";

    // détail par temps
    const by = {};
    sess.qs.forEach((q,i)=>{ const r=sess.res[i]; if(!r) return; const t=q.t; by[t]=by[t]||{p:0,m:0}; by[t].p+=r.pts; by[t].m+=r.max; });
    const brk = T_ORDER.filter(t=>by[t]).map(t=>{
      const p = Math.round(by[t].p/by[t].m*100);
      return `<div class="prog-row"><div class="lbl">${TENSES[t].label}</div><div class="bar-track"><div class="bar-fill" style="width:${p}%;background:${p>=70?"var(--sage)":"var(--gold)"}"></div></div><div class="num">${by[t].p}/${by[t].m}</div></div>`;
    }).join("");

    // erreurs
    const errs = [];
    sess.qs.forEach((q,i)=>{
      const r = sess.res[i]; if(!r || r.pts===r.max) return;
      if(q.type==="table"){
        errs.push(`<div class="cj-err"><span class="bgf">${q.v.bg}</span> · ${TENSES[q.t].low} — ${(r.bad||[]).map(b=>`${b.p} : ${b.given?`<span class="was">${esc(b.given)}</span> → `:""}<span class="bgf">${b.ans}</span>`).join(" · ")}</div>`);
      } else if(q.type==="id"){
        errs.push(`<div class="cj-err"><span class="bgf">${q.form}</span> = <span class="bgf">${q.answer}</span> ${r.given?`<br><span class="was">${esc(r.given)}</span>`:""}</div>`);
      } else if(q.type==="gap"){
        errs.push(`<div class="cj-err">${esc(q.s.text.replace("___", "…"))} → <span class="bgf">${q.answer}</span> ${r.given?`<span class="was">${esc(r.given)}</span>`:""}</div>`);
      } else {
        errs.push(`<div class="cj-err"><span class="bgf">${q.v.bg}</span> · ${TENSES[q.t].low} · ${persOf(q.t)[q.pi].short} → <span class="bgf">${q.answer}</span> ${r.given?`<span class="was">${esc(r.given)}</span>`:""}</div>`);
      }
    });

    stage.innerHTML = `<div class="cj-result">
        <div class="score">${pts} / ${max}</div>
        <div class="pct">${pct} %${isNew ? ' <span class="new">Nouveau record</span>' : ` · record : ${prev.pct} %`}</div>
        <div class="msg">${msg}</div>
        <div class="pct">Meilleure série : ${sess.bestStreak} </div>
        <div class="cj-brk">${brk}</div>
        <div class="cj-cta" style="justify-content:center">
          ${errs.length?`<button type="button" class="action primary" id="cj-retry"> Rejouer mes erreurs (${errs.length})</button>`:""}
          <button type="button" class="action ${errs.length?"ghost":"primary"}" id="cj-again">↻ Nouvelle série</button>
          <button type="button" class="action ghost" id="cj-settings"> Réglages</button>
        </div>
        ${errs.length?`<div class="cj-errs"><div class="cj-label">À retenir</div>${errs.join("")}</div>`:`<p style="margin-top:1rem">Aucune erreur, bravo ! </p>`}
      </div>`;
    $("cj-again").addEventListener("click", ()=>{ const qs=buildQuestions(); if(qs.length) beginSession(qs); else renderSetup(); });
    $("cj-settings").addEventListener("click", renderSetup);
    const rt = $("cj-retry");
    if(rt) rt.addEventListener("click", retryErrors);
    if(typeof renderConjProgress==="function") renderConjProgress();
  }

  /* ---------- Page Progression ---------- */
  function renderConjProgress(){
    const host = $("progress-conj"); if(!host) return;
    const c = store();
    let html = "";
    html += `<div class="cj-label" style="margin-top:.2rem">Meilleur score par exercice</div>`;
    html += MODE_ORDER.map(m=>{
      const b = c.best[m]; const p = b ? b.pct : 0;
      return `<div class="prog-row"><div class="lbl">${MODES[m].icon} ${MODES[m].name}</div><div class="bar-track"><div class="bar-fill" style="width:${p}%;background:var(--gold)"></div></div><div class="num">${b?p+" %":"—"}</div></div>`;
    }).join("");
    html += `<div class="cj-label">Réussite par temps</div>`;
    html += T_ORDER.map(t=>{
      const s = c.tense[t]; const tot = s ? s.ok+s.ko : 0; const p = tot ? Math.round(s.ok/tot*100) : 0;
      return `<div class="prog-row"><div class="lbl">${TENSES[t].label}</div><div class="bar-track"><div class="bar-fill" style="width:${p}%"></div></div><div class="num">${tot?p+" %":"—"}</div></div>`;
    }).join("");
    const weak = weakVerbs();
    html += `<div class="cj-label">Verbes à retravailler</div><p class="cj-hint">${weak.length ? weak.map(id=>`<b class="bg-cell" style="font-family:'PT Serif';color:var(--madder-dark)">${VBY[id].bg}</b>`).join(" · ") : "Rien à signaler pour l'instant."}</p>`;
    host.innerHTML = html;
  }
  window.renderConjProgress = renderConjProgress;
  window.CJ = {VERBS, PERS, PERS_IMP, TENSES, T_ORDER, GROUPS};
  const progBtn = document.querySelector('#nav button[data-target="progress"]');
  if(progBtn) progBtn.addEventListener("click", renderConjProgress);

  /* ---------- Liens depuis les autres onglets ---------- */
  document.querySelectorAll("[data-go-conj]").forEach(b=>b.addEventListener("click", ()=>{
    switchNavTo("conjugation");
    showTab(b.dataset.goConj);
  }));
  document.querySelectorAll("[data-go]").forEach(b => {
  b.addEventListener("click", () => {
    switchNavTo(b.dataset.go);
  });
});

  /* ---------- Init ---------- */
  renderVChips();
  renderFiche();
})();

/* ---------- Carte interactive des monuments ---------- */
(function(){
  const MON_CATS = {
    national:    { label:" Icônes nationales",                 color:"#C08A2E" },
    thrace:      { label:" Thrace et antique",                 color:"#A22C3B" },
    medieval:    { label:" Médiévale et orthodoxe",            color:"#5F7052" },
    fortress:    { label:" Forteresses",                       color:"#3A5A8C" },
    renaissance: { label:" Renaissance : villes-musées",       color:"#8B5E3C" },
    sofia:       { label:" Sofia (autres sites)",              color:"#6B4C9A" },
    xxe:         { label:" XXe siècle et mémoire nationale",   color:"#4a4a4a" },
    monasteries: { label:" Autres monastères de Bulgarie",     color:"#2F7A6B" },
    macedonia:   { label:" Macédoine du Nord",                color:"#D4452B" },
    mkmonast:    { label:" Monastères de Macédoine du Nord",   color:"#E08A1E" },
    mkfort:      { label:" Forteresses de Macédoine du Nord",  color:"#7A1F2B" }
  };

  const MONUMENTS = [
    // Icônes nationales
    { n:"Cathédrale Alexandre-Nevski", bg:"Храм-паметник „Свети Александър Невски”", cat:"national", lat:42.6954, lng:23.3327, d:"La plus grande cathédrale orthodoxe des Balkans, à Sofia." },
    { n:"Monastère de Rila", bg:"Рилски манастир", cat:"national", lat:42.1334, lng:23.3400, d:"Fondé au Xe siècle, le plus grand monastère orthodoxe bulgare (UNESCO)." },
    { n:"Forteresse de Tsarevets", bg:"Царевец", cat:"national", lat:43.0757, lng:25.6415, d:"Siège du pouvoir royal et patriarcal du Second Empire bulgare, à Veliko Tarnovo." },
    { n:"Cavalier de Madara", bg:"Мадарски конник", cat:"national", lat:43.2685, lng:27.1264, d:"Bas-relief rupestre du haut Moyen Âge (UNESCO)." },
    { n:"Monument de la Liberté (Shipka)", bg:"Паметник на Свободата", cat:"national", lat:42.7415, lng:25.3298, d:"Mémoire des combattants de la guerre de libération de 1877-1878." },
    { n:"Église de Boyana", bg:"Боянска църква", cat:"national", lat:42.6386, lng:23.2864, d:"Petite église médiévale, fresques du XIIIe siècle (UNESCO), à Sofia." },
    { n:"Vieille ville de Nessebar", bg:"Старинен град Несебър", cat:"national", lat:42.6592, lng:27.7358, d:"Cité antique sur une presqu'île de la mer Noire (UNESCO)." },
    { n:"Monument de Buzludzha", bg:"Паметник на Бузлуджа", cat:"national", lat:42.7383, lng:25.3831, d:"Édifice communiste en forme de soucoupe (1974-1981)." },
    // Thrace et antique
    { n:"Tombeau thrace de Kazanlak", bg:"Тракийска гробница в Казанлък", cat:"thrace", lat:42.6238, lng:25.3970, d:"IVe siècle av. J.-C., fresques exceptionnellement conservées." },
    { n:"Tombeau thrace de Sveshtari", bg:"Свещарска гробница", cat:"thrace", lat:43.6284, lng:26.7180, d:"IIIe siècle av. J.-C., célèbre pour ses cariatides (UNESCO)." },
    { n:"Perperikon", bg:"Перперикон", cat:"thrace", lat:41.5810, lng:25.4363, d:"Grand complexe archéologique rupestre des Rhodopes orientales." },
    { n:"Plovdiv antique", bg:"Старият Пловдив (антична част)", cat:"thrace", lat:42.1494, lng:24.7535, d:"Théâtre romain, stade romain et forum au cœur de Plovdiv." },
    { n:"Nicopolis ad Istrum", bg:"Никополис ад Иструм", cat:"thrace", lat:43.2306, lng:25.6265, d:"Grande cité romaine fondée sous l'empereur Trajan." },
    { n:"Serdica", bg:"Сердика", cat:"thrace", lat:42.6975, lng:23.3219, d:"Complexe antique romain mis au jour sous le centre-ville de Sofia." },
    { n:"Pliska", bg:"Плиска", cat:"thrace", lat:43.3808, lng:27.1258, d:"Première capitale du Premier Empire bulgare." },
    { n:"Preslav", bg:"Преслав", cat:"thrace", lat:43.1667, lng:26.8167, d:"Deuxième capitale du Premier Empire, centre de l'Âge d'or culturel." },
    // Médiévale et orthodoxe
    { n:"Églises rupestres d'Ivanovo", bg:"Ивановски скални църкви", cat:"medieval", lat:43.5892, lng:25.9520, d:"Églises creusées dans la falaise, fresques du XIVe siècle (UNESCO)." },
    { n:"Monastère de Bachkovo", bg:"Бачковски манастир", cat:"medieval", lat:41.9308, lng:24.8377, d:"L'un des trois grands monastères historiques du pays." },
    { n:"Monastère de Troyan", bg:"Троянски манастир", cat:"medieval", lat:42.8898, lng:24.7167, d:"Troisième grand monastère national." },
    { n:"Monastère de Rozhen", bg:"Роженски манастир", cat:"medieval", lat:41.5333, lng:23.3833, d:"Près de Melnik, architecture en bois et pierre." },
    { n:"Église des Quarante-Martyrs", bg:"Църква Св. 40 мъченици", cat:"medieval", lat:43.0793, lng:25.6329, d:"Église liée au couronnement des tsars, à Veliko Tarnovo." },
    { n:"Église Sainte-Sophie", bg:"Църква Света София", cat:"medieval", lat:42.6952, lng:23.3243, d:"L'une des plus anciennes églises de Sofia, qui a donné son nom à la ville." },
    { n:"Rotonde Saint-Georges", bg:"Ротонда Свети Георги", cat:"medieval", lat:42.6967, lng:23.3219, d:"L'un des plus vieux édifices de Sofia, encore en activité." },
    // Forteresses
    { n:"Baba Vida", bg:"Крепост Баба Вида", cat:"fortress", lat:43.9973, lng:22.8770, d:"La forteresse la mieux conservée du pays, à Vidin." },
    { n:"Ovech", bg:"Крепост Овеч", cat:"fortress", lat:43.1814, lng:27.4361, d:"Forteresse près de Provadia." },
    { n:"Shumen", bg:"Крепост Шумен", cat:"fortress", lat:43.2712, lng:26.9515, d:"Forteresse médiévale surplombant la ville de Shumen." },
    { n:"Cherven", bg:"Крепост Червен", cat:"fortress", lat:43.6725, lng:25.9436, d:"Forteresse de la région de Ruse." },
    { n:"Peristera", bg:"Крепост Перистера", cat:"fortress", lat:41.9975, lng:24.2967, d:"Forteresse près de Peshtera." },
    { n:"Cap et forteresse de Kaliakra", bg:"Нос Калиакра", cat:"fortress", lat:43.3711, lng:28.4653, d:"Promontoire fortifié sur la côte de la mer Noire." },
    { n:"Porte de Trajan", bg:"Траянови врата", cat:"fortress", lat:42.2167, lng:23.9833, d:"Col fortifié entre Sofia et Plovdiv." },
    // Renaissance : villes-musées
    { n:"Koprivshtitsa", bg:"Копривщица", cat:"renaissance", lat:42.6167, lng:24.3500, d:"Ville-musée aux centaines de monuments de la Renaissance bulgare." },
    { n:"Vieille ville de Plovdiv", bg:"Възрожденски квартал", cat:"renaissance", lat:42.1505, lng:24.7550, d:"Maisons de la Renaissance bulgare et porte Hisar Kapia." },
    { n:"Tryavna", bg:"Трявна", cat:"renaissance", lat:42.8628, lng:25.4986, d:"Maisons de marchands, artisanat et sculpture sur bois." },
    { n:"Zheravna", bg:"Жеравна", cat:"renaissance", lat:42.8333, lng:26.5500, d:"Village historique aux maisons traditionnelles en bois." },
    { n:"Arbanasi", bg:"Арбанаси", cat:"renaissance", lat:43.0967, lng:25.6672, d:"Grandes maisons fortifiées et églises, près de Veliko Tarnovo." },
    { n:"Bozhentsi", bg:"Боженци", cat:"renaissance", lat:42.8306, lng:25.3153, d:"Village de montagne exceptionnellement bien conservé." },
    { n:"Melnik", bg:"Мелник", cat:"renaissance", lat:41.5230, lng:23.3890, d:"Maisons historiques et célèbres pyramides de grès." },
    { n:"Shiroka Laka", bg:"Широка Лъка", cat:"renaissance", lat:41.6083, lng:24.7364, d:"Architecture traditionnelle des Rhodopes." },
    // Sofia (autres sites)
    { n:"Théâtre national Ivan Vazov", bg:"Народен театър „Иван Вазов”", cat:"sofia", lat:42.6939, lng:23.3286, d:"Grand théâtre national de Sofia." },
    { n:"Assemblée nationale", bg:"Народно събрание", cat:"sofia", lat:42.6939, lng:23.3325, d:"Siège du parlement bulgare." },
    { n:"Palais royal", bg:"Царски дворец", cat:"sofia", lat:42.6941, lng:23.3288, d:"Ancienne résidence royale, au centre de Sofia." },
    { n:"Bains minéraux centraux", bg:"Централна минерална баня", cat:"sofia", lat:42.6971, lng:23.3219, d:"Bâtiment emblématique du centre de Sofia." },
    { n:"Pont aux Lions", bg:"Лъвов мост", cat:"sofia", lat:42.7047, lng:23.3193, d:"Pont historique de Sofia." },
    { n:"Pont aux Aigles", bg:"Орлов мост", cat:"sofia", lat:42.6789, lng:23.3411, d:"Pont historique de Sofia." },
    // XXe siècle et mémoire nationale
    { n:"Monument Alyosha", bg:"Паметник на Альоша", cat:"xxe", lat:42.1547, lng:24.7361, d:"Statue de 11 m d'un soldat soviétique dominant Plovdiv." },
    { n:"NDK — Palais national de la culture", bg:"Национален дворец на културата", cat:"xxe", lat:42.6829, lng:23.3186, d:"Grand palais national de la culture, à Sofia." },
    { n:"Monument Vasil Levski", bg:"Паметник на Васил Левски", cat:"xxe", lat:42.6944, lng:23.3244, d:"Élevé sur le lieu de l'exécution du héros national en 1873, à Sofia." },
    { n:"Palais de Balchik", bg:"Дворецът в Балчик", cat:"xxe", lat:43.4083, lng:28.1519, d:"Palais et jardin botanique construits pour la reine Marie de Roumanie." },
    // Autres monastères de Bulgarie
    { n:"Monastère de Shipka (Saint-Nicolas)", bg:"Шипченски манастир „Свети Николай”", cat:"monasteries", lat:42.7000, lng:25.3800, d:"Petit monastère dans les contreforts du Balkan, près de Kazanlak." },
    { n:"Monastère de Meglizh", bg:"Мъглижки манастир", cat:"monasteries", lat:42.6500, lng:25.4300, d:"Monastère médiéval de la région de Stara Zagora." },
    { n:"Monastère d'Arapovo (Sainte-Nedelya)", bg:"Араповски манастир „Света Неделя”", cat:"monasteries", lat:42.0200, lng:24.9500, d:"À l'est d'Assénovgrad, sur la route de Parvomay." },
    { n:"Monastère Saint-Jean-Baptiste", bg:"Манастир „Свети Йоан Предтеча”", cat:"monasteries", lat:41.9200, lng:24.8500, d:"Monastère rhodopéen dédié à saint Jean-Baptiste, près d'Assénovgrad." },
    { n:"Monastère rupestre de Basarbovo", bg:"Басарбовски скален манастир", cat:"monasteries", lat:43.7670, lng:25.9830, d:"Seul monastère rupestre encore habité de Bulgarie, près de Roussé." },
    { n:"Monastère patriarcal de la Sainte-Trinité", bg:"Патриаршески манастир „Света Троица”", cat:"monasteries", lat:43.0850, lng:25.6500, d:"Ancien siège du patriarcat bulgare, près de Veliko Tarnovo." },
    { n:"Monastère Saint-Nicolas (Gorna Oryahovitsa)", bg:"Горнооряховски манастир „Свети Никола”", cat:"monasteries", lat:43.1300, lng:25.7000, d:"Monastère proche de Gorna Oryahovitsa, région de Veliko Tarnovo." },
    { n:"Monastère de la Transfiguration", bg:"Преображенски манастир", cat:"monasteries", lat:43.1172, lng:25.6072, d:"L'un des cinq monastères stavropégiques de Bulgarie, près de Veliko Tarnovo." },
    { n:"Monastère des Saints-Pierre-et-Paul", bg:"Петропавловски манастир", cat:"monasteries", lat:43.1000, lng:25.7200, d:"Près de Lyaskovets, région de Veliko Tarnovo." },
    { n:"Monastère de Merdan", bg:"Мердански манастир", cat:"monasteries", lat:43.0000, lng:25.7500, d:"Petit monastère de la région de Veliko Tarnovo." },
    { n:"Monastère de Kilifarevo", bg:"Килифаревски манастир", cat:"monasteries", lat:42.9830, lng:25.5830, d:"Grand centre spirituel médiéval fondé par saint Théodose de Tarnovo." },
    { n:"Monastère de Kapinovo", bg:"Капиновски манастир", cat:"monasteries", lat:43.0330, lng:25.7170, d:"Monastère forestier près de Veliko Tarnovo." },
    { n:"Monastère de Plakovo", bg:"Плаковски манастир", cat:"monasteries", lat:43.0170, lng:25.6330, d:"Petit monastère de la région de Veliko Tarnovo." },
    { n:"Monastère de Dryanovo", bg:"Дряновски манастир „Свети Архангел Михаил”", cat:"monasteries", lat:42.9975, lng:25.4739, d:"Dans les gorges de Dryanovo, haut lieu de la lutte pour l'indépendance." },
    { n:"Monastère de Sokolski", bg:"Соколски манастир", cat:"monasteries", lat:42.9500, lng:25.2800, d:"Près de Gabrovo, connu pour sa cour pavée de galets blancs et noirs." },
    { n:"Monastère de Glojene", bg:"Гложенски манастир „Свети Георги”", cat:"monasteries", lat:43.0330, lng:24.2670, d:"Perché sur une colline près de Teteven." },
    { n:"Monastère de Klisura", bg:"Клисурски манастир „Св. Кирил и Методий”", cat:"monasteries", lat:43.1822, lng:23.2044, d:"Quatrième plus grand monastère du pays, dans le nord-ouest." },
    { n:"Monastère Sainte-Mina", bg:"Манастир „Света Мина”", cat:"monasteries", lat:42.5500, lng:23.2500, d:"Petit monastère au pied du Vitocha, près de Sofia." },
    { n:"Monastère de Kremikovtsi", bg:"Кремиковски манастир", cat:"monasteries", lat:42.7670, lng:23.4830, d:"Aux portes de Sofia, célèbre pour ses fresques du XVe siècle." },
    { n:"Monastère de German", bg:"Германски манастир", cat:"monasteries", lat:42.6500, lng:23.4500, d:"Près du village de German, à l'est de Sofia." },
    { n:"Monastère de Kokalyane", bg:"Кокалянски манастир", cat:"monasteries", lat:42.6170, lng:23.4170, d:"Dans la vallée de l'Iskar, au sud-est de Sofia." },
    { n:"Monastère de Dragalevtsi", bg:"Драгалевски манастир", cat:"monasteries", lat:42.6394, lng:23.3167, d:"Sur les pentes du Vitocha, aux portes de Sofia." },
    { n:"Église Saint-Étienne (région de Sofia)", bg:"Църква „Свети Стефан”", cat:"monasteries", lat:42.7000, lng:23.3200, d:"Petit sanctuaire des environs de Sofia." },
    { n:"Couvent Pokrov Bogorodichen", bg:"Манастир „Покров Богородичен”", cat:"monasteries", lat:42.6880, lng:23.3270, d:"Couvent orthodoxe situé en plein cœur de Sofia." },
    { n:"Monastère d'Etropole", bg:"Етрополски манастир „Света Троица”", cat:"monasteries", lat:42.8600, lng:23.9800, d:"Ancien centre culturel de l'école d'Etropole, dans le Balkan." },
    { n:"Monastère Sainte-Marina", bg:"Манастир „Света Марина”", cat:"monasteries", lat:43.4000, lng:27.7500, d:"Entre Dobrich et Varna, dans le nord-est du pays." },
    { n:"Monastère d'Aladja", bg:"Аладжа манастир", cat:"monasteries", lat:43.2780, lng:28.0151, d:"Monastère rupestre médiéval près de Varna, dans le parc des Sables d'or." },
    { n:"Église Saints-Constantin-et-Hélène", bg:"Църква „Св. св. Константин и Елена”", cat:"monasteries", lat:43.1670, lng:27.9670, d:"Dans la station balnéaire du même nom, au sud de Varna." },
    { n:"Monastère Saint-Panteleimon", bg:"Манастир „Свети Пантелеймон”", cat:"monasteries", lat:43.2500, lng:26.9500, d:"Au pied du plateau de Choumen." },
    { n:"Monastère de Golyam Bukovets", bg:"Голямобуковски манастир", cat:"monasteries", lat:43.1500, lng:26.8200, d:"Petit monastère de la région de Choumen." },
    { n:"Monastère de Gorno Ezerovo", bg:"Горноезеровски манастир", cat:"monasteries", lat:42.5330, lng:27.4000, d:"Près de Bourgas, sur la côte de la mer Noire." },
    { n:"Monastère de Lopushna", bg:"Лопушански манастир „Свети Иван Предтеча”", cat:"monasteries", lat:43.2830, lng:22.9670, d:"Dans les monts Berkovska, au nord-ouest du pays." },
    { n:"Monastère de Cherepish", bg:"Черепишки манастир", cat:"monasteries", lat:43.1700, lng:23.6200, d:"Dans les gorges de l'Iskar, près de Mezdra." },
    { n:"Monastère des Sept-Trônes", bg:"Манастир „Седемте престола”", cat:"monasteries", lat:43.0500, lng:23.5500, d:"Non loin de Cherepish, dans les gorges de l'Iskar." },

    // Macédoine du Nord
    { n:"Ohrid", bg:"Охрид", cat:"macedonia", lat:41.1231, lng:20.8016, d:"Ville historique au bord du lac d'Ohrid, avec de nombreuses églises, fresques et vestiges. La région d'Ohrid est inscrite au patrimoine mondial de l'UNESCO depuis 1979 pour ses valeurs naturelles, puis étendue aux valeurs culturelles en 1980." },
    { n:"Skopje", bg:"Скопје", cat:"macedonia", lat:41.9981, lng:21.4254, d:"Capitale et principal centre urbain du pays. À voir : le vieux bazar, la forteresse de Kale, le pont de pierre et la montagne Vodno." },
    { n:"Bitola", bg:"Битола", cat:"macedonia", lat:41.0297, lng:21.3347, d:"Ville du sud-ouest connue pour la rue Širok Sokak et le site antique d'Heraclea Lyncestis." },
    { n:"Matka", bg:"Кањон Матка", cat:"macedonia", lat:41.9533, lng:21.2967, d:"Canyon spectaculaire près de Skopje, apprécié pour ses falaises, ses grottes, ses sentiers et le lac artificiel créé par le barrage." },
    { n:"Mavrovo", bg:"Маврово", cat:"macedonia", lat:41.6867, lng:20.7494, d:"Parc national de montagne, connu pour ses paysages, ses forêts, son lac et ses activités de plein air." },
    { n:"Kruševo", bg:"Крушево", cat:"macedonia", lat:41.3697, lng:21.2483, d:"Ville de montagne associée à l'insurrection d'Ilinden de 1903 et à la République de Kruševo, épisode important de la mémoire nationale." },
    { n:"Kokino", bg:"Кокино", cat:"macedonia", lat:42.2667, lng:21.9833, d:"Site archéo-astronomique préhistorique situé au nord-est du pays et inscrit sur la liste indicative de l'UNESCO." },
    { n:"Galičnik", bg:"Галичник", cat:"macedonia", lat:41.5972, lng:20.6592, d:"Village de montagne des Mijaks, réputé pour son architecture traditionnelle, ses paysages et la fête du mariage de Galičnik." },

    // Monastères de Macédoine du Nord
    { n:"Monastère Saint-Jean Bigorski", bg:"Св. Јован Бигорски", cat:"mkmonast", lat:41.6006, lng:20.6139, d:"Près du parc national de Mavrovo : fondé au XIᵉ siècle, c'est l'un des centres spirituels les plus célèbres du pays. Il est réputé pour son exceptionnelle iconostase en bois sculpté." },
    { n:"Monastère Saint-Naum", bg:"Св. Наум", cat:"mkmonast", lat:40.9114, lng:20.7414, d:"Au bord du lac d'Ohrid : créé au Xe siècle par saint Naum, disciple de Cyrille et Méthode, il est un grand lieu de pèlerinage et l'un des sites les plus visités du pays." },
    { n:"Monastère d'Osogovo", bg:"Осоговски манастир", cat:"mkmonast", lat:42.1581, lng:22.5614, d:"Près de Kriva Palanka : fondé au XIIᵉ siècle, il est considéré comme l'un des monastères les plus importants de Macédoine du Nord, avec une architecture remarquable et de belles fresques." },
    { n:"Monastère de Treskavec", bg:"Трескавец", cat:"mkmonast", lat:41.3333, lng:21.5500, d:"Au-dessus de Prilep : perché dans les montagnes, il est célèbre pour son cadre spectaculaire et ses fresques médiévales." },
    { n:"Monastère de Lesnovo", bg:"Лесново", cat:"mkmonast", lat:42.0200, lng:22.1300, d:"Dans l'est du pays : un chef-d'œuvre de l'architecture serbo-byzantine du XIVᵉ siècle, connu pour ses fresques." },
    { n:"Monastère de Marko", bg:"Марков манастир", cat:"mkmonast", lat:41.9630, lng:21.4780, d:"Près de Skopje : fondé au XIVᵉ siècle, il conserve des fresques importantes de l'époque médiévale." },
    { n:"Monastère de Zrze", bg:"Зрзе", cat:"mkmonast", lat:41.4000, lng:21.5200, d:"Près de Prilep : moins connu, mais très important dans l'histoire spirituelle et artistique du pays." },

    // Forteresses de Macédoine du Nord
    { n:"Forteresse de Kale (Skopje)", bg:"Скопско Кале", cat:"mkfort", lat:42.0000, lng:21.4375, d:"La plus connue du pays, dominant la vieille ville de Skopje. Ses origines remontent à l'Antiquité et elle a été développée au Moyen Âge." },
    { n:"Forteresse de Samuel (Ohrid)", bg:"Самуилова тврдина", cat:"mkfort", lat:41.1131, lng:20.7950, d:"Probablement la plus spectaculaire. Elle domine entièrement la ville et le lac d'Ohrid. Elle est associée au tsar Samuel de Bulgarie (Xe–XIe siècles)." },
    { n:"Forteresse de Markovi Kuli (Prilep)", bg:"Маркови Кули", cat:"mkfort", lat:41.3550, lng:21.5730, d:"Impressionnante citadelle médiévale construite sur des formations rocheuses, près de Prilep. Les paysages sont particulièrement beaux." },
    { n:"Forteresse de Kitino Kale (Kičevo)", bg:"Китино Кале", cat:"mkfort", lat:41.5120, lng:20.9590, d:"Vestiges d'une ancienne fortification dominant la ville de Kičevo." },
    { n:"Forteresse de Vinica", bg:"Виничка тврдина", cat:"mkfort", lat:41.8800, lng:22.5100, d:"Fortifications anciennes situées au-dessus de Vinica, avec une histoire remontant à l'Antiquité tardive." },
    { n:"Forteresse de Štip (Isar)", bg:"Штипски Исар", cat:"mkfort", lat:41.7430, lng:22.1990, d:"Située sur une colline dominant Štip, avec des vestiges médiévaux." }
  ];

  let map = null, initedOnce = false;
  const catLayers = {};
  const catVisible = {};

  function buildLegend(){
    const host = document.getElementById("mon-legend");
    if(!host || host.childElementCount) return;
    Object.keys(MON_CATS).forEach(key=>{
      catVisible[key] = true;
      const c = MON_CATS[key];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mon-chip";
      btn.dataset.cat = key;
      btn.innerHTML = `<span class="dot" style="background:${c.color}"></span>${c.label}`;
      btn.addEventListener("click", ()=>{
        catVisible[key] = !catVisible[key];
        btn.classList.toggle("off", !catVisible[key]);
        if(!map || !catLayers[key]) return;
        if(catVisible[key]) map.addLayer(catLayers[key]);
        else map.removeLayer(catLayers[key]);
      });
      host.appendChild(btn);
    });
  }

  function initMonumentsMap(){
    buildLegend();
    if(initedOnce){
      setTimeout(()=>{ if(map) map.invalidateSize(); }, 50);
      return;
    }
    if(typeof L === "undefined") return; // Leaflet non chargé (pas de réseau)
    initedOnce = true;
    map = L.map("monuments-map", { scrollWheelZoom:false }).setView([42.4, 23.0], 6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
    }).addTo(map);

    Object.keys(MON_CATS).forEach(key=>{ catLayers[key] = L.layerGroup().addTo(map); });

    MONUMENTS.forEach(m=>{
      const color = MON_CATS[m.cat].color;
      const marker = L.circleMarker([m.lat, m.lng], {
        radius: 7, color: "#fff", weight: 1.5, fillColor: color, fillOpacity: .95
      });
      marker.bindPopup(`<div class="mon-pop"><b>${m.n}</b><br><span style="font-family:'PT Serif',Georgia,serif">${m.bg}</span><p>${m.d}</p></div>`);
      marker.addTo(catLayers[m.cat]);
    });

    setTimeout(()=>{ map.invalidateSize(); }, 60);
  }

  window.initMonumentsMap = initMonumentsMap;
  if(typeof navButtons !== "undefined"){
    navButtons.forEach(btn=>{
      btn.addEventListener("click", ()=>{
        if(btn.dataset.target === "monuments") initMonumentsMap();
      });
    });
  }
  // Si l'onglet Monuments est déjà actif au chargement de la page
  const monSection = document.getElementById("sec-monuments");
  if(monSection && monSection.classList.contains("active")) initMonumentsMap();
})();

/* ================= MACÉDOINE DU NORD ================= */
(function(){
  const root=document.getElementById('sec-macedonia');
  if(!root) return;
  const tabs=[...root.querySelectorAll('.mk-tab')];
  const panes=[...root.querySelectorAll('.mk-pane')];
  function showTab(name){
    tabs.forEach(b=>b.classList.toggle('active',b.dataset.mkTab===name));
    panes.forEach(p=>p.classList.toggle('active',p.id==='mk-'+name));
    if(name==='quiz') renderMkQuiz();
  }
  tabs.forEach(b=>b.addEventListener('click',()=>showTab(b.dataset.mkTab)));
  root.querySelectorAll('[data-mk-jump]').forEach(b=>b.addEventListener('click',()=>showTab(b.dataset.mkJump)));

  const QS=[
    {q:'Quelle est la capitale de la Macédoine du Nord ?',a:'Skopje',o:['Ohrid','Skopje','Bitola','Kruševo']},
    {q:'Quelle ville est située au bord du lac d’Ohrid ?',a:'Ohrid',o:['Ohrid','Štip','Veles','Kumanovo']},
    {q:'Que signifie « Благодарам » ?',a:'Merci',o:['Bonjour','Merci','Au revoir','Pardon']},
    {q:'Quel plat est composé principalement de haricots cuits au four ?',a:'Tavče gravče',o:['Pastrmajlija','Tavče gravče','Zelnik','Ajvar']},
    {q:'Quel alphabet utilise le macédonien standard ?',a:'Cyrillique',o:['Grec','Latin uniquement','Cyrillique','Géorgien']},
    {q:'En quelle année la Macédoine du Nord a-t-elle proclamé son indépendance ?',a:'1991',o:['1944','1974','1991','2001']},
    {q:'Quel site est inscrit au patrimoine mondial de l’UNESCO ?',a:'La région d’Ohrid',o:['Vodno','La région d’Ohrid','Štip','Kruševo']},
    {q:'« Носии » désigne principalement...',a:'les costumes traditionnels',o:['les danses','les costumes traditionnels','les plats de fête','les instruments']}
  ];
  let cur=QS.slice(), wrong=[], isRetry=false, qi=0, score=0, answered=false;
  const qEl=root.querySelector('#mk-quiz-question'), oEl=root.querySelector('#mk-quiz-options'), fEl=root.querySelector('#mk-quiz-feedback'), pEl=root.querySelector('#mk-quiz-progress'), next=root.querySelector('#mk-quiz-next'), retryBtn=root.querySelector('#mk-quiz-retry');
  function updRetry(){ retryBtn.disabled=!wrong.length; retryBtn.textContent=' Retravailler mes erreurs ('+wrong.length+')'; }
  function renderMkQuiz(){
    if(!qEl) return;
    updRetry();
    if(qi>=cur.length){
      const r=score/cur.length;
      pEl.textContent='Résultat'; qEl.textContent=`${score} / ${cur.length} — ${r>=.85?'Отлично ! Excellent !':r>=.6?'Многу добро ! Très bien !':'Продолжи ! Continue !'}`;
      oEl.innerHTML=''; fEl.textContent=wrong.length?'Clique sur « Retravailler mes erreurs » pour revoir uniquement les questions ratées.':'Tu peux recommencer pour consolider le vocabulaire.'; next.disabled=true; return;
    }
    const x=cur[qi]; answered=false; pEl.textContent=`Question ${qi+1} / ${cur.length}${isRetry?' (révision des erreurs)':''}`; qEl.textContent=x.q; fEl.textContent=''; next.disabled=true;
    oEl.innerHTML=x.o.map(v=>`<button type="button" class="mk-qopt" data-answer="${v.replace(/"/g,'&quot;')}">${v}</button>`).join('');
    oEl.querySelectorAll('.mk-qopt').forEach(btn=>btn.addEventListener('click',()=>{
      if(answered) return; answered=true; const ok=btn.dataset.answer===x.a; if(ok) score++; btn.classList.add(ok?'correct':'wrong');
      if(!ok && !wrong.includes(x)) wrong.push(x);
      oEl.querySelectorAll('.mk-qopt').forEach(b=>{if(b.dataset.answer===x.a)b.classList.add('correct');});
      fEl.textContent=ok?'✓ Bonne réponse !':'→ Bonne réponse : '+x.a; next.disabled=false; updRetry();
    }));
  }
  next.addEventListener('click',()=>{if(!answered)return;qi++;renderMkQuiz();});
  root.querySelector('#mk-quiz-restart').addEventListener('click',()=>{cur=QS.slice();wrong=[];isRetry=false;qi=0;score=0;renderMkQuiz();});
  retryBtn.addEventListener('click',()=>{
    if(!wrong.length) return;
    cur=shuffle(wrong).map(x=>({...x,o:shuffle(x.o)})); wrong=[]; isRetry=true; qi=0; score=0; renderMkQuiz();
  });
  renderMkQuiz();
})();

/* ================= MACÉDOINE DU NORD : VOCABULAIRE A1 + FLASHCARDS ================= */
const MK_A1={"cats":["Salutations, politesse, expressions essentielles","Présentations et informations personnelles","Questions et mots interrogatifs","Nombres","Temps : jours, mois, saisons","Famille et personnes","Corps et santé de base","Maison","Vêtements et objets personnels","Nourriture et boissons","Ville et services","Transport et voyage","Achats et argent","École, études, langues","Travail et professions","Loisirs et vie quotidienne","Animaux","Nature et météo","Couleurs","Adjectifs et descriptions","Adverbes et petits mots","Prépositions","Conjonctions et connecteurs","Verbes essentiels A1","Actions de communication","Formules A1 à savoir produire","Vocabulaire fonctionnel à reconnaître","Vocabulaire pour la routine quotidienne","Vocabulaire A1 supplémentaire utile","Mini-liste de mots à maîtriser automatiquement"],"e":[[0,"здраво","zdravo","salut / bonjour"],[0,"добро утро","dobro utro","bonjour (matin)"],[0,"добар ден","dobar den","bonjour"],[0,"добра вечер","dobra večer","bonsoir"],[0,"добра ноќ","dobra noḱ","bonne nuit"],[0,"довидување","doviduvanje","au revoir"],[0,"пријатно","prijatno","au revoir / bonne continuation"],[0,"чао","čao","salut / bye"],[0,"благодарам","blagodaram","merci"],[0,"многу благодарам","mnogu blagodaram","merci beaucoup"],[0,"молам","molam","s’il vous plaît / je vous en prie"],[0,"ве молам","ve molam","s’il vous plaît"],[0,"извини","izvini","pardon / désolé (tu)"],[0,"извинете","izvinete","pardon / excusez-moi"],[0,"нема проблем","nema problem","pas de problème"],[0,"нема на што","nema na što","de rien"],[0,"да","da","oui"],[0,"не","ne","non"],[0,"можеби","možebi","peut-être"],[0,"добро","dobro","bien / d’accord"],[0,"во ред","vo red","d’accord"],[0,"се разбира","se razbira","bien sûr"],[0,"помош!","pomoš!","au secours / à l’aide"],[0,"помогнете!","pomognete!","aidez-moi !"],[0,"честитки","čestitki","félicitations"],[0,"среќно","sreḱno","bonne chance"],[0,"наздравје","nazdravje","santé / à vos souhaits"],[0,"добредојдовте","dobredojdovte","bienvenue"],[1,"јас","jas","je / moi"],[1,"ти","ti","tu"],[1,"тој","toj","il"],[1,"таа","taa","elle"],[1,"тоа","toa","cela / il-elle neutre"],[1,"ние","nie","nous"],[1,"вие","vie","vous"],[1,"тие","tie","ils / elles"],[1,"мој","moj","mon"],[1,"моја","moja","ma"],[1,"мое","moe","mon/ma (neutre)"],[1,"мои","moi","mes"],[1,"твој","tvoj","ton"],[1,"твоја","tvoja","ta"],[1,"твое","tvoe","ton/ta (neutre)"],[1,"негов","negov","son / sa (à lui)"],[1,"нејзин","nejzin","son / sa (à elle)"],[1,"наш","naš","notre"],[1,"ваш","vaš","votre"],[1,"нивни","nivni","leur"],[1,"име","ime","prénom / nom"],[1,"презиме","prezime","nom de famille"],[1,"адреса","adresa","adresse"],[1,"телефон","telefon","téléphone"],[1,"број","broj","numéro"],[1,"електронска пошта","elektronska pošta","e-mail"],[1,"е-пошта","e-pošta","e-mail"],[1,"држава","država","pays / État"],[1,"град","grad","ville"],[1,"село","selo","village"],[1,"земја","zemja","pays / terre"],[1,"националност","nacionalnost","nationalité"],[1,"јазик","jazik","langue"],[1,"македонски","makedonski","macédonien"],[1,"француски","francuski","français"],[1,"англиски","angliski","anglais"],[1,"странец","stranec","étranger"],[1,"страна","strana","côté / étrangère (selon contexte)"],[1,"возраст","vozrast","âge"],[1,"година","godina","année"],[1,"роденден","rodenden","anniversaire"],[1,"роден","roden","né"],[1,"родена","rodena","née"],[1,"студент","student","étudiant"],[1,"студентка","studentka","étudiante"],[1,"ученик","učenik","élève"],[1,"ученичка","učenička","élève (f.)"],[1,"работник","rabotnik","travailleur"],[1,"работа","rabota","travail"],[1,"професија","profesija","profession"],[2,"што","što","quoi / que"],[2,"кој","koj","qui / lequel"],[2,"која","koja","laquelle"],[2,"кое","koe","lequel (neutre)"],[2,"кои","koi","lesquels"],[2,"кого","kogo","qui (objet)"],[2,"каде","kade","où"],[2,"од каде","od kade","d’où"],[2,"камо","kamo","vers où"],[2,"кога","koga","quand"],[2,"зошто","zošto","pourquoi"],[2,"како","kako","comment"],[2,"колку","kolku","combien"],[2,"дали","dali","est-ce que"],[2,"чиј","čij","à qui / de qui"],[2,"чија","čija","de qui"],[2,"чие","čie","de qui (neutre)"],[2,"чии","čii","de qui (pluriel)"],[2,"кој/која","koj/koja","quel / quelle"],[2,"каков","kakov","quel genre de"],[2,"каква","kakva","quelle sorte de"],[2,"таков","takov","tel / pareil"],[2,"нешто","nešto","quelque chose"],[2,"некој","nekoj","quelqu’un"],[2,"некогаш","nekogaš","parfois / autrefois"],[2,"никаде","nikade","nulle part"],[2,"ништо","ništo","rien"],[2,"никој","nikoj","personne"],[3,"нула","nula","zéro"],[3,"еден","eden","un"],[3,"два","dva","deux"],[3,"три","tri","trois"],[3,"четири","četiri","quatre"],[3,"пет","pet","cinq"],[3,"шест","šest","six"],[3,"седум","sedum","sept"],[3,"осум","osum","huit"],[3,"девет","devet","neuf"],[3,"десет","deset","dix"],[3,"единаесет","edinaeset","onze"],[3,"дванаесет","dvanaeset","douze"],[3,"тринаесет","trinaeset","treize"],[3,"четиринаесет","četirinaeset","quatorze"],[3,"петнаесет","petnaeset","quinze"],[3,"шеснаесет","šesnaeset","seize"],[3,"седумнаесет","sedumnaeset","dix-sept"],[3,"осумнаесет","osumnaeset","dix-huit"],[3,"деветнаесет","devetnaeset","dix-neuf"],[3,"дваесет","dvaeset","vingt"],[3,"триесет","trieset","trente"],[3,"четириесет","četirieset","quarante"],[3,"педесет","pedeset","cinquante"],[3,"шеесет","šeeset","soixante"],[3,"седумдесет","sedumdeset","soixante-dix"],[3,"осумдесет","osumdeset","quatre-vingts"],[3,"деведесет","devedeset","quatre-vingt-dix"],[3,"сто","sto","cent"],[3,"илјада","iljada","mille"],[3,"милион","milion","million"],[3,"прв","prv","premier"],[3,"прва","prva","première"],[3,"втор","vtor","deuxième"],[3,"втора","vtora","deuxième (f.)"],[3,"трет","tret","troisième"],[3,"третa","treta","troisième (f.)"],[3,"половина","polovina","moitié"],[3,"четвртина","četvrtina","quart"],[3,"пар","par","paire"],[3,"многу","mnogu","beaucoup"],[3,"малку","malku","peu / un peu"],[3,"повеќе","poveḱe","plus"],[3,"помалку","pomalku","moins"],[3,"сите","site","tous"],[3,"сè","sè","tout"],[3,"неколку","nekolku","quelques"],[3,"доволно","dovolno","assez"],[4,"ден","den","jour"],[4,"ноќ","noḱ","nuit"],[4,"утро","utro","matin"],[4,"пладне","pladne","midi"],[4,"попладне","popladne","après-midi"],[4,"вечер","večer","soir"],[4,"полноќ","polnoḱ","minuit"],[4,"час","čas","heure"],[4,"минута","minuta","minute"],[4,"секунда","sekunda","seconde"],[4,"недела","nedela","semaine / dimanche"],[4,"месец","mesec","mois"],[4,"година","godina","année"],[4,"денес","denes","aujourd’hui"],[4,"вчера","včera","hier"],[4,"утре","utre","demain"],[4,"завчера","zavčera","avant-hier"],[4,"задутре","zadutre","après-demain"],[4,"сега","sega","maintenant"],[4,"потоа","potoa","ensuite"],[4,"пред","pred","avant"],[4,"после","posle","après"],[4,"рано","rano","tôt"],[4,"доцна","docna","tard"],[4,"секогаш","sekogaš","toujours"],[4,"често","često","souvent"],[4,"понекогаш","ponekogaš","parfois"],[4,"ретко","retko","rarement"],[4,"никогаш","nikogaš","jamais"],[4,"понеделник","ponedelnik","lundi"],[4,"вторник","vtornik","mardi"],[4,"среда","sreda","mercredi"],[4,"четврток","četvrtok","jeudi"],[4,"петок","petok","vendredi"],[4,"сабота","sabota","samedi"],[4,"недела","nedela","dimanche"],[4,"јануари","januari","janvier"],[4,"февруари","fevruari","février"],[4,"март","mart","mars"],[4,"април","april","avril"],[4,"мај","maj","mai"],[4,"јуни","juni","juin"],[4,"јули","juli","juillet"],[4,"август","avgust","août"],[4,"септември","septemvri","septembre"],[4,"октомври","oktomvri","octobre"],[4,"ноември","noemvri","novembre"],[4,"декември","dekemvri","décembre"],[4,"пролет","prolet","printemps"],[4,"лето","leto","été"],[4,"есен","esen","automne"],[4,"зима","zima","hiver"],[4,"датум","datum","date"],[4,"календар","kalendar","calendrier"],[4,"часовник","časovnik","horloge / montre"],[5,"семејство","semejstvo","famille"],[5,"родител","roditel","parent"],[5,"татко","tatko","père"],[5,"мајка","majka","mère"],[5,"родители","roditeli","parents"],[5,"син","sin","fils"],[5,"ќерка","ḱerka","fille"],[5,"брат","brat","frère"],[5,"сестра","sestra","sœur"],[5,"баба","baba","grand-mère"],[5,"дедо","dedo","grand-père"],[5,"внук","vnuk","petit-fils"],[5,"внука","vnuka","petite-fille"],[5,"сопруг","soprug","mari"],[5,"сопруга","sopruga","épouse"],[5,"маж","maž","homme / mari"],[5,"жена","žena","femme"],[5,"дете","dete","enfant"],[5,"деца","deca","enfants"],[5,"момче","momče","garçon"],[5,"девојче","devojče","petite fille"],[5,"девојка","devojka","fille / jeune femme"],[5,"пријател","prijatel","ami"],[5,"пријателка","prijatelka","amie"],[5,"колега","kolega","collègue"],[5,"колешка","koleška","collègue (f.)"],[5,"сосед","sosed","voisin"],[5,"сосетка","sosetka","voisine"],[5,"луѓе","luǵe","gens"],[5,"човек","čovek","personne / homme"],[5,"господин","gospodin","monsieur"],[5,"госпоѓа","gospoǵa","madame"],[5,"госпоѓица","gospoǵica","mademoiselle"],[5,"бебе","bebe","bébé"],[6,"тело","telo","corps"],[6,"глава","glava","tête"],[6,"лице","lice","visage"],[6,"око","oko","œil"],[6,"очи","oči","yeux"],[6,"уво","uvo","oreille"],[6,"нос","nos","nez"],[6,"уста","usta","bouche"],[6,"заб","zab","dent"],[6,"јазик","jazik","langue"],[6,"врат","vrat","cou"],[6,"рамо","ramo","épaule"],[6,"рака","raka","bras / main"],[6,"дланка","dlanka","paume"],[6,"прст","prst","doigt"],[6,"нога","noga","jambe / pied"],[6,"стапало","stapalo","pied"],[6,"колено","koleno","genou"],[6,"стомак","stomak","ventre"],[6,"грб","grb","dos"],[6,"коса","kosa","cheveux"],[6,"кожа","koža","peau"],[6,"крв","krv","sang"],[6,"срце","srce","cœur"],[6,"здравје","zdravje","santé"],[6,"здрав","zdrav","sain"],[6,"болен","bolen","malade"],[6,"болка","bolka","douleur"],[6,"болест","bolest","maladie"],[6,"настинка","nastinka","rhume"],[6,"треска","treska","fièvre"],[6,"кашлица","kašlica","toux"],[6,"лекар","lekar","médecin"],[6,"доктор","doktor","docteur"],[6,"медицинска сестра","medicinska sestra","infirmière"],[6,"болница","bolnica","hôpital"],[6,"аптека","apteka","pharmacie"],[6,"лек","lek","médicament"],[6,"помош","pomoš","aide"],[6,"итно","itno","urgent"],[6,"боли","boli","faire mal"],[6,"чувствувам","čuvstvuvam","sentir / ressentir"],[7,"куќа","kuḱa","maison"],[7,"дом","dom","maison / foyer"],[7,"стан","stan","appartement"],[7,"зграда","zgrada","immeuble"],[7,"соба","soba","pièce / chambre"],[7,"дневна соба","dnevna soba","salon"],[7,"спална соба","spalna soba","chambre"],[7,"кујна","kujna","cuisine"],[7,"бања","banja","salle de bain"],[7,"тоалет","toalet","toilettes"],[7,"ходник","hodnik","couloir"],[7,"балкон","balkon","balcon"],[7,"градина","gradina","jardin"],[7,"двор","dvor","cour"],[7,"врата","vrata","porte"],[7,"прозорец","prozorec","fenêtre"],[7,"ѕид","dzid","mur"],[7,"под","pod","sol"],[7,"таван","tavan","plafond / grenier"],[7,"маса","masa","table"],[7,"стол","stol","chaise"],[7,"кревет","krevet","lit"],[7,"шкаф","škaf","armoire"],[7,"кауч","kauč","canapé"],[7,"софа","sofa","canapé"],[7,"ламба","lamba","lampe"],[7,"светло","svetlo","lumière"],[7,"клуч","kluč","clé"],[7,"телевизор","televizor","télévision"],[7,"радио","radio","radio"],[7,"фрижидер","frižider","réfrigérateur"],[7,"шпорет","šporet","cuisinière"],[7,"машина за перење","mašina za perenje","machine à laver"],[7,"чист","čist","propre"],[7,"валкан","valkan","sale"],[7,"отворен","otvoren","ouvert"],[7,"затворен","zatvoren","fermé"],[7,"внатре","vnatre","à l’intérieur"],[7,"надвор","nadvor","dehors"],[8,"облека","obleka","vêtements"],[8,"кошулa","košula","chemise"],[8,"маица","maica","T-shirt"],[8,"блуза","bluza","blouse / haut"],[8,"панталони","pantaloni","pantalon"],[8,"фармерки","farmerki","jean"],[8,"здолниште","zdolnište","jupe"],[8,"фустан","fustan","robe"],[8,"јакна","jakna","veste"],[8,"капут","kaput","manteau"],[8,"палто","palto","manteau"],[8,"џемпер","džemper","pull"],[8,"чевли","čevli","chaussures"],[8,"чевел","čevel","chaussure"],[8,"чорапи","čorapi","chaussettes"],[8,"шапка","šapka","bonnet / chapeau"],[8,"шешир","šešir","chapeau"],[8,"ракавици","rakavici","gants"],[8,"шал","šal","écharpe"],[8,"појас","pojas","ceinture"],[8,"чанта","čanta","sac"],[8,"ранец","ranec","sac à dos"],[8,"очила","očila","lunettes"],[8,"чадор","čador","parapluie"],[8,"џеб","džeb","poche"],[8,"боја","boja","couleur"],[8,"голем","golem","grand"],[8,"мал","mal","petit"],[9,"храна","hrana","nourriture"],[9,"пијалак","pijalak","boisson"],[9,"вода","voda","eau"],[9,"кафе","kafe","café"],[9,"чај","čaj","thé"],[9,"млеко","mleko","lait"],[9,"сок","sok","jus"],[9,"пиво","pivo","bière"],[9,"вино","vino","vin"],[9,"леб","leb","pain"],[9,"путер","puter","beurre"],[9,"сирење","sirenje","fromage"],[9,"јогурт","jogurt","yaourt"],[9,"јајце","jajce","œuf"],[9,"месо","meso","viande"],[9,"пилешко","pileško","poulet"],[9,"риба","riba","poisson"],[9,"колбас","kolbas","saucisse"],[9,"шунка","šunka","jambon"],[9,"ориз","oriz","riz"],[9,"тестенини","testenini","pâtes"],[9,"супа","supa","soupe"],[9,"салата","salata","salade"],[9,"сендвич","sendvič","sandwich"],[9,"пицa","pica","pizza"],[9,"торта","torta","gâteau"],[9,"колач","kolač","pâtisserie / gâteau"],[9,"чоколадо","čokolado","chocolat"],[9,"шеќер","šeḱer","sucre"],[9,"сол","sol","sel"],[9,"бибер","biber","poivre"],[9,"масло","maslo","huile"],[9,"овошје","ovošje","fruits"],[9,"јаболко","jabolko","pomme"],[9,"круша","kruša","poire"],[9,"банана","banana","banane"],[9,"портокал","portokal","orange"],[9,"лимон","limon","citron"],[9,"грозје","grozje","raisin"],[9,"лубеница","lubenica","pastèque"],[9,"зеленчук","zelenčuk","légumes"],[9,"домат","domat","tomate"],[9,"краставица","krastavica","concombre"],[9,"компир","kompir","pomme de terre"],[9,"морков","morkov","carotte"],[9,"кромид","kromid","oignon"],[9,"лук","luk","ail"],[9,"ресторан","restoran","restaurant"],[9,"кафеана","kafeana","café / taverne"],[9,"мени","meni","menu"],[9,"сметка","smetka","addition"],[9,"порција","porcija","portion"],[9,"чаша","čaša","verre / tasse"],[9,"шолја","šolja","tasse"],[9,"шише","šiše","bouteille"],[9,"чинија","činija","assiette / bol"],[9,"лажица","lažica","cuillère"],[9,"виљушка","viljuška","fourchette"],[9,"нож","nož","couteau"],[9,"вкусен","vkusen","délicieux / savoureux"],[9,"слатко","slatko","sucré"],[9,"солено","soleno","salé"],[9,"жешко","žeško","chaud / épicé selon contexte"],[9,"ладно","ladno","froid"],[10,"град","grad","ville"],[10,"село","selo","village"],[10,"улица","ulica","rue"],[10,"пат","pat","route / chemin"],[10,"плоштад","ploštad","place"],[10,"парк","park","parc"],[10,"центар","centar","centre"],[10,"продавница","prodavnica","magasin"],[10,"супермаркет","supermarket","supermarché"],[10,"пазар","pazar","marché"],[10,"банка","banka","banque"],[10,"пошта","pošta","poste"],[10,"полиција","policija","police"],[10,"полициска станица","policiska stanica","commissariat"],[10,"болница","bolnica","hôpital"],[10,"аптека","apteka","pharmacie"],[10,"училиште","učilište","école"],[10,"универзитет","univerzitet","université"],[10,"библиотека","biblioteka","bibliothèque"],[10,"музеј","muzej","musée"],[10,"кино","kino","cinéma"],[10,"театар","teatar","théâtre"],[10,"хотел","hotel","hôtel"],[10,"станица","stanica","gare / station"],[10,"автобуска станица","avtobuska stanica","gare routière"],[10,"железничка станица","železnička stanica","gare ferroviaire"],[10,"аеродром","aerodrom","aéroport"],[10,"црква","crkva","église"],[10,"џамија","džamija","mosquée"],[10,"тоалет","toalet","toilettes"],[10,"банкомат","bankomat","distributeur"],[10,"адреса","adresa","adresse"],[10,"влез","vlez","entrée"],[10,"излез","izlez","sortie"],[11,"автомобил","avtomobil","voiture"],[11,"кола","kola","voiture"],[11,"автобус","avtobus","bus"],[11,"воз","voz","train"],[11,"авион","avion","avion"],[11,"такси","taksi","taxi"],[11,"велосипед","velosiped","vélo"],[11,"мотор","motor","moto"],[11,"брод","brod","bateau"],[11,"карта","karta","billet / carte"],[11,"билет","bilet","billet"],[11,"пасош","pasoš","passeport"],[11,"багаж","bagaž","bagage"],[11,"куфер","kufer","valise"],[11,"седиште","sedište","siège"],[11,"перон","peron","quai"],[11,"станица","stanica","station / gare"],[11,"патување","patuvanje","voyage"],[11,"пат","pat","route"],[11,"пристигнување","pristignuvanje","arrivée"],[11,"поаѓање","poaǵanje","départ"],[11,"доаѓа","doaǵa","arrive / vient"],[11,"оди","odi","va"],[11,"лево","levo","gauche"],[11,"десно","desno","droite"],[11,"право","pravo","tout droit"],[11,"близу","blizu","près"],[11,"далеку","daleku","loin"],[11,"назад","nazad","en arrière / retour"],[11,"напред","napred","en avant"],[11,"овде","ovde","ici"],[11,"тука","tuka","ici"],[11,"таму","tamu","là-bas"],[11,"каде","kade","où"],[11,"извинете, каде е...?","izvinete, kade e...?","excusez-moi, où est... ?"],[11,"колку чини...?","kolku čini...?","combien coûte... ?"],[12,"купувам","kupuvam","acheter"],[12,"продавам","prodavam","vendre"],[12,"цена","cena","prix"],[12,"евтин","evtin","bon marché"],[12,"скап","skap","cher"],[12,"пари","pari","argent"],[12,"денар","denar","denar"],[12,"евро","evro","euro"],[12,"кредитна картичка","kreditna kartička","carte bancaire"],[12,"готовина","gotovina","espèces"],[12,"сметка","smetka","addition / facture"],[12,"касa","kasa","caisse"],[12,"касир","kasir","caissier"],[12,"продавач","prodavač","vendeur"],[12,"големина","golemina","taille"],[12,"килограм","kilogram","kilogramme"],[12,"грам","gram","gramme"],[12,"литар","litar","litre"],[12,"половина","polovina","moitié"],[12,"куп","kup","tas / pile"],[12,"парче","parče","morceau"],[12,"само","samo","seulement"],[12,"уште","ušte","encore"],[12,"повторно","povtorno","de nouveau"],[12,"сакам","sakam","vouloir / aimer"],[12,"не сакам","ne sakam","ne pas vouloir / aimer"],[12,"ми се допаѓа","mi se dopaga","ça me plaît"],[12,"не ми се допаѓа","ne mi se dopaga","ça ne me plaît pas"],[12,"може ли...?","može li...?","est-ce possible... ?"],[12,"имате ли...?","imate li...?","avez-vous... ?"],[13,"училиште","učilište","école"],[13,"ученик","učenik","élève"],[13,"наставник","nastavnik","enseignant"],[13,"наставничка","nastavnička","enseignante"],[13,"професор","profesor","professeur"],[13,"студент","student","étudiant"],[13,"универзитет","univerzitet","université"],[13,"час","čas","cours / heure"],[13,"лекција","lekcija","leçon"],[13,"домашна задача","domašna zadača","devoir"],[13,"книга","kniga","livre"],[13,"тетратка","tetratka","cahier"],[13,"страница","stranica","page"],[13,"збор","zbor","mot"],[13,"реченица","rečenica","phrase"],[13,"прашање","prašanje","question"],[13,"одговор","odgovor","réponse"],[13,"пример","primer","exemple"],[13,"тест","test","test"],[13,"испит","ispit","examen"],[13,"писмо","pismo","lettre"],[13,"пенкало","penkalo","stylo"],[13,"молив","moliv","crayon"],[13,"гума","guma","gomme"],[13,"хартија","hartija","papier"],[13,"табла","tabla","tableau"],[13,"чита","čita","lire"],[13,"пишува","pišuva","écrire"],[13,"слуша","sluša","écouter"],[13,"зборува","zboruva","parler"],[13,"разбира","razbira","comprendre"],[13,"преведува","preveduva","traduire"],[13,"учи","uči","apprendre / étudier"],[13,"знае","znae","savoir"],[13,"повторува","povtoruva","répéter"],[14,"работа","rabota","travail"],[14,"работи","raboti","travailler"],[14,"канцеларија","kancelarija","bureau"],[14,"фирма","firma","entreprise"],[14,"компанија","kompanija","société"],[14,"шеф","šef","chef / patron"],[14,"колега","kolega","collègue"],[14,"состанок","sostanok","réunion"],[14,"пауза","pauza","pause"],[14,"плата","plata","salaire"],[14,"професија","profesija","profession"],[14,"лекар","lekar","médecin"],[14,"наставник","nastavnik","enseignant"],[14,"професор","profesor","professeur"],[14,"инженер","inžener","ingénieur"],[14,"адвокат","advokat","avocat"],[14,"полицаец","policaec","policier"],[14,"продавач","prodavač","vendeur"],[14,"келнер","kelner","serveur"],[14,"готвач","gotvač","cuisinier"],[14,"возач","vozač","conducteur"],[14,"земјоделец","zemjodelec","agriculteur"],[14,"уметник","umetnik","artiste"],[14,"музичар","muzičar","musicien"],[15,"слободно време","slobodno vreme","temps libre"],[15,"музика","muzika","musique"],[15,"филм","film","film"],[15,"телевизија","televizija","télévision"],[15,"книга","kniga","livre"],[15,"спорт","sport","sport"],[15,"фудбал","fudbal","football"],[15,"кошарка","košarka","basket"],[15,"тенис","tenis","tennis"],[15,"пливање","plivanje","natation"],[15,"трчање","trčanje","course"],[15,"прошетка","prošetka","promenade"],[15,"игра","igra","jeu"],[15,"играчка","igračka","jouet"],[15,"фотографија","fotografija","photo"],[15,"песна","pesna","chanson"],[15,"концерт","koncert","concert"],[15,"празник","praznik","fête / jour férié"],[15,"одмор","odmor","vacances / repos"],[15,"викенд","vikend","week-end"],[15,"среќен","sreḱen","heureux"],[15,"тажен","tažen","triste"],[15,"уморен","umoren","fatigué"],[15,"досаден","dosaden","ennuyeux"],[15,"интересен","interesen","intéressant"],[16,"животно","životno","animal"],[16,"куче","kuče","chien"],[16,"мачка","mačka","chat"],[16,"птица","ptica","oiseau"],[16,"риба","riba","poisson"],[16,"коњ","konj","cheval"],[16,"крава","krava","vache"],[16,"свиња","svinja","cochon"],[16,"овца","ovca","mouton"],[16,"коза","koza","chèvre"],[16,"кокошка","kokoška","poule"],[16,"зајак","zajak","lapin"],[16,"глушец","glušec","souris"],[16,"мече","meče","ourson / petit ours"],[16,"лав","lav","lion"],[16,"тигар","tigar","tigre"],[16,"слон","slon","éléphant"],[16,"мајмун","majmun","singe"],[17,"природа","priroda","nature"],[17,"сонце","sonce","soleil"],[17,"месечина","mesečina","clair de lune"],[17,"ѕвезда","dzvezda","étoile"],[17,"небо","nebo","ciel"],[17,"облак","oblak","nuage"],[17,"дожд","dožd","pluie"],[17,"снег","sneg","neige"],[17,"ветер","veter","vent"],[17,"магла","magla","brouillard"],[17,"време","vreme","temps / météo"],[17,"топло","toplo","chaud"],[17,"ладно","ladno","froid"],[17,"свежо","svežo","frais"],[17,"врне","vrne","il pleut"],[17,"врне снег","vrne sneg","il neige"],[17,"сончево","sončevo","ensoleillé"],[17,"облачно","oblačno","nuageux"],[17,"дрво","drvo","arbre / bois"],[17,"цвет","cvet","fleur"],[17,"трева","treva","herbe"],[17,"шума","šuma","forêt"],[17,"планина","planina","montagne"],[17,"река","reka","rivière"],[17,"езеро","ezero","lac"],[17,"море","more","mer"],[17,"плажа","plaža","plage"],[17,"остров","ostrov","île"],[17,"земја","zemja","terre / sol"],[17,"камeн","kamen","pierre"],[18,"боја","boja","couleur"],[18,"црвен","crven","rouge"],[18,"црвена","crvena","rouge (f.)"],[18,"црно","crno","noir / noir neutre"],[18,"црн","crn","noir"],[18,"бел","bel","blanc"],[18,"бела","bela","blanche"],[18,"жолт","žolt","jaune"],[18,"зелен","zelen","vert"],[18,"син","sin","bleu"],[18,"светло син","svetlo sin","bleu clair"],[18,"темно син","temno sin","bleu foncé"],[18,"кафеав","kafeav","marron"],[18,"сив","siv","gris"],[18,"розов","rozov","rose"],[18,"портокалов","portokalov","orange"],[18,"виолетов","violetov","violet"],[19,"голем","golem","grand"],[19,"мал","mal","petit"],[19,"долг","dolg","long"],[19,"краток","kratok","court"],[19,"висок","visok","haut / grand"],[19,"низок","nizok","bas / petit"],[19,"млад","mlad","jeune"],[19,"стар","star","vieux / ancien"],[19,"нов","nov","nouveau"],[19,"добар","dobar","bon"],[19,"лош","loš","mauvais"],[19,"убав","ubav","beau"],[19,"грд","grd","laid"],[19,"лесен","lesen","facile"],[19,"тежок","težok","difficile / lourd"],[19,"брз","brz","rapide"],[19,"бавен","baven","lent"],[19,"топол","topol","chaud"],[19,"ладен","laden","froid"],[19,"чист","čist","propre"],[19,"валкан","valkan","sale"],[19,"отворен","otvoren","ouvert"],[19,"затворен","zatvoren","fermé"],[19,"полн","poln","plein"],[19,"празен","prazen","vide"],[19,"нов","nov","neuf / nouveau"],[19,"стар","star","vieux"],[19,"силен","silen","fort"],[19,"слаб","slab","faible / mince"],[19,"убав","ubav","joli / beau"],[19,"важен","važen","important"],[19,"готов","gotov","prêt"],[19,"зафатен","zafaten","occupé"],[19,"слободен","sloboden","libre"],[19,"среќен","sreḱen","heureux"],[19,"тажен","tažen","triste"],[19,"лут","lut","en colère"],[19,"исплашен","isplašen","effrayé"],[19,"изненаден","iznenaden","surpris"],[19,"уморен","umoren","fatigué"],[19,"гладен","gladen","affamé"],[19,"жеден","žeden","assoiffé"],[19,"болен","bolen","malade"],[19,"здрав","zdrav","en bonne santé"],[19,"богат","bogat","riche"],[19,"сиромашен","siromašen","pauvre"],[19,"скап","skap","cher"],[19,"евтин","evtin","bon marché"],[19,"интересен","interesen","intéressant"],[19,"досаден","dosaden","ennuyeux"],[19,"прав","prav","correct / droit"],[19,"погрешен","pogrešen","faux / incorrect"],[20,"многу","mnogu","beaucoup / très"],[20,"малку","malku","peu"],[20,"многу добро","mnogu dobro","très bien"],[20,"добро","dobro","bien"],[20,"лошо","lošo","mal"],[20,"тука","tuka","ici"],[20,"таму","tamu","là-bas"],[20,"овде","ovde","ici"],[20,"надвор","nadvor","dehors"],[20,"внатре","vnatre","dedans"],[20,"горе","gore","en haut"],[20,"долу","dolu","en bas"],[20,"лево","levo","à gauche"],[20,"десно","desno","à droite"],[20,"право","pravo","tout droit"],[20,"заедно","zaedno","ensemble"],[20,"сам","sam","seul"],[20,"веќе","veḱe","déjà"],[20,"сè уште","sè ušte","encore / toujours"],[20,"уште","ušte","encore"],[20,"само","samo","seulement"],[20,"можеби","možebi","peut-être"],[20,"навистина","navistina","vraiment"],[20,"секогаш","sekogaš","toujours"],[20,"често","često","souvent"],[20,"понекогаш","ponekogaš","parfois"],[20,"ретко","retko","rarement"],[20,"никогаш","nikogaš","jamais"],[20,"повторно","povtorno","de nouveau"],[20,"веднаш","vednaš","immédiatement"],[20,"речиси","rečisi","presque"],[20,"многу","mnogu","beaucoup"],[20,"доволно","dovolno","assez"],[20,"скоро","skoro","bientôt / presque"],[20,"далеку","daleku","loin"],[20,"близу","blizu","près"],[21,"во","vo","dans / en / à"],[21,"на","na","à / sur / de"],[21,"од","od","de / depuis"],[21,"до","do","jusqu’à / chez"],[21,"за","za","pour"],[21,"со","so","avec"],[21,"без","bez","sans"],[21,"кај","kaj","chez / auprès de"],[21,"пред","pred","devant / avant"],[21,"зад","zad","derrière / après"],[21,"над","nad","au-dessus de"],[21,"под","pod","sous"],[21,"меѓу","meǵu","entre"],[21,"покрај","pokraj","à côté de"],[21,"околу","okolu","autour de"],[21,"низ","niz","à travers"],[21,"преку","preku","à travers / par-dessus"],[21,"кон","kon","vers"],[21,"по","po","après / par / selon contexte"],[21,"наспроти","nasproti","en face de"],[22,"и","i","et"],[22,"а","a","et / tandis que / mais"],[22,"но","no","mais"],[22,"или","ili","ou"],[22,"затоа што","zatoa što","parce que"],[22,"бидејќи","bidejḱi","puisque / parce que"],[22,"ако","ako","si"],[22,"дека","deka","que"],[22,"кога","koga","quand"],[22,"додека","dodeka","pendant que"],[22,"па","pa","puis / alors"],[22,"затоа","zatoa","donc / c’est pourquoi"],[22,"значи","znači","donc / cela signifie"],[22,"исто така","isto taka","aussi"],[22,"само што","samo što","à peine / seulement"],[22,"прво","prvo","d’abord"],[22,"потоа","potoa","ensuite"],[22,"на крај","na kraj","à la fin"],[23,"сум","sum","être"],[23,"бидам","bidam","être / devenir"],[23,"имам","imam","avoir"],[23,"немам","nemam","ne pas avoir"],[23,"можам","možam","pouvoir"],[23,"сакам","sakam","vouloir / aimer"],[23,"треба","treba","devoir / falloir"],[23,"морам","moram","devoir / être obligé"],[23,"знам","znam","savoir"],[23,"разбирам","razbiram","comprendre"],[23,"зборувам","zboruvam","parler"],[23,"кажувам","kažuvam","dire / raconter"],[23,"прашувам","prašuvam","demander"],[23,"одговарам","odgovaram","répondre"],[23,"викам","vikam","appeler / dire"],[23,"се викам","se vikam","s’appeler"],[23,"живеам","živeam","habiter / vivre"],[23,"доаѓам","doaǵam","venir"],[23,"одам","odam","aller"],[23,"влегувам","vleguvam","entrer"],[23,"излегувам","izleguvam","sortir"],[23,"се враќам","se vraḱam","revenir"],[23,"останувам","ostanuvam","rester"],[23,"седам","sedam","être assis / rester"],[23,"станувам","stanuvam","se lever / devenir"],[23,"чекам","čekam","attendre"],[23,"барам","baram","chercher / demander"],[23,"наоѓам","naoǵam","trouver"],[23,"гледам","gledam","voir / regarder"],[23,"слушам","slušam","écouter"],[23,"читам","čitam","lire"],[23,"пишувам","pišuvam","écrire"],[23,"учам","učam","apprendre / étudier"],[23,"работам","rabotam","travailler"],[23,"правам","pravam","faire"],[23,"користам","koristam","utiliser"],[23,"купувам","kupuvam","acheter"],[23,"плаќам","plaḱam","payer"],[23,"продавам","prodavam","vendre"],[23,"јадам","jadam","manger"],[23,"пијам","pijam","boire"],[23,"готвам","gotvam","cuisiner"],[23,"сакам","sakam","aimer / vouloir"],[23,"спијам","spijam","dormir"],[23,"живеам","živeam","vivre / habiter"],[23,"се будам","se budam","se réveiller"],[23,"се туширам","se tuširam","se doucher"],[23,"се мијам","se mijam","se laver"],[23,"облекувам","oblekuvam","habiller / mettre"],[23,"носи","nosi","porter"],[23,"отворам","otvoram","ouvrir"],[23,"затворам","zatvoram","fermer"],[23,"вклучувам","vklučuvam","allumer / mettre en marche"],[23,"исклучувам","isklučuvam","éteindre"],[23,"почнувам","počnuvam","commencer"],[23,"завршувам","završuvam","finir"],[23,"помагам","pomagam","aider"],[23,"потребно е","potrebno e","il faut"],[23,"чувствувам","čuvstvuvam","sentir"],[23,"мислам","mislam","penser"],[23,"верувам","veruvam","croire"],[23,"заборавам","zaboravam","oublier"],[23,"се сеќавам","se seḱavam","se souvenir"],[23,"заборави","zaboravi","oublier / oublie"],[23,"зборува","zboruva","parler"],[23,"играм","igram","jouer"],[23,"пливам","plivam","nager"],[23,"трчам","trčam","courir"],[23,"патувам","patuvam","voyager"],[23,"возам","vozam","conduire"],[23,"летам","letam","voler"],[23,"шетам","šetam","se promener"],[23,"се среќавам","se sreḱavam","rencontrer"],[23,"запознавам","zapoznavam","faire connaissance"],[23,"сакам да","sakam da","je veux"],[23,"можам да","možam da","je peux"],[23,"треба да","treba da","je dois / il faut que"],[23,"морам да","moram da","je dois"],[24,"кажи","kaži","dis"],[24,"кажете","kažete","dites"],[24,"повтори","povtori","répète"],[24,"повторете","povtorete","répétez"],[24,"зборувајте побавно","zboruvajte pobavno","parlez plus lentement"],[24,"не разбирам","ne razbiram","je ne comprends pas"],[24,"разбирам","razbiram","je comprends"],[24,"не знам","ne znam","je ne sais pas"],[24,"не зборувам добро македонски","ne zboruvam dobro makedonski","je ne parle pas bien macédonien"],[24,"зборувате ли англиски?","zboruvate li angliski?","parlez-vous anglais ?"],[24,"што значи...?","što znači...?","que signifie... ?"],[24,"како се вели...?","kako se veli...?","comment dit-on... ?"],[24,"како се пишува...?","kako se pišuva...?","comment cela s’écrit-il ?"],[24,"може ли да повторите?","može li da povtorite?","pouvez-vous répéter ?"],[24,"може ли побавно?","može li pobavno?","plus lentement, s’il vous plaît ?"],[24,"што е ова?","što e ova?","qu’est-ce que c’est ?"],[24,"кој е тој?","koj e toj?","qui est-il ?"],[24,"каде е...?","kade e...?","où est... ?"],[24,"колку чини...?","kolku čini...?","combien coûte... ?"],[24,"имате ли...?","imate li...?","avez-vous... ?"],[24,"како се викаш?","kako se vikaš?","comment t’appelles-tu ?"],[24,"како се викате?","kako se vikate?","comment vous appelez-vous ?"],[24,"од каде си?","od kade si?","d’où viens-tu ?"],[24,"од каде сте?","od kade ste?","d’où êtes-vous ?"],[24,"каде живееш?","kade živeeš?","où habites-tu ?"],[24,"што работиш?","što rabotiš?","que fais-tu comme travail ?"],[24,"колку години имаш?","kolku godini imaš?","quel âge as-tu ?"],[24,"што правиш?","što praviš?","qu’est-ce que tu fais ?"],[24,"што сакаш?","što sakaš?","qu’est-ce que tu veux / aimes ?"],[25,"Јас сум од Франција.","Jas sum od Francija.","Je viens de France."],[25,"Живеам во ...","Živeam vo ...","J’habite à ..."],[25,"Се викам ...","Se vikam ...","Je m’appelle ..."],[25,"Имам ... години.","Imam ... godini.","J’ai ... ans."],[25,"Зборувам француски.","Zboruvam francuski.","Je parle français."],[25,"Малку зборувам македонски.","Malku zboruvam makedonski.","Je parle un peu macédonien."],[25,"Не разбирам.","Ne razbiram.","Je ne comprends pas."],[25,"Може ли да помогнете?","Može li da pomognete?","Pouvez-vous aider ?"],[25,"Каде е тоалетот?","Kade e toaletot?","Où sont les toilettes ?"],[25,"Каде е станицата?","Kade e stanicata?","Où est la gare ?"],[25,"Колку чини ова?","Kolku čini ova?","Combien coûte ceci ?"],[25,"Сакам вода.","Sakam voda.","Je veux de l’eau."],[25,"Ќе земам кафе.","Ḱe zemam kafe.","Je vais prendre un café."],[25,"Имам резервација.","Imam rezervacija.","J’ai une réservation."],[25,"Сметката, ве молам.","Smetkata, ve molam.","L’addition, s’il vous plaît."],[25,"Помош!","Pomoš!","À l’aide !"],[25,"Не знам.","Ne znam.","Je ne sais pas."],[25,"Не можам.","Ne možam.","Je ne peux pas."],[25,"Можам.","Možam.","Je peux."],[25,"Сакам да ...","Sakam da ...","Je veux ..."],[25,"Треба да ...","Treba da ...","Je dois / il faut que ..."],[25,"Утре ќе одам ...","Utre ḱe odam ...","Demain, j’irai ..."],[25,"Вчера бев ...","Včera bev ...","Hier, j’étais ..."],[25,"Ми се допаѓа.","Mi se dopaga.","Ça me plaît."],[25,"Не ми се допаѓа.","Ne mi se dopaga.","Ça ne me plaît pas."],[25,"Ова е ...","Ova e ...","C’est ..."],[25,"Тоа е ...","Toa e ...","C’est cela / ça, c’est ..."],[25,"Ова не е ...","Ova ne e ...","Ce n’est pas ..."],[25,"Има ...","Ima ...","Il y a ..."],[25,"Нема ...","Nema ...","Il n’y a pas ..."],[25,"Каде има ...?","Kade ima ...?","Où y a-t-il ... ?"],[25,"Имам проблем.","Imam problem.","J’ai un problème."],[25,"Ми треба помош.","Mi treba pomoš.","J’ai besoin d’aide."],[25,"Добро сум.","Dobro sum.","Je vais bien."],[25,"Не се чувствувам добро.","Ne se čuvstvuvam dobro.","Je ne me sens pas bien."],[26,"ова","ova","ceci / cette chose"],[26,"тоа","toa","cela"],[26,"овој","ovoj","ce/cet"],[26,"оваа","ovaa","cette"],[26,"овие","ovie","ces"],[26,"тој","toj","ce / cet homme"],[26,"таа","taa","cette femme / elle"],[26,"тие","tie","ceux / celles / ils"],[26,"еден","eden","un"],[26,"некој","nekoj","quelqu’un"],[26,"нешто","nešto","quelque chose"],[26,"сите","site","tous"],[26,"секој","sekoj","chaque"],[26,"друг","drug","autre"],[26,"ист","ist","même"],[26,"свој","svoj","son propre"],[26,"цел","cel","entier"],[26,"следен","sleden","suivant"],[26,"последен","posleden","dernier"],[26,"прв","prv","premier"],[27,"будење","budenje","réveil / fait de se réveiller"],[27,"утро","utro","matin"],[27,"станувам","stanuvam","se lever"],[27,"се мијам","se mijam","se laver"],[27,"се туширам","se tuširam","se doucher"],[27,"се облекувам","se oblekuvam","s’habiller"],[27,"појадок","pojadok","petit-déjeuner"],[27,"ручек","ruček","déjeuner"],[27,"вечера","večera","dîner"],[27,"спијам","spijam","dormir"],[27,"работа","rabota","travail"],[27,"училиште","učilište","école"],[27,"пауза","pauza","pause"],[27,"враќање","vraḱanje","retour"],[27,"дома","doma","à la maison"],[27,"денес","denes","aujourd’hui"],[27,"утре","utre","demain"],[27,"вчера","včera","hier"],[28,"работа","rabota","chose / affaire (selon contexte)"],[28,"проблем","problem","problème"],[28,"идеја","ideja","idée"],[28,"прашање","prašanje","question"],[28,"одговор","odgovor","réponse"],[28,"име","ime","nom / prénom"],[28,"збор","zbor","mot"],[28,"јазик","jazik","langue"],[28,"приказна","prikazna","histoire / récit"],[28,"фотографија","fotografija","photo"],[28,"адреса","adresa","adresse"],[28,"порака","poraka","message"],[28,"писмо","pismo","lettre"],[28,"подарок","podarok","cadeau"],[28,"пари","pari","argent"],[28,"среќа","sreḱa","chance / bonheur"],[28,"време","vreme","temps"],[28,"место","mesto","place / endroit"],[28,"место","mesto","endroit"],[28,"пат","pat","chemin"],[28,"дел","del","partie"],[28,"пат","pat","fois"],[28,"потреба","potreba","besoin"],[28,"причина","pričina","raison"],[28,"почеток","početok","début"],[28,"крај","kraj","fin"],[28,"сега","sega","maintenant"],[28,"наскоро","naskoro","bientôt"],[28,"заедно","zaedno","ensemble"],[28,"сам","sam","seul"],[29,"да","da","oui"],[29,"не","ne","non"],[29,"и","i","et"],[29,"но","no","mais"],[29,"или","ili","ou"],[29,"ако","ako","si"],[29,"што","što","quoi"],[29,"кој","koj","qui"],[29,"каде","kade","où"],[29,"кога","koga","quand"],[29,"зошто","zošto","pourquoi"],[29,"како","kako","comment"],[29,"колку","kolku","combien"],[29,"ова","ova","ceci"],[29,"тоа","toa","cela"],[29,"тука","tuka","ici"],[29,"таму","tamu","là"],[29,"сега","sega","maintenant"],[29,"денес","denes","aujourd’hui"],[29,"утре","utre","demain"],[29,"вчера","včera","hier"],[29,"многу","mnogu","beaucoup"],[29,"малку","malku","peu"],[29,"добро","dobro","bien"],[29,"лошо","lošo","mal"],[29,"може","može","pouvoir / il est possible"],[29,"има","ima","il y a / avoir"],[29,"нема","nema","il n’y a pas / ne pas avoir"],[29,"сакам","sakam","je veux / j’aime"],[29,"не сакам","ne sakam","je ne veux pas / je n’aime pas"],[29,"имам","imam","j’ai"],[29,"немам","nemam","je n’ai pas"],[29,"сум","sum","je suis"],[29,"не сум","ne sum","je ne suis pas"],[29,"можам","možam","je peux"],[29,"не можам","ne možam","je ne peux pas"],[29,"знам","znam","je sais"],[29,"не знам","ne znam","je ne sais pas"],[29,"разбирам","razbiram","je comprends"],[29,"не разбирам","ne razbiram","je ne comprends pas"],[29,"благодарам","blagodaram","merci"],[29,"молам","molam","s’il vous plaît / de rien"],[29,"извинете","izvinete","excusez-moi"],[29,"здраво","zdravo","bonjour / salut"],[29,"довидување","doviduvanje","au revoir"]]};
(function(){
  const root=document.getElementById('sec-macedonia');
  if(!root) return;
  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');

  /* ---- Liste complète (onglet Vocabulaire) ---- */
  const list=root.querySelector('#mk-vlist'), search=root.querySelector('#mk-vsearch'), count=root.querySelector('#mk-vcount'), total=root.querySelector('#mk-vtotal');
  if(list){
    total.textContent='('+MK_A1.e.length+' mots)';
    list.innerHTML=MK_A1.cats.map((name,ci)=>{
      const rows=MK_A1.e.filter(x=>x[0]===ci);
      return `<details class="info-card" data-ci="${ci}"><summary>${ci+1}. ${esc(name)} <span style="font-weight:400;font-size:.85rem;color:var(--muted2);">${rows.length}</span></summary><div class="mk-vtab-wrap"><table class="mk-vtab"><tbody>${rows.map(r=>`<tr data-k="${esc(norm(r[1]+' '+r[2]+' '+r[3]))}"><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('')}</tbody></table></div></details>`;
    }).join('');
    function filter(){
      const q=norm(search.value.trim()); let n=0;
      list.querySelectorAll('details').forEach(d=>{
        let shown=0;
        d.querySelectorAll('tr').forEach(tr=>{const ok=!q||tr.dataset.k.includes(q); tr.style.display=ok?'':'none'; if(ok)shown++;});
        d.style.display=shown?'':'none';
        if(q) d.open=true; else d.open=false;
        n+=shown;
      });
      count.textContent=q?`${n} résultat${n>1?'s':''}`:'';
    }
    search.addEventListener('input',filter);
  }

  /* ---- Flashcards ---- */
  if(!root.querySelector('#mk-flashcards')) return;
  const CATS={
    all:{label:' Tout'},
    a1:{label:' Vocabulaire A1'},
    places:{label:' Lieux'},
    food:{label:' Cuisine'},
    hist:{label:' Histoire & langue'},
    nosiya:{label:' Носии'}
  };
  const CU=[
    ['places','Capitale du pays','Скопје','Skopje — vieux bazar, forteresse de Kale, mont Vodno'],
    ['places',"Ville historique au bord du lac (UNESCO)",'Охрид','Ohrid'],
    ['places','Ville du sud-ouest, rue Širok Sokak, site d’Heraclea Lyncestis','Битола','Bitola'],
    ['places','Canyon spectaculaire près de Skopje','Кањон Матка','Matka'],
    ['places','Parc national de montagne avec un lac','Маврово','Mavrovo'],
    ['places','Ville de montagne liée à l’insurrection d’Ilinden (1903)','Крушево','Kruševo'],
    ['places','Site archéo-astronomique préhistorique du nord-est','Кокино','Kokino'],
    ['places','Village de montagne des Mijaks, fête du mariage','Галичник','Galičnik'],
    ['food','Haricots cuits au four dans un plat en terre cuite','Тавче гравче','Tavče gravče'],
    ['food','Préparation de poivrons rouges grillés (conserve d’hiver)','Ајвар','Ajvar — très répandu dans les Balkans'],
    ['food','Préparation de légumes (poivrons, tomates)','Пинџур','Pindžur'],
    ['food','Grande pâte ovale garnie de viande (Štip, Veles)','Пастрмајлија','Pastrmajlija'],
    ['food','Tourte de pâte fine (fromage, poireaux, épinards…)','Зелник','Zelnik'],
    ['food',"Truite du lac d’Ohrid",'Охридска пастрмка','Ohridska pastrmka'],
    ['food','Salade tomates, concombre, poivron, fromage blanc','Шопска салата','Šopska salata — commune à plusieurs pays des Balkans'],
    ['food','Café préparé dans un petit récipient','Турско кафе','Tursko kafe — héritage ottoman partagé'],
    ['hist','Langue du pays','Македонски','makedonski — langue slave méridionale, alphabet cyrillique'],
    ['hist','Deux lettres spécifiques du macédonien standard','Ѓ ѓ et Ќ ќ','gj et kj (translittération indicative)'],
    ['hist','Année de l’indépendance','1991','Référendum, sortie progressive de la Yougoslavie'],
    ['hist','Année d’entrée à l’ONU','1993','Sous une appellation provisoire'],
    ['hist','Nom constitutionnel depuis l’accord de Prespa (2018–2019)','Република Северна Македонија','Republika Severna Makedonija'],
    ['hist','Centre religieux et littéraire slave médiéval au bord du lac','Охрид','Ohrid — tradition de Clément d’Ohrid'],
    ['nosiya','Costumes traditionnels','Носии','nosii'],
    ['nosiya','Broderie','Вез','vez'],
    ['nosiya','Laine','Волна','volna'],
    ['nosiya','Tablier','Прегача','pregača']
  ].map(x=>({cat:x[0],fr:x[1],mk:x[2],sub:x[3],tag:CATS[x[0]].label}));
  const A1=MK_A1.e.map(x=>({cat:'a1',theme:x[0],fr:x[3],mk:x[1],sub:x[2],tag:' '+MK_A1.cats[x[0]]}));
  const D=CU.concat(A1).map((c,i)=>(c.id=i,c));

  const card=root.querySelector('#mk-fc-card'), front=root.querySelector('#mk-fc-front'), back=root.querySelector('#mk-fc-back'), sub=root.querySelector('#mk-fc-sub');
  const tagF=root.querySelector('#mk-fc-tag-front'), tagB=root.querySelector('#mk-fc-tag-back');
  const endEl=root.querySelector('#mk-fc-end'), ctrl=root.querySelector('#mk-fc-controls'), prog=root.querySelector('#mk-fc-progress'), chipsEl=root.querySelector('#mk-fc-chips');
  const themeSel=root.querySelector('#mk-fc-theme');
  let cat='all', theme='all', deck=[], pos=0, flipped=false, done=false;
  const known=new Set();
  const missed=new Set();
  const retryBar=root.querySelector('#mk-fc-retry-bar'), retryBtn=root.querySelector('#mk-fc-retry');
  function updRetry(){ retryBtn.disabled=missed.size===0; retryBtn.textContent=' Retravailler mes erreurs ('+missed.size+')'; }

  themeSel.innerHTML='<option value="all">Tous les thèmes ('+A1.length+' mots)</option>'+MK_A1.cats.map((n,i)=>`<option value="${i}">${i+1}. ${esc(n)} (${A1.filter(c=>c.theme===i).length})</option>`).join('');
  themeSel.addEventListener('change',()=>{theme=themeSel.value;build();render();});

  function build(){
    deck=D.filter(c=>(cat==='all'||c.cat===cat)&&(cat!=='a1'||theme==='all'||c.theme===+theme));
    pos=0; done=false; missed.clear(); setFlip(false);
  }
  function setFlip(v){ flipped=v; card.classList.toggle('flipped',v); }
  function renderChips(){
    chipsEl.innerHTML=Object.keys(CATS).map(k=>{
      const n=D.filter(c=>k==='all'||c.cat===k).length;
      return `<button type="button" class="mk-tab${k===cat?' active':''}" data-fc="${k}">${CATS[k].label} (${n})</button>`;
    }).join('');
    themeSel.style.display=cat==='a1'?'':'none';
    chipsEl.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{cat=b.dataset.fc;build();renderChips();render();}));
  }
  function render(){
    retryBar.style.display=(deck.length&&!done)?'':'none';
    if(!deck.length){ card.style.display='none'; ctrl.style.display='none'; endEl.style.display=''; endEl.textContent='Aucune carte dans cette sélection.'; prog.textContent=''; return; }
    if(done){
      const n=deck.filter(c=>known.has(c.id)).length;
      card.style.display='none'; ctrl.style.display='none'; endEl.style.display='';
      endEl.innerHTML=`<strong>Tour terminé !</strong><p>${n} / ${deck.length} cartes maîtrisées.</p><div class="card-controls" style="justify-content:center;"><button type="button" class="action primary" id="mk-fc-again">↻ Recommencer</button>${n<deck.length?'<button type="button" class="action ghost" id="mk-fc-weak"> Revoir les cartes à revoir</button>':''}</div>`;
      endEl.querySelector('#mk-fc-again').addEventListener('click',()=>{build();render();});
      const w=endEl.querySelector('#mk-fc-weak');
      if(w) w.addEventListener('click',()=>{deck=deck.filter(c=>!known.has(c.id));pos=0;done=false;setFlip(false);render();});
      prog.textContent='';
      return;
    }
    card.style.display=''; ctrl.style.display=''; endEl.style.display='none';
    const c=deck[pos];
    setFlip(false);
    front.textContent=c.fr; back.textContent=c.mk; sub.textContent=c.sub||'';
    tagF.textContent=c.tag; tagB.textContent=c.tag;
    const n=deck.filter(x=>known.has(x.id)).length;
    prog.textContent=`Carte ${pos+1} / ${deck.length} — maîtrisées : ${n}`;
    updRetry();
  }
  function step(d){
    if(!deck.length) return;
    const np=pos+d;
    if(np<0) return;
    if(np>=deck.length){ done=true; render(); return; }
    pos=np; render();
  }
  card.addEventListener('click',()=>setFlip(!flipped));
  root.querySelector('#mk-fc-prev').addEventListener('click',()=>step(-1));
  root.querySelector('#mk-fc-next').addEventListener('click',()=>step(1));
  root.querySelector('#mk-fc-know').addEventListener('click',()=>{if(deck.length){known.add(deck[pos].id);missed.delete(deck[pos].id);step(1);}});
  root.querySelector('#mk-fc-dontknow').addEventListener('click',()=>{if(deck.length){known.delete(deck[pos].id);missed.add(deck[pos].id);step(1);}});
  retryBtn.addEventListener('click',()=>{
    if(!missed.size) return;
    deck=deck.filter(c=>missed.has(c.id)); missed.clear(); pos=0; done=false; setFlip(false); render();
  });
  root.querySelector('#mk-fc-shuffle').addEventListener('click',()=>{
    for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}
    pos=0; done=false; render();
  });
  build(); renderChips(); render();
})();

/* ---- Macédoine : histoire détaillée (tout ouvrir / replier) ---- */
(function(){
  const o=document.getElementById('mk-h-open'), c=document.getElementById('mk-h-close'), l=document.getElementById('mk-hlist');
  if(!o||!c||!l) return;
  o.addEventListener('click',()=>l.querySelectorAll('details').forEach(d=>d.open=true));
  c.addEventListener('click',()=>l.querySelectorAll('details').forEach(d=>d.open=false));
})();

/* ---------------- RÉGIONS ---------------- */
(function(){
  const sec = document.getElementById("sec-regions");
  if(!sec) return;
  sec.querySelectorAll(".rg-chip").forEach(ch=>{
    ch.addEventListener("click", ()=>{
      const d = document.getElementById("rg-"+ch.dataset.rg);
      if(!d) return;
      d.open = true;
      d.scrollIntoView({behavior:"smooth", block:"start"});
    });
  });
  const lb = document.createElement("div");
  lb.id = "rg-lightbox";
  lb.innerHTML = '<img alt="Carte culturelle de la Bulgarie (agrandie)">';
  document.body.appendChild(lb);
  const small = document.getElementById("rg-map-img");
  small.addEventListener("click", ()=>{ lb.querySelector("img").src = small.src; lb.classList.add("open"); });
  lb.addEventListener("click", ()=> lb.classList.remove("open"));
  document.addEventListener("keydown", e=>{ if(e.key==="Escape") lb.classList.remove("open"); });
})();

(function(){
  const l=document.getElementById('mk-ilist'), o=document.getElementById('mk-i-open'), c=document.getElementById('mk-i-close');
  if(!l||!o||!c) return;
  o.addEventListener('click',()=>l.querySelectorAll('details').forEach(d=>d.open=true));
  c.addEventListener('click',()=>l.querySelectorAll('details').forEach(d=>d.open=false));
})();

(function(){
  const img=document.getElementById('mk-map-img'), lb=document.getElementById('rg-lightbox');
  if(!img||!lb) return;
  img.addEventListener('click',()=>{ lb.querySelector('img').src=img.src; lb.classList.add('open'); });
})();

/* ================= SAINTS : recherche ================= */
(function(){
  const root=document.getElementById('sec-saints'); if(!root) return;
  const input=document.getElementById('saintsSearch'), empty=document.getElementById('saintsEmpty');
  const months=[...root.querySelectorAll('.saints-month')];
  const norm=t=>t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  input.addEventListener('input',()=>{
    const q=norm(input.value.trim()); let any=false;
    months.forEach(d=>{
      let n=0;
      d.querySelectorAll('.saint-row').forEach(r=>{
        const ok=!q||norm(r.textContent).includes(q);
        r.style.display=ok?'':'none'; if(ok) n++;
      });
      d.style.display=n?'':'none';
      if(q&&n) d.open=true;
      if(!q) d.open=false;
      d.querySelector('.saints-count').textContent=n;
      if(n) any=true;
    });
    empty.style.display=any?'none':'block';
  });
})();

/* Frises Histoire et Fêtes */
(function(){
  const PERIODS=[["VIIe–IXe siècles","Fondation de l’État et puissance militaire","Les Proto-Bulgares, cavaliers des steppes, s’allient aux Slaves des Balkans : après les combats de 680-681, Byzance reconnaît le nouvel État, dont Pliska est la première capitale. Sous Krum (803-814), il devient une puissance militaire."],["IXe–XIe siècles","Christianisation, Âge d’or et résistance à Byzance","Boris Ier christianise la Bulgarie ; sous Siméon Ier le Grand (893-927), le Premier Empire connaît son Âge d’or. Puis le tsar Samuel résiste à Byzance jusqu’à la conquête byzantine de 1018."],["XIIe–XIVe siècles","Le Second Empire bulgare","En 1185, Asen et Petar restaurent l’État bulgare. Kaloyan puis Ivan Asen II (Klokotnitsa, 1230) font de la Bulgarie la puissance dominante des Balkans ; Tarnovo en est la capitale."],["Fin XIVe–XVIe siècle","Chute de Tarnovo et domination ottomane","Tarnovo tombe en 1393 ; à la fin du XIVe siècle, les États bulgares passent sous domination ottomane. Princes, prêtres et martyrs entretiennent pourtant la mémoire de la Bulgarie indépendante."],["XVIIe–XVIIIe siècles","Soulèvements et martyrs de la période ottomane","À la faveur des guerres entre l’Empire ottoman et les puissances chrétiennes, des soulèvements éclatent (Chiprovtsi en 1688, Karposh en 1689) ; l’Église conserve la mémoire de ses martyrs."],["XVIIIe–XIXe siècles","Renaissance nationale","La langue, l’éducation, la culture, l’Église et la conscience nationale passent au premier plan : Paisius de Hilendar, Rakovski, Vasil Levski (exécuté en 1873), Hristo Botev, Benkovski et l’insurrection d’Avril (1876), suivie des massacres de Batak et de Novo Selo dont les victimes sont canonisées en 2011."],["1877–1908","Libération, Unification, Indépendance","La guerre russo-ottomane (1877–1878 : Plevna, Chipka, prise de Sofia) libère une grande partie des terres bulgares. Traité préliminaire de San Stefano (3 mars 1878), traité de Berlin (13 juillet 1878), Unification (1885), indépendance complète (1908) : la Bulgarie moderne prend forme."],["XXe siècle","XXe siècle et fin du communisme","Après la Seconde Guerre mondiale, la Bulgarie devient un État communiste ; le 10 novembre 1989 ouvre la transition vers la démocratie, puis viennent l’OTAN (2004) et l’Union européenne (2007)."]];
  const sc=(el,block)=>el&&el.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth",block:block||"center"});
  const frh=document.getElementById("bg-frh"), fhp=document.getElementById("bg-fhp");
  if(frh&&fhp){
    const esc=t=>String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;");
    frh.innerHTML=PERIODS.map((p,i)=>'<button type="button" class="fh'+(i===0?" on":"")+'" data-p="'+i+'" aria-pressed="'+(i===0)+'"><small>'+esc(p[0])+'</small><b>'+esc(p[1])+'</b></button>').join("");
    const pick=i=>{ const p=PERIODS[i];
      frh.querySelectorAll(".fh").forEach((b,k)=>{ b.classList.toggle("on",k===i); b.setAttribute("aria-pressed",k===i); });
      fhp.innerHTML='<span class="tl-date">'+esc(p[0])+'</span><h3>'+esc(p[1])+'</h3><p>'+esc(p[2])+'</p>'; };
    pick(0);
    frh.addEventListener("click",e=>{ const b=e.target.closest(".fh"); if(b) pick(+b.dataset.p); });
  }
  const hera=document.getElementById("bg-hera");
  if(hera) hera.addEventListener("click",e=>{ const b=e.target.closest(".chip"); if(b) sc(document.getElementById("bg-hera-"+b.dataset.e),"start"); });
  const flash=el=>{ if(!el) return; sc(el); el.classList.add("hl"); setTimeout(()=>el.classList.remove("hl"),1600); };
  const yr=document.getElementById("bg-yr");
  if(yr) yr.addEventListener("click",e=>{ const b=e.target.closest("[data-m]"); if(!b||b.disabled) return; flash(document.querySelector('#bg-holtl .tl-item[data-m="'+b.dataset.m+'"]')); });
  const mob=document.getElementById("bg-holmob");
  if(mob) mob.addEventListener("click",e=>{ const b=e.target.closest("[data-id]"); if(b) flash(document.getElementById(b.dataset.id)); });
})();

/* ================= CHAPITRE DU JOUR ================= */
(function(){
  const sec=document.getElementById('sec-chapitre'); if(!sec) return;
  const card=document.getElementById('cdj-card');
  const navBtn=document.querySelector('#nav button[data-target="chapitre"]');
  let flat=null, randPool=null, cur=-1, ready=false, starts=[], books=[];
  const bookSel=document.getElementById('cdj-book'), chapSel=document.getElementById('cdj-chap-sel');

  function load(){
    if(flat) return true;
    try{
      const data=JSON.parse(document.getElementById('bible-data').textContent);
      flat=[]; randPool=[]; starts=[]; books=data;
      data.forEach((b,bi)=>{ starts[bi]=flat.length; b.c.forEach(ch=>{
        flat.push({bi:bi, book:b.n, nt:b.nt, num:ch[0], text:ch[1], bad:!!ch[2], single:b.s});
        if(!ch[2]) randPool.push(flat.length-1);
      }); });
      starts.push(flat.length);
      const GOSP=['Matthieu','Marc','Luc','Jean'];
      const og=[['★ Évangiles',b=>GOSP.indexOf(b.n)>-1],['Ancien Testament',b=>!b.nt],['Reste du Nouveau Testament',b=>b.nt&&GOSP.indexOf(b.n)<0]];
      og.forEach(g=>{ const o=document.createElement('optgroup'); o.label=g[0]; if(g[0].charAt(0)==='★') o.className='cdj-gosp';
        data.forEach((b,bi)=>{ if(g[1](b)){ const op=document.createElement('option'); op.value=bi; op.textContent=b.n; o.appendChild(op); } });
        bookSel.appendChild(o); });
      return true;
    }catch(e){ card.innerHTML='<div class="cdj-loading">Impossible de charger le texte.</div>'; return false; }
  }
  const label=c=>c.book+' '+c.num;

  function show(i,scroll){
    const c=flat[i]; cur=i;
    card.textContent='';
    const head=document.createElement('div'); head.className='cdj-head';
    const t=document.createElement('span'); t.className='cdj-testament'; t.textContent=c.nt?'Nouveau Testament':'Ancien Testament';
    const b=document.createElement('p'); b.className='cdj-book'; b.textContent=c.book;
    const h=document.createElement('h3'); h.className='cdj-chap'; h.textContent=(c.single?'Psaume ':'Chapitre ')+c.num;
    head.append(t,b,h); card.appendChild(head);
    if(c.bad){
      const w=document.createElement('div'); w.className='cdj-warn';
      w.textContent='Ce chapitre est mal reconnu dans le texte source (versets mélangés ou incomplets) : la lecture peut être confuse.';
      card.appendChild(w);
    }
    const box=document.createElement('div'); box.className='cdj-text';
    c.text.split('\n').forEach(line=>{
      line=line.trim(); if(!line) return;
      const p=document.createElement('p');
      const m=!c.bad && line.match(/^(\d+)\.\s*(.*)$/);
      if(m){ const v=document.createElement('span'); v.className='cdj-v'; v.textContent=m[1]; p.append(v,document.createTextNode(m[2])); }
      else p.textContent=line;
      box.appendChild(p);
    });
    card.appendChild(box);
    bookSel.value=c.bi;
    if(chapSel.dataset.bi!==String(c.bi)){
      chapSel.textContent='';
      for(let k=starts[c.bi];k<starts[c.bi+1];k++){ const op=document.createElement('option'); op.value=k; op.textContent=(flat[k].single?'Psaume ':'')+flat[k].num; chapSel.appendChild(op); }
      chapSel.dataset.bi=c.bi;
    }
    chapSel.value=i;
    sec.querySelectorAll('.cdj-prev').forEach(x=>{ x.disabled=i<=0; x.querySelector('small').textContent=i>0?label(flat[i-1]):''; });
    sec.querySelectorAll('.cdj-next').forEach(x=>{ x.disabled=i>=flat.length-1; x.querySelector('small').textContent=i<flat.length-1?label(flat[i+1]):''; });
    if(scroll){
      const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
      card.scrollIntoView({behavior:rm?'auto':'smooth',block:'start'});
    }
  }
  function random(scroll){
    let i; do{ i=randPool[Math.floor(Math.random()*randPool.length)]; }while(randPool.length>1 && i===cur);
    show(i,scroll);
  }
  function init(){ if(ready) return; if(!load()) return; ready=true; random(false); }

  sec.querySelectorAll('.cdj-prev').forEach(x=>x.addEventListener('click',()=>{ if(cur>0) show(cur-1,true); }));
  sec.querySelectorAll('.cdj-next').forEach(x=>x.addEventListener('click',()=>{ if(cur<flat.length-1) show(cur+1,true); }));
  sec.querySelectorAll('.cdj-rand').forEach(x=>x.addEventListener('click',()=>{ if(ready) random(true); }));
  bookSel.addEventListener('change',()=>{ if(ready) show(starts[+bookSel.value],true); });
  chapSel.addEventListener('change',()=>{ if(ready) show(+chapSel.value,true); });
  if(navBtn) navBtn.addEventListener('click',init);
  if(sec.classList.contains('active')) init();

  /* Flèches du clavier */
  document.addEventListener('keydown',e=>{
    if(!sec.classList.contains('active')||!ready) return;
    if(/INPUT|TEXTAREA|SELECT/.test((e.target.tagName||''))) return;
    if(e.key==='ArrowLeft'&&cur>0) show(cur-1,true);
    if(e.key==='ArrowRight'&&cur<flat.length-1) show(cur+1,true);
  });

  /* Taille du texte */
  const KEY='cdj-fs'; let fs=1.1;
  try{ const s=parseFloat(localStorage.getItem(KEY)); if(s>=0.9&&s<=1.7) fs=s; }catch(e){}
  const applyFs=()=>{ sec.style.setProperty('--cdj-fs',fs.toFixed(2)+'rem'); try{ localStorage.setItem(KEY,fs); }catch(e){} };
  applyFs();
  document.getElementById('cdj-fs-down').addEventListener('click',()=>{ fs=Math.max(0.9,fs-0.1); applyFs(); });
  document.getElementById('cdj-fs-up').addEventListener('click',()=>{ fs=Math.min(1.7,fs+0.1); applyFs(); });
})();
