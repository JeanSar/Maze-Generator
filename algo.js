
// On utilise ici l'algorithme de Prim "randomizé", un algorithme pour trouver un arbre couvrant de poids minimal 
// https://en.wikipedia.org/wiki/Prim%27s_algorithm
// https://en.wikipedia.org/wiki/Maze_generation_algorithm

// ce code a été réalisé par Jean Saury (jean sar) 

//on initialise une map de 40x40
let map = new Array(40);

for(let i = 0; i < map.length; i++) {
  map[i] = new Array(40);
}

function fillMap(map) {
	//on remplit la map de murs (de 0)
	for(let i = 0; i < map.length; i++) {
    for(let j = 0; j < map.length; j++) {
      map[i][j] = 0;
    }
  }
  return map;
}

function printMap(map) {
	//retourne une représentation en String de la map
	let aff = String("<pre>");
	for(let i = 0; i < map.length; i++) {
    for(let j = 0; j < map[0].length; j++) {
      if(map[i][j] === 0) {
        aff += "██";
      }
      else {
        aff += "  ";
      }
    }
    aff += "\n";
  }
  aff += "</pre>";
  return aff
}

function mazeGeneration(map) {

	// On génère ici le labyrinthe en "creusant" dans le tableau map remplis de 0 (de mur) 

  let size = map.length - 1;
  
  // retourne un entier aléatoire entre 1 et 28 (et non 0 et 29 car on souhaite que le labyrinthe soit entouré de mur
  
  let x = Math.floor(Math.random() * (size - 1)) + 1; 
	map[x][size] = 1;
	
	// seul le x est aléatoire car on souhaite avoir une sortie a droite (le repère orthnormée est inversée symétriquement par rapport a l'origine)
	// démarre l'algorithme a partir de ce point 
	let y = size-1;
	console.log(x, y);
	
	map[x][y] = 1;
	
	// On crée un objet Wall contenant les coordonnées du mur (x,y) et les coordonnées de son "parent", autrement dit une zone vide
  class Wall {
    constructor(coord, parent) {
      this.coord = coord;
      this.parent = parent;
    }
  }

	let walls = []; //liste des murs
	
	//On dipose les murs autour de la première coordonnée non-mur
	
	if(x !== 1) {
  	walls.push(new Wall([ x - 1, y ], [ x, y ] ));
  }
  if(x !== (size - 1)){
    walls.push(new Wall([ x + 1, y ], [ x, y ] ));
  }
  
  if(y !== 1) {
    walls.push(new Wall([ x, y - 1 ], [ x, y ] ));
  }
  if(y !== (size - 1)){
  	walls.push(new Wall([ x, y + 1 ], [ x, y ] ));
  }
  
  
	//variables pour stocker les valeurs d'un mur selectionné dans a liste
  let selW, wx, wy, px, py;
  
  let cptr = 0; // compteur de tour

  while(walls.length > 0){ // tant qu'il reste des coordonnées a traiter (des murs avec des parents)
  
  	cptr++;
  	if(cptr >= 100000){ // test si on execute pas trop de tours (pour empecher une boucle trop longue)
  		console.log("CODE STOPPED : TOO MANY LOOPS");
  		break;
  	}	
  	
    let selW = Math.floor(Math.random() * walls.length); // on séléctionne aléatoirement un mur dans la liste
    wx = walls[selW].coord[0]; //coordonnées d'un mur aleatoire
    wy = walls[selW].coord[1];

    px = walls[selW].parent[0]; //coordonnées du passage parents
    py = walls[selW].parent[1];

    let cond = true; 
	
		// ici on teste si le mur sépare deux zone vides (la zone parente et la zone adjacente), 
		// si ce n'est pas le cas on pourra transformer le mur en nouveau passage (zone vide === 1)
		// et on le sort de la liste en ajoutant tout les nouveaux murs créé,
		// sinon on le sort simplement de la liste
		// on doit prendre ici tout les cas de figures (cas sortant de la zone de génération)
		
    if(py === wy) { 
      if(px > wx && wx !== 1){
        if(wy !== size-1) {
          if(map[wx-1][wy+1] === 1)
            cond = false;
        }
        if(wy !== 1) {
          if(map[wx-1][wy-1] === 1)
            cond = false;
        }
      }
      else if(wx !== size-1){
        if(wy !== size-1) {
          if(map[wx+1][wy+1] === 1)
            cond = false;
        }
        if(wy !== 1) {
          if(map[wx+1][wy-1] === 1)
            cond = false;
        }
      }
    }
    else {
      if(py > wy && wy !== 1){
        if(wx !== size-1) {
          if(map[wx+1][wy-1] === 1)
            cond = false;
        }
        if(wx !== 1) {
          if(map[wx-1][wy-1] === 1)
            cond = false;
        }
      }
      else if(wy !== size-1) {
        if(wx !== size-1) {
          if(map[wx+1][wy+1] === 1)
            cond = false;
        }
        if(wx !== 1) {
          if(map[wx-1][wy+1] === 1)
            cond = false;
        }
      }
    }


    if(wx !== 1) {
      if(map[wx-1][wy] === 1 && (wx-1 !== px || wy !== py))
        cond = false;
    }
    if(wx !== (size - 1)){
      if(map[wx+1][wy] === 1 && (wx+1 !== px || wy !== py))
        cond = false;
    }
    if(wy !== 1) {
      if(map[wx][wy-1] === 1 && (wx !== px || wy-1 !== py))
        cond = false;
    }
    if(wy !== (size - 1)){
      if(map[wx][wy+1] === 1 && (wx !== px || wy+1 !== py))
        cond = false;
    }


    if(cond) { // si la zone adjacente (ou fille) n'est pas vide (donc un mur)
    	map[wx][wy] = 1; // on ajoute le nouveau passage avec tout les murs a ajouter a la liste

      if(wx !== 1) {
        if(map[wx-1][wy] !== 1) {
          walls.push(new Wall([ wx - 1, wy ], [ wx, wy ]));
        }
      }
      if(wx !== (size - 1)){
        if(map[wx+1][wy] !== 1){
          walls.push(new Wall([ wx + 1, wy ], [ wx, wy ]));
        }
      }
      if(wy !== 1) {
        if(map[wx][wy-1] !== 1) {
          walls.push(new Wall([ wx, wy - 1 ], [ wx, wy ]));
        }
      }
      if(wy !== (size - 1)){
        if(map[wx][wy+1] !== 1) {
          walls.push(new Wall([ wx, wy + 1 ], [ wx, wy ]));
        }
      }
    }
    walls.splice(selW,1); // dans tout les cas on supprime l'objet sélectionné de la liste
  }
  console.log(walls);
	
	let sx = 1;
	let sy = 1;
	while(map[sx][sy] === 0){ // on trouve l'entrée du labyrinthe en prenant la première zone vide trouvé a gauche 	
		sx++;
	}
	
	map[sx][sy -1] = 1; // on place l'entrée 
  return map;
}

map = fillMap(map);
map = mazeGeneration(map);
console.log(map);
let aff = printMap(map);
document.getElementById('demo').innerHTML = aff;
