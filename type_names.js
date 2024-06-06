function showRightTypeIcon(typeName, typediv) {
    const typeIcons = {
        "grass": "./img/pokemon-icons/grass.png",
        "water": "./img/pokemon-icons/water.png",
        "poison": "./img/pokemon-icons/poison.png",
        "fire": "./img/pokemon-icons/fire.png",
        "flying": "./img/pokemon-icons/flying.png",
        "bug": "./img/pokemon-icons/bug.png",
        "normal": "./img/pokemon-icons/normal.png",
        "electric": "./img/pokemon-icons/electric.png",
        "ground": "./img/pokemon-icons/ground.png",
        "fairy": "./img/pokemon-icons/fairy.png",
        "fighting": "./img/pokemon-icons/fighting.png",
        "psychic": "./img/pokemon-icons/psychic.png",
        "rock": "./img/pokemon-icons/rock.png",
        "steel": "./img/pokemon-icons/steel.png",
        "ghost": "./img/pokemon-icons/ghost.png",
        "ice": "./img/pokemon-icons/ice.png",
        "dragon": "./img/pokemon-icons/dragon.png",
        "dark": "./img/pokemon-icons/dark.png",
    };

    whichRightTypeIcon(typeIcons, typeName, typediv);
}

function whichRightTypeIcon(typeIcons, typeName, typediv) {

    if (typeIcons.hasOwnProperty(typeName)) {
        let typeIcon = document.createElement("img");
        typeIcon.src = typeIcons[typeName];
        typeIcon.alt = `${typeName}-icon`;
        typeIcon.classList.add("pokemon-type-icon");
        return typediv.appendChild(typeIcon);
    }
}